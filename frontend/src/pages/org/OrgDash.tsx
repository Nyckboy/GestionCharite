// src/pages/org/OrgDash.tsx
import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import type { Organization } from '../../types';
import { getErrorMessage } from '../../utils/errorHandler';

const OrgDash = () => {
  const { user, logout } = useAuth();

  // --- View State ---
  // This toggles the screen between the list and the form
  const [view, setView] = useState<'list' | 'create'>('list');

  // --- List State ---
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  // --- Form State ---
  const [formData, setFormData] = useState({
    name: '',
    legalAddress: '',
    taxIdentificationNumber: '',
    primaryContact: '',
    description: '',
  });
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch organizations when the 'list' view is active
  useEffect(() => {
    if (view === 'list') {
      fetchOrganizations();
    }
  }, [view]);

  const fetchOrganizations = async () => {
    setIsLoadingList(true);
    try {
      // Assuming your GET /organizations returns a list.
      const response = await apiClient.get<Organization[]>('/organizations/my-orgs');
      console.log(response.data);

      setOrganizations(response.data);
    } catch (error) {
      console.error('Failed to fetch organizations', error);
    } finally {
      setIsLoadingList(false);
    }
  };

  // 2. Form Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      await apiClient.post('/organizations', formData);
      setStatusMessage({
        type: 'success',
        text: 'Organization submitted successfully! Please wait for a Super Admin to approve your account.',
      });
      // Clear form on success
      setFormData({
        name: '',
        legalAddress: '',
        taxIdentificationNumber: '',
        primaryContact: '',
        description: '',
      });

      // Automatically switch back to the list view after 2.5 seconds
      setTimeout(() => {
        setView('list');
        setStatusMessage(null);
      }, 2500);
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: getErrorMessage(error) || 'Failed to submit organization. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between bg-blue-800 p-4 text-white shadow-md">
        <h1 className="text-xl font-bold">Organization Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user?.firstName}</span>
          <button
            onClick={logout}
            className="rounded bg-red-600 px-4 py-2 text-sm transition-colors hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="mx-auto mt-8 max-w-4xl p-8">
        {/* ======================= */}
        {/* LIST VIEW        */}
        {/* ======================= */}
        {view === 'list' && (
          <div className="fade-in">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Your Organizations</h2>
                <p className="text-gray-600">Manage your charities and campaigns.</p>
              </div>
              <button
                onClick={() => setView('create')}
                className="rounded bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                + Register New Organization
              </button>
            </div>

            {isLoadingList ? (
              <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                <p className="animate-pulse text-gray-500">Loading organizations...</p>
              </div>
            ) : organizations.length === 0 ? (
              <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                <p className="mb-4 text-gray-500">You haven't registered any organizations yet.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {organizations.map((org) => (
                  <div
                    key={org.id}
                    className="flex flex-col justify-between rounded-lg border bg-white p-6 shadow-sm"
                  >
                    <div>
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="text-xl font-bold text-gray-800">{org.name}</h3>
                        {/* Dynamic status badge */}
                        <span
                          className={`rounded px-2 py-1 text-xs font-semibold ${org.isValidated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                        >
                          {org.isValidated ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      <p className="mb-4 line-clamp-3 text-sm text-gray-600">{org.description}</p>
                      <p className="text-xs text-gray-500">
                        <strong>Tax ID:</strong> {org.taxIdentificationNumber}
                      </p>
                    </div>

                    {/* Placeholders for future backend endpoints */}
                    <div className="mt-6 flex gap-2 border-t border-gray-100 pt-4">
                      <button
                        disabled
                        className="w-1/2 cursor-not-allowed rounded bg-gray-100 px-3 py-2 text-sm text-gray-400"
                      >
                        Edit (Soon)
                      </button>
                      <button
                        disabled
                        className="w-1/2 cursor-not-allowed rounded bg-gray-100 px-3 py-2 text-sm text-gray-400"
                      >
                        Delete (Soon)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================= */}
        {/* CREATE VIEW       */}
        {/* ======================= */}
        {view === 'create' && (
          <div className="fade-in rounded-lg bg-white p-8 shadow-md">
            <button
              onClick={() => setView('list')}
              className="mb-6 text-sm text-blue-600 hover:underline"
            >
              &larr; Back to List
            </button>

            <h2 className="mb-2 text-2xl font-bold text-gray-800">Register Your Organization</h2>
            <p className="mb-6 text-gray-600">
              Submit your charity details for platform validation.
            </p>

            {statusMessage && (
              <div
                className={`mb-6 rounded p-4 ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {statusMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmitOrg} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Organization Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Legal Address
                </label>
                <input
                  type="text"
                  name="legalAddress"
                  value={formData.legalAddress}
                  onChange={handleChange}
                  required
                  className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Tax ID Number
                  </label>
                  <input
                    type="text"
                    name="taxIdentificationNumber"
                    value={formData.taxIdentificationNumber}
                    onChange={handleChange}
                    required
                    className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-1/2">
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Primary Contact
                  </label>
                  <input
                    type="text"
                    name="primaryContact"
                    value={formData.primaryContact}
                    onChange={handleChange}
                    required
                    className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full rounded border p-2 focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded bg-blue-600 p-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgDash;
