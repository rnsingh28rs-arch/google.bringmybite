import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MousePointerClick, 
  Sparkles, 
  Mail, 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Layers,
  Database,
  ExternalLink,
  Globe,
  Clock,
  Compass
} from 'lucide-react';

interface AdminAnalyticsData {
  overview: {
    totalRegisteredUsers: number;
    totalSubscribers: number;
    totalOutboundClicks: number;
    affiliateClicks: number;
    directClicks: number;
    authenticatedClicks: number;
    anonymousClicks: number;
    totalEnquiries: number;
    totalAssistantQueries: number;
    assistantSuccessCount: number;
    assistantUnconfiguredCount: number;
    storageType: string;
  };
  topDestinations: Array<{ destination: string; count: number }>;
  topSources: Array<{ source: string; count: number }>;
  topProducts: Array<{ slug: string; count: number }>;
  dailyTrends: Array<{ date: string; count: number }>;
  recentClicks: Array<{
    sourcePage: string;
    productSlug: string;
    destination: string;
    isAffiliate: boolean;
    sessionId?: string;
    userUid?: string;
    timestamp: string;
  }>;
  recentEnquiries: Array<{
    confirmationId: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    timestamp: string;
  }>;
  users: Array<{
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    provider: string;
    createdAt: string;
    lastLoginAt: string;
    savedToolsCount: number;
  }>;
  integrations: {
    adminPasswordConfigured: boolean;
    geminiConfigured: boolean;
    geminiModel?: string;
    resendConfigured: boolean;
    webhookConfigured: boolean;
    databaseType: string;
    adsenseStatus: string;
    affiliateStatus: string;
  };
}

interface AdminAnalyticsDashboardProps {
  token: string;
}

export const AdminAnalyticsDashboard: React.FC<AdminAnalyticsDashboardProps> = ({ token }) => {
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || `Failed to fetch analytics (HTTP ${res.status})`);
        return;
      }

      const resData = await res.json();
      if (resData.success && resData.data) {
        setData(resData.data);
      } else {
        setError('Unexpected analytics response structure');
      }
    } catch {
      setError('Network error connecting to administrative analytics API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [token]);

  if (isLoading && !data) {
    return (
      <div className="p-12 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
        <h3 className="text-sm font-bold text-slate-800">Loading Real Operations Telemetry...</h3>
        <p className="text-xs text-slate-500">Retrieving users, clicks, assistant telemetry and inquiries from persistent storage.</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-8 text-center space-y-4 bg-red-50 rounded-3xl border border-red-200">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
        <h3 className="text-base font-bold text-red-900">Analytics Retrieval Error</h3>
        <p className="text-xs text-red-700 max-w-md mx-auto">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-red-700 transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { overview, topDestinations, topSources, topProducts, dailyTrends, recentClicks, recentEnquiries, users, integrations } = data;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Live Operating Dashboard</h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            Real Persisted Data
          </span>
        </div>

        <button
          onClick={fetchAnalytics}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* 1. Overview KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Outbound Clicks */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Outbound Clicks</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <MousePointerClick className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{overview.totalOutboundClicks}</div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Direct: <strong>{overview.directClicks}</strong></span>
            <span>Affiliate: <strong>{overview.affiliateClicks}</strong></span>
          </div>
        </div>

        {/* Registered Users */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Registered Users</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{overview.totalRegisteredUsers}</div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Subscribers: <strong>{overview.totalSubscribers}</strong></span>
            <span>Auth UIDs: <strong>{users.length}</strong></span>
          </div>
        </div>

        {/* Gemini AI Assistant Queries */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">AI Assistant Queries</span>
            <div className="w-7 h-7 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{overview.totalAssistantQueries}</div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span className="text-emerald-600 font-medium">Delivered: {overview.assistantSuccessCount}</span>
            <span className="text-slate-400">Unconfigured: {overview.assistantUnconfiguredCount}</span>
          </div>
        </div>

        {/* Editorial Enquiries */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Editorial Inquiries</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Mail className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{overview.totalEnquiries}</div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Storage: <strong className="font-mono text-[10px]">{overview.storageType}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Anonymous vs Authenticated Activity */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-blue-600" />
          <span>Anonymous Visitor vs Authenticated Member Activity</span>
        </h3>
        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block">Total Tracked Actions</span>
            <span className="text-lg font-bold text-slate-900">{overview.totalOutboundClicks}</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block">Anonymous Sessions</span>
            <span className="text-lg font-bold text-slate-700">{overview.anonymousClicks}</span>
            <span className="text-[10px] text-slate-400 block">
              {overview.totalOutboundClicks > 0 ? `${Math.round((overview.anonymousClicks / overview.totalOutboundClicks) * 100)}% of total` : '0%'}
            </span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block">Authenticated Members</span>
            <span className="text-lg font-bold text-emerald-700">{overview.authenticatedClicks}</span>
            <span className="text-[10px] text-slate-400 block">
              {overview.totalOutboundClicks > 0 ? `${Math.round((overview.authenticatedClicks / overview.totalOutboundClicks) * 100)}% of total` : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Popular Products & Source Pages Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Tools / Products */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Popular Tools and Products</span>
          </h3>

          {topProducts.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 text-center">No product clicks recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {topProducts.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                  <span className="font-semibold text-slate-800 font-mono">{p.slug}</span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[11px]">
                    {p.count} {p.count === 1 ? 'click' : 'clicks'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Source Page Performance */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Source-Page Performance</span>
          </h3>

          {topSources.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 text-center">No source page clicks recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {topSources.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                  <span className="font-semibold text-slate-800 truncate max-w-[240px]">{s.source}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                    {s.count} {s.count === 1 ? 'referral' : 'referrals'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Top Destinations & Daily Activity Trends */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Outbound Destinations */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
            <span>Top Outbound Destinations</span>
          </h3>

          {topDestinations.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 text-center">No outbound destinations recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {topDestinations.map((d, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                  <span className="text-slate-700 font-mono text-[11px] truncate max-w-[260px]" title={d.destination}>
                    {d.destination}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[11px]">
                    {d.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Daily Activity Timeline */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>Daily Outbound Activity (30 Days)</span>
          </h3>

          {dailyTrends.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 text-center">No trend activity recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {dailyTrends.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                  <span className="font-mono text-slate-600 text-xs">{t.date}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${Math.min(100, t.count * 10)}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-900 w-8 text-right">{t.count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. Registered Users Table */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Registered Member Accounts ({users.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400">Deterministic Google UID mapped</span>
        </div>

        {users.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 italic bg-slate-50 rounded-xl">
            No registered users recorded yet. Users register only when explicitly saving tools to their stack.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Member</th>
                  <th className="p-2.5">UID</th>
                  <th className="p-2.5">Provider</th>
                  <th className="p-2.5">Registered</th>
                  <th className="p-2.5">Saved Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="p-2.5">
                      <div className="font-bold text-slate-900">{u.displayName}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="p-2.5 font-mono text-[11px] text-slate-500">{u.uid}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[10px]">
                        {u.provider}
                      </span>
                    </td>
                    <td className="p-2.5 text-[11px] text-slate-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold text-[10px]">
                        {u.savedToolsCount} saved
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. Contact Enquiries Stream */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-amber-600" />
          <span>Editorial Contact Enquiries ({recentEnquiries.length})</span>
        </h3>

        {recentEnquiries.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 italic bg-slate-50 rounded-xl">
            No contact enquiries received yet.
          </div>
        ) : (
          <div className="space-y-3">
            {recentEnquiries.map((e, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900">{e.name}</strong>
                    <span className="text-[11px] text-slate-400">&lt;{e.email}&gt;</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white text-slate-600 font-mono text-[10px] border border-slate-200">
                      {e.confirmationId}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(e.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="font-semibold text-blue-700 text-[11px]">{e.subject}</div>
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">{e.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Strict Monetization Performance Breakdown */}
      <div className="p-6 rounded-3xl bg-slate-900 text-slate-100 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-extrabold text-white">Monetization Integrity Audit</h3>
              <p className="text-[11px] text-slate-400">Strict separation of outbound clicks, unverified referrals, and actual revenue.</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
            No Fictional Revenue Policy
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-slate-400 text-[11px]">Total Outbound Clicks</span>
            <div className="text-xl font-black text-white">{overview.totalOutboundClicks}</div>
            <span className="text-[10px] text-slate-400">Direct destinations</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-slate-400 text-[11px]">Affiliate Referrals</span>
            <div className="text-xl font-black text-emerald-400">{overview.affiliateClicks}</div>
            <span className="text-[10px] text-slate-400">With tracking tag</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-slate-400 text-[11px]">Confirmed Conversions</span>
            <div className="text-xl font-black text-slate-300">0</div>
            <span className="text-[10px] text-amber-400">Awaiting Network Postback</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-slate-400 text-[11px]">Approved Commissions</span>
            <div className="text-xl font-black text-slate-300">$0.00</div>
            <span className="text-[10px] text-slate-500">Pending verified sales</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-slate-400 text-[11px]">Pending Commissions</span>
            <div className="text-xl font-black text-slate-300">$0.00</div>
            <span className="text-[10px] text-slate-500">Unconfirmed</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-slate-400 text-[11px]">AdSense Earnings</span>
            <div className="text-xl font-black text-slate-300">$0.00</div>
            <span className="text-[10px] text-amber-400">Pre-Approval Status</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-slate-400 text-[11px]">Sponsored Revenue</span>
            <div className="text-xl font-black text-slate-300">$0.00</div>
            <span className="text-[10px] text-slate-500">Zero active sponsorships</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-slate-400 text-[11px]">Other Revenue</span>
            <div className="text-xl font-black text-slate-300">$0.00</div>
            <span className="text-[10px] text-slate-500">None</span>
          </div>
        </div>

        <div className="p-3 bg-slate-800/60 rounded-xl text-[11px] text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Notice: In compliance with editorial integrity rules, outbound click numbers are never multiplied by estimated earnings or presented as actual revenue until verified by Google AdSense and affiliate network statements.</span>
        </div>
      </div>

      {/* 8. Integration & Configuration Status */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-blue-600" />
          <span>Server Integration and Environment Status</span>
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {/* Admin Auth */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-800">Admin Authorization</div>
              <div className="text-[10px] text-slate-500">Server-Side Bearer Token</div>
            </div>
            {integrations.adminPasswordConfigured ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
          </div>

          {/* Gemini AI */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-800">Gemini 3.1 Flash Lite</div>
              <div className="text-[10px] text-slate-500">GEMINI_API_KEY &bull; {integrations.geminiModel || 'gemini-3.1-flash-lite'}</div>
            </div>
            {integrations.geminiConfigured ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-semibold">Unconfigured</span>
            )}
          </div>

          {/* Resend Email */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-800">Email Dispatch</div>
              <div className="text-[10px] text-slate-500">RESEND_API_KEY</div>
            </div>
            {integrations.resendConfigured ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-semibold">Unconfigured</span>
            )}
          </div>

          {/* Contact Webhook */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-800">SSRF-Guarded Webhook</div>
              <div className="text-[10px] text-slate-500">CONTACT_WEBHOOK_URL</div>
            </div>
            {integrations.webhookConfigured ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 text-slate-600 font-semibold">None</span>
            )}
          </div>

          {/* Storage Database */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-800">Persistence Store</div>
              <div className="text-[10px] text-slate-500">{integrations.databaseType}</div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>

          {/* AdSense Status */}
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-800">Google AdSense</div>
              <div className="text-[10px] text-slate-500">Pre-Approval Ready</div>
            </div>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
        </div>
      </div>

    </div>
  );
};
