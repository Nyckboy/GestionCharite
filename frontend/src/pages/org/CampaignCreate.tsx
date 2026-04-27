import React, { useState } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { Category } from '../../types';
import { supabase } from '../../api/supabase'; // Import Supabase

const CampaignCreate = () => {
  const navigate = useNavigate();
  const { id: orgId } = useParams();
  const location = useLocation();
  const cameFromOrgList = location.state?.fromOrgList;

  const backUrl = cameFromOrgList ? '/organization/list' : `/organization/${orgId}/campaigns`;
  const backLabel = cameFromOrgList ? 'Back to Organizations' : 'Back to Campaigns';

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // NEW: State for the image file
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    actionDate: '',
    location: '',
    targetAmount: '',
    category: 'EDUCATION' as Category,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    let mediaUrl = '';

    try {
      // 1. Upload Image to Supabase (if one was selected)
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `actions/${fileName}`;

        // Upload to the 'campaign-images' bucket
        const { error: uploadError } = await supabase.storage
          .from('campaign-images')
          .upload(filePath, imageFile);

        if (uploadError) throw new Error('Failed to upload image to Supabase');

        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('campaign-images')
          .getPublicUrl(filePath);

        mediaUrl = publicUrlData.publicUrl;
      }

      // 2. Send data to Spring Boot Backend
      await apiClient.post('/actions', {
        ...campaignForm,
        targetAmount: parseFloat(campaignForm.targetAmount),
        organizationId: Number(orgId),
        mediaUrl: mediaUrl, // Pass the string URL!
      });

      navigate(backUrl);
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Failed to create campaign.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fade-in rounded-lg bg-white p-8 shadow-md">
      <Link to={backUrl} className="mb-6 inline-block text-sm text-blue-600 hover:underline">
        &larr; {backLabel}
      </Link>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Create New Campaign</h2>

      {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NEW: Image Upload Input */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Campaign Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Upload a high-quality image to attract more donors.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">Campaign Title</label>
          <input
            type="text"
            value={campaignForm.title}
            onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
            required
            className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500"
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
              className="w-full rounded border bg-white p-2 focus:ring-2 focus:ring-blue-500"
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
              className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500"
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
              className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-1/2">
            <label className="mb-1 block text-sm font-semibold text-gray-700">Location</label>
            <input
              type="text"
              value={campaignForm.location}
              onChange={(e) => setCampaignForm({ ...campaignForm, location: e.target.value })}
              required
              className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500"
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
            className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-blue-600 p-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? 'Creating Campaign...' : 'Create Campaign'}
        </button>
      </form>
    </div>
  );
};

export default CampaignCreate;
