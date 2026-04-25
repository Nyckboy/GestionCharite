import { useState, useEffect } from 'react';
import { apiClient } from '../../api/axios';
import type { PlatformUser } from '../../types';

const AdminUsers = () => {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get<PlatformUser[]>('/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="fade-in">
      <h2 className="mb-2 text-2xl font-bold text-gray-800">User Management</h2>
      <p className="mb-6 text-gray-600">View and manage all registered accounts on the platform.</p>

      <div className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No users found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-700">ID</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="p-4 text-sm font-semibold text-gray-700">Role</th>
                <th className="p-4 text-sm font-semibold text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-500">#{user.id}</td>
                  <td className="p-4 font-medium text-gray-800">{user.firstName} {user.lastName}</td>
                  <td className="p-4 text-sm text-gray-600">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'ORG_ADMIN' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button disabled className="px-3 py-1 text-xs font-semibold text-gray-400 bg-gray-100 rounded cursor-not-allowed">
                      Edit Role (Soon)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;