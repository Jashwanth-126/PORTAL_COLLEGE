import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Consistent SDC PU College Brand Identity
const colors = {
  primary: '#1a237e', // Navy
  secondary: '#fbc02d', // Gold
  accent: '#3949ab',
  bg: '#f0f2f5',
  white: '#ffffff',
  error: '#d32f2f',
  text: '#2c3e50'
};

const styles = {
  pageWrapper: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${colors.primary} 0%, #0d124a 100%)`,
    fontFamily: "'Inter', sans-serif",
  },
  loginBox: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: colors.white,
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
    textAlign: 'center'
  },
  logoPlaceholder: {
    width: '80px',
    height: '80px',
    backgroundColor: colors.bg,
    borderRadius: '50%',
    margin: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: colors.primary,
    border: `3px solid ${colors.secondary}`
  },
  h1: {
    margin: '0 0 10px 0',
    color: colors.primary,
    fontSize: '1.8rem',
    fontWeight: '800'
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    marginBottom: '30px',
    display: 'block'
  },
  formGroup: {
    marginBottom: '20px',
    textAlign: 'left'
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: colors.text,
    marginBottom: '8px',
    marginLeft: '4px'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '10px',
    border: '1.5px solid #e0e0e0',
    fontSize: '1rem',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#f9f9f9'
  },
  btn: {
    width: '100%',
    padding: '16px',
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'all 0.3s ease',
    boxShadow: `0 4px 12px rgba(26, 35, 126, 0.3)`
  },
  alert: {
    padding: '12px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    marginBottom: '20px',
    backgroundColor: '#ffebee',
    color: colors.error,
    border: `1px solid ${colors.error}`
  }
};

function AdminLogin({ setAdminAuth }) {
  const [formData, setFormData] = useState({ username: '', password: '', gmail: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/admin/login', formData);
      if (response.data.success) {
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminName', response.data.admin);
        setAdminAuth(true);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Access Denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.loginBox}>
        <div style={styles.logoPlaceholder}>SDC</div>
        <h1 style={styles.h1}>Admin Portal</h1>
        <span style={styles.subtitle}>Log in to SDC PU College Administration</span>

        {error && <div style={styles.alert}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...styles.input,
                borderColor: focusedField === 'username' ? colors.secondary : '#e0e0e0',
                backgroundColor: focusedField === 'username' ? '#fff' : '#f9f9f9'
              }}
              placeholder="Enter your username"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="gmail"
              value={formData.gmail}
              onChange={handleChange}
              onFocus={() => setFocusedField('gmail')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...styles.input,
                borderColor: focusedField === 'gmail' ? colors.secondary : '#e0e0e0',
                backgroundColor: focusedField === 'gmail' ? '#fff' : '#f9f9f9'
              }}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              style={{
                ...styles.input,
                borderColor: focusedField === 'password' ? colors.secondary : '#e0e0e0',
                backgroundColor: focusedField === 'password' ? '#fff' : '#f9f9f9'
              }}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.btn,
              opacity: loading ? 0.7 : 1,
              transform: loading ? 'scale(0.98)' : 'scale(1)'
            }} 
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

        <p style={{marginTop: '25px', fontSize: '0.8rem', color: '#95a5a6'}}>
          &copy; {new Date().getFullYear()} SDC Pre-University College. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;