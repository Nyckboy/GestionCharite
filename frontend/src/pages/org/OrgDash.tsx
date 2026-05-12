// src/pages/org/OrgDash.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import type { Organization } from '../../types';
import { getErrorMessage } from '../../utils/errorHandler';

const OrgDash = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const [view, setView] = useState<'list' | 'create'>('list');

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    legalAddress: '',
    taxIdentificationNumber: '',
    primaryContact: '',
    description: '',
  });
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (view === 'list') {
      fetchOrganizations();
    }
  }, [view]);

  const fetchOrganizations = async () => {
    setIsLoadingList(true);
    try {
      const response = await apiClient.get<Organization[]>('/organizations/my-orgs');
      setOrganizations(response.data);
    } catch (error) {
      console.error('Failed to fetch organizations', error);
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      await apiClient.post('/organizations', formData);
      setStatusMessage({
        type: 'success',
        text: t('orgDash.msgSuccess'),
      });
      setFormData({
        name: '',
        legalAddress: '',
        taxIdentificationNumber: '',
        primaryContact: '',
        description: '',
      });

      setTimeout(() => {
        setView('list');
        setStatusMessage(null);
      }, 2500);
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: getErrorMessage(error) || t('orgDash.msgError'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="flex items-center justify-between bg-blue-800 p-4 text-white shadow-md">
        <h1 className="text-xl font-bold">{t('orgDash.title')}</h1>
        <div className="flex items-center gap-4">
          <span>
            {t('orgDash.welcome')} {user?.firstName}
          </span>
          <button
            onClick={logout}
            className="rounded bg-red-600 px-4 py-2 text-sm transition-colors hover:bg-red-700"
          >
            {t('orgDash.btnLogout')}
          </button>
        </div>
      </nav>

      <div className="mx-auto mt-8 max-w-4xl p-8">
        {view === 'list' && (
          <div className="fade-in">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{t('orgDash.yourOrgs')}</h2>
                <p className="text-gray-600">{t('orgDash.manageOrgs')}</p>
              </div>
              <button
                onClick={() => setView('create')}
                className="rounded bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                {t('orgDash.btnRegisterNew')}
              </button>
            </div>

            {isLoadingList ? (
              <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                <p className="animate-pulse text-gray-500">{t('orgDash.loadingOrgs')}</p>
              </div>
            ) : organizations.length === 0 ? (
              <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                <p className="mb-4 text-gray-500">{t('orgDash.noOrgs')}</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {organizations.map((org) => (
                  <div
                    key={org.id}
                    className="flex flex-col justify-between rounded-lg border bg-white p-6 shadow-sm"
                  >
                    <div>
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="text-xl font-bold text-gray-800">{org.name}</h3>
                        <span
                          className={`rounded px-2 py-1 text-xs font-semibold ${org.isValidated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                        >
                          {org.isValidated
                            ? t('orgDash.statusApproved')
                            : t('orgDash.statusPending')}
                        </span>
                      </div>
                      <p className="mb-4 line-clamp-3 text-sm text-gray-600">{org.description}</p>
                      <p className="text-xs text-gray-500">
                        <strong>{t('orgDash.taxId')}</strong> {org.taxIdentificationNumber}
                      </p>
                    </div>

                    <div className="mt-6 flex gap-2 border-t border-gray-100 pt-4">
                      <button
                        disabled
                        className="w-1/2 cursor-not-allowed rounded bg-gray-100 px-3 py-2 text-sm text-gray-400"
                      >
                        {t('orgDash.btnEditSoon')}
                      </button>
                      <button
                        disabled
                        className="w-1/2 cursor-not-allowed rounded bg-gray-100 px-3 py-2 text-sm text-gray-400"
                      >
                        {t('orgDash.btnDeleteSoon')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'create' && (
          <div className="fade-in rounded-lg bg-white p-8 shadow-md">
            <button
              onClick={() => setView('list')}
              className="mb-6 text-sm text-blue-600 hover:underline"
            >
              {t('orgDash.backToList')}
            </button>

            <h2 className="mb-2 text-2xl font-bold text-gray-800">{t('orgDash.createTitle')}</h2>
            <p className="mb-6 text-gray-600">{t('orgDash.createSubtitle')}</p>

            {statusMessage && (
              <div
                className={`mb-6 rounded p-4 ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {statusMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmitOrg} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  {t('orgDash.orgNameLabel')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  {t('orgDash.legalAddressLabel')}
                </label>
                <input
                  type="text"
                  name="legalAddress"
                  value={formData.legalAddress}
                  onChange={handleChange}
                  required
                  className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    {t('orgDash.taxIdLabel')}
                  </label>
                  <input
                    type="text"
                    name="taxIdentificationNumber"
                    value={formData.taxIdentificationNumber}
                    onChange={handleChange}
                    required
                    className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-1/2">
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    {t('orgDash.primaryContactLabel')}
                  </label>
                  <input
                    type="text"
                    name="primaryContact"
                    value={formData.primaryContact}
                    onChange={handleChange}
                    required
                    className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  {t('orgDash.descLabel')}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded bg-blue-600 p-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isSubmitting ? t('orgDash.btnSubmitting') : t('orgDash.btnSubmit')}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgDash;
