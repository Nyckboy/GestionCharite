import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../api/axios';
import type { OrgAdminStats, CharityAction } from '../../types';

const OrgDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<OrgAdminStats | null>(null);
  const [campaigns, setCampaigns] = useState<CharityAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, campaignsRes] = await Promise.all([
          apiClient.get<OrgAdminStats>('/organizations/me/stats'),
          apiClient.get<CharityAction[]>('/actions/me/all'),
        ]);
        setStats(statsRes.data);
        setCampaigns(campaignsRes.data);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse py-24 text-center font-bold text-[#43474e]">
        {t('orgDashboard.loading')}
      </div>
    );
  }

  const displayStats = stats || { totalOrganizations: 0, totalCampaigns: 0, totalRaised: 0 };

  return (
    <div className="space-y-8 font-['Inter',sans-serif]">
      <div className="mb-2 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#002045]">
            {t('orgDashboard.title')}
          </h1>
          <p className="mt-1 text-sm font-medium text-[#74777f]">{t('orgDashboard.subtitle')}</p>
        </div>
        <Link
          to="/organization/list"
          className="flex items-center gap-2 rounded-xl bg-[#002045] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#1a365d] active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">account_balance</span>
          {t('orgDashboard.btnManageOrgs')}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-[#dee3e8] bg-white p-6 shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-[#74777f] uppercase">
              {t('orgDashboard.totalRaised')}
            </span>
            <div className="rounded-lg bg-[#d6e3ff] p-2 text-[#004881]">
              <span className="material-symbols-outlined text-lg">payments</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-[#002045]">
            {displayStats.totalRaised.toLocaleString()}{' '}
            <span className="text-lg text-[#74777f]">{t('orgDashboard.currency')}</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#006d3c]">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>{' '}
            {t('orgDashboard.activeTracking')}
          </div>
        </div>

        <div className="rounded-xl border border-[#dee3e8] bg-white p-6 shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-[#74777f] uppercase">
              {t('orgDashboard.myCampaigns')}
            </span>
            <div className="rounded-lg bg-[#85f6ad]/20 p-2 text-[#006d3c]">
              <span className="material-symbols-outlined text-lg">rocket_launch</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-[#002045]">{displayStats.totalCampaigns}</div>
          <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#74777f]">
            <span className="material-symbols-outlined text-[14px]">schedule</span>{' '}
            {t('orgDashboard.ongoingMissions')}
          </div>
        </div>

        <div className="rounded-xl border border-[#dee3e8] bg-white p-6 shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-[#74777f] uppercase">
              {t('orgDashboard.registeredCharities')}
            </span>
            <div className="rounded-lg bg-[#e4e9ee] p-2 text-[#171c20]">
              <span className="material-symbols-outlined text-lg">account_balance</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-[#002045]">{displayStats.totalOrganizations}</div>
          <div className="mt-3 flex items-center gap-1 text-xs font-bold text-[#74777f]">
            <span className="material-symbols-outlined text-[14px]">verified</span>{' '}
            {t('orgDashboard.verifiedEntities')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#002045]">
              {t('orgDashboard.activeCampaigns')}
            </h3>
          </div>

          {campaigns.length === 0 ? (
            <div className="rounded-xl border border-[#dee3e8] bg-white p-12 text-center shadow-sm">
              <span className="material-symbols-outlined mb-4 text-4xl text-[#c4c6cf]">
                campaign
              </span>
              <p className="mb-1 font-bold text-[#171c20]">{t('orgDashboard.noCampaigns')}</p>
              <p className="text-sm text-[#74777f]">{t('orgDashboard.noCampaignsDesc')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {campaigns.map((campaign) => {
                const progress = Math.min(
                  (campaign.currentAmount / campaign.targetAmount) * 100,
                  100,
                );
                return (
                  <div
                    key={campaign.id}
                    className="flex flex-col overflow-hidden rounded-xl border border-[#dee3e8] bg-white shadow-sm"
                  >
                    <div className="relative h-40 bg-[#eff4f9]">
                      {campaign.mediaUrl ? (
                        <img
                          src={campaign.mediaUrl}
                          alt={campaign.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-bold tracking-widest text-[#74777f] uppercase">
                          {t('orgDashboard.noMedia')}
                        </div>
                      )}
                      <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-wider text-[#006d3c] uppercase shadow-sm backdrop-blur">
                        {campaign.category}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h4 className="mb-1 line-clamp-1 text-lg font-bold text-[#002045]">
                        {campaign.title}
                      </h4>
                      <p className="mb-4 line-clamp-2 flex-1 text-sm text-[#74777f]">
                        {campaign.description}
                      </p>

                      <div className="mt-auto space-y-3">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-[#43474e]">
                            {t('orgDashboard.raised')}: {campaign.currentAmount}
                          </span>
                          <span className="text-[#002045]">{progress.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#eff4f9]">
                          <div
                            className="h-full rounded-full bg-[#48bb78] transition-all duration-700"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs font-bold text-[#74777f]">
                            {t('orgDashboard.target')}: {campaign.targetAmount}{' '}
                            {t('orgDashboard.currency')}
                          </span>
                          <Link
                            to={`/organization/${campaign.organizationId}/campaign/${campaign.id}/edit`}
                            className="flex items-center gap-1 rounded-lg bg-[#eff4f9] px-3 py-1.5 text-xs font-bold text-[#002045] transition-colors hover:bg-[#d6e3ff]"
                          >
                            <span className="material-symbols-outlined text-[14px]">edit</span>
                            {t('orgDashboard.btnEdit')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pointer-events-none opacity-50 grayscale select-none xl:col-span-1">
          <div className="sticky top-24 rounded-xl border border-[#dee3e8] bg-white p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-[#002045]">
              <span className="material-symbols-outlined text-[#002045]">add_box</span>
              {t('orgDashboard.quickDraft')}
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
                  {t('orgDashboard.campaignTitle')}
                </label>
                <input
                  disabled
                  className="w-full rounded-lg border-0 bg-[#eff4f9] px-4 py-3 text-sm font-medium"
                  placeholder={t('orgDashboard.draftPlaceholder')}
                  type="text"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
                  {t('orgDashboard.category')}
                </label>
                <select
                  disabled
                  className="w-full appearance-none rounded-lg border-0 bg-[#eff4f9] px-4 py-3 text-sm font-medium"
                >
                  <option>{t('orgDashboard.healthcare')}</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
                  {t('orgDashboard.targetAmount')}
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm font-bold text-[#74777f]">
                    {t('orgDashboard.currency')}
                  </span>
                  <input
                    disabled
                    className="w-full rounded-lg border-0 bg-[#eff4f9] py-3 pr-4 pl-12 text-sm font-medium"
                    placeholder="50000"
                    type="number"
                  />
                </div>
              </div>
              <div className="pt-4">
                <button
                  disabled
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#002045] py-4 text-sm font-bold text-white"
                >
                  <span className="material-symbols-outlined">publish</span>{' '}
                  {t('orgDashboard.btnPublish')}
                </button>
                <p className="mt-4 text-center text-xs font-semibold text-[#74777f]">
                  {t('orgDashboard.draftSync')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgDashboard;
