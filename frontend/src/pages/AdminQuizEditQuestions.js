import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const colors = {
  primary: '#1a237e',
  secondary: '#fbc02d',
  bg: '#f4f7f9',
  white: '#ffffff',
  text: '#2c3e50',
  border: '#d1d9e6',
  lightBg: '#f0f2f5',
  success: '#28a745',
  error: '#dc3545'
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
  questionCard: { background: colors.lightBg, padding: '25px', borderRadius: '12px', marginBottom: '20px', border: `2px solid ${colors.border}` },
  questionNumber: { fontSize: '0.85rem', fontWeight: '700', color: colors.primary, marginBottom: '15px', textTransform: 'uppercase' },
  label: { fontSize: '0.85rem', fontWeight: '700', color: colors.primary, marginTop: '15px', marginBottom: '8px', textTransform: 'uppercase' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.border}`, fontFamily: "'Inter', sans-serif", fontSize: '0.95rem', boxSizing: 'border-box' },
  optionGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '15px' },
  correctOptionGroup: { display: 'flex', gap: '10px', marginTop: '15px', alignItems: 'center', flexWrap: 'wrap' },
  radioLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: colors.text, cursor: 'pointer' },
  radioInput: { width: '18px', height: '18px', cursor: 'pointer' },
  buttonGroup: { display: 'flex', gap: '10px', marginTop: '30px' },
  btn: { padding: '12px 25px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' },
  btnPrimary: { background: colors.primary, color: 'white' },
  btnDanger: { background: colors.error, color: 'white' },
  btnSecondary: { background: 'transparent', color: colors.primary, border: `2px solid ${colors.primary}` },
  alert: { padding: '15px', borderRadius: '8px', marginBottom: '20px', fontWeight: '600', fontSize: '0.95rem' },
  alertSuccess: { background: '#d4edda', color: '#155724', border: `1px solid #c3e6cb` },
  alertError: { background: '#f8d7da', color: '#721c24', border: `1px solid #f5c6cb` },
  deleteBtn: { background: colors.error, color: 'white', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', border: 'none', marginTop: '10px' },
  loading: { textAlign: 'center', padding: '40px', color: colors.text }
};

function AdminQuizEditQuestions() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
      setMessage({ type: 'error', text: 'Failed to load quiz questions' });
    }
    setLoading(false);
  };

  const handleQuestionChange = (idx, field, value) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], [field]: value };
    setQuestions(updated);
  };

  const handleSaveQuestions = async () => {
    setSaving(true);
    try {
      // Validate all questions have correct options selected
      for (let q of questions) {
        if (!q.correct_option) {
          setMessage({ type: 'error', text: 'All questions must have a correct answer selected' });
          setSaving(false);
          return;
        }
        if (!q.option_a || !q.option_b || !q.option_c || !q.option_d) {
          setMessage({ type: 'error', text: 'All questions must have all 4 options filled' });
          setSaving(false);
          return;
        }
      }

      await axios.post(`/api/quiz/${quizId}/update-questions`, { questions }, { withCredentials: true });
      setMessage({ type: 'success', text: 'Questions saved successfully!' });
      setTimeout(() => navigate('/admin/quiz-management'), 1500);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save questions' });
    }
    setSaving(false);
  };

  const handleDeleteQuestion = async (qId, idx) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await axios.delete(`/api/quiz/question/${qId}`, { withCredentials: true });
        const updated = questions.filter((_, i) => i !== idx);
        setQuestions(updated);
        setMessage({ type: 'success', text: 'Question deleted' });
      } catch (err) {
        setMessage({ type: 'error', text: 'Failed to delete question' });
      }
    }
  };

  if (!quiz && loading) {
    return <div style={styles.container}><div style={styles.loading}>Loading quiz...</div></div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>{quiz?.title} - Edit Questions</h1>
        </div>
        <button style={styles.backBtn} onClick={() => navigate('/admin/quiz-management')}>← Back</button>
      </div>

      <div style={styles.content}>
        {message.text && (
          <div style={{...styles.alert, ...(message.type === 'success' ? styles.alertSuccess : styles.alertError)}}>
            {message.text}
          </div>
        )}

        {questions.length === 0 ? (
          <div style={styles.card}>
            <p style={{ textAlign: 'center', color: colors.text }}>No questions in this quiz. Create them from Quiz Creation form.</p>
          </div>
        ) : (
          <>
            {questions.map((question, idx) => (
              <div key={question.id} style={styles.card}>
                <div style={styles.questionNumber}>Question {idx + 1}</div>

                <label style={styles.label}>Question Text *</label>
                <textarea
                  style={{...styles.input, minHeight: '80px'}}
                  value={question.question_text}
                  onChange={(e) => handleQuestionChange(idx, 'question_text', e.target.value)}
                />

                <div style={styles.optionGrid}>
                  {['option_a', 'option_b', 'option_c', 'option_d'].map((opt, i) => (
                    <div key={opt}>
                      <label style={styles.label}>Option {String.fromCharCode(65 + i)} *</label>
                      <input
                        style={styles.input}
                        type="text"
                        value={question[opt]}
                        onChange={(e) => handleQuestionChange(idx, opt, e.target.value)}
                        placeholder={`Enter option ${String.fromCharCode(65 + i)}`}
                      />
                    </div>
                  ))}
                </div>

                <div style={styles.correctOptionGroup}>
                  <label style={{...styles.label, margin: 0}}>Correct Answer *</label>
                  {[1, 2, 3, 4].map(i => (
                    <label key={i} style={styles.radioLabel}>
                      <input
                        type="radio"
                        style={styles.radioInput}
                        name={`correct-${idx}`}
                        value={i}
                        checked={question.correct_option === i}
                        onChange={(e) => handleQuestionChange(idx, 'correct_option', parseInt(e.target.value))}
                      />
                      Option {String.fromCharCode(64 + i)}
                    </label>
                  ))}
                </div>

                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDeleteQuestion(question.id, idx)}
                >
                  🗑️ Delete Question
                </button>
              </div>
            ))}

            <div style={styles.card}>
              <div style={styles.buttonGroup}>
                <button
                  style={{...styles.btn, ...styles.btnSecondary}}
                  onClick={() => navigate('/admin/quiz-management')}
                >
                  Cancel
                </button>
                <button
                  style={{...styles.btn, ...styles.btnPrimary}}
                  onClick={handleSaveQuestions}
                  disabled={saving}
                >
                  {saving ? '💾 Saving...' : '✓ Save All Changes'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminQuizEditQuestions;
