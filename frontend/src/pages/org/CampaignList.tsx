import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { CharityAction } from '../../types';

const CampaignList = () => {
  const { id } = useParams();
  const [campaigns, setCampaigns] = useState<CharityAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      try {
        // Assuming your Spring Boot backend has or will have this endpoint
        const response = await apiClient.get<CharityAction[]>(`/actions/organization/${id}`);
        setCampaigns(response.data);
      } catch (err: any) {
        console.error("Failed to fetch campaigns", err);
        setError("Could not load campaigns. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchCampaigns();
    }
  }, [id]);


  return (
    <div className="fade-in">
      <Link to="/organization" className="inline-block mb-6 text-sm text-blue-600 hover:underline">
        &larr; Back to Organizations
      </Link>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Campaigns</h2>
          <p className="text-gray-600">View and manage your charity actions.</p>
        </div>
        <Link 
          to={`/organization/${id}/campaign/new`} 
          className="px-4 py-2 font-semibold text-white transition-colors bg-green-600 rounded hover:bg-green-700"
        >
          + New Campaign
        </Link>
      </div>

      {error && <div className="p-4 mb-6 text-red-800 bg-red-100 rounded">{error}</div>}

      {isLoading ? (
        <div className="p-8 text-center text-gray-500 bg-white rounded shadow-sm animate-pulse">
          Loading campaigns...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-white rounded shadow-sm">
          No campaigns created for this organization yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="flex flex-col justify-between p-6 bg-white border rounded-lg shadow-sm">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{campaign.title}</h3>
                  <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
                    {campaign.category}
                  </span>
                </div>
                <p className="mb-4 text-sm text-gray-600 line-clamp-3">{campaign.description}</p>
                
                <div className="space-y-1 text-sm text-gray-500">
                  <p><strong>Target:</strong> {campaign.targetAmount} MAD</p>
                  <p><strong>Date:</strong> {campaign.actionDate}</p>
                  <p><strong>Location:</strong> {campaign.location}</p>
                </div>
              </div>
              
              {/* Future Update / Delete Buttons */}
              <div className="flex gap-2 pt-4 mt-6 border-t border-gray-100">
                 <button disabled className="w-1/2 px-3 py-2 text-sm text-gray-400 bg-gray-100 rounded cursor-not-allowed">
                   Edit (Soon)
                 </button>
                 <button disabled className="w-1/2 px-3 py-2 text-sm text-gray-400 bg-gray-100 rounded cursor-not-allowed">
                   Delete (Soon)
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignList;