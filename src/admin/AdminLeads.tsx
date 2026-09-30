import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Table as TableIcon,
  Columns as KanbanIcon,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  UserCheck,
  ChevronRight,
  MoreVertical,
  X,
  History,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Trash2,
  Edit3,
  BarChart2,
  Zap,
  Tag,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

export interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  country: string | null;
  program: string | null;
  academicQualification: string | null;
  cgpa: string | null;
  ielts: string | null;
  budget: string | null;
  intake: string | null;
  source: string;
  leadSourceCategory?: string | null;
  leadScore?: number | null;
  leadScoreSignals?: string[] | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  assignedCounsellorId: number | null;
  assignedCounsellorName: string | null;
  status: string;
  notes: string | null;
  followUpDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadHistoryItem {
  id: number;
  leadId: number;
  action: string;
  previousStatus: string | null;
  newStatus: string | null;
  notes: string | null;
  performedBy: string;
  createdAt: string;
}

export const PIPELINE_STAGES = [
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
];

interface AdminLeadsProps {
  isQuickAddOpen?: boolean;
  onCloseQuickAdd?: () => void;
}

export const AdminLeads: React.FC<AdminLeadsProps> = ({
  isQuickAddOpen = false,
  onCloseQuickAdd,
}) => {
  const { getAuthHeaders, user } = useAdminAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [counsellors, setCounsellors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedCounsellor, setSelectedCounsellor] = useState('all');
  const [selectedQualityTier, setSelectedQualityTier] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');
  const [selectedSourceCategory, setSelectedSourceCategory] = useState('all');

  // Lead Score Breakdown Modal
  const [selectedScoreLead, setSelectedScoreLead] = useState<Lead | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);

  const handleRecalculateScores = async () => {
    setIsRecalculating(true);
    try {
      const res = await fetch('/api/admin/leads/recalculate-scores', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        await fetchLeads();
      }
    } catch (err) {
      console.error('Failed to recalculate scores:', err);
    } finally {
      setIsRecalculating(false);
    }
  };

  // Lead Detail & History Drawer
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [leadHistory, setLeadHistory] = useState<LeadHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(isQuickAddOpen);
  const [newNoteText, setNewNoteText] = useState('');

  // New Lead Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCountry, setFormCountry] = useState('United Kingdom');
  const [formProgram, setFormProgram] = useState('');
  const [formQual, setFormQual] = useState('');
  const [formCgpa, setFormCgpa] = useState('');
  const [formIelts, setFormIelts] = useState('');
  const [formBudget, setFormBudget] = useState('');
  const [formIntake, setFormIntake] = useState('January 2027');
  const [formSource, setFormSource] = useState('Walk-in Office');
  const [formCounsellorId, setFormCounsellorId] = useState<string>('');
  const [formStatus, setFormStatus] = useState('New Lead');
  const [formNotes, setFormNotes] = useState('');
  const [formFollowUp, setFormFollowUp] = useState(new Date().toISOString().split('T')[0]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/leads', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
      const teamRes = await fetch('/api/admin/team', { headers: getAuthHeaders() });
      if (teamRes.ok) {
        const teamData = await teamRes.json();
        setCounsellors(teamData);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [user]);

  useEffect(() => {
    if (isQuickAddOpen) {
      setIsAddModalOpen(true);
    }
  }, [isQuickAddOpen]);

  // Open Lead Drawer and load history
  const handleOpenLeadDrawer = async (lead: Lead) => {
    setActiveLead(lead);
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/history`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const hist = await res.json();
        setLeadHistory(hist);
      }
    } catch (e) {
      console.error('Error fetching history:', e);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Update lead status
  const handleUpdateStatus = async (leadId: number, nextStatus: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: nextStatus,
          historyNote: `Lead moved to ${nextStatus}`,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
        if (activeLead && activeLead.id === leadId) {
          setActiveLead(updated);
          handleOpenLeadDrawer(updated);
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Assign counsellor
  const handleAssignCounsellor = async (leadId: number, counsellorId: number) => {
    const matched = counsellors.find((c) => c.id === counsellorId);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          assignedCounsellorId: counsellorId,
          assignedCounsellorName: matched ? matched.name : null,
          historyNote: `Assigned to counsellor: ${matched?.name}`,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
        if (activeLead?.id === leadId) {
          setActiveLead(updated);
        }
      }
    } catch (err) {
      console.error('Error assigning counsellor:', err);
    }
  };

  // Add note to active lead
  const handleAddNote = async () => {
    if (!activeLead || !newNoteText.trim()) return;
    try {
      const updatedNotes = activeLead.notes
        ? `${activeLead.notes}\n[${new Date().toLocaleDateString()}] ${newNoteText.trim()}`
        : `[${new Date().toLocaleDateString()}] ${newNoteText.trim()}`;

      const res = await fetch(`/api/admin/leads/${activeLead.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          notes: updatedNotes,
          historyNote: `Note added: "${newNoteText.trim()}"`,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setActiveLead(updated);
        setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
        setNewNoteText('');
        handleOpenLeadDrawer(updated);
      }
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  // Create manual lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone || !formEmail) return;

    const matchedCounsellor = counsellors.find((c) => c.id === Number(formCounsellorId));

    try {
      const res = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: formName,
          phone: formPhone,
          email: formEmail,
          country: formCountry,
          program: formProgram || null,
          academicQualification: formQual || null,
          cgpa: formCgpa || null,
          ielts: formIelts || null,
          budget: formBudget || null,
          intake: formIntake,
          source: formSource,
          assignedCounsellorId: matchedCounsellor ? matchedCounsellor.id : null,
          assignedCounsellorName: matchedCounsellor ? matchedCounsellor.name : null,
          status: formStatus,
          notes: formNotes || null,
          followUpDate: formFollowUp,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setLeads((prev) => [created, ...prev]);
        setIsAddModalOpen(false);
        if (onCloseQuickAdd) onCloseQuickAdd();
        // Reset form
        setFormName('');
        setFormPhone('');
        setFormEmail('');
        setFormProgram('');
        setFormQual('');
        setFormCgpa('');
        setFormIelts('');
        setFormBudget('');
        setFormNotes('');
      }
    } catch (err) {
      console.error('Error creating lead:', err);
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    if (selectedStatus !== 'all' && l.status !== selectedStatus) return false;
    if (selectedCountry !== 'all' && l.country !== selectedCountry) return false;
    if (selectedCounsellor !== 'all' && String(l.assignedCounsellorId) !== selectedCounsellor) return false;
    if (selectedQualityTier !== 'all') {
      const score = l.leadScore || 0;
      if (selectedQualityTier === 'hot' && score < 70) return false;
      if (selectedQualityTier === 'warm' && (score < 40 || score >= 70)) return false;
      if (selectedQualityTier === 'cold' && score >= 40) return false;
    }
    if (selectedSourceCategory !== 'all' && l.leadSourceCategory !== selectedSourceCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = l.name.toLowerCase().includes(q);
      const matchEmail = l.email.toLowerCase().includes(q);
      const matchPhone = l.phone.includes(q);
      const matchProgram = l.program ? l.program.toLowerCase().includes(q) : false;
      return matchName || matchEmail || matchPhone || matchProgram;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Leads & Admissions Pipeline</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
              {filteredLeads.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time inquiries from website forms, eligibility checks, social media, and office consultations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Recalculate Scores */}
          <button
            onClick={handleRecalculateScores}
            disabled={isRecalculating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            title="Recalculate lead quality scores based on qualification signals"
          >
            <Zap className={`w-3.5 h-3.5 text-amber-400 ${isRecalculating ? 'animate-spin' : ''}`} />
            <span>{isRecalculating ? 'Scoring...' : 'Recalculate Scores'}</span>
          </button>

          {/* Toggle View Mode */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              id="admin-leads-view-kanban-btn"
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KanbanIcon className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              id="admin-leads-view-table-btn"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          {/* Add Lead Button */}
          <button
            id="admin-leads-create-manual-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Search & Multi-Filters Toolbar */}
      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            id="admin-leads-search-input"
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Quality Score Tier */}
        <div>
          <select
            id="admin-leads-filter-quality"
            value={selectedQualityTier}
            onChange={(e) => setSelectedQualityTier(e.target.value as any)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
          >
            <option value="all">All Lead Quality</option>
            <option value="hot">🔥 Hot Score (70-100)</option>
            <option value="warm">⚡ Warm Score (40-69)</option>
            <option value="cold">❄️ Cold Score (0-39)</option>
          </select>
        </div>

        {/* Filter Source Category */}
        <div>
          <select
            id="admin-leads-filter-source"
            value={selectedSourceCategory}
            onChange={(e) => setSelectedSourceCategory(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Lead Sources</option>
            <option value="Website">Website</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="YouTube">YouTube</option>
            <option value="TikTok">TikTok</option>
            <option value="Google">Google</option>
            <option value="Referral">Referral</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Manual">Manual Entry</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Filter Country */}
        <div>
          <select
            id="admin-leads-filter-country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Destinations</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Finland">Finland</option>
            <option value="United States">United States</option>
            <option value="Malaysia">Malaysia</option>
            <option value="Malta">Malta</option>
            <option value="Greece">Greece</option>
            <option value="Cyprus">Cyprus</option>
          </select>
        </div>

        {/* Filter Status */}
        <div>
          <select
            id="admin-leads-filter-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Pipeline Stages</option>
            {PIPELINE_STAGES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Counsellor */}
        <div>
          <select
            id="admin-leads-filter-counsellor"
            value={selectedCounsellor}
            onChange={(e) => setSelectedCounsellor(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Counsellors</option>
            {counsellors.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* View 1: KANBAN PIPELINE VIEW */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto pb-6">
          <div className="flex gap-4 min-w-[2400px]">
            {PIPELINE_STAGES.map((stage) => {
              const stageLeads = filteredLeads.filter((l) => l.status === stage);

              return (
                <div
                  key={stage}
                  className="w-80 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 flex flex-col max-h-[750px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-1.5 py-1 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">{stage}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-bold">
                        {stageLeads.length}
                      </span>
                    </div>
                  </div>

                  {/* Cards container */}
                  <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
                    {stageLeads.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-slate-800/60 text-center text-[11px] text-slate-400">
                        No leads in this stage
                      </div>
                    ) : (
                      stageLeads.map((lead) => {
                        const score = lead.leadScore ?? 50;
                        const scoreColor =
                          score >= 70
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : score >= 40
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700';

                        return (
                          <div
                            key={lead.id}
                            onClick={() => handleOpenLeadDrawer(lead)}
                            className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer shadow-sm group"
                          >
                            <div className="flex items-start justify-between mb-1.5">
                              <span className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors">
                                {lead.name}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                                {lead.country || 'Global'}
                              </span>
                            </div>

                            {/* Lead Score & Source Category Badges */}
                            <div className="flex items-center gap-1.5 mb-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedScoreLead(lead);
                                }}
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold border flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity ${scoreColor}`}
                                title="Click to view AI score signals breakdown"
                              >
                                <Zap className="w-2.5 h-2.5 fill-current" />
                                <span>{score} pts</span>
                              </button>

                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-blue-300 border border-slate-700 font-mono truncate max-w-[120px]">
                                {lead.leadSourceCategory || lead.source}
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-400 truncate mb-2">
                              {lead.program || 'Inquiry'}
                            </div>

                            <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 mb-2.5 pt-1.5 border-t border-slate-800/60">
                              <div>CGPA: <span className="text-slate-300 font-semibold">{lead.cgpa || 'N/A'}</span></div>
                              <div>IELTS: <span className="text-slate-300 font-semibold">{lead.ielts || 'N/A'}</span></div>
                            </div>

                            {/* Footer with Counsellor & Date */}
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span className="flex items-center gap-1 text-slate-300">
                                <UserCheck className="w-3 h-3 text-emerald-400" />
                                <span className="truncate max-w-[120px]">
                                  {lead.assignedCounsellorName || 'Unassigned'}
                                </span>
                              </span>
                              <span className="text-slate-400">
                                {lead.followUpDate ? `Follow: ${lead.followUpDate.slice(5)}` : lead.intake}
                              </span>
                            </div>

                            {/* Quick Stage Mover Buttons */}
                            <div
                              className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <select
                                value={lead.status}
                                onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                                className="bg-slate-950 text-[10px] text-slate-300 border border-slate-800 rounded px-1.5 py-1 focus:outline-none focus:border-emerald-500"
                              >
                                {PIPELINE_STAGES.map((s) => (
                                  <option key={s} value={s}>
                                    Move: {s}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleOpenLeadDrawer(lead)}
                                className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
                              >
                                <span>Details</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 2: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Lead Score</th>
                  <th className="px-4 py-3">Attribution</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Destination & Program</th>
                  <th className="px-4 py-3">Qualifications</th>
                  <th className="px-4 py-3">Counsellor</th>
                  <th className="px-4 py-3">Pipeline Status</th>
                  <th className="px-4 py-3">Follow-up</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                      No leads match the specified criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const score = lead.leadScore ?? 50;
                    const scoreBadge =
                      score >= 70
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : score >= 40
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700';

                    return (
                      <tr
                        key={lead.id}
                        onClick={() => handleOpenLeadDrawer(lead)}
                        className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                      >
                        <td className="px-4 py-3 font-semibold text-white">
                          <div className="group-hover:text-emerald-400 transition-colors">{lead.name}</div>
                          <div className="text-[10px] text-slate-500 font-normal">Source: {lead.source}</div>
                        </td>

                        {/* Lead Score */}
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setSelectedScoreLead(lead)}
                            className={`px-2 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-opacity hover:opacity-80 ${scoreBadge}`}
                            title="Click to view AI score signals breakdown"
                          >
                            <Zap className="w-3 h-3 fill-current" />
                            <span>{score} pts</span>
                          </button>
                        </td>

                        {/* Attribution */}
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-blue-300 font-mono text-[11px] block max-w-[130px] truncate">
                            {lead.leadSourceCategory || 'Website'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono block truncate max-w-[130px] mt-0.5">
                            {lead.utmCampaign || 'organic'}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-slate-300">
                          <div>{lead.phone}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[150px]">{lead.email}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          <div className="font-medium text-slate-200">{lead.country || 'Not specified'}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                            {lead.program || 'General Inquiry'}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          <div>CGPA: {lead.cgpa || 'N/A'}</div>
                          <div className="text-[11px] text-slate-500">IELTS: {lead.ielts || 'N/A'}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          <div className="text-emerald-400 font-medium">{lead.assignedCounsellorName || 'Unassigned'}</div>
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                            className="bg-slate-900 text-xs text-slate-200 border border-slate-800 rounded px-2 py-1 focus:outline-none focus:border-emerald-500"
                          >
                            {PIPELINE_STAGES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                          {lead.followUpDate || '—'}
                        </td>
                        <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleOpenLeadDrawer(lead)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-medium text-xs transition-colors"
                          >
                            Drawer
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LEAD DETAIL & HISTORY DRAWER */}
      {activeLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-slate-950 border-l border-slate-800 h-full overflow-y-auto flex flex-col justify-between shadow-2xl p-6">
            <div>
              {/* Drawer Top */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Lead #{activeLead.id}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1">{activeLead.name}</h2>
                  <p className="text-xs text-slate-400">{activeLead.source} • Registered {new Date(activeLead.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  id="admin-lead-drawer-close"
                  onClick={() => setActiveLead(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Counsellor Controls */}
              <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Pipeline Stage</label>
                  <select
                    value={activeLead.status}
                    onChange={(e) => handleUpdateStatus(activeLead.id, e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Assigned Counsellor</label>
                  <select
                    value={activeLead.assignedCounsellorId || ''}
                    onChange={(e) => handleAssignCounsellor(activeLead.id, Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Unassigned</option>
                    {counsellors.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact & Academic Profile Grid */}
              <div className="space-y-4 text-xs">
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contact Coordinates</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>Phone: <span className="text-white font-medium">{activeLead.phone}</span></div>
                    <div>Email: <span className="text-white font-medium truncate">{activeLead.email}</span></div>
                    <div>Target Country: <span className="text-white font-medium">{activeLead.country || 'N/A'}</span></div>
                    <div>Target Intake: <span className="text-white font-medium">{activeLead.intake || 'N/A'}</span></div>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Academic Background & Testing</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>Qualification: <span className="text-white font-medium">{activeLead.academicQualification || 'N/A'}</span></div>
                    <div>CGPA / Result: <span className="text-white font-medium">{activeLead.cgpa || 'N/A'}</span></div>
                    <div>English Score: <span className="text-white font-medium">{activeLead.ielts || 'N/A'}</span></div>
                    <div>Annual Budget: <span className="text-white font-medium">{activeLead.budget || 'N/A'}</span></div>
                  </div>
                </div>

                {/* Notes and History */}
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 space-y-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Counsellor Notes</div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300 whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {activeLead.notes || 'No notes added yet.'}
                  </div>

                  {/* Add Note Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add follow-up notes or consultation remarks..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={handleAddNote}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-lg transition-colors"
                    >
                      Post Note
                    </button>
                  </div>
                </div>

                {/* Chronological Audit & History */}
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5" />
                      <span>Audit Trail & Activity Log</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{leadHistory.length} events</span>
                  </div>

                  <div className="space-y-2 mt-2 max-h-48 overflow-y-auto pr-1">
                    {loadingHistory ? (
                      <div className="text-center py-3 text-slate-500">Loading history...</div>
                    ) : leadHistory.length === 0 ? (
                      <div className="text-slate-500 text-center py-2">No history recorded yet.</div>
                    ) : (
                      leadHistory.map((item) => (
                        <div key={item.id} className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px]">
                          <div className="flex items-center justify-between text-slate-400 mb-0.5">
                            <span className="font-semibold text-emerald-400">{item.action}</span>
                            <span className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="text-slate-300">{item.notes}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">By: {item.performedBy}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-6">
              <button
                onClick={() => setActiveLead(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
              >
                Close Drawer
              </button>
              <div className="text-xs text-slate-400">
                Next Follow-up: <span className="text-white font-semibold">{activeLead.followUpDate || 'None set'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD MANUAL LEAD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Create New Lead</h3>
                <p className="text-xs text-slate-400">Add a walk-in, phone consultation, or direct student inquiry.</p>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  if (onCloseQuickAdd) onCloseQuickAdd();
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahfuzur Rahman"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+880 1712 000000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Destination</label>
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
                    <option value="Greece">Greece</option>
                    <option value="Cyprus">Cyprus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Interested Program</label>
                  <input
                    type="text"
                    placeholder="e.g. MSc Data Science"
                    value={formProgram}
                    onChange={(e) => setFormProgram(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Intake</label>
                  <select
                    value={formIntake}
                    onChange={(e) => setFormIntake(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="January 2027">January 2027</option>
                    <option value="May 2027">May 2027</option>
                    <option value="September 2027">September 2027</option>
                    <option value="October 2026">October 2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Academic Qualification</label>
                  <input
                    type="text"
                    placeholder="e.g. BBA, BSc CSE, HSC"
                    value={formQual}
                    onChange={(e) => setFormQual(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">CGPA / Score</label>
                  <input
                    type="text"
                    placeholder="e.g. 3.45 / 4.00"
                    value={formCgpa}
                    onChange={(e) => setFormCgpa(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">English Test (IELTS / PTE / MOI)</label>
                  <input
                    type="text"
                    placeholder="e.g. IELTS 6.5 or MOI eligible"
                    value={formIelts}
                    onChange={(e) => setFormIelts(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Estimated Budget</label>
                  <input
                    type="text"
                    placeholder="e.g. £14,000 / year"
                    value={formBudget}
                    onChange={(e) => setFormBudget(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Lead Source</label>
                  <select
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Walk-in Office">Walk-in Office</option>
                    <option value="Phone Consultation">Phone Consultation</option>
                    <option value="Website Consultation">Website Consultation</option>
                    <option value="Eligibility Checker">Eligibility Checker</option>
                    <option value="Facebook / Social Media">Facebook / Social Media</option>
                    <option value="University Fair / Seminar">University Fair / Seminar</option>
                    <option value="Referral">Student Referral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Assign Counsellor</label>
                  <select
                    value={formCounsellorId}
                    onChange={(e) => setFormCounsellorId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Auto-assign / Unassigned</option>
                    {counsellors.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.specialties?.[0] || 'Advisor'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Consultation Remarks & Notes</label>
                <textarea
                  rows={3}
                  placeholder="Details of student inquiry, sponsor holding details, preferred university choices..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    if (onCloseQuickAdd) onCloseQuickAdd();
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg shadow-md shadow-emerald-500/20"
                >
                  Save Lead Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Score & Qualification Signals Breakdown Modal */}
      {selectedScoreLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Lead Score & Readiness Analysis</h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Applicant: <strong className="text-white">{selectedScoreLead.name}</strong> ({selectedScoreLead.email})
                </p>
              </div>
              <button
                onClick={() => setSelectedScoreLead(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Score & Tier Banner */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Total Quality Score</span>
                <div className="text-3xl font-black text-white flex items-baseline gap-1">
                  <span
                    className={
                      (selectedScoreLead.leadScore ?? 50) >= 70
                        ? 'text-emerald-400'
                        : (selectedScoreLead.leadScore ?? 50) >= 40
                        ? 'text-amber-300'
                        : 'text-slate-400'
                    }
                  >
                    {selectedScoreLead.leadScore ?? 50}
                  </span>
                  <span className="text-sm text-slate-500 font-normal">/ 100</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block mb-1">Conversion Readiness</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    (selectedScoreLead.leadScore ?? 50) >= 70
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : (selectedScoreLead.leadScore ?? 50) >= 40
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {(selectedScoreLead.leadScore ?? 50) >= 70
                    ? '🔥 Hot Priority'
                    : (selectedScoreLead.leadScore ?? 50) >= 40
                    ? '⚡ Warm Inquirer'
                    : '❄️ Cold Lead'}
                </span>
              </div>
            </div>

            {/* Signals Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Contributing Qualification Signals:
              </h4>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {selectedScoreLead.leadScoreSignals && selectedScoreLead.leadScoreSignals.length > 0 ? (
                  selectedScoreLead.leadScoreSignals.map((signal, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs text-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{signal}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-xs text-slate-400 bg-slate-950 rounded-lg border border-slate-800">
                    Baseline lead inquiry recorded. Further academic and budget qualifications will increase score.
                  </div>
                )}
              </div>
            </div>

            {/* Marketing Attribution details */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-white text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                Attribution & Acquisition Origin:
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500">Source:</span>{' '}
                  <span className="font-mono text-blue-300">{selectedScoreLead.leadSourceCategory || selectedScoreLead.source}</span>
                </div>
                <div>
                  <span className="text-slate-500">Campaign:</span>{' '}
                  <span className="font-mono text-slate-300">{selectedScoreLead.utmCampaign || 'organic'}</span>
                </div>
              </div>
            </div>

            {/* Regulatory Safeguard Notice */}
            <div className="p-3.5 bg-slate-950 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 block font-semibold">Regulatory Safeguard:</strong>
                Do not automatically make sensitive or consequential decisions based solely on AI. Lead scoring is an assistive readiness indicator to help counsellors triage inquiries.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedScoreLead(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
