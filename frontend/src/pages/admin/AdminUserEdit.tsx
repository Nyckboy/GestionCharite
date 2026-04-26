import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { PlatformUser } from '../../types';

const AdminUserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', role: 'USER' as PlatformUser['role']
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get<PlatformUser>(`/admin/users/${id}`);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          role: response.data.role
        });
      } catch (err: any) {
        setError("Failed to load user details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await apiClient.put(`/admin/users/${id}`, formData);
      navigate('/admin/users');
    } catch (err: any) {
      setError(err.response?.data || 'Failed to update user.');
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading user data...</div>;

  return (
    <div className="p-8 bg-white rounded-lg shadow-md fade-in max-w-2xl mx-auto">
      <Link to="/admin/users" className="mb-6 text-sm text-blue-600 hover:underline block">&larr; Back to Users</Link>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Edit User Details</h2>
      
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block mb-1 text-sm font-semibold text-gray-700">First Name</label>
            <input type="text" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="w-1/2">
            <label className="block mb-1 text-sm font-semibold text-gray-700">Last Name</label>
            <input type="text" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">Email Address</label>
          <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        </div>
        
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">System Role</label>
          <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value as PlatformUser['role']})} className="w-full p-2 bg-white border rounded focus:ring-2 focus:ring-blue-500">
            <option value="USER">Standard User</option>
            <option value="ORG_ADMIN">Organization Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>

        <button type="submit" disabled={isSaving} className="w-full p-3 mt-4 font-semibold text-white transition-colors bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default AdminUserEdit;