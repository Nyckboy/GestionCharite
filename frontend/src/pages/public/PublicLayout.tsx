import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const PublicLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-[#f5faff] font-['Inter',sans-serif] antialiased">
      {/* TopNavBar */}
      <header className="fixed top-0 z-50 w-full border-b border-[#dee3e8] bg-white/80 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-360 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold tracking-tight text-[#002045]">
              {t('publicLayout.brand')}
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
              <Link to="/" className="border-b-2 border-[#002045] pb-1 text-[#002045]">
                {t('publicLayout.navCampaigns')}
              </Link>
              <span className="cursor-not-allowed text-[#43474e] opacity-50">
                {t('publicLayout.navOrganizations')}
              </span>
              <span className="cursor-not-allowed text-[#43474e] opacity-50">
                {t('publicLayout.navImpact')}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher Injection */}
            <LanguageSwitcher />

            {/* Greyed out Search */}
            <div className="relative hidden opacity-50 grayscale lg:block">
              <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-lg text-[#74777f]">
                search
              </span>
              <input
                disabled
                className="w-64 rounded-full border-none bg-[#eff4f9] py-2 pr-4 pl-10 text-sm"
                placeholder={t('publicLayout.searchPlaceholder')}
                type="text"
              />
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#171c20]">
                  {t('publicLayout.hello')} {user?.firstName}
                </span>
                {user?.role === 'USER' && (
                  <Link
                    to="/profile"
                    className="text-sm font-semibold text-[#002045] hover:underline"
                  >
                    {t('publicLayout.navProfile')}
                  </Link>
                )}
                {user?.role === 'ORG_ADMIN' && (
                  <Link
                    to="/organization"
                    className="text-sm font-semibold text-[#002045] hover:underline"
                  >
                    {t('publicLayout.navDashboard')}
                  </Link>
                )}
                {user?.role === 'SUPER_ADMIN' && (
                  <Link
                    to="/admin"
                    className="text-sm font-semibold text-[#002045] hover:underline"
                  >
                    {t('publicLayout.navAdmin')}
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="rounded-full bg-[#ba1a1a] px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                >
                  {t('publicLayout.btnLogout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-[#002045] transition-all hover:bg-[#eff4f9]"
                >
                  {t('publicLayout.btnLogin')}
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-[#002045] px-6 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                >
                  {t('publicLayout.btnSignup')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Dynamic Page Content */}
      <main className="grow pt-16">
        <Outlet />
      </main>

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-[#dee3e8] bg-white">
        <div className="mx-auto flex max-w-360 flex-col items-center justify-between gap-4 px-8 py-8 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#002045]">{t('publicLayout.brand')}</span>
            <span className="text-xs text-[#74777f]">{t('publicLayout.footerRights')}</span>
          </div>
          <nav className="flex gap-6 text-xs font-medium text-[#43474e]">
            <span className="cursor-not-allowed opacity-50">{t('publicLayout.footerPrivacy')}</span>
            <span className="cursor-not-allowed opacity-50">{t('publicLayout.footerTerms')}</span>
            <span className="cursor-not-allowed opacity-50">{t('publicLayout.footerContact')}</span>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
