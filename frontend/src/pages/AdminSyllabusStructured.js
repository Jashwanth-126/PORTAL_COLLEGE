import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Unified SDC PU College Theme
const colors = {
  primary: '#1a237e', // Navy
  secondary: '#fbc02d', // Gold
  bg: '#f8f9fa',
  white: '#ffffff',
  text: '#2c3e50',
  danger: '#e74c3c',
  success: '#27ae60',
  border: '#dee2e6'
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
  card: {
    background: colors.white,
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    marginBottom: '30px',
    border: `1px solid ${colors.border}`
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '15px',
    alignItems: 'flex-end'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: `1.5px solid ${colors.border}`,
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: colors.primary,
    marginBottom: '8px',
    textTransform: 'uppercase'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    backgroundColor: colors.white,
    borderRadius: '12px',
    overflow: 'hidden'
  },
  th: {
    backgroundColor: colors.primary,
    color: colors.white,
    textAlign: 'left',
    padding: '15px',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  td: {
    padding: '15px',
    borderBottom: `1px solid ${colors.border}`,
    fontSize: '0.95rem',
    color: colors.text
  },
  badge: {
    backgroundColor: colors.secondary,
    color: colors.primary,
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: '700',
    fontSize: '0.85rem'
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    width: '100%'
  },
  btnDelete: {
    backgroundColor: 'transparent',
    color: colors.danger,
    border: `1px solid ${colors.danger}`,
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    transition: 'all 0.2s'
  }
};

export default function AdminSyllabusStructured() {
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSectionName, setSelectedSectionName] = useState('');
  const [formData, setFormData] = useState({
    subject_name: '', exam_marks: 0, lab_marks: 0, assignment_marks: 0
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) navigate('/admin/login');
    fetchSections();
  }, [navigate]);

  const fetchSections = async () => {
    try {
      const response = await axios.get('/api/admin/syllabus_manager', { withCredentials: true });
      setSections(response.data.sections || []);
    } catch (err) { setError('Failed to load sections'); }
  };

  const fetchSubjects = async (sectionId) => {
    try {
      const response = await axios.get('/api/admin/syllabus_manager', {
        params: { section_id: sectionId },
        withCredentials: true
      });
      setSubjects(response.data.syllabus_subjects || []);
      setSelectedSectionName(response.data.selected_section_name || '');
    } catch (err) { setError('Failed to load subjects'); }
  };

  const handleSectionChange = (e) => {
    const id = e.target.value;
    setSelectedSection(id);
    if (id) fetchSubjects(id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes('marks') ? parseInt(value) || 0 : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        action: 'save',
        section_id: parseInt(selectedSection),
        ...formData
      };
      const res = await axios.post('/api/admin/syllabus_subject_save', payload, { withCredentials: true });
      if (res.data?.success) {
        setMessage('Subject integrated successfully');
        setFormData({ subject_name: '', exam_marks: 0, lab_marks: 0, assignment_marks: 0 });
        fetchSubjects(selectedSection);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) { setError('Error saving subject'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (subjectId) => {
    if (!window.confirm('Confirm removal of this subject from syllabus?')) return;
    try {
      await axios.post('/api/admin/syllabus_subject_save', {
        action: 'delete',
        section_id: parseInt(selectedSection),
        subject_id_to_delete: subjectId
      }, { withCredentials: true });
      fetchSubjects(selectedSection);
    } catch (err) { setError('Deletion failed'); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Academic Syllabus Manager</h1>
          <span style={{color: '#7f8c8d', fontSize: '0.85rem'}}>SDC PU College Curriculum Control</span>
        </div>
        <a href="/admin/dashboard" style={styles.backBtn}>Back to Dashboard</a>
      </div>

      <div style={{maxWidth: '1100px', margin: '0 auto'}}>
        <div style={styles.card}>
          <h2 style={{fontSize: '1.1rem', color: colors.primary, marginBottom: '20px'}}>Configure New Subject</h2>
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '20px'}}>
              <label style={styles.label}>Academic Section</label>
              <select value={selectedSection} onChange={handleSectionChange} style={styles.input} required>
                <option value="">Select Class/Section</option>
                {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div style={styles.formRow}>
              <div>
                <label style={styles.label}>Subject Name</label>
                <input name="subject_name" value={formData.subject_name} onChange={handleInputChange} placeholder="e.g. Mathematics" style={styles.input} required />
              </div>
              <div>
                <label style={styles.label}>Theory</label>
                <input type="number" name="exam_marks" value={formData.exam_marks} onChange={handleInputChange} style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Practical</label>
                <input type="number" name="lab_marks" value={formData.lab_marks} onChange={handleInputChange} style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Assignment</label>
                <input type="number" name="assignment_marks" value={formData.assignment_marks} onChange={handleInputChange} style={styles.input} />
              </div>
            </div>

            <div style={{marginTop: '25px', display: 'flex', alignItems: 'center', gap: '20px'}}>
              <button type="submit" style={{...styles.btnPrimary, width: '200px'}} disabled={loading}>
                {loading ? 'Adding...' : '+ Add to Syllabus'}
              </button>
              {message && <span style={{color: colors.success, fontWeight: '600'}}>{message}</span>}
              {error && <span style={{color: colors.danger, fontWeight: '600'}}>{error}</span>}
            </div>
          </form>
        </div>

        {selectedSection && (
          <div style={styles.card}>
            <h2 style={{fontSize: '1.1rem', color: colors.primary, marginBottom: '15px'}}>
              Active Curriculum: <span style={{color: colors.secondary}}>{selectedSectionName}</span>
            </h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Subject</th>
                  <th style={styles.th}>Exam</th>
                  <th style={styles.th}>Lab</th>
                  <th style={styles.th}>Internal</th>
                  <th style={styles.th}>Total</th>
                  <th style={{...styles.th, textAlign: 'center'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map(subject => (
                  <tr key={subject.id}>
                    <td style={styles.td}>{subject.subject_name}</td>
                    <td style={styles.td}>{subject.exam_marks}</td>
                    <td style={styles.td}>{subject.lab_marks}</td>
                    <td style={styles.td}>{subject.assignment_marks}</td>
                    <td style={styles.td}>
                      <span style={styles.badge}>
                        {(subject.exam_marks || 0) + (subject.lab_marks || 0) + (subject.assignment_marks || 0)}
                      </span>
                    </td>
                    <td style={{...styles.td, textAlign: 'center'}}>
                      <button 
                        style={styles.btnDelete} 
                        onClick={() => handleDelete(subject.id)}
                        onMouseEnter={(e) => {e.target.style.backgroundColor = colors.danger; e.target.style.color = 'white'}}
                        onMouseLeave={(e) => {e.target.style.backgroundColor = 'transparent'; e.target.style.color = colors.danger}}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}