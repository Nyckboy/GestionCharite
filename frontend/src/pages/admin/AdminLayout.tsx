import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next'; // <-- Import Translation Hook
import LanguageSwitcher from '../../components/LanguageSwitcher'; // <-- Import Switcher

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useTranslation(); // <-- Init hook

  const isActive = (path: string) =>
    location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path + '/'));

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-[#f7fafc] font-['Inter',sans-serif] text-[#171c20]">
      {/* 1. Global Top Navigation Bar */}
      <nav className="fixed top-0 z-40 h-16 w-full border-b border-[#dee3e8] bg-white/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="-ml-1 rounded-lg p-1 text-[#43474e] transition-colors hover:bg-[#eff4f9] lg:hidden"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
            <div className="hidden rounded-lg bg-[#002045] p-1.5 shadow-sm sm:flex">
              <span className="material-symbols-outlined text-[20px] text-white">
                admin_panel_settings
              </span>
            </div>
            <span className="text-lg font-bold tracking-tight text-[#002045] sm:text-xl">
              {t('adminLayout.commandCenter')}
            </span>
          </div>

          {/* Desktop Actions - Language Switcher goes here! */}
          <div className="hidden items-center space-x-4 md:flex">
            <LanguageSwitcher /> {/* <--- THE SWITCHER */}
            <Link
              to="/"
              className="flex items-center gap-2 rounded-full bg-[#eff4f9] px-4 py-2 text-sm font-bold text-[#002045] transition-colors hover:bg-[#d6e3ff]"
            >
              <span className="material-symbols-outlined text-[16px]">public</span>
              {t('adminLayout.viewPublicSite')}
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#002045] text-xs font-bold text-white ring-2 ring-[#eff4f9] sm:ml-2">
              {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'S'}
            </div>
          </div>
        </div>
      </nav>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#002045]/40 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r border-[#dee3e8] bg-[#f5faff] py-4 shadow-2xl transition-transform duration-300 ease-in-out lg:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:top-16 lg:z-30 lg:h-[calc(100vh-64px)] lg:translate-x-0`}
      >
        <button
          onClick={closeSidebar}
          className="absolute top-4 right-4 rounded-lg p-1 text-[#74777f] transition-colors hover:bg-[#dee3e8] lg:hidden"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="mt-8 mb-4 px-6 py-4 lg:mt-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002045] shadow-sm">
              <span className="material-symbols-outlined text-[20px] text-[#85f6ad]">
                verified_user
              </span>
            </div>
            <div>
              <div className="text-sm font-black tracking-wider text-[#002045] uppercase">
                {t('adminLayout.platformAdmin')}
              </div>
              <div className="mt-0.5 text-[10px] font-bold tracking-widest text-[#006d3c] uppercase">
                {t('adminLayout.level4Clearance')}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-1 px-2 text-sm font-semibold tracking-wide">
          <Link
            to="/admin"
            onClick={closeSidebar}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-all ${isActive('/admin') ? 'border border-[#dee3e8] bg-white text-[#002045] shadow-sm' : 'text-[#43474e] hover:bg-[#eff4f9]'}`}
          >
            <span
              className={`material-symbols-outlined ${isActive('/admin') ? 'text-[#002045]' : 'text-[#74777f]'}`}
            >
              insights
            </span>
            {t('adminLayout.overview')}
          </Link>
          <Link
            to="/admin/approvals"
            onClick={closeSidebar}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-all ${isActive('/admin/approvals') ? 'border border-[#dee3e8] bg-white text-[#002045] shadow-sm' : 'text-[#43474e] hover:bg-[#eff4f9]'}`}
          >
            <span
              className={`material-symbols-outlined ${isActive('/admin/approvals') ? 'text-[#002045]' : 'text-[#74777f]'}`}
            >
              pending_actions
            </span>
            {t('adminLayout.pendingApprovals')}
          </Link>
          <Link
            to="/admin/campaigns"
            onClick={closeSidebar}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-all ${isActive('/admin/campaigns') ? 'border border-[#dee3e8] bg-white text-[#002045] shadow-sm' : 'text-[#43474e] hover:bg-[#eff4f9]'}`}
          >
            <span
              className={`material-symbols-outlined ${isActive('/admin/campaigns') ? 'text-[#002045]' : 'text-[#74777f]'}`}
            >
              public
            </span>
            {t('adminLayout.globalCampaigns')}
          </Link>
          <Link
            to="/admin/users"
            onClick={closeSidebar}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-all ${isActive('/admin/users') ? 'border border-[#dee3e8] bg-white text-[#002045] shadow-sm' : 'text-[#43474e] hover:bg-[#eff4f9]'}`}
          >
            <span
              className={`material-symbols-outlined ${isActive('/admin/users') ? 'text-[#002045]' : 'text-[#74777f]'}`}
            >
              manage_accounts
            </span>
            {t('adminLayout.manageUsers')}
          </Link>

          <div className="mt-4 space-y-2 border-t border-[#dee3e8] px-2 pt-4 md:hidden">
            {/* Mobile language switcher */}
            <LanguageSwitcher />
            <Link
              to="/"
              onClick={closeSidebar}
              className="flex cursor-pointer items-center gap-3 rounded-lg bg-[#eff4f9] px-4 py-3 text-[#002045] transition-all hover:bg-[#d6e3ff]"
            >
              <span className="material-symbols-outlined text-[#002045]">public</span>{' '}
              {t('adminLayout.viewPublicSite')}
            </Link>
          </div>
        </div>

        <div className="mt-auto space-y-1 border-t border-[#dee3e8] bg-[#f5faff] px-4 py-4 text-sm font-semibold tracking-wide">
          <div className="mb-2 px-4 py-2">
            <p className="text-[10px] font-bold tracking-wider text-[#74777f] uppercase">
              {t('adminLayout.activeSession')}
            </p>
            <p className="truncate text-sm font-bold text-[#002045]">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
          <button
            onClick={() => {
              closeSidebar();
              logout();
            }}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-[#ba1a1a] transition-colors hover:bg-[#ffdad6]/50"
          >
            <span className="material-symbols-outlined text-[#ba1a1a]">logout</span>{' '}
            {t('adminLayout.secureLogout')}
          </button>
        </div>
      </aside>

      <main className="mt-16 ml-0 flex-1 overflow-x-hidden p-4 md:p-6 lg:ml-64 lg:p-8">
        <div className="mx-auto w-full max-w-[1440px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
