import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/axios';
import type { CharityAction, Category } from '../../types';

const categories: { label: string; value: Category | 'ALL' }[] = [
  { label: 'All Categories', value: 'ALL' },
  { label: 'Education', value: 'EDUCATION' },
  { label: 'Environment', value: 'ENVIRONNEMENT' },
  { label: 'Health', value: 'SANTE' },
  { label: 'Emergency', value: 'URGENCE' },
];

const PublicFeed = () => {
  const [campaigns, setCampaigns] = useState<CharityAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');

  useEffect(() => {
    const fetchPublicCampaigns = async () => {
      setIsLoading(true);
      try {
        const endpoint = selectedCategory === 'ALL' 
          ? '/actions' 
          : `/actions/category/${selectedCategory}`;
          
        const response = await apiClient.get<CharityAction[]>(endpoint);
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
    <div className="fade-in">
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
        <div className="flex flex-wrap gap-2 pb-4 mb-8 border-b">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                selectedCategory === cat.value
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
            {campaigns.map((campaign) => {
              const progressPercentage = Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100);

              return (
                <div key={campaign.id} className="flex flex-col overflow-hidden transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-md">
                  <div className="flex items-center justify-center h-40 text-sm text-gray-400 bg-gray-200">
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
                    
                    <div className="mb-4">
                      <div className="flex justify-between mb-1 text-xs font-semibold text-gray-600">
                        <span className="text-green-700">{campaign.currentAmount} MAD Raised</span>
                        <span>Target: {campaign.targetAmount} MAD</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 transition-all duration-500 bg-green-500 rounded-full" 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicFeed;