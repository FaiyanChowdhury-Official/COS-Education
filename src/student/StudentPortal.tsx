import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { COSLogo } from '../components/COSLogo';
import {
  GraduationCap,
  LayoutDashboard,
  User,
  FileText,
  UploadCloud,
  Calendar,
  MessageSquare,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ExternalLink,
  ChevronRight,
  Send,
  Phone,
  Mail,
  Lock,
  Edit3,
  Save,
  Trash2,
  FileCheck,
  Building,
  MapPin,
  Sparkles,
  RefreshCw,
  LogOut,
  ArrowLeft,
  Paperclip,
  Check,
  Shield,
  HelpCircle,
  Download
} from 'lucide-react';

interface StudentPortalProps {
  onNavigate: (route: string, param?: string) => void;
  initialTab?: string;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ onNavigate, initialTab = 'overview' }) => {
  const { user, logout, getAuthHeaders, switchAccount } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>(initialTab);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<any>({});
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Document Upload State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Passport');
  const [uploadFile, setUploadFile] = useState<{ name: string; dataUrl: string; size: string; type: string } | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Appointment Booking State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('11:00 AM');
  const [apptMode, setApptMode] = useState('In-person (Sylhet Office)');
  const [apptMessage, setApptMessage] = useState('');
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<any[]>([]);
  const [newChatText, setNewChatText] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);

  // Load Dashboard Data
  const fetchStudentData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/student/dashboard', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
        setNotifications(data.notifications || []);
        setProfileForm({
          fullName: data.student.fullName || '',
          phone: data.student.phone || '',
          email: data.student.email || '',
          address: data.student.address || '',
          qualification: data.student.qualification || '',
          cgpa: data.student.cgpa || '',
          passingYear: data.student.passingYear || '',
          studyGap: data.student.studyGap || '',
          englishTest: data.student.englishTest || '',
          englishScore: data.student.englishScore || '',
          targetDegree: data.student.targetDegree || '',
          budget: data.student.budget || '',
          preferredDestinations: data.student.preferredDestinations || ['United Kingdom'],
        });
      }
    } catch (err) {
      console.error('Failed to load student portal data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [user]);

  // Load Messages when entering messages tab
  useEffect(() => {
    if (currentTab === 'messages') {
      fetch('/api/student/messages', { headers: getAuthHeaders() })
        .then(r => r.json())
        .then(data => {
          setMessages(Array.isArray(data) ? data : []);
          setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        })
        .catch(console.error);
    }
  }, [currentTab]);

  // Handle Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm),
      });
      if (res.ok) {
        setProfileSaveSuccess(true);
        setIsEditingProfile(false);
        fetchStudentData();
        setTimeout(() => setProfileSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Save profile error:', err);
    }
  };

  // Handle Document Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadFile({
        name: file.name,
        dataUrl: result,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type || 'application/pdf',
      });
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadCategory) return;

    setIsUploadingDoc(true);
    try {
      const res = await fetch('/api/student/documents', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: uploadTitle,
          category: uploadCategory,
          fileName: uploadFile?.name || `${uploadTitle}.pdf`,
          fileData: uploadFile?.dataUrl || null,
          fileSize: uploadFile?.size || '1.2 MB',
          mimeType: uploadFile?.type || 'application/pdf',
        }),
      });

      if (res.ok) {
        setUploadSuccessMsg('Document successfully uploaded and sent for counsellor verification!');
        setUploadTitle('');
        setUploadFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchStudentData();
        setTimeout(() => setUploadSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Upload document error:', err);
    } finally {
      setIsUploadingDoc(false);
    }
  };

  // Handle Appointment Booking
  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptDate || !apptTime) return;

    setIsBookingSubmitting(true);
    try {
      const res = await fetch('/api/student/appointments', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferredDate: apptDate,
          preferredTime: apptTime,
          mode: apptMode,
          message: apptMessage,
        }),
      });

      if (res.ok) {
        setIsBookingModalOpen(false);
        setApptMessage('');
        fetchStudentData();
      }
    } catch (err) {
      console.error('Booking error:', err);
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  // Handle Cancel Appointment
  const handleCancelAppointment = async (apptId: number) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await fetch(`/api/student/appointments/${apptId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        fetchStudentData();
      }
    } catch (err) {
      console.error('Cancel appointment error:', err);
    }
  };

  // Handle Send Chat Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    setIsSendingMsg(true);
    try {
      const res = await fetch('/api/student/messages', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newChatText.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data.message]);
        setNewChatText('');
        setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setIsSendingMsg(false);
    }
  };

  // Handle Mark Notifications Read
  const handleMarkAllNotifsRead = async () => {
    try {
      await fetch('/api/student/notifications/read-all', {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const student = dashboardData?.student || {};
  const counsellor = dashboardData?.counsellor || {};
  const applications = dashboardData?.applications || [];
  const documents = dashboardData?.documents || [];
  const appointments = dashboardData?.appointments || [];
  const timeline = dashboardData?.timeline || [];
  const pendingCategories = dashboardData?.pendingCategories || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading && !dashboardData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-900 student-portal-white-theme">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-600 font-medium">Loading Student Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased student-portal-white-theme portal-white-theme">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <COSLogo className="h-8 w-auto" />
              <div className="pl-2 border-l border-slate-200">
                <span className="font-bold text-xs sm:text-sm text-slate-900 block tracking-tight">Student Portal</span>
                <span className="text-[10px] text-blue-600 font-mono block -mt-0.5">
                  Ref: {student.studentRef || 'COS-2026-001'}
                </span>
              </div>
            </button>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {student.status || 'Active'}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick Link to Counsellor or Admin switch */}
            <div className="hidden md:flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <span>Role:</span>
              <span className="text-slate-800 font-semibold capitalize">{user?.role || 'Student'}</span>
              <button
                onClick={() => onNavigate('counsellor')}
                className="ml-2 text-blue-600 hover:text-blue-700 font-medium underline cursor-pointer"
              >
                Counsellor View
              </button>
            </div>

            {/* Notification trigger button */}
            <button
              onClick={() => setCurrentTab('notifications')}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile avatar dropdown info */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <img
                src={student.photo || user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={student.fullName}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden lg:block text-left text-xs">
                <div className="font-semibold text-slate-900 leading-tight">{student.fullName || user?.name}</div>
                <div className="text-slate-500 text-[11px]">{student.email || user?.email}</div>
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

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs sm:text-sm font-medium border-t border-slate-200 pt-2">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'timeline', label: 'Timeline', icon: Clock },
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'applications', label: 'Applications', icon: Building, badge: applications.length },
            { id: 'documents', label: 'Documents', icon: FileText, badge: pendingCategories.length > 0 ? `${pendingCategories.length} Required` : undefined, badgeColor: 'bg-amber-100 text-amber-800' },
            { id: 'appointments', label: 'Appointments', icon: Calendar, badge: appointments.filter((a: any) => a.status === 'Confirmed').length || undefined },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined, badgeColor: 'bg-rose-500 text-white' },
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
        {/* 1. OVERVIEW / DASHBOARD TAB                                  */}
        {/* ============================================================ */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            {/* Greeting Banner */}
            <div className="bg-white rounded-2xl border border-blue-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs relative overflow-hidden">
              <div className="space-y-2 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Target: {student.targetDegree || "Master's"} • {student.preferredDestinations?.join(', ') || 'United Kingdom'}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Welcome back, {student.fullName?.split(' ')[0] || 'Student'}!
                </h1>
                <p className="text-slate-600 text-xs sm:text-sm max-w-2xl">
                  Track your university applications, submit required verification documents, and coordinate with your assigned COS counsellor in Sylhet.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 z-10">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  Book Consultation
                </button>
                <button
                  onClick={() => setCurrentTab('documents')}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <UploadCloud className="w-4 h-4 text-blue-600" />
                  Upload Document
                </button>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400">Applications</span>
                  <Building className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">{applications.length}</div>
                <div className="text-[11px] text-blue-400 mt-1">
                  {applications.filter((a: any) => a.offerStatus?.includes('Offer')).length} Offer Letter(s)
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400">Documents</span>
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {documents.filter((d: any) => d.status === 'Verified').length} / {documents.length}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">Verified & Approved</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400">English Test</span>
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-base sm:text-lg font-bold text-white truncate">
                  {student.englishTest || 'IELTS'}
                </div>
                <div className="text-[11px] text-purple-300 mt-1 truncate">
                  {student.englishScore || 'Score Pending'}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400">Next Consultation</span>
                  <Calendar className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-base sm:text-lg font-bold text-white truncate">
                  {appointments[0]?.preferredDate || 'None Scheduled'}
                </div>
                <div className="text-[11px] text-amber-400 mt-1">
                  {appointments[0]?.status ? `Status: ${appointments[0].status}` : 'Sylhet Office'}
                </div>
              </div>
            </div>

            {/* Visual Application Progress Timeline Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    Application Progress Timeline
                  </h2>
                  <p className="text-xs text-slate-400">
                    Your full journey through COS Education: from profile verification to pre-departure briefing.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('timeline')}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  View Details <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* 9-Stage Visual Progress Bar */}
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
                {timeline.map((stage: any, idx: number) => {
                  const isCompleted = stage.status === 'completed';
                  const isCurrent = stage.status === 'current';
                  return (
                    <div
                      key={stage.id}
                      className={`p-3 rounded-xl border text-center relative transition-all ${
                        isCompleted
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : isCurrent
                          ? 'bg-blue-500/15 border-blue-500 text-blue-300 shadow-md shadow-blue-500/20'
                          : 'bg-slate-800/40 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-colors">
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        ) : isCurrent ? (
                          <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center animate-pulse">
                            {idx + 1}
                          </span>
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-500 border border-slate-700 flex items-center justify-center">
                            {idx + 1}
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-xs truncate text-white">{stage.title}</div>
                      <div className="text-[10px] mt-1 capitalize font-medium">
                        {stage.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Two-Column Details: Assigned Counsellor & Pending Documents Checklist */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Assigned Counsellor Card */}
              <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-blue-400" />
                    Assigned Counsellor
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300">
                    Sylhet Desk
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <img
                    src={counsellor.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'}
                    alt={counsellor.name || 'Counsellor'}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/30 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white text-base truncate">{counsellor.name || 'Tanvir Ahmed'}</h3>
                    <p className="text-xs text-blue-400 font-medium">{counsellor.role || 'Senior UK Admissions Counsellor'}</p>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {counsellor.bio || 'Advising students from Sylhet on UK CAS issuance, scholarship waiver submissions, and embassy interview preparation.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{counsellor.phone || '+880 1572 231717'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{counsellor.email || 'info@cos-education.com'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Lift-03, Floor-04, Manru Shopping City, Chowhatta Point, Sylhet</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setCurrentTab('messages')}
                    className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Chat Online
                  </button>
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Consultation
                  </button>
                </div>
              </div>

              {/* Pending Documents Checklist & Recent Updates */}
              <div className="lg:col-span-7 space-y-6">
                {/* Pending Documents Box */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-amber-400" />
                      Required Verification Documents
                    </h3>
                    <button
                      onClick={() => setCurrentTab('documents')}
                      className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                    >
                      Manage All
                    </button>
                  </div>

                  {pendingCategories.length > 0 ? (
                    <div className="mt-4 space-y-2.5">
                      <p className="text-xs text-slate-400">
                        Upload the following missing documents to proceed with admissions clearance:
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {pendingCategories.map((cat: string) => (
                          <span
                            key={cat}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 text-xs font-medium border border-amber-500/20"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-300 text-xs">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>All core documents have been submitted! Your counsellor is completing file verification.</span>
                    </div>
                  )}
                </div>

                {/* Recent Updates List */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="font-bold text-white text-sm mb-3">Recent Activity</h3>
                  <div className="space-y-3">
                    {dashboardData?.recentUpdates?.length > 0 ? (
                      dashboardData.recentUpdates.map((update: any, i: number) => (
                        <div key={i} className="flex items-start gap-3 text-xs pb-3 border-b border-slate-800/60 last:border-0 last:pb-0">
                          <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                          <div className="flex-1">
                            <p className="text-slate-200 font-medium">{update.title}</p>
                            <span className="text-[10px] text-slate-500">
                              {update.date ? new Date(update.date).toLocaleDateString() : 'Recent'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">No recent updates recorded.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. FULL TIMELINE TAB                                         */}
        {/* ============================================================ */}
        {currentTab === 'timeline' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-400" />
                Comprehensive 9-Stage Application Timeline
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-8">
                Every phase of your foreign university journey is documented below. Stages turn green once approved by your counsellor.
              </p>

              <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-8">
                {timeline.map((step: any, index: number) => {
                  const isCompleted = step.status === 'completed';
                  const isCurrent = step.status === 'current';
                  return (
                    <div key={step.id} className="relative">
                      {/* Timeline dot */}
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCompleted
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-slate-950'
                            : isCurrent
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-slate-950 animate-pulse'
                            : 'bg-slate-800 text-slate-500 border border-slate-700 ring-4 ring-slate-950'
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                      </div>

                      <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isCompleted
                          ? 'bg-slate-900 border-emerald-500/30'
                          : isCurrent
                          ? 'bg-blue-950/20 border-blue-500/60 shadow-lg shadow-blue-500/10'
                          : 'bg-slate-900/40 border-slate-800/80 opacity-70'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h3 className="font-bold text-white text-base flex items-center gap-2">
                            {step.title}
                            {isCompleted && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                                Completed
                              </span>
                            )}
                            {isCurrent && (
                              <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full">
                                In Progress
                              </span>
                            )}
                          </h3>
                          {step.updatedAt && (
                            <span className="text-[11px] text-slate-400">
                              Updated: {new Date(step.updatedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. STUDENT PROFILE TAB                                       */}
        {/* ============================================================ */}
        {currentTab === 'profile' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />
                    Student Academic & Personal Profile
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Review and edit your academic credentials and preferences. Sensitive records require counsellor approval.
                  </p>
                </div>

                {!isEditingProfile ? (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-600/20 self-start sm:self-auto"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {profileSaveSuccess && (
                <div className="mt-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Your profile details have been successfully updated!
                </div>
              )}

              {/* Read-Only Sensitive Verification Notice */}
              <div className="mt-6 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-amber-300 block mb-0.5">Protected Official Records</span>
                  Official fields such as Student Ref (<code className="text-white">{student.studentRef}</code>), Passport verification, Assigned Counsellor, and University Enrollment Status are locked to prevent tampering with embassy filing records.
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="mt-6 space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 pb-1 border-b border-slate-800">
                    1. Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        disabled={!isEditingProfile}
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Contact Phone</label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Present Address (Sylhet/BD)</label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 pb-1 border-b border-slate-800">
                    2. Academic Background
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-300 mb-1">Highest Qualification</label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profileForm.qualification}
                        onChange={(e) => setProfileForm({ ...profileForm, qualification: e.target.value })}
                        placeholder="e.g. BBA in Marketing, BSc in CSE"
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">CGPA / Score</label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profileForm.cgpa}
                        onChange={(e) => setProfileForm({ ...profileForm, cgpa: e.target.value })}
                        placeholder="e.g. 3.35 out of 4.0"
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Passing Year</label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profileForm.passingYear}
                        onChange={(e) => setProfileForm({ ...profileForm, passingYear: e.target.value })}
                        placeholder="e.g. 2023"
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs disabled:opacity-60"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-xs font-medium text-slate-300 mb-1">Study Gap / Work Experience</label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profileForm.studyGap}
                        onChange={(e) => setProfileForm({ ...profileForm, studyGap: e.target.value })}
                        placeholder="e.g. 1 year (Executive in Retail Management, experience letter ready)"
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>

                {/* English Test & Target Program */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 pb-1 border-b border-slate-800">
                    3. English Proficiency & Program Preferences
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">English Test Type</label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profileForm.englishTest}
                        onChange={(e) => setProfileForm({ ...profileForm, englishTest: e.target.value })}
                        placeholder="IELTS Academic / PTE / Oxford / MOI"
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Overall / Band Score</label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profileForm.englishScore}
                        onChange={(e) => setProfileForm({ ...profileForm, englishScore: e.target.value })}
                        placeholder="Overall 6.5 (min 6.0 in each band)"
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Target Degree</label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profileForm.targetDegree}
                        onChange={(e) => setProfileForm({ ...profileForm, targetDegree: e.target.value })}
                        placeholder="Master / Bachelor / Foundation"
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs disabled:opacity-60"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-medium text-slate-300 mb-1">Estimated Annual Tuition Budget</label>
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={profileForm.budget}
                        onChange={(e) => setProfileForm({ ...profileForm, budget: e.target.value })}
                        placeholder="e.g. £14,000 – £16,000 per year"
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>

                {isEditingProfile && (
                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      Confirm & Save Profile
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. APPLICATIONS TAB (Students view-only)                      */}
        {/* ============================================================ */}
        {currentTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-400" />
                  My University Applications
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Track official application status, offer letters, deposit deadlines, and CAS references.
                </p>
              </div>
              <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 self-start sm:self-auto flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Status modifications handled by verified admissions counsellors
              </span>
            </div>

            {applications.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
                <Building className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Applications Submitted Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                  Once your counsellor finalizes your university shortlisting, your live applications will appear here.
                </p>
                <button
                  onClick={() => setCurrentTab('messages')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Message Your Counsellor
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {applications.map((app: any) => (
                  <div
                    key={app.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-lg text-blue-400 border border-slate-700 shrink-0">
                          {app.country === 'United Kingdom' ? '🇬🇧' : app.country === 'Finland' ? '🇫🇮' : '🎓'}
                        </div>
                        <div>
                          <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                            {app.country} • {app.intake || 'September 2026'}
                          </span>
                          <h3 className="text-lg font-bold text-white">{app.universityName}</h3>
                          <p className="text-xs text-slate-300">{app.programName} ({app.degree})</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          app.status?.includes('Offer') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          app.status?.includes('CAS') ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>

                    {/* Application Key Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Offer Status</span>
                        <span className="font-bold text-white mt-0.5 block">{app.offerStatus || 'Under Assessment'}</span>
                      </div>
                      <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tuition Deposit</span>
                        <span className="font-bold text-white mt-0.5 block">{app.depositAmount ? `${app.depositAmount} (${app.depositStatus})` : 'Pending Offer'}</span>
                      </div>
                      <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">CAS Reference</span>
                        <span className="font-mono font-bold text-blue-400 mt-0.5 block">{app.casReference || 'Not Issued Yet'}</span>
                      </div>
                      <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Visa Status</span>
                        <span className="font-bold text-emerald-400 mt-0.5 block">{app.visaStatus || 'Awaiting CAS'}</span>
                      </div>
                    </div>

                    {app.notes && (
                      <div className="p-3 bg-slate-800/60 rounded-xl text-xs text-slate-300 border border-slate-800">
                        <span className="font-semibold text-slate-400 block mb-0.5">Admissions Note:</span>
                        {app.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* 5. DOCUMENTS TAB                                             */}
        {/* ============================================================ */}
        {currentTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Compliance Documents & Verification
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload academic transcripts, certificates, passport copy, and test reports. All files are securely protected.
                </p>
              </div>
            </div>

            {/* Upload Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-400" />
                Upload New Verification Document
              </h3>

              {uploadSuccessMsg && (
                <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  {uploadSuccessMsg}
                </div>
              )}

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Document Category</label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Passport">Passport Copy (Data Page)</option>
                      <option value="Certificate">Passing Certificate / Degree</option>
                      <option value="Transcript">Academic Transcripts / Marksheet</option>
                      <option value="English Test">English Test TRF (IELTS / PTE / MOI)</option>
                      <option value="CV">Curriculum Vitae (CV)</option>
                      <option value="SOP">Statement of Purpose (SOP)</option>
                      <option value="Recommendation Letter">Letter of Recommendation</option>
                      <option value="Financial Documents">Bank Statement / Solvency Proof</option>
                      <option value="Other">Other Supporting Document</option>
                    </select>
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bachelor 8-Semester Marksheet"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-3 flex flex-col justify-end">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="hidden"
                      id="doc-file-input"
                    />
                    <label
                      htmlFor="doc-file-input"
                      className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-slate-700 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                      {uploadFile ? uploadFile.name.slice(0, 16) + '...' : 'Choose File'}
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    {uploadFile ? `Selected: ${uploadFile.name} (${uploadFile.size})` : 'Supports PDF, JPEG, PNG up to 15MB'}
                  </span>
                  <button
                    type="submit"
                    disabled={isUploadingDoc || !uploadTitle}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isUploadingDoc ? 'Uploading...' : 'Submit for Verification'}
                  </button>
                </div>
              </form>
            </div>

            {/* Document List Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">Uploaded Documents ({documents.length})</h3>
                <span className="text-xs text-slate-400">Protected Storage Enforced</span>
              </div>

              {documents.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">No documents uploaded yet.</div>
              ) : (
                <div className="divide-y divide-slate-800/80">
                  {documents.map((doc: any) => (
                    <div key={doc.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{doc.title}</h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
                            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">{doc.category}</span>
                            <span>•</span>
                            <span>{doc.fileSize || '1.2 MB'}</span>
                            <span>•</span>
                            <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                          </div>
                          {doc.verificationNotes && (
                            <p className="mt-1.5 text-xs text-slate-300 bg-slate-800/40 p-2 rounded-lg border border-slate-800">
                              <span className="font-semibold text-slate-400">Counsellor Feedback: </span>
                              {doc.verificationNotes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          doc.status === 'Verified' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                          doc.status === 'Rejected' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' :
                          'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}>
                          {doc.status}
                        </span>

                        <a
                          href={doc.downloadUrl || `/api/documents/${doc.id}/download`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-300 transition-colors shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 6. APPOINTMENTS TAB                                          */}
        {/* ============================================================ */}
        {currentTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Counsellor Consultations & Meetings
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Meet in-person at Lift-03, Floor-04, Manru Shopping City, Chowhatta Point, Sylhet or join via online video call.
                </p>
              </div>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Calendar className="w-4 h-4" />
                Schedule New Appointment
              </button>
            </div>

            {/* Appointments List */}
            <div className="grid grid-cols-1 gap-4">
              {appointments.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
                  <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">No Consultations Scheduled</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">
                    Book a slot to meet your assigned counsellor to review university options or check documentation.
                  </p>
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              ) : (
                appointments.map((appt: any) => (
                  <div
                    key={appt.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex flex-col items-center justify-center shrink-0 border border-blue-500/20">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-blue-400 font-bold">{appt.appointmentRef}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            appt.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-300' :
                            appt.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-300' :
                            'bg-amber-500/20 text-amber-300'
                          }`}>
                            {appt.status}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-1">
                          {appt.preferredDate} at {appt.preferredTime}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{appt.mode}</span>
                          <span>•</span>
                          <span>Destination: {appt.destination}</span>
                        </div>
                        {appt.message && (
                          <p className="text-xs text-slate-300 mt-2 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                            {appt.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {appt.status !== 'Cancelled' && appt.status !== 'Completed' && (
                      <button
                        onClick={() => handleCancelAppointment(appt.id)}
                        className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-medium transition-colors cursor-pointer self-end sm:self-center"
                      >
                        Cancel Appointment
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 7. MESSAGES TAB (Student <-> Counsellor Chat)                */}
        {/* ============================================================ */}
        {currentTab === 'messages' && (
          <div className="max-w-4xl mx-auto h-[75vh] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            {/* Chat Header */}
            <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={counsellor.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'}
                  alt={counsellor.name || 'Counsellor'}
                  className="w-10 h-10 rounded-full object-cover border border-blue-500/40"
                />
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    {counsellor.name || 'Tanvir Ahmed'}
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </h3>
                  <p className="text-[11px] text-slate-400">{counsellor.role || 'Senior UK Admissions Counsellor'}</p>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                Sylhet Branch Desk
              </span>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 text-xs">
                  <MessageSquare className="w-8 h-8 mb-2 text-slate-600" />
                  <span>No messages yet. Send a query to your assigned counsellor.</span>
                </div>
              ) : (
                messages.map((msg: any) => {
                  const isMe = msg.senderRole === 'student';
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md rounded-2xl p-3.5 text-xs shadow-md ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-xs'
                          : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-xs'
                      }`}>
                        <div className="font-bold text-[10px] mb-1 opacity-80">
                          {isMe ? 'You' : msg.senderName || 'Counsellor'}
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        <div className="text-[9px] opacity-70 text-right mt-1.5">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-850 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={newChatText}
                onChange={(e) => setNewChatText(e.target.value)}
                placeholder="Type your question for your counsellor..."
                className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={isSendingMsg || !newChatText.trim()}
                className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* 8. NOTIFICATIONS TAB                                         */}
        {/* ============================================================ */}
        {currentTab === 'notifications' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-400" />
                  Notifications & Updates
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Official admissions alerts, document requests, and timetable reminders.
                </p>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllNotifsRead}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 cursor-pointer"
                >
                  Mark All Read
                </button>
              )}
            </div>

            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-500">
                  No notifications recorded.
                </div>
              ) : (
                notifications.map((n: any) => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-2xl border transition-colors flex items-start gap-3.5 ${
                      !n.read
                        ? 'bg-blue-950/20 border-blue-500/40 text-white'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      n.type === 'application' ? 'bg-blue-500/15 text-blue-400' :
                      n.type === 'document' ? 'bg-amber-500/15 text-amber-400' :
                      n.type === 'appointment' ? 'bg-purple-500/15 text-purple-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {n.type === 'application' ? <Building className="w-4 h-4" /> :
                       n.type === 'document' ? <FileText className="w-4 h-4" /> :
                       n.type === 'appointment' ? <Calendar className="w-4 h-4" /> :
                       <Bell className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-sm text-white">{n.title}</h4>
                        <span className="text-[10px] text-slate-400">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{n.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Book Counsellor Consultation
              </h3>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={apptDate}
                  onChange={(e) => setApptDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Time Slot</label>
                <select
                  value={apptTime}
                  onChange={(e) => setApptTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                >
                  <option value="10:30 AM">10:30 AM (Morning)</option>
                  <option value="11:30 AM">11:30 AM (Morning)</option>
                  <option value="02:30 PM">02:30 PM (Afternoon)</option>
                  <option value="04:00 PM">04:00 PM (Afternoon)</option>
                  <option value="05:30 PM">05:30 PM (Evening)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Format</label>
                <select
                  value={apptMode}
                  onChange={(e) => setApptMode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                >
                  <option value="In-person (Sylhet Office)">In-person (Lift-03, Floor-04, Manru Shopping City, Sylhet)</option>
                  <option value="Online (Google Meet / Zoom)">Online Video Call (Google Meet / Zoom)</option>
                  <option value="Phone Consultation">Phone Call Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Consultation Topic / Question</label>
                <textarea
                  rows={3}
                  value={apptMessage}
                  onChange={(e) => setApptMessage(e.target.value)}
                  placeholder="e.g. Discuss conditional offer requirements and tuition deposit deadline."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBookingSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  {isBookingSubmitting ? 'Submitting...' : 'Confirm Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
