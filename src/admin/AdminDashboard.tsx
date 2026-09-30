import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  GraduationCap,
  FileCheck2,
  Award,
  Plane,
  Stamp,
  CalendarCheck,
  FileText,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useAdminAuth } from './AdminAuthContext';

interface DashboardMetrics {
  cards: {
    totalLeads: number;
    newLeads: number;
    activeStudents: number;
    applications: number;
    offers: number;
    visaApplications: number;
    visaDecisions: number;
    appointments: number;
    pendingDocuments: number;
    upcomingIntakes: number;
  };
  charts: {
    countries: Array<{ name: string; count: number }>;
    conversion: Array<{ stage: string; count: number }>;
    monthlyEnquiries: Array<{ month: string; enquiries: number; applications: number; visas: number }>;
  };
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

interface AdminDashboardProps {
  onNavigateSection: (section: string) => void;
  onOpenQuickLeadModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateSection,
  onOpenQuickLeadModal,
}) => {
  const { getAuthHeaders, user } = useAdminAuth();
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentAppts, setRecentAppts] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }

      // Also get recent leads and appointments
      const [leadsRes, apptsRes] = await Promise.all([
        fetch('/api/admin/leads', { headers: getAuthHeaders() }),
        fetch('/api/admin/appointments', { headers: getAuthHeaders() }),
      ]);
      if (leadsRes.ok) {
        const leads = await leadsRes.json();
        setRecentLeads(leads.slice(0, 5));
      }
      if (apptsRes.ok) {
        const appts = await apptsRes.json();
        setRecentAppts(appts.slice(0, 4));
      }
    } catch (err) {
      console.error('Error loading dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const cards = data?.cards || {
    totalLeads: 0,
    newLeads: 0,
    activeStudents: 0,
    applications: 0,
    offers: 0,
    visaApplications: 0,
    visaDecisions: 0,
    appointments: 0,
    pendingDocuments: 0,
    upcomingIntakes: 0,
  };

  const statCards = [
    {
      id: 'totalLeads',
      label: 'Total Leads',
      value: cards.totalLeads,
      icon: Users,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      section: 'leads',
    },
    {
      id: 'newLeads',
      label: 'New Leads',
      value: cards.newLeads,
      icon: UserPlus,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      section: 'leads',
      highlight: true,
    },
    {
      id: 'activeStudents',
      label: 'Active Students',
      value: cards.activeStudents,
      icon: GraduationCap,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      section: 'students',
    },
    {
      id: 'applications',
      label: 'Applications',
      value: cards.applications,
      icon: FileCheck2,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      section: 'applications',
    },
    {
      id: 'offers',
      label: 'Offers',
      value: cards.offers,
      icon: Award,
      color: 'bg-teal-50 text-teal-600 border-teal-200',
      section: 'applications',
    },
    {
      id: 'visaApplications',
      label: 'Visa Applications',
      value: cards.visaApplications,
      icon: Plane,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      section: 'applications',
    },
    {
      id: 'visaDecisions',
      label: 'Visa Decisions',
      value: cards.visaDecisions,
      icon: Stamp,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      section: 'applications',
    },
    {
      id: 'appointments',
      label: 'Appointments',
      value: cards.appointments,
      icon: CalendarCheck,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
      section: 'appointments',
    },
    {
      id: 'pendingDocuments',
      label: 'Pending Documents',
      value: cards.pendingDocuments,
      icon: FileText,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      section: 'documents',
    },
    {
      id: 'upcomingIntakes',
      label: 'Upcoming Intakes',
      value: cards.upcomingIntakes,
      icon: Clock,
      color: 'bg-sky-50 text-sky-600 border-sky-200',
      section: 'applications',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Operating Live
              </span>
              <span className="text-xs text-slate-500">Sylhet Office & International Admissions</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, {user.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              {user.role === 'admin'
                ? 'Overview of national student inquiries, active visa pipelines, and real-time CRM performance.'
                : 'Your active caseload: follow-ups, pending CAS verifications, and student counseling appointments.'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              id="admin-dashboard-refresh-btn"
              onClick={fetchDashboardData}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              id="admin-dashboard-new-lead-btn"
              onClick={onOpenQuickLeadModal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Lead</span>
            </button>
          </div>
        </div>
      </div>

      {/* 10 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onNavigateSection(card.section)}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {card.value}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium truncate">
                {card.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Enquiries & Visas */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Monthly Enquiries & Visa Growth</h3>
              <p className="text-xs text-slate-400">Inquiry trends vs. confirmed university applications</p>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              +38% Q3 Growth
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.charts.monthlyEnquiries || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEnquiries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="enquiries" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorEnquiries)" name="Enquiries" />
                <Area type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorApps)" name="Applications" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Conversion Pipeline */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Lead Conversion Funnel</h3>
              <p className="text-xs text-slate-400">Volume across current CRM pipeline stages</p>
            </div>
            <button
              onClick={() => onNavigateSection('leads')}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Kanban View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={(data?.charts.conversion || []).slice(0, 7)}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="stage" type="category" stroke="#94a3b8" fontSize={11} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Second Row: Country Distribution + Upcoming Appointments + Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Country Breakdown */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Study Destination Demand</h3>
            <p className="text-xs text-slate-400 mb-4">Inquiry distribution by targeted nation</p>
            
            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.charts.countries || []}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {(data?.charts.countries || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
            {(data?.charts.countries || []).slice(0, 4).map((c, i) => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                <span className="text-slate-300 truncate">{c.name}:</span>
                <span className="font-bold text-white ml-auto">{c.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Upcoming Appointments</h3>
              <p className="text-xs text-slate-400">Scheduled counselling sessions</p>
            </div>
            <button
              onClick={() => onNavigateSection('appointments')}
              className="text-xs text-emerald-400 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentAppts.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">No scheduled sessions for today.</div>
            ) : (
              recentAppts.map((appt) => (
                <div
                  key={appt.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-white">{appt.studentName}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      appt.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>{appt.preferredDate}</span>
                    <span>•</span>
                    <span>{appt.preferredTime}</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{appt.mode}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Latest Active Leads */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Recent Website Leads</h3>
              <p className="text-xs text-slate-400">Newly registered inquiries</p>
            </div>
            <button
              onClick={() => onNavigateSection('leads')}
              className="text-xs text-emerald-400 hover:underline"
            >
              All Leads
            </button>
          </div>

          <div className="space-y-3">
            {recentLeads.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">No leads found.</div>
            ) : (
              recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-xs text-white truncate">{lead.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{lead.country || 'Undecided'} • {lead.program || 'General Inquiry'}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{lead.phone}</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                    {lead.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
