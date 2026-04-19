// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OrgDash from './pages/org/OrgDash';
import ProtectedRoute from './components/ProtectedRoute';
import SuperAdminDash from './pages/admin/SuperAdminDash';

// Quick placeholder components so the router has something to render
const PublicFeed = () => <div className="p-10 text-2xl font-bold text-center">Public Charity Feed</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public & Auth Routes (No guards needed) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PublicFeed />} />

        {/* Protected Route for Organization Admins */}
        <Route element={<ProtectedRoute allowedRoles={['ORG_ADMIN']} />}>
          <Route path="/organization" element={<OrgDash />} />
        </Route>

        {/* Protected Route for Super Admins */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
          <Route path="/admin" element={<SuperAdminDash />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;