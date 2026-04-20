import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';

const OrgCreate = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orgForm, setOrgForm] = useState({
    name: '', legalAddress: '', taxIdentificationNumber: '', primaryContact: '', description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.post('/organizations', orgForm);
      // Redirect back to the list on success
      navigate('/organization');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit organization.');
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-md fade-in">
      <Link to="/organization" className="mb-6 text-sm text-blue-600 hover:underline">&larr; Back to List</Link>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Register Organization</h2>
      
      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Name" value={orgForm.name} onChange={(e) => setOrgForm({...orgForm, name: e.target.value})} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        <input type="text" placeholder="Legal Address" value={orgForm.legalAddress} onChange={(e) => setOrgForm({...orgForm, legalAddress: e.target.value})} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        <div className="flex gap-4">
          <input type="text" placeholder="Tax ID" value={orgForm.taxIdentificationNumber} onChange={(e) => setOrgForm({...orgForm, taxIdentificationNumber: e.target.value})} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Contact" value={orgForm.primaryContact} onChange={(e) => setOrgForm({...orgForm, primaryContact: e.target.value})} required className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        </div>
        <textarea placeholder="Description" value={orgForm.description} onChange={(e) => setOrgForm({...orgForm, description: e.target.value})} required rows={3} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
        <button type="submit" disabled={isLoading} className="w-full p-3 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
          {isLoading ? 'Submitting...' : 'Submit Organization'}
        </button>
      </form>
    </div>
  );
};

export default OrgCreate;