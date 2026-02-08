import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Unified SDC PU College Style
const colors = {
  primary: '#1a237e',
  secondary: '#fbc02d',
  bg: '#f4f7f9',
  white: '#ffffff',
  text: '#2c3e50',
  border: '#d1d9e6',
  success: '#2e7d32',
  error: '#d32f2f',
  warning: '#f57c00'
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
  content: { maxWidth: '1200px', margin: '0 auto' },
  createBtn: { background: colors.secondary, color: colors.primary, padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.95rem', border: 'none' },
  card: { background: colors.white, padding: '25px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: `1px solid ${colors.border}`, marginBottom: '20px' },
  quizHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' },
  quizTitle: { fontSize: '1.2rem', fontWeight: '700', color: colors.primary, margin: 0 },
  quizMeta: { fontSize: '0.85rem', color: colors.text, marginTop: '8px', display: 'flex', gap: '15px', flexWrap: 'wrap' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '5px' },
  statusBadge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' },
  activeBadge: { background: '#d4edda', color: '#155724' },
  inactiveBadge: { background: '#f8d7da', color: '#721c24' },
  actionButtons: { display: 'flex', gap: '10px', marginTop: '15px' },
  btn: { padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.3s' },
  btnEdit: { background: colors.primary, color: 'white' },
  btnView: { background: colors.secondary, color: colors.primary },
  btnDelete: { background: colors.error, color: 'white' },
  btnResults: { background: colors.success, color: 'white' },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: colors.text },
  emptyIcon: { fontSize: '3rem', marginBottom: '15px' },
  emptyText: { fontSize: '1.1rem', fontWeight: '600', marginBottom: '10px', color: colors.primary },
  alert: { padding: '15px', borderRadius: '8px', marginBottom: '20px', fontWeight: '600', fontSize: '0.95rem' },
  successAlert: { background: '#d4edda', color: '#155724', border: `1px solid #c3e6cb` },
  errorAlert: { background: '#f8d7da', color: '#721c24', border: `1px solid #f5c6cb` }
};

function AdminQuizManagement() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) navigate('/admin/login');
    fetchQuizzes();
  }, [navigate]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/quiz/list', { withCredentials: true });
      setQuizzes(res.data.quizzes || []);
    } catch (err) {
      setError('Failed to load quizzes');
    }
    setLoading(false);
  };

  const handleDelete = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;

    try {
      const res = await axios.delete(`/api/quiz/${quizId}`, { withCredentials: true });
      if (res.data?.success) {
        setMessage('Quiz deleted successfully');
        fetchQuizzes();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete quiz');
    }
  };

  const isQuizActive = (quiz) => {
    const now = new Date();
    const start = new Date(quiz.start_time);
    const end = new Date(quiz.end_time);
    return now >= start && now <= end;
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.h1}>Quiz Management</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={styles.createBtn} onClick={() => navigate('/admin/quiz-create')}>
            + Create New Quiz
          </button>
          <button style={styles.backBtn} onClick={() => navigate('/admin/dashboard')}>← Back</button>
        </div>
      </div>

      <div style={styles.content}>
        {message && <div style={{...styles.alert, ...styles.successAlert}}>{message}</div>}
        {error && <div style={{...styles.alert, ...styles.errorAlert}}>{error}</div>}

        {!loading && quizzes.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📝</div>
            <div style={styles.emptyText}>No quizzes created yet</div>
            <p style={{ color: colors.text, fontSize: '0.95rem' }}>
              Click "Create New Quiz" to start creating assessments for your students.
            </p>
          </div>
        ) : (
          quizzes.map(quiz => {
            const active = isQuizActive(quiz);
            return (
              <div key={quiz.id} style={styles.card}>
                <div style={styles.quizHeader}>
                  <div>
                    <h3 style={styles.quizTitle}>{quiz.title}</h3>
                    <div style={styles.quizMeta}>
                      <div style={styles.metaItem}>📍 {quiz.section_name}</div>
                      <div style={styles.metaItem}>⏱️ {quiz.duration} mins</div>
                      <div style={styles.metaItem}>❓ {quiz.question_count || 0} questions</div>
                      <div style={styles.metaItem}>
                        <span style={{...styles.statusBadge, ...(active ? styles.activeBadge : styles.inactiveBadge)}}>
                          {active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: `1px solid ${colors.border}`, fontSize: '0.85rem', color: colors.text }}>
                  <div><strong>Start:</strong> {formatDateTime(quiz.start_time)}</div>
                  <div style={{ marginTop: '5px' }}><strong>End:</strong> {formatDateTime(quiz.end_time)}</div>
                </div>

                <div style={styles.actionButtons}>
                  <button 
                    style={{...styles.btn, ...styles.btnView}}
                    onClick={() => navigate(`/admin/quiz/${quiz.id}/view`)}
                  >
                    👁️ View Questions
                  </button>
                  <button 
                    style={{...styles.btn, ...styles.btnResults}}
                    onClick={() => navigate(`/admin/quiz/${quiz.id}/results`)}
                  >
                    📊 View Results
                  </button>
                  <button 
                    style={{...styles.btn, ...styles.btnEdit}}
                    onClick={() => navigate(`/admin/quiz/${quiz.id}/edit`)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    style={{...styles.btn, ...styles.btnDelete}}
                    onClick={() => handleDelete(quiz.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AdminQuizManagement;
