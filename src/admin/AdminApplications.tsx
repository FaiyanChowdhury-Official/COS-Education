import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Search,
  Plus,
  Building,
  GraduationCap,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Award,
  Stamp,
  Plane,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

export interface Application {
  id: number;
  studentId: number;
  studentName: string;
  universityId: number | null;
  universityName: string;
  programId: number | null;
  programName: string;
  country: string;
  intake: string;
  applicationDate: string;
  status: string;
  offerStatus: string | null;
  depositStatus: string | null;
  casStatus: string | null;
  visaStatus: string | null;
  notes: string | null;
  timeline: Array<{
    date: string;
    stage: string;
    note: string;
    status: 'completed' | 'current' | 'upcoming';
  }>;
  createdAt: string;
  updatedAt: string;
}

export const APPLICATION_STAGES = [
  'Application Submitted',
  'Conditional Offer',
  'Unconditional Offer',
  'Tuition Fee Payment',
  'CAS/Visa Document Issued',
  'Visa Applied',
  'Visa Decision',
  'Enrolled',
];

export const AdminApplications: React.FC = () => {
  const { getAuthHeaders, user } = useAdminAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Detail / Update Modal
  const [activeApp, setActiveApp] = useState<Application | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateStage, setUpdateStage] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');

  // Add Application Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formStudentId, setFormStudentId] = useState('');
  const [formUniName, setFormUniName] = useState('University of Hertfordshire');
  const [formProgName, setFormProgName] = useState('MSc International Business Management');
  const [formCountry, setFormCountry] = useState('United Kingdom');
  const [formIntake, setFormIntake] = useState('January 2027');
  const [formNotes, setFormNotes] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/applications', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
      const [stuRes, uniRes] = await Promise.all([
        fetch('/api/admin/students', { headers: getAuthHeaders() }),
        fetch('/api/admin/universities', { headers: getAuthHeaders() }),
      ]);
      if (stuRes.ok) setStudents(await stuRes.json());
      if (uniRes.ok) setUniversities(await uniRes.json());
    } catch (err) {
      console.error('Error loading applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const handleUpdateApplicationStatus = async () => {
    if (!activeApp || !updateStage) return;
    try {
      const nextTimeline = [
        ...(activeApp.timeline || []),
        {
          date: new Date().toISOString().split('T')[0],
          stage: updateStage,
          note: updateNotes || `Application advanced to ${updateStage}`,
          status: 'completed' as const,
        },
      ];

      const res = await fetch(`/api/admin/applications/${activeApp.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: updateStage,
          notes: updateNotes ? `${activeApp.notes || ''}\n[${new Date().toLocaleDateString()}] ${updateNotes}` : activeApp.notes,
          timeline: nextTimeline,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        setActiveApp(updated);
        setIsUpdateModalOpen(false);
        setUpdateNotes('');
      }
    } catch (err) {
      console.error('Error updating application:', err);
    }
  };

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchedStudent = students.find((s) => s.id === Number(formStudentId));
    if (!matchedStudent) return;

    try {
      const newApp = {
        studentId: matchedStudent.id,
        studentName: matchedStudent.fullName,
        universityName: formUniName,
        programName: formProgName,
        country: formCountry,
        intake: formIntake,
        applicationDate: new Date().toISOString().split('T')[0],
        status: 'Application Submitted',
        notes: formNotes || null,
        timeline: [
          {
            date: new Date().toISOString().split('T')[0],
            stage: 'Application Submitted',
            note: 'Application lodged through university partner admissions desk.',
            status: 'completed',
          },
        ],
      };

      const res = await fetch('/api/admin/applications', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newApp),
      });

      if (res.ok) {
        const created = await res.json();
        setApplications((prev) => [created, ...prev]);
        setIsAddModalOpen(false);
        setFormNotes('');
      }
    } catch (err) {
      console.error('Error creating app:', err);
    }
  };

  // Helper to determine stage index
  const getStageProgressIndex = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('enrolled')) return 7;
    if (s.includes('decision') || s.includes('approved') || s.includes('rejected')) return 6;
    if (s.includes('visa applied') || s.includes('vfs')) return 5;
    if (s.includes('cas') || s.includes('i-20') || s.includes('document issued')) return 4;
    if (s.includes('deposit') || s.includes('fee payment')) return 3;
    if (s.includes('unconditional')) return 2;
    if (s.includes('conditional offer') || s.includes('offer')) return 1;
    return 0; // Application Submitted
  };

  const filteredApps = applications.filter((a) => {
    if (selectedStatus !== 'all' && a.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.studentName.toLowerCase().includes(q) ||
        a.universityName.toLowerCase().includes(q) ||
        a.programName.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q)
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
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">University Application Tracker</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
              {filteredApps.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end tracking: submission, conditional offer, unconditional offer, deposit, CAS, and visa lodging.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student, university, program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Application Stages</option>
            {APPLICATION_STAGES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Cards List */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-slate-950 border border-slate-800 rounded-2xl">
            No applications match current filters.
          </div>
        ) : (
          filteredApps.map((app) => {
            const currentIdx = getStageProgressIndex(app.status);

            return (
              <div
                key={app.id}
                className="p-5 bg-slate-950 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all shadow-lg space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{app.studentName}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {app.country}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-medium mt-0.5">
                      {app.universityName} — <span className="text-slate-400">{app.programName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Intake: <span className="text-slate-300 font-semibold">{app.intake}</span> • Applied: {app.applicationDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {app.status}
                    </span>
                    <button
                      onClick={() => {
                        setActiveApp(app);
                        setUpdateStage(app.status);
                        setIsUpdateModalOpen(true);
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                    >
                      Update Stage
                    </button>
                  </div>
                </div>

                {/* 8-Step Visual Progress Tracker */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Application Milestone Roadmap
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2">
                    {APPLICATION_STAGES.map((stage, idx) => {
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div
                          key={stage}
                          className={`p-2 rounded-xl text-center flex flex-col items-center justify-center min-h-[64px] border transition-all ${
                            isCurrent
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                              : isCompleted
                              ? 'bg-slate-900 border-slate-700 text-slate-200'
                              : 'bg-slate-950/40 border-slate-850 text-slate-400 opacity-60'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black mb-1 ${
                            isCompleted ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {idx + 1}
                          </div>
                          <span className="text-[10px] font-medium leading-tight line-clamp-2">
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Notes & Timeline Snippet */}
                {app.notes && (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
                    <span className="font-semibold text-slate-400">Admissions Notes: </span>
                    {app.notes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* UPDATE STAGE MODAL */}
      {isUpdateModalOpen && activeApp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Advance Application Stage</h3>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Current Student & Institution</label>
                <div className="p-2.5 rounded bg-slate-900 text-white font-medium">
                  {activeApp.studentName} — {activeApp.universityName}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Milestone Stage</label>
                <select
                  value={updateStage}
                  onChange={(e) => setUpdateStage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  {APPLICATION_STAGES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Stage Note / Official Reference Number</label>
                <textarea
                  rows={3}
                  placeholder="e.g. CAS statement confirmed. CAS-UU-982341. Minimum fee deposit of £4,000 cleared."
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateApplicationStatus}
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg"
                >
                  Save Stage Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD APPLICATION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create University Application</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Student *</label>
                <select
                  required
                  value={formStudentId}
                  onChange={(e) => setFormStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Select an enrolled student...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.targetCountry || 'Student'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Destination Country</label>
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
                  <label className="block text-slate-300 font-medium mb-1">Target Intake</label>
                  <input
                    type="text"
                    value={formIntake}
                    onChange={(e) => setFormIntake(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">University Name *</label>
                <input
                  type="text"
                  required
                  value={formUniName}
                  onChange={(e) => setFormUniName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Program Name *</label>
                <input
                  type="text"
                  required
                  value={formProgName}
                  onChange={(e) => setFormProgName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Initial Application Remarks</label>
                <textarea
                  rows={2}
                  placeholder="Application portal ID, certified transcripts submission, SOP notes..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
