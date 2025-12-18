import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DiscoverEvents from './pages/DiscoverEvents';
import CreateEvent from './pages/CreateEvent';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
  if (auth.loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!auth.user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />

        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />

        <Route path="discover" element={<DiscoverEvents />} />

        <Route path="create-event" element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        } />

        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;