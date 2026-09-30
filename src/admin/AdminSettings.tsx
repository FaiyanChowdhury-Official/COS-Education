import React, { useState, useEffect } from 'react';
import {
  Settings,
  MessageSquare,
  Mail,
  Share2,
  BarChart,
  Building,
  Bell,
  Layers,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Globe2,
  Calendar,
  FileText,
  GraduationCap,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

export const AdminSettings: React.FC = () => {
  const { getAuthHeaders } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<
    'whatsapp' | 'email' | 'social' | 'analytics' | 'brand' | 'notifications' | 'taxonomy'
  >('whatsapp');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Settings State
  const [settings, setSettings] = useState({
    // WhatsApp
    whatsappNumber: '+880 1572 231717',
    whatsappDefaultGreeting: 'Hello COS Education, I would like to inquire about studying abroad in the UK / Europe.',
    whatsappCloudApiPhoneId: 'phone_id_cos_live_9921',
    whatsappBusinessAccountId: 'waba_cos_enterprise_01',
    whatsappApiToken: '••••••••••••••••••••••••••••••',
    whatsappTemplatesEnabled: true,

    // Email (Transactional SMTP)
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: '587',
    smtpUser: 'apikey',
    smtpFromEmail: 'admissions@cos-education.com',
    smtpFromName: 'COS Education Consultants',
    adminCcNotificationEmail: 'operations@cos-education.com',

    // Social Media
    facebookUrl: 'https://facebook.com/coseducationbd',
    instagramHandle: '@coseducationbd',
    youtubeChannel: 'https://youtube.com/@coseducationbd',
    tiktokHandle: '@coseducation',
    linkedinUrl: 'https://linkedin.com/company/cos-education-consultants',

    // Analytics IDs
    ga4MeasurementId: 'G-COS99824810',
    metaPixelId: '98402948102948',
    gtmContainerId: 'GTM-COS8841',
    tiktokPixelId: 'TT-COS-0199',

    // Brand Information
    brandName: 'COS Education',
    websiteDomain: 'cos-education.com',
    tagline: 'Connecting Students with Global Education Opportunities',
    headOfficeAddress: 'Lift-03, Floor-04, Manru Shopping City, Chowhatta Point, Sylhet, Bangladesh',
    helplinePhone: '+880 1572 231717',
    emergencyHotline: '+880 1977-889900',
    officialEmail: 'info@cos-education.com',

    // Notification Preferences
    notifyCounsellorOnLead: true,
    notifyStudentOnDocReview: true,
    notifyStudentOnOffer: true,
    sendDailyDigestEmail: true,
    sendWhatsAppReminders: true,

    // Taxonomy lists
    leadStages: [
      'New Lead',
      'Contacted',
      'Counselling',
      'Documents Pending',
      'Application Started',
      'Applied',
      'Offer Received',
      'Deposit',
      'CAS/Enrollment',
      'Visa Applied',
      'Visa Decision',
      'Enrolled',
    ],
    applicationStatuses: [
      'Drafting',
      'Internal Review',
      'Submitted to University',
      'Conditional Offer',
      'Unconditional Offer',
      'Interview Scheduled',
      'Deposit Paid',
      'CAS Issued',
      'Visa Lodged',
      'Visa Granted',
      'Rejected',
    ],
    documentCategories: [
      'Passport & ID',
      'Academic Certificates & Transcripts',
      'English Language Proficiency (IELTS/PTE)',
      'Statement of Purpose (SOP)',
      'Letters of Recommendation (LOR)',
      'Financial Solvency & Bank Statements',
      'Work Experience & CV',
      'Medical & Police Clearance',
    ],
    countries: ['United Kingdom', 'Finland', 'United States', 'Malaysia', 'Malta', 'Greece', 'Cyprus'],
    degrees: ['Bachelor (Honours)', 'Master Degree (MSc/MA/MBA)', 'Postgraduate Diploma', 'PhD / Doctorate', 'Foundation Year'],
    intakes: ['January 2027', 'May 2027', 'September 2027', 'October 2026', 'February 2027'],
  });

  const [newTagInput, setNewTagInput] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Load persisted settings if available
    const saved = localStorage.getItem('cos_admin_system_settings');
    if (saved) {
      try {
        setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {
        console.warn('Could not parse local settings', e);
      }
    }
    setIsLoading(false);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMsg(null);
    try {
      localStorage.setItem('cos_admin_system_settings', JSON.stringify(settings));
      setStatusMsg({ type: 'success', text: 'System settings saved and applied successfully across portals!' });
      setTimeout(() => setStatusMsg(null), 3500);
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to update system settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = (category: 'leadStages' | 'applicationStatuses' | 'documentCategories' | 'countries' | 'degrees' | 'intakes') => {
    const val = (newTagInput[category] || '').trim();
    if (!val) return;
    if (settings[category].includes(val)) return;

    setSettings((prev) => ({
      ...prev,
      [category]: [...prev[category], val],
    }));

    setNewTagInput((prev) => ({ ...prev, [category]: '' }));
  };

  const removeTag = (category: 'leadStages' | 'applicationStatuses' | 'documentCategories' | 'countries' | 'degrees' | 'intakes', index: number) => {
    setSettings((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const cleanWhatsAppNumber = (num: string) => num.replace(/[^0-9]/g, '');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
        <span className="text-sm font-medium">Loading system configurations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">System Settings & Integrations</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Global agency settings: WhatsApp business automation, email delivery, social channels, analytics trackers, and pipeline taxonomies.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'Saving Changes...' : 'Save All Settings'}</span>
        </button>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-700 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'whatsapp', label: 'WhatsApp & Click-to-Chat', icon: MessageSquare },
          { id: 'email', label: 'Email & SMTP', icon: Mail },
          { id: 'social', label: 'Social Media', icon: Share2 },
          { id: 'analytics', label: 'Analytics IDs', icon: BarChart },
          { id: 'brand', label: 'Brand & Agency Info', icon: Building },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'taxonomy', label: 'Pipelines & Taxonomy', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: WhatsApp Business Integration */}
      {activeTab === 'whatsapp' && (
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span>WhatsApp Business Integration & Click-to-Chat</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Configure your verified WhatsApp business contact for website CTAs, floating chat widgets, and Meta Cloud API notifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Official WhatsApp Business Number</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="+880 1572 231717"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-hidden focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-500">Include country code with plus sign (e.g. +880 for Bangladesh)</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Live Click-to-Chat CTA Preview</label>
              <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Direct WhatsApp Link Active</span>
                </div>
                <a
                  href={`https://wa.me/${cleanWhatsAppNumber(settings.whatsappNumber)}?text=${encodeURIComponent(settings.whatsappDefaultGreeting)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  <span>Test Chat</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Default Click-to-Chat Greeting Message</label>
              <textarea
                rows={2}
                value={settings.whatsappDefaultGreeting}
                onChange={(e) => setSettings({ ...settings, whatsappDefaultGreeting: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Cloud API Automation Section */}
          <div className="pt-4 border-t border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Meta WhatsApp Cloud API (Automated Approved Templates)</span>
                </h3>
                <p className="text-xs text-slate-400">Where API credentials are available, automated transactional messages can be triggered.</p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                <input
                  type="checkbox"
                  checked={settings.whatsappTemplatesEnabled}
                  onChange={(e) => setSettings({ ...settings, whatsappTemplatesEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500"
                />
                <span>Enable Automated API Templates</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Phone Number ID</label>
                <input
                  type="text"
                  value={settings.whatsappCloudApiPhoneId}
                  onChange={(e) => setSettings({ ...settings, whatsappCloudApiPhoneId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Business Account ID (WABA)</label>
                <input
                  type="text"
                  value={settings.whatsappBusinessAccountId}
                  onChange={(e) => setSettings({ ...settings, whatsappBusinessAccountId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">System User Access Token</label>
                <input
                  type="password"
                  value={settings.whatsappApiToken}
                  onChange={(e) => setSettings({ ...settings, whatsappApiToken: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Email & SMTP */}
      {activeTab === 'email' && (
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-400" />
              <span>Email & SMTP Delivery Configuration</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Configure SMTP credentials or transactional API relay for outbound student notices, application alerts, and staff digests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">SMTP Host Server</label>
              <input
                type="text"
                value={settings.smtpHost}
                onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">SMTP Port</label>
              <input
                type="text"
                value={settings.smtpPort}
                onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">From / Sender Email Address</label>
              <input
                type="email"
                value={settings.smtpFromEmail}
                onChange={(e) => setSettings({ ...settings, smtpFromEmail: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Sender Display Name</label>
              <input
                type="text"
                value={settings.smtpFromName}
                onChange={(e) => setSettings({ ...settings, smtpFromName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Executive CC Notification Address</label>
              <input
                type="email"
                value={settings.adminCcNotificationEmail}
                onChange={(e) => setSettings({ ...settings, adminCcNotificationEmail: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Social Media */}
      {activeTab === 'social' && (
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-indigo-400" />
              <span>Official Social Media Channels</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Links and handles displayed in header ribbons, footers, counsellor profiles, and lead forms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Facebook Page URL</label>
              <input
                type="text"
                value={settings.facebookUrl}
                onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Instagram Handle</label>
              <input
                type="text"
                value={settings.instagramHandle}
                onChange={(e) => setSettings({ ...settings, instagramHandle: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">YouTube Channel URL</label>
              <input
                type="text"
                value={settings.youtubeChannel}
                onChange={(e) => setSettings({ ...settings, youtubeChannel: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">TikTok Handle</label>
              <input
                type="text"
                value={settings.tiktokHandle}
                onChange={(e) => setSettings({ ...settings, tiktokHandle: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">LinkedIn Company Page</label>
              <input
                type="text"
                value={settings.linkedinUrl}
                onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Analytics IDs */}
      {activeTab === 'analytics' && (
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart className="w-5 h-5 text-amber-400" />
              <span>Marketing Analytics & Conversion Tracking IDs</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Connect Google Analytics 4, Meta Pixel, and GTM containers for multi-channel lead tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Google Analytics 4 Measurement ID</label>
              <input
                type="text"
                value={settings.ga4MeasurementId}
                onChange={(e) => setSettings({ ...settings, ga4MeasurementId: e.target.value })}
                placeholder="G-XXXXXXXXXX"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Meta (Facebook) Pixel ID</label>
              <input
                type="text"
                value={settings.metaPixelId}
                onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value })}
                placeholder="e.g. 123456789012345"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Google Tag Manager Container ID</label>
              <input
                type="text"
                value={settings.gtmContainerId}
                onChange={(e) => setSettings({ ...settings, gtmContainerId: e.target.value })}
                placeholder="GTM-XXXXXXX"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">TikTok Pixel ID</label>
              <input
                type="text"
                value={settings.tiktokPixelId}
                onChange={(e) => setSettings({ ...settings, tiktokPixelId: e.target.value })}
                placeholder="TT-XXXXXXXXX"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Brand Information */}
      {activeTab === 'brand' && (
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-400" />
              <span>Brand Identity & Office Locations</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Official agency information for Bangladesh and international communication.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Agency Brand Name</label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tagline / Mission</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Official Head Office Address</label>
              <input
                type="text"
                value={settings.headOfficeAddress}
                onChange={(e) => setSettings({ ...settings, headOfficeAddress: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Helpline Phone</label>
              <input
                type="text"
                value={settings.helplinePhone}
                onChange={(e) => setSettings({ ...settings, helplinePhone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Official Contact Email</label>
              <input
                type="email"
                value={settings.officialEmail}
                onChange={(e) => setSettings({ ...settings, officialEmail: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Website Domain Name</label>
              <input
                type="text"
                value={settings.websiteDomain}
                onChange={(e) => setSettings({ ...settings, websiteDomain: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Notification Preferences */}
      {activeTab === 'notifications' && (
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-400" />
              <span>Automated Notification Dispatch Preferences</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Toggle which system events trigger email and WhatsApp messages.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                key: 'notifyCounsellorOnLead',
                title: 'Notify assigned counsellor when a new lead registers',
                desc: 'Dispatches instant internal email with lead score and qualifications.',
              },
              {
                key: 'notifyStudentOnDocReview',
                title: 'Notify student upon document verification & status updates',
                desc: 'Alerts student immediately if a document is Approved, Rejected, or Needs Re-upload.',
              },
              {
                key: 'notifyStudentOnOffer',
                title: 'Notify student upon university offer letter issuance',
                desc: 'Sends congratulations email with conditions checklist and deposit instructions.',
              },
              {
                key: 'sendDailyDigestEmail',
                title: 'Send daily morning executive pipeline digest',
                desc: 'Summarizes new leads, pending documents, and upcoming consultation appointments.',
              },
              {
                key: 'sendWhatsAppReminders',
                title: 'Send WhatsApp appointment reminder 24 hours in advance',
                desc: 'Automatic reminder template sent to student phone number.',
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-700/60">
                <div>
                  <div className="font-semibold text-white text-xs sm:text-sm">{item.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(settings as any)[item.key]}
                    onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Pipelines & Taxonomy */}
      {activeTab === 'taxonomy' && (
        <div className="space-y-6">
          <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Pipelines, Stages & Taxonomy Configurations</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Customize lead stages, application statuses, document categories, study levels, and active intakes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lead Stages */}
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-white text-sm">Lead CRM Stages ({settings.leadStages.length})</h3>
              <div className="flex flex-wrap gap-1.5">
                {settings.leadStages.map((stage, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200">
                    <span>{stage}</span>
                    <button onClick={() => removeTag('leadStages', idx)} className="text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add new stage..."
                  value={newTagInput.leadStages || ''}
                  onChange={(e) => setNewTagInput({ ...newTagInput, leadStages: e.target.value })}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                <button
                  onClick={() => addTag('leadStages')}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Application Statuses */}
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-white text-sm">Application Statuses ({settings.applicationStatuses.length})</h3>
              <div className="flex flex-wrap gap-1.5">
                {settings.applicationStatuses.map((st, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200">
                    <span>{st}</span>
                    <button onClick={() => removeTag('applicationStatuses', idx)} className="text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add application status..."
                  value={newTagInput.applicationStatuses || ''}
                  onChange={(e) => setNewTagInput({ ...newTagInput, applicationStatuses: e.target.value })}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                <button
                  onClick={() => addTag('applicationStatuses')}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Document Categories */}
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-white text-sm">Document Categories ({settings.documentCategories.length})</h3>
              <div className="flex flex-wrap gap-1.5">
                {settings.documentCategories.map((doc, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200">
                    <span>{doc}</span>
                    <button onClick={() => removeTag('documentCategories', idx)} className="text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add document category..."
                  value={newTagInput.documentCategories || ''}
                  onChange={(e) => setNewTagInput({ ...newTagInput, documentCategories: e.target.value })}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                <button
                  onClick={() => addTag('documentCategories')}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Active Intakes */}
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-white text-sm">Upcoming Intakes ({settings.intakes.length})</h3>
              <div className="flex flex-wrap gap-1.5">
                {settings.intakes.map((intake, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200">
                    <span>{intake}</span>
                    <button onClick={() => removeTag('intakes', idx)} className="text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add new intake (e.g. October 2027)..."
                  value={newTagInput.intakes || ''}
                  onChange={(e) => setNewTagInput({ ...newTagInput, intakes: e.target.value })}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                <button
                  onClick={() => addTag('intakes')}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
