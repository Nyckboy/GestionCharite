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
        console.error('Failed to fetch campaigns', err);
        setError('Could not load campaigns. Please try again.');
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
      <Link to="/organization" className="mb-6 inline-block text-sm text-blue-600 hover:underline">
        &larr; Back to Organizations
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Campaigns</h2>
          <p className="text-gray-600">View and manage your charity actions.</p>
        </div>
        <Link
          to={`/organization/${id}/campaign/new`}
          className="rounded bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700"
        >
          + New Campaign
        </Link>
      </div>

      {error && <div className="mb-6 rounded bg-red-100 p-4 text-red-800">{error}</div>}

      {isLoading ? (
        <div className="animate-pulse rounded bg-white p-8 text-center text-gray-500 shadow-sm">
          Loading campaigns...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="rounded bg-white p-8 text-center text-gray-500 shadow-sm">
          No campaigns created for this organization yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex flex-col justify-between rounded-lg border bg-white p-6 shadow-sm"
            >
              <div>
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="text-xl font-bold text-gray-800">{campaign.title}</h3>
                  <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                    {campaign.category}
                  </span>
                </div>
                <p className="mb-4 line-clamp-3 text-sm text-gray-600">{campaign.description}</p>

                <div className="space-y-1 text-sm text-gray-500">
                  <p>
                    <strong>Target:</strong> {campaign.targetAmount} MAD
                  </p>
                  <p>
                    <strong>Date:</strong> {campaign.actionDate}
                  </p>
                  <p>
                    <strong>Location:</strong> {campaign.location}
                  </p>
                </div>
              </div>

              {/* Future Update / Delete Buttons */}
              <div className="mt-6 flex gap-2 border-t border-gray-100 pt-4">
                <Link
                  to={`/organization/${id}/campaign/${campaign.id}/update`}
                  className="w-1/2 rounded bg-blue-50 px-3 py-2 text-center text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                >
                  + Post Update
                </Link>
                <button
                  disabled
                  className="w-1/4 cursor-not-allowed rounded bg-gray-100 px-3 py-2 text-sm text-gray-400"
                >
                  Edit (Soon)
                </button>
                <button
                  disabled
                  className="w-1/4 cursor-not-allowed rounded bg-gray-100 px-3 py-2 text-sm text-gray-400"
                >
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
