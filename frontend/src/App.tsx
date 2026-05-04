import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
// import OrgDash from './pages/org/OrgDash';
import ProtectedRoute from './components/ProtectedRoute';

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
import AdminOrgApprovals from './pages/admin/AdminOrgApprovals';
import AdminOverview from './pages/admin/AdminOverview';
import AdminLayout from './pages/admin/AdminLayout';
import AdminCampaigns from './pages/admin/AdminCampaigns';
import AdminUserList from './pages/admin/AdminUserList';
import AdminUserCreate from './pages/admin/AdminUserCreate';
import AdminUserEdit from './pages/admin/AdminUserEdit';
import UserLayout from './pages/user/UserLayout';
import UserProfile from './pages/user/UserProfile';
import UserDonations from './pages/user/UserDonations';
import OrgDashboard from './pages/org/OrgDashboard';
import NotFound from './pages/NotFound';

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

        {/* Protected Routes for Standard Users */}
        <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
          <Route path="/profile" element={<UserLayout />}>
            <Route index element={<UserProfile />} />
            {/* <Route path="edit" element={<UserEditProfile />} /> */}
            <Route path="donations" element={<UserDonations />} />
          </Route>
        </Route>

        {/* Protected Route for Organization Admins */}
        <Route element={<ProtectedRoute allowedRoles={['ORG_ADMIN']} />}>
          <Route path="/organization" element={<OrgLayout />}>
            {/* Index maps to /organization exactly */}
            <Route index element={<OrgDashboard />} />
            <Route path="list" element={<OrgList />} />
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
          <Route path="/admin" element={<AdminLayout />}>
            {/* The default dashboard overview */}
            <Route index element={<AdminOverview />} />
            {/* The approvals page */}
            <Route path="approvals" element={<AdminOrgApprovals />} />
            {/* Placeholders for future expansion */}
            <Route path="campaigns" element={<AdminCampaigns />} />
            {/* 2. Nest the user routes just like we did for organizations */}
            <Route path="users">
              <Route index element={<AdminUserList />} />
              <Route path="new" element={<AdminUserCreate />} />
              <Route path=":id/edit" element={<AdminUserEdit />} />
            </Route>
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<NotFound />} />
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
