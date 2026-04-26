import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Public Navbar */}
      <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
        <Link to="/" className="text-2xl font-bold text-blue-800">
          Gestion Charité
        </Link>
        
        <div className="flex gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Hello, {user?.firstName}</span>
              
              {/* Dynamic Dashboard Links Based on Role */}
              {user?.role === 'USER' && (
                <Link to="/profile" className="text-sm font-semibold text-blue-600 hover:underline">
                  My Profile
                </Link>
              )}
              {user?.role === 'ORG_ADMIN' && (
                <Link to="/organization" className="text-sm font-semibold text-blue-600 hover:underline">
                  My Dashboard
                </Link>
              )}
              {user?.role === 'SUPER_ADMIN' && (
                <Link to="/admin" className="text-sm font-semibold text-blue-600 hover:underline">
                  Admin Panel
                </Link>
              )}

              <button onClick={logout} className="px-4 py-2 text-sm text-white transition-colors bg-red-600 rounded hover:bg-red-700">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-blue-600 transition-colors bg-blue-100 rounded hover:bg-blue-200">Log In</Link>
              <Link to="/register" className="px-4 py-2 text-sm font-semibold text-white transition-colors bg-blue-600 rounded hover:bg-blue-700">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Dynamic Page Content */}
      <main className="grow">
        <Outlet />
      </main>

      {/* Standard Public Footer */}
      <footer className="py-6 mt-auto text-sm text-center text-gray-400 bg-gray-900">
        <p>&copy; {new Date().getFullYear()} Gestion Charité. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PublicLayout;