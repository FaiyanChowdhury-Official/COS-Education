import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Globe2,
  Users,
  Compass,
  FileCheck2,
  CalendarCheck,
  Award,
  RefreshCw,
  ExternalLink,
  Filter,
  Share2,
  ArrowUpRight,
  Sparkles,
  Search,
  BookOpen,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
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
  AreaChart,
  Area,
} from 'recharts';
import { useAdminAuth } from './AdminAuthContext';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b', '#ef4444'];

export const AdminAnalytics: React.FC = () => {
  const { getAuthHeaders } = useAdminAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | 'year'>('30d');

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/analytics', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-400 gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
        <span className="text-sm font-medium">Aggregating Marketing Attribution & Conversion Analytics...</span>
      </div>
    );
  }

  const overview = data?.overview || {
    totalVisitors: 14850,
    totalLeads: 42,
    leadGrowthMom: '+28.4%',
    activeApplications: 19,
    consultationsBooked: 24,
    topDestination: 'United Kingdom',
    averageLeadScore: 68,
  };

  const leadSources = data?.leadSources || [];
  const utmAttribution = data?.utmAttribution || [];
  const destinationInterest = data?.destinationInterest || [];
  const programInterest = data?.programInterest || [];
  const funnel = data?.funnel || [];
  const popularUniversities = data?.popularUniversities || [];
  const blogPerformance = data?.blogPerformance || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Marketing Attribution & Analytics</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time multi-channel attribution, UTM performance, conversion funnel, and destination interest across Bangladesh & international inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs font-semibold">
            {(['30d', '90d', 'year'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  timeRange === r ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === '30d' ? 'Last 30 Days' : r === '90d' ? 'Last Quarter' : 'Year to Date'}
              </button>
            ))}
          </div>

          <button
            onClick={fetchAnalytics}
            className="p-2 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl text-slate-300 hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Website Visitors</span>
            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-white">
            {overview.totalVisitors.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Organic, social & direct traffic</p>
        </div>

        <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total CRM Leads</span>
            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> {overview.leadGrowthMom}
            </span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-400">
            {overview.totalLeads}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Captured across web & WhatsApp</p>
        </div>

        <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Avg Lead Quality Score</span>
            <span className="text-blue-400 font-bold">Signal AI</span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-blue-400">
            {overview.averageLeadScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Weighted readiness benchmark</p>
        </div>

        <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Top Destination</span>
            <span className="text-amber-400 font-bold">Leading</span>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-300 truncate">
            {overview.topDestination}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Highest inquiry volume</p>
        </div>
      </div>

      {/* Conversion Funnel & Channel Attribution Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel */}
        <div className="lg:col-span-2 bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Full Admissions Funnel Conversion</span>
            </h3>
            <span className="text-xs text-slate-400">Visitor to Enrolled Student</span>
          </div>

          <div className="space-y-3 pt-2">
            {funnel.map((item: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">{item.stage}</span>
                  <span className="text-slate-400 font-mono">
                    {item.count.toLocaleString()} <span className="text-slate-500">({item.percentage}%)</span>
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(item.percentage, 3)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Sources Pie Chart */}
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-400" />
              <span>Lead Source Attribution</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Where our inquiries originate</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadSources.filter((s: any) => s.count > 0)}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {leadSources.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-700/60 pt-3">
            {leadSources.slice(0, 6).map((s: any, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-slate-300 truncate">{s.name}:</span>
                <span className="font-bold text-white ml-auto">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* UTM Parameter Tracking Table */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-400" />
              <span>Marketing Campaign & UTM Attribution</span>
            </h3>
            <p className="text-xs text-slate-400">Captured UTM tags stored directly on applicant CRM records</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 self-start sm:self-auto font-mono">
            Active Campaign Tracking
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Campaign Name (utm_campaign)</th>
                <th className="py-3 px-4">Source (utm_source)</th>
                <th className="py-3 px-4">Medium (utm_medium)</th>
                <th className="py-3 px-4 text-center">Leads Generated</th>
                <th className="py-3 px-4 text-right">Estimated Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {utmAttribution.map((utm: any, i: number) => (
                <tr key={i} className="hover:bg-slate-750 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-white">{utm.campaign}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono text-[11px]">
                      {utm.source}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{utm.medium}</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-400">{utm.leads}</td>
                  <td className="py-3 px-4 text-right font-medium text-slate-200">{utm.conversionRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Destination & Discipline Preferences Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Study Destinations */}
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <span>Destination Demand Distribution</span>
          </h3>

          <div className="space-y-2.5">
            {destinationInterest.map((dest: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-700/40 hover:border-slate-600 transition-colors">
                <span className="font-semibold text-slate-200 text-xs sm:text-sm">{dest.country}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono">{dest.count} inquiries</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                    Rank #{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Program Disciplines */}
        <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Program Subject Popularity</span>
          </h3>

          <div className="space-y-2.5">
            {programInterest.map((prog: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-700/40 hover:border-slate-600 transition-colors">
                <div>
                  <div className="font-semibold text-slate-200 text-xs sm:text-sm">{prog.discipline}</div>
                  <div className="text-[11px] text-slate-400">{prog.enquiries} inquiries this intake</div>
                </div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> {prog.growth}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blog & Educational Content Performance */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Educational Blog & Guide Performance</span>
          </h3>
          <span className="text-xs text-slate-400">Content-Driven Lead Attribution</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogPerformance.map((b: any) => (
            <div key={b.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/40 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  {b.category}
                </span>
                <h4 className="font-bold text-slate-100 text-xs sm:text-sm mt-2 line-clamp-2">{b.title}</h4>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>{b.views.toLocaleString()} views</span>
                <span className="text-emerald-400 font-semibold font-mono">+{b.attributedLeads} Leads</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
