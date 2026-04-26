import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { PlatformUser } from '../../types';

const AdminUserCreate = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', role: 'USER' as PlatformUser['role']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/admin/users', formData);

      navigate('/admin/users');
    } catch (err: any) {
      setError(err.response?.data || 'Failed to create user.');
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md fade-in max-w-2xl mx-auto">
      <Link to="/admin/users" className="mb-6 text-sm text-blue-600 hover:underline block">&larr; Back to Users</Link>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Create New User</h2>
      
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <input type="text" placeholder="First Name" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-1/2 p-2 border rounded focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Last Name" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-1/2 p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        </div>
        
        <input type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        
        <div className="flex gap-4">
          <input type="password" placeholder="Temporary Password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-1/2 p-2 border rounded focus:ring-2 focus:ring-blue-500" />
          <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value as PlatformUser['role']})} className="w-1/2 p-2 bg-white border rounded focus:ring-2 focus:ring-blue-500">
            <option value="USER">Standard User</option>
            <option value="ORG_ADMIN">Organization Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>

        <button type="submit" disabled={isLoading} className="w-full p-3 mt-4 font-semibold text-white transition-colors bg-blue-600 rounded hover:bg-blue-700">
          {isLoading ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  );
};

export default AdminUserCreate;