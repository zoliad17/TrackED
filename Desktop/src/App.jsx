import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import LoginForm from './components/auth/LoginForm';
import AdminDashboard from './components/admin/AdminDashboard';
import TeacherPage from './components/teacher/TeacherPage';
import StudentManagement from './components/teacher/StudentManagement';
import StudentDashboard from './components/student/StudentDashboard';
import TeachersView from './components/admin/TeachersView';
import StudentsView from './components/admin/StudentsView';
import SectionsView from './components/admin/SectionsView';
import CoursesView from './components/admin/CoursesView';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/teachers" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <TeachersView darkMode={false} />
          </ProtectedRoute>
        } />
        <Route path="/students" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <StudentsView darkMode={false} />
          </ProtectedRoute>
        } />
        <Route path="/sections" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <SectionsView darkMode={false} />
          </ProtectedRoute>
        } />
        <Route path="/courses" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CoursesView darkMode={false} />
          </ProtectedRoute>
        } />

        <Route path="/home" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherPage />
          </ProtectedRoute>
        } />
        <Route path="/student-management" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <StudentManagement />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
