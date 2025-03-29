import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import your pages
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';

// Wrapper component to handle conditional routing
const LoginRedirect = () => {
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect to users page
  if (isAuthenticated) {
    return <Navigate to="/users" replace />;
  }

  // Otherwise, show login page
  return <LoginPage />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster />
        <Routes>
          {/* Conditional Login Route */}
          <Route path="/login" element={<LoginRedirect />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>

          {/* Default Redirect */}
          <Route 
            path="/" 
            element={<Navigate to="/login" replace />} 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;