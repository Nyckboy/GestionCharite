import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { Organization } from '../../types';

const OrgList = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await apiClient.get<Organization[]>('/organizations/my-orgs');
      setOrganizations(response.data);
    } catch (error) {
      console.error('Failed to fetch organizations', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (orgId: number) => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this organization? All associated campaigns will be removed.',
    );
    if (!isConfirmed) return;

    try {
      await apiClient.delete(`/organizations/${orgId}`);
      setOrganizations((prev) => prev.filter((org) => org.id !== orgId));
    } catch (err: any) {
      alert(err.response?.data || 'Failed to delete organization.');
    }
  };

  return (
    <div className="space-y-8 font-['Inter',sans-serif]">
      {/* Page Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#002045]">Your Organizations</h2>
          <p className="mt-1 text-sm font-medium text-[#74777f]">
            Manage your registered non-profits and launch campaigns.
          </p>
        </div>
        <Link
          to="/organization/new"
          className="flex items-center gap-2 rounded-xl bg-[#002045] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#1a365d] active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">add_business</span>
          Register Organization
        </Link>
      </div>

      {isLoading ? (
        <div className="animate-pulse py-24 text-center font-bold text-[#43474e]">
          Retrieving organization records...
        </div>
      ) : organizations.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-[#dee3e8] bg-white p-16 text-center shadow-sm">
          <span className="material-symbols-outlined mb-4 text-5xl text-[#c4c6cf]">
            domain_disabled
          </span>
          <p className="mb-1 text-lg font-bold text-[#171c20]">No organizations registered.</p>
          <p className="text-sm text-[#74777f]">
            Create your first organization to start launching impact campaigns.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="flex flex-col rounded-2xl border border-[#dee3e8] bg-white p-6 shadow-[0px_4px_6px_rgba(26,54,93,0.04)] transition-shadow hover:shadow-md"
            >
              <div className="flex-1">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <h3 className="line-clamp-2 text-xl leading-tight font-bold text-[#002045]">
                    {org.name}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${
                      org.isValidated
                        ? 'border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]'
                        : 'border-[#fde68a] bg-[#fffbeb] text-[#b45309]'
                    }`}
                  >
                    {org.isValidated ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-[#43474e]">
                  {org.description}
                </p>

                <div className="mb-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#74777f]">
                    <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                    <span>
                      Tax ID: <span className="text-[#171c20]">{org.taxIdentificationNumber}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-auto border-t border-[#dee3e8] pt-5">
                {org.isValidated ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      to={`/organization/${org.id}/campaigns`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#eff4f9] px-4 py-3 text-sm font-bold text-[#002045] transition-colors hover:bg-[#d6e3ff]"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        format_list_bulleted
                      </span>
                      Manage Campaigns
                    </Link>
                    <Link
                      to={`/organization/${org.id}/campaign/new`}
                      state={{ fromOrgList: true }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#48bb78] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#38a169]"
                    >
                      <span className="material-symbols-outlined text-[18px]">add_circle</span>
                      Create Campaign
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#dee3e8] bg-[#f5faff] p-3 text-sm font-semibold text-[#74777f]">
                    <span className="material-symbols-outlined text-[18px]">hourglass_empty</span>
                    Awaiting Verification
                  </div>
                )}

                {/* Management Actions */}
                <div className="mt-4 flex gap-3">
                  <Link
                    to={`/organization/${org.id}/edit`}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#c4c6cf] bg-white px-3 py-2 text-xs font-bold text-[#43474e] transition-colors hover:bg-[#f5faff]"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(org.id)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#ffdad6]/30 px-3 py-2 text-xs font-bold text-[#ba1a1a] transition-colors hover:bg-[#ffdad6]/70"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrgList;
