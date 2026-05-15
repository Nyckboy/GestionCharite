import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';

import OrgLayout from './pages/org/OrgLayout';
import OrgList from './pages/org/OrgList';
import OrgCreate from './pages/org/OrgCreate';
import CampaignCreate from './pages/org/CampaignCreate';
import CampaignList from './pages/org/CampaignList';
import PublicFeed from './pages/public/PublicFeed';
import PublicLayout from './pages/public/PublicLayout';
import CampaignDetail from './pages/public/CampaignDetail';
import PaymentSuccess from './pages/public/PaymentSuccess';
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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PublicLayout />}>
          <Route path="/" element={<PublicFeed />} />
          <Route path="/donate/:actionId" element={<CampaignDetail />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
          <Route path="/profile" element={<UserLayout />}>
            <Route index element={<UserProfile />} />
            <Route path="donations" element={<UserDonations />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ORG_ADMIN']} />}>
          <Route path="/organization" element={<OrgLayout />}>
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

        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="approvals" element={<AdminOrgApprovals />} />
            <Route path="campaigns" element={<AdminCampaigns />} />
            <Route path="users">
              <Route index element={<AdminUserList />} />
              <Route path="new" element={<AdminUserCreate />} />
              <Route path=":id/edit" element={<AdminUserEdit />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
