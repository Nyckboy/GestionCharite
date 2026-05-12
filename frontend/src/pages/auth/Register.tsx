import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../api/axios';
import type { Role } from '../../types';
import { getErrorMessage } from '../../utils/errorHandler';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER' as Role,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await apiClient.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(getErrorMessage(err) || t('register.errDefault'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f5faff] p-6 font-['Inter',sans-serif] antialiased">
      {/* Language Switcher positioned top-right */}
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <main className="flex w-full max-w-120 flex-col items-center">
        <div className="mb-6 flex flex-col items-center">
          <span
            className="material-symbols-outlined mb-2 text-[48px] text-[#002045]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            person_add
          </span>
          <h1 className="text-center text-3xl font-bold tracking-tight text-[#002045]">
            Gestion Charité
          </h1>
        </div>

        <div className="relative flex w-full flex-col gap-6 overflow-hidden rounded-xl border border-[#dee3e8] bg-white p-8 shadow-sm">
          <div className="absolute top-0 right-0 left-0 h-1 bg-[#002045]"></div>

          <div className="text-center">
            <h2 className="mb-1 text-2xl font-semibold text-[#171c20]">{t('register.title')}</h2>
            <p className="mb-4 text-sm text-[#43474e]">{t('register.subtitle')}</p>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#dee3e8] bg-[#eff4f9] px-4 py-1 text-[#006d3c]">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span className="text-xs font-bold tracking-wider uppercase">
                {t('register.secureRegistration')}
              </span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-[#ba1a1a]/10 bg-[#ffdad6] p-3 text-sm text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-sm font-semibold text-[#171c20]">
                  {t('register.firstNameLabel')}
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder={t('register.firstNamePlaceholder')}
                  className="w-full rounded-lg border-none bg-[#e9eef3] px-4 py-2 text-base transition-all outline-none focus:ring-2 focus:ring-[#002045]"
                  required
                />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-sm font-semibold text-[#171c20]">
                  {t('register.lastNameLabel')}
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder={t('register.lastNamePlaceholder')}
                  className="w-full rounded-lg border-none bg-[#e9eef3] px-4 py-2 text-base transition-all outline-none focus:ring-2 focus:ring-[#002045]"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#171c20]">
                {t('register.emailLabel')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('register.emailPlaceholder')}
                className="w-full rounded-lg border-none bg-[#e9eef3] px-4 py-2 text-base transition-all outline-none focus:ring-2 focus:ring-[#002045]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#171c20]">
                {t('register.passwordLabel')}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('register.passwordPlaceholder')}
                className="w-full rounded-lg border-none bg-[#e9eef3] px-4 py-2 text-base transition-all outline-none focus:ring-2 focus:ring-[#002045]"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#171c20]">
                {t('register.roleLabel')}
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full cursor-pointer appearance-none rounded-lg border-none bg-[#e9eef3] px-4 py-2 text-base transition-all outline-none focus:ring-2 focus:ring-[#002045]"
              >
                <option value="USER">{t('register.roleUser')}</option>
                <option value="ORG_ADMIN">{t('register.roleOrgAdmin')}</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#002045] py-3 font-semibold text-white transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? t('register.btnCreating') : t('register.btnCreate')}
              {!isLoading && (
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              )}
            </button>
          </form>

          <div className="border-t border-[#dee3e8] pt-4 text-center">
            <p className="text-sm text-[#43474e]">
              {t('register.hasAccount')}
              <Link to="/login" className="ml-1 font-semibold text-[#002045] hover:underline">
                {t('register.loginHere')}
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-sm text-[#c4c6cf]">{t('register.footerRights')}</p>
      </main>
    </div>
  );
};

export default Register;
