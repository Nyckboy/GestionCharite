// src/pages/public/CampaignDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import type { CharityAction, Donation } from '../../types';

const CampaignDetail = () => {
  const { actionId } = useParams();
  const { isAuthenticated, user } = useAuth();
  
  const [campaign, setCampaign] = useState<CharityAction | null>(null);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Donation Form State
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchCampaignData = async () => {
      setIsLoading(true);
      try {
        // Fetch specific campaign details (You will need a GET /actions/{id} endpoint!)
        const campaignRes = await apiClient.get<CharityAction>(`/actions/${actionId}`);
        setCampaign(campaignRes.data);

        // Fetch recent donations
        const donationsRes = await apiClient.get<Donation[]>(`/donations/action/${actionId}`);
        setRecentDonations(donationsRes.data);
      } catch (error) {
        console.error("Failed to fetch campaign details", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (actionId) fetchCampaignData();
  }, [actionId]);

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      await apiClient.post('/donations', {
        amount: parseFloat(amount),
        actionId: Number(actionId)
      });
      setStatusMessage({ type: 'success', text: 'Thank you for your generous donation!' });
      setAmount('');
      
      // Refresh donations locally
      const donationsRes = await apiClient.get<Donation[]>(`/donations/action/${actionId}`);
      setRecentDonations(donationsRes.data);
      
      // Optimistically update the current amount in the UI
      if (campaign) {
        setCampaign({ ...campaign, currentAmount: campaign.currentAmount + parseFloat(amount) });
      }
    } catch (error: any) {
      setStatusMessage({ type: 'error', text: error.response?.data?.message || 'Failed to process donation.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center text-gray-500 animate-pulse">Loading campaign details...</div>;
  if (!campaign) return <div className="p-20 text-center text-red-500">Campaign not found.</div>;

  const progressPercentage = Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100);

  return (
    <div className="max-w-6xl p-8 mx-auto mt-4 fade-in">
      <Link to="/" className="inline-block mb-6 text-sm text-blue-600 hover:underline">&larr; Back to Public Feed</Link>

      {/* Header Section */}
      <div className="mb-8">
        <span className="px-3 py-1 mb-4 text-xs font-bold text-blue-800 uppercase bg-blue-100 rounded-full inline-block">
          {campaign.category}
        </span>
        <h1 className="mb-4 text-4xl font-extrabold text-gray-900">{campaign.title}</h1>
        <p className="text-lg text-gray-600">{campaign.description}</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        
        {/* LEFT COLUMN: The Story & Details (Takes up 2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Image Placeholder */}
          <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
            [High Quality Campaign Image / Video Placeholder]
          </div>

          {/* Organization Info Card */}
          <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold">
              {campaign.organizationName ? campaign.organizationName.charAt(0) : 'O'}
            </div>
            <div>
              <p className="text-sm text-gray-500">Organized by</p>
              <p className="font-bold text-gray-800">
                {campaign.organizationName || 'Registered Organization (Backend Update Needed)'}
                <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Verified ✓</span>
              </p>
            </div>
          </div>

          {/* The Rich Story */}
          <div>
            <h2 className="mb-4 text-2xl font-bold border-b pb-2">The Story</h2>
            {/* When replacing this with actual backend HTML later, remember to use DOMPurify! */}
            <div className="text-gray-700 leading-relaxed space-y-4">
              {campaign.longStory ? (
                <p>{campaign.longStory}</p>
              ) : (
                <>
                  <p>*(This is a placeholder for the rich-text story. You can add a `longStory` field to your database later to hold multiple paragraphs, images, and formatting.)*</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </>
              )}
            </div>
          </div>

          {/* Milestone / Updates Timeline */}
          <div>
            <h2 className="mb-4 text-2xl font-bold border-b pb-2">Campaign Updates</h2>
            {campaign.updates && campaign.updates.length > 0 ? (
              <div className="space-y-4">
                {campaign.updates.map((update, i) => (
                  <div key={i} className="pl-4 border-l-2 border-blue-500">
                    <p className="text-xs text-gray-500">{update.date}</p>
                    <p className="text-gray-700">{update.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-4 text-sm text-gray-500 bg-gray-50 rounded italic">
                No updates posted yet. Check back later to see the impact of this campaign!
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Donation Widget (Takes up 1/3 width) */}
        <div className="relative">
          <div className="sticky top-8 space-y-6">
            
            {/* Progress & Checkout Card */}
            <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-lg">
              
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-extrabold text-gray-900">{campaign.currentAmount} MAD</span>
                  <span className="text-sm font-semibold text-gray-500">raised of {campaign.targetAmount} MAD target</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <p className="mt-2 text-sm text-gray-500">{recentDonations.length} total donations</p>
              </div>

              {statusMessage && (
                <div className={`p-3 mb-4 text-sm rounded ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {statusMessage.text}
                </div>
              )}

              {!isAuthenticated ? (
                <div className="p-4 text-center bg-blue-50 rounded-lg">
                  <p className="mb-3 text-sm text-gray-700 font-medium">Log in to make a secure donation.</p>
                  <Link to="/login" className="block w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 font-bold mb-2">Log In</Link>
                  <Link to="/register" className="block w-full py-2 text-blue-600 bg-white border border-blue-200 rounded hover:bg-blue-50 font-bold">Sign Up</Link>
                </div>
              ) : user?.role !== 'USER' ? (
                <div className="p-4 text-sm text-center text-yellow-800 bg-yellow-50 rounded-lg">
                  Admins cannot make public donations.
                </div>
              ) : (
                <form onSubmit={handleDonationSubmit} className="space-y-4">
                  <div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 font-bold">DH</span>
                      <input 
                        type="number" step="0.01" min="1" required value={amount} onChange={(e) => setAmount(e.target.value)}
                        className="w-full py-3 pl-12 pr-4 text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting || !amount} className="w-full py-4 text-lg font-extrabold text-white transition-colors bg-green-600 rounded-lg shadow-md hover:bg-green-700 disabled:bg-green-300">
                    {isSubmitting ? 'Processing...' : 'Donate Now'}
                  </button>
                  <p className="text-xs text-center text-gray-400">🔒 Secure payment processing.</p>
                </form>
              )}

              {/* Share Buttons Placeholder */}
              <div className="mt-6 flex gap-2">
                 <button className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded hover:bg-gray-200">Share</button>
                 <button className="flex-1 py-2 text-sm font-semibold text-white bg-green-500 rounded hover:bg-green-600">WhatsApp</button>
              </div>
            </div>

            {/* Live Donors Feed */}
            <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Recent Supporters
              </h3>

              {recentDonations.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Be the first to support this cause!</p>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {recentDonations.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 text-sm font-bold text-blue-600 bg-blue-100 rounded-full flex items-center justify-center">
                          {donation.firstName ? donation.firstName.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{donation.firstName || 'Anonymous'}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(donation.donationDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="font-bold text-sm text-gray-900">
                        {donation.amount} MAD
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CampaignDetail;