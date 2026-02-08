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
  error: '#d32f2f',
  lightBg: '#f0f2f5'
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
  backBtn: { background: colors.primary, color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', border: 'none' },
  content: { maxWidth: '1000px', margin: '0 auto' },
  card: { background: colors.white, padding: '35px', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: `1px solid ${colors.border}`, marginBottom: '30px' },
  section: { marginBottom: '40px' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: '700', color: colors.primary, marginBottom: '20px', borderBottom: `2px solid ${colors.secondary}`, paddingBottom: '10px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '25px' },
  label: { display: 'block', fontSize: '0.8rem', fontWeight: '700', color: colors.primary, marginBottom: '8px', textTransform: 'uppercase' },
  input: { width: '100%', padding: '12px', border: `1.5px solid ${colors.border}`, borderRadius: '8px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" },
  select: { width: '100%', padding: '12px', border: `1.5px solid ${colors.border}`, borderRadius: '8px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" },
  textarea: { width: '100%', padding: '12px', border: `1.5px solid ${colors.border}`, borderRadius: '8px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', minHeight: '100px', fontFamily: "'Inter', sans-serif", resize: 'vertical' },
  optionGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '15px' },
  optionInput: { padding: '12px', border: `1.5px solid ${colors.border}`, borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" },
  radioGroup: { display: 'flex', gap: '15px', marginTop: '10px', flexWrap: 'wrap' },
  radioLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' },
  radioInput: { cursor: 'pointer', width: '18px', height: '18px', accentColor: colors.primary },
  questionCard: { background: colors.lightBg, padding: '20px', borderRadius: '12px', marginBottom: '15px', border: `2px solid ${colors.border}` },
  questionNumber: { fontSize: '0.85rem', fontWeight: '700', color: colors.primary, marginBottom: '10px', textTransform: 'uppercase' },
  buttonGroup: { display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px' },
  btnPrimary: { padding: '12px 30px', background: colors.primary, color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' },
  btnSecondary: { padding: '12px 30px', background: 'transparent', color: colors.primary, border: `2px solid ${colors.primary}`, borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' },
  btnDanger: { padding: '8px 15px', background: colors.error, color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' },
  alert: { padding: '15px', borderRadius: '8px', marginBottom: '20px', fontWeight: '600', fontSize: '0.95rem' },
  successAlert: { background: '#d4edda', color: '#155724', border: `1px solid #c3e6cb` },
  errorAlert: { background: '#f8d7da', color: '#721c24', border: `1px solid #f5c6cb` }
};

function AdminQuizCreation() {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [duration, setDuration] = useState('30');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) navigate('/admin/login');
    fetchSections();
  }, [navigate]);

  const fetchSections = async () => {
    try {
      const res = await axios.get('/api/sections', { withCredentials: true });
      setSections(res.data.sections || []);
    } catch (err) {
      setError('Failed to load sections');
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      id: Date.now(),
      text: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctOption: '1'
    }]);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const validateForm = () => {
    if (!quizTitle.trim()) {
      setError('Quiz title is required');
      return false;
    }
    if (!selectedSection) {
      setError('Please select a section');
      return false;
    }
    if (!startTime || !endTime) {
      setError('Start and end times are required');
      return false;
    }
    if (new Date(startTime) >= new Date(endTime)) {
      setError('End time must be after start time');
      return false;
    }
    if (questions.length === 0) {
      setError('Add at least one question');
      return false;
    }
    for (let q of questions) {
      if (!q.text.trim() || !q.optionA.trim() || !q.optionB.trim() || !q.optionC.trim() || !q.optionD.trim()) {
        setError('All question fields must be filled');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const quizData = {
        title: quizTitle,
        section_id: selectedSection,
        duration: parseInt(duration),
        start_time: startTime,
        end_time: endTime,
        questions: questions.map(q => ({
          question_text: q.text,
          option_a: q.optionA,
          option_b: q.optionB,
          option_c: q.optionC,
          option_d: q.optionD,
          correct_option: parseInt(q.correctOption)
        }))
      };

      const res = await axios.post('/api/quiz/create', quizData, { withCredentials: true });
      if (res.data?.success) {
        setMessage('Quiz created successfully!');
        setTimeout(() => navigate('/admin/quiz-management'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quiz');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.h1}>Create Quiz / Assessment</h1>
        <button style={styles.backBtn} onClick={() => navigate('/admin/quiz-management')}>← Back</button>
      </div>

      <div style={styles.content}>
        {message && <div style={{...styles.alert, ...styles.successAlert}}>{message}</div>}
        {error && <div style={{...styles.alert, ...styles.errorAlert}}>{error}</div>}

        <div style={styles.card}>
          <form onSubmit={handleSubmit}>
            {/* Quiz Settings */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>📋 Quiz Settings</h3>
              <div style={styles.grid}>
                <div>
                  <label style={styles.label}>Quiz Title</label>
                  <input 
                    style={styles.input} 
                    type="text" 
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="e.g., Physics Mid-Term Quiz"
                  />
                </div>
                <div>
                  <label style={styles.label}>Select Section</label>
                  <select 
                    style={styles.select}
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                  >
                    <option value="">-- Choose Section --</option>
                    {sections.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Duration (minutes)</label>
                  <input 
                    style={styles.input} 
                    type="number" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="5"
                    max="300"
                  />
                </div>
                <div>
                  <label style={styles.label}>Start Time</label>
                  <input 
                    style={styles.input} 
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <label style={styles.label}>End Time</label>
                  <input 
                    style={styles.input} 
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <div style={styles.section}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={styles.sectionTitle}>❓ Questions ({questions.length})</h3>
                <button 
                  type="button"
                  style={styles.btnPrimary}
                  onClick={addQuestion}
                >
                  + Add Question
                </button>
              </div>

              {questions.map((q, idx) => (
                <div key={q.id} style={styles.questionCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={styles.questionNumber}>Question {idx + 1}</span>
                    <button 
                      type="button"
                      style={styles.btnDanger}
                      onClick={() => removeQuestion(q.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <div>
                    <label style={styles.label}>Question Text</label>
                    <textarea 
                      style={styles.textarea}
                      value={q.text}
                      onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                      placeholder="Enter question..."
                    />
                  </div>

                  <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                    <label style={styles.label}>Options</label>
                    <div style={styles.optionGrid}>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: colors.primary, marginBottom: '5px' }}>Option A</div>
                        <input 
                          style={styles.optionInput}
                          type="text"
                          value={q.optionA}
                          onChange={(e) => updateQuestion(q.id, 'optionA', e.target.value)}
                          placeholder="Enter option A"
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: colors.primary, marginBottom: '5px' }}>Option B</div>
                        <input 
                          style={styles.optionInput}
                          type="text"
                          value={q.optionB}
                          onChange={(e) => updateQuestion(q.id, 'optionB', e.target.value)}
                          placeholder="Enter option B"
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: colors.primary, marginBottom: '5px' }}>Option C</div>
                        <input 
                          style={styles.optionInput}
                          type="text"
                          value={q.optionC}
                          onChange={(e) => updateQuestion(q.id, 'optionC', e.target.value)}
                          placeholder="Enter option C"
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: colors.primary, marginBottom: '5px' }}>Option D</div>
                        <input 
                          style={styles.optionInput}
                          type="text"
                          value={q.optionD}
                          onChange={(e) => updateQuestion(q.id, 'optionD', e.target.value)}
                          placeholder="Enter option D"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={styles.label}>Correct Option</label>
                    <div style={styles.radioGroup}>
                      {['1', '2', '3', '4'].map(opt => (
                        <label key={opt} style={styles.radioLabel}>
                          <input 
                            style={styles.radioInput}
                            type="radio"
                            name={`correct-${q.id}`}
                            value={opt}
                            checked={q.correctOption === opt}
                            onChange={(e) => updateQuestion(q.id, 'correctOption', e.target.value)}
                          />
                          Option {String.fromCharCode(64 + parseInt(opt))}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Button Group */}
            <div style={styles.buttonGroup}>
              <button 
                type="button"
                style={styles.btnSecondary}
                onClick={() => navigate('/admin/quiz-management')}
              >
                Cancel
              </button>
              <button 
                type="submit"
                style={styles.btnPrimary}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Quiz'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminQuizCreation;
