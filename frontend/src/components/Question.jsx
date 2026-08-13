const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function Question({ question, index, total, selectedIndex, onSelect, timeLeft, timeLimit }) {
  const ringPercent = Math.max(0, timeLeft / timeLimit) * 100;

  return (
    <div className="question-card">
      <div className="question-head">
        <span className="eyebrow">
          Question {index + 1} / {total} · {question.category}
        </span>
        <div
          className={`timer-ring ${timeLeft <= 5 ? 'timer-ring--urgent' : ''}`}
          style={{ '--ring-percent': `${ringPercent}%` }}
        >
          <span>{timeLeft}</span>
        </div>
      </div>
      <h2 className="question-text">{question.question}</h2>
      <div className="options-grid">
        {question.options.map((option, i) => {
          const isSelected = selectedIndex === i;
          return (
            <button
              key={i}
              type="button"
              className={`option-btn ${isSelected ? 'option-btn--selected' : ''}`}
              onClick={() => onSelect(i)}
            >
              <span className="option-label">{OPTION_LABELS[i]}</span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
