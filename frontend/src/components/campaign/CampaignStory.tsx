import React from 'react';
import { useTranslation } from 'react-i18next'; // <-- Added
import type { CharityAction } from '../../types';

interface CampaignStoryProps {
  campaign: CharityAction;
}

const CampaignStory: React.FC<CampaignStoryProps> = ({ campaign }) => {
  const { t } = useTranslation(); // <-- Added

  return (
    <div className="space-y-8 lg:col-span-2">
      <div className="aspect-video overflow-hidden rounded-2xl bg-[#dee3e8] shadow-sm">
        {campaign.mediaUrl ? (
          <img src={campaign.mediaUrl} alt="Campaign" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#74777f] italic">
            {t('campaignStory.noMedia')}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-900 font-bold text-white">
          {campaign.organizationName ? campaign.organizationName.charAt(0) : 'O'}
        </div>
        <div>
          <p className="text-sm text-gray-500">{t('campaignStory.organizedBy')}</p>
          <p className="font-bold text-gray-800">
            {campaign.organizationName || t('campaignStory.registeredOrg')}
            <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">
              {t('campaignStory.verified')}
            </span>
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-4 border-b pb-2 text-2xl font-bold">{t('campaignStory.theStory')}</h2>
        <div className="space-y-4 leading-relaxed text-gray-700">
          {campaign.description ? (
            <p>{campaign.description}</p>
          ) : (
            <>
              <p>{t('campaignStory.storyPlaceholder1')}</p>
              <p>{t('campaignStory.storyPlaceholder2')}</p>
            </>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-4 border-b pb-2 text-2xl font-bold">
          {t('campaignStory.campaignUpdates')}
        </h2>
        {campaign.updates && campaign.updates.length > 0 ? (
          <div className="space-y-4">
            {campaign.updates.map((update, i) => (
              <div
                key={i}
                className="rounded border-l-2 border-blue-500 bg-gray-50 p-4 pl-4 text-sm text-gray-500 italic"
              >
                <p className="text-xs font-bold text-[#74777f]">{update.date}</p>
                <p className="text-gray-700">{update.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded bg-gray-50 p-4 text-sm text-gray-500 italic">
            {t('campaignStory.noUpdates')}
          </p>
        )}
      </div>
    </div>
  );
};

export default CampaignStory;
