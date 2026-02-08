import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Unified SDC PU College Style Guide
const colors = {
  primary: '#1a237e',   // Navy
  secondary: '#fbc02d', // Gold
  bg: '#f4f7f9',
  white: '#ffffff',
  text: '#2c3e50',
  danger: '#e53935',
  border: '#d1d9e6'
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
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    gap: '30px',
    maxWidth: '1300px',
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
    outline: 'none'
  },
  btnPrimary: {
    width: '100%',
    padding: '14px',
    background: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '20px'
  },
  sectionCard: {
    backgroundColor: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  sectionName: {
    fontSize: '1.4rem',
    color: colors.primary,
    margin: '0 0 5px 0',
    fontWeight: '800'
  },
  btnDelete: {
    background: 'transparent',
    color: colors.danger,
    border: `1px solid ${colors.danger}`,
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '600',
    marginTop: '15px'
  }
};

export default function ManageSections() {
  const [scienceClasses, setScienceClasses] = useState([]);
  const [commerceClasses, setCommerceClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedClassName, setSelectedClassName] = useState('');
  const [newSection, setNewSection] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) navigate('/admin/login');
    fetchClasses();
  }, [navigate]);

  const fetchClasses = async () => {
    try {
      const res = await axios.get('/api/attendance', { withCredentials: true });
      setScienceClasses(res.data.science_classes || []);
      setCommerceClasses(res.data.commerce_classes || []);
    } catch (err) { console.error('Load failed'); }
  };

  const fetchSections = async (classId) => {
    try {
      const res = await axios.get(`/api/class/${classId}/sections`, { withCredentials: true });
      setSections(res.data.sections || []);
    } catch (err) { console.error('Sections failed'); }
  };

  const handleClassChange = (e) => {
    const id = e.target.value;
    setSelectedClass(id);
    if (id) {
      const found = [...scienceClasses, ...commerceClasses].find(c => String(c.id) === id);
      setSelectedClassName(found?.name || '');
      fetchSections(id);
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`/api/class/${selectedClass}/sections`, { section_name: newSection.trim() }, { withCredentials: true });
      setNewSection('');
      fetchSections(selectedClass);
      setMessage('New section added to registry.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { console.error('Add failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Section Configuration</h1>
          <span style={{color: '#7f8c8d', fontSize: '0.85rem'}}>SDC PU College Institutional Registry</span>
        </div>
        <a href="/admin/dashboard" style={styles.backBtn}>Back to Dashboard</a>
      </div>

      <div style={styles.contentGrid}>
        {/* Left Side: Create Section */}
        <div style={styles.card}>
          <h2 style={{color: colors.primary, fontSize: '1.2rem', marginBottom: '25px'}}>Register New Section</h2>
          <form onSubmit={handleAddSection}>
            <label style={styles.label}>Academic Stream / Class</label>
            <select style={styles.input} value={selectedClass} onChange={handleClassChange} required>
              <option value="">Select Target Class</option>
              <optgroup label="Science Stream">
                {scienceClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>
              <optgroup label="Commerce Stream">
                {commerceClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>
            </select>

            <label style={styles.label}>Section Designation</label>
            <input 
              style={styles.input} 
              placeholder="e.g. 'A' or 'Alpha'" 
              value={newSection} 
              onChange={(e) => setNewSection(e.target.value)} 
              required 
            />

            <button style={{...styles.btnPrimary, opacity: loading ? 0.7 : 1}} disabled={loading}>
              {loading ? 'Creating...' : 'Create Section'}
            </button>
            {message && <p style={{color: '#2e7d32', textAlign: 'center', fontSize: '0.85rem', marginTop: '15px'}}>{message}</p>}
          </form>
        </div>

        {/* Right Side: Section Grid */}
        <div style={styles.card}>
          <h2 style={{color: colors.primary, fontSize: '1.2rem', marginBottom: '20px'}}>
            {selectedClassName ? `Active Sections: ${selectedClassName}` : 'Select a Class to View Sections'}
          </h2>
          
          <div style={styles.sectionGrid}>
            {sections.map(section => (
              <div 
                key={section.id} 
                style={styles.sectionCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = colors.secondary;
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{fontSize: '0.7rem', color: '#95a5a6', textTransform: 'uppercase', marginBottom: '5px'}}>Section</div>
                <h3 style={styles.sectionName}>{section.name}</h3>
                <div style={{fontSize: '0.7rem', color: '#bdc3c7'}}>Ref ID: {section.id}</div>
                <button 
                  style={styles.btnDelete}
                  onClick={() => {/* delete logic */}}
                >
                  Remove Section
                </button>
              </div>
            ))}
          </div>
          {selectedClass && sections.length === 0 && (
            <div style={{textAlign: 'center', padding: '40px', color: '#95a5a6', border: '2px dashed #eee', borderRadius: '12px'}}>
              No sections currently mapped to this class.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}