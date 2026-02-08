import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserLogin from './pages/UserLogin';
import UserDashboard from './pages/UserDashboard';
import StudentAttendance from './pages/StudentAttendance';
import StudentMarks from './pages/StudentMarks';
import StudentSyllabus from './pages/StudentSyllabus';
import AdminAttendance from './pages/AdminAttendance';
import RegisterStudent from './pages/RegisterStudent';
import MarksEntry from './pages/MarksEntry';
import MarksReport from './pages/MarksReport';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import AdminSyllabusStructured from './pages/AdminSyllabusStructured';
import AddNoteForm from './pages/AddNoteForm';
import StudentNotesView from './pages/StudentNotesView';
import ManageSections from './pages/ManageSections';
import AttendanceReport from './pages/AttendanceReport';
import AttendanceSection from './pages/AttendanceSection';
import AdminQuizCreation from './pages/AdminQuizCreation';
import AdminQuizManagement from './pages/AdminQuizManagement';
import AdminQuizResults from './pages/AdminQuizResults';
import AdminQuizViewQuestions from './pages/AdminQuizViewQuestions';
import AdminQuizEditQuestions from './pages/AdminQuizEditQuestions';
import StudentAssessmentsList from './pages/StudentAssessmentsList';
import StudentQuizAttempt from './pages/StudentQuizAttempt';
import StudentQuizResults from './pages/StudentQuizResults';

function App() {
  const [adminAuth, setAdminAuth] = useState(!!localStorage.getItem('adminAuth'));
  const [userAuth, setUserAuth] = useState(!!localStorage.getItem('userAuth'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin setAdminAuth={setAdminAuth} />} />
        <Route 
          path="/admin/dashboard" 
          element={adminAuth ? <AdminDashboard /> : <Navigate to="/admin/login" />} 
        />
        <Route 
          path="/admin/attendance" 
          element={adminAuth ? <AdminAttendance /> : <Navigate to="/admin/login" />} 
        />
        <Route 
          path="/admin/register-student" 
          element={adminAuth ? <RegisterStudent /> : <Navigate to="/admin/login" />} 
        />
        <Route 
          path="/admin/marks-entry" 
          element={adminAuth ? <MarksEntry /> : <Navigate to="/admin/login" />} 
        />
        <Route 
          path="/admin/marks-report" 
          element={adminAuth ? <MarksReport /> : <Navigate to="/admin/login" />} 
        />
        <Route 
          path="/admin/syllabus" 
          element={adminAuth ? <AdminSyllabusStructured /> : <Navigate to="/admin/login" />} 
        />
        <Route 
          path="/admin/notes" 
          element={adminAuth ? <AddNoteForm /> : <Navigate to="/admin/login" />} 
        />
        <Route 
          path="/admin/manage-sections" 
          element={adminAuth ? <ManageSections /> : <Navigate to="/admin/login" />} 
        />
        <Route 
          path="/admin/attendance-report" 
          element={adminAuth ? <AttendanceReport /> : <Navigate to="/admin/login" />} 
        />
        <Route 
          path="/admin/mark-attendance" 
          element={adminAuth ? <AttendanceSection /> : <Navigate to="/admin/login" />} 
        />
        <Route 
          path="/admin/quiz-create" 
          element={adminAuth ? <AdminQuizCreation /> : <Navigate to="/admin/login" />} 
        />
        <Route 
          path="/admin/quiz-management" 
          element={adminAuth ? <AdminQuizManagement /> : <Navigate to="/admin/login" />} 
        />
        <Route 
          path="/admin/quiz/:quizId/results" 
          element={adminAuth ? <AdminQuizResults /> : <Navigate to="/admin/login" />} 
        />
        <Route 
          path="/admin/quiz/:quizId/view" 
          element={adminAuth ? <AdminQuizViewQuestions /> : <Navigate to="/admin/login" />} 
        />
        <Route 
          path="/admin/quiz/:quizId/edit" 
          element={adminAuth ? <AdminQuizEditQuestions /> : <Navigate to="/admin/login" />} 
        />

        {/* User Routes */}
        <Route path="/user/login" element={<UserLogin setUserAuth={setUserAuth} />} />
        <Route path="/user/forgot-password" element={<ForgotPassword />} />
        <Route path="/user/verify-otp" element={<VerifyOTP />} />
        <Route path="/user/reset-password" element={<ResetPassword />} />
        <Route 
          path="/user/dashboard" 
          element={userAuth ? <UserDashboard /> : <Navigate to="/user/login" />} 
        />
        <Route 
          path="/student/attendance" 
          element={userAuth ? <StudentAttendance /> : <Navigate to="/user/login" />} 
        />
        <Route 
          path="/student/marks" 
          element={userAuth ? <StudentMarks /> : <Navigate to="/user/login" />} 
        />
        <Route 
          path="/student/syllabus" 
          element={userAuth ? <StudentSyllabus /> : <Navigate to="/user/login" />} 
        />
        <Route 
          path="/student/notes/:subjectId" 
          element={userAuth ? <StudentNotesView /> : <Navigate to="/user/login" />} 
        />
        <Route 
          path="/student/assessments" 
          element={userAuth ? <StudentAssessmentsList /> : <Navigate to="/user/login" />} 
        />
        <Route 
          path="/student/quiz/:quizId/attempt" 
          element={userAuth ? <StudentQuizAttempt /> : <Navigate to="/user/login" />} 
        />
        <Route 
          path="/student/quiz/:quizId/results" 
          element={userAuth ? <StudentQuizResults /> : <Navigate to="/user/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
