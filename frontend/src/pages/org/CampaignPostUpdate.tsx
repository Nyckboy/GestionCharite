import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../api/axios';
import { getErrorMessage } from '../../utils/errorHandler';

const CampaignPostUpdate = () => {
  const navigate = useNavigate();
  const { id: orgId, actionId } = useParams();
  const { t } = useTranslation();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post(`/actions/${actionId}/updates`, { message });
      navigate(`/organization/${orgId}/campaigns`);
    } catch (err) {
      setError(getErrorMessage(err) || t('campaignUpdate.errPost'));
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-2xl space-y-6 font-['Inter',sans-serif]">
      <Link
        to={`/organization/${orgId}/campaigns`}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#002045] hover:underline"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>{' '}
        {t('campaignUpdate.backToCampaigns')}
      </Link>

      <div className="overflow-hidden rounded-2xl border border-[#dee3e8] bg-white shadow-sm">
        <div className="flex items-center gap-4 border-b border-[#dee3e8] bg-[#f5faff]/50 px-8 py-6">
          <div className="rounded-xl bg-[#e4e9ee] p-3">
            <span className="material-symbols-outlined text-[#002045]">campaign</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#002045]">{t('campaignUpdate.title')}</h2>
            <p className="mt-1 text-sm font-medium text-[#74777f]">
              {t('campaignUpdate.subtitle')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8">
          {error && (
            <div className="rounded-lg bg-[#ffdad6] p-4 text-sm font-bold text-[#ba1a1a]">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
              {t('campaignUpdate.messageLabel')}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              className="w-full resize-none rounded-xl border-none bg-[#eff4f9] px-5 py-4 text-sm font-medium text-[#171c20] outline-none focus:ring-2 focus:ring-[#002045]"
              placeholder={t('campaignUpdate.messagePlaceholder')}
            ></textarea>
            <p className="text-right text-xs font-semibold text-[#74777f]">
              {t('campaignUpdate.visibilityNote')}
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#002045] py-4 font-bold text-white transition-all hover:bg-[#1a365d] active:scale-[0.99] disabled:opacity-50"
          >
            <span className="material-symbols-outlined">send</span>
            {isLoading ? t('campaignUpdate.btnPublishing') : t('campaignUpdate.btnPublish')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CampaignPostUpdate;
