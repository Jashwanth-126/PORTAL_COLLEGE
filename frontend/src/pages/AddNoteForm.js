import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f6fa',
    padding: '20px'
  },
  header: {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)'
  },
  h1: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  backBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '10px 24px',
    borderRadius: '6px',
    textDecoration: 'none',
    transition: 'all 0.3s',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none'
  },
  backBtnHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)'
  },
  content: {
    maxWidth: '650px',
    margin: '0 auto'
  },
  form: {
    background: 'white',
    padding: '35px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  formGroup: {
    marginBottom: '28px'
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    color: '#2c3e50',
    fontWeight: 600,
    fontSize: '0.95rem'
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'all 0.3s',
    fontFamily: 'inherit'
  },
  inputFocus: {
    outline: 'none',
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
  },
  textarea: {
    width: '100%',
    padding: '12px 14px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
    transition: 'all 0.3s',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '120px'
  },
  noteTypeOptions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '18px',
    marginTop: '12px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '0.95rem',
    color: '#555',
    userSelect: 'none'
  },
  radio: {
    marginRight: '10px',
    cursor: 'pointer',
    width: 'auto',
    padding: 0,
    accentColor: '#667eea'
  },
  radioLabelSpan: {
    fontWeight: 500
  },
  fileHelpText: {
    margin: '8px 0 12px 0',
    fontSize: '0.85rem',
    color: '#999'
  },
  fileSelected: {
    marginTop: '10px',
    padding: '10px',
    background: '#efe',
    color: '#3c3',
    borderRadius: '6px',
    fontSize: '0.9rem'
  },
  btn: {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  },
  btnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  alert: {
    padding: '15px 16px',
    marginBottom: '20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 500,
    borderLeft: '4px solid'
  },
  alertError: {
    backgroundColor: '#fee',
    color: '#c33',
    borderLeftColor: '#c33'
  },
  alertSuccess: {
    backgroundColor: '#efe',
    color: '#3c3',
    borderLeftColor: '#3c3'
  }
};

export default function AddNoteForm() {
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [noteType, setNoteType] = useState('Link');
  const [formData, setFormData] = useState({
    title: '',
    content_input: '',
    file_upload: null
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login');
    }
    fetchSections();
  }, [navigate]);

  const fetchSections = async () => {
    try {
      const response = await axios.get('/api/admin/syllabus_manager', { withCredentials: true });
      setSections(response.data.sections || []);
    } catch (err) {
      setError('Failed to load sections');
    }
  };

  const fetchSubjects = async (sectionId) => {
    try {
      const response = await axios.get('/api/admin/syllabus_manager', {
        params: { section_id: sectionId },
        withCredentials: true
      });
      setSubjects(response.data.syllabus_subjects || []);
    } catch (err) {
      setError('Failed to load subjects');
      setSubjects([]);
    }
  };

  const handleSectionChange = (e) => {
    const id = e.target.value;
    setSelectedSection(id);
    setSelectedSubject('');
    setError('');
    if (id) fetchSubjects(id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid PDF or Image file (JPG, PNG)');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10 MB');
        return;
      }
      setFormData({
        ...formData,
        file_upload: file
      });
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSection || !selectedSubject) {
      setError('Please select section and subject');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a note title');
      return;
    }

    if ((noteType === 'Link' || noteType === 'Text') && !formData.content_input.trim()) {
      setError(`Please enter ${noteType === 'Link' ? 'link URL' : 'note content'}`);
      return;
    }

    if (noteType === 'PDF' && !formData.file_upload) {
      setError('Please upload a PDF file');
      return;
    }

    if (noteType === 'Image' && !formData.file_upload) {
      setError('Please upload an image file');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const data = new FormData();
      data.append('syllabus_subject_id', selectedSubject);
      data.append('title', formData.title.trim());
      data.append('note_type', noteType);
      
      if ((noteType === 'PDF' || noteType === 'Image') && formData.file_upload) {
        data.append('file_upload', formData.file_upload);
      } else {
        data.append('content_input', formData.content_input.trim());
      }

      const res = await axios.post('/api/admin/add_note', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (res.data && res.data.success) {
        setMessage('Note added successfully!');
        setFormData({
          title: '',
          content_input: '',
          file_upload: null
        });
        setSelectedSubject('');
        setNoteType('Link');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError(res.data?.message || 'Failed to add note');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add note');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.h1}>Upload Study Notes</h1>
        <a href="/admin/dashboard" style={styles.backBtn} onMouseEnter={(e) => Object.assign(e.target.style, styles.backBtnHover)} onMouseLeave={(e) => Object.assign(e.target.style, {transform: 'none', boxShadow: 'none'})}>Back to Dashboard</a>
      </div>

      <div style={styles.content}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label htmlFor="section" style={styles.label}>Section *</label>
              <select
                id="section"
                value={selectedSection}
                onChange={handleSectionChange}
                style={styles.input}
                required
              >
                <option value="">Choose Section</option>
                {sections.map(section => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="subject" style={styles.label}>Subject *</label>
              <select
                id="subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={styles.input}
                required
                disabled={!selectedSection}
              >
                <option value="">Choose Subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subject_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="title" style={styles.label}>Note Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Chapter 1 Notes, Important Formulas"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Note Type *</label>
            <div style={styles.noteTypeOptions}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="noteType"
                  value="Link"
                  checked={noteType === 'Link'}
                  onChange={(e) => setNoteType(e.target.value)}
                  style={styles.radio}
                />
                <span style={styles.radioLabelSpan}>🔗 Link</span>
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="noteType"
                  value="Text"
                  checked={noteType === 'Text'}
                  onChange={(e) => setNoteType(e.target.value)}
                  style={styles.radio}
                />
                <span style={styles.radioLabelSpan}>📝 Text</span>
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="noteType"
                  value="PDF"
                  checked={noteType === 'PDF'}
                  onChange={(e) => setNoteType(e.target.value)}
                  style={styles.radio}
                />
                <span style={styles.radioLabelSpan}>📄 PDF</span>
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="noteType"
                  value="Image"
                  checked={noteType === 'Image'}
                  onChange={(e) => setNoteType(e.target.value)}
                  style={styles.radio}
                />
                <span style={styles.radioLabelSpan}>🖼️ Image</span>
              </label>
            </div>
          </div>

          {(noteType === 'PDF' || noteType === 'Image') ? (
            <div style={styles.formGroup}>
              <label htmlFor="file" style={styles.label}>Upload File ({noteType}) *</label>
              <p style={styles.fileHelpText}>
                {noteType === 'PDF' ? 'PDF files up to 10 MB' : 'JPEG, PNG images up to 10 MB'}
              </p>
              <input
                type="file"
                id="file"
                name="file_upload"
                onChange={handleFileChange}
                accept={noteType === 'PDF' ? '.pdf' : '.jpg,.jpeg,.png'}
                style={styles.input}
                required
              />
              {formData.file_upload && (
                <p style={styles.fileSelected}>✓ {formData.file_upload.name}</p>
              )}
            </div>
          ) : (
            <div style={styles.formGroup}>
              <label htmlFor="content" style={styles.label}>Content *</label>
              <textarea
                id="content"
                name="content_input"
                value={formData.content_input}
                onChange={handleInputChange}
                placeholder={noteType === 'Link' ? 'Paste the URL here (e.g., https://example.com)' : 'Enter the note content here...'}
                style={styles.textarea}
                rows="6"
                required
              />
            </div>
          )}

          {error && <div style={{...styles.alert, ...styles.alertError}}>{error}</div>}
          {message && <div style={{...styles.alert, ...styles.alertSuccess}}>{message}</div>}

          <button type="submit" style={{...styles.btn, ...styles.btnPrimary, ...(loading || !selectedSection || !selectedSubject ? styles.btnDisabled : {})}} disabled={loading || !selectedSection || !selectedSubject}>
            {loading ? 'Uploading...' : 'Upload Note'}
          </button>
        </form>
      </div>
    </div>
  );
}

