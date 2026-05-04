import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import { getErrorMessage } from '../../utils/errorHandler';

const CampaignPostUpdate = () => {
  const navigate = useNavigate();
  const { id: orgId, actionId } = useParams();

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post(`/actions/${actionId}/updates`, { message });
      navigate(`/organization/${orgId}/campaigns`);
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to post update.');
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-2xl space-y-6 font-['Inter',sans-serif]">
      <Link
        to={`/organization/${orgId}/campaigns`}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#002045] hover:underline"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Campaigns
      </Link>

      <div className="overflow-hidden rounded-2xl border border-[#dee3e8] bg-white shadow-sm">
        <div className="flex items-center gap-4 border-b border-[#dee3e8] bg-[#f5faff]/50 px-8 py-6">
          <div className="rounded-xl bg-[#e4e9ee] p-3">
            <span className="material-symbols-outlined text-[#002045]">campaign</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#002045]">Post an Update</h2>
            <p className="mt-1 text-sm font-medium text-[#74777f]">
              Keep donors informed about milestones and impact.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8">
          {error && (
            <div className="rounded-lg bg-[#ffdad6] p-4 text-sm font-bold text-[#ba1a1a]">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
              Update Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              className="w-full resize-none rounded-xl border-none bg-[#eff4f9] px-5 py-4 text-sm font-medium text-[#171c20] outline-none focus:ring-2 focus:ring-[#002045]"
              placeholder="e.g., We have officially purchased the supplies! Thank you to all our donors..."
            ></textarea>
            <p className="text-right text-xs font-semibold text-[#74777f]">
              This will be visible on the public campaign page.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#002045] py-4 font-bold text-white transition-all hover:bg-[#1a365d] active:scale-[0.99] disabled:opacity-50"
          >
            <span className="material-symbols-outlined">send</span>
            {isLoading ? 'Publishing...' : 'Publish Update'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CampaignPostUpdate;
