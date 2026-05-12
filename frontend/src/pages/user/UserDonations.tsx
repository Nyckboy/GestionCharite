import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../api/axios';
import type { UserDonation, PageResponse } from '../../types';

const UserDonations = () => {
  const { t } = useTranslation();
  const [donations, setDonations] = useState<UserDonation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const fetchDonations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<PageResponse<UserDonation>>('/donations/my-donations', {
        params: {
          page: currentPage,
          size: pageSize,
        },
      });

      setDonations(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error('Failed to fetch donations', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  return (
    <div className="space-y-8 font-['Inter',sans-serif]">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#002045]">
          {t('userDonations.title')}
        </h2>
        <p className="mt-1 text-sm font-medium text-[#74777f]">{t('userDonations.subtitle')}</p>
      </div>

      <div className="flex flex-col overflow-hidden rounded-2xl border border-[#dee3e8] bg-white shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
        {isLoading ? (
          <div className="animate-pulse p-16 text-center font-bold text-[#43474e]">
            {t('userDonations.loading')}
          </div>
        ) : donations.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-[#f5faff] p-16 text-center">
            <span className="material-symbols-outlined mb-4 text-5xl text-[#c4c6cf]">
              volunteer_activism
            </span>
            <p className="mb-1 text-lg font-bold text-[#002045]">{t('userDonations.emptyTitle')}</p>
            <p className="text-sm font-medium text-[#74777f]">{t('userDonations.emptySubtitle')}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#dee3e8] bg-[#eff4f9]">
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      {t('userDonations.colDate')}
                    </th>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      {t('userDonations.colCampaign')}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      {t('userDonations.colAmount')}
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold tracking-wider text-[#43474e] uppercase">
                      {t('userDonations.colDocumentation')}
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
                          {donation.actionTitle || t('userDonations.classifiedCampaign')}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-[#74777f]">
                          <span className="material-symbols-outlined text-[12px]">tag</span>{' '}
                          {t('userDonations.transactionHash')}
                          {donation.id}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-right font-bold text-[#006d3c]">
                        {donation.amount.toLocaleString()} MAD
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#c4c6cf] bg-white px-4 py-2 text-xs font-bold text-[#002045] transition-colors hover:bg-[#eff4f9]"
                          onClick={() =>
                            alert(`${t('userDonations.alertReceipt')}${donation.id}...`)
                          }
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            receipt_long
                          </span>
                          {t('userDonations.btnReceipt')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-[#dee3e8] bg-[#f5faff] px-6 py-4">
              <span className="text-xs font-semibold text-[#74777f]">
                {t('pagination.showingPage')}{' '}
                <span className="font-bold text-[#002045]">{currentPage + 1}</span>{' '}
                {t('pagination.of')} <span className="font-bold text-[#002045]">{totalPages}</span>{' '}
                ({totalElements} {t('userDonations.contributions')})
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="flex items-center gap-1 rounded-lg border border-[#c4c6cf] bg-white px-3 py-1.5 text-xs font-bold text-[#43474e] transition-colors hover:bg-[#eff4f9] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[14px]">chevron_left</span>{' '}
                  {t('pagination.prev')}
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1 || totalPages === 0}
                  className="flex items-center gap-1 rounded-lg border border-[#c4c6cf] bg-white px-3 py-1.5 text-xs font-bold text-[#43474e] transition-colors hover:bg-[#eff4f9] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t('pagination.next')}{' '}
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
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
