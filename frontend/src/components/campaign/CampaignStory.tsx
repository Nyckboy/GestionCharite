import React from 'react';
import type { CharityAction } from '../../types';

interface CampaignStoryProps {
  campaign: CharityAction;
}

const CampaignStory: React.FC<CampaignStoryProps> = ({ campaign }) => {
  return (
    <div className="space-y-8 lg:col-span-2">
      {/* Main Image Placeholder */}
      <div className="h-80 w-full overflow-hidden rounded-xl bg-gray-100">
        {campaign.mediaUrl ? (
          <img
            src={campaign.mediaUrl}
            alt={campaign.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
            No Campaign Image Available
          </div>
        )}
      </div>

      {/* Organization Info Card */}
      <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-900 font-bold text-white">
          {campaign.organizationName ? campaign.organizationName.charAt(0) : 'O'}
        </div>
        <div>
          <p className="text-sm text-gray-500">Organized by</p>
          <p className="font-bold text-gray-800">
            {campaign.organizationName || 'Registered Organization'}
            <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">
              Verified ✓
            </span>
          </p>
        </div>
      </div>

      {/* The Rich Story */}
      <div>
        <h2 className="mb-4 border-b pb-2 text-2xl font-bold">The Story</h2>
        <div className="space-y-4 leading-relaxed text-gray-700">
          {campaign.longStory ? (
            <p>{campaign.longStory}</p>
          ) : (
            <>
              <p>
                *(This is a placeholder for the rich-text story. You can add a `longStory` field to
                your database later.)*
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Updates Timeline */}
      <div>
        <h2 className="mb-4 border-b pb-2 text-2xl font-bold">Campaign Updates</h2>
        {campaign.updates && campaign.updates.length > 0 ? (
          <div className="space-y-4">
            {campaign.updates.map((update, i) => (
              <div key={i} className="border-l-2 border-blue-500 pl-4">
                <p className="text-xs text-gray-500">{update.date}</p>
                <p className="text-gray-700">{update.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded bg-gray-50 p-4 text-sm text-gray-500 italic">
            No updates posted yet. Check back later to see the impact of this campaign!
          </p>
        )}
      </div>
    </div>
  );
};

export default CampaignStory;
