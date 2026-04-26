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

  // NEW: Delete Organization Handler
  const handleDelete = async (orgId: number) => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this organization? All associated campaigns will be removed.',
    );
    if (!isConfirmed) return;

    try {
      await apiClient.delete(`/organizations/${orgId}`);
      // Remove it from the UI immediately
      setOrganizations((prev) => prev.filter((org) => org.id !== orgId));
    } catch (err: any) {
      alert(err.response?.data || 'Failed to delete organization.');
    }
  };

  return (
    <div className="fade-in">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Your Organizations</h2>
        <Link
          to="/organization/new"
          className="rounded bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          + Register New Organization
        </Link>
      </div>

      {isLoading ? (
        <div className="animate-pulse rounded bg-white p-8 text-center text-gray-500 shadow-sm">
          Loading...
        </div>
      ) : organizations.length === 0 ? (
        <div className="rounded bg-white p-8 text-center text-gray-500 shadow-sm">
          No organizations registered yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="flex flex-col justify-between rounded-lg border bg-white p-6 shadow-sm"
            >
              <div>
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="text-xl font-bold text-gray-800">{org.name}</h3>
                  <span
                    className={`rounded px-2 py-1 text-xs font-semibold ${org.isValidated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                  >
                    {org.isValidated ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <p className="mb-4 line-clamp-3 text-sm text-gray-600">{org.description}</p>
                <p className="mb-2 text-xs text-gray-500">
                  <strong>Tax ID:</strong> {org.taxIdentificationNumber}
                </p>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4">
                {org.isValidated ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/organization/${org.id}/campaigns`}
                      className="block w-full rounded bg-blue-100 px-4 py-2 text-center text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-200"
                    >
                      Manage Campaigns
                    </Link>
                    <Link
                      to={`/organization/${org.id}/campaign/new`}
                      state={{ fromOrgList: true }}
                      className="block w-full rounded bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-green-700"
                    >
                      + Create Campaign
                    </Link>
                  </div>
                ) : (
                  <p className="mb-2 text-center text-sm text-gray-500">
                    Awaiting Super Admin approval.
                  </p>
                )}

                {/* UPDATED: Edit and Delete Buttons for the Organization */}
                <div className="mt-4 flex gap-2 border-t border-gray-50 pt-4">
                  <Link
                    to={`/organization/${org.id}/edit`}
                    className="w-1/2 rounded bg-gray-100 px-3 py-2 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    Edit Details
                  </Link>
                  <button
                    onClick={() => handleDelete(org.id)}
                    className="w-1/2 rounded bg-red-50 px-3 py-2 text-center text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                  >
                    Delete Org
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
