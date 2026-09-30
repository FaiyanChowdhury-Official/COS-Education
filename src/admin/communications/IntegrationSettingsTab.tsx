import React, { useState, useEffect } from 'react';
import {
  Sliders,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Video,
  Share2,
  Lock,
  Key,
  Globe,
  Radio,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useAdminAuth } from '../AdminAuthContext';

export interface CommunicationIntegration {
  id: number;
  providerKey: string;
  providerType: 'video' | 'social';
  name: string;
  status: 'connected' | 'disconnected' | 'testing' | 'error';
  config: any;
  webhookActive: boolean;
  lastTestedAt?: string;
  testStatusMessage?: string;
}

export const IntegrationSettingsTab: React.FC = () => {
  const { getAuthHeaders } = useAdminAuth();
  const [integrations, setIntegrations] = useState<CommunicationIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingKey, setTestingKey] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'video' | 'social'>('video');

  // Modal for editing credentials
  const [selectedProvider, setSelectedProvider] = useState<CommunicationIntegration | null>(null);
  const [configFields, setConfigFields] = useState<Record<string, any>>({});

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/communications/integrations', { headers: getAuthHeaders() });
      if (res.ok) setIntegrations(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleTestConnection = async (providerKey: string) => {
    setTestingKey(providerKey);
    try {
      const res = await fetch(`/api/admin/communications/integrations/${providerKey}/test`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      showToast(data.message || 'Connection test finished.');
      fetchIntegrations();
    } catch (e) {
      showToast('Error testing provider connection.');
    } finally {
      setTestingKey(null);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) return;
    try {
      const res = await fetch(`/api/admin/communications/integrations/${selectedProvider.providerKey}`, {
        method: 'PUT',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: configFields }),
      });
      if (res.ok) {
        showToast(`${selectedProvider.name} configuration saved.`);
        setSelectedProvider(null);
        fetchIntegrations();
      }
    } catch (e) {
      showToast('Failed to save config.');
    }
  };

  const videoProviders = integrations.filter((i) => i.providerType === 'video');
  const socialProviders = integrations.filter((i) => i.providerType === 'social');

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Sliders className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Communication & Conference Integration Settings</h1>
            <p className="text-xs text-slate-500">
              Configure official API credentials, Webhooks, and test connectivity for Video Conferencing and Social Platforms.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'video'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Video Conference Providers ({videoProviders.length})
          </button>
          <button
            onClick={() => setActiveSubTab('social')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'social'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Social Media APIs ({socialProviders.length})
          </button>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(activeSubTab === 'video' ? videoProviders : socialProviders).map((prov) => {
          const isConnected = prov.status === 'connected';
          const isTesting = testingKey === prov.providerKey;

          return (
            <div
              key={prov.providerKey}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                      {prov.providerType === 'video' ? <Video className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{prov.name}</h3>
                      <div className="text-[11px] text-slate-400 font-mono">Key: {prov.providerKey}</div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      isConnected
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-slate-400'}`}
                    ></span>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {prov.testStatusMessage || 'Credentials ready for configuration.'}
                </p>

                {prov.lastTestedAt && (
                  <div className="text-[10px] text-slate-400 mt-2">
                    Last tested: {new Date(prov.lastTestedAt).toLocaleString()}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedProvider(prov);
                    setConfigFields(prov.config || {});
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs font-semibold"
                >
                  Configure Credentials
                </button>

                <button
                  onClick={() => handleTestConnection(prov.providerKey)}
                  disabled={isTesting}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs font-bold flex items-center gap-1.5"
                >
                  {isTesting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <Radio className="w-3.5 h-3.5" />
                      <span>Test Connection</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREDENTIALS CONFIG MODAL */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Configure {selectedProvider.name}
              </h3>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-3 text-xs">
              {selectedProvider.providerKey === 'zoom' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Account / Admin Email</label>
                    <input
                      type="email"
                      value={configFields.accountEmail || ''}
                      onChange={(e) => setConfigFields({ ...configFields, accountEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Client ID</label>
                    <input
                      type="text"
                      value={configFields.clientId || ''}
                      onChange={(e) => setConfigFields({ ...configFields, clientId: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Client Secret</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      value={configFields.clientSecret || ''}
                      onChange={(e) => setConfigFields({ ...configFields, clientSecret: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                    />
                  </div>
                </>
              )}

              {selectedProvider.providerKey === 'google-meet' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Google Workspace Domain</label>
                    <input
                      type="text"
                      value={configFields.workspaceDomain || 'cos-education.com'}
                      onChange={(e) => setConfigFields({ ...configFields, workspaceDomain: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Admin Workspace Email</label>
                    <input
                      type="email"
                      value={configFields.adminEmail || 'info@cos-education.com'}
                      onChange={(e) => setConfigFields({ ...configFields, adminEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                  </div>
                </>
              )}

              {selectedProvider.providerKey === 'teams' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Azure AD Tenant ID</label>
                    <input
                      type="text"
                      value={configFields.tenantId || ''}
                      onChange={(e) => setConfigFields({ ...configFields, tenantId: e.target.value })}
                      placeholder="e.g. 78491-abcd-..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Application (Client) ID</label>
                    <input
                      type="text"
                      value={configFields.clientId || ''}
                      onChange={(e) => setConfigFields({ ...configFields, clientId: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                    />
                  </div>
                </>
              )}

              {selectedProvider.providerType === 'social' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">API App ID / Key</label>
                    <input
                      type="text"
                      value={configFields.appId || ''}
                      onChange={(e) => setConfigFields({ ...configFields, appId: e.target.value })}
                      placeholder="App ID or Token"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Access Token / Secret</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      value={configFields.token || ''}
                      onChange={(e) => setConfigFields({ ...configFields, token: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedProvider(null)}
                  className="px-3.5 py-1.5 border border-slate-300 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
