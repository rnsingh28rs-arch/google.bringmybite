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
  Play
} from 'lucide-react';
import { 
  getMonetizationSettings, 
  saveMonetizationSettings, 
  MonetizationSettings 
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold shadow-2xs">
              <Settings className="w-3.5 h-3.5" />
              <span>Platform Monetisation & AdSense Readiness Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bring My Bite Monetisation Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Configure future Google AdSense ad units, affiliate tracking identifiers, and visual slot previews with safe defaults and zero layout shift.
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
          <span>AdSense & Affiliate Settings</span>
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
              <span>Security Architecture & Public vs Private Credentials</span>
            </div>
            <p className="leading-relaxed">
              <strong>Important Security Boundary:</strong> Google AdSense publisher IDs (`ca-pub-XXXXXXXXXXXXXXXX`) and slot IDs are public identifiers intended for HTML placement. 
              However, payout bank details, tax documents (W-8BEN/GSTIN), and private API client secrets must <strong>never</strong> be committed to frontend code. Those must be configured exclusively in the official Google AdSense or affiliate platform dashboard.
            </p>
          </div>

          {/* Main Settings Tabs / Cards */}
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            
            {/* 1. Google AdSense Configuration */}
            <div className="liquid-glass rounded-3xl p-6 border border-white/80 shadow-lg space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl glass-icon-blue flex items-center justify-center text-blue-600 shadow-2xs">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">Google AdSense</h3>
                      <span className="text-[10px] text-slate-500 font-semibold">Display Advertising Framework</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    settings.adsense.enabled 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {settings.adsense.enabled ? 'Enabled' : 'Inactive (Safe Default)'}
                  </span>
                </div>

                {/* Toggle Active */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Enable AdSense Units</span>
                    <span className="text-[10px] text-slate-500">Only enable after Google approves domain</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.adsense.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      adsense: { ...settings.adsense, enabled: e.target.checked }
                    })}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                {/* Publisher ID */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Publisher ID (ca-pub-XXXXXXXXXX)</label>
                  <input
                    type="text"
                    value={settings.adsense.publisherId}
                    onChange={(e) => setSettings({
                      ...settings,
                      adsense: { ...settings.adsense, publisherId: e.target.value }
                    })}
                    placeholder="ca-pub-1234567890123456"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Ad Slot IDs */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-700 block">Ad Unit Slot IDs (from AdSense dashboard)</span>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Header Banner:</span>
                      <input
                        type="text"
                        value={settings.adsense.adUnits.headerBanner}
                        onChange={(e) => setSettings({
                          ...settings,
                          adsense: {
                            ...settings.adsense,
                            adUnits: { ...settings.adsense.adUnits, headerBanner: e.target.value }
                          }
                        })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">In-Feed (Directory):</span>
                      <input
                        type="text"
                        value={settings.adsense.adUnits.inFeedHome}
                        onChange={(e) => setSettings({
                          ...settings,
                          adsense: {
                            ...settings.adsense,
                            adUnits: { ...settings.adsense.adUnits, inFeedHome: e.target.value }
                          }
                        })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* AdSense Approval Checklist snippet */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <span className="font-bold text-slate-800 block text-xs">AdSense Application Readiness:</span>
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Independent editorial brand & non-affiliation disclaimer active</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Privacy policy & cookie disclosure accessible</span>
                </div>
              </div>
            </div>

            {/* 2. Affiliate Marketing Settings */}
            <div className="liquid-glass rounded-3xl p-6 border border-white/80 shadow-lg space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl glass-icon-emerald flex items-center justify-center text-emerald-600 shadow-2xs">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">Affiliate Partnerships</h3>
                      <span className="text-[10px] text-slate-500 font-semibold">Google Workspace & Cloud Referrals</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    settings.affiliate.enabled 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {settings.affiliate.enabled ? 'Active' : 'Inactive (Safe Default)'}
                  </span>
                </div>

                {/* Toggle Affiliate */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Enable Affiliate Link Redirections</span>
                    <span className="text-[10px] text-slate-500">Only redirects if valid target URL is set</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.affiliate.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      affiliate: { ...settings.affiliate, enabled: e.target.checked }
                    })}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Default Tracking Tag */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Tracking Identifier / Tag</label>
                  <input
                    type="text"
                    value={settings.affiliate.defaultTrackingTag}
                    onChange={(e) => setSettings({
                      ...settings,
                      affiliate: { ...settings.affiliate, defaultTrackingTag: e.target.value }
                    })}
                    placeholder="e.g. bringmybite-21"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Google Workspace Referral ID */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Google Workspace Referral Link Override</label>
                  <input
                    type="text"
                    value={settings.affiliate.programs.googleWorkspace.customUrl}
                    onChange={(e) => setSettings({
                      ...settings,
                      affiliate: {
                        ...settings.affiliate,
                        programs: {
                          ...settings.affiliate.programs,
                          googleWorkspace: {
                            ...settings.affiliate.programs.googleWorkspace,
                            customUrl: e.target.value,
                            active: e.target.value.length > 0
                          }
                        }
                      }
                    })}
                    placeholder="https://workspace.google.com/?ref=YOUR_REFERRAL_CODE"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    When empty, standard official Google Workspace URL is used with zero tracking.
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="font-bold text-slate-800 block text-xs">Affiliate Policy Notice:</span>
                <p className="mt-0.5 leading-relaxed">
                  Every commercial link displays a dedicated "Affiliate / Commercial Link" notice to ensure full transparency under FTC and consumer protection rules.
                </p>
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
                Toggle preview mode to visually see the exact responsive ad placement containers across the homepage and product pages without serving unapproved live ads.
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
