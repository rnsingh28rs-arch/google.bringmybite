import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Maximize2, 
  Minimize2, 
  ArrowRight, 
  Bot, 
  User, 
  Compass, 
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  BookOpen,
  DollarSign,
  Tag
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { INDIA_OFFERS } from '../data/indiaOffers';
import { ProductLogo } from './ProductLogo';
import { RobotCompanion, RobotState } from './RobotCompanion';
import { Product } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommendedProducts?: Product[];
  timestamp: string;
  mode?: 'live-ai' | 'curated-knowledge' | 'system-alert';
  isConfigWarning?: boolean;
}

interface ToolFinderChatbotProps {
  isFloatingWidget?: boolean;
  onNavigateProduct?: (slug: string) => void;
  onNavigateTutorial?: (slug: string) => void;
  onNavigateOffer?: () => void;
}

export const ToolFinderChatbot: React.FC<ToolFinderChatbotProps> = ({
  isFloatingWidget = false,
  onNavigateProduct,
  onNavigateTutorial,
  onNavigateOffer
}) => {
  const [isOpen, setIsOpen] = useState(!isFloatingWidget);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [robotState, setRobotState] = useState<RobotState>('idle');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "Hello! I'm **Tool Finder AI**, your living Google Ecosystem companion by Bring My Bite. Tell me your project, team size, budget, or target platform, and I'll find the exact Google tools, free trials, and eligible India offers for you.",
      timestamp: 'Just now',
      mode: 'curated-knowledge'
    }
  ]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  // Support global open event
  useEffect(() => {
    const handleGlobalOpen = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener('open-tool-finder-chatbot', handleGlobalOpen);
    return () => window.removeEventListener('open-tool-finder-chatbot', handleGlobalOpen);
  }, []);

  const quickPrompts = [
    { label: '🚀 Free tools to launch a startup', query: 'What are the best 100% free or generous trial Google tools to build and launch a web startup?' },
    { label: '🇮🇳 India cloud offers & credits', query: 'What exclusive promo offers and cloud startup grants are available in India for Google Workspace and GCP?' },
    { label: '🤖 Compare Gemini vs Vertex AI', query: 'Should my business use Gemini Advanced or Vertex AI for automated customer workflows?' },
    { label: '💰 Mobile app monetisation & ads', query: 'What tools does Google provide to monetize a mobile app or game?' }
  ];

  // Call secure server-side endpoint (/api/assistant)
  const callServerAssistant = async (
    userPrompt: string, 
    conversationHistory: Message[]
  ): Promise<{ text: string; matchedSlugs: string[]; mode: 'live-ai' | 'curated-knowledge' | 'system-alert'; isWarning?: boolean } | null> => {
    try {
      const historyPayload = conversationHistory.slice(-6).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userPrompt,
          history: historyPayload
        })
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 503 && data.error === 'GEMINI_API_KEY_MISSING') {
        // Transparent indicator of missing credentials
        return {
          text: `⚠️ **Live AI Reasoning Notice**: Server environment variable \`GEMINI_API_KEY\` is currently unconfigured. Live Gemini reasoning requires an API key in the server environment.`,
          matchedSlugs: [],
          mode: 'system-alert',
          isWarning: true
        };
      }

      if (res.ok && data.success) {
        return {
          text: data.text,
          matchedSlugs: data.matchedSlugs || [],
          mode: 'live-ai'
        };
      }

      return null;
    } catch (err) {
      console.warn('[Server Assistant Unavailable]', err);
      return null;
    }
  };

  // Local transparent Curated Knowledge Base fallback
  const getCuratedKnowledgeAnswer = (query: string): { replyText: string; matchedSlugs: string[] } => {
    const q = query.toLowerCase();
    let replyText = "";
    let matchedSlugs: string[] = [];

    if (q.includes('tour') || q.includes('overview') || q.includes('ecosystem')) {
      replyText = "Welcome to the Google Tool Finder guided tour!\n\n" +
        "Our catalog organizes 29 verified Google tools across 6 core pillars:\n" +
        "1. **AI & Machine Learning**: Gemini, Vertex AI, Google AI Studio, and NotebookLM.\n" +
        "2. **Developer & Cloud**: Firebase, GCP, BigQuery, Flutter, and Android Studio.\n" +
        "3. **Productivity Suite**: Google Workspace, Drive, Docs, Sheets, and Meet.\n" +
        "4. **Marketing & Analytics**: GA4, Google Search Console, and Looker Studio.\n" +
        "5. **Monetisation & Ads**: Google AdMob, Google Ads, and Play Console.\n" +
        "6. **Indian Market Perks**: 13 verified startup grants and cloud bundles.\n\n" +
        "Click any product badge below to view verified specs and official portals.";
      matchedSlugs = ['gemini', 'vertex-ai', 'firebase', 'google-cloud', 'google-workspace', 'looker-studio'];
    } else if (q.includes('tutorial') || q.includes('guide') || q.includes('learn') || q.includes('how to')) {
      replyText = "We feature 7 step-by-step engineering tutorials in our Guides section:\n\n" +
        "• **Gemini Flash Quickstart**: Prototyping multimodal workflows in Google AI Studio.\n" +
        "• **Flutter + Firebase**: Building cross-platform apps with real-time sync.\n" +
        "• **BigQuery Analytics**: High-efficiency SQL data warehousing.\n" +
        "• **Firebase App Hosting**: Modern full-stack deployment pipeline.\n" +
        "• **Google Workspace Security**: Implementing SPF, DKIM, and DMARC.\n" +
        "• **Looker Studio Dashboards**: Building executive KPI visual reports.\n" +
        "• **India Startup Cloud Program**: Claiming up to $350k in GCP credits.";
      matchedSlugs = ['google-ai-studio', 'flutter', 'firebase', 'bigquery', 'google-workspace'];
    } else if (q.includes('india') || q.includes('offer') || q.includes('grant') || q.includes('hdfc') || q.includes('startup credit')) {
      replyText = "In India, Google provides several verified startup grants and enterprise banking bundles:\n\n" +
        "1. **Google for Startups Cloud Program**: Up to $350,000 in GCP credits across 2 years.\n" +
        "2. **Google Workspace Starter India Promo**: Direct promotional pricing for Indian businesses.\n" +
        "3. **HDFC SmartHub Vyapar & ICICI Eazypay**: 15% cashback and zero onboarding fees.";
      matchedSlugs = ['google-cloud', 'google-workspace', 'firebase'];
    } else if (q.includes('ai') || q.includes('gemini') || q.includes('vertex') || q.includes('llm') || q.includes('model') || q.includes('bot')) {
      replyText = "For AI development, Google offers two primary complementary tiers:\n\n" +
        "• **Google AI Studio**: Fast, zero-friction prototyping with Gemini 3.1 Flash Lite.\n" +
        "• **Vertex AI**: Enterprise machine learning platform with SOC2/HIPAA compliance, custom tuning, and search groundings.\n" +
        "• **NotebookLM**: Ideal for academic synthesis and grounded research over personal documents.";
      matchedSlugs = ['gemini', 'vertex-ai', 'google-ai-studio', 'notebooklm'];
    } else if (q.includes('free') || q.includes('zero cost') || q.includes('cheap') || q.includes('budget')) {
      replyText = "Here are the top zero-cost Google platforms with generous free quotas:\n\n" +
        "• **Looker Studio**: 100% free interactive dashboard designer.\n" +
        "• **Google Colab**: Free cloud Jupyter notebooks with zero-cost T4 GPU access.\n" +
        "• **Google Search Console**: Free organic search performance analytics.\n" +
        "• **Firebase Spark Plan**: Generous free-tier authentication, Firestore, and hosting.";
      matchedSlugs = ['looker-studio', 'google-colab', 'google-search-console', 'firebase'];
    } else if (q.includes('workspace') || q.includes('team') || q.includes('email') || q.includes('storage') || q.includes('seat')) {
      replyText = "For team productivity and branded email, **Google Workspace** is the core suite. Starter plans provide custom email (@yourcompany.com) with 30 GB pooled storage. Use our **Workspace ROI Calculator** on the home page to estimate exact monthly costs in INR or USD.";
      matchedSlugs = ['google-workspace', 'google-drive', 'google-meet'];
    } else {
      replyText = `Based on your query, I analyzed the Google Tool Finder verified catalog of 29 tools. Here are the most relevant foundational services for deployment, analytics, and productivity:`;
      matchedSlugs = ['google-cloud', 'firebase', 'google-analytics', 'google-workspace'];
    }

    return { replyText, matchedSlugs };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);
    setRobotState('thinking');

    try {
      // 1. Attempt Server-side AI assistant call
      const serverResult = await callServerAssistant(query, [...messages, userMessage]);

      if (serverResult && serverResult.mode === 'live-ai') {
        const recommendedProducts = PRODUCTS.filter(p => serverResult.matchedSlugs.includes(p.slug));
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: serverResult.text,
          recommendedProducts,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: 'live-ai'
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        setRobotState('speaking');
        setTimeout(() => setRobotState('idle'), 3500);
        return;
      }

      // If server reported missing API key warning, display transparent notice
      if (serverResult && serverResult.isWarning) {
        const warningMsg: Message = {
          id: `warn-${Date.now()}`,
          sender: 'assistant',
          text: serverResult.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: 'system-alert',
          isConfigWarning: true
        };
        
        // Also provide the transparent curated knowledge answer
        const fallback = getCuratedKnowledgeAnswer(query);
        const fallbackProducts = PRODUCTS.filter(p => fallback.matchedSlugs.includes(p.slug));
        const fallbackMsg: Message = {
          id: `kb-${Date.now()}`,
          sender: 'assistant',
          text: `📖 **Curated Catalog Answer** (Deterministic Knowledge Base):\n\n${fallback.replyText}`,
          recommendedProducts: fallbackProducts,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: 'curated-knowledge'
        };

        setMessages(prev => [...prev, warningMsg, fallbackMsg]);
        setIsTyping(false);
        setRobotState('speaking');
        setTimeout(() => setRobotState('idle'), 3000);
        return;
      }

      // Local Fallback if server call errored out
      const fallback = getCuratedKnowledgeAnswer(query);
      const fallbackProducts = PRODUCTS.filter(p => fallback.matchedSlugs.includes(p.slug));
      const fallbackMsg: Message = {
        id: `kb-${Date.now()}`,
        sender: 'assistant',
        text: `📖 **Curated Knowledge Base**: ${fallback.replyText}`,
        recommendedProducts: fallbackProducts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: 'curated-knowledge'
      };

      setMessages(prev => [...prev, fallbackMsg]);
      setIsTyping(false);
      setRobotState('speaking');
      setTimeout(() => setRobotState('idle'), 3000);

    } catch (err) {
      console.error('[Chatbot Error]', err);
      setIsTyping(false);
      setRobotState('idle');
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: "Conversation reset. Tell me your project type, budget, or tool questions to get customized Google recommendations.",
        timestamp: 'Just now',
        mode: 'curated-knowledge'
      }
    ]);
  };

  // Floating trigger button when closed or minimized
  if (!isOpen || isMinimized) {
    if (!isFloatingWidget) {
      return (
        <div className="w-full max-w-xs mx-auto p-3 bg-white/90 border border-indigo-100 rounded-2xl shadow-sm text-center">
          <button
            onClick={() => { setIsOpen(true); setIsMinimized(false); }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow hover:scale-105 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Tool Finder AI</span>
          </button>
        </div>
      );
    }

    return (
      <div className="fixed bottom-2 right-1 sm:bottom-3 sm:right-3 z-40 flex flex-col items-center gap-1.5">
        <div className="robot-welcome-glass relative max-w-[230px] px-4 py-3 text-center text-[12px] font-semibold text-white/95">
          <span className="relative z-10">Hi! I’m your assistant, here to help you find the best Google tools.</span>
          <span aria-hidden="true" className="robot-welcome-glass-tail absolute -bottom-1 right-5 h-3 w-3 rotate-45" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/20 via-white/5 to-cyan-200/10" />
        </div>
        <button
          id="tool-finder-chatbot-launcher"
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          className="robot-neon-launcher group flex items-center justify-center bg-transparent p-0 shadow-none cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-2"
          aria-label="Open Tool Finder AI Assistant"
          title="Open your assistant"
        >
          <img src="/assets/robot.png" alt="3D neon assistant robot facing right" className="robot-neon-mascot object-contain flex-shrink-0 scale-x-[-1]" loading="eager" draggable={false} onError={(e) => { e.currentTarget.src = "/assets/robot.png"; }} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={
        isFloatingWidget
          ? "tool-finder-glass-chat fixed bottom-4 sm:bottom-5 right-3 sm:right-5 z-40 w-[calc(100vw-1rem)] sm:w-[350px] h-[min(88dvh,820px)] max-h-[calc(100dvh-1rem)] flex flex-col bg-slate-950/70 backdrop-blur-2xl border border-white/20 shadow-[0_24px_80px_rgba(2,8,23,0.55),0_0_36px_rgba(56,189,248,0.16)] rounded-[24px] overflow-hidden transition-all duration-300 font-sans"
          : "tool-finder-glass-chat relative w-full max-w-[350px] mx-auto h-[min(88dvh,820px)] max-h-[calc(100dvh-1rem)] flex flex-col bg-slate-950/70 backdrop-blur-2xl border border-white/20 shadow-[0_24px_80px_rgba(2,8,23,0.45),0_0_36px_rgba(56,189,248,0.14)] rounded-[24px] overflow-hidden transition-all duration-300 font-sans"
      }
    >
      
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white px-4 py-3 flex items-center justify-between select-none border-b border-white/10 bg-slate-950/35">
        <div className="flex items-center gap-2 min-w-0">
          <RobotCompanion 
            state={robotState} 
            size="sm" 
            showStage={false} 
            className="w-7 h-7 -my-0.5 cursor-pointer flex-shrink-0 robot-gentle-float"
            onToggleRest={() => setRobotState(prev => prev === 'resting' ? 'idle' : 'resting')}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs tracking-tight text-white truncate">Tool Finder AI</span>
              <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                Guide
              </span>
            </div>
            <p className="text-[10px] text-slate-300 truncate max-w-[130px]">
              {robotState === 'thinking' ? 'Analyzing Google Catalog...' :
               robotState === 'speaking' ? 'Formulating recommendations...' :
               robotState === 'resting' ? 'Sleeping (click mascot to wake)' :
               'Ask anything about 29 Google tools'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button 
            onClick={handleResetChat} 
            title="Reset Conversation"
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setIsMinimized(true)} 
            title="Minimize"
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          {isFloatingWidget && (
            <button 
              onClick={() => setIsOpen(false)} 
              title="Close"
              className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Guided Website Tour Quick Bar */}
      <div className="bg-white/[0.06] border-b border-white/10 px-3 py-2 flex items-center justify-between text-[11px] text-slate-200 gap-2 overflow-x-auto select-none">
        <span className="font-bold text-slate-700 whitespace-nowrap flex items-center gap-0.5">
          <Compass className="w-3 h-3 text-blue-600" />
          <span>Tour:</span>
        </span>
        <button
          onClick={() => {
            handleSendMessage("Give me a quick tour of the 29 Google products in the directory.");
          }}
          className="px-1.5 py-0.5 rounded hover:bg-white text-slate-700 font-medium transition-colors whitespace-nowrap cursor-pointer"
        >
          29 Tools
        </button>
        <button
          onClick={() => {
            handleSendMessage("What step-by-step tutorials are available to learn Google Cloud and AI tools?");
          }}
          className="px-1.5 py-0.5 rounded hover:bg-white text-slate-700 font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-0.5"
        >
          <BookOpen className="w-2.5 h-2.5 text-purple-600" />
          <span>Guides</span>
        </button>
        <button
          onClick={() => {
            if (onNavigateOffer) {
              onNavigateOffer();
            } else {
              handleSendMessage("Show me all verified India startup credits and telecom offers.");
              window.location.assign('/india-offers');
            }
          }}
          className="px-1.5 py-0.5 rounded hover:bg-white text-slate-700 font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-0.5"
        >
          <Tag className="w-2.5 h-2.5 text-emerald-600" />
          <span>India Offers</span>
        </button>
        <button
          onClick={() => {
            handleSendMessage("How do I calculate team costs for Google Workspace Starter and Standard?");
          }}
          className="px-1.5 py-0.5 rounded hover:bg-white text-slate-700 font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-0.5"
        >
          <DollarSign className="w-2.5 h-2.5 text-amber-600" />
          <span>Pricing</span>
        </button>
      </div>

      {/* Message List */}
      <div ref={messagesContainerRef} className="flex-1 min-h-0 p-4 sm:p-5 overflow-y-auto space-y-4 text-[13px] text-slate-100 leading-relaxed">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1">
              {msg.sender === 'assistant' ? (
                <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-300">
                  <Bot className="w-2.5 h-2.5 text-blue-600" />
                  <span>Tool Finder AI</span>
                  {msg.mode === 'live-ai' ? (
                    <span className="px-1 py-0.1 bg-emerald-100 text-emerald-800 rounded font-bold text-[8.5px]">Live</span>
                  ) : msg.mode === 'system-alert' ? (
                    <span className="px-1 py-0.1 bg-amber-100 text-amber-800 rounded font-bold text-[8.5px]">Status</span>
                  ) : (
                    <span className="px-1 py-0.1 bg-blue-100 text-blue-800 rounded font-bold text-[8.5px]">Catalog</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[9.5px] font-bold text-slate-500">
                  <User className="w-2.5 h-2.5 text-slate-600" />
                  <span>You</span>
                </div>
              )}
              <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
            </div>

            <div
              className={`rounded-2xl px-3.5 py-2.5 max-w-[92%] sm:max-w-[88%] text-[13px] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-xs'
                  : msg.isConfigWarning
                  ? 'bg-amber-400/10 text-amber-100 rounded-tl-md'
                  : 'bg-white/[0.07] text-slate-100 rounded-tl-md'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>

            {/* Recommended Products Cards */}
            {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
              <div className="mt-1.5 w-full space-y-1 pl-1.5 border-l-2 border-blue-400">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                  Matched Tools ({msg.recommendedProducts.length})
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {msg.recommendedProducts.map(prod => (
                    <div 
                      key={prod.id}
                      className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:shadow-2xs transition-all"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <ProductLogo slug={prod.slug} name={prod.name} size="sm" className="w-5 h-5 flex-shrink-0" />
                        <div className="min-w-0 truncate">
                          <div className="font-bold text-slate-800 text-[10px] leading-tight truncate">{prod.name}</div>
                          <div className="text-[8.5px] text-slate-500 capitalize truncate">{(prod.pricingStatus || '').replace('_', ' ')}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        {onNavigateProduct && (
                          <button
                            onClick={() => onNavigateProduct(prod.slug)}
                            className="px-1.5 py-0.5 text-[9px] font-bold text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          >
                            Specs &rarr;
                          </button>
                        )}
                        <a
                          href={prod.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                          title="Open official Google website"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 text-slate-400 py-0.5 pl-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[10px] font-medium text-slate-500 ml-1">Analyzing catalog...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts (shown when only welcome message exists) */}
      {messages.length <= 1 && (
        <div className="px-2.5 pb-2 select-none">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
            <span>Suggested prompts</span>
          </div>
          <div className="flex flex-col gap-1">
            {quickPrompts.slice(0, 3).map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                className="text-left text-[10px] px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition-colors border border-slate-200/60 truncate cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="p-3 sm:p-4 bg-slate-950/55 border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-1.5"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about Google tools, India offers, pricing..."
            disabled={isTyping}
            className="flex-1 min-w-0 bg-white/[0.08] border border-white/20 rounded-xl px-3 py-2.5 text-[13px] text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-300/40 transition-all"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="p-2.5 bg-gradient-to-br from-blue-500 to-violet-600 hover:from-blue-400 hover:to-violet-500 disabled:opacity-50 text-white rounded-xl shadow-lg shadow-blue-950/30 transition-all cursor-pointer flex-shrink-0"
            title="Send Message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
