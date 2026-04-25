import { useState, useEffect } from 'react';
import { apiClient } from '../../api/axios';
import type { AdminStats } from '../../types';

const AdminOverview = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get<AdminStats>('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to load admin stats", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Gathering platform analytics...</div>;
  }

  // Fallback data so the UI looks good while you build the backend endpoint!
  const displayStats = stats || {
    totalOrganizations: 0, pendingApprovals: 0, totalCampaigns: 0, totalRaised: 0, totalUsers: 0
  };

  return (
    <div className="fade-in">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Platform Overview</h2>

      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Stat Cards */}
        <div className="p-6 bg-white border-l-4 border-blue-500 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase">Total Raised</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{displayStats.totalRaised} MAD</p>
        </div>

        <div className="p-6 bg-white border-l-4 border-green-500 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase">Active Campaigns</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{displayStats.totalCampaigns}</p>
        </div>

        <div className="p-6 bg-white border-l-4 border-yellow-500 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase">Pending Orgs</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{displayStats.pendingApprovals}</p>
        </div>

        <div className="p-6 bg-white border-l-4 border-purple-500 rounded-lg shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase">Registered Users</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{displayStats.totalUsers}</p>
        </div>
      </div>

      <div className="p-8 bg-white border border-gray-100 rounded-lg shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-gray-800">System Status</h3>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="flex items-center justify-center w-3 h-3 bg-green-500 rounded-full"></span>
          All backend services operating normally.
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;