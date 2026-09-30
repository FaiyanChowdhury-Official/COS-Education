import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { COSLogo } from '../components/COSLogo';
import {
  UserCheck,
  Users,
  UserPlus,
  FileCheck2,
  Building,
  Calendar,
  CheckSquare,
  Clock,
  MessageSquare,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock3,
  Send,
  LogOut,
  Edit2,
  Trash2,
  FileText,
  Download,
  Check,
  Shield,
  Briefcase
} from 'lucide-react';

interface CounsellorPortalProps {
  onNavigate: (route: string, param?: string) => void;
  initialTab?: string;
}

export const CounsellorPortal: React.FC<CounsellorPortalProps> = ({ onNavigate, initialTab = 'overview' }) => {
  const { user, logout, getAuthHeaders } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>(initialTab);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Student Detail Modal/Drawer
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedStudentData, setSelectedStudentData] = useState<any>(null);
  const [isLoadingStudentDetail, setIsLoadingStudentDetail] = useState(false);

  // Document Verification Modal
  const [verifyingDoc, setVerifyingDoc] = useState<any | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'Verified' | 'Rejected' | 'Under Review'>('Verified');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);

  // Application Stage/Status Edit Modal
  const [editingApp, setEditingApp] = useState<any | null>(null);
  const [appStatus, setAppStatus] = useState('');
  const [appOfferStatus, setAppOfferStatus] = useState('');
  const [appDepositStatus, setAppDepositStatus] = useState('');
  const [appDepositAmount, setAppDepositAmount] = useState('');
  const [appCasStatus, setAppCasStatus] = useState('');
  const [appCasReference, setAppCasReference] = useState('');
  const [appVisaStatus, setAppVisaStatus] = useState('');
  const [appStageNotes, setAppStageNotes] = useState('');
  const [isSubmittingAppStatus, setIsSubmittingAppStatus] = useState(false);

  // Task Creation Modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskStudentId, setTaskStudentId] = useState<string>('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskDescription, setTaskDescription] = useState('');
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  // Follow-up Creation Modal
  const [isFollowupModalOpen, setIsFollowupModalOpen] = useState(false);
  const [followupType, setFollowupType] = useState('Call');
  const [followupStudentId, setFollowupStudentId] = useState<string>('');
  const [followupDate, setFollowupDate] = useState('');
  const [followupTime, setFollowupTime] = useState('11:00 AM');
  const [followupNotes, setFollowupNotes] = useState('');
  const [isSubmittingFollowup, setIsSubmittingFollowup] = useState(false);

  // Counsellor Chat with Student
  const [activeChatStudentId, setActiveChatStudentId] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newChatText, setNewChatText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch Counsellor Dashboard Data
  const fetchCounsellorData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/counsellor/dashboard', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Failed to load counsellor dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCounsellorData();
  }, [user]);

  // Load detailed student data when opening drawer
  const openStudentDetail = async (studentId: number) => {
    setSelectedStudentId(studentId);
    setIsLoadingStudentDetail(true);
    try {
      const res = await fetch(`/api/counsellor/students/${studentId}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedStudentData(data);
      }
    } catch (err) {
      console.error('Failed to load student details:', err);
    } finally {
      setIsLoadingStudentDetail(false);
    }
  };

  // Document Verification Action
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingDoc) return;

    setIsSubmittingVerification(true);
    try {
      const res = await fetch(`/api/counsellor/documents/${verifyingDoc.id}/verify`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: verificationStatus,
          verificationNotes,
        }),
      });

      if (res.ok) {
        setVerifyingDoc(null);
        setVerificationNotes('');
        fetchCounsellorData();
        if (selectedStudentId) openStudentDetail(selectedStudentId);
      }
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setIsSubmittingVerification(false);
    }
  };

  // Application Status Update Action
  const handleAppStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    setIsSubmittingAppStatus(true);
    try {
      const res = await fetch(`/api/counsellor/applications/${editingApp.id}/status`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: appStatus,
          offerStatus: appOfferStatus,
          depositStatus: appDepositStatus,
          depositAmount: appDepositAmount,
          casStatus: appCasStatus,
          casReference: appCasReference,
          visaStatus: appVisaStatus,
          stageNotes: appStageNotes,
        }),
      });

      if (res.ok) {
        setEditingApp(null);
        fetchCounsellorData();
        if (selectedStudentId) openStudentDetail(selectedStudentId);
      }
    } catch (err) {
      console.error('App status update error:', err);
    } finally {
      setIsSubmittingAppStatus(false);
    }
  };

  // Task Creation
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskDueDate) return;

    setIsSubmittingTask(true);
    try {
      const res = await fetch('/api/counsellor/tasks', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskTitle,
          studentId: taskStudentId || null,
          dueDate: taskDueDate,
          priority: taskPriority,
          description: taskDescription,
        }),
      });

      if (res.ok) {
        setIsTaskModalOpen(false);
        setTaskTitle('');
        setTaskDueDate('');
        setTaskDescription('');
        fetchCounsellorData();
      }
    } catch (err) {
      console.error('Create task error:', err);
    } finally {
      setIsSubmittingTask(false);
    }
  };

  // Toggle Task Status
  const handleToggleTaskStatus = async (task: any) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await fetch(`/api/counsellor/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchCounsellorData();
    } catch (err) {
      console.error('Toggle task error:', err);
    }
  };

  // Follow-up Creation
  const handleCreateFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followupDate || !followupType) return;

    setIsSubmittingFollowup(true);
    try {
      const res = await fetch('/api/counsellor/followups', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: followupType,
          studentId: followupStudentId || null,
          scheduledDate: followupDate,
          scheduledTime: followupTime,
          notes: followupNotes,
        }),
      });

      if (res.ok) {
        setIsFollowupModalOpen(false);
        setFollowupDate('');
        setFollowupNotes('');
        fetchCounsellorData();
      }
    } catch (err) {
      console.error('Create follow-up error:', err);
    } finally {
      setIsSubmittingFollowup(false);
    }
  };

  // Toggle Followup Done
  const handleToggleFollowup = async (follow: any) => {
    const nextStatus = follow.status === 'Completed' ? 'Scheduled' : 'Completed';
    try {
      await fetch(`/api/counsellor/followups/${follow.id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchCounsellorData();
    } catch (err) {
      console.error('Toggle followup error:', err);
    }
  };

  // Appointment Status Update
  const handleUpdateAppointmentStatus = async (apptId: number, newStatus: string) => {
    try {
      await fetch(`/api/counsellor/appointments/${apptId}/status`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchCounsellorData();
    } catch (err) {
      console.error('Appt status error:', err);
    }
  };

  // Load chat messages when opening student chat
  const openStudentChat = (studentId: number) => {
    setActiveChatStudentId(studentId);
    fetch(`/api/counsellor/messages/${studentId}`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => {
        setChatMessages(Array.isArray(data) ? data : []);
        setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      });
  };

  const handleSendCounsellorMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatStudentId || !newChatText.trim()) return;

    try {
      const res = await fetch(`/api/counsellor/messages/${activeChatStudentId}`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newChatText.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, data.message]);
        setNewChatText('');
        setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  const stats = dashboardData?.stats || {};
  const counsellor = dashboardData?.counsellor || {};
  const assignedStudents = dashboardData?.assignedStudents || [];
  const assignedLeads = dashboardData?.assignedLeads || [];
  const pendingDocuments = dashboardData?.pendingDocuments || [];
  const activeApplications = dashboardData?.activeApplications || [];
  const tasks = dashboardData?.tasks || [];
  const followups = dashboardData?.followups || [];
  const appointments = dashboardData?.appointments || [];

  // Filter students based on search query
  const filteredStudents = assignedStudents.filter((s: any) => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading && !dashboardData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Loading Counsellor Desk...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased portal-white-theme">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <COSLogo className="h-8 w-auto" />
              <div className="pl-2 border-l border-slate-200">
                <span className="font-bold text-xs sm:text-sm text-slate-900 block tracking-tight">Counsellor Portal</span>
                <span className="text-[10px] text-blue-600 font-mono block -mt-0.5">
                  Admissions Desk • Sylhet Branch
                </span>
              </div>
            </button>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {counsellor.role || 'Senior Admissions Counsellor'}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick Link to Student Portal */}
            <div className="hidden md:flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <span>View:</span>
              <button
                onClick={() => onNavigate('student-portal')}
                className="text-blue-600 hover:text-blue-700 font-medium underline cursor-pointer"
              >
                Student Portal
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigate('admin')}
                className="text-indigo-600 hover:text-indigo-700 font-medium underline cursor-pointer"
              >
                Admin CRM
              </button>
            </div>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <img
                src={counsellor.photo || user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'}
                alt={counsellor.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden lg:block text-left text-xs">
                <div className="font-semibold text-slate-900 leading-tight">{counsellor.name || user?.name}</div>
                <div className="text-slate-500 text-[11px]">{counsellor.email || user?.email}</div>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                onNavigate('login');
              }}
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Counsellor Tab Bar */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs sm:text-sm font-medium border-t border-slate-200 pt-2">
          {[
            { id: 'overview', label: 'Dashboard', icon: UserCheck },
            { id: 'students', label: 'Assigned Students', icon: Users, badge: assignedStudents.length },
            { id: 'leads', label: 'Assigned Leads', icon: UserPlus, badge: assignedLeads.length },
            { id: 'documents', label: 'Document Review', icon: FileCheck2, badge: stats.pendingDocumentsCount > 0 ? stats.pendingDocumentsCount : undefined, badgeColor: 'bg-amber-100 text-amber-800' },
            { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: stats.pendingTasksCount > 0 ? stats.pendingTasksCount : undefined, badgeColor: 'bg-blue-100 text-blue-800' },
            { id: 'followups', label: 'Follow-ups', icon: Clock3, badge: stats.scheduledFollowupsCount > 0 ? stats.scheduledFollowupsCount : undefined },
            { id: 'appointments', label: 'Appointments', icon: Calendar, badge: stats.upcomingAppointmentsCount > 0 ? stats.upcomingAppointmentsCount : undefined },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-blue-700 text-white' : (tab.badgeColor || 'bg-slate-100 text-slate-600')
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* ============================================================ */}
        {/* 1. OVERVIEW / DASHBOARD                                      */}
        {/* ============================================================ */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            {/* Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                  <UserCheck className="w-3.5 h-3.5" />
                  Counsellor Desk: {counsellor.name || 'Tanvir Ahmed'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Admissions Pipeline Overview
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                  Review student verification queues, update application milestones, manage follow-up calls, and guide your students toward unconditional offers.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  New Task
                </button>
                <button
                  onClick={() => setIsFollowupModalOpen(true)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Clock3 className="w-4 h-4 text-emerald-400" />
                  Schedule Follow-up
                </button>
              </div>
            </div>

            {/* Counsellor Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs text-slate-400 font-semibold mb-1">Assigned Leads</div>
                <div className="text-2xl font-black text-white">{stats.totalLeads || 0}</div>
                <div className="text-[10px] text-emerald-400 mt-1">{stats.newLeads || 0} Fresh Leads</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs text-slate-400 font-semibold mb-1">Assigned Students</div>
                <div className="text-2xl font-black text-white">{stats.totalStudents || 0}</div>
                <div className="text-[10px] text-blue-400 mt-1">{stats.activeStudents || 0} Active Files</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs text-slate-400 font-semibold mb-1">Pending Docs</div>
                <div className="text-2xl font-black text-amber-400">{stats.pendingDocumentsCount || 0}</div>
                <div className="text-[10px] text-amber-300 mt-1">Awaiting Review</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs text-slate-400 font-semibold mb-1">Applications</div>
                <div className="text-2xl font-black text-white">{stats.activeApplicationsCount || 0}</div>
                <div className="text-[10px] text-purple-400 mt-1">Under Assessment</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs text-slate-400 font-semibold mb-1">Open Tasks</div>
                <div className="text-2xl font-black text-white">{stats.pendingTasksCount || 0}</div>
                <div className="text-[10px] text-blue-400 mt-1">Action Items</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                <div className="text-xs text-slate-400 font-semibold mb-1">Follow-ups</div>
                <div className="text-2xl font-black text-white">{stats.scheduledFollowupsCount || 0}</div>
                <div className="text-[10px] text-emerald-400 mt-1">Scheduled</div>
              </div>
            </div>

            {/* Quick Review Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Documents Awaiting Review & Assigned Students */}
              <div className="lg:col-span-7 space-y-6">
                {/* Documents Queue */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-amber-400" />
                      Documents Awaiting Review ({pendingDocuments.length})
                    </h3>
                    <button
                      onClick={() => setCurrentTab('documents')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                    >
                      View All
                    </button>
                  </div>

                  {pendingDocuments.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">No documents pending verification.</div>
                  ) : (
                    <div className="space-y-3">
                      {pendingDocuments.slice(0, 4).map((doc: any) => (
                        <div
                          key={doc.id}
                          className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="font-bold text-xs text-white">{doc.title}</div>
                            <div className="text-[11px] text-slate-400">
                              Category: {doc.category} • {doc.fileSize || '1.2 MB'}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setVerifyingDoc(doc);
                              setVerificationStatus('Verified');
                              setVerificationNotes('Verified and approved for university submission.');
                            }}
                            className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                          >
                            Verify / Review
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Assigned Students Quick List */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      Assigned Students
                    </h3>
                    <button
                      onClick={() => setCurrentTab('students')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                    >
                      View Full Roster
                    </button>
                  </div>

                  <div className="space-y-3">
                    {assignedStudents.map((s: any) => (
                      <div
                        key={s.id}
                        className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between gap-3 hover:bg-slate-800/70 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={s.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                            alt={s.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                              {s.fullName}
                              <span className="text-[10px] font-mono text-blue-400">({s.studentRef})</span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {s.targetDegree} • {s.preferredDestinations?.join(', ') || 'UK'} • IELTS: {s.englishScore?.split(' ')[1] || '6.5'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openStudentDetail(s.id)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => {
                              setCurrentTab('messages');
                              openStudentChat(s.id);
                            }}
                            className="p-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Chat with student"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Tasks & Upcoming Appointments */}
              <div className="lg:col-span-5 space-y-6">
                {/* Tasks Box */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                      Priority Tasks ({tasks.filter((t: any) => t.status !== 'Completed').length})
                    </h3>
                    <button
                      onClick={() => setIsTaskModalOpen(true)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {tasks.slice(0, 5).map((task: any) => (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTaskStatus(task)}
                        className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                          task.status === 'Completed'
                            ? 'bg-slate-900/40 border-slate-800 opacity-60'
                            : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={task.status === 'Completed'}
                          onChange={() => {}}
                          className="mt-1 w-4 h-4 rounded text-emerald-500 focus:ring-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className={`text-xs font-semibold block ${
                            task.status === 'Completed' ? 'line-through text-slate-500' : 'text-white'
                          }`}>
                            {task.title}
                          </span>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                            {task.studentName && <span>Student: {task.studentName}</span>}
                            <span>•</span>
                            <span className="text-amber-400">Due: {task.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Follow-ups Box */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Clock3 className="w-4 h-4 text-purple-400" />
                      Scheduled Follow-ups
                    </h3>
                    <button
                      onClick={() => setIsFollowupModalOpen(true)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                    >
                      + Schedule
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {followups.slice(0, 4).map((f: any) => (
                      <div
                        key={f.id}
                        className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300">
                              {f.type}
                            </span>
                            {f.studentName}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">
                            {f.scheduledDate} {f.scheduledTime && `at ${f.scheduledTime}`}
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleFollowup(f)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                            f.status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {f.status === 'Completed' ? 'Done' : 'Mark Done'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. ASSIGNED STUDENTS LIST                                    */}
        {/* ============================================================ */}
        {currentTab === 'students' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Assigned Students ({assignedStudents.length})
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage academic qualifications, review uploaded credentials, and update university application milestones.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name or ref..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredStudents.map((s: any) => (
                <div
                  key={s.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={s.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={s.fullName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{s.fullName}</span>
                        <span className="font-mono text-xs font-bold text-blue-400">{s.studentRef}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                          {s.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 mt-2 text-xs text-slate-300">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Degree</span>
                          <span>{s.qualification} (CGPA: {s.cgpa})</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">English Score</span>
                          <span>{s.englishTest}: {s.englishScore?.split(' ')[1] || '6.5'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Target Destination</span>
                          <span>{s.preferredDestinations?.join(', ') || 'UK'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Contact</span>
                          <span>{s.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => openStudentDetail(s.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/25 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      Manage File & Timeline
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentTab('messages');
                        openStudentChat(s.id);
                      }}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-colors cursor-pointer"
                      title="Direct message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. DOCUMENTS REVIEW QUEUE                                    */}
        {/* ============================================================ */}
        {currentTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-amber-400" />
                  Document Verification Desk
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Inspect student academic uploads, approve verified documents, or request corrections with notes.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="divide-y divide-slate-800">
                {pendingDocuments.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    All student compliance documents have been reviewed!
                  </div>
                ) : (
                  pendingDocuments.map((doc: any) => (
                    <div key={doc.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm">{doc.title}</h4>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                              {doc.category}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            Student ID: {doc.studentId} • Size: {doc.fileSize || '1.2 MB'} • Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                          </div>
                          {doc.verificationNotes && (
                            <p className="mt-1.5 text-xs text-slate-300 bg-slate-800/50 p-2 rounded-lg">
                              Note: {doc.verificationNotes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <a
                          href={`/api/documents/${doc.id}/download`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          View File
                        </a>

                        <button
                          onClick={() => {
                            setVerifyingDoc(doc);
                            setVerificationStatus('Verified');
                            setVerificationNotes('Verified and approved for university admissions.');
                          }}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                        >
                          Approve / Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. TASK MANAGEMENT                                           */}
        {/* ============================================================ */}
        {currentTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-blue-400" />
                  Task Management ({tasks.length})
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Keep track of admissions milestones, offer acceptance deadlines, and TB certificate collection.
                </p>
              </div>

              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                Add New Task
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {tasks.map((t: any) => (
                <div
                  key={t.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-colors ${
                    t.status === 'Completed' ? 'bg-slate-900/40 border-slate-800/80 opacity-60' : 'bg-slate-900/90 border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={t.status === 'Completed'}
                      onChange={() => handleToggleTaskStatus(t)}
                      className="mt-1 w-5 h-5 rounded text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${t.status === 'Completed' ? 'line-through text-slate-500' : 'text-white'}`}>
                          {t.title}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-300' :
                          t.priority === 'High' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {t.priority}
                        </span>
                      </div>
                      {t.description && <p className="text-xs text-slate-400 mt-1">{t.description}</p>}
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                        {t.studentName && <span>Student: <strong className="text-slate-300">{t.studentName}</strong></span>}
                        <span>•</span>
                        <span>Due: <strong className="text-amber-400">{t.dueDate}</strong></span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    t.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 5. FOLLOW-UP SYSTEM                                          */}
        {/* ============================================================ */}
        {currentTab === 'followups' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock3 className="w-5 h-5 text-purple-400" />
                  Follow-up Scheduling & Tracking
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Schedule calls, WhatsApp reminders, and document collection checkpoints for assigned leads & students.
                </p>
              </div>

              <button
                onClick={() => setIsFollowupModalOpen(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                Schedule Follow-up
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {followups.map((f: any) => (
                <div
                  key={f.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-300">
                        {f.type}
                      </span>
                      <h4 className="font-bold text-white text-base">{f.studentName}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        f.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {f.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Scheduled for: <strong className="text-white">{f.scheduledDate}</strong> {f.scheduledTime && `at ${f.scheduledTime}`}
                    </div>
                    {f.notes && (
                      <p className="text-xs text-slate-300 mt-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                        {f.notes}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleFollowup(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer self-end sm:self-center ${
                      f.status === 'Completed'
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                    }`}
                  >
                    {f.status === 'Completed' ? 'Re-open' : 'Mark Completed'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 6. APPOINTMENTS                                              */}
        {/* ============================================================ */}
        {currentTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Consultation Appointments Desk
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage in-person appointments at Lift-03, Floor-04, Manru Shopping City, Chowhatta Point, Sylhet and online video consultations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {appointments.map((a: any) => (
                <div
                  key={a.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-blue-400 font-bold">{a.appointmentRef}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        a.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-300' :
                        a.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-300' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {a.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1">
                      {a.studentName} • {a.preferredDate} at {a.preferredTime}
                    </h4>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                      <span>{a.mode}</span>
                      <span>•</span>
                      <span>{a.studentPhone}</span>
                      <span>•</span>
                      <span>{a.destination}</span>
                    </div>
                    {a.message && (
                      <p className="text-xs text-slate-300 mt-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                        {a.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {a.status !== 'Confirmed' && a.status !== 'Completed' && (
                      <button
                        onClick={() => handleUpdateAppointmentStatus(a.id, 'Confirmed')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Confirm Slot
                      </button>
                    )}
                    {a.status === 'Confirmed' && (
                      <button
                        onClick={() => handleUpdateAppointmentStatus(a.id, 'Completed')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 7. LIVE MESSAGES TAB                                         */}
        {/* ============================================================ */}
        {currentTab === 'messages' && (
          <div className="max-w-5xl mx-auto h-[75vh] bg-slate-900 border border-slate-800 rounded-2xl flex overflow-hidden shadow-2xl">
            {/* Student Sidebar Selector */}
            <div className="w-1/3 border-r border-slate-800 bg-slate-850 flex flex-col">
              <div className="p-3 border-b border-slate-800 font-bold text-xs text-slate-300 uppercase tracking-wider">
                Assigned Students
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
                {assignedStudents.map((s: any) => (
                  <button
                    key={s.id}
                    onClick={() => openStudentChat(s.id)}
                    className={`w-full text-left p-3 flex items-center gap-3 transition-colors cursor-pointer ${
                      activeChatStudentId === s.id ? 'bg-blue-600/20 text-white' : 'hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <img
                      src={s.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={s.fullName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-700"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-xs truncate">{s.fullName}</div>
                      <div className="text-[10px] text-slate-500 truncate">{s.studentRef}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Thread */}
            <div className="flex-1 flex flex-col bg-slate-900">
              {activeChatStudentId ? (
                <>
                  <div className="p-3.5 border-b border-slate-800 bg-slate-850 flex items-center justify-between">
                    <span className="font-bold text-xs text-white">
                      Conversation with Student #{activeChatStudentId}
                    </span>
                    <button
                      onClick={() => openStudentDetail(activeChatStudentId)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                    >
                      View Student Profile
                    </button>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {chatMessages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-xs text-slate-500">
                        No messages yet in this conversation.
                      </div>
                    ) : (
                      chatMessages.map((msg: any) => {
                        const isMe = msg.senderRole === 'counsellor';
                        return (
                          <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-md rounded-2xl p-3 text-xs shadow-md ${
                              isMe ? 'bg-emerald-600 text-white rounded-br-xs' : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-xs'
                            }`}>
                              <div className="font-bold text-[10px] mb-1 opacity-80">
                                {isMe ? 'You (Counsellor)' : msg.senderName || 'Student'}
                              </div>
                              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                              <div className="text-[9px] opacity-70 text-right mt-1">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatBottomRef} />
                  </div>

                  <form onSubmit={handleSendCounsellorMessage} className="p-3 bg-slate-850 border-t border-slate-800 flex items-center gap-2">
                    <input
                      type="text"
                      value={newChatText}
                      onChange={(e) => setNewChatText(e.target.value)}
                      placeholder="Type response to student..."
                      className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={!newChatText.trim()}
                      className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                  <MessageSquare className="w-10 h-10 mb-2 text-slate-600" />
                  <span>Select an assigned student on the left to start messaging.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* STUDENT DETAIL DRAWER / MODAL                                */}
      {/* ============================================================ */}
      {selectedStudentId && selectedStudentData && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-2xl h-full flex flex-col shadow-2xl overflow-hidden">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudentData.student.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={selectedStudentData.student.fullName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <h3 className="font-bold text-white text-base leading-tight">
                    {selectedStudentData.student.fullName}
                  </h3>
                  <span className="text-xs font-mono text-blue-400">
                    {selectedStudentData.student.studentRef} • {selectedStudentData.student.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentId(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Visual 9-stage timeline */}
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Application Progress Milestones
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {selectedStudentData.timeline?.map((st: any) => (
                    <div
                      key={st.id}
                      className={`p-2 rounded-xl border ${
                        st.status === 'completed'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : st.status === 'current'
                          ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="font-bold truncate">{st.title}</div>
                      <span className="text-[10px] capitalize opacity-80">{st.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic Profile */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                  Academic & Contact Profile
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-850 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Email</span>
                    <span className="text-white">{selectedStudentData.student.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Phone</span>
                    <span className="text-white">{selectedStudentData.student.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Academic Degree</span>
                    <span className="text-white">{selectedStudentData.student.qualification} (CGPA: {selectedStudentData.student.cgpa})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">English Score</span>
                    <span className="text-white">{selectedStudentData.student.englishTest}: {selectedStudentData.student.englishScore}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block text-[10px]">Study Gap / Experience</span>
                    <span className="text-white">{selectedStudentData.student.studyGap || 'None'}</span>
                  </div>
                </div>
              </div>

              {/* Applications & Status Update Button */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>Applications ({selectedStudentData.applications?.length})</span>
                </h4>
                <div className="space-y-3">
                  {selectedStudentData.applications?.map((app: any) => (
                    <div key={app.id} className="p-4 bg-slate-850 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-white text-sm">{app.universityName}</h5>
                          <span className="text-xs text-slate-400">{app.programName} ({app.degree})</span>
                        </div>
                        <button
                          onClick={() => {
                            setEditingApp(app);
                            setAppStatus(app.status);
                            setAppOfferStatus(app.offerStatus || '');
                            setAppDepositStatus(app.depositStatus || '');
                            setAppDepositAmount(app.depositAmount || '');
                            setAppCasStatus(app.casStatus || '');
                            setAppCasReference(app.casReference || '');
                            setAppVisaStatus(app.visaStatus || '');
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          Update Status
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div className="bg-slate-800/60 p-2 rounded-lg">
                          <span className="text-slate-400 block text-[9px] uppercase">Status</span>
                          <span className="font-bold text-white">{app.status}</span>
                        </div>
                        <div className="bg-slate-800/60 p-2 rounded-lg">
                          <span className="text-slate-400 block text-[9px] uppercase">Offer</span>
                          <span className="font-bold text-emerald-400">{app.offerStatus || 'Pending'}</span>
                        </div>
                        <div className="bg-slate-800/60 p-2 rounded-lg">
                          <span className="text-slate-400 block text-[9px] uppercase">Deposit</span>
                          <span className="font-bold text-white">{app.depositStatus || 'Pending'}</span>
                        </div>
                        <div className="bg-slate-800/60 p-2 rounded-lg">
                          <span className="text-slate-400 block text-[9px] uppercase">CAS Ref</span>
                          <span className="font-bold text-blue-400 truncate block">{app.casReference || 'None'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Uploaded Documents Verification */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                  Uploaded Documents ({selectedStudentData.documents?.length})
                </h4>
                <div className="space-y-2">
                  {selectedStudentData.documents?.map((d: any) => (
                    <div key={d.id} className="p-3 bg-slate-850 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{d.title}</div>
                        <div className="text-[10px] text-slate-400">{d.category} • {d.status}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setVerifyingDoc(d);
                            setVerificationStatus(d.status === 'Verified' ? 'Verified' : 'Verified');
                            setVerificationNotes(d.verificationNotes || 'Verified and approved.');
                          }}
                          className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg text-xs font-medium cursor-pointer"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DOCUMENT VERIFICATION MODAL                                  */}
      {/* ============================================================ */}
      {verifyingDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                Document Verification
              </h3>
              <button
                onClick={() => setVerifyingDoc(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-800/40 p-3 rounded-xl text-xs space-y-1">
              <div className="text-white font-bold">{verifyingDoc.title}</div>
              <div className="text-slate-400">Category: {verifyingDoc.category}</div>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Verification Decision</label>
                <select
                  value={verificationStatus}
                  onChange={(e) => setVerificationStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Verified">Verified & Approved (Ready for University)</option>
                  <option value="Under Review">Under Review / Clarification Requested</option>
                  <option value="Rejected">Rejected / Re-upload Required</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Counsellor Verification Feedback</label>
                <textarea
                  rows={3}
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Feedback or instructions sent directly to student portal notification..."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifyingDoc(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingVerification}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  {isSubmittingVerification ? 'Saving...' : 'Confirm Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* APPLICATION STATUS UPDATE MODAL                              */}
      {/* ============================================================ */}
      {editingApp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                Update Application: {editingApp.universityName}
              </h3>
              <button
                onClick={() => setEditingApp(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAppStatusSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Overall Status</label>
                  <select
                    value={appStatus}
                    onChange={(e) => setAppStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Conditional Offer">Conditional Offer</option>
                    <option value="Unconditional Offer">Unconditional Offer</option>
                    <option value="Deposit Paid">Deposit Paid</option>
                    <option value="CAS Issued">CAS Issued</option>
                    <option value="Visa Lodged">Visa Lodged</option>
                    <option value="Visa Approved">Visa Approved</option>
                    <option value="Enrolled">Enrolled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Offer Status</label>
                  <input
                    type="text"
                    value={appOfferStatus}
                    onChange={(e) => setAppOfferStatus(e.target.value)}
                    placeholder="Conditional / Unconditional"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tuition Deposit Status</label>
                  <select
                    value={appDepositStatus}
                    onChange={(e) => setAppDepositStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Waived">Waived</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tuition Deposit Amount</label>
                  <input
                    type="text"
                    value={appDepositAmount}
                    onChange={(e) => setAppDepositAmount(e.target.value)}
                    placeholder="e.g. £3,000"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">CAS Reference</label>
                  <input
                    type="text"
                    value={appCasReference}
                    onChange={(e) => setAppCasReference(e.target.value)}
                    placeholder="e.g. E4G8X89412"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Visa Filing Status</label>
                  <select
                    value={appVisaStatus}
                    onChange={(e) => setAppVisaStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="Financial Check Passed">Financial Check Passed</option>
                    <option value="VFS Biometrics Scheduled">VFS Biometrics Scheduled</option>
                    <option value="Under Embassy Review">Under Embassy Review</option>
                    <option value="Visa Approved">Visa Approved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Milestone Progress Note</label>
                <textarea
                  rows={2}
                  value={appStageNotes}
                  onChange={(e) => setAppStageNotes(e.target.value)}
                  placeholder="Notes visible on student dashboard timeline..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAppStatus}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  {isSubmittingAppStatus ? 'Updating...' : 'Save & Notify Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TASK CREATION MODAL                                          */}
      {/* ============================================================ */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Create Admissions Task</h3>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Collect TB Certificate from IOM Sylhet"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Linked Student (Optional)</label>
                  <select
                    value={taskStudentId}
                    onChange={(e) => setTaskStudentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="">-- General Task --</option>
                    {assignedStudents.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.fullName} ({s.studentRef})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description / Action Steps</label>
                <textarea
                  rows={2}
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Additional details..."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTask}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  {isSubmittingTask ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* FOLLOW-UP CREATION MODAL                                     */}
      {/* ============================================================ */}
      {isFollowupModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Schedule Follow-up</h3>
              <button
                onClick={() => setIsFollowupModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFollowup} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Follow-up Type</label>
                  <select
                    value={followupType}
                    onChange={(e) => setFollowupType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Call">Phone Call</option>
                    <option value="WhatsApp">WhatsApp Check-in</option>
                    <option value="Email">Email Communication</option>
                    <option value="Meeting">In-Person Meeting</option>
                    <option value="Document Collection">Document Collection</option>
                    <option value="Application Follow-up">Application Follow-up</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Student / Lead</label>
                  <select
                    value={followupStudentId}
                    onChange={(e) => setFollowupStudentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="">-- Select Student --</option>
                    {assignedStudents.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.fullName} ({s.studentRef})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={followupDate}
                    onChange={(e) => setFollowupDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Time</label>
                  <input
                    type="text"
                    value={followupTime}
                    onChange={(e) => setFollowupTime(e.target.value)}
                    placeholder="11:30 AM"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Notes / Call Objective</label>
                <textarea
                  rows={2}
                  value={followupNotes}
                  onChange={(e) => setFollowupNotes(e.target.value)}
                  placeholder="e.g. Verify semester 7 marksheet and check bank solvency progress..."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFollowupModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingFollowup}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  {isSubmittingFollowup ? 'Scheduling...' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
