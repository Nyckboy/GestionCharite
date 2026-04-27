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
        const endpoint =
          selectedCategory === 'ALL' ? '/actions' : `/actions/category/${selectedCategory}`;

        const response = await apiClient.get<CharityAction[]>(endpoint);
        setCampaigns(response.data);
      } catch (error) {
        console.error('Failed to fetch campaigns', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicCampaigns();
  }, [selectedCategory]);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <div className="bg-blue-800 py-16 text-center text-white">
        <h1 className="mb-4 text-4xl font-bold">Make a Difference Today</h1>
        <p className="mx-auto max-w-2xl text-lg text-blue-100">
          Connect with verified charitable organizations and fund campaigns that change the world.
          Every dirham counts towards a better tomorrow.
        </p>
      </div>

      <div className="mx-auto mt-4 max-w-6xl p-8">
        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-2 border-b pb-4">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-blue-600 text-white'
                  : 'border bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Campaign Grid */}
        {isLoading ? (
          <div className="animate-pulse rounded-lg bg-white p-12 text-center text-gray-500 shadow-sm">
            Discovering campaigns...
          </div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center text-gray-500 shadow-sm">
            No active campaigns found in this category.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => {
              const progressPercentage = Math.min(
                (campaign.currentAmount / campaign.targetAmount) * 100,
                100,
              );

              return (
                <div
                  key={campaign.id}
                  className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="h-48 overflow-hidden bg-gray-100">
                    {campaign.mediaUrl ? (
                      <img
                        src={campaign.mediaUrl}
                        alt={campaign.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm text-gray-400">
                        No Image Available
                      </div>
                    )}
                  </div>

                  <div className="flex grow flex-col p-6">
                    <div className="mb-2 flex items-start justify-between">
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs font-bold text-blue-800 uppercase">
                        {campaign.category}
                      </span>
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-xl font-bold text-gray-800">
                      {campaign.title}
                    </h3>
                    <p className="mb-4 line-clamp-3 grow text-sm text-gray-600">
                      {campaign.description}
                    </p>

                    <div className="mb-4">
                      <div className="mb-1 flex justify-between text-xs font-semibold text-gray-600">
                        <span className="text-green-700">{campaign.currentAmount} MAD Raised</span>
                        <span>Target: {campaign.targetAmount} MAD</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-green-500 transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <Link
                      to={`/donate/${campaign.id}`}
                      className="block w-full rounded bg-green-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-green-700"
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
