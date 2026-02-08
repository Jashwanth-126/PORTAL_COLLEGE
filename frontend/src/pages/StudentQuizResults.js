import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// Unified SDC PU College Style
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
  content: { maxWidth: '600px', margin: '0 auto' },
  card: { background: colors.white, padding: '40px', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' },
  scoreCircle: { width: '120px', height: '120px', borderRadius: '50%', background: colors.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '20px auto', border: `4px solid ${colors.primary}` },
  scoreText: { fontSize: '1.8rem', fontWeight: '800', color: colors.primary },
  totalText: { fontSize: '0.9rem', color: '#64748b' },
  statusBadge: { display: 'inline-block', padding: '8px 20px', borderRadius: '20px', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '20px' },
  button: { width: '100%', marginTop: '20px', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', background: colors.primary, color: 'white' }
};

function StudentQuizResults() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResult();
  }, [quizId]);

  const fetchResult = async () => {
    try {
      const res = await axios.get(`/api/quiz/${quizId}/my-results`, { withCredentials: true });
      setResult(res.data);
    } catch (err) {
      setError("Failed to load results. Please try again later.");
    }
  };

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
           <div style={styles.card}>
              <h3 style={{ color: colors.warning }}>{error}</h3>
              <button style={styles.button} onClick={() => navigate("/student/assessments")}>Back to Assessments</button>
           </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return <div style={{ ...styles.container, textAlign: 'center' }}>Loading result...</div>;
  }

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h2 style={styles.navBrand}>QUIZ PERFORMANCE</h2>
        <button style={styles.btnBack} onClick={() => navigate('/student/assessments')}>← Back</button>
      </nav>

      <div style={styles.content}>
        <div style={styles.card}>
          <div style={{ fontSize: '3rem' }}>🏆</div>
          <h1 style={{ color: colors.primary, margin: '10px 0' }}>Assessment Results</h1>
          
          <div style={{ ...styles.statusBadge, background: result.status === 'completed' ? '#d4edda' : '#fff3cd', color: result.status === 'completed' ? '#155724' : '#856404' }}>
            {result.status}
          </div>

          <div style={styles.scoreCircle}>
            <div style={styles.scoreText}>{result.marks_obtained}</div>
            <div style={styles.totalText}>out of {result.total_marks}</div>
          </div>

          <p style={{ color: '#64748b', marginBottom: '30px' }}>
            Great effort! Your score has been recorded in the academic portal.
          </p>

          <button style={styles.button} onClick={() => navigate("/student/assessments")}>
            Return to Assessment List
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentQuizResults;