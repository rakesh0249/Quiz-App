const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed (${res.status}): ${text}`);
  }
  return res.json();
}

export function fetchQuestions() {
  return request('/questions');
}

export function submitQuiz({ name, answers, elapsedSeconds }) {
  return request('/submit', {
    method: 'POST',
    body: JSON.stringify({ name, answers, elapsedSeconds })
  });
}

export function fetchLeaderboard() {
  return request('/leaderboard');
}
