import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { CharityAction, Category } from '../../types';
import { supabase } from '../../api/supabase'; // Import Supabase client
import { getErrorMessage } from '../../utils/errorHandler';

const CampaignEdit = () => {
  const navigate = useNavigate();
  const { id: orgId, actionId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Added mediaUrl to the state
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    actionDate: '',
    location: '',
    targetAmount: '',
    category: 'EDUCATION' as Category,
    mediaUrl: '',
  });

  // State to hold a newly selected image file
  const [imageFile, setImageFile] = useState<File | null>(null);

  const location = useLocation();
  const cameFromDashboard = location.state?.fromDashboard;

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
          targetAmount: data.targetAmount.toString(),
          category: data.category,
          mediaUrl: data.mediaUrl || '', // Grab existing image URL
        });
      } catch (err) {
        setError('Failed to load campaign details.' + getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    if (actionId) fetchCampaign();
  }, [actionId]);

  // Handle file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // 2. Handle the PUT request to update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // Default to the existing media URL
    let updatedMediaUrl = campaignForm.mediaUrl;

    try {
      // If a new image was selected, upload it to Supabase first
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `actions/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('campaign-images')
          .upload(filePath, imageFile);

        if (uploadError) throw new Error('Failed to upload image to Supabase');

        const { data: publicUrlData } = supabase.storage
          .from('campaign-images')
          .getPublicUrl(filePath);

        updatedMediaUrl = publicUrlData.publicUrl;
      }

      // Send the update to your Spring Boot backend
      await apiClient.put(`/actions/${actionId}`, {
        ...campaignForm,
        targetAmount: parseFloat(campaignForm.targetAmount),
        organizationId: Number(orgId),
        mediaUrl: updatedMediaUrl, // Send the new or existing string URL
      });

      // Route back using the dynamic URL
      const backUrl = cameFromDashboard ? '/organization' : `/organization/${orgId}/campaigns`;
      navigate(backUrl);
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to update campaign.');
      setIsSaving(false);
    }
  };

  if (isLoading)
    return <div className="animate-pulse p-8 text-center">Loading campaign data...</div>;

  const backUrl = cameFromDashboard ? '/organization' : `/organization/${orgId}/campaigns`;
  const backLabel = cameFromDashboard ? 'Back to Dashboard' : 'Back to Campaigns';

  return (
    <div className="fade-in rounded-lg bg-white p-8 shadow-md">
      <Link to={backUrl} className="mb-6 inline-block text-sm text-blue-600 hover:underline">
        &larr; {backLabel}
      </Link>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Edit Campaign</h2>

      {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload Field */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-700">
            Update Campaign Image
          </label>
          {campaignForm.mediaUrl && !imageFile && (
            <div className="mb-2">
              <p className="mb-1 text-xs text-gray-500">Current Image:</p>
              <img
                src={campaignForm.mediaUrl}
                alt="Current campaign"
                className="h-20 w-32 rounded object-cover"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">Leave blank to keep the current image.</p>
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
          disabled={isSaving}
          className="w-full rounded bg-blue-600 p-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSaving ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default CampaignEdit;
