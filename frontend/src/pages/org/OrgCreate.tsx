import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../api/axios';
import { getErrorMessage } from '../../utils/errorHandler';

const OrgCreate = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orgForm, setOrgForm] = useState({
    name: '',
    legalAddress: '',
    taxIdentificationNumber: '',
    primaryContact: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/organizations', orgForm);
      navigate('/organization/list');
    } catch (err) {
      setError(getErrorMessage(err) || t('orgCreate.errSubmit'));
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 font-['Inter',sans-serif]">
      <Link
        to="/organization/list"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#002045] hover:underline"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>{' '}
        {t('orgCreate.backToOrgs')}
      </Link>

      <div className="overflow-hidden rounded-2xl border border-[#dee3e8] bg-white shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
        <div className="border-b border-[#dee3e8] bg-[#f5faff]/50 px-8 py-6">
          <h2 className="text-2xl font-bold text-[#002045]">{t('orgCreate.title')}</h2>
          <p className="mt-1 text-sm font-medium text-[#74777f]">{t('orgCreate.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-[#ffdad6] p-4 text-sm font-bold text-[#ba1a1a]">
              <span className="material-symbols-outlined">error</span> {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
              {t('orgCreate.orgNameLabel')}
            </label>
            <input
              type="text"
              placeholder={t('orgCreate.orgNamePlaceholder')}
              value={orgForm.name}
              onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
              required
              className="w-full rounded-lg border-none bg-[#eff4f9] px-4 py-3 text-sm font-medium text-[#171c20] transition-all outline-none focus:bg-white focus:ring-2 focus:ring-[#002045]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
              {t('orgCreate.legalAddressLabel')}
            </label>
            <input
              type="text"
              placeholder={t('orgCreate.legalAddressPlaceholder')}
              value={orgForm.legalAddress}
              onChange={(e) => setOrgForm({ ...orgForm, legalAddress: e.target.value })}
              required
              className="w-full rounded-lg border-none bg-[#eff4f9] px-4 py-3 text-sm font-medium text-[#171c20] transition-all outline-none focus:bg-white focus:ring-2 focus:ring-[#002045]"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
                {t('orgCreate.taxIdLabel')}
              </label>
              <input
                type="text"
                placeholder={t('orgCreate.taxIdPlaceholder')}
                value={orgForm.taxIdentificationNumber}
                onChange={(e) =>
                  setOrgForm({ ...orgForm, taxIdentificationNumber: e.target.value })
                }
                required
                className="w-full rounded-lg border-none bg-[#eff4f9] px-4 py-3 text-sm font-medium text-[#171c20] transition-all outline-none focus:bg-white focus:ring-2 focus:ring-[#002045]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
                {t('orgCreate.contactEmailLabel')}
              </label>
              <input
                type="email"
                placeholder={t('orgCreate.contactEmailPlaceholder')}
                value={orgForm.primaryContact}
                onChange={(e) => setOrgForm({ ...orgForm, primaryContact: e.target.value })}
                required
                className="w-full rounded-lg border-none bg-[#eff4f9] px-4 py-3 text-sm font-medium text-[#171c20] transition-all outline-none focus:bg-white focus:ring-2 focus:ring-[#002045]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
              {t('orgCreate.missionLabel')}
            </label>
            <textarea
              placeholder={t('orgCreate.missionPlaceholder')}
              value={orgForm.description}
              onChange={(e) => setOrgForm({ ...orgForm, description: e.target.value })}
              required
              rows={4}
              className="w-full resize-none rounded-lg border-none bg-[#eff4f9] px-4 py-3 text-sm font-medium text-[#171c20] transition-all outline-none focus:bg-white focus:ring-2 focus:ring-[#002045]"
            />
          </div>

          <div className="border-t border-[#dee3e8] pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#002045] py-4 font-bold text-white transition-all hover:bg-[#1a365d] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? t('orgCreate.btnSubmitting') : t('orgCreate.btnSubmit')}
              {!isLoading && <span className="material-symbols-outlined">send</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrgCreate;
