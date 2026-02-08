import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// SDC PU College Branding
const colors = {
  primary: '#1a237e',   // Navy
  secondary: '#fbc02d', // Gold
  bg: '#f8f9fa',
  white: '#ffffff',
  text: '#2c3e50',
  error: '#d32f2f'
};

const styles = {
  pageWrapper: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${colors.primary} 0%, #3949ab 100%)`,
    fontFamily: "'Inter', sans-serif",
    padding: '20px'
  },
  loginBox: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: colors.white,
    padding: '45px 35px',
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
    textAlign: 'center'
  },
  logoBadge: {
    width: '60px',
    height: '60px',
    backgroundColor: colors.bg,
    borderRadius: '14px',
    margin: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: '800',
    color: colors.primary,
    border: `2px solid ${colors.secondary}`
  },
  h1: {
    margin: '0 0 10px 0',
    color: colors.primary,
    fontSize: '1.75rem',
    fontWeight: '800'
  },
  tagline: {
    color: '#64748b',
    fontSize: '0.9rem',
    marginBottom: '35px',
    display: 'block'
  },
  formGroup: {
    marginBottom: '18px',
    textAlign: 'left'
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: colors.text,
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1.5px solid #e2e8f0',
    fontSize: '1rem',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: '#f9fafb',
    transition: 'all 0.2s ease'
  },
  btnLogin: {
    width: '100%',
    padding: '16px',
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '15px',
    boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)',
    transition: 'all 0.3s ease'
  },
  linksContainer: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    borderTop: '1px solid #f1f5f9',
    paddingTop: '20px'
  },
  link: {
    color: colors.primary,
    textDecoration: 'none',
    fontWeight: '600'
  },
  alert: {
    padding: '12px',
    borderRadius: '10px',
    backgroundColor: '#fff1f2',
    color: colors.error,
    fontSize: '0.85rem',
    marginBottom: '20px',
    border: `1px solid ${colors.error}`
  }
};

function UserLogin({ setUserAuth }) {
  const [formData, setFormData] = useState({ username: '', password: '', gmail: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
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
      const response = await axios.post('/api/user/login', formData);
      if (response.data.success) {
        localStorage.setItem('userAuth', 'true');
        localStorage.setItem('userName', response.data.user);
        localStorage.setItem('attStudentId', response.data.att_student_id);
        localStorage.setItem('sectionId', response.data.section_id);
        setUserAuth(true);
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Access denied. Verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (name) => ({
    ...styles.input,
    borderColor: focused === name ? colors.secondary : '#e2e8f0',
    backgroundColor: focused === name ? '#fff' : '#f9fafb',
    boxShadow: focused === name ? '0 0 0 4px rgba(251, 192, 45, 0.1)' : 'none'
  });

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.loginBox}>
        <div style={styles.logoBadge}>SDC</div>
        <h1 style={styles.h1}>Student Login</h1>
        <span style={styles.tagline}>Access your academic records & notes</span>

        {error && <div style={styles.alert}>⚠️ {error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onFocus={() => setFocused('username')}
              onBlur={() => setFocused(null)}
              style={getInputStyle('username')}
              placeholder="e.g. SDC202601"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Gmail Address</label>
            <input
              type="email"
              name="gmail"
              value={formData.gmail}
              onChange={handleChange}
              onFocus={() => setFocused('gmail')}
              onBlur={() => setFocused(null)}
              style={getInputStyle('gmail')}
              placeholder="Enter registered email"
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
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              style={getInputStyle('password')}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            style={{...styles.btnLogin, opacity: loading ? 0.8 : 1}} 
            disabled={loading}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#283593'}
            onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary}
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

        <div style={styles.linksContainer}>
          <Link to="/user/forgot-password" style={styles.link}>Forgot Password?</Link>
          <Link to="/" style={styles.link}>← Home</Link>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;