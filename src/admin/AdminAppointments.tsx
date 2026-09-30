import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Search,
  Plus,
  Clock,
  Calendar,
  MapPin,
  Video,
  UserCheck,
  CheckCircle2,
  X,
  Edit3,
  Phone,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

export interface Appointment {
  id: number;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredCountry: string | null;
  preferredDegree: string | null;
  mode: 'In-person Office' | 'Online Video Call';
  preferredDate: string;
  preferredTime: string;
  assignedCounsellorId: number | null;
  assignedCounsellorName: string | null;
  status: 'New' | 'Confirmed' | 'Completed' | 'Cancelled';
  counsellingNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export const AdminAppointments: React.FC = () => {
  const { getAuthHeaders, user } = useAdminAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [counsellors, setCounsellors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [activeAppt, setActiveAppt] = useState<Appointment | null>(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [notesText, setNotesText] = useState('');

  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCountry, setFormCountry] = useState('United Kingdom');
  const [formDegree, setFormDegree] = useState('Master');
  const [formMode, setFormMode] = useState<'In-person Office' | 'Online Video Call'>('In-person Office');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formTime, setFormTime] = useState('11:00 AM');
  const [formCounsellorId, setFormCounsellorId] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/appointments', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
      const teamRes = await fetch('/api/admin/team', { headers: getAuthHeaders() });
      if (teamRes.ok) setCounsellors(await teamRes.json());
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const handleUpdateStatus = async (apptId: number, status: 'New' | 'Confirmed' | 'Completed' | 'Cancelled') => {
    try {
      const res = await fetch(`/api/admin/appointments/${apptId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setAppointments((prev) => prev.map((a) => (a.id === apptId ? updated : a)));
      }
    } catch (e) {
      console.error('Error updating appointment status:', e);
    }
  };

  const handleSaveNotes = async () => {
    if (!activeAppt) return;
    try {
      const updatedNotes = activeAppt.counsellingNotes
        ? `${activeAppt.counsellingNotes}\n[${new Date().toLocaleDateString()}] ${notesText.trim()}`
        : `[${new Date().toLocaleDateString()}] ${notesText.trim()}`;

      const res = await fetch(`/api/admin/appointments/${activeAppt.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ counsellingNotes: updatedNotes }),
      });
      if (res.ok) {
        const updated = await res.json();
        setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        setIsNotesModalOpen(false);
        setNotesText('');
        setActiveAppt(null);
      }
    } catch (e) {
      console.error('Error saving notes:', e);
    }
  };

  const handleReschedule = async () => {
    if (!activeAppt || !newDate || !newTime) return;
    try {
      const res = await fetch(`/api/admin/appointments/${activeAppt.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          preferredDate: newDate,
          preferredTime: newTime,
          status: 'Confirmed',
          counsellingNotes: `${activeAppt.counsellingNotes || ''}\n[Rescheduled to ${newDate} at ${newTime}]`,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        setIsRescheduleModalOpen(false);
        setActiveAppt(null);
      }
    } catch (e) {
      console.error('Error rescheduling:', e);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchedCounsellor = counsellors.find((c) => c.id === Number(formCounsellorId));
    try {
      const res = await fetch('/api/admin/appointments', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          studentName: formName,
          studentEmail: formEmail,
          studentPhone: formPhone,
          preferredCountry: formCountry,
          preferredDegree: formDegree,
          mode: formMode,
          preferredDate: formDate,
          preferredTime: formTime,
          assignedCounsellorId: matchedCounsellor ? matchedCounsellor.id : null,
          assignedCounsellorName: matchedCounsellor ? matchedCounsellor.name : null,
          status: 'Confirmed',
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setAppointments((prev) => [created, ...prev]);
        setIsBookModalOpen(false);
        setFormName('');
        setFormEmail('');
        setFormPhone('');
      }
    } catch (e) {
      console.error('Error booking appointment:', e);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredAppts = appointments.filter((a) => {
    const isPast = a.preferredDate < todayStr || a.status === 'Completed' || a.status === 'Cancelled';
    if (tab === 'upcoming' && isPast) return false;
    if (tab === 'past' && !isPast) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.studentName.toLowerCase().includes(q) ||
        a.studentEmail.toLowerCase().includes(q) ||
        a.studentPhone.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Counselling Sessions & Appointments</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
              {filteredAppts.length} Sessions
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            In-person Sylhet office consultations and global online video advisory appointments.
          </p>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Tabs & Search Toolbar */}
      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setTab('upcoming')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              tab === 'upcoming' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Upcoming & Scheduled
          </button>
          <button
            onClick={() => setTab('past')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              tab === 'past' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Past & Completed
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAppts.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-slate-500 bg-slate-950 border border-slate-800 rounded-2xl">
            No {tab} appointments found.
          </div>
        ) : (
          filteredAppts.map((appt) => (
            <div
              key={appt.id}
              className="p-5 bg-slate-950 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all shadow-md space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{appt.studentName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      appt.status === 'Confirmed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : appt.status === 'Completed'
                        ? 'bg-blue-500/20 text-blue-300'
                        : appt.status === 'Cancelled'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Target: {appt.preferredCountry || 'Global'} • {appt.preferredDegree || 'Master'}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  {appt.mode.includes('Online') ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                  <span>{appt.mode}</span>
                </div>
              </div>

              {/* Date, Time & Counsellor */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{appt.preferredDate} ({appt.preferredTime})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{appt.assignedCounsellorName || 'Admissions Team'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{appt.studentPhone}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{appt.studentEmail}</span>
                </div>
              </div>

              {/* Notes snippet */}
              {appt.counsellingNotes && (
                <div className="p-2.5 bg-slate-900/40 rounded-lg text-xs text-slate-300 border border-slate-800/60">
                  <span className="font-semibold text-slate-400">Notes: </span>
                  {appt.counsellingNotes}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveAppt(appt);
                      setNotesText('');
                      setIsNotesModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    Add Note
                  </button>
                  <button
                    onClick={() => {
                      setActiveAppt(appt);
                      setNewDate(appt.preferredDate);
                      setNewTime(appt.preferredTime);
                      setIsRescheduleModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    Reschedule
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {appt.status !== 'Completed' && (
                    <button
                      onClick={() => handleUpdateStatus(appt.id, 'Completed')}
                      className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-medium transition-colors"
                    >
                      Complete
                    </button>
                  )}
                  {appt.status !== 'Cancelled' && (
                    <button
                      onClick={() => handleUpdateStatus(appt.id, 'Cancelled')}
                      className="px-2 py-1 rounded text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD NOTE MODAL */}
      {isNotesModalOpen && activeAppt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Add Counselling Notes</h3>
            <p className="text-xs text-slate-400 mb-4">Student: {activeAppt.studentName}</p>

            <textarea
              rows={4}
              placeholder="Record points discussed: university recommendations, scholarship eligibility, document gaps..."
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            ></textarea>

            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                onClick={() => setIsNotesModalOpen(false)}
                className="px-3.5 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-lg"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {isRescheduleModalOpen && activeAppt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Reschedule Session</h3>
            <p className="text-xs text-slate-400 mb-4">Student: {activeAppt.studentName}</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">New Time Slot</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setIsRescheduleModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReschedule}
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg"
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOOK APPOINTMENT MODAL */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Book Free Consultation Session</h3>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Naimul Islam"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Country</label>
                  <select
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Finland">Finland</option>
                    <option value="United States">United States</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Malta">Malta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Consultation Mode</label>
                  <select
                    value={formMode}
                    onChange={(e) => setFormMode(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="In-person Office">In-person (Sylhet Office)</option>
                    <option value="Online Video Call">Online Video Call (Google Meet)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Time Slot</label>
                  <select
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Assign Counsellor</label>
                <select
                  value={formCounsellorId}
                  onChange={(e) => setFormCounsellorId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Any Available Specialist</option>
                  {counsellors.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg"
                >
                  Book Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
