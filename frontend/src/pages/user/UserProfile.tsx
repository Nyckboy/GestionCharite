import React, { useEffect, useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/axios';
import type { PlatformUser } from '../../types';
import { getErrorMessage } from '../../utils/errorHandler';

const UserProfile = () => {
  // const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<PlatformUser | null>(null);

  // Editable form state
  const [formData, setFormData] = useState({ firstName: '', lastName: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get<PlatformUser>('/users/me');
        setProfile(response.data);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
        });
      } catch (error) {
        setStatusMessage({ type: 'error', text: 'Failed to load profile data.' + error });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      await apiClient.put('/users/me', formData);
      setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Update local profile view
      if (profile) setProfile({ ...profile, ...formData });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: getErrorMessage(err) || 'Failed to update profile.',
      });
    } finally {
      setIsSaving(false);
      // Auto-hide success message after 3 seconds
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  if (isLoading)
    return (
      <div className="animate-pulse p-12 text-center font-bold text-[#43474e]">
        Loading secure profile...
      </div>
    );
  if (!profile)
    return (
      <div className="p-12 text-center font-bold text-[#ba1a1a]">Failed to load profile data.</div>
    );

  return (
    <form onSubmit={handleSave} className="space-y-8 font-['Inter',sans-serif]">
      {/* Top Banner: Profile Header Section */}
      <section className="flex flex-col items-center gap-8 rounded-2xl border border-[#dee3e8] bg-white bg-gradient-to-br from-white to-[#eff4f9] p-8 shadow-[0px_4px_6px_rgba(26,54,93,0.04)] md:flex-row">
        <div className="relative">
          <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-[#002045] text-5xl font-bold text-white shadow-md">
            {profile.firstName.charAt(0)}
            {profile.lastName.charAt(0)}
          </div>
          <button
            type="button"
            className="absolute right-1 bottom-1 cursor-not-allowed rounded-full bg-[#002045] p-2 text-white opacity-50 shadow-lg grayscale transition-colors hover:bg-[#1a365d]"
          >
            <span className="material-symbols-outlined text-[20px]">photo_camera</span>
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-[#002045]">
            {profile.firstName} {profile.lastName}
          </h2>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <span className="flex items-center gap-1 rounded-full bg-[#85f6ad] px-3 py-1 text-xs font-bold tracking-wider text-[#00723f] uppercase">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Verified {profile.role}
            </span>
            <span className="rounded-full bg-[#d6e3ff] px-3 py-1 text-xs font-bold tracking-wider text-[#001b3c] uppercase">
              Account #{profile.id}
            </span>
          </div>
        </div>

        {/* Impact Stats Placeholder */}
        <div className="flex min-w-[240px] flex-col items-center justify-center rounded-2xl border border-[#d6e3ff] bg-[#f5faff] p-6 opacity-60">
          <div className="mb-4 text-center">
            <p className="text-xs font-bold tracking-widest text-[#74777f] uppercase">
              Lifetime Impact
            </p>
            <p className="mt-1 text-3xl font-bold text-[#002045]">Pending...</p>
          </div>
        </div>
      </section>

      {/* Grid Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Editable Details & Preferences */}
        <div className="space-y-8 lg:col-span-7">
          <section className="rounded-2xl border border-[#dee3e8] bg-white p-8 shadow-[0px_4px_6px_rgba(26,54,93,0.04)]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#171c20]">Personal Details</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#74777f]">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full rounded-lg border-none bg-[#eff4f9] px-4 py-3 font-medium text-[#171c20] transition-all outline-none focus:bg-white focus:ring-2 focus:ring-[#002045]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#74777f]">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full rounded-lg border-none bg-[#eff4f9] px-4 py-3 font-medium text-[#171c20] transition-all outline-none focus:bg-white focus:ring-2 focus:ring-[#002045]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#74777f]">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full cursor-not-allowed rounded-lg border-none bg-[#e4e9ee] px-4 py-3 font-medium text-[#43474e] opacity-70"
                />
              </div>
              <div className="pointer-events-none space-y-1 opacity-50 grayscale select-none">
                <label className="text-sm font-semibold text-[#74777f]">Phone Number</label>
                <input
                  disabled
                  type="tel"
                  placeholder="+212 (0) 6..."
                  className="w-full rounded-lg border-none bg-[#eff4f9] px-4 py-3"
                />
              </div>
            </div>
          </section>

          {/* Greyed Out Feature: Notification Preferences */}
          <section className="pointer-events-none rounded-2xl border border-[#dee3e8] bg-white p-8 opacity-40 shadow-sm grayscale select-none">
            <h3 className="mb-6 text-xl font-bold text-[#171c20]">Notification Preferences</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-[#eff4f9] p-4">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#002045]">mail</span>
                  <div>
                    <p className="font-bold text-[#171c20]">Email Updates</p>
                    <p className="text-sm text-[#43474e]">Receive monthly impact reports.</p>
                  </div>
                </div>
                <div className="relative h-6 w-11 rounded-full bg-[#002045]">
                  <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-white"></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Security & Assets */}
        <div className="pointer-events-none space-y-8 opacity-40 grayscale select-none lg:col-span-5">
          <section className="rounded-2xl border border-[#dee3e8] bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-xl font-bold text-[#171c20]">Security Settings</h3>
            <div className="space-y-3">
              <div className="flex w-full items-center justify-between rounded-xl border border-[#dee3e8] bg-[#f5faff] p-4">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#74777f]">lock</span>
                  <span className="font-bold text-[#171c20]">Change Password</span>
                </div>
                <span className="material-symbols-outlined text-[#74777f]">chevron_right</span>
              </div>
              <div className="flex w-full items-center justify-between rounded-xl border border-[#dee3e8] bg-[#f5faff] p-4">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#74777f]">security</span>
                  <div>
                    <p className="font-bold text-[#171c20]">Two-Factor Auth</p>
                    <p className="text-xs font-bold text-[#006d3c]">Enabled</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-2xl bg-[#002045] p-8 text-white">
            <div className="relative z-10">
              <h3 className="mb-2 text-xl font-bold">Tax Documents</h3>
              <p className="mb-6 text-sm text-[#86a0cd]">
                Download your consolidated tax-deductible receipt.
              </p>
              <button
                type="button"
                disabled
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 font-bold text-[#002045]"
              >
                <span className="material-symbols-outlined">download</span> Download PDF
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky Footer Action Bar */}
      <div className="sticky bottom-0 z-10 mt-8 flex flex-col items-center justify-between gap-6 border-t border-[#dee3e8] bg-[#f5faff]/90 pt-6 pb-6 backdrop-blur-sm sm:flex-row">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#74777f]">
          {statusMessage ? (
            <span
              className={statusMessage.type === 'success' ? 'text-[#006d3c]' : 'text-[#ba1a1a]'}
            >
              {statusMessage.text}
            </span>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">info</span> Unsaved changes
              will be lost.
            </>
          )}
        </div>
        <div className="flex w-full gap-4 sm:w-auto">
          <button
            type="button"
            onClick={() =>
              setFormData({ firstName: profile.firstName, lastName: profile.lastName })
            }
            className="flex-1 rounded-xl border border-[#c4c6cf] px-6 py-3 font-bold text-[#43474e] transition-all hover:bg-white sm:flex-none"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={
              isSaving ||
              (formData.firstName === profile.firstName && formData.lastName === profile.lastName)
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#002045] px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-[#1a365d] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            <span className="material-symbols-outlined">save</span>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserProfile;
