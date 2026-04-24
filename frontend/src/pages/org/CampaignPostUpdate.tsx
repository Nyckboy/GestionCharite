import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';

const CampaignPostUpdate = () => {
  const navigate = useNavigate();
  // We need both the org ID (for the back button) and the action ID (for the API)
  const { id: orgId, actionId } = useParams(); 
  
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post(`/actions/${actionId}/updates`, { message });
      
      // Navigate back to the campaign list for this organization
      navigate(`/organization/${orgId}/campaigns`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to post update.');
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md fade-in">
      <Link to={`/organization/${orgId}/campaigns`} className="inline-block mb-6 text-sm text-blue-600 hover:underline">
        &larr; Back to Campaigns
      </Link>
      
      <h2 className="mb-2 text-2xl font-bold text-gray-800">Post a Campaign Update</h2>
      <p className="mb-6 text-gray-600">Keep your donors informed about your progress, milestones, and impact.</p>
      
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Update Message</label>
          <textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            required 
            rows={5} 
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., We have officially purchased the supplies! Thank you to all our donors..."
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading || !message.trim()} 
          className="w-full p-3 font-semibold text-white transition-colors bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? 'Publishing...' : 'Publish Update'}
        </button>
      </form>
    </div>
  );
};

export default CampaignPostUpdate;