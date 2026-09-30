import React, { useState, useEffect } from 'react';
import {
  History,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  Tag
} from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext';

export interface CommunicationLog {
  id: number;
  actionType: string;
  category: string;
  entityId?: string;
  entityTitle?: string;
  userEmail: string;
  userName: string;
  status: 'Success' | 'Warning' | 'Failed' | 'Info';
  details: any;
  createdAt: string;
}

export const ActivityLogsTab: React.FC = () => {
  const { getAuthHeaders } = useAdminAuth();
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/communications/logs', { headers: getAuthHeaders() });
      if (res.ok) setLogs(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter((log) => {
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesSearch =
      log.actionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.entityTitle && log.entityTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <History className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Communications Activity & Audit Trail</h1>
            <p className="text-xs text-slate-500">
              Complete real-time log of social dispatches, meeting scheduling, provider health tests, and AI creations.
            </p>
          </div>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-slate-500 font-medium mr-1">Category:</span>
          {['all', 'social_post', 'video_conference', 'account_management', 'integration', 'ai_assistant'].map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all ${
                categoryFilter === c
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search action or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Entity / Details</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {log.actionType}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase border border-slate-200">
                      {log.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{log.entityTitle || '-'}</div>
                    {log.details && (
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs">
                        {JSON.stringify(log.details)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <div>{log.userName}</div>
                    <div className="text-[10px] text-slate-400">{log.userEmail}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        log.status === 'Success'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : log.status === 'Warning'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
