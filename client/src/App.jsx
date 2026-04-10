import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Professor from './pages/Professor';
import ProfessorPoll from './pages/ProfessorPoll';
import Student from './pages/Student';
import LoginProfessor from './pages/LoginProfessor';
import RegisterProfessor from './pages/RegisterProfessor';
import LoginStudent from './pages/LoginStudent';
import RegisterStudent from './pages/RegisterStudent';
import ProtectedRoute from './components/ProtectedRoute';
import ConfirmModal from './components/ConfirmModal';

function AppContent() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const closeLogoutModal = () => setLogoutModalOpen(false);

  const confirmLogout = () => {
    logout();
    navigate('/');
    setLogoutModalOpen(false);
  };

  const handleLogout = () => {
    setLogoutModalOpen(true);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/professor/login" element={<LoginProfessor />} />
        <Route path="/professor/register" element={<RegisterProfessor />} />
        <Route path="/student/login" element={<LoginStudent />} />
        <Route path="/student/register" element={<RegisterStudent />} />
        <Route path="/login" element={<Navigate to="/professor/login" replace />} />
        <Route path="/register" element={<Navigate to="/professor/register" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['professor']}><Professor onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/dashboard/poll/:id" element={<ProtectedRoute allowedRoles={['professor']}><ProfessorPoll onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><Student onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/professor" element={<Navigate to="/dashboard" replace />} />
        <Route path="/professor/poll/:id" element={<Navigate to="/dashboard/poll/:id" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ConfirmModal
        isOpen={logoutModalOpen}
        title="CERRAR SESIÓN"
        message="¿Seguro que quieres cerrar sesión?"
        confirmText="CERRAR SESIÓN"
        cancelText="CANCELAR"
        onConfirm={confirmLogout}
        onCancel={closeLogoutModal}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-brutal-bg">
        <AppContent />
      </div>
    </AuthProvider>
  );
}