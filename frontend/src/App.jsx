import { useState } from 'react';
import StartScreen from './components/StartScreen.jsx';
import Quiz from './components/Quiz.jsx';
import Result from './components/Result.jsx';
import { fetchQuestions, submitQuiz } from './api.js';

export default function App() {
  const [stage, setStage] = useState('start'); // 'start' | 'quiz' | 'result'
  const [questions, setQuestions] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleStart(name) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuestions();
      setPlayerName(name);
      setQuestions(data);
      setStage('quiz');
    } catch (err) {
      setError('Could not reach the quiz server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  async function handleFinish({ answers, elapsedSeconds }) {
    setLoading(true);
    try {
      const data = await submitQuiz({ name: playerName, answers, elapsedSeconds });
      setResult(data);
      setStage('result');
    } catch (err) {
      setError('Could not submit your answers. Please try again.');
      setStage('start');
    } finally {
      setLoading(false);
    }
  }

  function handleRestart() {
    setStage('start');
    setResult(null);
    setQuestions([]);
  }

  return (
    <div className="app-shell">
      <div className="backdrop-glow" aria-hidden="true" />
      {stage === 'start' && <StartScreen onStart={handleStart} loading={loading} error={error} />}
      {stage === 'quiz' && questions.length > 0 && <Quiz questions={questions} onFinish={handleFinish} />}
      {stage === 'result' && result && (
        <Result result={result} playerName={playerName} onRestart={handleRestart} />
      )}
    </div>
  );
}
