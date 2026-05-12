import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../api/axios';
import type { CharityAction, Donation, PageResponse } from '../../types';
import CampaignStory from '../../components/campaign/CampaignStory';
import DonationWidget from '../../components/campaign/DonationWidget';

const CampaignDetail = () => {
  const { actionId } = useParams();
  const { t } = useTranslation();
  const [campaign, setCampaign] = useState<CharityAction | null>(null);

  // Donation Pagination State
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [donationPage, setDonationPage] = useState(0);
  const [donationTotalPages, setDonationTotalPages] = useState(1);
  const [isDonationsLoading, setIsDonationsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const PAGE_SIZE = 5;

  const fetchData = useCallback(async () => {
    try {
      const [campRes, donRes] = await Promise.all([
        apiClient.get<CharityAction>(`/actions/${actionId}`),
        apiClient.get<PageResponse<Donation>>(`/donations/action/${actionId}`, {
          params: { page: 0, size: PAGE_SIZE },
        }),
      ]);

      setCampaign(campRes.data);
      setRecentDonations(donRes.data.content);
      setDonationTotalPages(donRes.data.totalPages);
      setDonationPage(0);
    } catch (error) {
      console.error('Fetch failed', error);
    } finally {
      setIsLoading(false);
    }
  }, [actionId]);

  useEffect(() => {
    if (actionId) fetchData();
  }, [actionId, fetchData]);

  const loadMoreDonations = async () => {
    if (donationPage >= donationTotalPages - 1) return;

    setIsDonationsLoading(true);
    try {
      const nextPage = donationPage + 1;
      const response = await apiClient.get<PageResponse<Donation>>(
        `/donations/action/${actionId}`,
        {
          params: { page: nextPage, size: PAGE_SIZE },
        },
      );

      setRecentDonations((prev) => [...prev, ...response.data.content]);
      setDonationTotalPages(response.data.totalPages);
      setDonationPage(nextPage);
    } catch (error) {
      console.error('Failed to load more donations', error);
    } finally {
      setIsDonationsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="animate-pulse py-24 text-center font-bold text-[#43474e]">
        {t('campaignDetail.verifying')}
      </div>
    );
  if (!campaign)
    return <div className="py-24 text-center text-[#ba1a1a]">{t('campaignDetail.notFound')}</div>;

  return (
    <main className="mx-auto max-w-[1440px] px-6 pt-24 pb-16 font-['Inter',sans-serif] lg:px-8">
      <header className="mb-10">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#002045] hover:underline"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>{' '}
          {t('campaignDetail.backToFeed')}
        </Link>
        <div className="flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#006d3c]/10 px-3 py-1">
            <span
              className="material-symbols-outlined text-[18px] text-[#006d3c]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span className="text-[10px] font-bold tracking-widest text-[#006d3c] uppercase">
              {t('campaignDetail.verified')} {campaign.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[#002045]">{campaign.title}</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <CampaignStory campaign={campaign} />
        </div>
        <div className="lg:col-span-4">
          <DonationWidget
            campaign={campaign}
            recentDonations={recentDonations}
            onDonationSuccess={fetchData}
            onLoadMore={loadMoreDonations}
            hasMore={donationPage < donationTotalPages - 1}
            isLoadingMore={isDonationsLoading}
          />
        </div>
      </div>
    </main>
  );
};

export default CampaignDetail;
