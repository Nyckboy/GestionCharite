import { useState, useEffect } from 'react';
import { apiClient } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import type { Organization } from '../../types';

const SuperAdminDash = () => {
  const { user, logout } = useAuth();
  const [pendingOrgs, setPendingOrgs] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingOrganizations();
  }, []);

  const fetchPendingOrganizations = async () => {
    setIsLoading(true);
    try {
      // Using the exact endpoint from your backend contracts
      const response = await apiClient.get<Organization[]>('/admin/organizations/pending');
      setPendingOrgs(response.data);
    } catch (error) {
      console.error("Failed to fetch pending organizations", error);
      setActionError("Could not load pending organizations. Ensure you have Super Admin privileges.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setActionError(null);
    try {
      // Fires the PATCH request to flip isValidated to true
      await apiClient.patch(`/admin/organizations/${id}/validate`);
      
      // Remove the approved org from the UI immediately without reloading
      setPendingOrgs(prev => prev.filter(org => org.id !== id));
    } catch (error: any) {
      setActionError(error.response?.data?.message || 'Failed to approve organization.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between p-4 text-white bg-gray-900 shadow-md">
        <h1 className="text-xl font-bold">Platform Administration</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Admin: {user?.firstName}</span>
          <button onClick={logout} className="px-4 py-2 text-sm transition-colors bg-red-600 rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl p-8 mx-auto mt-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Pending Approvals</h2>
        <p className="mb-6 text-gray-600">Review and validate new charity organizations to allow them to raise funds.</p>

        {actionError && (
          <div className="p-4 mb-6 text-red-800 bg-red-100 rounded">
            {actionError}
          </div>
        )}

        <div className="overflow-hidden bg-white rounded-lg shadow">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 animate-pulse">
              Loading pending organizations...
            </div>
          ) : pendingOrgs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No organizations are currently pending approval.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="p-4 text-sm font-semibold text-gray-700">Organization Name</th>
                  <th className="p-4 text-sm font-semibold text-gray-700">Tax ID</th>
                  <th className="p-4 text-sm font-semibold text-gray-700">Primary Contact</th>
                  <th className="p-4 text-sm font-semibold text-gray-700">Description</th>
                  <th className="p-4 text-sm font-semibold text-center text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrgs.map((org) => (
                  <tr key={org.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{org.name}</td>
                    <td className="p-4 text-sm text-gray-600">{org.taxIdentificationNumber}</td>
                    <td className="p-4 text-sm text-gray-600">{org.primaryContact}</td>
                    <td className="p-4 text-sm text-gray-500 max-w-xs truncate" title={org.description}>
                      {org.description}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleApprove(org.id)}
                        className="px-4 py-2 text-sm font-semibold text-white transition-colors bg-green-600 rounded shadow-sm hover:bg-green-700"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDash;