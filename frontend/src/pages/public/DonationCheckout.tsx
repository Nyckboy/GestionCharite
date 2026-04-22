import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import type { Donation } from '../../types';

const DonationCheckout = () => {
  const { actionId } = useParams();
  const { isAuthenticated, user } = useAuth();
  
  // State for the donation form
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // State for the recent donors list
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [isLoadingDonations, setIsLoadingDonations] = useState(true);

  useEffect(() => {
    const fetchRecentDonations = async () => {
      try {
        const response = await apiClient.get<Donation[]>(`/donations/action/${actionId}`);
        setRecentDonations(response.data);
      } catch (error) {
        console.error("Failed to fetch recent donations", error);
      } finally {
        setIsLoadingDonations(false);
      }
    };

    if (actionId) {
      fetchRecentDonations();
    }
  }, [actionId]);

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      // Assuming your backend expects { amount, actionId }
      await apiClient.post('/donations', {
        amount: parseFloat(amount),
        actionId: Number(actionId)
      });
      
      setStatusMessage({ type: 'success', text: 'Thank you for your generous donation!' });
      setAmount('');
      
      // Optionally, refresh the recent donations list so their name appears!
      const response = await apiClient.get<Donation[]>(`/donations/action/${actionId}`);
      setRecentDonations(response.data);
      
    } catch (error: any) {
      setStatusMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to process donation. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl p-8 mx-auto mt-8 fade-in">
      <Link to="/" className="inline-block mb-6 text-sm text-blue-600 hover:underline">
        &larr; Back to Campaigns
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        
        {/* Left Column: Checkout Form */}
        <div className="p-8 bg-white border border-gray-100 rounded-lg shadow-md">
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Support this Campaign</h2>
          <p className="mb-6 text-gray-600">Your contribution makes a direct impact.</p>

          {statusMessage && (
            <div className={`p-4 mb-6 rounded ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {statusMessage.text}
            </div>
          )}

          {!isAuthenticated ? (
            <div className="p-6 text-center bg-blue-50 rounded-lg border border-blue-100">
              <p className="mb-4 text-gray-700">You must be logged in to make a secure donation.</p>
              <div className="flex justify-center gap-4">
                <Link to="/login" className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Log In</Link>
                <Link to="/register" className="px-6 py-2 text-blue-600 bg-white border border-blue-600 rounded hover:bg-blue-50">Sign Up</Link>
              </div>
            </div>
          ) : user?.role !== 'USER' ? (
             <div className="p-6 text-center bg-yellow-50 rounded-lg border border-yellow-100 text-yellow-800">
               Administrators cannot make public donations. Please log in with a standard User account.
             </div>
          ) : (
            <form onSubmit={handleDonationSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Donation Amount (MAD)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 font-bold">
                    DH
                  </span>
                  <input 
                    type="number" 
                    step="0.01"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full py-3 pl-12 pr-4 text-lg border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="500.00"
                  />
                </div>
              </div>

              <div className="p-4 text-sm text-gray-600 bg-gray-50 rounded">
                🔒 Secure payment processing. By clicking donate, you agree to our terms of service.
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !amount}
                className="w-full py-3 text-lg font-bold text-white transition-colors bg-green-600 rounded-lg shadow hover:bg-green-700 disabled:bg-green-300"
              >
                {isSubmitting ? 'Processing...' : `Donate ${amount ? amount + ' MAD' : ''}`}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Social Proof / Recent Donors */}
        <div className="p-8 bg-white border border-gray-100 rounded-lg shadow-sm">
          <h3 className="mb-6 text-xl font-bold text-gray-800 flex items-center gap-2">
            Recent Supporters
            <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">{recentDonations.length}</span>
          </h3>

          {isLoadingDonations ? (
            <div className="text-gray-500 animate-pulse">Loading recent donations...</div>
          ) : recentDonations.length === 0 ? (
            <div className="text-gray-500 italic">Be the first to donate to this campaign!</div>
          ) : (
            <div className="space-y-4 max-h-100 overflow-y-auto pr-2">
              {recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between pb-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 font-bold text-blue-600 bg-blue-100 rounded-full">
                      {donation.firstName ? donation.firstName.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{donation.firstName || 'Anonymous Donor'}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(donation.donationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="font-bold text-green-600">
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

export default DonationCheckout;