import React, { useState, useEffect } from 'react';
import {
  Video,
  Plus,
  ExternalLink,
  Copy,
  Send,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext';

export interface VideoConference {
  id: number;
  title: string;
  platform: 'zoom' | 'google-meet' | 'teams' | 'webex';
  meetingUrl: string;
  meetingId?: string;
  passcode?: string;
  hostName: string;
  hostEmail: string;
  counsellorId?: number;
  studentName?: string;
  studentEmail?: string;
  scheduledAt: string;
  durationMinutes: number;
  status: 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled';
  purpose: string;
  notes?: string;
  reminderSent: boolean;
}

const PLATFORM_BADGES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  zoom: { label: 'Zoom', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'google-meet': { label: 'Google Meet', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  teams: { label: 'Microsoft Teams', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  webex: { label: 'Cisco Webex', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
};

export const VideoConferencesTab: React.FC = () => {
  const { getAuthHeaders, user } = useAdminAuth();
  const [meetings, setMeetings] = useState<VideoConference[]>([]);
  const [loading, setLoading] = useState(true);
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<VideoConference | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    platform: 'zoom' as 'zoom' | 'google-meet' | 'teams' | 'webex',
    hostName: user.name || 'Tanvir Ahmed',
    hostEmail: user.email || 'counsellor.uk@cos-education.com',
    studentName: '',
    studentEmail: '',
    scheduledAt: new Date(Date.now() + 3600000 * 2).toISOString().slice(0, 16),
    durationMinutes: 45,
    purpose: 'Student Consultation',
    notes: '',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/communications/video-conferences', { headers: getAuthHeaders() });
      if (res.ok) setMeetings(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleSaveMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingMeeting ? 'PUT' : 'POST';
      const url = editingMeeting
        ? `/api/admin/communications/video-conferences/${editingMeeting.id}`
        : '/api/admin/communications/video-conferences';

      const res = await fetch(url, {
        method,
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast(editingMeeting ? 'Meeting updated.' : 'Video conference scheduled successfully!');
        setIsModalOpen(false);
        setEditingMeeting(null);
        fetchMeetings();
      }
    } catch (e) {
      showToast('Error saving meeting.');
    }
  };

  const handleCopyInvite = (meeting: VideoConference) => {
    const inviteText = `COS Education Video Consultation
Title: ${meeting.title}
Host: ${meeting.hostName}
Platform: ${PLATFORM_BADGES[meeting.platform]?.label || meeting.platform}
Date & Time: ${new Date(meeting.scheduledAt).toLocaleString()}
Join Link: ${meeting.meetingUrl}
${meeting.meetingId ? `Meeting ID: ${meeting.meetingId}` : ''}
${meeting.passcode ? `Passcode: ${meeting.passcode}` : ''}
    
Please join 5 minutes early with your academic documents ready.
COS Education Admissions Desk • Sylhet & Dhaka`;

    navigator.clipboard.writeText(inviteText);
    showToast('Meeting invitation details copied to clipboard!');
  };

  const handleSendReminder = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/communications/video-conferences/${id}/send-reminder`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        showToast(data.message || 'Reminder dispatched.');
        fetchMeetings();
      }
    } catch (e) {
      showToast('Failed to dispatch reminder.');
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/communications/video-conferences/${id}/status`, {
        method: 'PATCH',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showToast(`Meeting status marked as ${status}.`);
        fetchMeetings();
      }
    } catch (e) {
      showToast('Failed to update status.');
    }
  };

  const handleDeleteMeeting = async (id: number) => {
    if (!window.confirm('Delete this video conference?')) return;
    try {
      await fetch(`/api/admin/communications/video-conferences/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      showToast('Meeting deleted.');
      fetchMeetings();
    } catch (e) {
      showToast('Error deleting meeting.');
    }
  };

  const filtered = meetings.filter((m) => {
    const matchesPlatform = platformFilter === 'all' || m.platform === platformFilter;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.studentName && m.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.hostName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

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
            <Video className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Video Conference Management</h1>
            <p className="text-xs text-slate-500">
              Manage student virtual consultations, partner webinars & credibility interview mocks via Zoom, Meet, Teams & Webex.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingMeeting(null);
            setFormData({
              title: '',
              platform: 'zoom',
              hostName: user.name || 'Tanvir Ahmed',
              hostEmail: user.email || 'counsellor.uk@cos-education.com',
              studentName: '',
              studentEmail: '',
              scheduledAt: new Date(Date.now() + 3600000 * 2).toISOString().slice(0, 16),
              durationMinutes: 45,
              purpose: 'Student Consultation',
              notes: '',
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule Video Conference</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-slate-500 font-medium mr-1">Platform:</span>
          {['all', 'zoom', 'google-meet', 'teams', 'webex'].map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all ${
                platformFilter === p
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p === 'all' ? 'All Providers' : PLATFORM_BADGES[p]?.label || p}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by title, student, or host..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Conferences List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((m) => {
          const badge = PLATFORM_BADGES[m.platform] || {
            label: m.platform,
            bg: 'bg-slate-100',
            text: 'text-slate-700',
            border: 'border-slate-200',
          };
          const isPast = new Date(m.scheduledAt) < new Date();

          return (
            <div
              key={m.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {badge.label}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          m.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : m.status === 'Cancelled'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-1.5">{m.title}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyInvite(m)}
                      title="Copy Invitation"
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMeeting(m.id)}
                      title="Delete"
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Attendee / Student</span>
                    <span className="font-medium text-slate-800">{m.studentName || 'Open Session'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Host Counsellor</span>
                    <span className="font-medium text-slate-800">{m.hostName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Scheduled Date & Time</span>
                    <span className="font-medium text-slate-800">
                      {new Date(m.scheduledAt).toLocaleDateString()} at{' '}
                      {new Date(m.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Duration</span>
                    <span className="font-medium text-slate-800">{m.durationMinutes} Minutes</span>
                  </div>
                </div>

                {m.notes && <p className="text-xs text-slate-500 italic bg-amber-50/50 p-2 rounded border border-amber-100">{m.notes}</p>}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={m.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Meeting</span>
                  </a>

                  <button
                    onClick={() => handleSendReminder(m.id)}
                    className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs font-medium flex items-center gap-1"
                  >
                    <Send className="w-3 h-3 text-slate-500" />
                    <span>Send Reminder</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {m.status !== 'Completed' && (
                    <button
                      onClick={() => handleStatusChange(m.id, 'Completed')}
                      className="text-[11px] text-emerald-700 hover:underline font-semibold"
                    >
                      Complete
                    </button>
                  )}
                  {m.status !== 'Cancelled' && (
                    <button
                      onClick={() => handleStatusChange(m.id, 'Cancelled')}
                      className="text-[11px] text-rose-600 hover:underline font-semibold ml-2"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SCHEDULE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingMeeting ? 'Edit Video Conference' : 'Schedule Video Conference'}
            </h3>

            <form onSubmit={handleSaveMeeting} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meeting Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Coventry University Pre-CAS Credibility Mock"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Platform Provider</label>
                  <select
                    value={formData.platform}
                    onChange={(e: any) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="zoom">Zoom</option>
                    <option value="google-meet">Google Meet</option>
                    <option value="teams">Microsoft Teams</option>
                    <option value="webex">Cisco Webex</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Min)</label>
                  <input
                    type="number"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student / Attendee</label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="Student Name"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Email</label>
                  <input
                    type="email"
                    value={formData.studentEmail}
                    onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                    placeholder="student@example.com"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Purpose / Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Key discussion points, visa interview prep, or bank solvency review..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                />
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
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
