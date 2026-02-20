import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

_origins_env = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173")
ALLOWED_ORIGINS = [o.strip() for o in _origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

_rules_env = os.environ.get("RULES_FILE", "")
RULES_PATH = Path(_rules_env) if _rules_env else Path(__file__).parent.parent.parent / "rules.md"


class RuleBody(BaseModel):
    rule: str


def normalize(text: str) -> str:
    """Normalize ellipsis variants so … and ... match each other."""
    return text.replace("…", "...").replace("\u2026", "...")


_DEFAULT_RULES = """\
# 寫作規則 — 禁用詞彙與語句

這些是應避免使用的詞彙與語句，因為它們聽起來過於 AI 腔調或陳腔濫調。

## 禁用語句

"""

def read_rules() -> str:
    if not RULES_PATH.exists():
        RULES_PATH.parent.mkdir(parents=True, exist_ok=True)
        RULES_PATH.write_text(_DEFAULT_RULES, encoding="utf-8")
    return RULES_PATH.read_text(encoding="utf-8")


def sort_section(lines: list[str]) -> list[str]:
    """Re-order bullet lines within ## 禁用語句 by length asc, then Unicode for ties.
    Reconstructs the section cleanly: heading + blank line + sorted bullets + blank line."""
    result = []
    in_section = False
    bullet_buf = []

    for line in lines:
        if line.strip() == "## 禁用語句":
            in_section = True
            result.append(line)
            continue
        if in_section:
            if line.startswith("## "):
                # flush sorted bullets, then continue to next section
                result.append("")
                bullet_buf.sort(key=lambda l: (len(l), l))
                result.extend(bullet_buf)
                bullet_buf = []
                in_section = False
                result.append("")
                result.append(line)
                continue
            if line.startswith("- "):
                bullet_buf.append(line)
            # skip blank lines and any non-bullet content within the section
            continue
        result.append(line)

    if bullet_buf:
        result.append("")
        bullet_buf.sort(key=lambda l: (len(l), l))
        result.extend(bullet_buf)

    return result


def extract_bullets(content: str) -> list[str]:
    bullets = []
    in_section = False
    for line in content.splitlines():
        if line.strip() == "## 禁用語句":
            in_section = True
            continue
        if in_section:
            if line.startswith("## "):
                break
            if line.startswith("- "):
                bullets.append(line[2:].strip())
    return bullets


@app.get("/api/rules")
def get_rules():
    return {"content": read_rules()}


@app.post("/api/check")
def check_rule(body: RuleBody):
    content = read_rules()
    bullets = extract_bullets(content)
    rule_lower = normalize(body.rule.strip().lower())
    for bullet in bullets:
        bullet_lower = normalize(bullet.lower())
        if rule_lower in bullet_lower or bullet_lower in rule_lower:
            return {"status": "exists", "message": "This rule already exists."}
    return {"status": "new", "proposal": f"- {body.rule.strip()}"}


@app.post("/api/add")
def add_rule(body: RuleBody):
    before = read_rules()
    bullets = extract_bullets(before)
    for entry in body.rule.splitlines():
        entry_lower = normalize(entry.strip().lower())
        if not entry_lower:
            continue
        for bullet in bullets:
            bullet_lower = normalize(bullet.lower())
            if entry_lower in bullet_lower or bullet_lower in entry_lower:
                return {"status": "exists", "message": f"「{entry.strip()}」已存在。"}
    lines = before.splitlines()
    insert_at = None
    in_section = False
    for i, line in enumerate(lines):
        if line.strip() == "## 禁用語句":
            in_section = True
            continue
        if in_section:
            if line.startswith("## "):
                insert_at = i
                break
    new_lines_to_add = [
        f"- {entry.strip()}"
        for entry in body.rule.splitlines()
        if entry.strip()
    ]
    if insert_at is not None:
        for i, new_line in enumerate(new_lines_to_add):
            lines.insert(insert_at + i, new_line)
    else:
        lines.extend(new_lines_to_add)
    after = "\n".join(sort_section(lines)) + "\n"
    RULES_PATH.write_text(after, encoding="utf-8")
    return {"before": before, "after": after}


@app.post("/api/remove")
def remove_rule(body: RuleBody):
    before = read_rules()
    rule_lower = normalize(body.rule.strip().lower())
    lines = before.splitlines()
    new_lines = []
    removed = False
    for line in lines:
        if not removed and line.startswith("- ") and rule_lower in normalize(line[2:].strip().lower()):
            removed = True
            continue
        new_lines.append(line)
    if not removed:
        return {"status": "not_found", "message": "找不到此規則。"}
    after = "\n".join(sort_section(new_lines)) + "\n"
    RULES_PATH.write_text(after, encoding="utf-8")
    return {"before": before, "after": after}
