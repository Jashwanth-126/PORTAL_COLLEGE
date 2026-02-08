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
  h1: { margin: 0, color: colors.primary, fontSize: '1.6rem', fontWeight: '700' },
  backBtn: { background: colors.primary, color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' },
  content: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px' },
  sidebar: { background: colors.white, padding: '25px', borderRadius: '16px', border: `1px solid ${colors.border}`, height: 'fit-content' },
  searchBar: { width: '100%', padding: '10px', borderRadius: '8px', border: `1.5px solid ${colors.border}`, marginBottom: '10px', fontSize: '0.9rem', outline: 'none' },
  examCard: { 
    padding: '15px', 
    borderRadius: '10px', 
    border: `1px solid ${colors.border}`, 
    marginBottom: '12px', 
    cursor: 'pointer', 
    transition: 'all 0.2s',
    backgroundColor: '#fff'
  },
  activeCard: { borderColor: colors.primary, backgroundColor: colors.accent, borderLeft: `5px solid ${colors.primary}` },
  reportCard: { background: colors.white, padding: '30px', borderRadius: '16px', border: `1px solid ${colors.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' },
  th: { padding: '12px 15px', textAlign: 'left', fontSize: '0.8rem', color: colors.primary, fontWeight: '700', textTransform: 'uppercase' },
  tr: { backgroundColor: '#fdfdfd', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  td: { padding: '15px', fontSize: '0.9rem', color: colors.text },
  btnDownload: { background: colors.secondary, color: colors.primary, padding: '8px 16px', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', float: 'right' }
};

export default function MarksReport() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [marksData, setMarksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchSubject, setSearchSubject] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) navigate('/admin/login');
    fetchExams();
  }, [navigate]);

  const fetchExams = async () => {
    try {
      const res = await axios.get('/api/marks_report', { withCredentials: true });
      setExams(res.data.all_exams_data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSelectExam = async (exam) => {
    setSelectedExam(exam);
    try {
      const res = await axios.post('/api/marks_report', {
        section_id: exam.section_id,
        subject_name: exam.subject_name,
        exam_date: exam.exam_date
      }, { withCredentials: true });
      setMarksData({ students: res.data.students || [], marks: res.data.marks_map || {}, total_marks: res.data.total_marks || 0 });
    } catch (err) { console.error(err); }
  };

  const filteredExams = exams.filter(exam => 
    exam.subject_name.toLowerCase().includes(searchSubject.toLowerCase()) && 
    exam.exam_date.includes(searchDate)
  );

  if (loading) return <div style={{textAlign: 'center', padding: '100px', color: colors.primary}}>Accessing Examination Records...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Marks Analytics Report</h1>
          <span style={{color: '#7f8c8d', fontSize: '0.85rem'}}>Institutional Performance Tracking</span>
        </div>
        <a href="/admin/dashboard" style={styles.backBtn}>Back to Dashboard</a>
      </div>

      <div style={styles.content}>
        {/* Sidebar Selection */}
        <div style={styles.sidebar}>
          <h2 style={{fontSize: '1rem', color: colors.primary, marginBottom: '15px'}}>Select Examination</h2>
          <input 
            style={styles.searchBar} 
            placeholder="Search Subject..." 
            value={searchSubject} 
            onChange={(e) => setSearchSubject(e.target.value)} 
          />
          <input 
            type="date" 
            style={styles.searchBar} 
            value={searchDate} 
            onChange={(e) => setSearchDate(e.target.value)} 
          />
          
          <div style={{marginTop: '20px', maxHeight: '500px', overflowY: 'auto'}}>
            {filteredExams.map((exam, idx) => {
              const isActive = selectedExam?.exam_date === exam.exam_date && selectedExam?.subject_name === exam.subject_name;
              return (
                <div 
                  key={idx} 
                  onClick={() => handleSelectExam(exam)}
                  style={{...styles.examCard, ...(isActive ? styles.activeCard : {})}}
                >
                  <strong style={{display: 'block', color: colors.primary}}>{exam.subject_name}</strong>
                  <span style={{fontSize: '0.8rem', color: '#7f8c8d'}}>{exam.exam_date} | {exam.section_name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Report Display */}
        <div style={styles.reportCard}>
          {selectedExam && marksData ? (
            <>
              <button style={styles.btnDownload} onClick={() => {/* downloadCSV logic */}}>Export CSV</button>
              <h2 style={{color: colors.primary, marginBottom: '5px'}}>{selectedExam.subject_name} Results</h2>
              <p style={{color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '30px'}}>Exam Date: {selectedExam.exam_date} | Max Marks: {marksData.total_marks}</p>
              
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Student Name</th>
                    <th style={styles.th}>Obtained</th>
                    <th style={styles.th}>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {marksData.students.map(stu => {
                    const marks = marksData.marks[stu.id] || 0;
                    const percent = marksData.total_marks > 0 ? ((marks / marksData.total_marks) * 100).toFixed(1) : 0;
                    return (
                      <tr key={stu.id} style={styles.tr}>
                        <td style={{...styles.td, fontWeight: '600', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px'}}>{stu.name}</td>
                        <td style={styles.td}>{marks} / {marksData.total_marks}</td>
                        <td style={{...styles.td, borderTopRightRadius: '8px', borderBottomRightRadius: '8px'}}>
                          <span style={{color: percent >= 35 ? '#2e7d32' : '#d32f2f', fontWeight: '800'}}>
                            {percent}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : (
            <div style={{textAlign: 'center', padding: '60px', color: '#95a5a6'}}>
              <h3>No Report Selected</h3>
              <p>Please choose an exam from the left panel to view student performance.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}