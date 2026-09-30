import React, { useState, useEffect } from 'react';
import {
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Play,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Bell,
  FileX,
  CalendarCheck,
  Building,
  UserCheck,
  ShieldCheck,
  History,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

interface AutomationRule {
  id: number;
  name: string;
  triggerEvent: string;
  actionType: string;
  enabled: boolean;
  config: any;
  lastTriggeredAt: string | null;
  executionCount: number;
}

interface AutomationLog {
  id: number;
  ruleName: string;
  triggerEvent: string;
  targetName: string;
  actionTaken: string;
  status: string;
  details: string;
  createdAt: string;
}

export const AdminAutomation: React.FC = () => {
  const { getAuthHeaders } = useAdminAuth();
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [logs, setLogs] = useState<AutomationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [executingRuleId, setExecutingRuleId] = useState<number | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [rulesRes, logsRes] = await Promise.all([
        fetch('/api/admin/automation/rules', { headers: getAuthHeaders() }),
        fetch('/api/admin/automation/logs', { headers: getAuthHeaders() }),
      ]);

      if (rulesRes.ok) {
        setRules(await rulesRes.json());
      }
      if (logsRes.ok) {
        setLogs(await logsRes.json());
      }
    } catch (err) {
      console.error('Failed to load automation data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = async (rule: AutomationRule) => {
    try {
      const res = await fetch(`/api/admin/automation/rules/${rule.id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: !rule.enabled }),
      });

      if (res.ok) {
        setRules((prev) =>
          prev.map((r) => (r.id === rule.id ? { ...r, enabled: !r.enabled } : r))
        );
      }
    } catch (err) {
      console.error('Failed to toggle rule:', err);
    }
  };

  const handleTestTrigger = async (rule: AutomationRule) => {
    setExecutingRuleId(rule.id);
    setNotificationMsg(null);
    try {
      const res = await fetch('/api/admin/automation/trigger-test', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ruleId: rule.id,
          targetName: 'Tanvir Ahmed (UK Applicant #COS-8821)',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setNotificationMsg({ type: 'success', text: `Rule [${rule.name}] executed: ${data.message}` });
        fetchData();
      } else {
        throw new Error('Test failed');
      }
    } catch (err) {
      setNotificationMsg({ type: 'error', text: 'Failed to test automation rule.' });
    } finally {
      setExecutingRuleId(null);
    }
  };

  const getRuleIcon = (trigger: string) => {
    switch (trigger) {
      case 'new_lead':
        return <UserCheck className="w-5 h-5 text-blue-400" />;
      case 'no_response_lead':
        return <Clock className="w-5 h-5 text-amber-400" />;
      case 'document_rejected':
        return <FileX className="w-5 h-5 text-rose-400" />;
      case 'appointment_tomorrow':
        return <CalendarCheck className="w-5 h-5 text-emerald-400" />;
      case 'deadline_approaching':
        return <AlertCircle className="w-5 h-5 text-amber-400" />;
      case 'new_application':
        return <Building className="w-5 h-5 text-purple-400" />;
      default:
        return <Zap className="w-5 h-5 text-teal-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
        <span className="text-sm font-medium">Loading automation workflow rules...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Zap className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Automated Follow-ups & Rules Engine</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Standard workflow automations: trigger task creation, counsellor assignment alerts, appointment reminders, and student updates.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl text-slate-300 hover:text-white transition-colors text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Rules</span>
        </button>
      </div>

      {/* Safety Policy Notice */}
      <div className="p-4 bg-slate-900 border border-blue-500/30 rounded-2xl flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block font-medium">Ethical Automation & Human-in-the-Loop Safeguard:</strong>
          Rules trigger follow-up reminders, task assignments, and student status dispatches. The system does not make sensitive or consequential admissions decisions solely on automated logic without human counsellor oversight.
        </div>
      </div>

      {notificationMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            notificationMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {notificationMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{notificationMsg.text}</span>
        </div>
      )}

      {/* Automation Rules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Configured Automation Workflows</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-mono">
              {rules.length} Rules Active
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                rule.enabled
                  ? 'bg-slate-800/80 border-slate-700/70 shadow-sm'
                  : 'bg-slate-900/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-700/60">
                    {getRuleIcon(rule.triggerEvent)}
                  </div>
                  <button
                    onClick={() => handleToggle(rule)}
                    className="cursor-pointer transition-colors"
                    title={rule.enabled ? 'Click to deactivate' : 'Click to activate'}
                  >
                    {rule.enabled ? (
                      <ToggleRight className="w-7 h-7 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-500" />
                    )}
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-slate-100 text-sm">{rule.name}</h3>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {rule.triggerEvent}
                    </span>
                    <span>→</span>
                    <span className="text-slate-300">{rule.actionType}</span>
                  </div>
                </div>

                {rule.config && (
                  <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    {Object.entries(rule.config).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-500 capitalize">{k}:</span>
                        <span className="font-mono text-slate-300">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs">
                <div className="text-slate-400 text-[11px]">
                  <span className="font-bold text-white">{rule.executionCount}</span> runs
                </div>

                <button
                  onClick={() => handleTestTrigger(rule)}
                  disabled={executingRuleId === rule.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                >
                  {executingRuleId === rule.id ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Play className="w-3 h-3 fill-current" />
                  )}
                  <span>Test Run</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Logs Table */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Recent Automation Execution History</h3>
          </div>
          <span className="text-xs text-slate-400">Showing last {logs.length} operations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Workflow Rule</th>
                <th className="py-3 px-4">Target Student / Lead</th>
                <th className="py-3 px-4">Action Taken</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-750 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-4 font-semibold text-white">{log.ruleName}</td>
                  <td className="py-3 px-4 text-slate-300">{log.targetName}</td>
                  <td className="py-3 px-4 text-slate-300 max-w-xs truncate" title={log.actionTaken}>
                    {log.actionTaken}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
