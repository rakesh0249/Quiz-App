import { useState } from 'react';

export default function StartScreen({ onStart, loading, error }) {
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onStart(name.trim());
  }

  return (
    <div className="panel start-panel">
      <p className="eyebrow">10 questions · no takebacks</p>
      <h1 className="display-title">
        Bolt <span className="accent">Trivia</span>
      </h1>
      <p className="subtitle">
        Answer fast, keep your streak alive, and see how you stack up on the leaderboard.
      </p>
      <form onSubmit={handleSubmit} className="start-form">
        <label htmlFor="player-name">Your name</label>
        <input
          id="player-name"
          type="text"
          placeholder="e.g. Priya"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
          autoFocus
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Loading questions…' : 'Start quiz'}
        </button>
        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
}
