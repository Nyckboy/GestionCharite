// src/pages/user/UserDonations.tsx
import { useState, useEffect } from 'react';
import { apiClient } from '../../api/axios';
import type { UserDonation } from '../../types';

const UserDonations = () => {
  const [donations, setDonations] = useState<UserDonation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await apiClient.get<UserDonation[]>('/donations/my-donations');
        setDonations(response.data);
      } catch (error) {
        console.error("Failed to fetch donations", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, []);

  return (
    <div className="max-w-4xl fade-in">
      <h2 className="mb-2 text-2xl font-bold text-gray-800">My Impact</h2>
      <p className="mb-6 text-gray-600">A history of the campaigns you have supported.</p>

      <div className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">Loading donation history...</div>
        ) : donations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="mb-4">You haven't made any donations yet.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Campaign</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Amount</th>
                <th className="p-4 text-sm font-semibold text-center text-gray-700">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(donation.donationDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-medium text-gray-800">
                    {donation.actionTitle || 'Campaign Details Unavailable'}
                  </td>
                  <td className="p-4 font-bold text-green-600">
                    {donation.amount} MAD
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      className="px-3 py-1 text-xs font-semibold text-blue-700 transition-colors bg-blue-50 rounded hover:bg-blue-100"
                      onClick={() => alert(`In a real app, this would download a PDF receipt for Donation #${donation.id}`)}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserDonations;