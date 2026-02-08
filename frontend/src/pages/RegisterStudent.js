import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Unified SDC PU College Brand Identity
const colors = {
  primary: '#1a237e', // Navy
  secondary: '#fbc02d', // Gold
  bg: '#f4f7f9',
  white: '#ffffff',
  text: '#2c3e50',
  border: '#d1d9e6',
  success: '#2e7d32'
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.bg,
    padding: '40px 20px',
    fontFamily: "'Inter', sans-serif"
  },
  header: {
    background: colors.white,
    padding: '25px 40px',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    borderLeft: `8px solid ${colors.secondary}`
  },
  h1: { margin: 0, color: colors.primary, fontSize: '1.6rem', fontWeight: '700' },
  backBtn: {
    backgroundColor: colors.primary,
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  card: {
    background: colors.white,
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    border: `1px solid ${colors.border}`
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: colors.primary,
    marginBottom: '8px',
    textTransform: 'uppercase'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: `1.5px solid ${colors.border}`,
    fontSize: '0.95rem',
    marginBottom: '20px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  btnPrimary: {
    width: '100%',
    padding: '14px',
    background: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)'
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 10px'
  },
  th: {
    padding: '12px 15px',
    textAlign: 'left',
    fontSize: '0.8rem',
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  tr: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  },
  td: {
    padding: '15px',
    fontSize: '0.9rem',
    color: colors.text,
    borderBottom: 'none'
  },
  badge: {
    backgroundColor: colors.secondary,
    color: colors.primary,
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '700'
  }
};

function RegisterStudent() {
  const [formData, setFormData] = useState({ username: '', gmail: '' });
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data || []);
    } catch (err) {
      console.error('Failed to fetch students');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/register_student', formData);
      if (response.data.success) {
        setMessage('Student successfully enrolled in the system.');
        setFormData({ username: '', gmail: '' });
        fetchStudents();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Enrollment failed. Please verify student details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Student Enrollment</h1>
          <span style={{ color: '#7f8c8d', fontSize: '0.85rem' }}>SDC PU College Admissions Registry</span>
        </div>
        <a href="/admin/dashboard" style={styles.backBtn}>Back to Dashboard</a>
      </div>

      <div style={styles.mainContent}>
        {/* Registration Form */}
        <div style={styles.card}>
          <h2 style={{ color: colors.primary, fontSize: '1.2rem', marginBottom: '25px' }}>New Registration</h2>
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Full Name / Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="e.g. SDC_2024_001"
              style={styles.input}
              required
            />

            <label style={styles.label}>Institutional Email (Gmail)</label>
            <input
              type="email"
              name="gmail"
              value={formData.gmail}
              onChange={(e) => setFormData({ ...formData, gmail: e.target.value })}
              placeholder="student@gmail.com"
              style={styles.input}
              required
            />

            <button type="submit" style={styles.btnPrimary} disabled={loading}>
              {loading ? 'Processing...' : 'Enroll Student'}
            </button>
            {message && <p style={{ color: colors.success, fontSize: '0.85rem', textAlign: 'center', marginTop: '15px', fontWeight: '600' }}>{message}</p>}
          </form>
        </div>

        {/* Registered Students Table */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: colors.primary, fontSize: '1.2rem', margin: 0 }}>Registered Students</h2>
            <span style={styles.badge}>{students.length} Total</span>
          </div>
          
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Student Identity</th>
                <th style={styles.th}>Email Address</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index} style={styles.tr}>
                  <td style={{ ...styles.td, fontWeight: '600', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                    {student.username}
                  </td>
                  <td style={styles.td}>{student.gmail}</td>
                  <td style={{ ...styles.td, textAlign: 'right', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                    <span style={{ color: colors.success, fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>● Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#95a5a6', border: '2px dashed #eee', borderRadius: '12px' }}>
              No students registered for this session yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterStudent;