import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { CharityAction } from '../../types';
import { getErrorMessage } from '../../utils/errorHandler';

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
      } catch (err) {
        console.error('Failed to fetch campaigns', err);
        setError('Could not load campaign data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchCampaigns();
  }, [id]);

  // NEW: Archive / Unarchive Handler
  const handleToggleArchive = async (actionId: number, currentlyArchived: boolean) => {
    const actionEndpoint = currentlyArchived ? 'unarchive' : 'archive';
    const confirmationMessage = currentlyArchived
      ? 'Are you sure you want to unarchive this campaign? It will be visible to the public again.'
      : 'Are you sure you want to archive this campaign? It will be hidden from the public feed but preserved in your records.';

    const isConfirmed = window.confirm(confirmationMessage);
    if (!isConfirmed) return;

    try {
      // Assuming your endpoints are POST or PATCH. Adjust the HTTP method if needed (e.g., apiClient.put or apiClient.post)
      await apiClient.patch(`/actions/${actionId}/${actionEndpoint}`);

      // Update the local state instantly to reflect the new status
      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id === actionId ? { ...campaign, isArchived: !currentlyArchived } : campaign,
        ),
      );
    } catch (err) {
      alert(getErrorMessage(err) || `Failed to ${actionEndpoint} campaign.`);
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

            // Boolean check for archived status
            const isArchived = !!campaign.isArchived;

            return (
              <div
                key={campaign.id}
                className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-[0px_4px_6px_rgba(26,54,93,0.04)] transition-all hover:shadow-md ${
                  isArchived ? 'border-[#e4e9ee] opacity-80' : 'border-[#dee3e8]'
                }`}
              >
                {/* Media Header */}
                <div className="relative h-40 bg-[#eff4f9]">
                  {campaign.mediaUrl ? (
                    <img
                      src={campaign.mediaUrl}
                      alt={campaign.title}
                      className={`h-full w-full object-cover ${isArchived ? 'grayscale' : ''}`}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold tracking-widest text-[#74777f] uppercase">
                      No Media
                    </div>
                  )}

                  {/* Category and Status Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="w-fit rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-wider text-[#006d3c] uppercase shadow-sm backdrop-blur">
                      {campaign.category}
                    </span>
                    {isArchived && (
                      <span className="w-fit rounded-full bg-[#171c20]/90 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm backdrop-blur">
                        Archived
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-2 line-clamp-1 text-lg leading-tight font-bold text-[#002045]">
                    {campaign.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 flex-1 text-sm text-[#74777f]">
                    {campaign.description}
                  </p>

                  {/* Progress & Stats */}
                  <div
                    className={`mb-5 space-y-3 rounded-xl border p-3 ${isArchived ? 'border-transparent bg-[#e4e9ee]/50' : 'border-[#dee3e8] bg-[#f5faff]'}`}
                  >
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-[#43474e]">Raised: {campaign.currentAmount}</span>
                      <span className="text-[#006d3c]">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#dee3e8]">
                      <div
                        className={`h-full rounded-full ${isArchived ? 'bg-[#74777f]' : 'bg-[#48bb78]'}`}
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
                    {/* Disable Post Update if Archived */}
                    <Link
                      to={`/organization/${id}/campaign/${campaign.id}/update`}
                      className={`flex flex-1 items-center justify-center gap-1 rounded-lg border border-transparent px-2 py-2 text-xs font-bold transition-colors ${
                        isArchived
                          ? 'pointer-events-none bg-[#e4e9ee] text-[#c4c6cf]'
                          : 'bg-[#eff4f9] text-[#002045] hover:border-[#dee3e8]'
                      }`}
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

                    {/* The New Toggle Archive Button */}
                    <button
                      onClick={() => handleToggleArchive(campaign.id, isArchived)}
                      className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-bold transition-colors ${
                        isArchived
                          ? 'bg-[#d6e3ff] text-[#001b3c] hover:bg-[#adc7f7]' // Blue for Unarchive
                          : 'bg-[#fffbeb] text-[#b45309] hover:bg-[#fde68a]' // Orange/Warning for Archive
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {isArchived ? 'unarchive' : 'archive'}
                      </span>
                      {isArchived ? 'Unarchive' : 'Archive'}
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
