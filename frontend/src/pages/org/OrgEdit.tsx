import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { Organization } from '../../types';

const OrgEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Organization ID from the URL
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [orgForm, setOrgForm] = useState({
    name: '', legalAddress: '', taxIdentificationNumber: '', primaryContact: '', description: '',
  });

  // Fetch current data to populate form
  useEffect(() => {
    const fetchOrg = async () => {
      try {
        // Assuming you have a GET /organizations/{id} endpoint
        const response = await apiClient.get<Organization>(`/organizations/${id}`);
        const data = response.data;
        setOrgForm({
          name: data.name,
          legalAddress: data.legalAddress,
          taxIdentificationNumber: data.taxIdentificationNumber,
          primaryContact: data.primaryContact,
          description: data.description,
        });
      } catch (err: any) {
        setError("Failed to load organization details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchOrg();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await apiClient.put(`/organizations/${id}`, orgForm);
      navigate('/organization/list'); // Send back to dashboard on success
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update organization.');
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading organization data...</div>;

  return (
    <div className="p-8 bg-white rounded-lg shadow-md fade-in">
      <Link to="/organization/list" className="mb-6 text-sm text-blue-600 hover:underline">&larr; Back to Dashboard</Link>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Edit Organization Profile</h2>
      
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Name" value={orgForm.name} onChange={(e) => setOrgForm({...orgForm, name: e.target.value})} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        <input type="text" placeholder="Legal Address" value={orgForm.legalAddress} onChange={(e) => setOrgForm({...orgForm, legalAddress: e.target.value})} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        <div className="flex gap-4">
          <input type="text" placeholder="Tax ID" value={orgForm.taxIdentificationNumber} onChange={(e) => setOrgForm({...orgForm, taxIdentificationNumber: e.target.value})} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Contact" value={orgForm.primaryContact} onChange={(e) => setOrgForm({...orgForm, primaryContact: e.target.value})} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        </div>
        <textarea placeholder="Description" value={orgForm.description} onChange={(e) => setOrgForm({...orgForm, description: e.target.value})} required rows={3} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        <button type="submit" disabled={isSaving} className="w-full p-3 font-semibold text-white transition-colors bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300">
          {isSaving ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default OrgEdit;