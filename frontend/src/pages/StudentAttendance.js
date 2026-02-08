import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Student Portal Branding
const colors = {
  primary: '#1a237e',
  secondary: '#fbc02d',
  bg: '#f0f4f8',
  white: '#ffffff',
  present: '#2e7d32',
  absent: '#d32f2f',
  text: '#2c3e50',
  border: '#d1d9e6'
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.bg,
    padding: '30px 20px',
    fontFamily: "'Inter', sans-serif"
  },
  header: {
    maxWidth: '1000px',
    margin: '0 auto 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  h1: { color: colors.primary, fontSize: '1.8rem', fontWeight: '800', margin: 0 },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    maxWidth: '1000px',
    margin: '0 auto 40px'
  },
  statCard: {
    background: colors.white,
    padding: '25px',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    borderBottom: `4px solid ${colors.secondary}`
  },
  statLabel: { fontSize: '0.85rem', color: '#7f8c8d', fontWeight: '600', textTransform: 'uppercase', marginBottom: '10px', display: 'block' },
  statValue: { fontSize: '2rem', fontWeight: '800', color: colors.primary, margin: 0 },
  percentageCircle: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: `8px solid ${colors.secondary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 10px',
    fontSize: '1.2rem',
    fontWeight: '800',
    color: colors.primary
  },
  recordSection: {
    maxWidth: '1000px',
    margin: '0 auto',
    background: colors.white,
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '15px', borderBottom: `2px solid ${colors.bg}`, color: colors.primary, fontSize: '0.9rem' },
  td: { padding: '15px', borderBottom: `1px solid ${colors.bg}`, fontSize: '0.95rem' },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '700'
  }
};

function StudentAttendance() {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get('/api/student/attendance');
        setAttendance(response.data);
      } catch (err) {
        setError('Unable to retrieve your attendance records.');
        if (err.response?.status === 401) navigate('/user/login');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [navigate]);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: colors.primary }}>Loading Records...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '100px', color: colors.absent }}>{error}</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.h1}>Academic Attendance</h1>
        <button onClick={() => navigate('/user/dashboard')} style={{ background: 'none', border: `1px solid ${colors.primary}`, color: colors.primary, padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
          Back to Portal
        </button>
      </header>

      {attendance && (
        <>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.percentageCircle}>{attendance.percentage}%</div>
              <span style={styles.statLabel}>Overall Attendance</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>Total Classes</span>
              <p style={styles.statValue}>{attendance.total_class_days}</p>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>Days Present</span>
              <p style={{ ...styles.statValue, color: colors.present }}>{attendance.total_present}</p>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>Days Absent</span>
              <p style={{ ...styles.statValue, color: colors.absent }}>{attendance.total_absent}</p>
            </div>
          </div>

          <div style={styles.recordSection}>
            <h2 style={{ color: colors.primary, marginBottom: '25px', fontSize: '1.3rem' }}>Daily History</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.records.map((record, index) => (
                  <tr key={index}>
                    <td style={styles.td}>{new Date(record.attendance_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: record.status === 'Present' ? '#e8f5e9' : '#ffebee',
                        color: record.status === 'Present' ? colors.present : colors.absent
                      }}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default StudentAttendance;