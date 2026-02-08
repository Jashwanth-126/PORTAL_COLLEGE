import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Unified SDC PU College Style
const colors = {
  primary: '#1a237e',
  secondary: '#fbc02d',
  bg: '#f4f7f9',
  white: '#ffffff',
  text: '#2c3e50',
  border: '#d1d9e6',
  success: '#2e7d32',
  error: '#d32f2f'
};

const styles = {
  container: { minHeight: '100vh', padding: '40px 20px', backgroundColor: colors.bg, fontFamily: "'Inter', sans-serif" },
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
  h1: { margin: 0, color: colors.primary, fontSize: '1.6rem', fontWeight: '700' },
  backBtn: { background: colors.primary, color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' },
  content: { maxWidth: '1100px', margin: '0 auto' },
  formCard: { background: colors.white, padding: '35px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: `1px solid ${colors.border}` },
  configGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
  label: { display: 'block', fontSize: '0.8rem', fontWeight: '700', color: colors.primary, marginBottom: '8px', textTransform: 'uppercase' },
  input: { width: '100%', padding: '12px', border: `1.5px solid ${colors.border}`, borderRadius: '8px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' },
  th: { padding: '12px 15px', textAlign: 'left', fontSize: '0.85rem', color: colors.primary, fontWeight: '700', textTransform: 'uppercase' },
  tr: { backgroundColor: '#fdfdfd', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  td: { padding: '15px', borderBottom: 'none', fontSize: '0.95rem', color: colors.text },
  markInput: { width: '80px', padding: '8px', border: `1.5px solid ${colors.border}`, borderRadius: '6px', textAlign: 'center', fontWeight: '700', color: colors.primary },
  btnSubmit: { width: '100%', padding: '16px', background: colors.primary, color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', marginTop: '20px', boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)' },
  alert: { padding: '15px', borderRadius: '8px', marginBottom: '20px', fontWeight: '600' }
};

export default function MarksEntry() {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [students, setStudents] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [examDate, setExamDate] = useState(new Date().toISOString().slice(0, 10));
  const [totalMarks, setTotalMarks] = useState('100');
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) navigate('/admin/login');
    fetchSections();
  }, [navigate]);

  const fetchSections = async () => {
    try {
      const res = await axios.get('/api/marks_entry', { withCredentials: true });
      setSections(res.data.sections || []);
    } catch (err) { setError('Failed to load sections'); }
  };

  const handleSectionChange = async (e) => {
    const secId = e.target.value;
    setSelectedSection(secId);
    setStudents([]);
    if (!secId) return;
    try {
      const res = await axios.get(`/api/section/${secId}/students`, { withCredentials: true });
      const studs = res.data.students || [];
      setStudents(studs);
      const m = {};
      studs.forEach(s => { m[s.id] = ''; });
      setMarks(m);
    } catch (err) { setError('Failed to load students'); }
  };

  const handleMarkChange = (studentId, value) => {
    if (value !== '' && (isNaN(value) || Number(value) > Number(totalMarks))) return;
    setMarks(prev => ({ ...prev, [studentId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { section_id: selectedSection, subject_name: subjectName, exam_date: examDate, total_marks: totalMarks, marks: marks };
      const res = await axios.post('/api/marks_entry', payload, { withCredentials: true });
      if (res.data?.success) {
        setMessage('Assessment records updated successfully.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) { setError('Database update failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Assessment Marks Entry</h1>
          <span style={{color: '#7f8c8d', fontSize: '0.85rem'}}>SDC PU College Examination Department</span>
        </div>
        <a href="/admin/dashboard" style={styles.backBtn}>Back to Dashboard</a>
      </div>

      <div style={styles.content}>
        <form onSubmit={handleSubmit} style={styles.formCard}>
          <div style={styles.configGrid}>
            <div>
              <label style={styles.label}>Academic Section</label>
              <select value={selectedSection} onChange={handleSectionChange} style={styles.input}>
                <option value="">Select Section</option>
                {sections.map(s => <option key={s.id} value={s.id}>{s.name || s.section_name}</option>)}
              </select>
            </div>
            <div>
              <label style={styles.label}>Subject</label>
              <input value={subjectName} onChange={e => setSubjectName(e.target.value)} placeholder="Physics" style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Exam Date</label>
              <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Max Marks</label>
              <input type="number" value={totalMarks} onChange={e => setTotalMarks(e.target.value)} style={styles.input} />
            </div>
          </div>

          {error && <div style={{...styles.alert, backgroundColor: '#fee', color: colors.error}}>{error}</div>}
          {message && <div style={{...styles.alert, backgroundColor: '#efe', color: colors.success}}>{message}</div>}

          {students.length > 0 && (
            <div style={{marginTop: '30px'}}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Student Full Name</th>
                    <th style={styles.th}>Roll / Username</th>
                    <th style={{...styles.th, textAlign: 'center'}}>Marks Obtained</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(stu => (
                    <tr key={stu.id} style={styles.tr}>
                      <td style={{...styles.td, fontWeight: '600', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px'}}>{stu.name}</td>
                      <td style={styles.td}>{stu.username}</td>
                      <td style={{...styles.td, textAlign: 'center', borderTopRightRadius: '8px', borderBottomRightRadius: '8px'}}>
                        <input
                          type="text"
                          value={marks[stu.id] ?? ''}
                          onChange={(e) => handleMarkChange(stu.id, e.target.value)}
                          style={styles.markInput}
                        />
                        <span style={{marginLeft: '10px', color: '#95a5a6', fontSize: '0.8rem'}}> / {totalMarks}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="submit" style={styles.btnSubmit} disabled={loading}>
                {loading ? 'Committing to Records...' : 'Verify & Save Marks'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}