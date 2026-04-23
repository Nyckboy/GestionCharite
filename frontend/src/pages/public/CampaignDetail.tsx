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

  const fetchCampaignData = useCallback(async () => {
    try {
      const campaignRes = await apiClient.get<CharityAction>(`/actions/${actionId}`);
      setCampaign(campaignRes.data);

      const donationsRes = await apiClient.get<Donation[]>(`/donations/action/${actionId}`);
      setRecentDonations(donationsRes.data);
    } catch (error) {
      console.error("Failed to fetch campaign details", error);
    } finally {
      setIsLoading(false);
    }
  }, [actionId]);

  useEffect(() => {
    if (actionId) {
      fetchCampaignData();
    }
  }, [actionId, fetchCampaignData]);

  if (isLoading) return <div className="p-20 text-center text-gray-500 animate-pulse">Loading campaign details...</div>;
  if (!campaign) return <div className="p-20 text-center text-red-500">Campaign not found.</div>;

  return (
    <div className="max-w-6xl p-8 mx-auto mt-4 fade-in">
      <Link to="/" className="inline-block mb-6 text-sm text-blue-600 hover:underline">&larr; Back to Public Feed</Link>

      {/* Header Section */}
      <div className="mb-8">
        <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-blue-800 uppercase bg-blue-100 rounded-full">
          {campaign.category}
        </span>
        <h1 className="mb-4 text-4xl font-extrabold text-gray-900">{campaign.title}</h1>
        <p className="text-lg text-gray-600">{campaign.description}</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Child Components handle their own UI logic now */}
        <CampaignStory campaign={campaign} />
        <DonationWidget 
          campaign={campaign} 
          recentDonations={recentDonations} 
          onDonationSuccess={fetchCampaignData} 
        />
      </div>
    </div>
  );
};

export default CampaignDetail;