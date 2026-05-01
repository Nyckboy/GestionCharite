import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { CharityAction, Donation } from '../../types';
import CampaignStory from '../../components/campaign/CampaignStory';
import DonationWidget from '../../components/campaign/DonationWidget';

const CampaignDetail = () => {
  const { actionId } = useParams();
  const [campaign, setCampaign] = useState<CharityAction | null>(null);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [campRes, donRes] = await Promise.all([
        apiClient.get<CharityAction>(`/actions/${actionId}`),
        apiClient.get<Donation[]>(`/donations/action/${actionId}`),
      ]);
      setCampaign(campRes.data);
      setRecentDonations(donRes.data);
    } catch (error) {
      console.error('Fetch failed', error);
    } finally {
      setIsLoading(false);
    }
  }, [actionId]);

  useEffect(() => {
    if (actionId) fetchData();
  }, [actionId, fetchData]);

  if (isLoading)
    return (
      <div className="animate-pulse py-24 text-center font-bold text-[#43474e]">
        Verifying Registry...
      </div>
    );
  if (!campaign) return <div className="py-24 text-center text-[#ba1a1a]">Campaign not found.</div>;

  return (
    <main className="mx-auto max-w-360 px-6 pt-24 pb-16 font-['Inter',sans-serif] lg:px-8">
      {/* Header Area */}
      <header className="mb-10">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#002045] hover:underline"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Feed
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
              Verified {campaign.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[#002045]">{campaign.title}</h1>
        </div>
      </header>

      {/* Grid: Story (8 cols) & Widget (4 cols) */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <CampaignStory campaign={campaign} />
        </div>
        <div className="lg:col-span-4">
          <DonationWidget
            campaign={campaign}
            recentDonations={recentDonations}
            onDonationSuccess={fetchData}
          />
        </div>
      </div>
    </main>
  );
};

export default CampaignDetail;
