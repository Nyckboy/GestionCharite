import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { PlatformUser } from '../../types';
import { useAuth } from '../../context/AuthContext';

const AdminUserList = () => {
  const { user: currentUser } = useAuth(); // To prevent deleting ourselves!
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleDelete = async (id: number) => {
    if (id === currentUser?.id) {
      alert("You cannot delete your own account while logged in.");
      return;
    }

    const isConfirmed = window.confirm("Are you sure you want to delete this user? This action cannot be undone.");
    if (!isConfirmed) return;

    try {
      await apiClient.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err: any) {
      alert(err.response?.data || "Failed to delete user.");
    }
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-gray-600">View and manage all registered accounts on the platform.</p>
        </div>
        <Link 
          to="/admin/users/new" 
          className="px-4 py-2 font-semibold text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
        >
          + Create User
        </Link>
      </div>

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
                    <div className="flex justify-center gap-2">
                      <Link 
                        to={`/admin/users/${user.id}/edit`}
                        className="px-3 py-1 text-xs font-semibold text-gray-700 transition-colors bg-gray-100 rounded hover:bg-gray-200"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1 text-xs font-semibold text-red-700 transition-colors bg-red-50 rounded hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
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

export default AdminUserList;