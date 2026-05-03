import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { CharityAction, PageResponse } from '../../types';

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState<CharityAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // 1. Memorized fetch function with strict PageResponse typing
  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<PageResponse<CharityAction>>('/admin/actions/all', {
        params: {
          page: currentPage,
          size: pageSize,
        },
      });

      // Extract the Page<T> payload utilizing the strong typing
      setCampaigns(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Failed to fetch global campaigns', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  // 2. Safe execution on mount and page change
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return (
    <div className="space-y-8 font-['Inter',sans-serif]">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#002045]">
          Global Campaign Directory
        </h2>
        <p className="mt-1 text-sm font-medium text-[#74777f]">
          Master registry of all active charity actions across the platform.
        </p>
      </div>

      <div className="flex flex-col overflow-hidden rounded-2xl border border-[#dee3e8] bg-white shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
        {isLoading ? (
          <div className="animate-pulse p-16 text-center font-bold text-[#43474e]">
            Querying global database...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-[#f5faff] p-16 text-center">
            <span className="material-symbols-outlined mb-4 text-5xl text-[#c4c6cf]">
              folder_off
            </span>
            <p className="mb-1 text-lg font-bold text-[#002045]">No campaigns active.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#dee3e8] bg-[#eff4f9]">
                    <th className="w-16 px-6 py-4 text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      ID
                    </th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      Campaign Identity
                    </th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      Category
                    </th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      Funding Progress
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      Audit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dee3e8]">
                  {campaigns.map((campaign) => {
                    const progress = Math.min(
                      (campaign.currentAmount / campaign.targetAmount) * 100,
                      100,
                    );

                    return (
                      <tr key={campaign.id} className="transition-colors hover:bg-[#f5faff]">
                        <td className="px-6 py-5 text-xs font-bold text-[#74777f]">
                          #{campaign.id}
                        </td>
                        <td className="px-6 py-5">
                          <p className="max-w-sm truncate text-sm font-bold text-[#002045]">
                            {campaign.title}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="rounded-full bg-[#d6e3ff] px-3 py-1 text-[10px] font-bold tracking-wider text-[#001b3c] uppercase">
                            {campaign.category}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-1.5 max-w-[150px] flex-1 overflow-hidden rounded-full bg-[#dee3e8]">
                              <div
                                className="h-full rounded-full bg-[#48bb78]"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="w-24 text-right text-xs font-bold text-[#002045]">
                              {campaign.currentAmount.toLocaleString()} MAD
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Link
                            to={`/donate/${campaign.id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#c4c6cf] bg-white px-4 py-2 text-xs font-bold text-[#002045] transition-colors hover:bg-[#eff4f9]"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              open_in_new
                            </span>
                            View Live
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-[#dee3e8] bg-[#f5faff] px-6 py-4">
              <span className="text-xs font-semibold text-[#74777f]">
                Showing page <span className="font-bold text-[#002045]">{currentPage + 1}</span> of{' '}
                <span className="font-bold text-[#002045]">{totalPages}</span> ({totalElements}{' '}
                total)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="flex items-center gap-1 rounded-lg border border-[#c4c6cf] bg-white px-3 py-1.5 text-xs font-bold text-[#43474e] transition-colors hover:bg-[#eff4f9] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[14px]">chevron_left</span> Prev
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1 || totalPages === 0}
                  className="flex items-center gap-1 rounded-lg border border-[#c4c6cf] bg-white px-3 py-1.5 text-xs font-bold text-[#43474e] transition-colors hover:bg-[#eff4f9] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCampaigns;
