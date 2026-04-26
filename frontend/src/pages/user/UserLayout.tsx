import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className="flex flex-col w-64 text-white bg-blue-900">
        <div className="p-6 bg-blue-950">
          <Link to="/" className="text-xl font-bold hover:text-blue-200">&larr; Public Feed</Link>
          <p className="mt-2 text-sm text-blue-300">Donor Dashboard</p>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          <Link 
            to="/profile" 
            className={`block px-4 py-2 rounded transition-colors ${isActive('/profile') ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-800'}`}
          >
            My Profile
          </Link>
          <Link 
            to="/profile/edit" 
            className={`block px-4 py-2 rounded transition-colors ${isActive('/profile/edit') ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-800'}`}
          >
            Edit Profile
          </Link>
          <Link 
            to="/profile/donations" 
            className={`block px-4 py-2 rounded transition-colors ${isActive('/profile/donations') ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-800'}`}
          >
            My Impact (Donations)
          </Link>
        </nav>

        <div className="p-4 border-t border-blue-800">
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

export default UserLayout;