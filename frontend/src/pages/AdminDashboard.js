import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Unified SDC PU College Style Guide
const colors = {
  primary: '#1a237e',   // Navy
  secondary: '#fbc02d', // Gold
  accent: '#c5cae9',    // Light Indigo
  bg: '#f0f2f5',
  white: '#ffffff',
  text: '#2c3e50',
  textLight: '#7f8c8d'
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
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  navBrand: {
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: '700',
    letterSpacing: '1px'
  },
  welcomeBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  btnLogout: {
    backgroundColor: colors.secondary,
    color: colors.primary,
    border: 'none',
    padding: '8px 20px',
    borderRadius: '6px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  container: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '0 20px'
  },
  hero: {
    marginBottom: '40px',
    borderLeft: `6px solid ${colors.secondary}`,
    paddingLeft: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px'
  },
  card: {
    background: colors.white,
    padding: '30px',
    borderRadius: '16px',
    textDecoration: 'none',
    color: colors.text,
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
    transition: 'all 0.3s ease',
    border: '1px solid transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  cardIcon: {
    fontSize: '2rem',
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '12px',
    background: colors.bg
  },
  cardTitle: {
    margin: '0 0 10px 0',
    fontSize: '1.2rem',
    fontWeight: '700',
    color: colors.primary
  },
  cardDesc: {
    margin: 0,
    fontSize: '0.9rem',
    color: colors.textLight,
    lineHeight: '1.4'
  }
};

function AdminDashboard() {
  const navigate = useNavigate();
  const adminName = localStorage.getItem('adminName') || 'Administrator';

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminName');
    navigate('/admin/login');
  };

  // Menu configuration for easier rendering
  const menuItems = [
    { to: "/admin/register-student", title: "Register Student", desc: "Enroll new students and assign roll numbers.", icon: "👤" },
    { to: "/admin/mark-attendance", title: "Mark Attendance", desc: "Daily attendance logs for Science and Commerce.", icon: "📅" },
    { to: "/admin/attendance-report", title: "Attendance Report", desc: "Detailed percentage and deficiency reports.", icon: "📊" },
    { to: "/admin/marks-entry", title: "Enter Marks", desc: "Input internal and terminal exam scores.", icon: "✍️" },
    { to: "/admin/marks-report", title: "View Marks Report", desc: "Analyze student performance by subject.", icon: "📈" },
    { to: "/admin/quiz-management", title: "Tests & Assessments", desc: "Create quizzes, manage assessments and view rankings.", icon: "📝" },
    { to: "/admin/syllabus", title: "Manage Syllabus", desc: "Update curriculum and tracking for the term.", icon: "📚" },
    { to: "/admin/notes", title: "Upload Notes", desc: "Push PDF/Image study materials to students.", icon: "📤" },
    { to: "/admin/manage-sections", title: "Manage Sections", desc: "Configure class strengths and stream settings.", icon: "🏛️" },
  ];

  return (
    <div style={styles.dashboard}>
      <nav style={styles.navbar}>
        <h2 style={styles.navBrand}>SDC PU COLLEGE | ADMIN</h2>
        <div style={styles.welcomeBox}>
          <span style={{fontWeight: '500'}}>Welcome, {adminName}</span>
          <button 
            onClick={handleLogout} 
            style={styles.btnLogout}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.hero}>
          <h1 style={{color: colors.primary, margin: '0 0 5px 0'}}>Management Console</h1>
          <p style={{color: colors.textLight, margin: 0}}>Access academic records and institutional tools.</p>
        </div>
        
        <div style={styles.grid}>
          {menuItems.map((item, index) => (
            <Link 
              key={index}
              to={item.to} 
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = colors.secondary;
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)';
              }}
            >
              <div style={styles.cardIcon}>{item.icon}</div>
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p style={styles.cardDesc}>{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;