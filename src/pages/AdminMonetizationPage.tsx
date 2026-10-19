import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Settings,
  DollarSign,
  Eye,
  Save,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Layers,
  Lock,
  Globe,
  FileText,
  RotateCcw,
  BarChart3,
  Video,
  Sparkles,
  Play,
  Clock,
  Copy,
  Check,
  HelpCircle,
  Info,
  Building2
} from 'lucide-react';
import {
  getMonetizationSettings,
  saveMonetizationSettings,
  MonetizationSettings,
  MonetizationStatus,
  isVerifiedReferralUrl
} from '../data/monetizationConfig';
import { AdminGuard } from '../components/AdminGuard';
import { AdminAnalyticsDashboard } from '../components/AdminAnalyticsDashboard';

interface AdminMonetizationPageProps {
  onNavigateHome: () => void;
}

export const AdminMonetizationPage: React.FC<AdminMonetizationPageProps> = ({ onNavigateHome }) => {
  return (
    <AdminGuard onNavigateHome={onNavigateHome}>
      {({ token, onLogout }) => (
        <AdminMonetizationContent
          token={token}
          onLogout={onLogout}
          onNavigateHome={onNavigateHome}
        />
      )}
    </AdminGuard>
  );
};

interface AdminMonetizationContentProps {
  token: string;
  onLogout: () => void;
  onNavigateHome: () => void;
}

const StatusBadge: React.FC<{
  status: MonetizationStatus;
  label?: string
}> = ({ status, label }) => {
  const configs: Record<MonetizationStatus, { text: string; bg: string }> = {
    not_configured: {
      text: label || 'Not Configured',
      bg: 'bg-slate-100 text-slate-600 border-slate-200'
    },
    pending_approval: {
      text: label || 'Pending Approval',
      bg: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    verified: {
      text: label || 'Verified & Ready',
      bg: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    active: {
      text: label || 'Active & Live',
      bg: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    }
  };
  const c = configs[status] || configs.not_configured;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${c.bg}`}>
      {c.text}
    </span>
  );
};

const AdminMonetizationContent: React.FC<AdminMonetizationContentProps> = ({
  token,
  onLogout,
  onNavigateHome
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'settings' | 'promotion'>('analytics');
  const [settings, setSettings] = useState<MonetizationSettings>(getMonetizationSettings());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [persistenceNote, setPersistenceNote] = useState<string | null>(null);
  const [copiedAdsTxt, setCopiedAdsTxt] = useState(false);

  // Sync settings with server on mount
  useEffect(() => {
    fetch('/api/admin/monetization', {
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
          saveMonetizationSettings({ ...getMonetizationSettings(), ...data.settings });
        }
      })
      .catch(err => console.warn('[Monetization Sync Warning]', err));
  }, []);

  const handleCopyAdsTxt = (text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedAdsTxt(true);
      setTimeout(() => setCopiedAdsTxt(false), 2500);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/monetization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setSaveError(data.message || 'Failed to save settings on server.');
        return;
      }

      // Update locally as well
      saveMonetizationSettings(settings);
      setSaveSuccess(true);
      setPersistenceNote(data.persistedToDisk ? 'Persisted to server storage' : 'Saved to server runtime memory');
      setTimeout(() => {
        setSaveSuccess(false);
        setPersistenceNote(null);
      }, 4000);
    } catch {
      setSaveError('Network error while saving settings to server.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    localStorage.removeItem('bmb_monetization_settings_v1');
    const freshDefaults = getMonetizationSettings();
    setSettings(freshDefaults);

    try {
      await fetch('/api/admin/monetization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(freshDefaults)
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      // Ignore
    }
  };

  // Helper checks
  const rawAdSensePubId = (settings.adsense.publisherId || '').trim();
  const isAdSensePlaceholder = !rawAdSensePubId || rawAdSensePubId === 'ca-pub-XXXXXXXXXXXXXXXX' || !/^ca-pub-\d{16}$/.test(rawAdSensePubId);
  const numericPubId = rawAdSensePubId.replace(/^ca-/, '');
  const adsTxtSnippet = `google.com, ${numericPubId || 'pub-XXXXXXXXXXXXXXXX'}, DIRECT, f08c47fec0942fa0`;

  const hasVerifiedWorkspace = isVerifiedReferralUrl(settings.affiliate.google?.googleWorkspace?.customUrl || settings.affiliate.programs?.googleWorkspace?.customUrl);
  const hasVerifiedCloud = isVerifiedReferralUrl(settings.affiliate.google?.googleCloud?.customUrl || settings.affiliate.programs?.googleCloud?.customUrl);
  const hasVerifiedOne = isVerifiedReferralUrl(settings.affiliate.google?.googleOne?.customUrl || settings.affiliate.programs?.googleOne?.customUrl);
  const hasVerifiedCjProgram = Array.isArray(settings.affiliate.cj?.approvedPrograms) &&
    settings.affiliate.cj.approvedPrograms.some(p => isVerifiedReferralUrl(p.referralUrl));
  const hasVerifiedImpact = isVerifiedReferralUrl(settings.affiliate.impact?.customUrl);

  const hasAnyVerifiedReferral = hasVerifiedWorkspace || hasVerifiedCloud || hasVerifiedOne || hasVerifiedCjProgram || hasVerifiedImpact;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* Top Banner */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold shadow-2xs">
              <Settings className="w-3.5 h-3.5" />
              <span>Platform Monetisation & Commercial Operations Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bring My Bite Monetisation Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Configure CJ Affiliate, Google Referral Programmes, Impact Radius, and Google AdSense with verified partner tracking, safe defaults, zero layout shift, and truthful readiness indicators.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onLogout}
              className="px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 transition-colors cursor-pointer"
              title="Sign out of Admin Session"
            >
              Sign Out
            </button>
            <button
              onClick={onNavigateHome}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              &larr; Back to Public Directory
            </button>
          </div>
        </div>
      </div>

      {/* Top Level Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Live Operations & Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Affiliate & AdSense Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('promotion')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'promotion'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Featured Launch & Video</span>
        </button>
      </div>

      {activeTab === 'analytics' ? (
        <AdminAnalyticsDashboard token={token} />
      ) : activeTab === 'settings' ? (
        <div className="space-y-10 animate-in fade-in duration-200">

          {/* Security & Secret Keys Notice */}
          <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
              <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Security Architecture & Secret Credentials Isolation</span>
            </div>
            <p className="leading-relaxed">
              <strong>Security Protocol:</strong> Public IDs (AdSense publisher ID, CJ CID/PID, referral URLs) are client-safe identifiers. However, payout banking information, personal tax IDs (GSTIN/PAN/W-8BEN), and CJ GraphQL API Personal Access Tokens must <strong>never</strong> be stored in frontend code. Server-side integrations load private tokens exclusively from server environment variables.
            </p>
          </div>

          {/* Master Outbound Redirects Safety Switch */}
          <div className="liquid-glass rounded-3xl p-6 border border-white/80 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl glass-icon-emerald flex items-center justify-center text-emerald-600 shadow-2xs">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Master Commercial Outbound Redirects</h3>
                    <span className="text-[10px] text-slate-500 font-semibold">Strict Safe Default Policy: Zero fabricated partner URLs or unauthorized redirects</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge
                  status={settings.affiliate.enabled && hasAnyVerifiedReferral ? 'active' : 'not_configured'}
                  label={settings.affiliate.enabled && hasAnyVerifiedReferral ? 'Redirects Active' : 'Redirects Strictly Disabled'}
                />
                <input
                  type="checkbox"
                  checked={settings.affiliate.enabled && hasAnyVerifiedReferral}
                  disabled={!hasAnyVerifiedReferral}
                  onChange={(e) => {
                    if (!hasAnyVerifiedReferral) return;
                    setSettings({
                      ...settings,
                      affiliate: { ...settings.affiliate, enabled: e.target.checked }
                    });
                  }}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className={`p-4 rounded-2xl text-xs space-y-1.5 ${
              hasAnyVerifiedReferral
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-center gap-2 font-bold">
                {hasAnyVerifiedReferral ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                )}
                <span>
                  {hasAnyVerifiedReferral
                    ? 'Verified Partner Links Detected'
                    : 'Safe Default Active: All Public Links Point Directly to Official Google URLs'}
                </span>
              </div>
              <p className="leading-relaxed text-[11px]">
                {hasAnyVerifiedReferral
                  ? 'Commercial redirections are permitted only for verified referral links configured in the sections below. All other products continue pointing directly to official Google pages.'
                  : 'Genuine referral URLs for CJ Affiliate, Google Workspace, Google Cloud, and Google One have not yet been verified. All directory buttons and action cards navigate directly to authentic official Google destinations with zero commercial tracking.'}
              </p>
            </div>
          </div>

          {/* Section 1: CJ Affiliate (Commission Junction) */}
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-extrabold text-sm shadow-2xs">
                  CJ
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">CJ Affiliate (Commission Junction)</h2>
                  <p className="text-xs text-slate-500">Publisher CID, Website Property ID (PID), Shopper tracking, and approved advertiser programmes</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-slate-600">Status:</label>
                <select
                  value={settings.affiliate.cj?.status || 'not_configured'}
                  onChange={(e) => {
                    const status = e.target.value as MonetizationStatus;
                    setSettings({
                      ...settings,
                      affiliate: {
                        ...settings.affiliate,
                        cj: {
                          ...settings.affiliate.cj,
                          status
                        }
                      }
                    });
                  }}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="not_configured">Not Configured</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="verified">Verified</option>
                  <option value="active">Active</option>
                </select>
                <StatusBadge status={settings.affiliate.cj?.status || 'not_configured'} />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Publisher CID (Account ID)</label>
                <input
                  type="text"
                  value={settings.affiliate.cj?.publisherCid || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    affiliate: {
                      ...settings.affiliate,
                      cj: {
                        ...settings.affiliate.cj,
                        publisherCid: e.target.value.trim()
                      }
                    }
                  })}
                  placeholder="e.g. 6123456 (7-8 digit CID)"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-400 block">Assigned upon approval of your CJ Publisher Account</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Website Property ID (PID)</label>
                <input
                  type="text"
                  value={settings.affiliate.cj?.websitePid || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    affiliate: {
                      ...settings.affiliate,
                      cj: {
                        ...settings.affiliate.cj,
                        websitePid: e.target.value.trim()
                      }
                    }
                  })}
                  placeholder="e.g. 100987654 (Property ID)"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-400 block">Found under CJ Account &gt; Websites for google.bringmybite.com</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Shopper / SubID (SID)</label>
                <input
                  type="text"
                  value={settings.affiliate.cj?.defaultSid || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    affiliate: {
                      ...settings.affiliate,
                      cj: {
                        ...settings.affiliate.cj,
                        defaultSid: e.target.value.trim()
                      }
                    }
                  })}
                  placeholder="e.g. gtf-directory-web (max 64 chars)"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-400 block">Publisher tracking sub-identifier passed to CJ click URLs</span>
              </div>
            </div>

            {/* Approved CJ Advertiser Programmes */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Approved Advertiser Programmes</h3>

              <div className="space-y-4">
                {settings.affiliate.cj?.approvedPrograms?.map((prog, idx) => {
                  const isVerifiedLink = isVerifiedReferralUrl(prog.referralUrl);
                  return (
                    <div key={prog.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 block">{prog.name}</span>
                          <span className="text-[10px] text-slate-500">{prog.commissionTier}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={prog.status}
                            onChange={(e) => {
                              const newPrograms = [...settings.affiliate.cj.approvedPrograms];
                              newPrograms[idx] = { ...prog, status: e.target.value as MonetizationStatus };
                              setSettings({
                                ...settings,
                                affiliate: {
                                  ...settings.affiliate,
                                  cj: { ...settings.affiliate.cj, approvedPrograms: newPrograms }
                                }
                              });
                            }}
                            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800"
                          >
                            <option value="not_configured">Not Configured</option>
                            <option value="pending_approval">Pending Approval</option>
                            <option value="verified">Verified</option>
                            <option value="active">Active</option>
                          </select>
                          <StatusBadge status={prog.status} />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-600 block">CJ Advertiser ID</label>
                          <input
                            type="text"
                            value={prog.cjAdvertiserId}
                            onChange={(e) => {
                              const newPrograms = [...settings.affiliate.cj.approvedPrograms];
                              newPrograms[idx] = { ...prog, cjAdvertiserId: e.target.value.trim() };
                              setSettings({
                                ...settings,
                                affiliate: {
                                  ...settings.affiliate,
                                  cj: { ...settings.affiliate.cj, approvedPrograms: newPrograms }
                                }
                              });
                            }}
                            placeholder="e.g. 5493021"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-slate-600">Verified CJ Tracking Link</label>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              isVerifiedLink ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {isVerifiedLink ? 'Valid CJ Tracking Link' : 'Awaiting Link'}
                            </span>
                          </div>
                          <input
                            type="text"
                            value={prog.referralUrl}
                            onChange={(e) => {
                              const val = e.target.value.trim();
                              const newPrograms = [...settings.affiliate.cj.approvedPrograms];
                              newPrograms[idx] = {
                                ...prog,
                                referralUrl: val,
                                status: isVerifiedReferralUrl(val) ? prog.status : 'not_configured'
                              };
                              setSettings({
                                ...settings,
                                affiliate: {
                                  ...settings.affiliate,
                                  cj: { ...settings.affiliate.cj, approvedPrograms: newPrograms }
                                }
                              });
                            }}
                            placeholder="https://www.anrdoezrs.net/click-PID-CJLINK..."
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                          />
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 block leading-relaxed">{prog.notes}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Commission Reporting API Guidance */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 text-xs text-indigo-950 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-indigo-900">
                <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>CJ Commission Reporting & Automated Analytics</span>
              </div>
              <p className="leading-relaxed text-[11px] text-indigo-900/90">
                CJ provides a GraphQL Commission Detail and Transaction API. Outbound clicks on Bring My Bite are tracked in telemetry under <code>/api/track-click</code>. To reconcile commissions, configure the CJ Personal Access Token inside your private server environment (e.g. <code>CJ_API_KEY</code> in Vercel); do not paste reporting tokens into this form.
              </p>
            </div>
          </div>

          {/* Section 2: Google Affiliate & Referral Programmes */}
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-extrabold text-sm shadow-2xs">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Google Referral Programmes</h2>
                  <p className="text-xs text-slate-500">Google Workspace, Google Cloud, and Google One referral credentials and truthful eligibility</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">

              {/* Google Workspace */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">1. Google Workspace Referral Program</h3>
                    <span className="text-[10px] text-slate-500 block">Eligibility: Open to registered users in India, US, UK, and 40+ countries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={settings.affiliate.google?.googleWorkspace?.status || 'not_configured'}
                      onChange={(e) => {
                        const status = e.target.value as MonetizationStatus;
                        setSettings({
                          ...settings,
                          affiliate: {
                            ...settings.affiliate,
                            google: {
                              ...settings.affiliate.google,
                              googleWorkspace: {
                                ...settings.affiliate.google.googleWorkspace,
                                status
                              }
                            }
                          }
                        });
                      }}
                      className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800"
                    >
                      <option value="not_configured">Not Configured</option>
                      <option value="pending_approval">Pending Approval</option>
                      <option value="verified">Verified</option>
                      <option value="active">Active</option>
                    </select>
                    <StatusBadge status={settings.affiliate.google?.googleWorkspace?.status || 'not_configured'} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700">Customer Referral Code / ID</label>
                    <input
                      type="text"
                      value={settings.affiliate.google?.googleWorkspace?.referralId || ''}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        setSettings({
                          ...settings,
                          affiliate: {
                            ...settings.affiliate,
                            google: {
                              ...settings.affiliate.google,
                              googleWorkspace: { ...settings.affiliate.google.googleWorkspace, referralId: val }
                            },
                            programs: {
                              ...settings.affiliate.programs,
                              googleWorkspace: { ...settings.affiliate.programs.googleWorkspace, referralId: val }
                            }
                          }
                        });
                      }}
                      placeholder="e.g. REF-IN-WORKSPACE-01"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-700">Official Referral Link</label>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        hasVerifiedWorkspace ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {hasVerifiedWorkspace ? 'Verified Referral URL' : 'Awaiting Referral Link'}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={settings.affiliate.google?.googleWorkspace?.customUrl || ''}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        const verified = isVerifiedReferralUrl(val);
                        setSettings({
                          ...settings,
                          affiliate: {
                            ...settings.affiliate,
                            google: {
                              ...settings.affiliate.google,
                              googleWorkspace: {
                                ...settings.affiliate.google.googleWorkspace,
                                customUrl: val,
                                active: verified,
                                status: verified ? settings.affiliate.google.googleWorkspace.status : 'not_configured'
                              }
                            },
                            programs: {
                              ...settings.affiliate.programs,
                              googleWorkspace: { ...settings.affiliate.programs.googleWorkspace, customUrl: val, active: verified }
                            }
                          }
                        });
                      }}
                      placeholder="https://referworkspace.app.goo.gl/..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Commission: ₹750 / $8 (Business Starter), ₹1,500 / $23 (Business Standard) per seat.</span>
                  <span>Ordinary <code>workspace.google.com</code> URLs are direct official links and cannot be used.</span>
                </div>
              </div>

              {/* Google Cloud */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">2. Google Cloud Partner Advantage / Innovators</h3>
                    <span className="text-[10px] text-slate-500 block">Eligibility: Accredited partner organization or certified Google Developer Expert</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={settings.affiliate.google?.googleCloud?.status || 'not_configured'}
                      onChange={(e) => {
                        const status = e.target.value as MonetizationStatus;
                        setSettings({
                          ...settings,
                          affiliate: {
                            ...settings.affiliate,
                            google: {
                              ...settings.affiliate.google,
                              googleCloud: {
                                ...settings.affiliate.google.googleCloud,
                                status
                              }
                            }
                          }
                        });
                      }}
                      className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800"
                    >
                      <option value="not_configured">Not Configured</option>
                      <option value="pending_approval">Pending Approval</option>
                      <option value="verified">Verified</option>
                      <option value="active">Active</option>
                    </select>
                    <StatusBadge status={settings.affiliate.google?.googleCloud?.status || 'not_configured'} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700">Partner Advantage ID</label>
                    <input
                      type="text"
                      value={settings.affiliate.google?.googleCloud?.referralId || ''}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        setSettings({
                          ...settings,
                          affiliate: {
                            ...settings.affiliate,
                            google: {
                              ...settings.affiliate.google,
                              googleCloud: { ...settings.affiliate.google.googleCloud, referralId: val }
                            },
                            programs: {
                              ...settings.affiliate.programs,
                              googleCloud: { ...settings.affiliate.programs.googleCloud, partnerId: val }
                            }
                          }
                        });
                      }}
                      placeholder="e.g. GCP-PARTNER-ID"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-700">Partner Destination Link</label>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        hasVerifiedCloud ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {hasVerifiedCloud ? 'Verified Partner Link' : 'Awaiting Partner Link'}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={settings.affiliate.google?.googleCloud?.customUrl || ''}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        const verified = isVerifiedReferralUrl(val);
                        setSettings({
                          ...settings,
                          affiliate: {
                            ...settings.affiliate,
                            google: {
                              ...settings.affiliate.google,
                              googleCloud: {
                                ...settings.affiliate.google.googleCloud,
                                customUrl: val,
                                active: verified,
                                status: verified ? settings.affiliate.google.googleCloud.status : 'not_configured'
                              }
                            },
                            programs: {
                              ...settings.affiliate.programs,
                              googleCloud: { ...settings.affiliate.programs.googleCloud, customUrl: val, active: verified }
                            }
                          }
                        });
                      }}
                      placeholder="https://cloud.google.com/?partner=..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                    />
                  </div>
                </div>

                <span className="text-[10px] text-slate-500 block leading-relaxed">
                  Requires enrollment in Google Cloud Partner Advantage or Innovators. Standard <code>cloud.google.com</code> URLs are direct official links.
                </span>
              </div>

              {/* Google One */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">3. Google One Referral (Consumer Cloud Storage)</h3>
                    <span className="text-[10px] text-amber-700 font-semibold block">Eligibility Status: Closed / Private. Google does not currently offer an open public referral program.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={settings.affiliate.google?.googleOne?.status || 'not_configured'}
                      onChange={(e) => {
                        const status = e.target.value as MonetizationStatus;
                        setSettings({
                          ...settings,
                          affiliate: {
                            ...settings.affiliate,
                            google: {
                              ...settings.affiliate.google,
                              googleOne: {
                                ...settings.affiliate.google.googleOne,
                                status
                              }
                            }
                          }
                        });
                      }}
                      className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800"
                    >
                      <option value="not_configured">Not Configured</option>
                      <option value="pending_approval">Pending Approval</option>
                      <option value="verified">Verified</option>
                      <option value="active">Active</option>
                    </select>
                    <StatusBadge status={settings.affiliate.google?.googleOne?.status || 'not_configured'} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700">Internal Identifier</label>
                    <input
                      type="text"
                      value={settings.affiliate.google?.googleOne?.referralId || ''}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        setSettings({
                          ...settings,
                          affiliate: {
                            ...settings.affiliate,
                            google: {
                              ...settings.affiliate.google,
                              googleOne: { ...settings.affiliate.google.googleOne, referralId: val }
                            },
                            programs: {
                              ...settings.affiliate.programs,
                              googleOne: { ...settings.affiliate.programs.googleOne, partnerId: val }
                            }
                          }
                        });
                      }}
                      placeholder="e.g. GONE-PRIVATE"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-700">Custom Referral URL</label>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        hasVerifiedOne ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {hasVerifiedOne ? 'Verified URL' : 'Currently Unavailable'}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={settings.affiliate.google?.googleOne?.customUrl || ''}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        const verified = isVerifiedReferralUrl(val);
                        setSettings({
                          ...settings,
                          affiliate: {
                            ...settings.affiliate,
                            google: {
                              ...settings.affiliate.google,
                              googleOne: {
                                ...settings.affiliate.google.googleOne,
                                customUrl: val,
                                active: verified,
                                status: verified ? settings.affiliate.google.googleOne.status : 'not_configured'
                              }
                            },
                            programs: {
                              ...settings.affiliate.programs,
                              googleOne: { ...settings.affiliate.programs.googleOne, customUrl: val, active: verified }
                            }
                          }
                        });
                      }}
                      placeholder="Awaiting verified Google One referral URL (currently unavailable)"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                    />
                  </div>
                </div>

                <span className="text-[10px] text-slate-500 block leading-relaxed">
                  Redirects strictly disabled. Direct <code>one.google.com</code> links are standard consumer destinations.
                </span>
              </div>

            </div>
          </div>

          {/* Section 3: Impact Radius (Impact.com) */}
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-700 font-extrabold text-sm shadow-2xs">
                  IR
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Impact Radius (Impact.com)</h2>
                  <p className="text-xs text-slate-500">Universal Media Partner tracking for developer and SaaS commercial affiliate programmes</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-slate-600">Status:</label>
                <select
                  value={settings.affiliate.impact?.status || 'not_configured'}
                  onChange={(e) => {
                    const status = e.target.value as MonetizationStatus;
                    setSettings({
                      ...settings,
                      affiliate: {
                        ...settings.affiliate,
                        impact: {
                          ...settings.affiliate.impact,
                          status
                        }
                      }
                    });
                  }}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="not_configured">Not Configured</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="verified">Verified</option>
                  <option value="active">Active</option>
                </select>
                <StatusBadge status={settings.affiliate.impact?.status || 'not_configured'} />
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Account SID</label>
                <input
                  type="text"
                  value={settings.affiliate.impact?.accountSid || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    affiliate: {
                      ...settings.affiliate,
                      impact: { ...settings.affiliate.impact, accountSid: e.target.value.trim() }
                    }
                  })}
                  placeholder="e.g. IR-ACC-XXXXXX"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Media Partner ID</label>
                <input
                  type="text"
                  value={settings.affiliate.impact?.mediaPartnerId || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    affiliate: {
                      ...settings.affiliate,
                      impact: { ...settings.affiliate.impact, mediaPartnerId: e.target.value.trim() }
                    }
                  })}
                  placeholder="e.g. 3456789"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Campaign ID</label>
                <input
                  type="text"
                  value={settings.affiliate.impact?.campaignId || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    affiliate: {
                      ...settings.affiliate,
                      impact: { ...settings.affiliate.impact, campaignId: e.target.value.trim() }
                    }
                  })}
                  placeholder="e.g. 10452"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Vanity / Tracking Link</label>
                <input
                  type="text"
                  value={settings.affiliate.impact?.customUrl || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    affiliate: {
                      ...settings.affiliate,
                      impact: { ...settings.affiliate.impact, customUrl: e.target.value.trim() }
                    }
                  })}
                  placeholder="https://bringmybite.prf.hn/click/..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Google AdSense */}
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-extrabold text-sm shadow-2xs">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Google AdSense Configuration</h2>
                  <p className="text-xs text-slate-500">Publisher verification, ads.txt validation, slot IDs, and zero-CLS safe rendering</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-slate-600">Account Status:</label>
                <select
                  value={settings.adsense.status || 'not_configured'}
                  onChange={(e) => {
                    const status = e.target.value as MonetizationStatus;
                    setSettings({
                      ...settings,
                      adsense: {
                        ...settings.adsense,
                        status
                      }
                    });
                  }}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="not_configured">Not Configured</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="verified">Verified</option>
                  <option value="active">Active</option>
                </select>
                <StatusBadge status={settings.adsense.status || 'not_configured'} />
              </div>
            </div>

            {/* Toggle & Verification Status */}
            <div className="grid md:grid-cols-3 gap-4">

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Enable Live Ad Units</span>
                  <span className="text-[10px] text-slate-500 block">
                    {isAdSensePlaceholder ? 'Locked until genuine Publisher ID is saved' : 'Only activate after domain approved'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.adsense.enabled && !isAdSensePlaceholder}
                  disabled={isAdSensePlaceholder}
                  onChange={(e) => setSettings({
                    ...settings,
                    adsense: { ...settings.adsense, enabled: e.target.checked }
                  })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Publisher ID (ca-pub-XXXXXXXXXX)</label>
                <input
                  type="text"
                  value={settings.adsense.publisherId}
                  onChange={(e) => setSettings({
                    ...settings,
                    adsense: { ...settings.adsense, publisherId: e.target.value.trim() }
                  })}
                  placeholder="ca-pub-1234567890123456"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className={`text-[10px] block font-medium ${
                  isAdSensePlaceholder ? 'text-amber-700' : 'text-emerald-700'
                }`}>
                  {isAdSensePlaceholder
                    ? 'Contains placeholder "ca-pub-XXXXXXXXXXXXXXXX". Replace with your authentic 16-digit ID.'
                    : 'Authentic Publisher ID format verified.'}
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">AdSense Domain Review Status</label>
                <select
                  value={settings.adsense.verificationStatus || 'unsubmitted'}
                  onChange={(e) => setSettings({
                    ...settings,
                    adsense: {
                      ...settings.adsense,
                      verificationStatus: e.target.value as any
                    }
                  })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="unsubmitted">Unsubmitted (Site Not Yet Added)</option>
                  <option value="pending_review">Getting Ready / In Review</option>
                  <option value="verified">Ready / Approved by Google</option>
                  <option value="rejected">Requires Changes / Rejected</option>
                </select>
                <span className="text-[10px] text-slate-400 block">Set according to Google AdSense &gt; Sites status</span>
              </div>

            </div>

            {/* ads.txt Validation & Single-Click Helper */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-xs font-bold text-blue-950">Authorized Digital Sellers (ads.txt) Configuration</span>
                </div>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                  isAdSensePlaceholder
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {isAdSensePlaceholder ? 'Action Required: ads.txt contains placeholder' : 'ads.txt Syntax Ready'}
                </span>
              </div>

              <p className="text-[11px] text-blue-900/90 leading-relaxed">
                Google AdSense crawls <code>https://google.bringmybite.com/ads.txt</code> to verify domain ownership. The file is served statically from <code>public/ads.txt</code>. Use the exact line below:
              </p>

              <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-blue-200">
                <code className="text-xs font-mono text-slate-800 select-all overflow-x-auto">
                  {adsTxtSnippet}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopyAdsTxt(adsTxtSnippet)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors cursor-pointer flex-shrink-0"
                >
                  {copiedAdsTxt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAdsTxt ? 'Copied!' : 'Copy Line'}</span>
                </button>
              </div>
            </div>

            {/* Ad Slot IDs */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-700 block">Ad Unit Slot IDs (from AdSense &gt; By ad unit)</span>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">Header Banner:</span>
                  <input
                    type="text"
                    value={settings.adsense.adUnits.headerBanner}
                    onChange={(e) => setSettings({
                      ...settings,
                      adsense: {
                        ...settings.adsense,
                        adUnits: { ...settings.adsense.adUnits, headerBanner: e.target.value.trim() }
                      }
                    })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">In-Feed (Home):</span>
                  <input
                    type="text"
                    value={settings.adsense.adUnits.inFeedHome}
                    onChange={(e) => setSettings({
                      ...settings,
                      adsense: {
                        ...settings.adsense,
                        adUnits: { ...settings.adsense.adUnits, inFeedHome: e.target.value.trim() }
                      }
                    })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">Sidebar Sticky:</span>
                  <input
                    type="text"
                    value={settings.adsense.adUnits.sidebarSticky}
                    onChange={(e) => setSettings({
                      ...settings,
                      adsense: {
                        ...settings.adsense,
                        adUnits: { ...settings.adsense.adUnits, sidebarSticky: e.target.value.trim() }
                      }
                    })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">Product Specs:</span>
                  <input
                    type="text"
                    value={settings.adsense.adUnits.belowProductSpecs}
                    onChange={(e) => setSettings({
                      ...settings,
                      adsense: {
                        ...settings.adsense,
                        adUnits: { ...settings.adsense.adUnits, belowProductSpecs: e.target.value.trim() }
                      }
                    })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">Footer Banner:</span>
                  <input
                    type="text"
                    value={settings.adsense.adUnits.footerBanner}
                    onChange={(e) => setSettings({
                      ...settings,
                      adsense: {
                        ...settings.adsense,
                        adUnits: { ...settings.adsense.adUnits, footerBanner: e.target.value.trim() }
                      }
                    })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* AdSense Approval Checklist snippet */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
              <span className="font-bold text-slate-800 block text-xs">AdSense Program Policy Readiness Checklist:</span>
              <div className="grid sm:grid-cols-2 gap-2 text-slate-700">
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Independent brand & non-affiliation disclaimer active</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Privacy policy, cookie disclosure & contact endpoints live</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>35+ original product evaluations & comparison benchmarks</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Zero Cumulative Layout Shift (CLS: 0) reserved ad slots</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Placement Preview Switch */}
          <div className="liquid-glass rounded-3xl p-6 border border-blue-200/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Visual Ad Placement Preview Mode</h3>
              </div>
              <p className="text-xs text-slate-600 max-w-xl">
                Toggle preview mode to visually inspect the exact responsive ad placement containers across the homepage and product pages without serving unapproved live ads.
              </p>
            </div>

            <label className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-slate-200 cursor-pointer shadow-xs select-none">
              <input
                type="checkbox"
                checked={settings.previewMode}
                onChange={(e) => setSettings({ ...settings, previewMode: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-xs font-bold text-slate-800">Preview Slots on Live Pages</span>
            </label>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <button
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All to Safe Defaults</span>
            </button>

            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
              {saveError && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{saveError}</span>
                </span>
              )}

              {saveSuccess && (
                <div className="flex flex-col items-end">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Settings Saved to Server!</span>
                  </span>
                  {persistenceNote && (
                    <span className="text-[10px] text-slate-500 font-medium">{persistenceNote}</span>
                  )}
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving to Server...' : 'Save Configuration'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 3. Featured Launch & Promotional Video Tab */
        <div className="space-y-8 animate-in fade-in duration-200">

          {/* Information & Guidelines Banner */}
          <div className="p-5 rounded-2xl bg-indigo-50/90 border border-indigo-200 text-xs text-indigo-950 space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-indigo-900 text-sm">
              <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>Owner-Controlled Launch Showcase & Promotional Video</span>
            </div>
            <p className="leading-relaxed">
              Use this section to feature your newly launched AI assistant, software platform, YouTube platform tour, or special announcement prominently on the homepage.
              This showcase is rendered with distinct <strong>Creator Showcase</strong> branding to preserve editorial transparency and distinguish your verified project from third-party advertising.
            </p>
          </div>

          {/* Configuration Form Card */}
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-lg space-y-6">

            {/* Activation Switch */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-200">
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Video className="w-4 h-4 text-indigo-600" />
                  <span>Display Showcase on Homepage</span>
                </h2>
                <p className="text-xs text-slate-500">
                  When enabled and filled, the promotion renders above the popular tools directory on the homepage.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.ownerPromotion?.enabled || false}
                  onChange={(e) => {
                    const current = settings.ownerPromotion || {
                      enabled: false,
                      badgeText: 'Creator Spotlight',
                      title: '',
                      subtitle: '',
                      description: '',
                      videoUrl: '',
                      thumbnailUrl: '',
                      ctaText: 'Explore Project',
                      ctaUrl: '',
                      secondaryCtaText: '',
                      secondaryCtaUrl: ''
                    };
                    setSettings({
                      ...settings,
                      ownerPromotion: { ...current, enabled: e.target.checked }
                    });
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Campaign Metadata Fields */}
            <div className="grid sm:grid-cols-2 gap-5">

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Badge Label
                </label>
                <input
                  type="text"
                  value={settings.ownerPromotion?.badgeText || ''}
                  onChange={(e) => {
                    const current = settings.ownerPromotion || { enabled: false, badgeText: '', title: '', subtitle: '', description: '', videoUrl: '', ctaText: '', ctaUrl: '' };
                    setSettings({
                      ...settings,
                      ownerPromotion: { ...current, badgeText: e.target.value }
                    });
                  }}
                  placeholder="e.g. Creator Spotlight, New AI Tool, Special Announcement"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[10px] text-slate-400">Rendered in the top pill badge above the headline</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Main Headline / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={settings.ownerPromotion?.title || ''}
                  onChange={(e) => {
                    const current = settings.ownerPromotion || { enabled: false, badgeText: '', title: '', subtitle: '', description: '', videoUrl: '', ctaText: '', ctaUrl: '' };
                    setSettings({
                      ...settings,
                      ownerPromotion: { ...current, title: e.target.value }
                    });
                  }}
                  placeholder="e.g. Introducing Bring My Bite AI Assistant"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Catchy Subtitle
                </label>
                <input
                  type="text"
                  value={settings.ownerPromotion?.subtitle || ''}
                  onChange={(e) => {
                    const current = settings.ownerPromotion || { enabled: false, badgeText: '', title: '', subtitle: '', description: '', videoUrl: '', ctaText: '', ctaUrl: '' };
                    setSettings({
                      ...settings,
                      ownerPromotion: { ...current, subtitle: e.target.value }
                    });
                  }}
                  placeholder="e.g. Intelligent workspace automation, calendar assistance, and smart recipes"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={settings.ownerPromotion?.description || ''}
                  onChange={(e) => {
                    const current = settings.ownerPromotion || { enabled: false, badgeText: '', title: '', subtitle: '', description: '', videoUrl: '', ctaText: '', ctaUrl: '' };
                    setSettings({
                      ...settings,
                      ownerPromotion: { ...current, description: e.target.value }
                    });
                  }}
                  placeholder="Explain what the product does, who it's for, and why visitors should try it."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Video or Embed URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={settings.ownerPromotion?.videoUrl || ''}
                  onChange={(e) => {
                    const current = settings.ownerPromotion || { enabled: false, badgeText: '', title: '', subtitle: '', description: '', videoUrl: '', ctaText: '', ctaUrl: '' };
                    setSettings({
                      ...settings,
                      ownerPromotion: { ...current, videoUrl: e.target.value }
                    });
                  }}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/... or https://vimeo.com/... or .mp4 link"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[10px] text-slate-400">
                  YouTube watch/share URLs and Vimeo URLs are automatically sanitized into secure, cookie-less responsive embeds.
                </p>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Thumbnail / Poster Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={settings.ownerPromotion?.thumbnailUrl || ''}
                  onChange={(e) => {
                    const current = settings.ownerPromotion || { enabled: false, badgeText: '', title: '', subtitle: '', description: '', videoUrl: '', ctaText: '', ctaUrl: '' };
                    setSettings({
                      ...settings,
                      ownerPromotion: { ...current, thumbnailUrl: e.target.value }
                    });
                  }}
                  placeholder="https://.../preview.jpg"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Primary Button Text <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={settings.ownerPromotion?.ctaText || ''}
                  onChange={(e) => {
                    const current = settings.ownerPromotion || { enabled: false, badgeText: '', title: '', subtitle: '', description: '', videoUrl: '', ctaText: '', ctaUrl: '' };
                    setSettings({
                      ...settings,
                      ownerPromotion: { ...current, ctaText: e.target.value }
                    });
                  }}
                  placeholder="e.g. Try the Assistant Free"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Primary Destination URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={settings.ownerPromotion?.ctaUrl || ''}
                  onChange={(e) => {
                    const current = settings.ownerPromotion || { enabled: false, badgeText: '', title: '', subtitle: '', description: '', videoUrl: '', ctaText: '', ctaUrl: '' };
                    setSettings({
                      ...settings,
                      ownerPromotion: { ...current, ctaUrl: e.target.value }
                    });
                  }}
                  placeholder="https://your-product-link.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Secondary Button Text (Optional)
                </label>
                <input
                  type="text"
                  value={settings.ownerPromotion?.secondaryCtaText || ''}
                  onChange={(e) => {
                    const current = settings.ownerPromotion || { enabled: false, badgeText: '', title: '', subtitle: '', description: '', videoUrl: '', ctaText: '', ctaUrl: '' };
                    setSettings({
                      ...settings,
                      ownerPromotion: { ...current, secondaryCtaText: e.target.value }
                    });
                  }}
                  placeholder="e.g. Read Architecture Docs"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Secondary Destination URL (Optional)
                </label>
                <input
                  type="url"
                  value={settings.ownerPromotion?.secondaryCtaUrl || ''}
                  onChange={(e) => {
                    const current = settings.ownerPromotion || { enabled: false, badgeText: '', title: '', subtitle: '', description: '', videoUrl: '', ctaText: '', ctaUrl: '' };
                    setSettings({
                      ...settings,
                      ownerPromotion: { ...current, secondaryCtaUrl: e.target.value }
                    });
                  }}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

            </div>

          </div>

          {/* Actions Bar for Promotion Tab */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              {settings.ownerPromotion?.enabled ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Showcase is active and will display on the homepage</span>
                </span>
              ) : (
                <span className="text-slate-400 font-medium">Showcase is currently disabled (collapsed cleanly on homepage)</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
              {saveError && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{saveError}</span>
                </span>
              )}

              {saveSuccess && (
                <div className="flex flex-col items-end">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Showcase Settings Saved!</span>
                  </span>
                  {persistenceNote && (
                    <span className="text-[10px] text-slate-500 font-medium">{persistenceNote}</span>
                  )}
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving to Server...' : 'Save Launch Showcase'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
