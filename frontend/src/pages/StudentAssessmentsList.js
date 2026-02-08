import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const colors = {
  primary: '#1a237e',
  secondary: '#fbc02d',
  bg: '#f8fafc',
  white: '#ffffff',
  text: '#1e293b',
  border: '#e2e8f0',
  success: '#2e7d32',
  warning: '#f57c00'
};

const styles = {
  container: { minHeight: '100vh', padding: '40px 20px', backgroundColor: colors.bg, fontFamily: "'Inter', sans-serif" },
  navbar: { background: colors.primary, padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: colors.white, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '30px' },
  navBrand: { margin: 0, fontSize: '1.2rem', fontWeight: '800' },
  btnBack: { background: 'transparent', color: colors.secondary, border: `1.5px solid ${colors.secondary}`, padding: '6px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' },
  content: { maxWidth: '1000px', margin: '0 auto', padding: '0 20px' },
  header: { marginBottom: '40px' },
  title: { fontSize: '2rem', color: colors.primary, fontWeight: '800' },
  subtitle: { color: '#64748b', fontSize: '0.95rem', marginTop: '10px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
  card: { background: colors.white, padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
  quizIcon: { fontSize: '2.5rem', marginBottom: '15px' },
  quizTitle: { fontSize: '1.3rem', fontWeight: '700', color: colors.primary, marginBottom: '8px' },
  quizMeta: { fontSize: '0.85rem', color: '#64748b', display: 'flex', gap: '10px', marginBottom: '12px' },
  statusBadge: { padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', width: 'fit-content' },
  activeBadge: { background: '#d4edda', color: '#155724' },
  inactiveBadge: { background: '#f8d7da', color: '#721c24' },
  comingBadge: { background: '#fff3cd', color: '#856404' },
  button: { marginTop: 'auto', padding: '12px', borderRadius: '10px', border: 'none', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer' },
  btnAttempt: { background: colors.success, color: 'white' },
  btnDisabled: { background: colors.border, color: colors.text, cursor: 'not-allowed', opacity: 0.6 },
  btnViewResults: { background: colors.primary, color: 'white' },
  infoText: { marginTop: '10px', fontSize: '0.85rem', color: '#475569', fontWeight: '600' }
};

function StudentAssessmentsList() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    if (!localStorage.getItem('userName')) navigate('/user/login');
    fetchStudentQuizzes();
    const interval = setInterval(fetchStudentQuizzes, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchStudentQuizzes = async () => {
    try {
      const res = await axios.get('/api/student/quizzes', { withCredentials: true });
      setQuizzes(res.data.quizzes || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const isStarted = (s) => new Date() >= new Date(s);
  const isEnded = (e) => new Date() >= new Date(e);
  const isActive = (s, e) => new Date() >= new Date(s) && new Date() <= new Date(e);

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h2 style={styles.navBrand}>ASSESSMENTS & QUIZZES</h2>
        <button style={styles.btnBack} onClick={() => navigate(-1)}>← Back</button>
      </nav>

      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Available Tests</h1>
          <p style={styles.subtitle}>Attempt quizzes during the designated assessment window.</p>
        </div>

        <div style={styles.grid}>
          {quizzes.map(quiz => {
            const active = isActive(quiz.start_time, quiz.end_time);
            const ended = isEnded(quiz.end_time);
            const started = isStarted(quiz.start_time);

            return (
              <div key={quiz.id} style={styles.card}>
                <div style={styles.quizIcon}>📋</div>
                <h3 style={styles.quizTitle}>{quiz.title}</h3>

                <div style={styles.quizMeta}>
                  ⏱ {quiz.duration} mins • ❓ {quiz.question_count || 0} Qs
                </div>

                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '15px', lineHeight: '1.4' }}>
                  <div><strong>Starts:</strong> {formatDateTime(quiz.start_time)}</div>
                  <div><strong>Ends:</strong> {formatDateTime(quiz.end_time)}</div>
                </div>

                <span style={{
                  ...styles.statusBadge,
                  ...(active ? styles.activeBadge : ended ? styles.inactiveBadge : styles.comingBadge)
                }}>
                  {active ? '● LIVE' : ended ? 'ENDED' : 'COMING SOON'}
                </span>

                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column' }}>
                    {active && quiz.attempt_status === "not_started" && (
                    <button style={{ ...styles.button, ...styles.btnAttempt }} onClick={() => navigate(`/student/quiz/${quiz.id}/attempt`)}>
                        🎯 Attempt Now
                    </button>
                    )}

                    {active && quiz.attempt_status === "in_progress" && (
                    <button style={{ ...styles.button, ...styles.btnAttempt }} onClick={() => navigate(`/student/quiz/${quiz.id}/attempt`)}>
                        ▶ Resume
                    </button>
                    )}

                    {active && quiz.attempt_status === "completed" && (
                    <>
                        <button style={{ ...styles.button, ...styles.btnDisabled }} disabled>✅ Attempted</button>
                        <div style={styles.infoText}>Submitted. Results will reveal after the end time.</div>
                    </>
                    )}

                    {ended && (
                    <button style={{ ...styles.button, ...styles.btnViewResults }} onClick={() => navigate(`/student/quiz/${quiz.id}/results`)}>
                        📊 View Results
                    </button>
                    )}

                    {!started && (
                    <button style={{ ...styles.button, ...styles.btnDisabled }} disabled>⏳ Not Started</button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StudentAssessmentsList;