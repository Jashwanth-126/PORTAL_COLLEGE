import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// SDC PU College Digital Library Branding
const colors = {
  primary: '#1a237e', // Navy
  secondary: '#fbc02d', // Gold
  bg: '#f4f7fa',
  white: '#ffffff',
  text: '#2c3e50',
  border: '#d1d9e6',
  accent: '#e8eaf6'
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: colors.bg, padding: '40px 20px', fontFamily: "'Inter', sans-serif" },
  header: { 
    background: colors.white, 
    padding: '25px 40px', 
    borderRadius: '16px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '30px', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    borderLeft: `8px solid ${colors.secondary}`
  },
  h1: { margin: 0, color: colors.primary, fontSize: '1.8rem', fontWeight: '800' },
  backBtn: { background: colors.primary, color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', transition: '0.3s' },
  notesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto' },
  noteCard: { 
    background: colors.white, 
    borderRadius: '16px', 
    overflow: 'hidden', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.04)', 
    transition: 'all 0.3s ease',
    border: `1px solid ${colors.border}`,
    display: 'flex',
    flexDirection: 'column'
  },
  cardHeader: {
    padding: '20px',
    backgroundColor: '#f8faff',
    borderBottom: `1px solid ${colors.border}`,
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  iconBox: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    backgroundColor: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  typeBadge: {
    fontSize: '0.7rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    padding: '4px 8px',
    borderRadius: '6px',
    backgroundColor: colors.secondary,
    color: colors.primary,
    letterSpacing: '0.5px'
  },
  noteContent: { padding: '20px', flex: 1 },
  actionBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'block',
    marginTop: '15px',
    transition: '0.2s'
  },
  footer: {
    padding: '15px 20px',
    backgroundColor: '#f9f9f9',
    borderTop: `1px solid ${colors.border}`,
    fontSize: '0.8rem',
    color: '#7f8c8d',
    display: 'flex',
    justifyContent: 'space-between'
  }
};

export default function StudentNotesView() {
  const [notes, setNotes] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const navigate = useNavigate();
  const { subjectId } = useParams();

  useEffect(() => {
    if (!localStorage.getItem('userAuth')) {
      navigate('/user/login');
      return;
    }
    fetchNotes();
  }, [subjectId, navigate]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/student/notes/${subjectId}`, { withCredentials: true });
      setNotes(res.data.notes || []);
      setSubjectName(res.data.subject_name || 'Subject');
    } catch (err) {
      setError('Resources currently unavailable for this subject.');
    } finally {
      setLoading(false);
    }
  };

  const getNoteIcon = (type) => {
    const icons = { pdf: '📄', image: '🖼️', link: '🔗', text: '📝' };
    return icons[type?.toLowerCase()] || '📚';
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: colors.primary }}>Accessing Library...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>{subjectName} Resources</h1>
          <span style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>Academic Study Materials</span>
        </div>
        <button 
          style={styles.backBtn} 
          onClick={() => navigate('/student/syllabus')}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#283593'}
          onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary}
        >
          ← Back to Syllabus
        </button>
      </div>

      {error && <div style={{ textAlign: 'center', color: 'red', marginBottom: '20px' }}>{error}</div>}

      <div style={styles.notesGrid}>
        {notes.length > 0 ? (
          notes.map(note => (
            <div 
              key={note.id} 
              style={{
                ...styles.noteCard,
                transform: hoveredCard === note.id ? 'translateY(-8px)' : 'none',
                boxShadow: hoveredCard === note.id ? '0 12px 24px rgba(0,0,0,0.1)' : styles.noteCard.boxShadow,
                borderColor: hoveredCard === note.id ? colors.secondary : colors.border
              }}
              onMouseEnter={() => setHoveredCard(note.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.cardHeader}>
                <div style={styles.iconBox}>{getNoteIcon(note.note_type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={styles.typeBadge}>{note.note_type}</div>
                  <h3 style={{ margin: '5px 0 0 0', fontSize: '1.05rem', color: colors.primary }}>{note.title}</h3>
                </div>
              </div>

              <div style={styles.noteContent}>
                {note.note_type?.toLowerCase() === 'text' ? (
                  <p style={{ color: colors.text, fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                    {note.content_text?.substring(0, 150)}...
                  </p>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    {note.note_type?.toLowerCase() === 'image' && (
                      <img src={note.content_url} alt="preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
                    )}
                    <a 
                      href={note.content_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={styles.actionBtn}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#283593'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary}
                    >
                      {note.note_type?.toLowerCase() === 'pdf' ? 'Download Resource' : 'View Material'}
                    </a>
                  </div>
                )}
              </div>

              <div style={styles.footer}>
                <span>📅 {new Date(note.created_at).toLocaleDateString()}</span>
                {note.uploaded_by && <span style={{ fontWeight: '600' }}>By {note.uploaded_by}</span>}
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '16px' }}>
            <span style={{ fontSize: '3rem' }}>📁</span>
            <p style={{ fontSize: '1.2rem', color: '#95a5a6' }}>No study materials have been uploaded for this subject yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}