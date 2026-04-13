// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Quick placeholder components so the router has something to render
const PublicFeed = () => <div className="p-10 text-2xl font-bold text-center">Public Charity Feed</div>;
const SuperAdminDash = () => <div className="p-10 text-2xl font-bold text-center">Admin: Pending Approvals</div>;
const OrgDash = () => <div className="p-10 text-2xl font-bold text-center">Org: Dashboard</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public & Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PublicFeed />} />

        {/* Protected Routes (We will add role-guards to these later) */}
        <Route path="/admin" element={<SuperAdminDash />} />
        <Route path="/organization" element={<OrgDash />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;