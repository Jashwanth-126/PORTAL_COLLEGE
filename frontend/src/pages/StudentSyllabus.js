import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Unified SDC PU College Style Guide
const colors = {
  primary: '#1a237e', // Navy
  secondary: '#fbc02d', // Gold
  accent: '#3949ab',
  bg: '#f4f7f9',
  white: '#ffffff',
  text: '#2c3e50',
  border: '#d1d9e6'
};

const styles = {
  page: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: "'Inter', sans-serif"
  },
  header: {
    background: colors.white,
    padding: '30px 40px',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    borderLeft: `8px solid ${colors.secondary}`
  },
  h1: { margin: 0, color: colors.primary, fontSize: '1.8rem', fontWeight: '800' },
  subtitle: { color: '#7f8c8d', fontSize: '1rem', marginTop: '5px' },
  subjectsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '25px'
  },
  subjectCard: {
    background: colors.white,
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
    border: `1px solid ${colors.border}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  },
  totalMarksBadge: {
    position: 'absolute',
    top: '0',
    right: '0',
    backgroundColor: colors.secondary,
    color: colors.primary,
    padding: '8px 15px',
    fontSize: '0.85rem',
    fontWeight: '800',
    borderBottomLeftRadius: '15px'
  },
  h3: {
    color: colors.primary,
    margin: '10px 0 20px 0',
    fontSize: '1.4rem',
    fontWeight: '700',
    borderBottom: `2px solid ${colors.bg}`,
    paddingBottom: '10px'
  },
  markItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: `1px solid ${colors.bg}`,
    fontSize: '0.95rem',
    color: colors.text
  },
  markLabel: { fontWeight: '600', color: '#546e7a' },
  markValue: { color: colors.primary, fontWeight: '700' },
  viewNotesBtn: {
    marginTop: '25px',
    display: 'block',
    width: '100%',
    padding: '14px',
    backgroundColor: colors.primary,
    color: 'white',
    textDecoration: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    textAlign: 'center',
    transition: '0.3s',
    boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)'
  }
};

function StudentSyllabus() {
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('userAuth')) {
      navigate('/user/login');
      return;
    }
    fetchSyllabus();
  }, [navigate]);

  const fetchSyllabus = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/student/structured_syllabus', { withCredentials: true });
      setSyllabus(res.data);
    } catch (err) {
      setError('Curriculum currently unavailable. Please contact the department.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '100px', color: colors.primary}}>Loading Curriculum...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Course Syllabus</h1>
          <p style={styles.subtitle}>{syllabus?.section_name} | Academic Year 2026</p>
        </div>
        <span style={{fontSize: '2rem'}}>📖</span>
      </div>
      
      {syllabus && (
        <div style={styles.subjectsList}>
          {syllabus.syllabus_subjects.map((subject) => (
            <div 
              key={subject.id} 
              style={{
                ...styles.subjectCard, 
                transform: hoveredCard === subject.id ? 'translateY(-10px)' : 'none',
                borderColor: hoveredCard === subject.id ? colors.secondary : colors.border,
                boxShadow: hoveredCard === subject.id ? '0 15px 30px rgba(0,0,0,0.1)' : styles.subjectCard.boxShadow
              }}
              onMouseEnter={() => setHoveredCard(subject.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.totalMarksBadge}>{subject.total_marks} MARKS</div>
              
              <h3 style={styles.h3}>{subject.subject_name}</h3>
              
              <div style={styles.markItem}>
                <span style={styles.markLabel}>Theory Exam</span>
                <span style={styles.markValue}>{subject.exam_marks}</span>
              </div>
              <div style={styles.markItem}>
                <span style={styles.markLabel}>Practical / Lab</span>
                <span style={styles.markValue}>{subject.lab_marks}</span>
              </div>
              <div style={{...styles.markItem, borderBottom: 'none'}}>
                <span style={styles.markLabel}>Internals / Assignment</span>
                <span style={styles.markValue}>{subject.assignment_marks}</span>
              </div>

              <Link 
                to={`/student/notes/${subject.id}`}
                style={{
                  ...styles.viewNotesBtn,
                  backgroundColor: hoveredCard === subject.id ? colors.accent : colors.primary
                }}
              >
                Access Study Materials →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentSyllabus;