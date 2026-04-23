import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import type { CharityAction, Donation } from '../../types';

interface DonationWidgetProps {
  campaign: CharityAction;
  recentDonations: Donation[];
  onDonationSuccess: () => void; // Trigger a refresh in the parent component
}

const DonationWidget: React.FC<DonationWidgetProps> = ({ campaign, recentDonations, onDonationSuccess }) => {
  const { isAuthenticated, user } = useAuth();
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const progressPercentage = Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100);

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      await apiClient.post('/donations', {
        amount: parseFloat(amount),
        actionId: campaign.id
      });
      setStatusMessage({ type: 'success', text: 'Thank you for your generous donation!' });
      setAmount('');
      onDonationSuccess(); // Tell the parent to refetch the updated totals and donor list
    } catch (error: any) {
      setStatusMessage({ type: 'error', text: error.response?.data?.message || 'Failed to process donation.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative lg:col-span-1">
      <div className="sticky space-y-6 top-8">
        
        {/* Progress & Checkout Card */}
        <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-xl">
          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold text-gray-900">{campaign.currentAmount} MAD</span>
              <span className="text-sm font-semibold text-gray-500">raised of {campaign.targetAmount} target</span>
            </div>
            <div className="w-full h-3 overflow-hidden bg-gray-100 rounded-full">
              <div className="h-full transition-all duration-1000 ease-out bg-green-500" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <p className="mt-2 text-sm text-gray-500">{recentDonations.length} total donations</p>
          </div>

          {statusMessage && (
            <div className={`p-3 mb-4 text-sm rounded ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {statusMessage.text}
            </div>
          )}

          {!isAuthenticated ? (
            <div className="p-4 text-center rounded-lg bg-blue-50">
              <p className="mb-3 text-sm font-medium text-gray-700">Log in to make a secure donation.</p>
              <Link to="/login" className="block w-full py-2 mb-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700">Log In</Link>
              <Link to="/register" className="block w-full py-2 font-bold text-blue-600 bg-white border border-blue-200 rounded hover:bg-blue-50">Sign Up</Link>
            </div>
          ) : user?.role !== 'USER' ? (
            <div className="p-4 text-sm text-center text-yellow-800 rounded-lg bg-yellow-50">
              Admins cannot make public donations.
            </div>
          ) : (
            <form onSubmit={handleDonationSubmit} className="space-y-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-bold text-gray-500">DH</span>
                <input 
                  type="number" step="0.01" min="1" required value={amount} onChange={(e) => setAmount(e.target.value)}
                  className="w-full py-3 pl-12 pr-4 text-xl font-bold transition-colors border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
              <button type="submit" disabled={isSubmitting || !amount} className="w-full py-4 text-lg font-extrabold text-white transition-colors bg-green-600 rounded-lg shadow-md hover:bg-green-700 disabled:bg-green-300">
                {isSubmitting ? 'Processing...' : 'Donate Now'}
              </button>
            </form>
          )}
        </div>

        {/* Live Donors Feed */}
        <div className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
          <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-800">
            Recent Supporters
          </h3>
          {recentDonations.length === 0 ? (
            <p className="text-sm italic text-gray-500">Be the first to support this cause!</p>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-blue-600 bg-blue-100 rounded-full">
                      {donation.firstName ? donation.firstName.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{donation.firstName || 'Anonymous'}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(donation.donationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {donation.amount} MAD
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationWidget;