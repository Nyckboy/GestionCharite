import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { CharityAction } from '../../types';

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState<CharityAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllCampaigns = async () => {
      try {
        // Adjust this endpoint if your backend uses a slightly different path!
        const response = await apiClient.get<CharityAction[]>('/admin/actions/all');
        setCampaigns(response.data);
      } catch (error) {
        console.error("Failed to fetch global campaigns", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCampaigns();
  }, []);

  return (
    <div className="fade-in">
      <h2 className="mb-2 text-2xl font-bold text-gray-800">Global Campaign Directory</h2>
      <p className="mb-6 text-gray-600">A master list of all charity actions across the platform.</p>

      <div className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">Loading campaigns...</div>
        ) : campaigns.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No campaigns have been created yet.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-700">ID</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Title</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Category</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Progress</th>
                <th className="p-4 text-sm font-semibold text-center text-gray-700">View</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-500">#{campaign.id}</td>
                  <td className="p-4 font-medium text-gray-800 max-w-xs truncate">{campaign.title}</td>
                  <td className="p-4 text-sm text-gray-600">{campaign.category}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {campaign.currentAmount} / {campaign.targetAmount} MAD
                  </td>
                  <td className="p-4 text-center">
                    <Link 
                      to={`/donate/${campaign.id}`}
                      target="_blank" // Opens the public page in a new tab
                      className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded hover:bg-blue-100"
                    >
                      View Live
                    </Link>
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

export default AdminCampaigns;