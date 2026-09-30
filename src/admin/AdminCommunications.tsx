import React, { useState } from 'react';
import {
  Share2,
  Video,
  Link2,
  Sliders,
  History,
  MessageSquareShare
} from 'lucide-react';
import { SocialMediaTab } from './communications/SocialMediaTab';
import { VideoConferencesTab } from './communications/VideoConferencesTab';
import { SocialLinksTab } from './communications/SocialLinksTab';
import { IntegrationSettingsTab } from './communications/IntegrationSettingsTab';
import { ActivityLogsTab } from './communications/ActivityLogsTab';

interface AdminCommunicationsProps {
  initialSubmenu?: 'social' | 'video' | 'links' | 'integrations' | 'logs';
}

export const AdminCommunications: React.FC<AdminCommunicationsProps> = ({
  initialSubmenu = 'social',
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<'social' | 'video' | 'links' | 'integrations' | 'logs'>(
    initialSubmenu
  );

  const submenuItems = [
    { id: 'social' as const, label: '1. Social Media', icon: Share2 },
    { id: 'video' as const, label: '2. Video Conferences', icon: Video },
    { id: 'links' as const, label: '3. Social Links', icon: Link2 },
    { id: 'integrations' as const, label: '4. Integration Settings', icon: Sliders },
    { id: 'logs' as const, label: '5. Activity Logs', icon: History },
  ];

  return (
    <div className="space-y-6">
      {/* Top Section Banner & Submenu Navigation */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <MessageSquareShare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Communications & Social Media</h1>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  New Feature
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Unified control center for official social accounts, video conferences (Zoom/Meet/Teams), website links, API integrations, and audit logs.
              </p>
            </div>
          </div>
        </div>

        {/* 5-Item Submenu Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-slate-100 text-xs font-semibold">
          {submenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubmenu === item.id;
            return (
              <button
                key={item.id}
                id={`comm-tab-${item.id}`}
                onClick={() => setActiveSubmenu(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View */}
      {activeSubmenu === 'social' && <SocialMediaTab />}
      {activeSubmenu === 'video' && <VideoConferencesTab />}
      {activeSubmenu === 'links' && <SocialLinksTab />}
      {activeSubmenu === 'integrations' && <IntegrationSettingsTab />}
      {activeSubmenu === 'logs' && <ActivityLogsTab />}
    </div>
  );
};
