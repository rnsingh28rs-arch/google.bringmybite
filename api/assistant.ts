import type { IncomingMessage, ServerResponse } from 'http';
import { parseJsonBody, sendJson, extractClientIp, createRateLimiter } from './_utils.js';
import { recordAssistantUsage } from './_storage.js';

// Rate limiter: Max 30 assistant messages per 10 minutes per IP
const rateLimiter = createRateLimiter(10 * 60 * 1000, 30);

// Verified product catalog summary for LLM grounding (29 official Google products)
const CATALOG_GROUNDING = [
  { name: "Google Workspace", slug: "google-workspace", category: "productivity_collaboration", pricing: "paid", url: "https://workspace.google.com" },
  { name: "Gemini", slug: "gemini", category: "ai_machine_learning", pricing: "freemium", url: "https://gemini.google.com" },
  { name: "Vertex AI", slug: "vertex-ai", category: "ai_machine_learning", pricing: "free_trial", url: "https://cloud.google.com/vertex-ai" },
  { name: "Google Cloud Platform", slug: "google-cloud", category: "cloud_infrastructure", pricing: "free_trial", url: "https://cloud.google.com" },
  { name: "Firebase", slug: "firebase", category: "developer_tools", pricing: "freemium", url: "https://firebase.google.com" },
  { name: "Google Ads", slug: "google-ads", category: "marketing_analytics", pricing: "paid", url: "https://ads.google.com" },
  { name: "Google Analytics 4", slug: "google-analytics", category: "marketing_analytics", pricing: "freemium", url: "https://analytics.google.com" },
  { name: "Looker Studio", slug: "looker-studio", category: "marketing_analytics", pricing: "free", url: "https://lookerstudio.google.com" },
  { name: "Google Search Console", slug: "google-search-console", category: "marketing_analytics", pricing: "free", url: "https://search.google.com/search-console" },
  { name: "Google Tag Manager", slug: "google-tag-manager", category: "marketing_analytics", pricing: "free", url: "https://tagmanager.google.com" },
  { name: "BigQuery", slug: "bigquery", category: "cloud_infrastructure", pricing: "freemium", url: "https://cloud.google.com/bigquery" },
  { name: "Android Studio", slug: "android-studio", category: "developer_tools", pricing: "free", url: "https://developer.android.com/studio" },
  { name: "Flutter", slug: "flutter", category: "developer_tools", pricing: "free", url: "https://flutter.dev" },
  { name: "Google Play Console", slug: "google-play-console", category: "developer_tools", pricing: "paid", url: "https://play.google.com/console" },
  { name: "Google Maps Platform", slug: "google-maps-platform", category: "developer_tools", pricing: "freemium", url: "https://mapsplatform.google.com" },
  { name: "Google Colab", slug: "google-colab", category: "ai_machine_learning", pricing: "freemium", url: "https://colab.research.google.com" },
  { name: "NotebookLM", slug: "notebooklm", category: "ai_machine_learning", pricing: "free", url: "https://notebooklm.google.com" },
  { name: "Google AI Studio", slug: "google-ai-studio", category: "ai_machine_learning", pricing: "free_trial", url: "https://aistudio.google.com" },
  { name: "Google Drive", slug: "google-drive", category: "productivity_collaboration", pricing: "freemium", url: "https://drive.google.com" },
  { name: "Google Docs", slug: "google-docs", category: "productivity_collaboration", pricing: "free", url: "https://docs.google.com" },
  { name: "Google Sheets", slug: "google-sheets", category: "productivity_collaboration", pricing: "free", url: "https://sheets.google.com" },
  { name: "Google Slides", slug: "google-slides", category: "productivity_collaboration", pricing: "free", url: "https://slides.google.com" },
  { name: "Google Meet", slug: "google-meet", category: "productivity_collaboration", pricing: "freemium", url: "https://meet.google.com" },
  { name: "Google Keep", slug: "google-keep", category: "productivity_collaboration", pricing: "free", url: "https://keep.google.com" },
  { name: "Google Calendar", slug: "google-calendar", category: "productivity_collaboration", pricing: "free", url: "https://calendar.google.com" },
  { name: "Google Chrome Enterprise", slug: "google-chrome-enterprise", category: "productivity_collaboration", pricing: "free_trial", url: "https://chromeenterprise.google" },
  { name: "Google Forms", slug: "google-forms", category: "productivity_collaboration", pricing: "free", url: "https://forms.google.com" },
  { name: "Google Sites", slug: "google-sites", category: "productivity_collaboration", pricing: "free", url: "https://sites.google.com" },
  { name: "AppSheet", slug: "appsheet", category: "developer_tools", pricing: "freemium", url: "https://www.appsheet.com" }
];

export interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
}

export interface AssistantRequestBody {
  message: string;
  history?: ChatMessage[];
}

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Allow', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, {
      success: false,
      error: 'METHOD_NOT_ALLOWED',
      message: 'Method Not Allowed. Only POST requests are supported.'
    });
  }

  // Rate Limiting
  const clientIp = extractClientIp(req);
  if (!rateLimiter(clientIp)) {
    return sendJson(res, 429, {
      success: false,
      error: 'RATE_LIMITED',
      message: 'Rate limit exceeded. Please wait a few moments before sending another enquiry.'
    });
  }

  // Body Parsing & Validation
  let body: AssistantRequestBody;
  try {
    body = await parseJsonBody<AssistantRequestBody>(req);
  } catch (err: any) {
    const isTooLarge = err.message === 'PAYLOAD_TOO_LARGE';
    return sendJson(res, isTooLarge ? 413 : 400, {
      success: false,
      error: isTooLarge ? 'PAYLOAD_TOO_LARGE' : 'INVALID_JSON',
      message: isTooLarge ? 'Message payload exceeds limit (64 KB).' : 'Malformed JSON body.'
    });
  }

  const userMessage = (body.message || '').trim();
  if (!userMessage) {
    return sendJson(res, 400, {
      success: false,
      error: 'EMPTY_MESSAGE',
      message: 'Message cannot be empty.'
    });
  }

  if (userMessage.length > 2000) {
    return sendJson(res, 400, {
      success: false,
      error: 'MESSAGE_TOO_LONG',
      message: 'Message exceeds maximum length of 2000 characters.'
    });
  }

  // Credential verification
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    await recordAssistantUsage({
      promptLength: userMessage.length,
      status: 'unconfigured',
      matchedCount: 0,
      timestamp: new Date().toISOString()
    }).catch(() => { });

    // Fail clearly and transparently: Never pretend unconfigured AI is live reasoning
    return sendJson(res, 503, {
      success: false,
      error: 'GEMINI_API_KEY_MISSING',
      message: 'AI Assistant server is unconfigured. The GEMINI_API_KEY environment variable is required on the server to enable live Google AI reasoning.'
    });
  }

  // Build system prompt and conversation contents
  const groundingList = CATALOG_GROUNDING.map(
    p => `${p.name} [slug: ${p.slug}, pricing: ${p.pricing}, url: ${p.url}]`
  ).join('\n');

  const systemInstruction =
    "You are Tool Finder AI by Bring My Bite, an authoritative expert on the Google Product & Cloud Ecosystem.\n" +
    "Your mission: Provide factual, objective recommendations matching the user's project, team size, budget, and platform.\n" +
    "Only recommend tools that actually exist in the Google Tool Finder verified catalog below:\n" +
    groundingList + "\n\n" +
    "Rules:\n" +
    "1. Explain WHY each recommended tool fits the user's exact need.\n" +
    "2. If the user's requirements are ambiguous, provide initial insights and ask concise clarifying questions.\n" +
    "3. At the end of your response, ALWAYS output matched tool slugs inside this exact delimiter:\n" +
    "[RECOMMENDED_SLUGS: slug-1, slug-2]";

  // Prepare history (limit to last 6 turns to avoid prompt blowup)
  const historyParts: any[] = [];
  if (Array.isArray(body.history)) {
    const recent = body.history.slice(-6);
    for (const h of recent) {
      if (h.sender && h.text) {
        historyParts.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      }
    }
  }

  // Add active user query
  historyParts.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000); // 18s timeout

    const modelName = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`;
    let response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: historyParts,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024
        }
      })
    });

    clearTimeout(timeoutId);

    // Seamless fallback to gemini-2.5-flash if primary model returns 404
    if (!response.ok && response.status === 404) {
      try {
        const fallbackModel = modelName === 'gemini-3.1-flash-lite' ? 'gemini-2.5-flash' : 'gemini-3.1-flash-lite';
        const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/${fallbackModel}:generateContent?key=${apiKey.trim()}`;
        const fallbackRes = await fetch(fallbackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: historyParts,
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            },
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 1024
            }
          })
        });
        if (fallbackRes.ok) {
          response = fallbackRes;
        }
      } catch (fallbackErr) {
        console.warn('[Gemini Model Fallback Notice]', fallbackErr);
      }
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('[Gemini API Error]', response.status, errText);
      await recordAssistantUsage({
        promptLength: userMessage.length,
        status: `error_${response.status}`,
        matchedCount: 0,
        timestamp: new Date().toISOString()
      }).catch(() => { });
      return sendJson(res, 502, {
        success: false,
        error: 'UPSTREAM_AI_ERROR',
        message: `Google Gemini API returned status ${response.status}. Please check API key validity and quotas.`
      });
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

    // Extract structured slugs
    const slugMatch = rawText.match(/\[RECOMMENDED_SLUGS:\s*([^\]]+)\]/);
    let matchedSlugs: string[] = [];
    let cleanText = rawText;

    if (slugMatch) {
      matchedSlugs = slugMatch[1].split(',').map((s: string) => s.trim().toLowerCase());
      cleanText = rawText.replace(/\[RECOMMENDED_SLUGS:[^\]]+\]/, '').trim();
    }

    // Lookup structured recommendation cards from verified catalog
    const recommendations = CATALOG_GROUNDING
      .filter(p => matchedSlugs.includes(p.slug))
      .map(p => ({
        name: p.name,
        slug: p.slug,
        officialUrl: p.url,
        pricing: p.pricing,
        category: p.category
      }));

    await recordAssistantUsage({
      promptLength: userMessage.length,
      status: 'success',
      matchedCount: matchedSlugs.length,
      timestamp: new Date().toISOString()
    }).catch(() => { });

    return sendJson(res, 200, {
      success: true,
      text: cleanText,
      model: modelName,
      recommendations,
      matchedSlugs,
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    if (err.name === 'AbortError') {
      return sendJson(res, 504, {
        success: false,
        error: 'GATEWAY_TIMEOUT',
        message: 'The AI service timed out while generating a response. Please try again.'
      });
    }
    console.error('[Assistant Exception]', err);
    return sendJson(res, 500, {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred while communicating with the AI service.'
    });
  }
}
