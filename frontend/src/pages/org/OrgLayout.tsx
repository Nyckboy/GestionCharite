import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OrgLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Exact match for the dashboard index route
  const isDashboardActive = location.pathname === '/organization';

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className="flex flex-col w-64 text-white bg-blue-900">
        <div className="p-6 bg-blue-950">
          <Link to="/" className="text-xl font-bold hover:text-blue-200">&larr; Public Feed</Link>
          <p className="mt-2 text-sm text-blue-300">Organization Portal</p>
        </div>
        
        <nav className="grow p-4 space-y-2">
          <Link 
            to="/organization" 
            className={`block px-4 py-2 rounded transition-colors ${isDashboardActive ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-800'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/organization/list" 
            className={`block px-4 py-2 rounded transition-colors ${isActive('/organization/list') ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-800'}`}
          >
            My Organizations
          </Link>
          {/* If you build the Payouts feature later, you can uncomment this! */}
          {/* <Link 
            to="/organization/payouts" 
            className={`block px-4 py-2 rounded transition-colors ${isActive('/organization/payouts') ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-800'}`}
          >
            Financial Payouts
          </Link> */}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <div className="mb-4 text-sm text-blue-200">
            Logged in as:<br/>
            <span className="font-bold text-white">{user?.firstName} {user?.lastName}</span>
          </div>
          <button 
            onClick={logout} 
            className="w-full px-4 py-2 text-sm font-bold text-white transition-colors bg-red-500 rounded hover:bg-red-600"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default OrgLayout;