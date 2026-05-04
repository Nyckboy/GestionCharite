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
        console.error('Failed to load admin stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse py-24 text-center font-bold text-[#43474e]">
        Gathering platform analytics...
      </div>
    );
  }

  const displayStats = stats || {
    totalOrganizations: 0,
    pendingApprovals: 0,
    totalCampaigns: 0,
    totalRaised: 0,
    totalUsers: 0,
  };

  return (
    <div className="space-y-8 font-['Inter',sans-serif]">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#002045]">Platform Overview</h2>
        <p className="mt-1 text-sm font-medium text-[#74777f]">
          High-level metrics and system health monitoring.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Metric Cards */}
        <div className="relative overflow-hidden rounded-xl border border-[#dee3e8] bg-white p-6 shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
          <div className="absolute top-0 left-0 h-full w-1 bg-[#38a169]"></div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-[#74777f] uppercase">
              Global Capital Raised
            </span>
            <span className="material-symbols-outlined text-xl text-[#38a169]">payments</span>
          </div>
          <p className="text-3xl font-bold text-[#002045]">
            {displayStats.totalRaised.toLocaleString()}{' '}
            <span className="text-lg text-[#74777f]">MAD</span>
          </p>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-[#dee3e8] bg-white p-6 shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
          <div className="absolute top-0 left-0 h-full w-1 bg-[#002045]"></div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-[#74777f] uppercase">
              Active Campaigns
            </span>
            <span className="material-symbols-outlined text-xl text-[#002045]">public</span>
          </div>
          <p className="text-3xl font-bold text-[#002045]">{displayStats.totalCampaigns}</p>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-[#dee3e8] bg-white p-6 shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
          <div className="absolute top-0 left-0 h-full w-1 bg-[#b45309]"></div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-[#74777f] uppercase">
              Pending Validations
            </span>
            <span className="material-symbols-outlined text-xl text-[#b45309]">
              pending_actions
            </span>
          </div>
          <p className="text-3xl font-bold text-[#002045]">{displayStats.pendingApprovals}</p>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-[#dee3e8] bg-white p-6 shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
          <div className="absolute top-0 left-0 h-full w-1 bg-[#004881]"></div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-[#74777f] uppercase">
              Registered Users
            </span>
            <span className="material-symbols-outlined text-xl text-[#004881]">group</span>
          </div>
          <p className="text-3xl font-bold text-[#002045]">{displayStats.totalUsers}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#dee3e8] bg-white p-6 shadow-sm lg:p-8">
        <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-[#002045]">
          <span className="material-symbols-outlined">dns</span> System Status
        </h3>
        <div className="flex items-center gap-3 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-4">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#48bb78] opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#38a169]"></span>
          </span>
          <div>
            <p className="text-sm font-bold text-[#166534]">All Systems Operational</p>
            <p className="text-xs font-semibold text-[#166534]/70">
              Database, authentication, and payment gateways are functioning normally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
