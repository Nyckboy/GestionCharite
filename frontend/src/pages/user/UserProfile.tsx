import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/axios';
import type { PlatformUser } from '../../types';

const UserProfile = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<PlatformUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get<PlatformUser>('/users/me');
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) return <div className="animate-pulse">Loading profile...</div>;
  if (!profile) return <div className="text-red-500">Failed to load profile data.</div>;

  return (
    <div className="max-w-3xl fade-in">
      <h2 className="mb-6 text-3xl font-bold text-gray-800">Welcome back, {profile.firstName}!</h2>
      
      <div className="p-8 bg-white border border-gray-100 rounded-lg shadow-sm">
        <div className="flex items-center gap-6 mb-8">
          <div className="flex items-center justify-center w-24 h-24 text-3xl font-bold text-blue-700 bg-blue-100 rounded-full">
            {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h3>
            <p className="text-gray-500">{profile.email}</p>
            <span className="inline-block px-3 py-1 mt-2 text-xs font-bold text-green-800 bg-green-100 rounded-full">
              Verified Donor
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <h4 className="mb-4 text-lg font-semibold text-gray-800">Account Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Account ID</p>
              <p className="font-medium text-gray-900">#{profile.id}</p>
            </div>
            <div>
              <p className="text-gray-500">Role</p>
              <p className="font-medium text-gray-900">{profile.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;