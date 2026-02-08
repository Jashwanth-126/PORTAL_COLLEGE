import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

// Unified SDC PU College Style
const colors = {
  primary: '#1a237e',
  secondary: '#fbc02d',
  bg: '#f4f7f9',
  white: '#ffffff',
  text: '#2c3e50',
  border: '#d1d9e6',
  lightBg: '#f0f2f5'
};

const styles = {
  container: { minHeight: '100vh', padding: '40px 20px', backgroundColor: colors.bg, fontFamily: "'Inter', sans-serif" },
  header: { 
    background: colors.white, 
    padding: '25px 40px', 
    borderRadius: '16px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '30px', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    borderLeft: `8px solid ${colors.secondary}`
  },
  h1: { margin: 0, color: colors.primary, fontSize: '1.6rem', fontWeight: '700' },
  backBtn: { background: colors.primary, color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', border: 'none' },
  content: { maxWidth: '1000px', margin: '0 auto' },
  card: { background: colors.white, padding: '30px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: `1px solid ${colors.border}`, marginBottom: '25px' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: '700', color: colors.primary, marginBottom: '20px', borderBottom: `2px solid ${colors.secondary}`, paddingBottom: '10px' },
  quizInfo: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' },
  infoBox: { background: colors.lightBg, padding: '15px', borderRadius: '8px', textAlign: 'center' },
  infoValue: { fontSize: '1.3rem', fontWeight: '700', color: colors.primary, margin: '0 0 5px 0' },
  infoLabel: { fontSize: '0.75rem', color: colors.text, textTransform: 'uppercase', fontWeight: '600' },
  questionCard: { background: colors.lightBg, padding: '25px', borderRadius: '12px', marginBottom: '20px', border: `2px solid ${colors.border}` },
  questionNumber: { fontSize: '0.85rem', fontWeight: '700', color: colors.primary, marginBottom: '10px', textTransform: 'uppercase' },
  questionText: { fontSize: '1.05rem', fontWeight: '600', color: colors.text, marginBottom: '20px', lineHeight: '1.6' },
  optionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' },
  option: { padding: '15px', background: colors.white, border: `2px solid ${colors.border}`, borderRadius: '8px', fontWeight: '600' },
  correctOption: { background: '#d4edda', borderColor: '#28a745', color: '#155724' },
  alert: { padding: '15px', borderRadius: '8px', marginBottom: '20px', fontWeight: '600', fontSize: '0.95rem', background: '#e7f3ff', color: '#004085', border: `1px solid #bee5eb` },
  buttonGroup: { display: 'flex', gap: '10px', marginTop: '30px' },
  btn: { padding: '12px 25px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' },
  btnPrimary: { background: colors.primary, color: 'white' },
  btnSecondary: { background: 'transparent', color: colors.primary, border: `2px solid ${colors.primary}` },
  loading: { textAlign: 'center', padding: '40px', color: colors.text },
  emptyState: { textAlign: 'center', padding: '40px', color: colors.text }
};

function AdminQuizViewQuestions() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) navigate('/admin/login');
    fetchQuizAndQuestions();
  }, [quizId, navigate]);

  const fetchQuizAndQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/quiz/${quizId}`, { withCredentials: true });
      setQuiz(res.data.quiz);
      setQuestions(res.data.questions || []);
    } catch (err) {
      setError('Failed to load quiz questions');
    }
    setLoading(false);
  };

  if (!quiz && loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading quiz questions...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.h1}>Quiz Questions</h1>
          <button style={styles.backBtn} onClick={() => navigate('/admin/quiz-management')}>← Back</button>
        </div>
        <div style={styles.content}>
          <div style={styles.alert}>{error || 'Quiz not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>{quiz.title} - Questions</h1>
          <p style={{ margin: '10px 0 0 0', color: colors.text, fontSize: '0.9rem' }}>View all questions and correct answers</p>
        </div>
        <button style={styles.backBtn} onClick={() => navigate('/admin/quiz-management')}>← Back</button>
      </div>

      <div style={styles.content}>
        {error && <div style={styles.alert}>{error}</div>}

        {/* Quiz Info */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>📋 Quiz Information</h3>
          <div style={styles.quizInfo}>
            <div style={styles.infoBox}>
              <div style={styles.infoValue}>{questions.length}</div>
              <div style={styles.infoLabel}>Total Questions</div>
            </div>
            <div style={styles.infoBox}>
              <div style={styles.infoValue}>{questions.length}</div>
              <div style={styles.infoLabel}>Total Marks</div>
            </div>
            <div style={styles.infoBox}>
              <div style={styles.infoValue}>1</div>
              <div style={styles.infoLabel}>Marks Per Q</div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>❓ Questions & Answers</h3>

          {questions.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No questions added to this quiz yet.</p>
            </div>
          ) : (
            questions.map((question, idx) => (
              <div key={question.id} style={styles.questionCard}>
                <div style={styles.questionNumber}>Question {idx + 1}</div>
                <div style={styles.questionText}>{question.question_text}</div>

                <div style={styles.optionsGrid}>
                  {[
                    { num: 1, text: question.option_a },
                    { num: 2, text: question.option_b },
                    { num: 3, text: question.option_c },
                    { num: 4, text: question.option_d }
                  ].map(opt => (
                    <div
                      key={opt.num}
                      style={{
                        ...styles.option,
                        ...(question.correct_option === opt.num ? styles.correctOption : {})
                      }}
                    >
                      <strong style={{ color: question.correct_option === opt.num ? '#155724' : colors.primary }}>
                        Option {String.fromCharCode(64 + opt.num)}:
                      </strong>
                      <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem' }}>{opt.text}</p>
                      {question.correct_option === opt.num && (
                        <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', fontWeight: '700' }}>✓ CORRECT ANSWER</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div style={styles.card}>
          <div style={styles.buttonGroup}>
            <button
              style={{...styles.btn, ...styles.btnSecondary}}
              onClick={() => navigate('/admin/quiz-management')}
            >
              Back to Management
            </button>
            <button
              style={{...styles.btn, ...styles.btnPrimary}}
              onClick={() => navigate(`/admin/quiz/${quizId}/edit`)}
            >
              Edit Questions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminQuizViewQuestions;
