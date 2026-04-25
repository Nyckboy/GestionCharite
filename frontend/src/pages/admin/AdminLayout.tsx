import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="flex w-64 flex-col bg-gray-900 text-white">
        <div className="bg-gray-950 p-4">
          <h2 className="text-xl font-bold">Platform Admin</h2>
          <p className="mt-1 text-xs text-gray-400">Super Admin Console</p>
        </div>

        <nav className="grow space-y-2 p-4">
          <Link
            to="/admin"
            className={`block rounded px-4 py-2 transition-colors ${isActive('/admin') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            Overview
          </Link>
          <Link
            to="/admin/approvals"
            className={`block rounded px-4 py-2 transition-colors ${isActive('/admin/approvals') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            Pending Approvals
          </Link>
          {/* Replaced 'All Organizations' with 'Global Campaigns' */}
          <Link
            to="/admin/campaigns"
            className={`block rounded px-4 py-2 transition-colors ${isActive('/admin/campaigns') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            Global Campaigns
          </Link>
          <Link
            to="/admin/users"
            className={`block rounded px-4 py-2 transition-colors ${isActive('/admin/users') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            Manage Users
          </Link>
        </nav>

        <div className="border-t border-gray-800 p-4">
          <div className="mb-4 text-sm text-gray-400">
            Logged in as:
            <br />
            <span className="font-bold text-white">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
          <button
            onClick={logout}
            className="w-full rounded bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700"
          >
            Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="flex items-center justify-between bg-white px-8 py-4 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">Command Center</h1>
          <Link to="/" className="text-sm font-semibold text-blue-600 hover:underline">
            View Public Site &rarr;
          </Link>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
