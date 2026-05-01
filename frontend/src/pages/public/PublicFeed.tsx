import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { CharityAction, Category } from '../../types';

const categories: { label: string; value: Category | 'ALL' }[] = [
  { label: 'All Causes', value: 'ALL' },
  { label: 'Education', value: 'EDUCATION' },
  { label: 'Environment', value: 'ENVIRONNEMENT' },
  { label: 'Health', value: 'SANTE' },
  { label: 'Emergency', value: 'URGENCE' },
];

const PublicFeed = () => {
  const [campaigns, setCampaigns] = useState<CharityAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');

  useEffect(() => {
    const fetchPublicCampaigns = async () => {
      setIsLoading(true);
      try {
        const endpoint =
          selectedCategory === 'ALL' ? '/actions' : `/actions/category/${selectedCategory}`;
        const response = await apiClient.get<CharityAction[]>(endpoint);
        setCampaigns(response.data);
      } catch (error) {
        console.error('Failed to fetch campaigns', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicCampaigns();
  }, [selectedCategory]);

  return (
    <div className="bg-[#f5faff]">
      {/* Hero Section */}
      <section className="relative flex h-112.5 items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqoh9-np6jaI482MjLglSN0klsBSi9f5BPXftc3TaCNg2_au2eSJjQ6eJIhfAlwKm5lLpUxGsRNSJIsFrCFkmS4xeEATdWAg9OmU3SXJ-eG9y_kq05Wl9ClBpAB6k3ZtPNXimGxDqMfwmPDPshRhQ6Elobd8-LJhg4rOnswfgv-rrOkdynXE2rE_TBvCtcbP5IW--UgEJ04BtGYYoWRDSTzsZc_jHMsadlJRg4lm9YiWA2CbEbO6MeUB2sVn8ElRcrZ22nOR9_JGhd"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#002045]/90 to-[#002045]/40"></div>
        </div>
        <div className="relative z-10 mx-auto w-full max-w-360 px-6 text-white">
          <div className="max-w-2xl">
            <h1 className="mb-6 text-5xl font-bold tracking-tight">
              Empowering transparent giving for lasting impact.
            </h1>
            <p className="mb-8 text-lg leading-relaxed opacity-90">
              Join a global network of donors and non-profits dedicated to measurable change. Every
              donation is tracked, every milestone celebrated.
            </p>
            <div className="flex gap-4">
              <button className="rounded-xl bg-[#006d3c] px-8 py-3 font-semibold text-white transition-all hover:shadow-lg active:scale-95">
                Explore Campaigns
              </button>
              <button className="rounded-xl border border-white/20 bg-white/10 px-8 py-3 font-semibold backdrop-blur-md transition-all hover:bg-white/20">
                How it Works
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-360 px-6 py-16">
        {/* Filter Bar */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex w-full gap-2 overflow-x-auto pb-2 md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`rounded-full px-6 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-[#1a365d] text-white'
                    : 'border border-[#c4c6cf] bg-white text-[#43474e] hover:border-[#1a365d]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          {/* <div className="flex items-center gap-4 text-xs font-bold tracking-widest text-[#43474e] uppercase opacity-50 grayscale">
            <span>Sort by:</span>
            <select
              disabled
              className="cursor-not-allowed border-none bg-transparent p-0 font-semibold text-[#002045]"
            >
              <option>Most Urgent</option>
            </select>
          </div> */}
        </div>

        {/* Campaign Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-96 animate-pulse rounded-2xl border border-[#dee3e8] bg-white"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => {
              const progress = Math.min(
                (campaign.currentAmount / campaign.targetAmount) * 100,
                100,
              );

              return (
                <div
                  key={campaign.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#dee3e8] bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="relative h-56 overflow-hidden bg-[#e9eef3]">
                    {campaign.mediaUrl ? (
                      <img
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={campaign.mediaUrl}
                        alt={campaign.title}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#74777f] italic">
                        No Preview Image
                      </div>
                    )}
                    <span className="absolute top-4 left-4 rounded-full bg-[#85f6ad] px-3 py-1 text-[10px] font-bold tracking-wider text-[#00723f] uppercase">
                      {campaign.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-2 line-clamp-2 text-xl font-bold text-[#002045]">
                      {campaign.title}
                    </h3>
                    <p className="mb-6 line-clamp-3 flex-1 text-sm leading-relaxed text-[#43474e]">
                      {campaign.description}
                    </p>

                    <div className="mt-auto">
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm font-bold text-[#002045]">
                          {campaign.currentAmount} MAD
                        </span>
                        <span className="text-xs font-semibold text-[#43474e]">
                          {progress.toFixed(0)}% of target
                        </span>
                      </div>
                      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-[#eff4f9]">
                        <div
                          className="h-full rounded-full bg-[#48bb78] transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <Link
                        to={`/donate/${campaign.id}`}
                        className="block w-full rounded-xl bg-[#002045] py-3 text-center font-semibold text-white transition-all hover:bg-[#1a365d]"
                      >
                        Support Mission
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default PublicFeed;
