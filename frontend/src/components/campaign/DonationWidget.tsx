import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import type { CharityAction, Donation } from '../../types';
import { getErrorMessage } from '../../utils/errorHandler';

interface DonationWidgetProps {
  campaign: CharityAction;
  recentDonations: Donation[];
  onDonationSuccess: () => void;
  // New Pagination Props
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}

const DonationWidget: React.FC<DonationWidgetProps> = ({
  campaign,
  recentDonations,
  onDonationSuccess,
  onLoadMore,
  hasMore,
  isLoadingMore,
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
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: getErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sticky top-24 space-y-8 font-['Inter',sans-serif]">
      {/* 1. Main Donation Card */}
      <div className="rounded-2xl border border-[#dee3e8] bg-white p-8 shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
        {/* Header Stats */}
        <div className="mb-4 flex items-end justify-between">
          <div>
            <span className="text-3xl font-bold text-[#002045]">
              {campaign.currentAmount.toLocaleString()} MAD
            </span>
            <span className="ml-2 text-sm font-semibold text-[#74777f]">
              raised of {campaign.targetAmount.toLocaleString()}
            </span>
          </div>
          <span className="text-sm font-bold text-[#006d3c]">{progressPercentage.toFixed(0)}%</span>
        </div>

        {/* Progress Bar (Action Green) */}
        <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-[#eff4f9]">
          <div
            className="h-full rounded-full bg-[#48bb78] transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Status Messages */}
        {statusMessage && (
          <div
            className={`mb-6 flex items-center gap-2 rounded-xl p-4 text-sm font-bold ${statusMessage.type === 'success' ? 'border border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]' : 'border border-[#fecaca] bg-[#ffdad6] text-[#ba1a1a]'}`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {statusMessage.type === 'success' ? 'check_circle' : 'error'}
            </span>
            {statusMessage.text}
          </div>
        )}

        {/* Interactive Form or Auth Walls */}
        {!isAuthenticated ? (
          <div className="rounded-xl border border-[#dee3e8] bg-[#f5faff] p-6 text-center">
            <p className="mb-4 text-sm font-bold text-[#002045]">
              Log in to make a secure donation.
            </p>
            <Link
              to="/login"
              className="mb-2 block w-full rounded-xl bg-[#002045] py-3.5 font-bold text-white transition-colors hover:bg-[#1a365d]"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="block w-full rounded-xl border border-[#c4c6cf] bg-white py-3.5 font-bold text-[#43474e] transition-colors hover:bg-[#eff4f9]"
            >
              Sign Up
            </Link>
          </div>
        ) : user?.role !== 'USER' ? (
          <div className="rounded-xl bg-[#ffdad6] p-4 text-center text-sm font-bold text-[#ba1a1a]">
            Administrative accounts cannot process public donations.
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block text-xs font-bold tracking-wider text-[#74777f] uppercase">
              Donation Amount
            </label>
            <form onSubmit={handleDonationSubmit} className="space-y-4">
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm font-bold text-[#74777f]">
                  MAD
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border-none bg-[#eff4f9] py-4 pr-4 pl-14 text-base font-bold text-[#171c20] transition-all outline-none focus:bg-white focus:ring-2 focus:ring-[#002045]"
                  placeholder="100.00"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !amount}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#48bb78] py-4 text-base font-bold text-white transition-all hover:bg-[#38a169] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
                <span>{isSubmitting ? 'Processing Securely...' : 'Donate Now'}</span>
              </button>
            </form>
            <p className="px-4 text-center text-[10px] font-bold tracking-widest text-[#74777f] uppercase">
              Tax-deductible contribution
            </p>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-8 flex items-center justify-between border-t border-[#dee3e8] pt-6 text-[#74777f]">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[18px]">public</span>
            <span className="text-sm font-bold">Global Reach</span>
          </div>
          <div className="flex items-center space-x-1.5 rounded-lg bg-[#d6e3ff] px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#004881] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#002045]"></span>
            </span>
            <span className="text-xs font-bold tracking-wider text-[#002045] uppercase">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* 2. Supporters Feed */}
      <div className="overflow-hidden rounded-2xl border border-[#dee3e8] bg-white shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
        <div className="flex items-center justify-between border-b border-[#dee3e8] bg-[#f5faff] px-6 py-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-[#002045]">
            <span className="material-symbols-outlined text-[18px]">favorite</span> Recent
            Supporters
          </h3>
        </div>

        <div className="custom-scrollbar max-h-[350px] space-y-1 overflow-y-auto p-4">
          {recentDonations.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <span className="material-symbols-outlined mb-2 text-3xl text-[#c4c6cf]">
                sentiment_satisfied
              </span>
              <p className="text-sm font-semibold text-[#74777f]">
                Be the first to support this cause!
              </p>
            </div>
          ) : (
            recentDonations.map((donation, index) => {
              const bgColors = [
                'bg-[#d6e3ff] text-[#001b3c]',
                'bg-[#bbf7d0] text-[#166534]',
                'bg-[#e4e9ee] text-[#171c20]',
                'bg-[#ffdad6] text-[#93000a]',
              ];
              const colorClass = bgColors[index % bgColors.length];

              return (
                <div
                  key={donation.id}
                  className="flex items-center space-x-4 rounded-xl p-3 transition-colors hover:bg-[#f5faff]"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm ${colorClass}`}
                  >
                    {donation.firstName ? donation.firstName.substring(0, 2).toUpperCase() : 'AN'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#002045]">
                      {donation.firstName || 'Anonymous Donor'}
                    </p>
                    <p className="text-xs font-bold text-[#006d3c]">
                      {donation.amount.toLocaleString()} MAD
                    </p>
                  </div>
                  <p className="shrink-0 text-[10px] font-bold text-[#74777f] uppercase">
                    {new Date(donation.donationDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              );
            })
          )}

          {/* Pagination: Load More Button */}
          {hasMore && (
            <div className="px-2 pt-2 pb-1">
              <button
                onClick={onLoadMore}
                disabled={isLoadingMore}
                className="flex w-full items-center justify-center gap-1 rounded-lg border border-[#c4c6cf] py-2.5 text-xs font-bold text-[#43474e] transition-colors hover:bg-[#eff4f9] hover:text-[#002045] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoadingMore ? 'Loading...' : 'View Older Donations'}
                {!isLoadingMore && (
                  <span className="material-symbols-outlined text-[14px]">expand_more</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationWidget;
