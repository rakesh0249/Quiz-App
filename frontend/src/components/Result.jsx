import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../api.js';

function scoreMessage(percent) {
  if (percent === 100) return 'Perfect run. Nothing gets past you.';
  if (percent >= 70) return 'Strong showing — you know your stuff.';
  if (percent >= 40) return 'Decent effort. A rematch could help.';
  return 'Rough round. The leaderboard awaits your revenge.';
}

export default function Result({ result, playerName, onRestart }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardError, setLeaderboardError] = useState(null);

  useEffect(() => {
    fetchLeaderboard()
      .then(setLeaderboard)
      .catch(() => setLeaderboardError('Could not load the leaderboard right now.'));
  }, []);

  return (
    <div className="panel result-panel">
      <p className="eyebrow">Results</p>
      <h1 className="display-title">
        {result.score}/{result.total}
        <span className="accent"> · {result.percent}%</span>
      </h1>
      <p className="subtitle">{scoreMessage(result.percent)}</p>

      <div className="breakdown">
        {result.breakdown.map((item, i) => (
          <div key={item.id ?? i} className={`breakdown-row ${item.isCorrect ? 'is-correct' : 'is-wrong'}`}>
            <span className="breakdown-icon" aria-hidden="true">
              {item.isCorrect ? '✓' : '✕'}
            </span>
            <span className="breakdown-question">{item.question}</span>
          </div>
        ))}
      </div>

      <div className="result-actions">
        <button type="button" className="btn-primary" onClick={onRestart}>
          Play again
        </button>
      </div>

      <div className="leaderboard">
        <h2>Leaderboard</h2>
        {leaderboardError && <p className="error-text">{leaderboardError}</p>}
        {!leaderboardError && leaderboard.length === 0 && (
          <p className="subtitle">No scores yet — {playerName || 'you'} could be first.</p>
        )}
        {leaderboard.length > 0 && (
          <ol>
            {leaderboard.map((entry, i) => (
              <li key={i} className={entry.name === playerName ? 'is-you' : ''}>
                <span className="rank">#{i + 1}</span>
                <span className="entry-name">{entry.name}</span>
                <span className="entry-score">{entry.score}/{entry.total}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
