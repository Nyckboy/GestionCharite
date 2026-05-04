import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../api/axios';
import type { UserDonation, PageResponse } from '../../types';

const UserDonations = () => {
  const [donations, setDonations] = useState<UserDonation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // 1. Memorized fetch function with strict PageResponse typing
  const fetchDonations = useCallback(async () => {
    setIsLoading(true);
    try {
      // Pass pagination parameters via Axios
      const response = await apiClient.get<PageResponse<UserDonation>>('/donations/my-donations', {
        params: {
          page: currentPage,
          size: pageSize,
        },
      });

      // Extract data from Spring Boot's Page<T> structure
      setDonations(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Failed to fetch donations', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  // 2. Safe execution on mount and page change
  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  return (
    <div className="space-y-8 font-['Inter',sans-serif]">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#002045]">My Impact</h2>
        <p className="mt-1 text-sm font-medium text-[#74777f]">
          A comprehensive history of the campaigns you have supported.
        </p>
      </div>

      {/* Data Table Card */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-[#dee3e8] bg-white shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
        {isLoading ? (
          <div className="animate-pulse p-16 text-center font-bold text-[#43474e]">
            Retrieving secure transaction history...
          </div>
        ) : donations.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-[#f5faff] p-16 text-center">
            <span className="material-symbols-outlined mb-4 text-5xl text-[#c4c6cf]">
              volunteer_activism
            </span>
            <p className="mb-1 text-lg font-bold text-[#002045]">No contributions yet.</p>
            <p className="text-sm font-medium text-[#74777f]">
              Your future donations will appear here, along with tax receipts.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#dee3e8] bg-[#eff4f9]">
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      Date
                    </th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      Campaign Details
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      Documentation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dee3e8]">
                  {donations.map((donation) => (
                    <tr key={donation.id} className="transition-colors hover:bg-[#f5faff]">
                      <td className="px-6 py-5 text-sm font-bold text-[#74777f]">
                        {new Date(donation.donationDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-[#002045]">
                          {donation.actionTitle || 'Classified Campaign'}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-[#74777f]">
                          <span className="material-symbols-outlined text-[12px]">tag</span>{' '}
                          Transaction #{donation.id}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-right font-bold text-[#006d3c]">
                        {donation.amount.toLocaleString()} MAD
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#c4c6cf] bg-white px-4 py-2 text-xs font-bold text-[#002045] transition-colors hover:bg-[#eff4f9]"
                          onClick={() =>
                            alert(`Generating receipt for Transaction #${donation.id}...`)
                          }
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            receipt_long
                          </span>
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-[#dee3e8] bg-[#f5faff] px-6 py-4">
              <span className="text-xs font-semibold text-[#74777f]">
                Showing page <span className="font-bold text-[#002045]">{currentPage + 1}</span> of{' '}
                <span className="font-bold text-[#002045]">{totalPages}</span> ({totalElements}{' '}
                contributions)
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

export default UserDonations;
