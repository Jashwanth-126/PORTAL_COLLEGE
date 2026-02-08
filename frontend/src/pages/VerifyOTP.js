import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Unified SDC PU College Style Guide
const colors = {
  primary: '#1a237e',   // Navy
  secondary: '#fbc02d', // Gold
  bg: '#f0f2f5',
  white: '#ffffff',
  text: '#2c3e50',
  success: '#2e7d32',
  error: '#d32f2f',
  border: '#e0e0e0'
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
    maxWidth: '420px',
    backgroundColor: colors.white,
    padding: '40px',
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    textAlign: 'center'
  },
  iconHeader: {
    width: '64px',
    height: '64px',
    backgroundColor: '#f5f7ff',
    borderRadius: '16px',
    margin: '0 auto 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.8rem',
    color: colors.primary,
    border: `2px solid ${colors.secondary}`
  },
  h2: {
    margin: '0 0 8px 0',
    color: colors.primary,
    fontSize: '1.75rem',
    fontWeight: '800'
  },
  subtitle: {
    color: '#64748b',
    fontSize: '0.9rem',
    marginBottom: '32px',
    display: 'block'
  },
  formGroup: {
    marginBottom: '20px',
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
    border: `1.5px solid ${colors.border}`,
    fontSize: '1.1rem',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: '#f9fafb',
    textAlign: 'center',
    letterSpacing: '4px', // Creates space for OTP digits
    transition: 'all 0.2s ease'
  },
  btnSubmit: {
    width: '100%',
    padding: '16px',
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '12px',
    boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)',
    transition: 'all 0.3s'
  },
  alert: {
    padding: '14px',
    borderRadius: '10px',
    fontSize: '0.85rem',
    marginBottom: '24px',
    fontWeight: '600',
    borderLeft: '4px solid'
  },
  footerLink: {
    marginTop: '28px',
    paddingTop: '20px',
    borderTop: '1px solid #f1f5f9'
  },
  link: {
    color: colors.primary,
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600'
  }
};

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP code.');
      setLoading(false);
      return;
    }

    try {
      await axios.post('/api/user/verify-otp', {
        otp: otp
      }, { 
        withCredentials: true,
        timeout: 10000  // 10 second timeout
      });
      setMessage('✓ OTP verified successfully! Redirecting to reset password...');
      setTimeout(() => navigate('/user/reset-password'), 1200);
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your internet connection.');
      } else {
        setError(err.response?.data?.message || 'Invalid OTP. Please check and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <div style={styles.iconHeader}>📩</div>
        <h2 style={styles.h2}>Verify OTP</h2>
        <span style={styles.subtitle}>Enter the 6-digit code sent to your email</span>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ ...styles.alert, backgroundColor: '#fff1f2', color: colors.error, borderLeftColor: colors.error }}>
              {error}
            </div>
          )}
          {message && (
            <div style={{ ...styles.alert, backgroundColor: '#f0fdf4', color: colors.success, borderLeftColor: colors.success }}>
              {message}
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>6-Digit Passcode</label>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="000000"
              maxLength={6}
              style={{
                ...styles.input,
                borderColor: isFocused ? colors.secondary : colors.border,
                backgroundColor: isFocused ? '#fff' : '#f9fafb'
              }}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              ...styles.btnSubmit, 
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }} 
            disabled={loading || otp.length !== 6}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#283593')}
            onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary}
          >
            {loading ? '⏳ Verifying OTP...' : '✓ Verify & Continue'}
          </button>
        </form>

        <div style={styles.footerLink}>
          <a href="/user/login" style={styles.link}>← Return to Login</a>
        </div>
      </div>
    </div>
  );
}