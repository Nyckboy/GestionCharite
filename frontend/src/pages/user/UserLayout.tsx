import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-[#f5faff] font-['Inter',sans-serif] text-[#171c20] antialiased">
      {/* 1. Fixed Sidebar Navigation */}
      <aside className="fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r border-[#dee3e8] bg-white py-6 shadow-[2px_0_8px_rgba(0,0,0,0.02)]">
        {/* Brand */}
        <div className="mb-8 px-6">
          <h1 className="text-xl font-bold text-[#002045]">Gestion Charité</h1>
          <p className="mt-1 text-xs font-bold tracking-widest text-[#74777f] uppercase">
            Donor Dashboard
          </p>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 space-y-2 px-3">
          <Link
            to="/profile"
            className={`flex items-center rounded-lg px-3 py-3 transition-all ${isActive('/profile') ? 'border-r-4 border-[#002045] bg-[#eff4f9] font-bold text-[#002045]' : 'font-semibold text-[#43474e] hover:bg-[#f5faff] hover:text-[#002045]'}`}
          >
            <span className="material-symbols-outlined mr-3 text-[20px]">person</span>
            Profile
          </Link>

          <Link
            to="/profile/edit"
            className={`flex items-center rounded-lg px-3 py-3 transition-all ${isActive('/profile/edit') ? 'border-r-4 border-[#002045] bg-[#eff4f9] font-bold text-[#002045]' : 'font-semibold text-[#43474e] hover:bg-[#f5faff] hover:text-[#002045]'}`}
          >
            <span className="material-symbols-outlined mr-3 text-[20px]">edit_document</span>
            Edit Details
          </Link>

          <Link
            to="/profile/donations"
            className={`flex items-center rounded-lg px-3 py-3 transition-all ${isActive('/profile/donations') ? 'border-r-4 border-[#002045] bg-[#eff4f9] font-bold text-[#002045]' : 'font-semibold text-[#43474e] hover:bg-[#f5faff] hover:text-[#002045]'}`}
          >
            <span className="material-symbols-outlined mr-3 text-[20px]">payments</span>
            My Impact
          </Link>

          {/* Greyed Out Feature: Impact Report */}
          <div className="flex cursor-not-allowed items-center px-3 py-3 font-semibold text-[#43474e] opacity-40 grayscale select-none">
            <span className="material-symbols-outlined mr-3 text-[20px]">analytics</span>
            Impact Report
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="mt-4 mb-6 px-6">
          <Link
            to="/"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#48bb78] py-3 font-bold text-white shadow-sm transition-all hover:bg-[#38a169] hover:shadow-md active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">public</span>
            Public Feed
          </Link>
        </div>

        <div className="space-y-1 border-t border-[#dee3e8] px-3 pt-4">
          {/* Greyed Out Feature: Help Center */}
          <div className="flex cursor-not-allowed items-center px-3 py-2 text-sm font-semibold text-[#43474e] opacity-40 grayscale select-none">
            <span className="material-symbols-outlined mr-3 text-[20px]">help</span>
            Help Center
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-bold text-[#ba1a1a] transition-colors hover:bg-[#ffdad6]/50"
          >
            <span className="material-symbols-outlined mr-3 text-[20px]">logout</span>
            Secure Logout
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper (Offset by sidebar width) */}
      <div className="ml-64 flex min-h-screen flex-1 flex-col">
        {/* Top AppBar */}
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#dee3e8] bg-white/80 px-8 backdrop-blur-md">
          {/* Greyed Out Feature: Search */}
          <div className="pointer-events-none flex-1 opacity-40 grayscale select-none">
            <div className="relative w-full max-w-xs">
              <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-[20px] text-[#74777f]">
                search
              </span>
              <input
                disabled
                className="w-full rounded-lg border-none bg-[#eff4f9] py-2 pr-4 pl-10 text-sm font-medium"
                placeholder="Search activities..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="hidden font-bold text-[#002045] md:block">Donor Portal</span>

            <div className="flex items-center gap-4">
              {/* Greyed Out Features: Notifications & Settings */}
              <div className="pointer-events-none flex items-center gap-2 opacity-40 grayscale select-none">
                <span className="material-symbols-outlined text-[#43474e]">notifications</span>
                <span className="material-symbols-outlined text-[#43474e]">settings_suggest</span>
              </div>

              {/* Dynamic User Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#002045] text-sm font-bold text-white shadow-sm ring-2 ring-[#eff4f9]">
                {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content Injector */}
        <main className="mx-auto w-full max-w-360 flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
