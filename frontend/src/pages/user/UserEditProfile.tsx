import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/axios';

const UserEditProfile = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/users/me');
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
        });
      } catch (error) {
        setStatusMessage({ type: 'error', text: 'Failed to load profile data.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      await apiClient.put('/users/me', formData);
      setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setStatusMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="animate-pulse">Loading form...</div>;

  return (
    <div className="max-w-2xl fade-in">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Edit Profile</h2>

      {statusMessage && (
        <div className={`p-4 mb-6 rounded ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 bg-white border border-gray-100 rounded-lg shadow-sm space-y-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block mb-1 text-sm font-semibold text-gray-700">First Name</label>
            <input 
              type="text" 
              required 
              value={formData.firstName} 
              onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1 text-sm font-semibold text-gray-700">Last Name</label>
            <input 
              type="text" 
              required 
              value={formData.lastName} 
              onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSaving} 
          className="w-full p-3 mt-4 font-semibold text-white transition-colors bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default UserEditProfile;