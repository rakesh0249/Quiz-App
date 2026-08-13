const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

const QUESTIONS_PATH = path.join(__dirname, 'data', 'questions.json');
const SCORES_PATH = path.join(__dirname, 'data', 'scores.json');

if (!fs.existsSync(SCORES_PATH)) {
  fs.writeFileSync(SCORES_PATH, '[]', 'utf-8');
}

function loadQuestions() {
  return JSON.parse(fs.readFileSync(QUESTIONS_PATH, 'utf-8'));
}

function loadScores() {
  return JSON.parse(fs.readFileSync(SCORES_PATH, 'utf-8'));
}

function saveScores(scores) {
  fs.writeFileSync(SCORES_PATH, JSON.stringify(scores, null, 2), 'utf-8');
}

app.use(cors());
app.use(express.json());

// GET /api/questions - public shape only, never leak answerIndex
app.get('/api/questions', (req, res) => {
  const questions = loadQuestions();
  const publicQuestions = questions.map(({ id, category, question, options, difficulty }) => ({
    id,
    category,
    question,
    options,
    difficulty
  }));
  res.json(publicQuestions);
});

// POST /api/submit
// body: { name?: string, answers: [{ id: number, selectedIndex: number }], elapsedSeconds?: number }
app.post('/api/submit', (req, res) => {
  const { name, answers, elapsedSeconds } = req.body || {};

  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: 'answers must be an array' });
  }

  const questions = loadQuestions();
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  let correctCount = 0;
  const breakdown = answers.map(({ id, selectedIndex }) => {
    const q = questionMap.get(id);
    if (!q) {
      return { id, valid: false };
    }
    const isCorrect = q.answerIndex === selectedIndex;
    if (isCorrect) correctCount += 1;
    return {
      id,
      question: q.question,
      selectedIndex,
      correctIndex: q.answerIndex,
      isCorrect
    };
  });

  const total = questions.length;
  const score = correctCount;
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  const result = {
    score,
    total,
    percent,
    elapsedSeconds: elapsedSeconds ?? null,
    breakdown
  };

  if (name && typeof name === 'string' && name.trim().length > 0) {
    const scores = loadScores();
    scores.push({
      name: name.trim().slice(0, 24),
      score,
      total,
      percent,
      elapsedSeconds: elapsedSeconds ?? null,
      submittedAt: new Date().toISOString()
    });
    saveScores(scores);
  }

  res.json(result);
});

// GET /api/leaderboard - top 10, highest score first, faster time breaks ties
app.get('/api/leaderboard', (req, res) => {
  const scores = loadScores();
  const sorted = [...scores]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aTime = a.elapsedSeconds ?? Infinity;
      const bTime = b.elapsedSeconds ?? Infinity;
      return aTime - bTime;
    })
    .slice(0, 10);
  res.json(sorted);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Quiz API listening on http://localhost:${PORT}`);
});
