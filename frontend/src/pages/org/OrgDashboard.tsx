import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { OrgAdminStats, CharityAction } from '../../types';

const OrgDashboard = () => {
  const [stats, setStats] = useState<OrgAdminStats | null>(null);
  const [campaigns, setCampaigns] = useState<CharityAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, campaignsRes] = await Promise.all([
          apiClient.get<OrgAdminStats>('/organizations/me/stats'),
          apiClient.get<CharityAction[]>('/actions/me/all')
        ]);
        setStats(statsRes.data);
        setCampaigns(campaignsRes.data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading dashboard...</div>;
  }

  const displayStats = stats || { totalOrganizations: 0, totalCampaigns: 0, totalRaised: 0 };

  return (
    <div className="fade-in">
      <h2 className="mb-6 text-3xl font-bold text-gray-800">Overview</h2>

      {/* High-Level Stats Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-3">
        <div className="p-6 bg-white border-l-4 border-green-500 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase">Total Raised</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{displayStats.totalRaised} MAD</p>
        </div>
        <div className="p-6 bg-white border-l-4 border-blue-500 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase">My Campaigns</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{displayStats.totalCampaigns}</p>
        </div>
        <div className="p-6 bg-white border-l-4 border-purple-500 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase">Registered Charities</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{displayStats.totalOrganizations}</p>
        </div>
      </div>

      {/* Master Campaign List */}
      <div className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Recent Campaigns</h3>
          <Link to="/organization/list" className="text-sm font-semibold text-blue-600 hover:underline">
            Manage Organizations &rarr;
          </Link>
        </div>
        
        {campaigns.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            You haven't launched any campaigns yet. Go to your organizations to create one!
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-700">Campaign Title</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Category</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Progress</th>
                <th className="p-4 text-sm font-semibold text-center text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => {
                const progress = Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100).toFixed(0);
                return (
                  <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800 max-w-50 truncate">{campaign.title}</td>
                    <td className="p-4 text-sm text-gray-600">
                      <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded">
                        {campaign.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-gray-600">{progress}%</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">{campaign.currentAmount} / {campaign.targetAmount} MAD</div>
                    </td>
                    <td className="p-4 text-center">
                      <Link 
                        to={`/organization/${campaign.organizationId}/campaign/${campaign.id}/edit`}
                        state={{ fromDashboard: true }}
                        className="px-3 py-1 text-xs font-semibold text-gray-700 transition-colors bg-gray-100 rounded hover:bg-gray-200"
                      >
                        Edit Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrgDashboard;