// src/pages/org/CampaignEdit.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { CharityAction, Category } from '../../types';

const CampaignEdit = () => {
  const navigate = useNavigate();
  const { id: orgId, actionId } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [campaignForm, setCampaignForm] = useState({
    title: '', description: '', actionDate: '', location: '', targetAmount: '', category: 'EDUCATION' as Category
  });

  // 1. Fetch the existing data to populate the form
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await apiClient.get<CharityAction>(`/actions/${actionId}`);
        const data = response.data;
        // Populate the state with the fetched data
        setCampaignForm({
          title: data.title,
          description: data.description,
          actionDate: data.actionDate,
          location: data.location,
          targetAmount: data.targetAmount.toString(), // Convert to string for the input field
          category: data.category
        });
      } catch (err: any) {
        setError("Failed to load campaign details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (actionId) fetchCampaign();
  }, [actionId]);

  // 2. Handle the PUT request to update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await apiClient.put(`/actions/${actionId}`, {
        ...campaignForm,
        targetAmount: parseFloat(campaignForm.targetAmount),
        organizationId: Number(orgId)
      });
      // Route back to the list
      navigate(`/organization/${orgId}/campaigns`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update campaign.');
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading campaign data...</div>;

  return (
    <div className="p-8 bg-white rounded-lg shadow-md fade-in">
      <Link to={`/organization/${orgId}/campaigns`} className="inline-block mb-6 text-sm text-blue-600 hover:underline">
        &larr; Back to Campaigns
      </Link>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Edit Campaign</h2>
      
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">Campaign Title</label>
          <input type="text" value={campaignForm.title} onChange={(e) => setCampaignForm({...campaignForm, title: e.target.value})} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block mb-1 text-sm font-semibold text-gray-700">Category</label>
            <select value={campaignForm.category} onChange={(e) => setCampaignForm({...campaignForm, category: e.target.value as Category})} className="w-full p-2 bg-white border rounded focus:ring-2 focus:ring-blue-500">
              <option value="EDUCATION">Education</option>
              <option value="ENVIRONNEMENT">Environment</option>
              <option value="SANTE">Health</option>
              <option value="URGENCE">Emergency</option>
            </select>
          </div>
          <div className="w-1/2">
            <label className="block mb-1 text-sm font-semibold text-gray-700">Target Amount</label>
            <input type="number" step="0.01" min="1" value={campaignForm.targetAmount} onChange={(e) => setCampaignForm({...campaignForm, targetAmount: e.target.value})} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block mb-1 text-sm font-semibold text-gray-700">Action Date</label>
            <input type="date" value={campaignForm.actionDate} onChange={(e) => setCampaignForm({...campaignForm, actionDate: e.target.value})} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="w-1/2">
            <label className="block mb-1 text-sm font-semibold text-gray-700">Location</label>
            <input type="text" value={campaignForm.location} onChange={(e) => setCampaignForm({...campaignForm, location: e.target.value})} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">Description</label>
          <textarea value={campaignForm.description} onChange={(e) => setCampaignForm({...campaignForm, description: e.target.value})} required rows={4} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"></textarea>
        </div>
        <button type="submit" disabled={isSaving} className="w-full p-3 font-semibold text-white transition-colors bg-blue-600 rounded hover:bg-blue-700">
          {isSaving ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default CampaignEdit;