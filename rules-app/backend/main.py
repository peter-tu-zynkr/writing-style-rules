from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

RULES_PATH = Path(__file__).parent.parent.parent / "rules.md"


class RuleBody(BaseModel):
    rule: str


def read_rules() -> str:
    return RULES_PATH.read_text(encoding="utf-8")


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
    rule_lower = body.rule.strip().lower()
    for bullet in bullets:
        if rule_lower in bullet.lower() or bullet.lower() in rule_lower:
            return {"status": "exists", "message": "This rule already exists."}
    return {"status": "new", "proposal": f"- {body.rule.strip()}"}


@app.post("/api/add")
def add_rule(body: RuleBody):
    before = read_rules()
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
    new_line = f"- {body.rule.strip()}"
    if insert_at is not None:
        lines.insert(insert_at, new_line)
    else:
        lines.append(new_line)
    after = "\n".join(lines) + "\n"
    RULES_PATH.write_text(after, encoding="utf-8")
    return {"before": before, "after": after}


@app.post("/api/remove")
def remove_rule(body: RuleBody):
    before = read_rules()
    rule_lower = body.rule.strip().lower()
    lines = before.splitlines()
    new_lines = []
    removed = False
    for line in lines:
        if not removed and line.startswith("- ") and rule_lower in line[2:].strip().lower():
            removed = True
            continue
        new_lines.append(line)
    if not removed:
        return {"status": "not_found", "message": "找不到此規則。"}
    after = "\n".join(new_lines) + "\n"
    RULES_PATH.write_text(after, encoding="utf-8")
    return {"before": before, "after": after}
