import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/axios';
import type { PlatformUser } from '../../types';

const UserProfile = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<PlatformUser | null>(null);
  
  // Editable form state
  const [formData, setFormData] = useState({ firstName: '', lastName: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
        setStatusMessage({ type: 'error', text: 'Failed to load profile data.' });
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
    } catch (error: any) {
      setStatusMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
      // Auto-hide success message after 3 seconds
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  if (isLoading) return <div className="p-12 text-center text-[#43474e] animate-pulse font-bold">Loading secure profile...</div>;
  if (!profile) return <div className="p-12 text-center text-[#ba1a1a] font-bold">Failed to load profile data.</div>;

  return (
    <form onSubmit={handleSave} className="space-y-8 font-['Inter',sans-serif]">
      
      {/* Top Banner: Profile Header Section */}
      <section className="bg-white border border-[#dee3e8] shadow-[0px_4px_6px_rgba(26,54,93,0.04)] rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-white to-[#eff4f9]">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-[#002045] flex items-center justify-center text-5xl font-bold text-white">
            {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
          </div>
          <button type="button" className="absolute bottom-1 right-1 bg-[#002045] text-white p-2 rounded-full shadow-lg hover:bg-[#1a365d] transition-colors cursor-not-allowed grayscale opacity-50">
            <span className="material-symbols-outlined text-[20px]">photo_camera</span>
          </button>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <h2 className="text-3xl font-bold text-[#002045]">{profile.firstName} {profile.lastName}</h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
            <span className="px-3 py-1 bg-[#85f6ad] text-[#00723f] rounded-full text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Verified {profile.role}
            </span>
            <span className="px-3 py-1 bg-[#d6e3ff] text-[#001b3c] rounded-full text-xs font-bold uppercase tracking-wider">
              Account #{profile.id}
            </span>
          </div>
        </div>

        {/* Impact Stats Placeholder */}
        <div className="bg-[#f5faff] border border-[#d6e3ff] p-6 rounded-2xl flex flex-col items-center justify-center min-w-[240px] opacity-60">
          <div className="text-center mb-4">
            <p className="text-xs text-[#74777f] font-bold uppercase tracking-widest">Lifetime Impact</p>
            <p className="text-3xl font-bold text-[#002045] mt-1">Pending...</p>
          </div>
        </div>
      </section>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Editable Details & Preferences */}
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-white border border-[#dee3e8] shadow-[0px_4px_6px_rgba(26,54,93,0.04)] rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#171c20]">Personal Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#74777f]">First Name</label>
                <input 
                  type="text" required value={formData.firstName} 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full bg-[#eff4f9] border-none rounded-lg px-4 py-3 text-[#171c20] font-medium focus:ring-2 focus:ring-[#002045] focus:bg-white transition-all outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#74777f]">Last Name</label>
                <input 
                  type="text" required value={formData.lastName} 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full bg-[#eff4f9] border-none rounded-lg px-4 py-3 text-[#171c20] font-medium focus:ring-2 focus:ring-[#002045] focus:bg-white transition-all outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-[#74777f]">Email Address</label>
                <input 
                  type="email" disabled value={profile.email} 
                  className="w-full bg-[#e4e9ee] border-none rounded-lg px-4 py-3 text-[#43474e] font-medium cursor-not-allowed opacity-70"
                />
              </div>
              <div className="space-y-1 opacity-50 grayscale select-none pointer-events-none">
                <label className="text-sm font-semibold text-[#74777f]">Phone Number</label>
                <input disabled type="tel" placeholder="+212 (0) 6..." className="w-full bg-[#eff4f9] border-none rounded-lg px-4 py-3" />
              </div>
            </div>
          </section>

          {/* Greyed Out Feature: Notification Preferences */}
          <section className="bg-white border border-[#dee3e8] shadow-sm rounded-2xl p-8 opacity-40 grayscale select-none pointer-events-none">
            <h3 className="text-xl font-bold text-[#171c20] mb-6">Notification Preferences</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-[#eff4f9] rounded-xl">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#002045]">mail</span>
                  <div>
                    <p className="font-bold text-[#171c20]">Email Updates</p>
                    <p className="text-sm text-[#43474e]">Receive monthly impact reports.</p>
                  </div>
                </div>
                <div className="w-11 h-6 bg-[#002045] rounded-full relative"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Security & Assets */}
        <div className="lg:col-span-5 space-y-8 opacity-40 grayscale select-none pointer-events-none">
          <section className="bg-white border border-[#dee3e8] shadow-sm rounded-2xl p-8">
            <h3 className="text-xl font-bold text-[#171c20] mb-6">Security Settings</h3>
            <div className="space-y-3">
              <div className="w-full flex items-center justify-between p-4 border border-[#dee3e8] rounded-xl bg-[#f5faff]">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#74777f]">lock</span>
                  <span className="font-bold text-[#171c20]">Change Password</span>
                </div>
                <span className="material-symbols-outlined text-[#74777f]">chevron_right</span>
              </div>
              <div className="w-full flex items-center justify-between p-4 border border-[#dee3e8] rounded-xl bg-[#f5faff]">
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

          <section className="bg-[#002045] text-white rounded-2xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Tax Documents</h3>
              <p className="text-sm text-[#86a0cd] mb-6">Download your consolidated tax-deductible receipt.</p>
              <button type="button" disabled className="w-full bg-white text-[#002045] py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">download</span> Download PDF
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Sticky Footer Action Bar */}
      <div className="sticky bottom-0 z-10 pt-6 pb-6 border-t border-[#dee3e8] bg-[#f5faff]/90 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
        <div className="text-sm font-semibold text-[#74777f] flex items-center gap-2">
          {statusMessage ? (
             <span className={statusMessage.type === 'success' ? 'text-[#006d3c]' : 'text-[#ba1a1a]'}>{statusMessage.text}</span>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">info</span> Unsaved changes will be lost.
            </>
          )}
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button type="button" onClick={() => setFormData({ firstName: profile.firstName, lastName: profile.lastName })} className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-[#c4c6cf] font-bold text-[#43474e] hover:bg-white transition-all">
            Discard
          </button>
          <button type="submit" disabled={isSaving || (formData.firstName === profile.firstName && formData.lastName === profile.lastName)} className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-[#002045] font-bold text-white shadow-lg hover:bg-[#1a365d] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <span className="material-symbols-outlined">save</span>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserProfile;