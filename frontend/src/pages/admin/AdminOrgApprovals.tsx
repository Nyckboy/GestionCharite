import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../api/axios';
import type { Organization, PageResponse } from '../../types';

const AdminOrgApprovals = () => {
  const [pendingOrgs, setPendingOrgs] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // 1. Memorized fetch function with strict PageResponse typing
  const fetchPendingOrganizations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<PageResponse<Organization>>(
        '/admin/organizations/pending',
        {
          params: {
            page: currentPage,
            size: pageSize,
          },
        },
      );

      // Extract data from Spring Boot's Page<T> structure
      setPendingOrgs(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      setActionError(
        'Could not load pending organizations. Ensure you have Super Admin privileges.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  // 2. Safe execution on mount and page change
  useEffect(() => {
    fetchPendingOrganizations();
  }, [fetchPendingOrganizations]);

  const handleApprove = async (id: number) => {
    setActionError(null);
    try {
      await apiClient.patch(`/admin/organizations/${id}/validate`);
      // Refresh the current page to ensure pagination stays accurate and pulls up the next org
      fetchPendingOrganizations();
    } catch (error: any) {
      setActionError(error.response?.data?.message || 'Failed to approve organization.');
    }
  };

  return (
    <div className="space-y-8 font-['Inter',sans-serif]">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#002045]">Pending Approvals</h2>
        <p className="mt-1 text-sm font-medium text-[#74777f]">
          Review and validate new charity organizations to authorize fundraising.
        </p>
      </div>

      {actionError && (
        <div className="flex items-center gap-2 rounded-lg bg-[#ffdad6] p-4 text-sm font-bold text-[#ba1a1a]">
          <span className="material-symbols-outlined">error</span> {actionError}
        </div>
      )}

      <div className="flex flex-col overflow-hidden rounded-2xl border border-[#dee3e8] bg-white shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
        {isLoading ? (
          <div className="animate-pulse p-16 text-center font-bold text-[#43474e]">
            Loading registry queue...
          </div>
        ) : pendingOrgs.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-[#f5faff] p-16 text-center">
            <span className="material-symbols-outlined mb-4 text-5xl text-[#c4c6cf]">task_alt</span>
            <p className="mb-1 text-lg font-bold text-[#002045]">Queue is empty.</p>
            <p className="text-sm font-medium text-[#74777f]">
              No organizations are currently pending approval.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#dee3e8] bg-[#eff4f9]">
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      Organization Details
                    </th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      Tax ID
                    </th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      Primary Contact
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dee3e8]">
                  {pendingOrgs.map((org) => (
                    <tr key={org.id} className="transition-colors hover:bg-[#f5faff]">
                      <td className="px-6 py-5">
                        <p className="text-base font-bold text-[#002045]">{org.name}</p>
                        <p
                          className="mt-1 max-w-sm truncate text-xs font-semibold text-[#74777f]"
                          title={org.description}
                        >
                          {org.description}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-[#171c20]">
                        {org.taxIdentificationNumber}
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#e4e9ee] px-3 py-1 text-xs font-bold text-[#171c20]">
                          <span className="material-symbols-outlined text-[14px]">mail</span>{' '}
                          {org.primaryContact}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => handleApprove(org.id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#48bb78] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#38a169] hover:shadow-md active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[18px]">verified</span>{' '}
                          Validate
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

export default AdminOrgApprovals;
