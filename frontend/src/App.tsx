import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
// import OrgDash from './pages/org/OrgDash';
import ProtectedRoute from './components/ProtectedRoute';
import SuperAdminDash from './pages/admin/SuperAdminDash';

import OrgLayout from './pages/org/OrgLayout';
import OrgList from './pages/org/OrgList';
import OrgCreate from './pages/org/OrgCreate';
import CampaignCreate from './pages/org/CampaignCreate';
import CampaignList from './pages/org/CampaignList';
import PublicFeed from './pages/public/PublicFeed';
import PublicLayout from './pages/public/PublicLayout';
import CampaignDetail from './pages/public/CampaignDetail';
import CampaignPostUpdate from './pages/org/CampaignPostUpdate';
import CampaignEdit from './pages/org/CampaignEdit';
import OrgEdit from './pages/org/OrgEdit';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public & Auth Routes (No guards needed) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* NESTED ROUTES FOR PUBLIC FACING PAGES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<PublicFeed />} />
          <Route path="/donate/:actionId" element={<CampaignDetail />} />
        </Route>

        {/* Protected Route for Organization Admins */}
        <Route element={<ProtectedRoute allowedRoles={['ORG_ADMIN']} />}>
          <Route path="/organization" element={<OrgLayout />}>
            {/* Index maps to /organization exactly */}
            <Route index element={<OrgList />} /> 
            <Route path="new" element={<OrgCreate />} />
            <Route path=":id/edit" element={<OrgEdit />} />
            <Route path=":id/campaign/new" element={<CampaignCreate />} />
            <Route path=":id/campaigns" element={<CampaignList />} />
            <Route path=":id/campaign/:actionId/update" element={<CampaignPostUpdate />} />
            <Route path=":id/campaign/:actionId/edit" element={<CampaignEdit />} />
          </Route>
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