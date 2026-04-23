import React from 'react';
import type { CharityAction } from '../../types';

interface CampaignStoryProps {
  campaign: CharityAction;
}

const CampaignStory: React.FC<CampaignStoryProps> = ({ campaign }) => {
  return (
    <div className="space-y-8 lg:col-span-2">
      {/* Main Image Placeholder */}
      <div className="flex items-center justify-center w-full text-gray-400 bg-gray-200 h-64 rounded-xl">
        [High Quality Campaign Image / Video Placeholder]
      </div>

      {/* Organization Info Card */}
      <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
        <div className="flex items-center justify-center w-12 h-12 font-bold text-white bg-blue-900 rounded-full">
          {campaign.organizationName ? campaign.organizationName.charAt(0) : 'O'}
        </div>
        <div>
          <p className="text-sm text-gray-500">Organized by</p>
          <p className="font-bold text-gray-800">
            {campaign.organizationName || 'Registered Organization'}
            <span className="px-2 py-0.5 ml-2 text-xs text-green-600 bg-green-100 rounded-full">Verified ✓</span>
          </p>
        </div>
      </div>

      {/* The Rich Story */}
      <div>
        <h2 className="pb-2 mb-4 text-2xl font-bold border-b">The Story</h2>
        <div className="space-y-4 leading-relaxed text-gray-700">
          {campaign.longStory ? (
            <p>{campaign.longStory}</p>
          ) : (
            <>
              <p>*(This is a placeholder for the rich-text story. You can add a `longStory` field to your database later.)*</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </>
          )}
        </div>
      </div>

      {/* Updates Timeline */}
      <div>
        <h2 className="pb-2 mb-4 text-2xl font-bold border-b">Campaign Updates</h2>
        {campaign.updates && campaign.updates.length > 0 ? (
          <div className="space-y-4">
            {campaign.updates.map((update, i) => (
              <div key={i} className="pl-4 border-l-2 border-blue-500">
                <p className="text-xs text-gray-500">{update.date}</p>
                <p className="text-gray-700">{update.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-4 text-sm italic text-gray-500 rounded bg-gray-50">
            No updates posted yet. Check back later to see the impact of this campaign!
          </p>
        )}
      </div>
    </div>
  );
};

export default CampaignStory;