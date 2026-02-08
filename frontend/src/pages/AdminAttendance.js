import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Consistent SDC PU College Palette
const colors = {
  primary: '#1a237e', // Navy
  secondary: '#fbc02d', // Gold
  bg: '#f4f7f9',
  white: '#ffffff',
  text: '#2c3e50',
  science: '#e8f5e9', // Light green tint
  commerce: '#fff3e0', // Light orange tint
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
    fontWeight: '600',
    transition: '0.3s'
  },
  dateCard: {
    background: colors.white,
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
  },
  input: {
    padding: '10px 15px',
    borderRadius: '6px',
    border: `1.px solid ${colors.border}`,
    fontSize: '1rem',
    outline: 'none'
  },
  panelContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px'
  },
  panel: {
    background: colors.white,
    padding: '25px',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
  },
  panelTitle: {
    fontSize: '1.2rem',
    color: colors.primary,
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: `2px solid ${colors.secondary}`,
    display: 'inline-block'
  },
  classGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '15px'
  },
  classCard: {
    padding: '20px 10px',
    borderRadius: '10px',
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.white,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    fontWeight: '600',
    color: colors.text,
    boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
  },
  loadBtn: {
    backgroundColor: colors.secondary,
    color: colors.primary,
    border: 'none',
    padding: '11px 25px',
    borderRadius: '6px',
    fontWeight: '700',
    cursor: 'pointer'
  }
};

export default function AdminAttendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [scienceClasses, setScienceClasses] = useState([]);
  const [commerceClasses, setCommerceClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login');
      return;
    }
    fetchClasses();
  }, [navigate]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/attendance', { withCredentials: true });
      setScienceClasses(response.data.science_classes || []);
      setCommerceClasses(response.data.commerce_classes || []);
      setError('');
    } catch (err) {
      setError('Failed to load academic classes');
    } finally {
      setLoading(false);
    }
  };

  const handleClassClick = (classId) => {
    navigate(`/admin/manage-sections?classId=${classId}&date=${selectedDate}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Attendance Management</h1>
          <span style={{color: '#7f8c8d', fontSize: '0.85rem'}}>SDC PU College Official Portal</span>
        </div>
        <a href="/admin/dashboard" style={styles.backBtn}>Back to Dashboard</a>
      </div>

      <div style={styles.dateCard}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <label style={{fontSize: '0.8rem', fontWeight: '700', marginBottom: '5px', color: colors.primary}}>Select Date</label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
            style={styles.input}
          />
        </div>
        <button onClick={fetchClasses} style={styles.loadBtn}>Sync Classes</button>
        {selectedDate && (
          <div style={{marginLeft: 'auto', textAlign: 'right'}}>
            <span style={{display: 'block', fontSize: '0.8rem', color: '#7f8c8d'}}>Active Session</span>
            <strong style={{color: colors.primary}}>{new Date(selectedDate).toDateString()}</strong>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{textAlign: 'center', padding: '50px', color: colors.primary}}>Initializing Classes...</div>
      ) : (
        <div style={styles.panelContainer}>
          {/* Science Section */}
          <div style={styles.panel}>
            <h3 style={styles.panelTitle}>Science Stream</h3>
            <div style={styles.classGrid}>
              {scienceClasses.map(cls => (
                <div 
                  key={cls.id} 
                  style={{...styles.classCard, borderLeft: `4px solid #4caf50` }} 
                  onClick={() => handleClassClick(cls.id)}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  {cls.name}
                </div>
              ))}
            </div>
          </div>

          {/* Commerce Section */}
          <div style={styles.panel}>
            <h3 style={styles.panelTitle}>Commerce Stream</h3>
            <div style={styles.classGrid}>
              {commerceClasses.map(cls => (
                <div 
                  key={cls.id} 
                  style={{...styles.classCard, borderLeft: `4px solid #ff9800` }} 
                  onClick={() => handleClassClick(cls.id)}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  {cls.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}