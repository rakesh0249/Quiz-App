import { useEffect, useRef, useState } from 'react';
import Question from './Question.jsx';

const TIME_LIMIT = 15;

export default function Quiz({ questions, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: selectedIndex }
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [streak, setStreak] = useState(0);
  const startedAtRef = useRef(Date.now());

  const current = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  // Per-question countdown; auto-advance when it hits zero.
  useEffect(() => {
    setTimeLeft(TIME_LIMIT);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          goNext(answers[current.id] ?? null, { fromTimeout: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  function handleSelect(optionIndex) {
    setAnswers((prev) => ({ ...prev, [current.id]: optionIndex }));
  }

  function goNext(forcedSelection, { fromTimeout } = {}) {
    const selected = forcedSelection !== undefined ? forcedSelection : answers[current.id] ?? null;

    // Streak is a lightweight, client-side "vibe" indicator only — the
    // authoritative score always comes back from the server on submit.
    if (selected !== null && !fromTimeout) {
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }

    if (isLast) {
      const elapsedSeconds = Math.round((Date.now() - startedAtRef.current) / 1000);
      const finalAnswers = questions.map((q) => ({
        id: q.id,
        selectedIndex: q.id === current.id ? selected : answers[q.id] ?? null
      }));
      onFinish({ answers: finalAnswers, elapsedSeconds });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  const selectedIndex = answers[current.id] ?? null;
  const progressPercent = ((currentIndex + (selectedIndex !== null ? 0.5 : 0)) / questions.length) * 100;

  return (
    <div className="panel quiz-panel">
      <div className="progress-row">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className={`streak-badge ${streak > 0 ? 'streak-badge--hot' : ''}`}>
          <span aria-hidden="true">{streak > 2 ? '🔥' : '⚡'}</span> {streak} streak
        </div>
      </div>

      <Question
        question={current}
        index={currentIndex}
        total={questions.length}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
        timeLeft={timeLeft}
        timeLimit={TIME_LIMIT}
      />

      <div className="quiz-actions">
        <button
          type="button"
          className="btn-primary"
          disabled={selectedIndex === null}
          onClick={() => goNext(selectedIndex)}
        >
          {isLast ? 'Finish quiz' : 'Next question'}
        </button>
      </div>
    </div>
  );
}
