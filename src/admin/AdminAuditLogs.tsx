import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Download,
  Calendar,
  User,
  Activity,
  CheckCircle2,
  FileText,
  Clock,
  Info,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

export interface AuditLog {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: any;
  ipAddress: string | null;
  createdAt: string;
}

export const AdminAuditLogs: React.FC = () => {
  const { getAuthHeaders } = useAdminAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/audit-logs', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setLogs(await res.json());
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (selectedEntity !== 'all' && log.entity !== selectedEntity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchAction = log.action.toLowerCase().includes(q);
      const matchUser = log.userName.toLowerCase().includes(q) || log.userEmail.toLowerCase().includes(q);
      const matchEntity = log.entity.toLowerCase().includes(q);
      return matchAction || matchUser || matchEntity;
    }
    return true;
  });

  const exportAuditCsv = () => {
    const header = ['ID', 'Timestamp', 'User', 'Email', 'Action', 'Entity', 'Entity ID'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.createdAt,
      `"${l.userName}"`,
      `"${l.userEmail}"`,
      `"${l.action}"`,
      `"${l.entity}"`,
      l.entityId || '',
    ]);

    const csvContent = [header.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cos-audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    link.remove();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
        <span className="text-sm font-medium">Loading immutable audit logs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Activity className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Security & Audit Logs</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Immutable tracking of counsellor activities, student document verifications, status modifications, and portal logins.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportAuditCsv}
            className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl text-slate-300 hover:text-white transition-colors text-xs font-semibold cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={fetchLogs}
            className="p-2 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3 bg-slate-900 border border-slate-700/60 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by action, user name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500"
          >
            <option value="all">All Entities</option>
            <option value="Lead">Lead</option>
            <option value="Application">Application</option>
            <option value="Document">Document</option>
            <option value="Student">Student</option>
            <option value="Auth">Auth</option>
            <option value="Settings">Settings</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-700 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Entity Ref</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No audit records matching your search filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-750 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{log.userName}</div>
                      <div className="text-[11px] text-slate-400">{log.userEmail}</div>
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-medium">{log.action}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[11px]">
                        {log.entity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {log.entityId ? `#${log.entityId}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-xs text-blue-400 hover:underline cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Audit Log Details #{selectedLog.id}</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="text-xs space-y-2 text-slate-300">
              <div><strong>Action:</strong> <span className="text-emerald-400 font-mono">{selectedLog.action}</span></div>
              <div><strong>Performed By:</strong> {selectedLog.userName} ({selectedLog.userEmail})</div>
              <div><strong>Timestamp:</strong> {new Date(selectedLog.createdAt).toISOString()}</div>
              <div><strong>Entity:</strong> {selectedLog.entity} (ID: {selectedLog.entityId || 'N/A'})</div>
              <div className="pt-2">
                <strong>Payload / Context JSON:</strong>
                <pre className="mt-1 p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono overflow-x-auto text-slate-300 max-h-48">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
