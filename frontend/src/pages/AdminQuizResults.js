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
  success: '#2e7d32',
  error: '#d32f2f',
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
  content: { maxWidth: '1200px', margin: '0 auto' },
  card: { background: colors.white, padding: '30px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: `1px solid ${colors.border}`, marginBottom: '30px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '30px' },
  statBox: { background: colors.lightBg, padding: '20px', borderRadius: '12px', textAlign: 'center', border: `2px solid ${colors.secondary}` },
  statValue: { fontSize: '1.8rem', fontWeight: '700', color: colors.primary, margin: 0 },
  statLabel: { fontSize: '0.85rem', color: colors.text, marginTop: '8px', fontWeight: '600', textTransform: 'uppercase' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: '700', color: colors.primary, marginBottom: '20px', borderBottom: `2px solid ${colors.secondary}`, paddingBottom: '10px' },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' },
  th: { padding: '12px 15px', textAlign: 'left', fontSize: '0.85rem', color: colors.primary, fontWeight: '700', textTransform: 'uppercase', background: colors.lightBg, borderRadius: '8px 0 0 8px' },
  thLast: { borderRadius: '0 8px 8px 0' },
  tr: { background: colors.white, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  td: { padding: '15px', fontSize: '0.95rem', color: colors.text, borderBottom: 'none' },
  rankBadge: { display: 'inline-block', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', fontSize: '0.85rem', textAlign: 'center' },
  rank1: { background: '#ffd700', color: '#333' },
  rank2: { background: '#c0c0c0', color: '#333' },
  rank3: { background: '#cd7f32', color: 'white' },
  rankNone: { background: colors.lightBg, color: colors.text },
  marksCell: { fontWeight: '700', color: colors.primary, fontSize: '1rem' },
  alert: { padding: '15px', borderRadius: '8px', marginBottom: '20px', fontWeight: '600', fontSize: '0.95rem' },
  errorAlert: { background: '#f8d7da', color: '#721c24', border: `1px solid #f5c6cb` },
  emptyState: { textAlign: 'center', padding: '40px 20px', color: colors.text },
  emptyIcon: { fontSize: '2rem', marginBottom: '15px' }
};

function AdminQuizResults() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) navigate('/admin/login');
    fetchQuizAndResults();
  }, [quizId, navigate]);

  const fetchQuizAndResults = async () => {
    setLoading(true);
    try {
      const quizRes = await axios.get(`/api/quiz/${quizId}`, { withCredentials: true });
      setQuiz(quizRes.data.quiz);

      const resultsRes = await axios.get(`/api/quiz/${quizId}/results`, { withCredentials: true });
      setResults(resultsRes.data.results || []);
    } catch (err) {
      setError('Failed to load quiz results');
    }
    setLoading(false);
  };

  const getRankBadge = (position) => {
    if (position === 1) return { ...styles.rankBadge, ...styles.rank1, content: '🥇 1st' };
    if (position === 2) return { ...styles.rankBadge, ...styles.rank2, content: '🥈 2nd' };
    if (position === 3) return { ...styles.rankBadge, ...styles.rank3, content: '🥉 3rd' };
    return { ...styles.rankBadge, ...styles.rankNone };
  };

  const getAverageMarks = () => {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, r) => sum + (r.marks_obtained || 0), 0);
    return (total / results.length).toFixed(2);
  };

  const getMaxMarks = () => {
    if (results.length === 0) return 0;
    return Math.max(...results.map(r => r.marks_obtained || 0));
  };

  const getMinMarks = () => {
    if (results.length === 0) return 0;
    return Math.min(...results.map(r => r.marks_obtained || 0));
  };

  if (!quiz) return <div style={{...styles.container, ...styles.emptyState}}>Loading...</div>;

  // Sort results by marks in descending order for ranking
  const rankedResults = results
    .sort((a, b) => (b.marks_obtained || 0) - (a.marks_obtained || 0))
    .map((result, idx) => ({ ...result, rank: idx + 1 }));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>{quiz.title} - Results</h1>
          <p style={{ margin: '10px 0 0 0', color: colors.text, fontSize: '0.9rem' }}>Section: {quiz.section_name}</p>
        </div>
        <button style={styles.backBtn} onClick={() => navigate('/admin/quiz-management')}>← Back</button>
      </div>

      <div style={styles.content}>
        {error && <div style={{...styles.alert, ...styles.errorAlert}}>{error}</div>}

        {/* Statistics */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>📊 Score Statistics</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <p style={styles.statValue}>{results.length}</p>
              <p style={styles.statLabel}>Total Attempts</p>
            </div>
            <div style={styles.statBox}>
              <p style={styles.statValue}>{quiz.total_marks}</p>
              <p style={styles.statLabel}>Total Marks</p>
            </div>
            <div style={styles.statBox}>
              <p style={styles.statValue}>{getAverageMarks()}</p>
              <p style={styles.statLabel}>Average Marks</p>
            </div>
            <div style={styles.statBox}>
              <p style={styles.statValue}>{getMaxMarks()}</p>
              <p style={styles.statLabel}>Highest Marks</p>
            </div>
            <div style={styles.statBox}>
              <p style={styles.statValue}>{getMinMarks()}</p>
              <p style={styles.statLabel}>Lowest Marks</p>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>🏆 Ranking & Results</h3>
          {rankedResults.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📋</div>
              <p>No student attempts yet</p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tr}>
                  <th style={styles.th}>Rank</th>
                  <th style={styles.th}>Student Name</th>
                  <th style={styles.th}>Roll Number</th>
                  <th style={styles.th}>Marks Obtained</th>
                  <th style={styles.th}>Total Marks</th>
                  <th style={styles.th}>Percentage</th>
                  <th style={{...styles.th, ...styles.thLast}}>Submission Time</th>
                </tr>
              </thead>
              <tbody>
                {rankedResults.map((result) => {
                  const percentage = ((result.marks_obtained / quiz.total_marks) * 100).toFixed(2);
                  let rankBadgeStyle = getRankBadge(result.rank);
                  
                  return (
                    <tr key={result.id} style={styles.tr}>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.rankBadge,
                          ...(result.rank === 1 ? styles.rank1 : result.rank === 2 ? styles.rank2 : result.rank === 3 ? styles.rank3 : styles.rankNone)
                        }}>
                          {result.rank === 1 ? '🥇' : result.rank === 2 ? '🥈' : result.rank === 3 ? '🥉' : ''} {result.rank}
                        </span>
                      </td>
                      <td style={styles.td}>{result.student_name}</td>
                      <td style={styles.td}>{result.roll_number || 'N/A'}</td>
                      <td style={{...styles.td, ...styles.marksCell}}>{result.marks_obtained}</td>
                      <td style={styles.td}>{quiz.total_marks}</td>
                      <td style={styles.td}>
                        <strong style={{ color: percentage >= 50 ? colors.success : colors.error }}>
                          {percentage}%
                        </strong>
                      </td>
                      <td style={styles.td}>
                        {new Date(result.submitted_at).toLocaleString('en-IN', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminQuizResults;
