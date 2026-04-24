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
      console.error("Failed to fetch organizations", error);
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Delete Organization Handler
  const handleDelete = async (orgId: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this organization? All associated campaigns will be removed.");
    if (!isConfirmed) return;

    try {
      await apiClient.delete(`/organizations/${orgId}`);
      // Remove it from the UI immediately
      setOrganizations((prev) => prev.filter((org) => org.id !== orgId));
    } catch (err: any) {
      alert(err.response?.data || "Failed to delete organization.");
    }
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Organizations</h2>
        <Link 
          to="/organization/new" 
          className="px-4 py-2 font-semibold text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
        >
          + Register New Organization
        </Link>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-gray-500 bg-white rounded shadow-sm animate-pulse">Loading...</div>
      ) : organizations.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-white rounded shadow-sm">No organizations registered yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {organizations.map((org) => (
            <div key={org.id} className="flex flex-col justify-between p-6 bg-white border rounded-lg shadow-sm">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{org.name}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${org.isValidated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {org.isValidated ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <p className="mb-4 text-sm text-gray-600 line-clamp-3">{org.description}</p>
                <p className="text-xs text-gray-500 mb-2"><strong>Tax ID:</strong> {org.taxIdentificationNumber}</p>
              </div>
              
              <div className="pt-4 mt-6 border-t border-gray-100">
                  {org.isValidated ? (
                    <div className="flex flex-col gap-2">
                      <Link 
                        to={`/organization/${org.id}/campaigns`}
                        className="block w-full px-4 py-2 text-sm font-semibold text-center text-blue-700 transition-colors bg-blue-100 rounded hover:bg-blue-200"
                      >
                        Manage Campaigns
                      </Link>
                      <Link 
                        to={`/organization/${org.id}/campaign/new`}
                        className="block w-full px-4 py-2 text-sm font-semibold text-center text-white transition-colors bg-green-600 rounded hover:bg-green-700"
                      >
                        + Create Campaign
                      </Link>
                    </div>
                  ) : (
                    <p className="text-sm text-center text-gray-500 mb-2">Awaiting Super Admin approval.</p>
                  )}

                  {/* UPDATED: Edit and Delete Buttons for the Organization */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                    <Link 
                      to={`/organization/${org.id}/edit`}
                      className="w-1/2 px-3 py-2 text-sm font-semibold text-center text-gray-700 transition-colors bg-gray-100 rounded hover:bg-gray-200"
                    >
                      Edit Details
                    </Link>
                    <button 
                      onClick={() => handleDelete(org.id)}
                      className="w-1/2 px-3 py-2 text-sm font-semibold text-center text-red-700 transition-colors bg-red-50 rounded hover:bg-red-100"
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