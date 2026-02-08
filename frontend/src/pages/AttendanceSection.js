import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Unified SDC PU College Style
const colors = {
  primary: '#1a237e', // Navy
  secondary: '#fbc02d', // Gold
  bg: '#f4f7f9',
  white: '#ffffff',
  present: '#2e7d32',
  absent: '#d32f2f',
  holiday: '#0277bd',
  border: '#d1d9e6',
  text: '#2c3e50',
  textMuted: '#64748b'
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.bg,
    padding: '40px 20px',
    fontFamily: "'Inter', 'Segoe UI', sans-serif"
  },
  header: {
    background: colors.white,
    padding: '25px 40px',
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    borderLeft: `8px solid ${colors.secondary}`
  },
  h1: { margin: 0, color: colors.primary, fontSize: '1.6rem', fontWeight: '800' },
  backBtn: {
    backgroundColor: colors.primary,
    color: 'white',
    padding: '10px 22px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '700',
    transition: '0.3s',
    boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)',
    border: 'none',
    cursor: 'pointer'
  },
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '380px 1fr',
    gap: '30px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px'
  },
  card: {
    background: colors.white,
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
    border: `1px solid ${colors.border}`
  },
  label: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '800',
    color: colors.primary,
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: `1.5px solid ${colors.border}`,
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '15px',
    transition: 'border-color 0.2s',
    color: colors.text
  },
  studentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 25px',
    backgroundColor: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: '15px',
    marginBottom: '12px',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  statusGroup: {
    display: 'flex',
    borderRadius: '10px',
    overflow: 'hidden',
    border: `1px solid ${colors.border}`
  },
  statusBtn: {
    padding: '10px 18px',
    border: 'none',
    backgroundColor: colors.white,
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '700',
    transition: 'all 0.2s',
    borderRight: `1px solid ${colors.border}`
  },
  btnAction: {
    width: '100%',
    padding: '16px',
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(26, 35, 126, 0.2)'
  },
  alert: {
    padding: '15px',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: '15px'
  }
};

export default function AttendanceSection() {
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [newStudent, setNewStudent] = useState({ name: '', username: '' });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login');
    }
    fetchSections();
    const params = new URLSearchParams(location.search);
    const qSection = params.get('sectionId') || params.get('section');
    const qDate = params.get('date');
    if (qDate) setSelectedDate(qDate);
    if (qSection) {
      setSelectedSection(qSection);
      loadStudents(qSection, qDate || '');
    }
  }, [navigate, location]);

  const fetchSections = async () => {
    try {
      const response = await axios.get('/api/admin/syllabus_manager', { withCredentials: true });
      setSections(response.data.sections || []);
    } catch (err) { setError('System error: Unable to load class sections.'); }
  };

  const loadStudents = async (sectionId, date) => {
    try {
      const response = await axios.get(`/api/section/${sectionId}/students?date=${date}`, { withCredentials: true });
      setStudents(response.data.students || []);
    } catch (err) { setError('Failed to retrieve student roster.'); }
  };

  const handleSectionChange = async (e) => {
    const sectionId = e.target.value;
    setSelectedSection(sectionId);
    setNewStudent({ name: '', username: '' });
    if (sectionId) loadStudents(sectionId, selectedDate);
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await axios.post(`/api/section/${selectedSection}/mark_attendance`, {
        date: selectedDate,
        attendance: attendance
      }, { withCredentials: true });
      setMessage('Attendance synchronized successfully.');
      setAttendance({});
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { setError('Update failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Roll Call & Attendance</h1>
          <span style={{ color: colors.textMuted, fontSize: '0.85rem' }}>Institutional Records Department</span>
        </div>
        <button onClick={() => navigate('/admin/dashboard')} style={styles.backBtn}>Return to Dashboard</button>
      </div>

      <div style={styles.mainLayout}>
        {/* Left Sidebar: Controls */}
        <div style={styles.sidebar}>
          <div style={styles.card}>
            <label style={styles.label}>Academic Section</label>
            <select style={styles.input} value={selectedSection} onChange={handleSectionChange} required>
              <option value="">Choose Section</option>
              {sections.map(s => <option key={s.id} value={s.id}>{s.name || `Section ${s.id}`}</option>)}
            </select>

            {selectedSection && (
              <>
                <label style={styles.label}>Select Date</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} max={new Date().toISOString().split('T')[0]} style={styles.input} required />
              </>
            )}
          </div>

          {selectedSection && (
            <div style={{ ...styles.card, borderTop: `5px solid ${colors.secondary}` }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1rem', color: colors.primary }}>Quick Enrollment</h3>
              <label style={styles.label}>Student Name</label>
              <input type="text" placeholder="e.g. Aryan Singh" style={styles.input} value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
              <label style={styles.label}>ID / Username</label>
              <input type="text" placeholder="e.g. SDC202610" style={styles.input} value={newStudent.username} onChange={(e) => setNewStudent({ ...newStudent, username: e.target.value })} />
              <button style={{ ...styles.btnAction, backgroundColor: colors.secondary, color: colors.primary, boxShadow: 'none' }} onClick={() => {/* logic */}}>Enroll Student</button>
            </div>
          )}
        </div>

        {/* Right Content: Student Grid */}
        <div style={styles.card}>
          {students.length > 0 ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h2 style={{ color: colors.primary, fontSize: '1.2rem', margin: 0 }}>Class Roster ({students.length} Students)</h2>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: colors.textMuted }}>DATE: {new Date(selectedDate).toDateString()}</div>
              </div>

              <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
                {students.map(student => (
                  <div key={student.id} style={styles.studentItem}>
                    <span style={{ fontWeight: '700', color: colors.text }}>{student.name}</span>
                    <div style={styles.statusGroup}>
                      <button 
                        type="button" 
                        onClick={() => handleAttendanceChange(student.id, 'Present')}
                        style={{ ...styles.statusBtn, backgroundColor: attendance[student.id] === 'Present' ? colors.present : '#fff', color: attendance[student.id] === 'Present' ? '#fff' : colors.text }}
                      >Present</button>
                      <button 
                        type="button" 
                        onClick={() => handleAttendanceChange(student.id, 'Absent')}
                        style={{ ...styles.statusBtn, backgroundColor: attendance[student.id] === 'Absent' ? colors.absent : '#fff', color: attendance[student.id] === 'Absent' ? '#fff' : colors.text }}
                      >Absent</button>
                      <button 
                        type="button" 
                        onClick={() => handleAttendanceChange(student.id, 'Holiday')}
                        style={{ ...styles.statusBtn, borderRight: 'none', backgroundColor: attendance[student.id] === 'Holiday' ? colors.holiday : '#fff', color: attendance[student.id] === 'Holiday' ? '#fff' : colors.text }}
                      >Holiday</button>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={handleSubmit} style={styles.btnAction} disabled={loading}>
                {loading ? 'Processing...' : 'Submit Attendance Report'}
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📁</div>
              <h3 style={{ color: colors.textMuted }}>No active session found.</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Please select a section to begin roll call.</p>
            </div>
          )}

          {error && <div style={{ ...styles.alert, backgroundColor: '#ffebee', color: colors.absent }}>{error}</div>}
          {message && <div style={{ ...styles.alert, backgroundColor: '#e8f5e9', color: colors.present }}>{message}</div>}
        </div>
      </div>
    </div>
  );
}