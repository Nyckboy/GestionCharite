import React, { useState } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../api/axios';
import type { Category } from '../../types';
import { supabase } from '../../api/supabase';
import { getErrorMessage } from '../../utils/errorHandler';

const CampaignCreate = () => {
  const navigate = useNavigate();
  const { id: orgId } = useParams();
  const location = useLocation();
  const { t } = useTranslation();
  const cameFromOrgList = location.state?.fromOrgList;

  const backUrl = cameFromOrgList ? '/organization/list' : `/organization/${orgId}/campaigns`;
  const backLabel = cameFromOrgList
    ? t('campaignList.backToOrgs')
    : t('campaignEdit.backToCampaigns');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    actionDate: '',
    location: '',
    targetAmount: '',
    category: 'EDUCATION' as Category,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    let mediaUrl = '';

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `actions/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('campaign-images')
          .upload(filePath, imageFile);
        if (uploadError) throw new Error('Failed to upload image to Supabase');

        const { data: publicUrlData } = supabase.storage
          .from('campaign-images')
          .getPublicUrl(filePath);
        mediaUrl = publicUrlData.publicUrl;
      }

      await apiClient.post('/actions', {
        ...campaignForm,
        targetAmount: parseFloat(campaignForm.targetAmount),
        organizationId: Number(orgId),
        mediaUrl: mediaUrl,
      });
      navigate(backUrl);
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to create campaign.');
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 font-['Inter',sans-serif]">
      <Link
        to={backUrl}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#002045] hover:underline"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span> {backLabel}
      </Link>

      <div className="overflow-hidden rounded-2xl border border-[#dee3e8] bg-white shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
        <div className="border-b border-[#dee3e8] bg-[#f5faff]/50 px-8 py-6">
          <h2 className="text-2xl font-bold text-[#002045]">{t('campaignCreate.title')}</h2>
          <p className="mt-1 text-sm font-medium text-[#74777f]">{t('campaignCreate.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-[#ffdad6] p-4 text-sm font-bold text-[#ba1a1a]">
              <span className="material-symbols-outlined">error</span> {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
              {t('campaignCreate.campaignImage')}
            </label>
            <div className="flex w-full items-center justify-center">
              <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#dee3e8] bg-[#f5faff] transition-colors hover:bg-[#eff4f9]">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <span className="material-symbols-outlined mb-2 text-3xl text-[#74777f]">
                    cloud_upload
                  </span>
                  <p className="mb-1 text-sm font-semibold text-[#43474e]">
                    {imageFile ? (
                      imageFile.name
                    ) : (
                      <>
                        <span className="text-[#002045]">{t('campaignCreate.clickToUpload')}</span>{' '}
                        {t('campaignCreate.dragAndDrop')}
                      </>
                    )}
                  </p>
                  <p className="text-xs text-[#74777f]">{t('campaignCreate.fileConstraints')}</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
              {t('campaignEdit.campaignTitle')}
            </label>
            <input
              type="text"
              value={campaignForm.title}
              onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
              required
              className="w-full rounded-lg border-none bg-[#eff4f9] px-4 py-3 text-sm font-medium text-[#171c20] outline-none focus:ring-2 focus:ring-[#002045]"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
                {t('campaignEdit.category')}
              </label>
              <select
                value={campaignForm.category}
                onChange={(e) =>
                  setCampaignForm({ ...campaignForm, category: e.target.value as Category })
                }
                className="w-full appearance-none rounded-lg border-none bg-[#eff4f9] px-4 py-3 text-sm font-medium text-[#171c20] outline-none focus:ring-2 focus:ring-[#002045]"
              >
                <option value="EDUCATION">{t('campaignEdit.catEducation')}</option>
                <option value="ENVIRONNEMENT">{t('campaignEdit.catEnvironment')}</option>
                <option value="SANTE">{t('campaignEdit.catHealth')}</option>
                <option value="URGENCE">{t('campaignEdit.catEmergency')}</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
                {t('campaignEdit.targetAmount')}
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm font-bold text-[#74777f]">
                  MAD
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={campaignForm.targetAmount}
                  onChange={(e) =>
                    setCampaignForm({ ...campaignForm, targetAmount: e.target.value })
                  }
                  required
                  className="w-full rounded-lg border-none bg-[#eff4f9] py-3 pr-4 pl-14 text-sm font-medium text-[#171c20] outline-none focus:ring-2 focus:ring-[#002045]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
                {t('campaignEdit.actionDate')}
              </label>
              <input
                type="date"
                value={campaignForm.actionDate}
                onChange={(e) => setCampaignForm({ ...campaignForm, actionDate: e.target.value })}
                required
                className="w-full rounded-lg border-none bg-[#eff4f9] px-4 py-3 text-sm font-medium text-[#171c20] outline-none focus:ring-2 focus:ring-[#002045]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
                {t('campaignEdit.location')}
              </label>
              <input
                type="text"
                value={campaignForm.location}
                onChange={(e) => setCampaignForm({ ...campaignForm, location: e.target.value })}
                required
                className="w-full rounded-lg border-none bg-[#eff4f9] px-4 py-3 text-sm font-medium text-[#171c20] outline-none focus:ring-2 focus:ring-[#002045]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
              {t('campaignEdit.description')}
            </label>
            <textarea
              value={campaignForm.description}
              onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
              required
              rows={4}
              className="w-full resize-none rounded-lg border-none bg-[#eff4f9] px-4 py-3 text-sm font-medium text-[#171c20] outline-none focus:ring-2 focus:ring-[#002045]"
            />
          </div>

          <div className="border-t border-[#dee3e8] pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#002045] py-4 font-bold text-white transition-all hover:bg-[#1a365d] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? t('campaignCreate.btnLaunching') : t('campaignCreate.btnLaunch')}
              {!isLoading && <span className="material-symbols-outlined">rocket_launch</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignCreate;
