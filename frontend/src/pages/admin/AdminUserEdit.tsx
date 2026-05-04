import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { PlatformUser } from '../../types';
import { getErrorMessage } from '../../utils/errorHandler';

const AdminUserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'USER' as PlatformUser['role'],
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get<PlatformUser>(`/admin/users/${id}`);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          role: response.data.role,
        });
      } catch (err) {
        setError(getErrorMessage(err) || 'Failed to load user details.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await apiClient.put(`/admin/users/${id}`, formData);
      navigate('/admin/users');
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to update user.');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse py-24 text-center font-bold text-[#43474e]">
        Retrieving user profile...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 font-['Inter',sans-serif]">
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#002045] hover:underline"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Directory
      </Link>

      <div className="overflow-hidden rounded-2xl border border-[#dee3e8] bg-white shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
        <div className="flex items-center gap-3 border-b border-[#dee3e8] bg-[#f5faff]/50 px-8 py-6">
          <span className="material-symbols-outlined text-2xl text-[#002045]">manage_accounts</span>
          <div>
            <h2 className="text-2xl font-bold text-[#002045]">Edit Account Details</h2>
            <p className="mt-1 text-sm font-medium text-[#74777f]">
              Modify user information and system access levels.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-8">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-[#ffdad6] p-4 text-sm font-bold text-[#ba1a1a]">
              <span className="material-symbols-outlined">error</span> {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
                First Name
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full rounded-lg border-none bg-[#eff4f9] px-4 py-3 text-sm font-medium text-[#171c20] outline-none focus:ring-2 focus:ring-[#002045]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
                Last Name
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full rounded-lg border-none bg-[#eff4f9] px-4 py-3 text-sm font-medium text-[#171c20] outline-none focus:ring-2 focus:ring-[#002045]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border-none bg-[#eff4f9] px-4 py-3 text-sm font-medium text-[#171c20] outline-none focus:ring-2 focus:ring-[#002045]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold tracking-wider text-[#74777f] uppercase">
                System Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as PlatformUser['role'] })
                }
                className="w-full appearance-none rounded-lg border-none bg-[#eff4f9] px-4 py-3 text-sm font-medium text-[#171c20] outline-none focus:ring-2 focus:ring-[#002045]"
              >
                <option value="USER">Standard User</option>
                <option value="ORG_ADMIN">Organization Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
          </div>

          <div className="border-t border-[#dee3e8] pt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#002045] py-4 font-bold text-white transition-all hover:bg-[#1a365d] active:scale-[0.99] disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              {isSaving ? 'Applying Changes...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUserEdit;
