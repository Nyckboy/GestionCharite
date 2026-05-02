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
        const response = await apiClient.get<CharityAction[]>(`/actions/organization/${id}`);
        setCampaigns(response.data);
      } catch (err: any) {
        console.error('Failed to fetch campaigns', err);
        setError('Could not load campaign data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchCampaigns();
  }, [id]);

  const handleDelete = async (actionId: number) => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this campaign? This action cannot be undone.',
    );
    if (!isConfirmed) return;
    try {
      await apiClient.delete(`/actions/${actionId}`);
      setCampaigns((prev) => prev.filter((campaign) => campaign.id !== actionId));
    } catch (err: any) {
      alert(
        err.response?.data?.message || 'Failed to delete campaign. It may have existing donations.',
      );
    }
  };

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      <Link
        to="/organization/list"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#002045] hover:underline"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to
        Organizations
      </Link>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#002045]">Manage Campaigns</h2>
          <p className="mt-1 text-sm font-medium text-[#74777f]">
            View, update, and manage your active charity actions.
          </p>
        </div>
        <Link
          to={`/organization/${id}/campaign/new`}
          className="flex items-center gap-2 rounded-xl bg-[#48bb78] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#38a169] active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          New Campaign
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-[#ffdad6] p-4 text-sm font-bold text-[#ba1a1a]">
          <span className="material-symbols-outlined">error</span> {error}
        </div>
      )}

      {isLoading ? (
        <div className="animate-pulse py-24 text-center font-bold text-[#43474e]">
          Retrieving campaign records...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-[#dee3e8] bg-white p-16 text-center shadow-sm">
          <span className="material-symbols-outlined mb-4 text-5xl text-[#c4c6cf]">campaign</span>
          <p className="mb-1 text-lg font-bold text-[#171c20]">No campaigns found.</p>
          <p className="text-sm text-[#74777f]">
            Create a new campaign to start gathering support.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => {
            const progress = Math.min(
              (campaign.currentAmount / campaign.targetAmount) * 100,
              100,
            ).toFixed(0);

            return (
              <div
                key={campaign.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-[#dee3e8] bg-white shadow-[0px_4px_6px_rgba(26,54,93,0.04)] transition-shadow hover:shadow-md"
              >
                {/* Media Header */}
                <div className="relative h-40 bg-[#eff4f9]">
                  {campaign.mediaUrl ? (
                    <img
                      src={campaign.mediaUrl}
                      alt={campaign.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold tracking-widest text-[#74777f] uppercase">
                      No Media
                    </div>
                  )}
                  <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-wider text-[#006d3c] uppercase shadow-sm backdrop-blur">
                    {campaign.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-2 line-clamp-1 text-lg leading-tight font-bold text-[#002045]">
                    {campaign.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 flex-1 text-sm text-[#74777f]">
                    {campaign.description}
                  </p>

                  {/* Progress & Stats */}
                  <div className="mb-5 space-y-3 rounded-xl border border-[#dee3e8] bg-[#f5faff] p-3">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#43474e]">Raised: {campaign.currentAmount}</span>
                      <span className="text-[#006d3c]">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#dee3e8]">
                      <div
                        className="h-full rounded-full bg-[#48bb78]"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-[#74777f] uppercase">
                      <span>Target: {campaign.targetAmount} MAD</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">
                          calendar_today
                        </span>{' '}
                        {campaign.actionDate}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto flex gap-2 border-t border-[#dee3e8] pt-4">
                    <Link
                      to={`/organization/${id}/campaign/${campaign.id}/update`}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-transparent bg-[#eff4f9] px-2 py-2 text-xs font-bold text-[#002045] transition-colors hover:border-[#dee3e8]"
                    >
                      <span className="material-symbols-outlined text-[14px]">post_add</span> Post
                      Update
                    </Link>
                    <Link
                      to={`/organization/${id}/campaign/${campaign.id}/edit`}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#c4c6cf] bg-white px-2 py-2 text-xs font-bold text-[#43474e] transition-colors hover:bg-[#f5faff]"
                    >
                      <span className="material-symbols-outlined text-[14px]">edit</span> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#ffdad6]/30 px-2 py-2 text-xs font-bold text-[#ba1a1a] transition-colors hover:bg-[#ffdad6]/70"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span> Drop
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CampaignList;
