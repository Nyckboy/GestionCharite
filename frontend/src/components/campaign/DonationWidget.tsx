import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import type { CharityAction, Donation } from '../../types';

interface DonationWidgetProps {
  campaign: CharityAction;
  recentDonations: Donation[];
  onDonationSuccess: () => void;
}

const DonationWidget: React.FC<DonationWidgetProps> = ({
  campaign,
  recentDonations,
  onDonationSuccess,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const progressPercentage = Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100);

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      await apiClient.post('/donations', {
        amount: parseFloat(amount),
        actionId: campaign.id,
      });
      setStatusMessage({ type: 'success', text: 'Thank you for your generous contribution!' });
      setAmount('');
      onDonationSuccess();
    } catch (error: any) {
      setStatusMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to process transaction.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sticky top-24 space-y-8 font-['Inter',sans-serif]">
      {/* 1. Main Donation Card */}
      <div className="rounded-xl border border-[#edf2f7] bg-white p-8 shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
        {/* Header Stats */}
        <div className="mb-4 flex items-end justify-between">
          <div>
            <span className="text-3xl font-semibold text-[#002045]">
              {campaign.currentAmount} MAD
            </span>
            <span className="ml-2 text-sm text-[#43474e]">raised of {campaign.targetAmount}</span>
          </div>
          <span className="text-sm font-semibold text-[#006d3c]">
            {progressPercentage.toFixed(0)}%
          </span>
        </div>

        {/* Progress Bar (Action Green) */}
        <div className="mb-8 h-3 w-full rounded-full bg-[#edf2f7]">
          <div
            className="h-3 rounded-full bg-[#38a169] transition-all duration-1000"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Status Messages */}
        {statusMessage && (
          <div
            className={`mb-6 rounded-lg p-4 text-sm font-medium ${statusMessage.type === 'success' ? 'border border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]' : 'border border-[#fecaca] bg-[#fef2f2] text-[#991b1b]'}`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Interactive Form or Auth Walls */}
        {!isAuthenticated ? (
          <div className="rounded-xl border border-[#edf2f7] bg-[#f7fafc] p-6 text-center">
            <p className="mb-4 text-sm font-medium text-[#171c20]">
              Log in to make a secure donation.
            </p>
            <Link
              to="/login"
              className="mb-2 block w-full rounded-lg bg-[#2b6cb0] py-3 font-semibold text-white transition-colors hover:bg-[#1a365d]"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="block w-full rounded-lg border border-[#2b6cb0] bg-white py-3 font-semibold text-[#2b6cb0] transition-colors hover:bg-[#f5faff]"
            >
              Sign Up
            </Link>
          </div>
        ) : user?.role !== 'USER' ? (
          <div className="rounded-xl bg-[#ffdad6] p-4 text-center text-sm font-medium text-[#93000a]">
            Administrative accounts cannot process public donations.
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-[#43474e]">
              Enter Donation Amount
            </label>
            <form onSubmit={handleDonationSubmit} className="space-y-4">
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm font-semibold text-[#74777f]">
                  MAD
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border-none bg-[#edf2f7] py-3 pr-4 pl-14 text-base font-medium text-[#171c20] transition-all outline-none focus:bg-white focus:ring-2 focus:ring-[#2b6cb0]"
                  placeholder="100.00"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !amount}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#48bb78] py-4 text-lg font-bold text-white transition-all hover:bg-[#38a169] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="material-symbols-outlined">volunteer_activism</span>
                <span>{isSubmitting ? 'Processing...' : 'Donate Now'}</span>
              </button>
            </form>
            <p className="px-4 text-center text-xs font-medium text-[#74777f]">
              Your contribution is tax-deductible and directly supports the mission.
            </p>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-8 flex items-center justify-between border-t border-[#edf2f7] pt-6 text-[#43474e]">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[18px]">group</span>
            <span className="text-sm font-semibold">{recentDonations.length} Donors</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            <span className="text-sm font-semibold text-[#2b6cb0]">Active</span>
          </div>
        </div>
      </div>

      {/* 2. Supporters Feed */}
      <div className="overflow-hidden rounded-xl border border-[#edf2f7] bg-white shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
        <div className="flex items-center justify-between border-b border-[#edf2f7] px-8 py-6">
          <h3 className="text-sm font-semibold text-[#002045]">Recent Supporters</h3>
          <span className="cursor-not-allowed text-xs font-semibold tracking-wider text-[#2b6cb0] uppercase opacity-50">
            View All
          </span>
        </div>

        <div className="custom-scrollbar max-h-[300px] space-y-2 overflow-y-auto p-4">
          {recentDonations.length === 0 ? (
            <p className="py-4 text-center text-sm text-[#74777f] italic">
              Be the first to support this cause!
            </p>
          ) : (
            recentDonations.map((donation, index) => {
              // Cycle through a few light background colors for avatars just like the HTML
              const bgColors = [
                'bg-blue-100 text-blue-700',
                'bg-emerald-100 text-emerald-700',
                'bg-slate-100 text-slate-700',
                'bg-purple-100 text-purple-700',
              ];
              const colorClass = bgColors[index % bgColors.length];

              return (
                <div
                  key={donation.id}
                  className="flex items-center space-x-4 rounded-lg p-2 transition-colors hover:bg-[#f7fafc]"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${colorClass}`}
                  >
                    {donation.firstName ? donation.firstName.substring(0, 2).toUpperCase() : 'AN'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#002045]">
                      {donation.firstName || 'Anonymous'}
                    </p>
                    <p className="text-xs font-bold text-[#006d3c]">{donation.amount} MAD</p>
                  </div>
                  <p className="text-[10px] text-[#74777f]">
                    {new Date(donation.donationDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationWidget;
