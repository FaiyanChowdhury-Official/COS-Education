import React, { useState, useEffect } from 'react';
import {
  Link2,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Globe,
  MapPin,
  Tag,
  Check
} from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext';

export interface SocialLinkItem {
  id: number;
  platform: string;
  label: string;
  url: string;
  branchLocation: string;
  placements: string[];
  displayOrder: number;
  active: boolean;
}

export const SocialLinksTab: React.FC = () => {
  const { getAuthHeaders } = useAdminAuth();
  const [links, setLinks] = useState<SocialLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLinkItem | null>(null);

  const [formData, setFormData] = useState({
    platform: 'facebook',
    label: '',
    url: '',
    branchLocation: 'Global',
    placements: ['footer'],
    displayOrder: 0,
    active: true,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/communications/social-links', { headers: getAuthHeaders() });
      if (res.ok) setLinks(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingLink ? 'PUT' : 'POST';
      const url = editingLink
        ? `/api/admin/communications/social-links/${editingLink.id}`
        : '/api/admin/communications/social-links';

      const res = await fetch(url, {
        method,
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast(editingLink ? 'Social link updated.' : 'Social link created.');
        setIsModalOpen(false);
        setEditingLink(null);
        fetchLinks();
      }
    } catch (e) {
      showToast('Error saving social link.');
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/communications/social-links/${id}/toggle`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        showToast('Link visibility toggled.');
        fetchLinks();
      }
    } catch (e) {
      showToast('Failed to toggle status.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this social link?')) return;
    try {
      await fetch(`/api/admin/communications/social-links/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      showToast('Social link removed.');
      fetchLinks();
    } catch (e) {
      showToast('Error deleting link.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Link2 className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Public Website & Branch Social Links</h1>
            <p className="text-xs text-slate-500">
              Control the social links, hotlines, and channels displayed across the public portal header, footer, floating widget, and branch directories.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingLink(null);
            setFormData({
              platform: 'facebook',
              label: '',
              url: '',
              branchLocation: 'Global',
              placements: ['footer'],
              displayOrder: links.length + 1,
              active: true,
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Social Link</span>
        </button>
      </div>

      {/* Links List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Active Social Link Directory ({links.length})</h2>
          <span className="text-[11px] text-slate-500">
            {links.filter((l) => l.active).length} links active on public site
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {links.map((link) => (
            <div key={link.id} className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold uppercase text-[10px]">
                    {link.platform}
                  </span>
                  <span className="font-semibold text-slate-900">{link.label}</span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.2 rounded border border-slate-200">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{link.branchLocation}</span>
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 font-mono truncate max-w-lg">
                  {link.url}
                </div>

                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Visibility:</span>
                  {(link.placements || []).map((p) => (
                    <span key={p} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100"
                  title="Open Link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => {
                    setEditingLink(link);
                    setFormData({
                      platform: link.platform,
                      label: link.label,
                      url: link.url,
                      branchLocation: link.branchLocation,
                      placements: link.placements || ['footer'],
                      displayOrder: link.displayOrder,
                      active: link.active,
                    });
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100"
                  title="Edit Link"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleToggle(link.id)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold ${
                    link.active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {link.active ? 'Active' : 'Disabled'}
                </button>

                <button
                  onClick={() => handleDelete(link.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingLink ? 'Edit Public Social Link' : 'Add Public Social Link'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Platform</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="tiktok">TikTok</option>
                  <option value="telegram">Telegram</option>
                  <option value="x">X / Twitter</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Label / Title</label>
                <input
                  type="text"
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g. Head Office WhatsApp Hotline"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target URL</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://wa.me/8801572231717"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Branch Location</label>
                  <select
                    value={formData.branchLocation}
                    onChange={(e) => setFormData({ ...formData, branchLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Global">Global / All</option>
                    <option value="Sylhet">Sylhet Head Office</option>
                    <option value="Dhaka">Dhaka Regional Centre</option>
                    <option value="Chittagong">Chittagong Branch</option>
                    <option value="London">London Liaison</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Portal Placements</label>
                <div className="flex flex-wrap gap-2">
                  {['header', 'footer', 'widget', 'contact'].map((p) => {
                    const isSelected = formData.placements.includes(p);
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => {
                          const next = isSelected
                            ? formData.placements.filter((x) => x !== p)
                            : [...formData.placements, p];
                          setFormData({ ...formData, placements: next });
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

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
