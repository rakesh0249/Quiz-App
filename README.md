# Bolt Trivia — Fullstack Quiz App

A fullstack trivia quiz app: **React (Vite)** frontend + **Node/Express** backend.

```
quiz-app/
├── backend/          Express API (questions, scoring, leaderboard)
│   ├── data/
│   │   ├── questions.json   10 trivia questions (answers live only here)
│   │   └── scores.json      leaderboard storage (auto-created)
│   ├── server.js
│   └── package.json
└── frontend/         React + Vite single-page app
    ├── src/
    │   ├── components/
    │   │   ├── StartScreen.jsx
    │   │   ├── Quiz.jsx
    │   │   ├── Question.jsx
    │   │   └── Result.jsx
    │   ├── api.js
    │   ├── App.jsx
    │   └── App.css
    └── package.json
```

## Why this shape

- **Answers never reach the browser** until you submit. `GET /api/questions`
  strips `answerIndex`; scoring happens server-side in `POST /api/submit`.
- **Leaderboard** is a flat JSON file (`backend/data/scores.json`) — enough
  for a demo/take-home project. Swap in a real database by replacing the
  three `loadScores`/`saveScores` functions in `server.js`.
- **Per-question 15s timer**, a streak indicator, and a results breakdown
  with a live leaderboard are all wired end-to-end.

## Run it locally

You'll need Node.js 18+.

**1. Start the backend** (default port 4000):

```bash
cd backend
npm install
npm start
```

**2. Start the frontend** (default port 5173), in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** — the Vite dev server proxies `/api/*` calls
to the backend automatically (see `frontend/vite.config.js`).

## API reference

| Method | Route              | Body                                                        | Returns                                  |
|--------|---------------------|---------------------------------------------------------------|-------------------------------------------|
| GET    | `/api/questions`    | —                                                              | Questions without correct answers         |
| POST   | `/api/submit`       | `{ name?, answers: [{id, selectedIndex}], elapsedSeconds? }` | `{ score, total, percent, breakdown }`    |
| GET    | `/api/leaderboard`  | —                                                              | Top 10 scores                             |
| GET    | `/api/health`       | —                                                              | `{ status: "ok" }`                        |

## Extending it

- Add more questions in `backend/data/questions.json` — no other code
  changes needed.
- Add categories/difficulty filters by adding query params to
  `GET /api/questions`.
- Swap `scores.json` for SQLite/Postgres once you need real persistence
  or multiple concurrent instances.
- Deploy the backend anywhere Node runs (Render, Railway, Fly.io) and the
  frontend as a static build (`npm run build` in `frontend/`) on
  Vercel/Netlify — just point `vite.config.js`'s proxy (dev only) or an
  env-based `BASE` URL in `src/api.js` at your deployed backend.
