import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface GTFUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  provider?: string;
  createdAt: string;
  lastLoginAt: string;
  savedTools: string[];
  isAdmin?: boolean;
}

export interface OutboundClickRecord {
  id?: string;
  sourcePage: string;
  productSlug: string;
  destination: string;
  isAffiliate: boolean;
  sessionId?: string;
  userUid?: string;
  timestamp: string;
  userAgent?: string;
  clientIp?: string;
}

export interface SubscriberRecord {
  email: string;
  subscribedAt: string;
  unsubscribedAt?: string;
  ip?: string;
  providerSync?: string;
  status?: 'active' | 'unsubscribed' | string;
  unsubscribeToken?: string;
}

export interface ContactEnquiryRecord {
  confirmationId?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  timestamp?: string;
  clientIp?: string;
}

export interface AssistantUsageRecord {
  id?: string;
  promptLength: number;
  status: string;
  matchedCount: number;
  latencyMs?: number;
  timestamp: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch {}
  }
}

function readJsonFile<T>(filename: string, fallback: T): T {
  try {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJsonFile<T>(filename: string, data: T): boolean {
  try {
    ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch {
    return false;
  }
}

// In-memory fallback caches
let memoryUsers: GTFUser[] = [];
let memoryClicks: OutboundClickRecord[] = [];
let memorySubscribers: SubscriberRecord[] = [];
let memoryEnquiries: ContactEnquiryRecord[] = [];
let memoryAssistant: AssistantUsageRecord[] = [];

try {
  memoryUsers = readJsonFile<GTFUser[]>('users.json', []);
  memoryClicks = readJsonFile<OutboundClickRecord[]>('outbound-clicks.json', []);
  memorySubscribers = readJsonFile<SubscriberRecord[]>('subscribers.json', []);
  memoryEnquiries = readJsonFile<ContactEnquiryRecord[]>('enquiries.json', []);
  memoryAssistant = readJsonFile<AssistantUsageRecord[]>('assistant-usage.json', []);
} catch {}

// -------------------------------------------------------------
// SUPABASE CLIENT INITIALIZATION
// -------------------------------------------------------------
let _supabase: SupabaseClient | null = null;
let _supabaseInit = false;

export function getSupabaseClient(): SupabaseClient | null {
  if (_supabaseInit) return _supabase;
  _supabaseInit = true;

  const rawUrl = process.env.SUPABASE_URL || 'https://rzeryjravittrcvyzeid.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!rawUrl || !key || key.trim() === '' || key === 'your-supabase-anon-key') {
    return null;
  }

  try {
    const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
    _supabase = createClient(cleanUrl, key.trim(), {
      auth: { persistSession: false }
    });
    return _supabase;
  } catch (e) {
    console.warn('[Supabase Init Warning]', e);
    return null;
  }
}

const isProduction = () => process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

// -------------------------------------------------------------
// USER OPERATIONS
// -------------------------------------------------------------
export async function getUsers(): Promise<GTFUser[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('gtf_users').select('*');
      if (!error && Array.isArray(data)) {
        return data.map(r => ({
          uid: r.uid,
          email: r.email,
          displayName: r.display_name || undefined,
          photoURL: r.photo_url || undefined,
          provider: r.provider || 'google.com',
          createdAt: r.created_at || new Date().toISOString(),
          lastLoginAt: r.last_login_at || new Date().toISOString(),
          savedTools: Array.isArray(r.saved_tools) ? r.saved_tools : [],
          isAdmin: Boolean(r.is_admin)
        }));
      }
    } catch (e) {
      console.warn('[Supabase getUsers Notice]', e);
    }
  }

  const fromDisk = readJsonFile<GTFUser[]>('users.json', memoryUsers);
  memoryUsers = fromDisk;
  return memoryUsers;
}

export async function getUserById(uid: string): Promise<GTFUser | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('gtf_users').select('*').eq('uid', uid).maybeSingle();
      if (!error && data) {
        return {
          uid: data.uid,
          email: data.email,
          displayName: data.display_name || undefined,
          photoURL: data.photo_url || undefined,
          provider: data.provider || 'google.com',
          createdAt: data.created_at,
          lastLoginAt: data.last_login_at,
          savedTools: Array.isArray(data.saved_tools) ? data.saved_tools : [],
          isAdmin: Boolean(data.is_admin)
        };
      }
    } catch (e) {
      console.warn('[Supabase getUserById Notice]', e);
    }
  }

  const users = await getUsers();
  return users.find(u => u.uid === uid) || null;
}

export async function saveUser(user: GTFUser): Promise<GTFUser> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const dbPayload = {
        uid: user.uid,
        email: user.email,
        display_name: user.displayName || null,
        photo_url: user.photoURL || null,
        provider: user.provider || 'google.com',
        created_at: user.createdAt || new Date().toISOString(),
        last_login_at: user.lastLoginAt || new Date().toISOString(),
        saved_tools: user.savedTools || [],
        is_admin: Boolean(user.isAdmin)
      };

      const { data, error } = await supabase.from('gtf_users').upsert(dbPayload, { onConflict: 'uid' }).select().maybeSingle();
      if (!error && data) {
        return {
          uid: data.uid,
          email: data.email,
          displayName: data.display_name || undefined,
          photoURL: data.photo_url || undefined,
          provider: data.provider || 'google.com',
          createdAt: data.created_at,
          lastLoginAt: data.last_login_at,
          savedTools: Array.isArray(data.saved_tools) ? data.saved_tools : [],
          isAdmin: Boolean(data.is_admin)
        };
      }
      if (error && isProduction()) {
        throw new Error(`DATABASE_ERROR: ${error.message}`);
      }
    } catch (e: any) {
      if (isProduction()) throw e;
      console.warn('[Supabase saveUser Notice, falling back to disk]', e.message);
    }
  }

  const users = await getUsers();
  const existingIdx = users.findIndex(u => u.uid === user.uid);
  
  if (existingIdx >= 0) {
    users[existingIdx] = {
      ...users[existingIdx],
      ...user,
      createdAt: users[existingIdx].createdAt || user.createdAt,
      lastLoginAt: user.lastLoginAt || new Date().toISOString(),
      savedTools: Array.from(new Set([...(users[existingIdx].savedTools || []), ...(user.savedTools || [])]))
    };
  } else {
    users.push(user);
  }

  memoryUsers = users;
  const saved = writeJsonFile('users.json', users);
  if (!saved && isProduction()) {
    throw new Error('PERSISTENCE_FAILED');
  }
  return existingIdx >= 0 ? users[existingIdx] : user;
}

export async function toggleSavedTool(uid: string, toolSlug: string): Promise<{ saved: boolean; savedTools: string[] }> {
  const user = await getUserById(uid);
  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  const list = [...(user.savedTools || [])];
  const idx = list.indexOf(toolSlug);
  let isSaved = false;

  if (idx >= 0) {
    list.splice(idx, 1);
    isSaved = false;
  } else {
    list.push(toolSlug);
    isSaved = true;
  }

  user.savedTools = list;
  await saveUser(user);
  return { saved: isSaved, savedTools: list };
}

// -------------------------------------------------------------
// OUTBOUND CLICK OPERATIONS
// -------------------------------------------------------------
export async function getOutboundClicks(limit = 1000): Promise<OutboundClickRecord[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('gtf_outbound_clicks')
        .select('*')
        .order('id', { ascending: false })
        .limit(limit);
      if (!error && Array.isArray(data)) {
        return data.map(r => ({
          id: String(r.id),
          sourcePage: r.source_page,
          productSlug: r.product_slug,
          destination: r.destination,
          isAffiliate: Boolean(r.is_affiliate),
          sessionId: r.session_id || undefined,
          userUid: r.user_uid || undefined,
          timestamp: r.timestamp,
          userAgent: r.user_agent || undefined,
          clientIp: r.client_ip || undefined
        }));
      }
    } catch (e) {
      console.warn('[Supabase getOutboundClicks Notice]', e);
    }
  }

  const fromDisk = readJsonFile<OutboundClickRecord[]>('outbound-clicks.json', memoryClicks);
  memoryClicks = fromDisk;
  return memoryClicks.slice(-limit);
}

export async function recordOutboundClick(click: OutboundClickRecord): Promise<OutboundClickRecord> {
  const clicks = await getOutboundClicks(100);
  
  // Deduplicate rapid accidental double clicks within 3 seconds for same session and destination
  const now = new Date(click.timestamp).getTime();
  const isDuplicate = clicks.some(c => {
    const prevTime = new Date(c.timestamp).getTime();
    return (
      c.destination === click.destination &&
      Boolean(c.sessionId && click.sessionId && c.sessionId === click.sessionId) &&
      Math.abs(now - prevTime) < 3000
    );
  });

  if (isDuplicate) {
    return click;
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('gtf_outbound_clicks').insert({
        source_page: click.sourcePage,
        product_slug: click.productSlug,
        destination: click.destination,
        is_affiliate: Boolean(click.isAffiliate),
        session_id: click.sessionId || null,
        user_uid: click.userUid || null,
        timestamp: click.timestamp,
        user_agent: click.userAgent || null,
        client_ip: click.clientIp || null
      });
      if (!error) {
        return click;
      }
    } catch (e) {
      console.warn('[Supabase recordOutboundClick Notice]', e);
    }
  }

  const diskClicks = readJsonFile<OutboundClickRecord[]>('outbound-clicks.json', memoryClicks);
  diskClicks.push(click);
  const trimmed = diskClicks.slice(-2000);
  memoryClicks = trimmed;
  writeJsonFile('outbound-clicks.json', trimmed);
  return click;
}

// -------------------------------------------------------------
// SUBSCRIBER OPERATIONS
// -------------------------------------------------------------
export async function getSubscribers(activeOnly = false): Promise<SubscriberRecord[]> {
  let list: SubscriberRecord[] = [];
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('gtf_subscribers').select('*');
      if (!error && Array.isArray(data)) {
        list = data.map(r => ({
          email: r.email,
          subscribedAt: r.subscribed_at,
          unsubscribedAt: r.unsubscribed_at || undefined,
          ip: r.ip || undefined,
          providerSync: r.provider_sync || undefined,
          status: r.status || 'active'
        }));
      }
    } catch (e) {
      console.warn('[Supabase getSubscribers Notice]', e);
    }
  }

  if (list.length === 0) {
    const fromDisk = readJsonFile<SubscriberRecord[]>('subscribers.json', memorySubscribers);
    memorySubscribers = fromDisk;
    list = memorySubscribers;
  }

  if (activeOnly) {
    return list.filter(s => s.status !== 'unsubscribed');
  }
  return list;
}

export async function recordSubscriber(sub: SubscriberRecord): Promise<{ isNew: boolean; subscriber: SubscriberRecord }> {
  const normalized = sub.email.toLowerCase().trim();
  sub.email = normalized;
  sub.status = sub.status || 'active';
  sub.subscribedAt = sub.subscribedAt || new Date().toISOString();
  sub.providerSync = sub.providerSync || 'local_only';
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data: existing } = await supabase
        .from('gtf_subscribers')
        .select('*')
        .eq('email', normalized)
        .maybeSingle();

      if (existing) {
        // If already active, return existing
        if (existing.status !== 'unsubscribed') {
          return {
            isNew: false,
            subscriber: {
              email: existing.email,
              subscribedAt: existing.subscribed_at,
              unsubscribedAt: existing.unsubscribed_at || undefined,
              ip: existing.ip,
              providerSync: existing.provider_sync,
              status: existing.status
            }
          };
        }

        // If previously unsubscribed, reactivate!
        const { data: updated, error: updateError } = await supabase
          .from('gtf_subscribers')
          .update({
            status: 'active',
            subscribed_at: sub.subscribedAt,
            unsubscribed_at: null,
            ip: sub.ip || existing.ip,
            provider_sync: sub.providerSync
          })
          .eq('email', normalized)
          .select()
          .maybeSingle();

        if (!updateError && updated) {
          return {
            isNew: true,
            subscriber: {
              email: updated.email,
              subscribedAt: updated.subscribed_at,
              ip: updated.ip,
              providerSync: updated.provider_sync,
              status: 'active'
            }
          };
        }
      } else {
        const { data, error } = await supabase.from('gtf_subscribers').insert({
          email: normalized,
          subscribed_at: sub.subscribedAt || new Date().toISOString(),
          ip: sub.ip || null,
          provider_sync: sub.providerSync || 'local_only',
          status: 'active'
        }).select().maybeSingle();

        if (!error && data) {
          return {
            isNew: true,
            subscriber: {
              email: data.email,
              subscribedAt: data.subscribed_at,
              ip: data.ip,
              providerSync: data.provider_sync,
              status: data.status
            }
          };
        }
      }
      if (isProduction()) {
        throw new Error('DATABASE_ERROR');
      }
    } catch (e: any) {
      if (isProduction()) throw e;
      console.warn('[Supabase recordSubscriber Notice, fallback to disk]', e.message);
    }
  }

  const list = readJsonFile<SubscriberRecord[]>('subscribers.json', memorySubscribers);
  const existingIdx = list.findIndex(s => s.email.toLowerCase().trim() === normalized);
  
  if (existingIdx >= 0) {
    if (list[existingIdx].status === 'unsubscribed') {
      // Reactivate
      list[existingIdx] = {
        ...list[existingIdx],
        status: 'active',
        subscribedAt: new Date().toISOString(),
        unsubscribedAt: undefined,
        ip: sub.ip || list[existingIdx].ip
      };
      memorySubscribers = list;
      writeJsonFile('subscribers.json', list);
      return { isNew: true, subscriber: list[existingIdx] };
    }
    return { isNew: false, subscriber: list[existingIdx] };
  }

  list.push(sub);
  memorySubscribers = list;
  const saved = writeJsonFile('subscribers.json', list);
  if (!saved && isProduction()) {
    throw new Error('PERSISTENCE_FAILED');
  }
  return { isNew: true, subscriber: sub };
}

export async function unsubscribeSubscriber(email: string): Promise<{ success: boolean; subscriber?: SubscriberRecord }> {
  const normalized = email.toLowerCase().trim();
  const unsubscribedAt = new Date().toISOString();
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('gtf_subscribers')
        .update({
          status: 'unsubscribed',
          unsubscribed_at: unsubscribedAt
        })
        .eq('email', normalized)
        .select()
        .maybeSingle();

      if (!error && data) {
        return {
          success: true,
          subscriber: {
            email: data.email,
            subscribedAt: data.subscribed_at,
            unsubscribedAt: data.unsubscribed_at,
            status: 'unsubscribed'
          }
        };
      }
    } catch (e: any) {
      console.warn('[Supabase unsubscribe Notice, fallback to disk]', e.message);
    }
  }

  const list = readJsonFile<SubscriberRecord[]>('subscribers.json', memorySubscribers);
  const idx = list.findIndex(s => s.email.toLowerCase().trim() === normalized);

  if (idx >= 0) {
    list[idx] = {
      ...list[idx],
      status: 'unsubscribed',
      unsubscribedAt
    };
    memorySubscribers = list;
    writeJsonFile('subscribers.json', list);
    return { success: true, subscriber: list[idx] };
  }

  // Record an explicit opt-out entry even if previously not recorded locally
  const optOutRecord: SubscriberRecord = {
    email: normalized,
    subscribedAt: unsubscribedAt,
    unsubscribedAt,
    status: 'unsubscribed',
    providerSync: 'local_only'
  };
  list.push(optOutRecord);
  memorySubscribers = list;
  writeJsonFile('subscribers.json', list);
  return { success: true, subscriber: optOutRecord };
}

// -------------------------------------------------------------
// CONTACT ENQUIRY OPERATIONS
// -------------------------------------------------------------
export async function getContactEnquiries(limit = 200): Promise<ContactEnquiryRecord[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('gtf_contact_enquiries')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);
      if (!error && Array.isArray(data)) {
        return data.map(r => ({
          confirmationId: r.confirmation_id,
          name: r.name,
          email: r.email,
          subject: r.subject,
          message: r.message,
          status: r.status,
          timestamp: r.timestamp,
          clientIp: r.client_ip || undefined
        }));
      }
    } catch (e) {
      console.warn('[Supabase getContactEnquiries Notice]', e);
    }
  }

  const fromDisk = readJsonFile<ContactEnquiryRecord[]>('enquiries.json', memoryEnquiries);
  memoryEnquiries = fromDisk;
  return memoryEnquiries.slice(-limit);
}

export async function recordContactEnquiry(enquiry: ContactEnquiryRecord): Promise<ContactEnquiryRecord> {
  enquiry.confirmationId = enquiry.confirmationId || 'gtf_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  enquiry.timestamp = enquiry.timestamp || new Date().toISOString();
  enquiry.status = enquiry.status || 'queued_in_database';
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('gtf_contact_enquiries').insert({
        confirmation_id: enquiry.confirmationId,
        name: enquiry.name,
        email: enquiry.email,
        subject: enquiry.subject,
        message: enquiry.message,
        status: enquiry.status,
        timestamp: enquiry.timestamp,
        client_ip: enquiry.clientIp || null
      });
      if (!error) {
        return enquiry;
      }
      if (error && isProduction()) {
        throw new Error(`DATABASE_ERROR: ${error.message}`);
      }
    } catch (e: any) {
      if (isProduction()) throw e;
      console.warn('[Supabase recordContactEnquiry Notice, fallback to disk]', e.message);
    }
  }

  const list = readJsonFile<ContactEnquiryRecord[]>('enquiries.json', memoryEnquiries);
  list.push(enquiry);
  const trimmed = list.slice(-500);
  memoryEnquiries = trimmed;
  const saved = writeJsonFile('enquiries.json', trimmed);
  if (!saved && isProduction()) {
    throw new Error('PERSISTENCE_FAILED');
  }
  return enquiry;
}

// -------------------------------------------------------------
// ASSISTANT USAGE TELEMETRY
// -------------------------------------------------------------
export async function getAssistantUsage(): Promise<AssistantUsageRecord[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('gtf_assistant_queries')
        .select('*')
        .order('id', { ascending: false })
        .limit(1000);
      if (!error && Array.isArray(data)) {
        return data.map(r => ({
          id: String(r.id),
          promptLength: r.prompt_length,
          status: r.status,
          matchedCount: r.matched_count || 0,
          latencyMs: r.latency_ms || undefined,
          timestamp: r.timestamp
        }));
      }
    } catch (e) {
      console.warn('[Supabase getAssistantUsage Notice]', e);
    }
  }

  const fromDisk = readJsonFile<AssistantUsageRecord[]>('assistant-usage.json', memoryAssistant);
  memoryAssistant = fromDisk;
  return memoryAssistant;
}

export async function recordAssistantUsage(usage: AssistantUsageRecord): Promise<AssistantUsageRecord> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('gtf_assistant_queries').insert({
        prompt_length: usage.promptLength,
        status: usage.status,
        matched_count: usage.matchedCount,
        latency_ms: usage.latencyMs || null,
        timestamp: usage.timestamp
      });
      return usage;
    } catch (e) {
      console.warn('[Supabase recordAssistantUsage Notice]', e);
    }
  }

  const list = readJsonFile<AssistantUsageRecord[]>('assistant-usage.json', memoryAssistant);
  list.push(usage);
  const trimmed = list.slice(-1000);
  memoryAssistant = trimmed;
  writeJsonFile('assistant-usage.json', trimmed);
  return usage;
}

// -------------------------------------------------------------
// MONETIZATION CONFIGURATION STORAGE
// -------------------------------------------------------------
export async function getMonetizationSettings(): Promise<any> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('gtf_monetization_settings')
        .select('config')
        .eq('key', 'default')
        .maybeSingle();
      if (!error && data?.config) {
        return data.config;
      }
    } catch (e) {
      console.warn('[Supabase getMonetizationSettings Notice]', e);
    }
  }
  return readJsonFile('monetization-runtime.json', null);
}

export async function saveMonetizationSettings(config: any): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('gtf_monetization_settings')
        .upsert({
          key: 'default',
          config,
          last_updated: new Date().toISOString()
        });
      if (!error) return true;
      if (error && isProduction()) {
        throw new Error(`DATABASE_ERROR: ${error.message}`);
      }
    } catch (e: any) {
      if (isProduction()) throw e;
      console.warn('[Supabase saveMonetizationSettings Notice]', e);
    }
  }
  const saved = writeJsonFile('monetization-runtime.json', config);
  if (!saved && isProduction()) {
    throw new Error('PERSISTENCE_FAILED');
  }
  return saved;
}

// -------------------------------------------------------------
// COMPREHENSIVE ANALYTICS AGGREGATOR (FOR ADMIN DASHBOARD)
// -------------------------------------------------------------
export async function getAnalyticsSummary() {
  const clicks = await getOutboundClicks(2000);
  const users = await getUsers();
  const subscribers = await getSubscribers();
  const enquiries = await getContactEnquiries(200);
  const assistantLogs = await getAssistantUsage();

  const totalClicks = clicks.length;
  const affiliateClicks = clicks.filter(c => c.isAffiliate).length;
  const directClicks = totalClicks - affiliateClicks;
  const authenticatedClicks = clicks.filter(c => Boolean(c.userUid)).length;
  const anonymousClicks = totalClicks - authenticatedClicks;

  const destinationMap = new Map<string, number>();
  const sourceMap = new Map<string, number>();
  const productMap = new Map<string, number>();
  const dailyMap = new Map<string, number>();

  for (const c of clicks) {
    destinationMap.set(c.destination, (destinationMap.get(c.destination) || 0) + 1);
    sourceMap.set(c.sourcePage || 'unknown', (sourceMap.get(c.sourcePage || 'unknown') || 0) + 1);
    productMap.set(c.productSlug || 'general', (productMap.get(c.productSlug || 'general') || 0) + 1);

    const dateKey = (c.timestamp || '').split('T')[0] || 'unknown';
    dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + 1);
  }

  const topDestinations = Array.from(destinationMap.entries())
    .map(([destination, count]) => ({ destination, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topSources = Array.from(sourceMap.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topProducts = Array.from(productMap.entries())
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const dailyTrends = Array.from(dailyMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30);

  const totalAssistantQueries = assistantLogs.length;
  const assistantSuccessCount = assistantLogs.filter(a => a.status === 'success').length;
  const assistantUnconfiguredCount = assistantLogs.filter(a => a.status === 'unconfigured').length;

  return {
    overview: {
      totalRegisteredUsers: users.length,
      totalSubscribers: subscribers.length,
      totalOutboundClicks: totalClicks,
      affiliateClicks,
      directClicks,
      authenticatedClicks,
      anonymousClicks,
      totalEnquiries: enquiries.length,
      totalAssistantQueries,
      assistantSuccessCount,
      assistantUnconfiguredCount,
      storageType: getSupabaseClient() ? 'supabase_postgres' : 'disk_json'
    },
    topDestinations,
    topSources,
    topProducts,
    dailyTrends,
    recentClicks: clicks.slice(-15).reverse(),
    recentEnquiries: enquiries.slice(-10).reverse(),
    users: users.map(u => ({
      uid: u.uid,
      email: u.email,
      displayName: u.displayName || 'Anonymous User',
      photoURL: u.photoURL,
      provider: u.provider || 'google.com',
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
      savedToolsCount: (u.savedTools || []).length
    }))
  };
}
