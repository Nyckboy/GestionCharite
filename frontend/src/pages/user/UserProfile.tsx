import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../api/axios';
import type { PlatformUser } from '../../types';
import { getErrorMessage } from '../../utils/errorHandler';

const UserProfile = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<PlatformUser | null>(null);

  const [impactAmount, setImpactAmount] = useState<number>(0);

  const [formData, setFormData] = useState({ firstName: '', lastName: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Run both requests in parallel for better performance
        const [profileResponse, impactResponse] = await Promise.all([
          apiClient.get<PlatformUser>('/users/me'),
          // Fallback to { data: 0 } in case the user has no donations and backend throws an error
          apiClient.get<number>('/donations/my-impact').catch(() => ({ data: 0 })),
        ]);

        setProfile(profileResponse.data);
        setImpactAmount(impactResponse.data);

        setFormData({
          firstName: profileResponse.data.firstName,
          lastName: profileResponse.data.lastName,
        });
      } catch (error) {
        setStatusMessage({ type: 'error', text: t('userProfile.errLoad') + error });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [t]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      await apiClient.put('/users/me', formData);
      setStatusMessage({ type: 'success', text: t('userProfile.successUpdate') });
      if (profile) setProfile({ ...profile, ...formData });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: getErrorMessage(err) || t('userProfile.errUpdate'),
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  if (isLoading)
    return (
      <div className="animate-pulse p-12 text-center font-bold text-[#43474e]">
        {t('userProfile.loading')}
      </div>
    );
  if (!profile)
    return (
      <div className="p-12 text-center font-bold text-[#ba1a1a]">{t('userProfile.errLoad')}</div>
    );

  return (
    <form onSubmit={handleSave} className="space-y-8 font-['Inter',sans-serif]">
      <section className="flex flex-col items-center gap-8 rounded-2xl border border-[#dee3e8] bg-white bg-linear-to-br from-white to-[#eff4f9] p-8 shadow-[0px_4px_6px_rgba(26,54,93,0.04)] md:flex-row">
        <div className="relative">
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-[#002045] text-5xl font-bold text-white shadow-md">
            {profile.firstName.charAt(0)}
            {profile.lastName.charAt(0)}
          </div>
          <button
            type="button"
            className="absolute right-1 bottom-1 cursor-not-allowed rounded-full bg-[#002045] p-2 text-white opacity-50 shadow-lg grayscale transition-colors hover:bg-[#1a365d]"
          >
            <span className="material-symbols-outlined text-[20px]">photo_camera</span>
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-[#002045]">
            {profile.firstName} {profile.lastName}
          </h2>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <span className="flex items-center gap-1 rounded-full bg-[#85f6ad] px-3 py-1 text-xs font-bold tracking-wider text-[#00723f] uppercase">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              {t('userProfile.verified')} {profile.role}
            </span>
            <span className="rounded-full bg-[#d6e3ff] px-3 py-1 text-xs font-bold tracking-wider text-[#001b3c] uppercase">
              {t('userProfile.accountNum')}
              {profile.id}
            </span>
          </div>
        </div>

        <div className="flex min-w-60 flex-col items-center justify-center rounded-2xl border border-[#d6e3ff] bg-[#f5faff] p-6">
          <div className="text-center">
            <p className="text-xs font-bold tracking-widest text-[#74777f] uppercase">
              {t('userProfile.lifetimeImpact')}
            </p>
            <p className="mt-1 text-3xl font-bold text-[#002045]">
              {impactAmount > 0
                ? `${impactAmount.toLocaleString()} MAD`
                : t('userProfile.noImpact')}
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          <section className="rounded-2xl border border-[#dee3e8] bg-white p-8 shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#171c20]">
                {t('userProfile.personalDetails')}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#74777f]">
                  {t('userProfile.firstName')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full rounded-lg border-none bg-[#eff4f9] px-4 py-3 font-medium text-[#171c20] transition-all outline-none focus:bg-white focus:ring-2 focus:ring-[#002045]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#74777f]">
                  {t('userProfile.lastName')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full rounded-lg border-none bg-[#eff4f9] px-4 py-3 font-medium text-[#171c20] transition-all outline-none focus:bg-white focus:ring-2 focus:ring-[#002045]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#74777f]">
                  {t('userProfile.email')}
                </label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full cursor-not-allowed rounded-lg border-none bg-[#e4e9ee] px-4 py-3 font-medium text-[#43474e] opacity-70"
                />
              </div>
              <div className="pointer-events-none space-y-1 opacity-50 grayscale select-none">
                <label className="text-sm font-semibold text-[#74777f]">
                  {t('userProfile.phone')}
                </label>
                <input
                  disabled
                  type="tel"
                  placeholder={t('userProfile.phonePlaceholder')}
                  className="w-full rounded-lg border-none bg-[#eff4f9] px-4 py-3"
                />
              </div>
            </div>
          </section>

          <section className="pointer-events-none rounded-2xl border border-[#dee3e8] bg-white p-8 opacity-40 shadow-sm grayscale select-none">
            <h3 className="mb-6 text-xl font-bold text-[#171c20]">
              {t('userProfile.notificationPrefs')}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-[#eff4f9] p-4">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#002045]">mail</span>
                  <div>
                    <p className="font-bold text-[#171c20]">{t('userProfile.emailUpdates')}</p>
                    <p className="text-sm text-[#43474e]">{t('userProfile.emailDesc')}</p>
                  </div>
                </div>
                <div className="relative h-6 w-11 rounded-full bg-[#002045]">
                  <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-white"></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="pointer-events-none space-y-8 opacity-40 grayscale select-none lg:col-span-5">
          <section className="rounded-2xl border border-[#dee3e8] bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-xl font-bold text-[#171c20]">
              {t('userProfile.securitySettings')}
            </h3>
            <div className="space-y-3">
              <div className="flex w-full items-center justify-between rounded-xl border border-[#dee3e8] bg-[#f5faff] p-4">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#74777f]">lock</span>
                  <span className="font-bold text-[#171c20]">
                    {t('userProfile.changePassword')}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[#74777f]">chevron_right</span>
              </div>
              <div className="flex w-full items-center justify-between rounded-xl border border-[#dee3e8] bg-[#f5faff] p-4">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#74777f]">security</span>
                  <div>
                    <p className="font-bold text-[#171c20]">{t('userProfile.twoFactor')}</p>
                    <p className="text-xs font-bold text-[#006d3c]">{t('userProfile.enabled')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-2xl bg-[#002045] p-8 text-white">
            <div className="relative z-10">
              <h3 className="mb-2 text-xl font-bold">{t('userProfile.taxDocs')}</h3>
              <p className="mb-6 text-sm text-[#86a0cd]">{t('userProfile.taxDesc')}</p>
              <button
                type="button"
                disabled
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 font-bold text-[#002045]"
              >
                <span className="material-symbols-outlined">download</span>{' '}
                {t('userProfile.btnDownloadPdf')}
              </button>
            </div>
          </section>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 mt-8 flex flex-col items-center justify-between gap-6 border-t border-[#dee3e8] bg-[#f5faff]/90 pt-6 pb-6 backdrop-blur-sm sm:flex-row">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#74777f]">
          {statusMessage ? (
            <span
              className={statusMessage.type === 'success' ? 'text-[#006d3c]' : 'text-[#ba1a1a]'}
            >
              {statusMessage.text}
            </span>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">info</span>{' '}
              {t('userProfile.unsavedChanges')}
            </>
          )}
        </div>
        <div className="flex w-full gap-4 sm:w-auto">
          <button
            type="button"
            onClick={() =>
              setFormData({ firstName: profile.firstName, lastName: profile.lastName })
            }
            className="flex-1 rounded-xl border border-[#c4c6cf] px-6 py-3 font-bold text-[#43474e] transition-all hover:bg-white sm:flex-none"
          >
            {t('userProfile.btnDiscard')}
          </button>
          <button
            type="submit"
            disabled={
              isSaving ||
              (formData.firstName === profile.firstName && formData.lastName === profile.lastName)
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#002045] px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-[#1a365d] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            <span className="material-symbols-outlined">save</span>
            {isSaving ? t('userProfile.btnSaving') : t('userProfile.btnSave')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserProfile;
