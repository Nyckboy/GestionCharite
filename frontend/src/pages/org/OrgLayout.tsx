import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const OrgLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');
  const isDashboardActive = location.pathname === '/organization';

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-[#f7fafc] font-['Inter',sans-serif] text-[#171c20]">
      <nav className="fixed top-0 z-40 h-16 w-full border-b border-[#dee3e8] bg-white/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-full w-full max-w-360 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="-ml-1 rounded-lg p-1 text-[#43474e] transition-colors hover:bg-[#eff4f9] lg:hidden"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

            <div className="hidden rounded-lg bg-[#1a365d] p-1.5 sm:flex">
              <span className="material-symbols-outlined text-[20px] text-white">
                volunteer_activism
              </span>
            </div>
            <span className="text-lg font-bold tracking-tight text-[#171c20] sm:text-xl">
              {t('orgLayout.brand')}
            </span>
          </div>

          <div className="hidden items-center space-x-8 text-sm font-semibold md:flex">
            <span className="border-b-2 border-[#002045] pb-1 text-[#002045]">
              {t('orgLayout.impactDashboard')}
            </span>
            <Link to="/" className="text-[#43474e] transition-colors hover:text-[#002045]">
              {t('orgLayout.publicCampaigns')}
            </Link>
            <span className="cursor-not-allowed text-[#43474e] opacity-50">
              {t('orgLayout.donors')}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher Injected Here */}
            <LanguageSwitcher />

            <button className="material-symbols-outlined hidden cursor-not-allowed rounded-full p-2 text-[#74777f] opacity-50 transition-all hover:bg-[#eff4f9] sm:block">
              notifications
            </button>
            <button className="material-symbols-outlined hidden cursor-not-allowed rounded-full p-2 text-[#74777f] opacity-50 transition-all hover:bg-[#eff4f9] sm:block">
              help_outline
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a365d] text-xs font-bold text-white ring-2 ring-[#eff4f9] sm:ml-2">
              {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'A'}
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a365d] shadow-sm">
              <span className="material-symbols-outlined text-[20px] text-white">
                account_balance
              </span>
            </div>
            <div>
              <div className="text-sm font-black tracking-wider text-[#002045] uppercase">
                {t('orgLayout.charityAdmin')}
              </div>
              <div className="text-xs font-bold text-[#74777f]">
                {t('orgLayout.verifiedPartner')}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto px-2 text-sm font-semibold tracking-wide">
          <Link
            to="/organization"
            onClick={closeSidebar}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-all ${isDashboardActive ? 'border border-[#dee3e8] bg-white text-[#002045] shadow-sm' : 'text-[#43474e] hover:bg-[#eff4f9]'}`}
          >
            <span
              className={`material-symbols-outlined ${isDashboardActive ? 'text-[#002045]' : 'text-[#74777f]'}`}
            >
              dashboard
            </span>
            {t('orgLayout.navDashboard')}
          </Link>

          <Link
            to="/organization/list"
            onClick={closeSidebar}
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-all ${isActive('/organization/list') && !isDashboardActive ? 'border border-[#dee3e8] bg-white text-[#002045] shadow-sm' : 'text-[#43474e] hover:bg-[#eff4f9]'}`}
          >
            <span
              className={`material-symbols-outlined ${isActive('/organization/list') && !isDashboardActive ? 'text-[#002045]' : 'text-[#74777f]'}`}
            >
              account_balance
            </span>
            {t('orgLayout.navMyOrgs')}
          </Link>

          <div className="flex cursor-not-allowed items-center gap-3 rounded-lg px-4 py-3 text-[#43474e] opacity-50 grayscale">
            <span className="material-symbols-outlined text-[#74777f]">volunteer_activism</span>{' '}
            {t('orgLayout.navDonations')}
          </div>
          <div className="flex cursor-not-allowed items-center gap-3 rounded-lg px-4 py-3 text-[#43474e] opacity-50 grayscale">
            <span className="material-symbols-outlined text-[#74777f]">leaderboard</span>{' '}
            {t('orgLayout.navAnalytics')}
          </div>

          <Link
            to="/"
            onClick={closeSidebar}
            className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border-t border-[#dee3e8] px-4 py-3 pt-4 text-[#43474e] transition-all hover:bg-[#eff4f9] md:hidden"
          >
            <span className="material-symbols-outlined text-[#74777f]">public</span>{' '}
            {t('orgLayout.publicCampaigns')}
          </Link>
        </div>

        <div className="mt-auto space-y-1 border-t border-[#dee3e8] bg-[#f5faff] px-4 py-4 text-sm font-semibold tracking-wide">
          <div className="flex cursor-not-allowed items-center gap-3 rounded-lg px-4 py-3 text-[#43474e] opacity-50 grayscale">
            <span className="material-symbols-outlined text-[#74777f]">contact_support</span>{' '}
            {t('orgLayout.navSupport')}
          </div>
          <button
            onClick={() => {
              closeSidebar();
              logout();
            }}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-[#ba1a1a] transition-colors hover:bg-[#ffdad6]/50"
          >
            <span className="material-symbols-outlined text-[#ba1a1a]">logout</span>{' '}
            {t('orgLayout.navSignOut')}
          </button>
        </div>
      </aside>

      <main className="mt-16 ml-0 flex-1 overflow-x-hidden p-4 md:p-6 lg:ml-64 lg:p-8">
        <div className="mx-auto w-full max-w-300">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default OrgLayout;
