import React, { useState, useEffect } from 'react';
import {
  Share2,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Sparkles,
  Calendar,
  Send,
  RefreshCw,
  Search,
  Filter,
  Check,
  Eye,
  FileText,
  Clock,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext';

export interface SocialAccount {
  id: number;
  platform: string;
  accountName: string;
  profileUrl: string;
  username: string;
  accountType: string;
  status: string;
  displayOrder: number;
  icon?: string;
  description?: string;
  apiConnected: boolean;
  followersCount: number;
  reachCount: number;
  engagementRate?: string;
  viewsCount: number;
}

export interface SocialPost {
  id: number;
  title: string;
  caption: string;
  platforms: string[];
  mediaType: string;
  mediaUrl?: string;
  publishDate: string;
  publishTime: string;
  cta?: string;
  hashtags?: string;
  status: string;
  authorName: string;
  authorRole: string;
  aiGenerated: boolean;
  sourceType?: string;
  sourceReference?: string;
  platformSpecificContent?: Record<string, any>;
  publishedAt?: string;
}

const PLATFORM_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  facebook: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  instagram: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  youtube: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  linkedin: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  tiktok: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' },
  x: { bg: 'bg-slate-100', text: 'text-slate-900', border: 'border-slate-300' },
  whatsapp: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  telegram: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  threads: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  pinterest: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

export const SocialMediaTab: React.FC = () => {
  const { getAuthHeaders } = useAdminAuth();
  const [subTab, setSubTab] = useState<'dashboard' | 'content' | 'ai' | 'blog' | 'calendar'>('dashboard');
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<SocialAccount | null>(null);
  const [accountFormData, setAccountFormData] = useState({
    platform: 'facebook',
    accountName: '',
    profileUrl: '',
    username: '',
    accountType: 'Company',
    status: 'Active',
    displayOrder: 0,
    description: '',
  });

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postFormData, setPostFormData] = useState({
    title: '',
    caption: '',
    platforms: ['facebook', 'instagram'],
    mediaType: 'image',
    mediaUrl: '',
    publishDate: new Date().toISOString().split('T')[0],
    publishTime: '12:00',
    cta: 'Book Free Consultation',
    hashtags: '#COSEducation #StudyAbroad #Sylhet',
    status: 'Scheduled',
  });

  // AI Assistant form
  const [aiTopic, setAiTopic] = useState('');
  const [aiTopicType, setAiTopicType] = useState('University');
  const [aiDetails, setAiDetails] = useState('');
  const [aiIsGenerating, setAiIsGenerating] = useState(false);
  const [aiGeneratedResult, setAiGeneratedResult] = useState<any | null>(null);
  const [previewPlatform, setPreviewPlatform] = useState<string>('facebook');

  // Blog Automation
  const [selectedBlogId, setSelectedBlogId] = useState<string>('');
  const [blogIsGenerating, setBlogIsGenerating] = useState(false);
  const [blogGeneratedResult, setBlogGeneratedResult] = useState<any | null>(null);

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [accRes, postsRes, blogsRes] = await Promise.all([
        fetch('/api/admin/communications/social-accounts', { headers: getAuthHeaders() }),
        fetch('/api/admin/communications/social-posts', { headers: getAuthHeaders() }),
        fetch('/api/admin/blogs', { headers: getAuthHeaders() }),
      ]);
      if (accRes.ok) setAccounts(await accRes.json());
      if (postsRes.ok) setPosts(await postsRes.json());
      if (blogsRes.ok) setBlogs(await blogsRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Account handlers
  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingAccount ? 'PUT' : 'POST';
      const url = editingAccount
        ? `/api/admin/communications/social-accounts/${editingAccount.id}`
        : '/api/admin/communications/social-accounts';

      const res = await fetch(url, {
        method,
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(accountFormData),
      });

      if (res.ok) {
        showToast(editingAccount ? 'Account updated successfully.' : 'New social account added.');
        setIsAccountModalOpen(false);
        setEditingAccount(null);
        fetchData();
      }
    } catch (err) {
      showToast('Error saving account.');
    }
  };

  const handleToggleAccountStatus = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/communications/social-accounts/${id}/toggle`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        showToast('Account status updated.');
        fetchData();
      }
    } catch (e) {
      showToast('Failed to toggle status.');
    }
  };

  const handleDeleteAccount = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this social account?')) return;
    try {
      const res = await fetch(`/api/admin/communications/social-accounts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        showToast('Social account deleted.');
        fetchData();
      }
    } catch (e) {
      showToast('Failed to delete account.');
    }
  };

  // Post handlers
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/communications/social-posts', {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(postFormData),
      });
      if (res.ok) {
        showToast('Social post scheduled successfully.');
        setIsPostModalOpen(false);
        fetchData();
      }
    } catch (e) {
      showToast('Failed to create post.');
    }
  };

  const handlePublishNow = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/communications/social-posts/${id}/publish-now`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        showToast('Post published instantly!');
        fetchData();
      }
    } catch (e) {
      showToast('Failed to publish post.');
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await fetch(`/api/admin/communications/social-posts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      showToast('Post deleted.');
      fetchData();
    } catch (e) {
      showToast('Error deleting post.');
    }
  };

  // AI Content Generator
  const handleGenerateAI = async () => {
    if (!aiTopic.trim()) {
      showToast('Please provide a topic or theme.');
      return;
    }
    setAiIsGenerating(true);
    try {
      const res = await fetch('/api/admin/communications/ai-generate-content', {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicType: aiTopicType,
          topic: aiTopic,
          details: aiDetails,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiGeneratedResult(data.generatedContent);
        showToast('AI multi-platform content generated!');
      }
    } catch (e) {
      showToast('Failed to generate AI content.');
    } finally {
      setAiIsGenerating(false);
    }
  };

  // Approve AI to Post Manager
  const handleApproveAIToSchedule = (platformKey: string) => {
    if (!aiGeneratedResult) return;
    const platformData = aiGeneratedResult[platformKey] || {};
    setPostFormData({
      title: aiGeneratedResult.postTitle || aiTopic,
      caption: platformData.caption || aiGeneratedResult.masterCaption,
      platforms: [platformKey],
      mediaType: 'image',
      mediaUrl: '',
      publishDate: new Date().toISOString().split('T')[0],
      publishTime: '14:00',
      cta: platformData.cta || aiGeneratedResult.callToAction || 'Apply Now',
      hashtags: platformData.hashtags || aiGeneratedResult.hashtags,
      status: 'Scheduled',
    });
    setIsPostModalOpen(true);
  };

  // Blog Automation generator
  const handleGenerateFromBlog = async () => {
    if (!selectedBlogId) {
      showToast('Please select a blog post first.');
      return;
    }
    setBlogIsGenerating(true);
    try {
      const res = await fetch('/api/admin/communications/generate-from-blog', {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogId: selectedBlogId }),
      });
      if (res.ok) {
        const data = await res.json();
        setBlogGeneratedResult(data.campaign);
        showToast('Promotional social package generated from blog!');
      }
    } catch (e) {
      showToast('Failed to generate from blog.');
    } finally {
      setBlogIsGenerating(false);
    }
  };

  // Metrics calculation
  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter((a) => a.status === 'Active').length;
  const inactiveAccounts = totalAccounts - activeAccounts;
  const scheduledCount = posts.filter((p) => p.status === 'Scheduled').length;
  const publishedCount = posts.filter((p) => p.status === 'Published').length;
  const failedCount = posts.filter((p) => p.status === 'Failed').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Sub-navigation */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Share2 className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Official Social Media Management</h1>
                <p className="text-xs text-slate-500">
                  Manage all official COS Education social accounts, schedules, AI content, and analytics.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingAccount(null);
                setAccountFormData({
                  platform: 'facebook',
                  accountName: '',
                  profileUrl: '',
                  username: '',
                  accountType: 'Company',
                  status: 'Active',
                  displayOrder: accounts.length + 1,
                  description: '',
                });
                setIsAccountModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>Add Social Account</span>
            </button>

            <button
              onClick={() => setIsPostModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Post</span>
            </button>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setSubTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'dashboard'
                ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Accounts & Metrics ({accounts.length})
          </button>
          <button
            onClick={() => setSubTab('content')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'content'
                ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Content Manager ({posts.length})
          </button>
          <button
            onClick={() => setSubTab('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'ai'
                ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Content Assistant</span>
          </button>
          <button
            onClick={() => setSubTab('blog')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'blog'
                ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>Blog-to-Social Automation</span>
          </button>
          <button
            onClick={() => setSubTab('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              subTab === 'calendar'
                ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Schedule Calendar</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ACCOUNTS & METRICS DASHBOARD */}
      {subTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
              <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Connected</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{totalAccounts}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Official Accounts</div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
              <div className="text-[11px] text-emerald-600 font-medium uppercase tracking-wider">Active</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">{activeAccounts}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Live Platforms</div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Inactive</div>
              <div className="text-2xl font-bold text-slate-600 mt-1">{inactiveAccounts}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Disabled Channels</div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
              <div className="text-[11px] text-blue-600 font-medium uppercase tracking-wider">Scheduled</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{scheduledCount}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Upcoming Posts</div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
              <div className="text-[11px] text-slate-700 font-medium uppercase tracking-wider">Published</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{publishedCount}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Dispatched Posts</div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
              <div className="text-[11px] text-rose-600 font-medium uppercase tracking-wider">Failed</div>
              <div className="text-2xl font-bold text-rose-600 mt-1">{failedCount}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Publish Errors</div>
            </div>
          </div>

          {/* Social Accounts Table & Cards */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Connected Social Channels & Profiles</h2>
                <p className="text-[11px] text-slate-500">
                  Official COS Education accounts across 10 global & regional networks.
                </p>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {activeAccounts} of {totalAccounts} channels active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Platform</th>
                    <th className="px-4 py-3">Account Name & Handle</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Live Status</th>
                    <th className="px-4 py-3">API / Analytics</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {accounts.map((acc) => {
                    const styling = PLATFORM_COLORS[acc.platform.toLowerCase()] || {
                      bg: 'bg-slate-100',
                      text: 'text-slate-700',
                      border: 'border-slate-200',
                    };
                    return (
                      <tr key={acc.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase ${styling.bg} ${styling.text} border ${styling.border}`}
                          >
                            {acc.platform}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{acc.accountName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{acc.username}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
                            {acc.accountType}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              acc.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                acc.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                              }`}
                            ></span>
                            {acc.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {acc.apiConnected ? (
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                Realtime API Active
                              </span>
                              <div className="text-[10px] text-slate-500">
                                {acc.followersCount.toLocaleString()} followers • {acc.engagementRate || '3.5%'}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic font-medium">
                              Analytics not connected
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={acc.profileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-[11px] font-medium flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                              <span>Open Profile</span>
                            </a>
                            <button
                              onClick={() => {
                                setEditingAccount(acc);
                                setAccountFormData({
                                  platform: acc.platform,
                                  accountName: acc.accountName,
                                  profileUrl: acc.profileUrl,
                                  username: acc.username,
                                  accountType: acc.accountType,
                                  status: acc.status,
                                  displayOrder: acc.displayOrder,
                                  description: acc.description || '',
                                });
                                setIsAccountModalOpen(true);
                              }}
                              className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100"
                              title="Edit Account"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleAccountStatus(acc.id)}
                              className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100"
                              title="Toggle Active/Inactive"
                            >
                              {acc.status === 'Active' ? (
                                <XCircle className="w-3.5 h-3.5 text-amber-600" />
                              ) : (
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteAccount(acc.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTENT MANAGER */}
      {subTab === 'content' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Multi-Platform Content Queue</h2>
              <p className="text-[11px] text-slate-500">
                Create, schedule, preview, and review posts destined for Facebook, Instagram, LinkedIn, X, and TikTok.
              </p>
            </div>
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Post</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            post.status === 'Published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : post.status === 'Scheduled'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {post.status}
                        </span>
                        {post.aiGenerated && (
                          <span className="flex items-center gap-1 text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded">
                            <Sparkles className="w-2.5 h-2.5" /> AI Generated
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mt-1.5">{post.title}</h3>
                    </div>

                    <div className="flex items-center gap-1">
                      {post.status !== 'Published' && (
                        <button
                          onClick={() => handlePublishNow(post.id)}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold"
                        >
                          Publish Now
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed whitespace-pre-line">
                    {post.caption}
                  </p>

                  {post.mediaUrl && (
                    <div className="mt-2.5 rounded-lg overflow-hidden border border-slate-200 max-h-36">
                      <img src={post.mediaUrl} alt="media" className="w-full h-36 object-cover" />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mt-3">
                    {post.platforms.map((p) => {
                      const styling = PLATFORM_COLORS[p] || { bg: 'bg-slate-100', text: 'text-slate-700' };
                      return (
                        <span
                          key={p}
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${styling.bg} ${styling.text}`}
                        >
                          {p}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {post.publishDate} at {post.publishTime}
                    </span>
                  </div>
                  <div>By: {post.authorName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AI CONTENT ASSISTANT */}
      {subTab === 'ai' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-900">AI Social Media Content Assistant</h2>
                <p className="text-[11px] text-slate-500">
                  Generate platform-optimized social campaigns for Facebook, Instagram, LinkedIn, X & TikTok.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Content Category</label>
                <select
                  value={aiTopicType}
                  onChange={(e) => setAiTopicType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="Topic">General Study Abroad Topic</option>
                  <option value="University">University Partner Spotlight</option>
                  <option value="Scholarship">Tuition Waiver & Scholarship</option>
                  <option value="Event">Education Expo / In-Office Open Day</option>
                  <option value="Campaign">Intake Countdown Campaign</option>
                  <option value="Article">Blog / Visa Article</option>
                  <option value="Video">Reels / Shorts Script</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject / Topic Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. Coventry University September 2026 Intake & IELTS Waivers"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Specifics</label>
                <textarea
                  value={aiDetails}
                  onChange={(e) => setAiDetails(e.target.value)}
                  rows={3}
                  placeholder="Highlight £3000 scholarship, MOI acceptance for English, free spot assessment at Sylhet office..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <button
                onClick={handleGenerateAI}
                disabled={aiIsGenerating || !aiTopic.trim()}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                {aiIsGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Crafting High-Conversion Copy...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Generate Multi-Platform Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Result Preview Panel */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Campaign Preview & Approval Workflow</h3>
                <p className="text-[11px] text-slate-500">
                  Review generated copy, fine-tune platform adjustments, and push to schedule.
                </p>
              </div>
            </div>

            {aiGeneratedResult ? (
              <div className="space-y-4">
                {/* Platform switcher */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['facebook', 'instagram', 'linkedin', 'x', 'tiktok', 'youtube'].map((plat) => (
                    <button
                      key={plat}
                      onClick={() => setPreviewPlatform(plat)}
                      className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all ${
                        previewPlatform === plat
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {plat}
                    </button>
                  ))}
                </div>

                {/* Platform specific preview */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 uppercase tracking-wider">{previewPlatform} Format</span>
                    <button
                      onClick={() => handleApproveAIToSchedule(previewPlatform)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Schedule</span>
                    </button>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                    {aiGeneratedResult[previewPlatform]?.caption ||
                      aiGeneratedResult[previewPlatform]?.description ||
                      aiGeneratedResult.masterCaption}
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono">
                    Hashtags: {aiGeneratedResult[previewPlatform]?.hashtags || aiGeneratedResult.hashtags}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 text-xs">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>Provide a topic on the left and click "Generate Multi-Platform Copy" to preview content.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: BLOG AUTOMATION */}
      {subTab === 'blog' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Blog Article to Social Media Automation</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any existing published COS Education article to automatically generate platform-specific
              promotional social campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Select Blog Article</label>
              <select
                value={selectedBlogId}
                onChange={(e) => setSelectedBlogId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="">-- Choose an article --</option>
                {blogs.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} ({b.category})
                  </option>
                ))}
              </select>

              <button
                onClick={handleGenerateFromBlog}
                disabled={blogIsGenerating || !selectedBlogId}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                {blogIsGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Article & Crafting Posts...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Create Social Posts</span>
                  </>
                )}
              </button>
            </div>

            <div className="md:col-span-2">
              {blogGeneratedResult ? (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 font-semibold">
                    {blogGeneratedResult.campaignHeadline}
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs">
                      <div className="font-bold text-blue-600 uppercase mb-1">Facebook Post Version</div>
                      <p className="whitespace-pre-line text-slate-700">{blogGeneratedResult.facebook}</p>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs">
                      <div className="font-bold text-pink-600 uppercase mb-1">Instagram Caption & Carousel</div>
                      <p className="whitespace-pre-line text-slate-700">{blogGeneratedResult.instagram}</p>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs">
                      <div className="font-bold text-sky-700 uppercase mb-1">LinkedIn Professional Article</div>
                      <p className="whitespace-pre-line text-slate-700">{blogGeneratedResult.linkedin}</p>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs">
                      <div className="font-bold text-slate-800 uppercase mb-1">YouTube Shorts / TikTok Script</div>
                      <p className="whitespace-pre-line text-slate-700">{blogGeneratedResult.youtubeShorts}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                  Select a blog post and click "Create Social Posts" to see generated social assets.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CALENDAR VIEW */}
      {subTab === 'calendar' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Social Media Content Calendar</h2>
              <p className="text-xs text-slate-500">Upcoming schedule and publication cadence.</p>
            </div>
          </div>

          <div className="space-y-2">
            {posts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-all bg-slate-50/50 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="font-mono text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded text-[11px]">
                    {p.publishDate} • {p.publishTime}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{p.title}</div>
                    <div className="text-[11px] text-slate-500">
                      Platforms: {p.platforms.join(', ')} • By: {p.authorName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'Published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD/EDIT ACCOUNT MODAL */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingAccount ? 'Edit Social Account' : 'Add Official Social Account'}
            </h3>

            <form onSubmit={handleSaveAccount} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Platform</label>
                <select
                  value={accountFormData.platform}
                  onChange={(e) => setAccountFormData({ ...accountFormData, platform: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="tiktok">TikTok</option>
                  <option value="x">X / Twitter</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telegram">Telegram</option>
                  <option value="threads">Threads</option>
                  <option value="pinterest">Pinterest</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Name</label>
                <input
                  type="text"
                  required
                  value={accountFormData.accountName}
                  onChange={(e) => setAccountFormData({ ...accountFormData, accountName: e.target.value })}
                  placeholder="e.g. COS Education Sylhet"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Profile URL</label>
                <input
                  type="url"
                  required
                  value={accountFormData.profileUrl}
                  onChange={(e) => setAccountFormData({ ...accountFormData, profileUrl: e.target.value })}
                  placeholder="https://facebook.com/..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Username / Handle</label>
                <input
                  type="text"
                  required
                  value={accountFormData.username}
                  onChange={(e) => setAccountFormData({ ...accountFormData, username: e.target.value })}
                  placeholder="@coseducationsylhet"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account Type</label>
                  <select
                    value={accountFormData.accountType}
                    onChange={(e) => setAccountFormData({ ...accountFormData, accountType: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Company">Company</option>
                    <option value="Branch">Branch</option>
                    <option value="Counsellor">Counsellor</option>
                    <option value="Campaign">Campaign</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={accountFormData.status}
                    onChange={(e) => setAccountFormData({ ...accountFormData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAccountModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE POST MODAL */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Create & Schedule Social Post</h3>

            <form onSubmit={handleSavePost} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Post Title</label>
                <input
                  type="text"
                  required
                  value={postFormData.title}
                  onChange={(e) => setPostFormData({ ...postFormData, title: e.target.value })}
                  placeholder="e.g. UK Pre-CAS Credibility Masterclass"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Caption / Body</label>
                <textarea
                  required
                  rows={4}
                  value={postFormData.caption}
                  onChange={(e) => setPostFormData({ ...postFormData, caption: e.target.value })}
                  placeholder="Write post content..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {['facebook', 'instagram', 'linkedin', 'x', 'tiktok'].map((p) => {
                    const isSelected = postFormData.platforms.includes(p);
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => {
                          const next = isSelected
                            ? postFormData.platforms.filter((x) => x !== p)
                            : [...postFormData.platforms, p];
                          setPostFormData({ ...postFormData, platforms: next });
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-bold uppercase transition-all ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Publish Date</label>
                  <input
                    type="date"
                    required
                    value={postFormData.publishDate}
                    onChange={(e) => setPostFormData({ ...postFormData, publishDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Publish Time</label>
                  <input
                    type="time"
                    required
                    value={postFormData.publishTime}
                    onChange={(e) => setPostFormData({ ...postFormData, publishTime: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Schedule Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
