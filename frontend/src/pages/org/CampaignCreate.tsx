// src/pages/org/CampaignCreate.tsx
import React, { useState } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { Category } from '../../types';

const CampaignCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Grabs the organization ID from the URL
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    actionDate: '',
    location: '',
    targetAmount: '',
    category: 'EDUCATION' as Category,
  });

  const location = useLocation();
  const cameFromOrgList = location.state?.fromOrgList;

  const backUrl = cameFromOrgList ? '/organization/list' : `/organization/${id}/campaigns`;
  const backLabel = cameFromOrgList ? 'Back to Organizations' : 'Back to Campaigns';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/actions', {
        ...campaignForm,
        targetAmount: parseFloat(campaignForm.targetAmount),
        organizationId: Number(id), // Attach the ID from the URL
      });
      navigate(backUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create campaign.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fade-in rounded-lg bg-white p-8 shadow-md">
      <Link to={backUrl} className="mb-6 text-sm text-blue-600 hover:underline">
        &larr; {backLabel}
      </Link>
      <h2 className="mb-2 text-2xl font-bold text-gray-800">Create a New Charity Action</h2>

      {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Campaign Title</label>
          <input
            type="text"
            value={campaignForm.title}
            onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
            required
            className="w-full rounded border p-2 focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="mb-1 block text-sm font-semibold text-gray-700">Category</label>
            <select
              value={campaignForm.category}
              onChange={(e) =>
                setCampaignForm({ ...campaignForm, category: e.target.value as Category })
              }
              className="w-full rounded border bg-white p-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="EDUCATION">Education</option>
              <option value="ENVIRONNEMENT">Environment</option>
              <option value="SANTE">Health</option>
              <option value="URGENCE">Emergency</option>
            </select>
          </div>
          <div className="w-1/2">
            <label className="mb-1 block text-sm font-semibold text-gray-700">Target Amount</label>
            <input
              type="number"
              step="0.01"
              min="1"
              value={campaignForm.targetAmount}
              onChange={(e) => setCampaignForm({ ...campaignForm, targetAmount: e.target.value })}
              required
              className="w-full rounded border p-2 focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="mb-1 block text-sm font-semibold text-gray-700">Action Date</label>
            <input
              type="date"
              value={campaignForm.actionDate}
              onChange={(e) => setCampaignForm({ ...campaignForm, actionDate: e.target.value })}
              required
              className="w-full rounded border p-2 focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="w-1/2">
            <label className="mb-1 block text-sm font-semibold text-gray-700">Location</label>
            <input
              type="text"
              value={campaignForm.location}
              onChange={(e) => setCampaignForm({ ...campaignForm, location: e.target.value })}
              required
              className="w-full rounded border p-2 focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Description</label>
          <textarea
            value={campaignForm.description}
            onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
            required
            rows={4}
            className="w-full rounded border p-2 focus:ring-2 focus:ring-green-500"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-green-600 p-3 font-semibold text-white transition-colors hover:bg-green-700"
        >
          {isLoading ? 'Creating...' : 'Publish Campaign'}
        </button>
      </form>
    </div>
  );
};

export default CampaignCreate;
