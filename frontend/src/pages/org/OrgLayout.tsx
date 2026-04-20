import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OrgLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between p-4 text-white bg-blue-800 shadow-md">
        <Link to="/organization" className="text-xl font-bold hover:text-blue-200">
          Organization Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <span>Welcome, {user?.firstName}</span>
          <button onClick={logout} className="px-4 py-2 text-sm transition-colors bg-red-600 rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      </nav>

      {/* The sub-pages will render inside this Outlet */}
      <main className="max-w-4xl p-8 mx-auto mt-4">
        <Outlet />
      </main>
    </div>
  );
};

export default OrgLayout;