import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Unified SDC PU College Brand Palette
const colors = {
  primary: '#1a237e', // Navy
  secondary: '#fbc02d', // Gold
  bg: '#f0f2f5',
  white: '#ffffff',
  text: '#2c3e50',
  success: '#2e7d32',
  error: '#d32f2f'
};

const styles = {
  pageWrapper: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, ${colors.primary} 0%, #0d124a 100%)`,
    fontFamily: "'Inter', sans-serif",
    padding: '20px'
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: colors.white,
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
    textAlign: 'center'
  },
  iconWrapper: {
    width: '70px',
    height: '70px',
    backgroundColor: '#f5f6fa',
    borderRadius: '50%',
    margin: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    color: colors.primary,
    border: `2px solid ${colors.secondary}`
  },
  h2: {
    margin: '0 0 10px 0',
    color: colors.primary,
    fontSize: '1.6rem',
    fontWeight: '800'
  },
  p: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    marginBottom: '25px',
    lineHeight: '1.5'
  },
  label: {
    display: 'block',
    textAlign: 'left',
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
    outline: 'none',
    backgroundColor: '#f9f9f9',
    transition: 'border-color 0.3s'
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
    marginTop: '15px',
    transition: 'transform 0.2s, background-color 0.2s'
  },
  linkBox: {
    marginTop: '25px',
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid #eee',
    paddingTop: '20px'
  },
  link: {
    color: colors.primary,
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  alert: {
    padding: '12px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    marginBottom: '20px',
    fontWeight: '500'
  }
};

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/api/user/forgot-password', { gmail: email }, {
        timeout: 10000 // 10 second timeout
      });
      setMessage('✓ OTP sent successfully! Check your email inbox. Redirecting to verification page...');
      setTimeout(() => navigate('/user/verify-otp'), 3000);
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your internet connection and try again.');
      } else {
        setError(err.response?.data?.message || 'Failed to send OTP. Please check your email address.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <div style={styles.iconWrapper}>🔒</div>
        <h2 style={styles.h2}>Recover Password</h2>
        <p style={styles.p}>
          Enter your registered institutional email to receive a secure recovery link.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={styles.label}>Institutional Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="name@sdcpucollege.edu"
              style={{
                ...styles.input,
                borderColor: isFocused ? colors.secondary : '#e0e0e0',
                backgroundColor: isFocused ? '#fff' : '#f9f9f9'
              }}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div style={{ ...styles.alert, backgroundColor: '#ffebee', color: colors.error, border: `1px solid ${colors.error}` }}>
              {error}
            </div>
          )}
          
          {message && (
            <div style={{ ...styles.alert, backgroundColor: '#e8f5e9', color: colors.success, border: `1px solid ${colors.success}` }}>
              {message}
            </div>
          )}

          <button 
            type="submit" 
            style={{
              ...styles.btn,
              opacity: loading ? 0.7 : 1,
              backgroundColor: loading ? '#5c6bc0' : colors.primary
            }}
            disabled={loading}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {loading ? 'Processing...' : 'Send Recovery Link'}
          </button>
        </form>

        <div style={styles.linkBox}>
          <a href="/user/login" style={styles.link}>← Back to Login</a>
          <a href="/" style={styles.link}>Portal Home</a>
        </div>
      </div>
    </div>
  );
}