import React from 'react';
import { Link } from 'react-router-dom';

// SDC PU College Branding
const colors = {
  primary: '#1a237e',   // Navy
  secondary: '#fbc02d', // Gold
  bg: '#f8f9fb',
  white: '#ffffff',
  text: '#2c3e50',
  textLight: '#546e7a'
};

const styles = {
  homePage: {
    minHeight: '100vh',
    backgroundColor: colors.bg,
    fontFamily: "'Inter', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  heroSection: {
    width: '100%',
    padding: '80px 20px',
    background: `linear-gradient(135deg, ${colors.primary} 0%, #0d124a 100%)`,
    color: colors.white,
    textAlign: 'center',
    clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0% 100%)', // Elegant bottom slant
    marginBottom: '40px'
  },
  h1: {
    fontSize: '3rem',
    margin: '0 0 15px 0',
    fontWeight: '800',
    letterSpacing: '-1px'
  },
  collegeTagline: {
    fontSize: '1.2rem',
    opacity: '0.9',
    fontWeight: '400',
    maxWidth: '700px',
    margin: '0 auto'
  },
  portalContainer: {
    display: 'flex',
    gap: '30px',
    maxWidth: '900px',
    width: '100%',
    padding: '20px',
    marginTop: '-80px', // Pull cards into the hero section
    zIndex: 10
  },
  portalCard: {
    flex: 1,
    background: colors.white,
    padding: '40px 30px',
    borderRadius: '20px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
    textAlign: 'center',
    textDecoration: 'none',
    border: '1px solid transparent',
    transition: 'all 0.3s ease'
  },
  iconBox: {
    fontSize: '2.5rem',
    marginBottom: '20px',
    display: 'inline-block'
  },
  h2: {
    color: colors.primary,
    fontSize: '1.5rem',
    margin: '0 0 10px 0'
  },
  p: {
    color: colors.textLight,
    fontSize: '0.95rem',
    lineHeight: '1.5',
    marginBottom: '25px'
  },
  btn: {
    display: 'inline-block',
    padding: '12px 30px',
    borderRadius: '8px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '0.85rem',
    transition: 'all 0.2s'
  },
  featureBar: {
    marginTop: '60px',
    display: 'flex',
    gap: '40px',
    padding: '20px',
    borderTop: `1px solid ${colors.secondary}`
  },
  featureItem: {
    fontSize: '0.85rem',
    color: colors.textLight,
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
};

function HomePage() {
  return (
    <div style={styles.homePage}>
      <div style={styles.heroSection}>
        <h1 style={styles.h1}>SDC PU College</h1>
        <p style={styles.collegeTagline}>
          Empowering students through academic excellence and holistic development since inception.
        </p>
      </div>

      <div style={styles.portalContainer}>
        {/* Admin Portal Card */}
        <Link 
          to="/admin/login" 
          style={styles.portalCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.borderColor = colors.secondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <div style={styles.iconBox}>🏛️</div>
          <h2 style={styles.h2}>Administrative Portal</h2>
          <p style={styles.p}>Secure access for staff to manage attendance, marks, and student records.</p>
          <span style={{ ...styles.btn, backgroundColor: colors.primary, color: colors.white }}>
            Admin Login
          </span>
        </Link>

        {/* Student Portal Card */}
        <Link 
          to="/user/login" 
          style={styles.portalCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-10px)';
            e.currentTarget.style.borderColor = colors.secondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <div style={styles.iconBox}>🎓</div>
          <h2 style={styles.h2}>Student Portal</h2>
          <p style={styles.p}>View your attendance, performance reports, and download study resources.</p>
          <span style={{ ...styles.btn, backgroundColor: colors.secondary, color: colors.primary }}>
            Student Login
          </span>
        </Link>
      </div>

      <div style={styles.featureBar}>
        <div style={styles.featureItem}>✅ Real-time Attendance</div>
        <div style={styles.featureItem}>✅ Progress Reports</div>
        <div style={styles.featureItem}>✅ Digital Resources</div>
        <div style={styles.featureItem}>✅ Syllabus Tracking</div>
      </div>

      <footer style={{ marginTop: 'auto', padding: '30px', fontSize: '0.8rem', color: colors.textLight }}>
        © {new Date().getFullYear()} SDC Pre-University College. Dedicated to Future Leaders.
      </footer>
    </div>
  );
}

export default HomePage;