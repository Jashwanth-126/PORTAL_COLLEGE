import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// SDC PU College Branding
const colors = {
  primary: '#1a237e', // Navy
  secondary: '#fbc02d', // Gold
  bg: '#f0f4f8',
  white: '#ffffff',
  text: '#2c3e50',
  success: '#2e7d32', // Green for passing
  error: '#d32f2f',   // Red for fail
  border: '#d1d9e6'
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.bg,
    padding: '40px 20px',
    fontFamily: "'Inter', sans-serif"
  },
  header: {
    maxWidth: '1000px',
    margin: '0 auto 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: colors.white,
    padding: '20px 30px',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    borderLeft: `8px solid ${colors.secondary}`
  },
  h1: { margin: 0, color: colors.primary, fontSize: '1.6rem', fontWeight: '800' },
  backBtn: {
    background: colors.primary,
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer'
  },
  summaryCard: {
    maxWidth: '1000px',
    margin: '0 auto 25px',
    background: colors.white,
    padding: '20px 30px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
  },
  tableCard: {
    maxWidth: '1000px',
    margin: '0 auto',
    background: colors.white,
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { 
    textAlign: 'left', 
    padding: '15px', 
    borderBottom: `2px solid ${colors.bg}`, 
    color: colors.primary, 
    fontSize: '0.85rem', 
    textTransform: 'uppercase', 
    fontWeight: '700' 
  },
  td: { padding: '15px', borderBottom: `1px solid ${colors.bg}`, fontSize: '0.95rem', color: colors.text },
  percentageBadge: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontWeight: '700',
    fontSize: '0.85rem'
  }
};

function StudentMarks() {
  const [marks, setMarks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const response = await axios.get('/api/student/marks');
      setMarks(response.data);
    } catch (err) {
      setError('Unable to load your marks data');
      if (err.response?.status === 401) {
        navigate('/user/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '100px', color: colors.primary}}>Accessing Gradebook...</div>;
  if (error) return <div style={{textAlign: 'center', padding: '100px', color: colors.error}}>{error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.h1}>My Examination Results</h1>
        <button onClick={() => navigate('/user/dashboard')} style={styles.backBtn}>
          Back to Portal
        </button>
      </div>
      
      {marks && (
        <>
          <div style={styles.summaryCard}>
            <div style={{fontSize: '2rem'}}>📊</div>
            <div>
              <h2 style={{margin: 0, fontSize: '1.1rem', color: colors.primary}}>Academic Overview</h2>
              <p style={{margin: 0, color: '#64748b', fontSize: '0.9rem'}}>
                You have appeared for <strong>{marks.total_exams}</strong> exams in this session.
              </p>
            </div>
          </div>

          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Subject</th>
                  <th style={styles.th}>Exam Date</th>
                  <th style={styles.th}>Obtained</th>
                  <th style={styles.th}>Max Marks</th>
                  <th style={{...styles.th, textAlign: 'right'}}>Result</th>
                </tr>
              </thead>
              <tbody>
                {marks.marks_records.map((record, index) => {
                  const percentage = record.total_marks ? 
                    ((record.marks / record.total_marks) * 100).toFixed(1) : 0;
                  
                  // PU College Logic: Pass mark usually 35%
                  const isPass = percentage >= 35;

                  return (
                    <tr key={index}>
                      <td style={{...styles.td, fontWeight: '600'}}>{record.subject_name}</td>
                      <td style={styles.td}>{new Date(record.exam_date).toLocaleDateString('en-GB')}</td>
                      <td style={{...styles.td, color: colors.primary, fontWeight: '700'}}>{record.marks}</td>
                      <td style={styles.td}>{record.total_marks}</td>
                      <td style={{...styles.td, textAlign: 'right'}}>
                        <span style={{
                          ...styles.percentageBadge,
                          backgroundColor: isPass ? '#e8f5e9' : '#fff1f2',
                          color: isPass ? colors.success : colors.error
                        }}>
                          {percentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default StudentMarks;