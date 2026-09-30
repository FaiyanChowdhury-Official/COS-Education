import React, { useState, useEffect } from 'react';
import {
  Mail,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send,
  RefreshCw,
  Code,
  Save,
  Check,
  X,
  Sparkles,
  Info,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

interface EmailTemplate {
  id: number;
  name: string;
  code: string;
  category: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string | null;
  variables: string[];
  active: boolean;
  updatedAt: string;
}

export const AdminEmailTemplates: React.FC = () => {
  const { getAuthHeaders } = useAdminAuth();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('student@example.com');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/email-templates', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
        if (data.length > 0 && !selectedTemplate) {
          selectTemplate(data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load email templates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const selectTemplate = (tpl: EmailTemplate) => {
    setSelectedTemplate(tpl);
    setEditSubject(tpl.subject);
    setEditBody(tpl.bodyText);
    setSaveSuccess(false);
    setTestResult(null);
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/admin/email-templates/${selectedTemplate.id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: editSubject,
          bodyText: editBody,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setTemplates((prev) =>
          prev.map((t) => (t.id === selectedTemplate.id ? updated.template : t))
        );
        setSelectedTemplate(updated.template);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestSend = async () => {
    if (!selectedTemplate) return;
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/admin/email-templates/test-send', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          recipientEmail: testEmailAddress,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTestResult(data);
      }
    } catch (err) {
      console.error('Test send error:', err);
    } finally {
      setIsTesting(false);
    }
  };

  const insertVariable = (varName: string) => {
    setEditBody((prev) => `${prev} {{${varName}}}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
        <span className="text-sm font-medium">Loading transactional email templates...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <Mail className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Transactional Email Templates</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure, edit, and preview automated student communication triggers: welcome emails, offers, document reviews, and reminders.
          </p>
        </div>

        <button
          onClick={fetchTemplates}
          className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl text-slate-300 hover:text-white transition-colors text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reload Templates</span>
        </button>
      </div>

      {/* Main 2-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Template Selector List */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Transactional Categories ({templates.length})
          </div>

          <div className="space-y-1.5">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => selectTemplate(tpl)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between cursor-pointer ${
                  selectedTemplate?.id === tpl.id
                    ? 'bg-blue-600/15 border-blue-500/50 text-white shadow-sm'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div>
                  <div className="font-semibold text-xs sm:text-sm">{tpl.name}</div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">{tpl.code}</div>
                </div>

                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
                  {tpl.category}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Template Editor & Live Preview */}
        <div className="lg:col-span-8 bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 shadow-sm space-y-6">
          {selectedTemplate ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{selectedTemplate.name}</h2>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">Template ID: {selectedTemplate.code}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{saveSuccess ? 'Changes Saved' : 'Save Template'}</span>
                  </button>
                </div>
              </div>

              {/* Subject Line */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Subject Line</label>
                <input
                  type="text"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Dynamic Variables Cheatsheet */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Available Placeholders (click to insert):</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedTemplate.variables || []).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => insertVariable(v)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-750 text-blue-300 border border-slate-700 hover:border-blue-500 rounded-lg text-xs font-mono transition-colors cursor-pointer"
                      title="Click to append to email body"
                    >
                      {`{{${v}}}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Body */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Body (Plain Text & Tag Rendering)</label>
                <textarea
                  rows={8}
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs sm:text-sm text-white font-mono leading-relaxed focus:outline-hidden focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Test Sender & Preview Sandbox */}
              <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Send className="w-3.5 h-3.5 text-blue-400" />
                  <span>Send Test Email / Preview Render</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={testEmailAddress}
                    onChange={(e) => setTestEmailAddress(e.target.value)}
                    placeholder="Recipient test address..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <button
                    onClick={handleTestSend}
                    disabled={isTesting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>Preview & Send Test</span>
                  </button>
                </div>

                {testResult && (
                  <div className="mt-3 p-3 bg-slate-950 border border-blue-500/30 rounded-lg text-xs space-y-2">
                    <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{testResult.message}</span>
                    </div>
                    <div className="text-slate-400 font-mono text-[11px] border-t border-slate-800 pt-2 space-y-1">
                      <div><strong className="text-slate-300">Rendered Subject:</strong> {testResult.preview?.subject}</div>
                      <div className="whitespace-pre-line text-slate-300 mt-1 bg-slate-900 p-2.5 rounded-md border border-slate-800">
                        {testResult.preview?.bodyText}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-400">Select a template from the left list to edit</div>
          )}
        </div>
      </div>
    </div>
  );
};
