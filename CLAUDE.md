# CLAUDE.md

## Repository Overview

This is a **writing style rules** repository. It stores and manages a list of forbidden
words and phrases to avoid in Chinese writing (AI-sounding or clichéd expressions).

## Files

- `rules.md` — The source-of-truth list of forbidden phrases (禁用語句)
- `rules-app/` — A full-stack web app (FastAPI backend + React/Vite frontend) for
  managing `rules.md` via a UI (check, add, remove rules)

## Running the App

**Backend** (from `rules-app/backend/`):
```
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend** (from `rules-app/frontend/`):
```
npm install
npm run dev
```

The backend reads/writes directly to `rules.md` at the repo root.
