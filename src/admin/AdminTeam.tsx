import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  Search,
  Plus,
  Mail,
  Phone,
  CheckCircle2,
  X,
  Activity,
  Award,
  Globe,
  Trash2,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

export const AdminTeam: React.FC = () => {
  const { getAuthHeaders, user } = useAdminAuth();
  const [counsellors, setCounsellors] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Counsellor Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('+880 1572 231717');
  const [formRole, setFormRole] = useState<'admin' | 'counsellor'>('counsellor');
  const [formDest, setFormDest] = useState('UK & Ireland');

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const [cRes, lRes] = await Promise.all([
        fetch('/api/admin/team', { headers: getAuthHeaders() }),
        fetch('/api/admin/activity-logs', { headers: getAuthHeaders() }),
      ]);
      if (cRes.ok) setCounsellors(await cRes.json());
      if (lRes.ok) setActivityLogs(await lRes.json());
    } catch (e) {
      console.error('Error fetching team data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [user]);

  const handleAddCounsellor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          phone: formPhone,
          role: formRole,
          specialisation: formDest,
          activeStudentsCount: 0,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setCounsellors((prev) => [created, ...prev]);
        setIsModalOpen(false);
        setFormName('');
        setFormEmail('');
      }
    } catch (e) {
      console.error('Error adding counsellor:', e);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Staff & Counsellor Management</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
              {counsellors.length} Team Members
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage regional destination specialists, assign student caseloads, and audit team activity logs.
          </p>
        </div>

        {user.role === 'admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        )}
      </div>

      {/* Counsellors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {counsellors.map((c) => (
          <div
            key={c.id}
            className="p-5 bg-slate-950 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all shadow-md space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{c.name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      c.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {c.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-emerald-400" />
                    <span>{c.specialisation || 'Global Admissions'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs space-y-1 text-slate-300">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{c.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{c.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
              <span className="text-slate-400">Active Students:</span>
              <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                {c.activeStudentsCount || 12} Students
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Logs Section */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              System Audit & Activity Logs
            </h2>
          </div>
          <span className="text-xs text-slate-500">Live Real-time Feed</span>
        </div>

        <div className="space-y-3">
          {activityLogs.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-4">No recent activity logged.</div>
          ) : (
            activityLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between text-xs p-3 rounded-xl bg-slate-900/50 border border-slate-800/70"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{log.actorName}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-1">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ADD COUNSELLOR MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Team Member</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCounsellor} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">System Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="counsellor">Counsellor</option>
                    <option value="admin">Admin Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Destination Focus</label>
                  <select
                    value={formDest}
                    onChange={(e) => setFormDest(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="UK & Ireland">UK & Ireland</option>
                    <option value="USA & Canada">USA & Canada</option>
                    <option value="Finland & Schengen">Finland & Schengen</option>
                    <option value="Malaysia & Asia">Malaysia & Asia</option>
                    <option value="All Destinations">All Destinations</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
