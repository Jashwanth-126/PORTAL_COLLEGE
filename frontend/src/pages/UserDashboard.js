import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

// SDC PU College Student Theme
const colors = {
  primary: '#1a237e',   // Navy
  secondary: '#fbc02d', // Gold
  bg: '#f8fafc',
  white: '#ffffff',
  text: '#1e293b',
  accent: '#e0e7ff'
};

const styles = {
  dashboard: {
    minHeight: '100vh',
    backgroundColor: colors.bg,
    fontFamily: "'Inter', sans-serif",
  },
  navbar: {
    background: colors.primary,
    padding: '15px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: colors.white,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  navBrand: { margin: 0, fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.5px' },
  btnLogout: {
    backgroundColor: 'transparent',
    color: colors.secondary,
    border: `1.5px solid ${colors.secondary}`,
    padding: '6px 16px',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: '0.3s'
  },
  container: {
    maxWidth: '1000px',
    margin: '50px auto',
    padding: '0 20px'
  },
  welcomeHeader: {
    marginBottom: '40px'
  },
  greeting: { fontSize: '2rem', color: colors.primary, fontWeight: '800', margin: 0 },
  subGreeting: { color: '#64748b', fontSize: '1rem', marginTop: '5px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px'
  },
  card: {
    background: colors.white,
    padding: '35px',
    borderRadius: '24px',
    textDecoration: 'none',
    color: colors.text,
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  iconWrapper: {
    width: '70px',
    height: '70px',
    backgroundColor: colors.bg,
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    marginBottom: '20px',
    transition: '0.3s'
  },
  cardTitle: { margin: '0 0 10px 0', fontSize: '1.25rem', fontWeight: '700', color: colors.primary },
  cardDesc: { margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5' }
};

function UserDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Student';

  const handleLogout = () => {
    localStorage.clear(); // Clears all auth and student data
    navigate('/user/login');
  };

  const menuItems = [
    { to: "/student/attendance", title: "My Attendance", desc: "Track your presence and verify eligibility for exams.", icon: "📅" },
    { to: "/student/marks", title: "Academic Results", desc: "View detailed performance reports and marks sheets.", icon: "🏆" },
    { to: "/student/assessments", title: "Tests & Assessments", desc: "Attempt quizzes and view your assessment results.", icon: "📝" },
    { to: "/student/syllabus", title: "Library & Notes", desc: "Download study materials and view course syllabus.", icon: "📖" },
  ];

  return (
    <div style={styles.dashboard}>
      <nav style={styles.navbar}>
        <h2 style={styles.navBrand}>SDC STUDENT PORTAL</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Session: 2025-26</span>
          <button 
            onClick={handleLogout} 
            style={styles.btnLogout}
            onMouseEnter={(e) => { e.target.style.backgroundColor = colors.secondary; e.target.style.color = colors.primary; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = colors.secondary; }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.welcomeHeader}>
          <h1 style={styles.greeting}>Hello, {userName}!</h1>
          <p style={styles.subGreeting}>Welcome back to your academic overview at SDC PU College.</p>
        </div>
        
        <div style={styles.grid}>
          {menuItems.map((item, index) => (
            <Link 
              key={index}
              to={item.to} 
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.borderColor = colors.secondary;
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
              }}
            >
              <div style={styles.iconWrapper}>{item.icon}</div>
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p style={styles.cardDesc}>{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} SDC Pre-University College | Developed for Excellence
      </footer>
    </div>
  );
}

export default UserDashboard;