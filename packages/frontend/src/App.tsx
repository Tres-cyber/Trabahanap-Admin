import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/login/LoginPage';
import { HomePage } from './pages/home/HomePage';
import UsersPage from './pages/users';
import UserProfilePage from './pages/users/[id]';
import VerificationPage from './pages/verification';
import VerificationProfilePage from './pages/verification/[id]';
import JobsPage from './pages/jobs';
import JobUsersPage from './pages/jobs/JobUsersPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:id" element={<UserProfilePage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/verification/:id" element={<VerificationProfilePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:category" element={<JobUsersPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;