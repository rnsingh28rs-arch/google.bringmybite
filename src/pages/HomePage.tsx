import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Gift, 
  BookOpen, 
  Scale, 
  HelpCircle, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Mail,
  Send,
  AlertCircle,
  Building2,
  Lock,
  Globe,
  Wifi,
  Layers,
  Cpu,
  DollarSign,
  BarChart2,
  Code,
  Smartphone,
  Tv,
  Calculator
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { INDIA_OFFERS } from '../data/indiaOffers';
import { TUTORIALS } from '../data/tutorials';
import { COMPARISONS } from '../data/comparisons';
import { ProductCard } from '../components/ProductCard';
import { OfferCard } from '../components/OfferCard';
import { TutorialCard } from '../components/TutorialCard';
import { ComparisonCard } from '../components/ComparisonCard';
import { WorkspaceCalculator } from '../components/WorkspaceCalculator';
import { HeroEcosystemVisual } from '../components/HeroEcosystemVisual';
import { AdPlacement } from '../components/AdPlacement';
import { FeaturedOwnerPromotion } from '../components/FeaturedOwnerPromotion';
import { ToolFinderChatbot } from '../components/ToolFinderChatbot';
import { ProductLogo } from '../components/ProductLogo';
import { WaterLightGlass } from '../components/WaterLightGlass';

interface HomePageProps {
  onNavigate: (view: string, slug?: string) => void;
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSearch }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'already_subscribed' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  // Curated 3-4 featured products per homepage section for low-text, visual discovery
  const popularProducts = PRODUCTS.filter(p => ['gmail', 'google-drive', 'google-search', 'google-photos'].includes(p.slug));
  const aiProducts = PRODUCTS.filter(p => ['gemini', 'notebooklm', 'google-ai-studio', 'google-antigravity'].includes(p.slug));
  const devProducts = PRODUCTS.filter(p => ['firebase', 'android-studio', 'google-cloud', 'google-colab'].includes(p.slug));
  const productivityProducts = PRODUCTS.filter(p => ['google-docs', 'google-sheets', 'google-slides', 'google-meet'].includes(p.slug));
  const monetizationProducts = PRODUCTS.filter(p => ['google-admob', 'google-play-billing', 'google-ima', 'google-ads'].includes(p.slug));
  const analyticsProducts = PRODUCTS.filter(p => ['google-analytics', 'google-search-console', 'looker-studio', 'bigquery'].includes(p.slug));

  // India Offers (Jio, Airtel & GCP)
  const topIndiaOffers = INDIA_OFFERS.slice(0, 3);
  // Tutorials
  const topTutorials = TUTORIALS.slice(0, 3);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = newsletterEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setNewsletterStatus('error');
      setNewsletterMsg('Please enter a valid email address.');
      return;
    }

    setNewsletterStatus('loading');
    setNewsletterMsg('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        if (data.status === 'already_subscribed') {
          setNewsletterStatus('already_subscribed');
          setNewsletterMsg(data.message || 'You are already subscribed to the Google Tool Finder updates.');
        } else {
          setNewsletterStatus('success');
          setNewsletterMsg(data.message || 'Thank you for subscribing! Your email has been registered for Google ecosystem updates.');
          setNewsletterEmail('');
        }
      } else {
        setNewsletterStatus('error');
        setNewsletterMsg(data.message || 'Unable to register subscription at this time. Please try again.');
      }
    } catch {
      setNewsletterStatus('error');
      setNewsletterMsg('Network error. Unable to reach newsletter service.');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION (Liquid Glass Design with Fluid Curved Panels) */}
      <section id="hero-section" className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20 border-b border-slate-200/60 overflow-hidden">
        
        {/* Ambient Fluid Color Caustics */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-300/25 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-5 left-1/2 w-80 h-80 bg-emerald-200/25 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Headline, Narrative & Liquid Search Bar */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Brand Tag with Water Glass Sheen */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full water-glass-surface shadow-xs text-xs font-semibold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="font-extrabold text-blue-900 tracking-tight">Google Tool Finder</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-medium">by Bring My Bite</span>
              </div>

              {/* Main Headline with Water Light Glass Interaction */}
              <WaterLightGlass
                className="rounded-3xl p-4 sm:p-5 -ml-3 sm:-ml-4 max-w-xl cursor-default transition-all duration-300"
                intensity="vibrant"
              >
                <div className="space-y-2">
                  <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
                    <span className="bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] bg-clip-text text-transparent">
                      Google Tool Finder
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base font-semibold text-slate-500 flex items-center gap-2">
                    <span>A technology discovery & monetisation platform by</span>
                    <span className="font-bold text-slate-800 bg-slate-100/90 px-2.5 py-0.5 rounded-lg border border-slate-200/80">
                      Bring My Bite
                    </span>
                  </p>
                </div>
              </WaterLightGlass>

              {/* Official Brand Tagline */}
              <div className="py-3 px-4 sm:px-5 rounded-2xl bg-white/70 border border-slate-200/80 shadow-2xs backdrop-blur-md max-w-xl text-slate-700 text-xs sm:text-sm font-medium leading-relaxed space-y-1">
                <p className="flex items-center gap-2">
                  <span>Claim your space and launch your site,</span>
                  <span>💻</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>A tool in sight to guide you right,</span>
                  <span>🧭</span>
                </p>
                <p className="flex items-center gap-2 font-bold text-blue-700">
                  <span>One Google click, one perfect bite.</span>
                  <span>📱</span>
                </p>
              </div>

              {/* Prominent Liquid Glass Search Interface */}
              <div className="pt-1 max-w-xl">
                <div 
                  onClick={onOpenSearch}
                  className="group relative flex items-center w-full p-2.5 water-glass-surface rounded-2xl border-2 border-white/90 hover:border-blue-400 shadow-md hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="pl-3 pr-2">
                    <div className="w-9 h-9 rounded-xl glass-icon-blue flex items-center justify-center text-blue-600 shadow-xs">
                      <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
                    </div>
                  </div>
                  <div className="flex-1 text-left py-1 text-xs sm:text-sm font-medium text-slate-400 group-hover:text-slate-600 select-none truncate">
                    Search tools by name, category, or offer (e.g. Gemini, AdMob, Workspace, Jio 100GB)...
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex-shrink-0 cursor-pointer hover:shadow-md"
                  >
                    Visual Search
                  </button>
                </div>

                {/* Quick Section Jumper Pills */}
                <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-semibold text-slate-600">
                  <span className="text-slate-400 text-xs">Explore:</span>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('ai-tools-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="liquid-glass-pill px-3 py-1 text-xs text-violet-700 hover:text-violet-900 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>✨ AI Tools</span>
                  </button>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('monetization-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="liquid-glass-pill px-3 py-1 text-xs text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>💰 Monetisation</span>
                  </button>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('india-offers-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="liquid-glass-pill px-3 py-1 text-xs text-blue-700 hover:text-blue-900 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>📶 Jio & Airtel Perks</span>
                  </button>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('chatbot-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="liquid-glass-pill px-3 py-1 text-xs text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>🤖 Tool Finder AI</span>
                  </button>
                </div>
              </div>

              {/* Symmetrical Trust Metrics Bar */}
              <div className="pt-4 grid grid-cols-3 gap-3.5 max-w-lg border-t border-slate-200/80 items-stretch">
                <div className="p-3.5 rounded-2xl liquid-glass flex flex-col justify-center h-20 shadow-xs">
                  <div className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-none mb-1">25+</div>
                  <div className="text-[11px] text-slate-500 font-medium leading-tight">Authentic Tools</div>
                </div>
                <div className="p-3.5 rounded-2xl liquid-glass flex flex-col justify-center h-20 shadow-xs">
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 leading-none mb-1">100 GB</div>
                  <div className="text-[11px] text-slate-500 font-medium leading-tight">Jio & Airtel Perks</div>
                </div>
                <div className="p-3.5 rounded-2xl liquid-glass flex flex-col justify-center h-20 shadow-xs">
                  <div className="text-xl sm:text-2xl font-extrabold text-blue-600 leading-none mb-1">100%</div>
                  <div className="text-[11px] text-slate-500 font-medium leading-tight">Independent Guide</div>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual Illustration & Interactive Navigator */}
            <div className="lg:col-span-5">
              <HeroEcosystemVisual
                onNavigateProduct={(slug) => onNavigate('product-detail', slug)}
                onNavigateOffer={() => {
                  const el = document.getElementById('india-offers-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onNavigate('india-offers');
                }}
              />
            </div>

          </div>
        </div>
      </section>

      {/* AdSense Placement: Header Leaderboard (Policy Compliant, Inactive until approved) */}
      <AdPlacement slot="header_banner" onOpenAdmin={() => onNavigate('admin' as any)} />

      {/* Owner-Controlled Launch Showcase & Promotional Video (Active only when configured by site owner) */}
      <FeaturedOwnerPromotion />

      {/* 2. POPULAR GOOGLE PRODUCTS (Visual Discovery: Logo-First Cards) */}
      <section id="popular-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        {/* Anchor alias for directory-section without duplicating section */}
        <div id="directory-section" className="-mt-24 pt-24 pointer-events-none" aria-hidden="true"></div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <div className="w-5 h-5 rounded-lg glass-icon-blue flex items-center justify-center text-blue-600">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <span>Everyday Essentials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Popular Google Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Foundational communication, cloud backup, and web exploration tools.
            </p>
          </div>
          
          <button
            onClick={() => onNavigate('products')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer shadow-2xs"
          >
            <span>See all {PRODUCTS.length} products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {popularProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="visual"
              onSelect={(slug) => onNavigate('product-detail', slug)}
            />
          ))}
        </div>
      </section>

      {/* 3. AI TOOLS SECTION (Next-Gen Gemini & Research Intelligence) */}
      <section id="ai-tools-section" className="relative py-14 sm:py-18 bg-gradient-to-b from-violet-50/60 via-slate-50/20 to-white border-y border-slate-200/70 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-bold mb-2 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                <span>Next-Gen Gemini Intelligence</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                AI & Generative Tools
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Multimodal reasoning, grounded research, and developer API studios.
              </p>
            </div>
            
            <button
              onClick={() => onNavigate('ai-tools')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <span>See all AI Tools</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {aiProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="visual"
                onSelect={(slug) => onNavigate('product-detail', slug)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 4. WEB & CLOUD DEVELOPMENT TOOLS */}
      <section id="dev-tools-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <div className="w-5 h-5 rounded-lg glass-icon-indigo flex items-center justify-center text-indigo-600">
                <Code className="w-3.5 h-3.5" />
              </div>
              <span>Engineering & Infrastructure</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Web & App Development Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Backend serverless clouds, native Android IDEs, and GPU machine learning runtimes.
            </p>
          </div>

          <button
            onClick={() => onNavigate('products', 'Developer Tools')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer shadow-2xs"
          >
            <span>See all Developer Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {devProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="visual"
              onSelect={(slug) => onNavigate('product-detail', slug)}
            />
          ))}
        </div>
      </section>

      {/* 5. PRODUCTIVITY AND WORKSPACE */}
      <section id="productivity-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              <div className="w-5 h-5 rounded-lg glass-icon-emerald flex items-center justify-center text-emerald-600">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <span>Office Suite & Teamwork</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Productivity & Workspace
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Collaborative documents, spreadsheets, video conferencing, and business email suites.
            </p>
          </div>

          <button
            onClick={() => onNavigate('pricing')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer shadow-2xs"
          >
            <span>Explore Workspace Plans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {productivityProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="visual"
              onSelect={(slug) => onNavigate('product-detail', slug)}
            />
          ))}
        </div>
      </section>

      {/* 6. MONETISATION TOOLS (AdMob, Play Billing, IMA, Google Ads) */}
      <section id="monetization-section" className="relative py-14 sm:py-18 bg-gradient-to-b from-amber-50/50 via-slate-50/20 to-white border-y border-slate-200/70 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2 shadow-2xs">
                <DollarSign className="w-3.5 h-3.5 text-amber-700" />
                <span>Publisher & Developer Revenue</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Monetisation & Ad Technology
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Official platforms to monetize mobile apps, in-app purchases, digital video, and search traffic.
              </p>
            </div>

            <button
              onClick={() => onNavigate('products', 'Monetisation & Ads')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer shadow-xs"
            >
              <span>See all Monetisation Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {monetizationProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="visual"
                onSelect={(slug) => onNavigate('product-detail', slug)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 7. ANALYTICS AND GROWTH */}
      <section id="analytics-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
              <div className="w-5 h-5 rounded-lg glass-icon-amber flex items-center justify-center text-amber-600">
                <BarChart2 className="w-3.5 h-3.5" />
              </div>
              <span>Measurement & Performance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Analytics & Growth Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track user conversions, search engine visibility, business intelligence dashboards, and petabyte SQL analysis.
            </p>
          </div>

          <button
            onClick={() => onNavigate('products', 'Analytics & Marketing')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 transition-colors cursor-pointer shadow-2xs"
          >
            <span>See all Analytics Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {analyticsProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="visual"
              onSelect={(slug) => onNavigate('product-detail', slug)}
            />
          ))}
        </div>
      </section>

      {/* In-Feed AdSense Placement Placeholder */}
      <AdPlacement slot="in_feed" onOpenAdmin={() => onNavigate('admin' as any)} />

      {/* 8. INDIA OFFERS: JIO & AIRTEL SPOTLIGHT */}
      <section id="india-offers-section" className="bg-gradient-to-br from-emerald-950 via-slate-900 to-indigo-950 text-white py-14 sm:py-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 lg:px-12 relative overflow-hidden shadow-2xl scroll-mt-24">
        <div className="relative max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-800/80 border border-emerald-700 text-xs font-semibold text-emerald-200 shadow-xs">
                <span>India Subscription Intelligence: Jio & Airtel Alliances (₹)</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Verified 100 GB Cloud Storage Perks & Credits in India
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
                Legitimate JioFiber & Airtel Thanks 100 GB Google One perks, Jio AI Cloud sync, $300 GCP credits, and Reserve Bank of India (RBI) e-mandate card guidelines.
              </p>
            </div>

            <button
              onClick={() => onNavigate('india-offers')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-white text-slate-950 hover:bg-emerald-100 transition-colors shadow-md flex-shrink-0 cursor-pointer"
            >
              <span>View All 13 India Offers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {topIndiaOffers.map((offer) => (
              <div key={offer.id} className="text-slate-900 h-full flex flex-col">
                <OfferCard offer={offer} />
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-800 flex flex-wrap items-center justify-between gap-4 text-xs text-emerald-200">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>Jio & Airtel Customer Notice:</strong> Claim benefits strictly through official MyJio or Airtel Thanks apps. Never input passwords on unverified SMS/WhatsApp links.
              </span>
            </div>
            <button 
              onClick={() => onNavigate('tutorial-detail', 'discovering-eligible-offers-india')}
              className="text-white underline font-semibold hover:text-emerald-100 cursor-pointer"
            >
              Safety Guide &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* 9. TUTORIALS AND STEP-BY-STEP GUIDES */}
      <section id="tutorials-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <div className="w-5 h-5 rounded-lg glass-icon-blue flex items-center justify-center text-blue-600">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span>Knowledge Base</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Tutorials & Step-by-Step Masterclasses
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Actionable guides on Gemini prompting, custom email setup, and cloud storage management.
            </p>
          </div>
          
          <button
            onClick={() => onNavigate('tutorials')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors shadow-2xs cursor-pointer"
          >
            <span>See all {TUTORIALS.length} Guides</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {topTutorials.map((tut) => (
            <TutorialCard
              key={tut.id}
              tutorial={tut}
              onSelect={(slug) => onNavigate('tutorial-detail', slug)}
            />
          ))}
        </div>
      </section>

      {/* 10. OUR SOFTWARE — STANDALONE BRING MY BITE UTILITIES */}
      <section id="our-software-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        {/* Anchor alias for pricing-section without duplicating section */}
        <div id="pricing-section" className="-mt-24 pt-24 pointer-events-none" aria-hidden="true"></div>
        <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/90 shadow-xl space-y-8">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold shadow-2xs">
              <Calculator className="w-3.5 h-3.5" />
              <span>Built by Bring My Bite</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Our Software & Interactive Calculators
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Proprietary, client-side tools to calculate Google Workspace business licensing costs in INR, compare storage tiers, and audit RBI recurring banking mandates.
            </p>
          </div>

          {/* Embedded Interactive Cost Calculator */}
          <WorkspaceCalculator />
        </div>
      </section>

      {/* 11. TOOL FINDER AI — INTERACTIVE LIQUID GLASS AI CHATBOT PANEL */}
      <section id="chatbot-section" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="space-y-4">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Live Assistant</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Tool Finder AI Assistant
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Ask anything about Google products, pricing in India, student research tools, or cloud credits.
            </p>
          </div>

          <ToolFinderChatbot 
            onNavigateProduct={(slug) => onNavigate('product-detail', slug)}
            onNavigateTutorial={(slug) => onNavigate('tutorial-detail', slug)}
            onNavigateOffer={() => onNavigate('india-offers')}
            isFloatingWidget={false}
          />
        </div>
      </section>

      {/* Bottom AdSense Billboard Placement */}
      <AdPlacement slot="footer_banner" onOpenAdmin={() => onNavigate('admin' as any)} />

      {/* Newsletter Signup & Editorial Independence Disclaimer */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="liquid-glass rounded-3xl p-8 sm:p-10 border border-white/90 shadow-xl text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl glass-icon-blue flex items-center justify-center text-blue-600 mx-auto shadow-sm">
            <Mail className="w-6 h-6" />
          </div>
          
          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Stay Informed on Google Updates & Indian Perks
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get monthly audits of newly released Google AI capabilities, price modifications, and carrier storage bundles. No spam, ever.
            </p>
          </div>

          {newsletterStatus === 'success' ? (
            <div role="status" aria-live="polite" className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold inline-flex items-center gap-2 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{newsletterMsg}</span>
            </div>
          ) : newsletterStatus === 'already_subscribed' ? (
            <div role="status" aria-live="polite" className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold inline-flex items-center gap-2 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>{newsletterMsg}</span>
            </div>
          ) : (
            <div className="space-y-3 max-w-md mx-auto">
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2" aria-label="Newsletter subscription form">
                <label htmlFor="homepage-newsletter-email" className="sr-only">
                  Email address for Google updates newsletter
                </label>
                <input
                  id="homepage-newsletter-email"
                  type="email"
                  required
                  disabled={newsletterStatus === 'loading'}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  aria-label="Subscribe to newsletter"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex-shrink-0 cursor-pointer"
                >
                  {newsletterStatus === 'loading' ? 'Saving...' : 'Subscribe'}
                </button>
              </form>

              {newsletterStatus === 'error' && (
                <div role="alert" aria-live="assertive" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{newsletterMsg}</span>
                </div>
              )}
            </div>
          )}

          <div className="pt-2 text-[11px] text-slate-400 max-w-xl mx-auto">
            Bring My Bite is strictly independent. Trademarks and brand names are referenced solely for identification and educational review under fair use.
          </div>
        </div>
      </section>

    </div>
  );
};
