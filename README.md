# Writing Style Rules

A repository for managing forbidden words and phrases in Chinese writing — expressions that sound too AI-generated or clichéd.

## What's Inside

- **rules.md** — The source-of-truth list of banned phrases (禁用語句)
- **rules-app/** — A full-stack web app for managing the rules list through a UI

## Rules App

A FastAPI + React/Vite application that lets you check, add, and remove rules via a browser interface.

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

The backend reads and writes directly to `rules.md` at the repo root.
