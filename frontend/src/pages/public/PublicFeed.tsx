import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { CharityAction, Category, PageResponse } from '../../types';
import { useTranslation } from 'react-i18next';

const categories: { labelKey: string; value: Category | 'ALL' }[] = [
  { labelKey: 'publicFeed.catAll', value: 'ALL' },
  { labelKey: 'publicFeed.catEdu', value: 'EDUCATION' },
  { labelKey: 'publicFeed.catEnv', value: 'ENVIRONNEMENT' },
  { labelKey: 'publicFeed.catHealth', value: 'SANTE' },
  { labelKey: 'publicFeed.catEmergency', value: 'URGENCE' },
];

const PublicFeed = () => {
  const [campaigns, setCampaigns] = useState<CharityAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const { t } = useTranslation();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 9; // Good grid number for 3 columns

  // Reset to page 0 whenever the category changes
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory]);

  const fetchPublicCampaigns = useCallback(async () => {
    setIsLoading(true);
    try {
      const endpoint =
        selectedCategory === 'ALL' ? '/actions' : `/actions/category/${selectedCategory}`;

      const response = await apiClient.get<PageResponse<CharityAction>>(endpoint, {
        params: {
          page: currentPage,
          size: pageSize,
        },
      });

      // If page is 0, replace data. If > 0, append data (for a "Load More" feel)
      if (currentPage === 0) {
        setCampaigns(response.data.content);
      } else {
        setCampaigns((prev) => [...prev, ...response.data.content]);
      }

      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch campaigns', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, currentPage]);

  useEffect(() => {
    fetchPublicCampaigns();
  }, [fetchPublicCampaigns]);

  const loadNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5faff]">
      {/* Hero Section */}
      <section className="relative flex h-[500px] items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqoh9-np6jaI482MjLglSN0klsBSi9f5BPXftc3TaCNg2_au2eSJjQ6eJIhfAlwKm5lLpUxGsRNSJIsFrCFkmS4xeEATdWAg9OmU3SXJ-eG9y_kq05Wl9ClBpAB6k3ZtPNXimGxDqMfwmPDPshRhQ6Elobd8-LJhg4rOnswfgv-rrOkdynXE2rE_TBvCtcbP5IW--UgEJ04BtGYYoWRDSTzsZc_jHMsadlJRg4lm9YiWA2CbEbO6MeUB2sVn8ElRcrZ22nOR9_JGhd"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#002045]/95 to-[#002045]/60"></div>
        </div>
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 text-white">
          <div className="max-w-2xl">
            <h1 className="mb-6 text-5xl font-bold tracking-tight">{t('publicFeed.heroTitle')}</h1>
            <p className="mb-8 text-lg leading-relaxed text-white/90">
              {t('publicFeed.heroSubtitle')}
            </p>
            <div className="flex gap-4">
              <button className="rounded-xl bg-[#48bb78] px-8 py-3 font-semibold text-white shadow-lg transition-all hover:bg-[#38a169] active:scale-95">
                {t('publicFeed.btnExplore')}
              </button>
              <button className="rounded-xl border border-white/20 bg-white/10 px-8 py-3 font-semibold backdrop-blur-md transition-all hover:bg-white/20">
                {t('publicFeed.btnHowItWorks')}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-16">
        {/* Filter Bar */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="scrollbar-hide flex w-full gap-2 overflow-x-auto pb-2 md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`rounded-full px-6 py-2.5 text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-[#002045] text-white shadow-md'
                    : 'border border-[#c4c6cf] bg-white text-[#43474e] hover:border-[#002045] hover:text-[#002045]'
                }`}
              >
                {t(cat.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Grid */}
        {isLoading && currentPage === 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-[450px] animate-pulse rounded-2xl border border-[#dee3e8] bg-white shadow-sm"
              ></div>
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#dee3e8] bg-white py-24 text-center shadow-sm">
            <span className="material-symbols-outlined mb-4 text-6xl text-[#c4c6cf]">
              search_off
            </span>
            <h3 className="mb-2 text-xl font-bold text-[#002045]">{t('publicFeed.noCampaigns')}</h3>
            <p className="text-[#74777f]">{t('publicFeed.noCampaignsSub')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => {
                const progress = Math.min(
                  (campaign.currentAmount / campaign.targetAmount) * 100,
                  100,
                );

                return (
                  <div
                    key={campaign.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[#dee3e8] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-56 overflow-hidden bg-[#eff4f9]">
                      {campaign.mediaUrl ? (
                        <img
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          src={campaign.mediaUrl}
                          alt={campaign.title}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold tracking-widest text-[#74777f] uppercase">
                          {t('publicFeed.noPreview')}
                        </div>
                      )}
                      <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-wider text-[#006d3c] uppercase shadow-sm backdrop-blur">
                        {campaign.category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="mb-3 line-clamp-2 text-xl leading-tight font-bold text-[#002045] transition-colors group-hover:text-[#1a365d]">
                        {campaign.title}
                      </h3>
                      <p className="mb-6 line-clamp-3 flex-1 text-sm leading-relaxed text-[#74777f]">
                        {campaign.description}
                      </p>

                      <div className="mt-auto">
                        <div className="mb-3 flex items-end justify-between">
                          <div>
                            <p className="mb-0.5 text-xs font-bold tracking-wider text-[#74777f] uppercase">
                              {t('publicFeed.raised')}
                            </p>
                            <span className="text-lg font-bold text-[#002045]">
                              {campaign.currentAmount.toLocaleString()} MAD
                            </span>
                          </div>
                          <span className="text-sm font-bold text-[#006d3c]">
                            {progress.toFixed(0)}%
                          </span>
                        </div>
                        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-[#eff4f9]">
                          <div
                            className="h-full rounded-full bg-[#48bb78] transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <Link
                          to={`/donate/${campaign.id}`}
                          className="block w-full rounded-xl bg-[#002045] py-3.5 text-center font-bold text-white transition-all hover:bg-[#1a365d] active:scale-[0.98]"
                        >
                          {t('publicFeed.supportMission')}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Pagination */}
            {currentPage < totalPages - 1 && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={loadNextPage}
                  disabled={isLoading}
                  className="flex items-center gap-2 rounded-xl border-2 border-[#002045] bg-transparent px-8 py-3.5 font-bold text-[#002045] transition-all hover:bg-[#002045] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <>{t('publicFeed.btnLoading')}</>
                  ) : (
                    <>
                      {t('publicFeed.btnLoadMore')}
                      <span className="material-symbols-outlined text-[20px]">expand_more</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default PublicFeed;
