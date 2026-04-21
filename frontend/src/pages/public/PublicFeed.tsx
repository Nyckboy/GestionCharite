// src/pages/public/PublicFeed.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import type { CharityAction, Category } from '../../types';

const categories: { label: string; value: Category | 'ALL' }[] = [
  { label: 'All Categories (Backend Update Needed)', value: 'ALL' },
  { label: 'Education', value: 'EDUCATION' },
  { label: 'Environment', value: 'ENVIRONNEMENT' },
  { label: 'Health', value: 'SANTE' },
  { label: 'Emergency', value: 'URGENCE' },
];

const PublicFeed = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [campaigns, setCampaigns] = useState<CharityAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Defaulting to EDUCATION since the backend doesn't have an "All" endpoint yet
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('EDUCATION');

  useEffect(() => {
    const fetchPublicCampaigns = async () => {
      if (selectedCategory === 'ALL') return; // Prevent fetching if "ALL" is clicked

      setIsLoading(true);
      try {
        const response = await apiClient.get<CharityAction[]>(`/actions/category/${selectedCategory}`);
        setCampaigns(response.data);
      } catch (error) {
        console.error("Failed to fetch campaigns", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicCampaigns();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Public Navbar */}
      <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
        <Link to="/" className="text-2xl font-bold text-blue-800">
          Gestion Charité
        </Link>
        
        <div className="flex gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Hello, {user?.firstName}</span>
              {/* Route users to their respective dashboards based on role */}
              {user?.role === 'ORG_ADMIN' && <Link to="/organization" className="text-sm text-blue-600 hover:underline">My Dashboard</Link>}
              {user?.role === 'SUPER_ADMIN' && <Link to="/admin" className="text-sm text-blue-600 hover:underline">Admin Panel</Link>}
              <button onClick={logout} className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-blue-600 transition-colors bg-blue-100 rounded hover:bg-blue-200">Log In</Link>
              <Link to="/register" className="px-4 py-2 text-sm font-semibold text-white transition-colors bg-blue-600 rounded hover:bg-blue-700">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-16 text-center text-white bg-blue-800">
        <h1 className="mb-4 text-4xl font-bold">Make a Difference Today</h1>
        <p className="max-w-2xl mx-auto text-lg text-blue-100">
          Connect with verified charitable organizations and fund campaigns that change the world. 
          Every dirham counts towards a better tomorrow.
        </p>
      </div>

      <div className="max-w-6xl p-8 mx-auto mt-4">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8 border-b pb-4">
          {categories.map((cat) => (
            <button
              key={cat.value}
              disabled={cat.value === 'ALL'}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                cat.value === 'ALL' 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' // Greyed out for missing backend feature
                  : selectedCategory === cat.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Campaign Grid */}
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 bg-white rounded-lg shadow-sm animate-pulse">
            Discovering campaigns...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-white rounded-lg shadow-sm">
            No active campaigns found in this category.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="flex flex-col overflow-hidden bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                
                {/* Image Placeholder */}
                <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                  Campaign Image (Future Feature)
                </div>

                <div className="flex flex-col flex-grow p-6">
                  <div className="flex items-start justify-between mb-2">
                    <span className="px-2 py-1 text-xs font-bold text-blue-800 uppercase bg-blue-100 rounded">
                      {campaign.category}
                    </span>
                  </div>
                  
                  <h3 className="mb-2 text-xl font-bold text-gray-800 line-clamp-2">{campaign.title}</h3>
                  <p className="flex-grow mb-4 text-sm text-gray-600 line-clamp-3">{campaign.description}</p>
                  
                  {/* Missing Backend Feature: Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-1 text-xs font-semibold text-gray-500">
                      <span>0 MAD Raised (Backend needed)</span>
                      <span>Target: {campaign.targetAmount} MAD</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-gray-300 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>

                  <Link 
                    to={`/donate/${campaign.id}`}
                    className="block w-full px-4 py-3 font-semibold text-center text-white transition-colors bg-green-600 rounded hover:bg-green-700"
                  >
                    Donate Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicFeed;