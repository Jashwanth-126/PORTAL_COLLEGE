import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Unified SDC PU College Style
const colors = {
  primary: '#1a237e',
  secondary: '#fbc02d',
  bg: '#f4f7f9',
  white: '#ffffff',
  text: '#2c3e50',
  danger: '#d32f2f', // For low attendance
  success: '#2e7d32', // For good attendance
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
  card: {
    background: colors.white,
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    marginBottom: '30px',
    border: `1px solid ${colors.border}`
  },
  formRow: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-end',
    flexWrap: 'wrap'
  },
  formGroup: { flex: '1', minWidth: '200px' },
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
    fontSize: '0.9rem',
    outline: 'none'
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 8px',
    marginTop: '20px'
  },
  th: {
    backgroundColor: 'transparent',
    color: colors.primary,
    textAlign: 'left',
    padding: '12px 15px',
    fontSize: '0.85rem',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  tr: {
    backgroundColor: colors.white,
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    borderRadius: '8px'
  },
  td: {
    padding: '15px',
    fontSize: '0.95rem',
    color: colors.text,
    borderBottom: 'none'
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    color: 'white',
    padding: '12px 25px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '700',
    cursor: 'pointer'
  },
  btnDownload: {
    backgroundColor: colors.secondary,
    color: colors.primary,
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '20px'
  }
};

export default function AttendanceReport() {
  const [sections, setSections] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [monthYear, setMonthYear] = useState(new Date().toISOString().slice(0, 7));
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) navigate('/admin/login');
    fetchSections();
  }, [navigate]);

  const fetchSections = async () => {
    try {
      const response = await axios.get('/api/attendance_report', { withCredentials: true });
      setSections(response.data.sections || []);
      setClasses(response.data.classes || []);
    } catch (err) { console.error('Failed to load sections'); }
  };

  const handleDownloadCSV = () => {
    if (!reportData || !reportData.data) return;
    const rows = [['Student', 'Total Classes', 'Present', 'Absent', 'Percentage']];
    reportData.data.forEach(r => rows.push([r.name, r.total_classes, r.present, r.absent, `${r.percentage}%`]));
    
    const csvContent = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Attendance_${reportData.month}_${reportData.year}.csv`;
    a.click();
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const [year, month] = monthYear.split('-');
      const response = await axios.post('/api/attendance_report', {
        section_id: selectedSection,
        month: parseInt(month, 10),
        year: parseInt(year, 10)
      }, { withCredentials: true });
      setReportData(response.data || null);
    } catch (err) { console.error('Report failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={{margin: 0, color: colors.primary}}>Attendance Analytics</h1>
          <span style={{color: '#7f8c8d', fontSize: '0.85rem'}}>Monthly Performance Reports</span>
        </div>
        <a href="/admin/dashboard" style={styles.backBtn}>Back to Dashboard</a>
      </div>

      <div style={styles.card}>
        <form onSubmit={handleGenerateReport} style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Academic Section</label>
            <select 
              value={selectedSection} 
              onChange={(e) => setSelectedSection(e.target.value)} 
              style={styles.input} 
              required
            >
              <option value="">Select Section</option>
              {sections.map(sec => {
                const cls = classes.find(c => String(c.id) === String(sec.class_id));
                return <option key={sec.id} value={sec.id}>{cls?.name} - {sec.name}</option>
              })}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Select Month</label>
            <input type="month" value={monthYear} onChange={(e) => setMonthYear(e.target.value)} style={styles.input} required />
          </div>

          <button type="submit" style={styles.btnPrimary} disabled={loading}>
            {loading ? 'Analyzing...' : 'Generate Report'}
          </button>
        </form>
      </div>

      {reportData && (
        <div style={styles.card}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2 style={{color: colors.primary, fontSize: '1.2rem'}}>
              Data for {reportData.month} {reportData.year}
            </h2>
            <button onClick={handleDownloadCSV} style={styles.btnDownload}>Download Excel (CSV)</button>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Student Name</th>
                <th style={styles.th}>Total Sessions</th>
                <th style={styles.th}>Attended</th>
                <th style={styles.th}>Missed</th>
                <th style={styles.th}>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {reportData.data?.map((r, idx) => (
                <tr key={idx} style={styles.tr}>
                  <td style={{...styles.td, fontWeight: '600', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px'}}>{r.name}</td>
                  <td style={styles.td}>{r.total_classes}</td>
                  <td style={{...styles.td, color: colors.success, fontWeight: '700'}}>{r.present}</td>
                  <td style={{...styles.td, color: colors.danger}}>{r.absent}</td>
                  <td style={{...styles.td, borderTopRightRadius: '8px', borderBottomRightRadius: '8px'}}>
                    <span style={{
                      color: r.percentage < 75 ? colors.danger : colors.success,
                      fontWeight: '800',
                      padding: '4px 8px',
                      backgroundColor: r.percentage < 75 ? '#ffebee' : '#e8f5e9',
                      borderRadius: '4px'
                    }}>
                      {r.percentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}