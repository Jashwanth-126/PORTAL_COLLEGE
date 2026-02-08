import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const colors = {
  primary: '#1a237e',
  secondary: '#fbc02d',
  bg: '#f8fafc',
  white: '#ffffff',
  text: '#1e293b',
  border: '#e2e8f0',
  success: '#2e7d32',
  error: '#d32f2f',
  warning: '#f57c00'
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: colors.bg, fontFamily: "'Inter', sans-serif", paddingBottom: '100px' },
  header: { 
    background: colors.primary, 
    padding: '15px 40px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    color: colors.white, 
    position: 'sticky', 
    top: 0, 
    zIndex: 100, 
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
  },
  timerBox: { 
    background: 'rgba(255,255,255,0.1)', 
    padding: '8px 16px', 
    borderRadius: '8px', 
    border: `1px solid ${colors.secondary}`, 
    color: colors.secondary, 
    fontWeight: '800', 
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  content: { maxWidth: '800px', margin: '30px auto', padding: '0 20px' },
  qCard: { 
    background: colors.white, 
    padding: '30px', 
    borderRadius: '16px', 
    marginBottom: '20px', 
    border: `1px solid ${colors.border}`, 
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)' 
  },
  questionText: { fontSize: '1.1rem', fontWeight: '700', color: colors.primary, marginBottom: '20px', display: 'block' },
  optionLabel: { 
    display: 'flex', 
    alignItems: 'center', 
    padding: '12px 16px', 
    borderRadius: '10px', 
    border: `1px solid ${colors.border}`, 
    marginBottom: '10px', 
    cursor: 'pointer', 
    transition: 'all 0.2s ease',
    fontSize: '0.95rem'
  },
  optionActive: { border: `2px solid ${colors.primary}`, background: '#f0f2ff' },
  radio: { marginRight: '12px', width: '18px', height: '18px', accentColor: colors.primary },
  submitBar: { 
    position: 'fixed', 
    bottom: 0, 
    width: '100%', 
    background: colors.white, 
    padding: '20px', 
    borderTop: `1px solid ${colors.border}`, 
    display: 'flex', 
    justifyContent: 'center', 
    boxShadow: '0 -4px 12px rgba(0,0,0,0.05)' 
  },
  btnSubmit: { 
    background: colors.success, 
    color: 'white', 
    border: 'none', 
    padding: '12px 40px', 
    borderRadius: '10px', 
    fontWeight: '700', 
    fontSize: '1rem', 
    cursor: 'pointer' 
  },
  btnDisabled: { background: colors.border, cursor: 'not-allowed' }
};

function StudentQuizAttempt() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const autoSubmitted = useRef(false);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      const res = await axios.get(`/api/quiz/${quizId}/attempt`, { withCredentials: true });
      setQuiz(res.data.quiz);
      setQuestions(res.data.questions || []);
      setTimeLeft(res.data.remaining_seconds);

      const init = {};
      res.data.questions.forEach(q => (init[q.id] = null));
      setAnswers(init);

      const attemptRes = await axios.post(`/api/quiz/${quizId}/start-attempt`, {}, { withCredentials: true });
      setAttemptId(attemptRes.data.attempt_id);

    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.locked) {
        navigate('/student/assessments', { replace: true });
      } else {
        setError(err.response?.data?.error || 'Unable to load quiz');
      }
    }
  };

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      if (!autoSubmitted.current) {
        autoSubmitted.current = true;
        handleAutoSubmit();
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (qid, option) => {
    setAnswers(prev => ({ ...prev, [qid]: option }));
  };

  const handleAutoSubmit = async () => {
    if (!attemptId) return;
    await submitAnswers(true);
  };

  const submitAnswers = async (auto = false) => {
    try {
      setLoading(true);
      await axios.post(
        `/api/quiz/${quizId}/submit`,
        { attempt_id: attemptId, answers, auto_submit: auto },
        { withCredentials: true }
      );
      navigate('/student/assessments', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
      setLoading(false);
    }
  };

  const handleManualSubmit = () => {
    if (window.confirm('Are you sure you want to end the quiz and submit your answers?')) {
      submitAnswers(false);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!quiz) {
    return (
      <div style={{ ...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ fontWeight: '700', color: colors.primary }}>{error || 'Preparing your assessment...'}</p>
      </div>
    );
  }

  const answeredCount = Object.values(answers).filter(v => v !== null).length;

  return (
    <div style={styles.container}>
      {/* Header with Timer */}
      <header style={styles.header}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>{quiz.title.toUpperCase()}</h2>
          <small style={{ color: colors.secondary }}>{answeredCount} of {questions.length} Answered</small>
        </div>
        <div style={styles.timerBox}>
          <span>⏱</span> {formatTime(timeLeft)}
        </div>
      </header>

      <div style={styles.content}>
        {timeLeft <= 60 && (
          <div style={{ padding: '10px', background: '#fee2e2', color: colors.error, borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: '700' }}>
            ⚠️ Less than a minute remaining!
          </div>
        )}

        {questions.map((q, i) => (
          <div key={q.id} style={styles.qCard}>
            <span style={styles.questionText}>
              <span style={{ marginRight: '10px', color: colors.secondary }}>Q{i + 1}.</span> 
              {q.question_text}
            </span>

            {[1, 2, 3, 4].map(n => {
              const optionKey = `option_${String.fromCharCode(96 + n)}`;
              const isSelected = answers[q.id] === n;
              
              return (
                <label 
                  key={n} 
                  style={{ ...styles.optionLabel, ...(isSelected ? styles.optionActive : {}) }}
                >
                  <input
                    type="radio"
                    style={styles.radio}
                    name={`q-${q.id}`}
                    checked={isSelected}
                    onChange={() => handleAnswerChange(q.id, n)}
                    disabled={loading}
                  />
                  {q[optionKey]}
                </label>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Submit Bar */}
      <div style={styles.submitBar}>
        <button
          onClick={handleManualSubmit}
          disabled={loading || timeLeft <= 0}
          style={{ ...styles.btnSubmit, ...( (loading || timeLeft <= 0) ? styles.btnDisabled : {} )}}
        >
          {loading ? 'Processing...' : 'Final Submit Quiz'}
        </button>
      </div>

      {error && (
        <div style={{ position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)', background: colors.error, color: 'white', padding: '10px 20px', borderRadius: '8px' }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default StudentQuizAttempt;