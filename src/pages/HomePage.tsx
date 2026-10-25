import React, { useState, useEffect, useRef } from 'react';
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
  Calculator,
  Loader2,
  Phone,
  Briefcase,
  Clock,
  Wrench,
  Headset,
  Rocket,
  Laptop,
  ShoppingCart,
  Sliders,
  Users,
  Languages,
  FileText,
  Bot
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
import { ProductLogo } from '../components/ProductLogo';
import { WaterLightGlass } from '../components/WaterLightGlass';

interface HomePageProps {
  onNavigate: (view: string, slug?: string) => void;
  onOpenSearch: () => void;
}

interface EnquiryFormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  description: string;
  keyRequirements: string;
  budgetRange: string;
  timeframe: string;
  existingUrl: string;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenSearch }) => {
  // Ensure fresh page load on homepage strictly starts at top (0,0)
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash === '#/' || hash === '#home') {
      window.scrollTo(0, 0);
    }
  }, []);

  // Professional Software Development Project Enquiry Form State
  const [enquiryForm, setEnquiryForm] = useState<EnquiryFormData>({
    name: '',
    email: '',
    phone: '',
    projectType: 'Portal',
    description: '',
    keyRequirements: '',
    budgetRange: '₹50,000 – ₹1,50,000 / $600 – $1,800',
    timeframe: '2 to 4 weeks',
    existingUrl: ''
  });
  const [honeypot, setHoneypot] = useState('');
  const [enquiryErrors, setEnquiryErrors] = useState<Record<string, string>>({});
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [enquiryServerError, setEnquiryServerError] = useState<string | null>(null);
  const [enquirySuccess, setEnquirySuccess] = useState<{
    confirmationId: string;
    timestamp: string;
    message: string;
  } | null>(null);

  const enquiryStartTimeRef = useRef<number>(Date.now());

  const validateEnquiry = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    const name = enquiryForm.name.trim();
    if (!name || name.length < 2) {
      errors.name = 'Full name is required (minimum 2 characters).';
    }

    const email = enquiryForm.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = 'A valid email address is required.';
    }

    const phone = enquiryForm.phone.trim();
    if (!phone || phone.length < 7) {
      errors.phone = 'A valid Phone / WhatsApp number is required.';
    }

    if (!enquiryForm.projectType) {
      errors.projectType = 'Please select a project type.';
    }

    const desc = enquiryForm.description.trim();
    if (!desc || desc.length < 10) {
      errors.description = 'Please provide a brief project description (minimum 10 characters).';
    }

    const reqs = enquiryForm.keyRequirements.trim();
    if (!reqs || reqs.length < 10) {
      errors.keyRequirements = 'Please specify key features and requirements (minimum 10 characters).';
    }

    if (!enquiryForm.budgetRange) {
      errors.budgetRange = 'Please select your estimated budget range.';
    }

    if (!enquiryForm.timeframe) {
      errors.timeframe = 'Please select your preferred delivery timeframe.';
    }

    return errors;
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateEnquiry();
    if (Object.keys(errors).length > 0) {
      setEnquiryErrors(errors);
      return;
    }

    setEnquiryErrors({});
    setEnquiryServerError(null);
    setIsSubmittingEnquiry(true);

    // Bot detection check: enforce 1200ms minimum user interaction
    const elapsed = Date.now() - enquiryStartTimeRef.current;
    if (elapsed < 1200) {
      await new Promise(r => setTimeout(r, 1200 - elapsed));
    }

    const formattedMessage = [
      `Project Type: ${enquiryForm.projectType}`,
      `Phone / WhatsApp: ${enquiryForm.phone.trim()}`,
      enquiryForm.existingUrl.trim() ? `Existing Website/App URL: ${enquiryForm.existingUrl.trim()}` : null,
      `Budget Range: ${enquiryForm.budgetRange}`,
      `Preferred Delivery Timeframe: ${enquiryForm.timeframe}`,
      '',
      '--- BRIEF PROJECT DESCRIPTION ---',
      enquiryForm.description.trim(),
      '',
      '--- REQUIRED FEATURES & KEY REQUIREMENTS ---',
      enquiryForm.keyRequirements.trim()
    ].filter(line => line !== null).join('\n');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: enquiryForm.name.trim(),
          email: enquiryForm.email.trim().toLowerCase(),
          subject: 'project_enquiry',
          message: formattedMessage,
          website: honeypot,
          formStartTime: enquiryStartTimeRef.current
        })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setEnquirySuccess({
          confirmationId: data.confirmationId || `GTF-PRJ-${Date.now().toString(36).toUpperCase()}`,
          timestamp: data.timestamp || new Date().toISOString(),
          message: data.message || 'Your project enquiry has been successfully delivered to our development team.'
        });
        setEnquiryForm({
          name: '',
          email: '',
          phone: '',
          projectType: 'Portal',
          description: '',
          keyRequirements: '',
          budgetRange: '₹50,000 – ₹1,50,000 / $600 – $1,800',
          timeframe: '2 to 4 weeks',
          existingUrl: ''
        });
        setHoneypot('');
      } else {
        if (data.details) {
          setEnquiryErrors(data.details);
        }
        setEnquiryServerError(
          data.error || 'Unable to submit your enquiry at this time. Please contact us directly at bringmybite@gmail.com.'
        );
      }
    } catch (err) {
      console.error('[Client Enquiry Submission Error]', err);
      setEnquiryServerError(
        'Network error connecting to the submission service. Please check your connection or contact bringmybite@gmail.com directly.'
      );
    } finally {
      setIsSubmittingEnquiry(false);
    }
  };

  const handleResetEnquiry = () => {
    setEnquirySuccess(null);
    setEnquiryServerError(null);
    setEnquiryErrors({});
    enquiryStartTimeRef.current = Date.now();
  };

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

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">

      {/* Animated What's New laser showcase directly beneath the site navigation */}
      <section aria-label="What's New at Google Tool Finder" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-3">
        <style>{`
          @keyframes gtf-laser-sweep { 0% { transform: translateX(-130%) rotate(12deg); opacity: 0; } 12% { opacity: .95; } 88% { opacity: .8; } 100% { transform: translateX(420%) rotate(12deg); opacity: 0; } }
          @keyframes gtf-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          @keyframes gtf-neon-pulse { 0%,100% { box-shadow: 0 0 12px rgba(34,211,238,.18), inset 0 0 18px rgba(168,85,247,.08); } 50% { box-shadow: 0 0 30px rgba(34,211,238,.32), 0 0 48px rgba(168,85,247,.18), inset 0 0 22px rgba(168,85,247,.14); } }
          @media (prefers-reduced-motion: reduce) { .gtf-laser-motion, .gtf-marquee-motion { animation: none !important; } }
        `}</style>
        <div className="relative isolate overflow-hidden rounded-[1.6rem] border border-cyan-300/40 bg-slate-950 text-white shadow-2xl" style={{ animation: 'gtf-neon-pulse 4s ease-in-out infinite' }}>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70" style={{ background: 'radial-gradient(ellipse at 10% 0%, rgba(14,165,233,.28), transparent 42%), radial-gradient(ellipse at 90% 100%, rgba(168,85,247,.30), transparent 48%), linear-gradient(120deg, transparent 20%, rgba(34,211,238,.06) 50%, transparent 80%)' }} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[1.6rem] border border-cyan-200/20" />
          <div aria-hidden="true" className="gtf-laser-motion pointer-events-none absolute -inset-y-12 left-0 z-10 w-24 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent blur-md" style={{ animation: 'gtf-laser-sweep 5s ease-in-out infinite' }} />
          <div className="relative px-4 py-5 sm:px-7 sm:py-6 lg:px-9">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[.22em] text-cyan-200">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-300 opacity-80" /><span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-200" /></span>
                Live discovery · Fresh picks
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[.24em] text-slate-400">Google Tool Finder</span>
            </div>
            <div className="mt-4 grid items-center gap-5 lg:grid-cols-[1fr_auto]">
              <div className="min-w-0">
                <h2 className="text-3xl font-black uppercase leading-none tracking-tight sm:text-5xl lg:text-6xl">
                  <span className="bg-gradient-to-r from-cyan-200 via-white to-fuchsia-300 bg-clip-text text-transparent">What’s New</span>
                  <span className="ml-2 inline-block text-cyan-300" aria-hidden="true">✦</span>
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">Fresh Google launches, free learning routes, skill badges and useful guides — all in one place.</p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button type="button" onClick={() => onNavigate('latest-updates')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200/60 bg-cyan-300 px-4 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950">
                  <Sparkles className="h-4 w-4" /> Explore updates <ArrowRight className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => onNavigate('tutorials')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:border-fuchsia-300/60 hover:bg-fuchsia-300/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-300">
                  <BookOpen className="h-4 w-4" /> Learn free
                </button>
              </div>
            </div>
            <div className="mt-5 overflow-hidden border-y border-white/10 py-3" aria-label="Highlights">
              <div className="gtf-marquee-motion flex w-max items-center gap-3" style={{ animation: 'gtf-marquee 28s linear infinite' }}>
                {[0,1].map(copy => <div key={copy} className="flex shrink-0 items-center gap-3 pr-3">
                  {[
                    ['🎓','FREE LEARNING PATHS'],
                    ['✦','GOOGLE SKILL BADGES'],
                    ['⚡','NEW AI & CLOUD TOOLS'],
                    ['◈','STEP-BY-STEP GUIDES'],
                    ['↗','LATEST PRODUCT UPDATES']
                  ].map(([icon, label]) => <span key={label} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-3 py-2 text-[10px] font-extrabold tracking-[.12em] text-slate-200 sm:text-xs"><span className="text-cyan-300">{icon}</span>{label}</span>)}
                </div>)}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />
              <span>Certificate costs and eligibility vary — check each official program before enrolling.</span>
            </div>
          </div>
        </div>
      </section>

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
                      window.dispatchEvent(new CustomEvent('open-tool-finder-chatbot'));
                      const launcher = document.getElementById('tool-finder-chatbot-launcher');
                      if (launcher) launcher.click();
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

      {/* ECOSYSTEM ARCHITECTURE & PURPOSE: THE 3 FOUNDATIONAL TIERS */}
      <section id="ecosystem-architecture" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-xl relative overflow-hidden">

          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-10">
            {/* Header: Platform Purpose */}
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                <span>Why Google Tool Finder Exists</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Empowering Discovery Across Google's Ecosystem
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Google Tool Finder was created by parent company <strong className="text-white">Bring My Bite</strong> to provide independent clarity in a complex tech landscape. We cut through marketing hype, unravel rapid renames, verify genuine Indian telecom storage perks (Jio & Airtel), and guide you directly to the tools that elevate your personal and business productivity.
              </p>
            </div>

            {/* The Three Named Sections: 3-Column Architectural Cards */}
            <div className="grid md:grid-cols-3 gap-6 items-stretch">

              {/* Pillar 1: ONE-CLICK-TO-NEURAL */}
              <div className="rounded-2xl bg-slate-800/60 border border-violet-500/30 p-6 flex flex-col justify-between space-y-5 hover:border-violet-400/60 transition-all duration-300 backdrop-blur-sm group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      Tier 1 • AI & Reasoning
                    </span>
                    <Sparkles className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                    <span className="bg-gradient-to-r from-violet-300 to-purple-400 bg-clip-text text-transparent">
                      ONE-CLICK-TO-NEURAL
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Instant, friction-free discovery of Google's frontier AI capabilities. Grounded synthesis with <strong className="text-white">NotebookLM</strong>, multimodal reasoning via <strong className="text-white">Gemini</strong>, developer prototyping in <strong className="text-white">Google AI Studio</strong>, and autonomous coding with <strong className="text-white">Google Antigravity</strong>.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {['gemini', 'notebooklm', 'google-ai-studio', 'google-antigravity'].map((slug) => (
                      <button
                        key={slug}
                        onClick={() => onNavigate('product-detail', slug)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-700/60 hover:bg-violet-600 hover:text-white text-slate-300 font-medium transition-colors cursor-pointer"
                      >
                        {slug === 'gemini' ? 'Gemini' : slug === 'notebooklm' ? 'NotebookLM' : slug === 'google-ai-studio' ? 'AI Studio' : 'Antigravity'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const el = document.getElementById('ai-tools-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else onNavigate('ai-tools');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600/80 hover:bg-violet-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <span>Explore Neural AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Pillar 2: QUANTUM ENGINE */}
              <div className="rounded-2xl bg-slate-800/60 border border-blue-500/30 p-6 flex flex-col justify-between space-y-5 hover:border-blue-400/60 transition-all duration-300 backdrop-blur-sm group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Tier 2 • Cloud & Compute
                    </span>
                    <Cpu className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                    <span className="bg-gradient-to-r from-blue-300 to-cyan-400 bg-clip-text text-transparent">
                      QUANTUM ENGINE
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Demystifying Google's deep engineering stack and developer cloud infrastructure. Deploy serverless backends with <strong className="text-white">Firebase</strong>, query petabyte data via <strong className="text-white">BigQuery</strong>, build native mobile apps with <strong className="text-white">Android Studio</strong>, and train models on <strong className="text-white">Google Cloud</strong>.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {['google-cloud', 'firebase', 'bigquery', 'android-studio'].map((slug) => (
                      <button
                        key={slug}
                        onClick={() => onNavigate('product-detail', slug)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-700/60 hover:bg-blue-600 hover:text-white text-slate-300 font-medium transition-colors cursor-pointer"
                      >
                        {slug === 'google-cloud' ? 'Google Cloud' : slug === 'firebase' ? 'Firebase' : slug === 'bigquery' ? 'BigQuery' : 'Android Studio'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const el = document.getElementById('dev-tools-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else onNavigate('products', 'Developer Tools');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <span>Explore Cloud Engine</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Pillar 3: TOTAL COGNITIVE NEXUS */}
              <div className="rounded-2xl bg-slate-800/60 border border-emerald-500/30 p-6 flex flex-col justify-between space-y-5 hover:border-emerald-400/60 transition-all duration-300 backdrop-blur-sm group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Tier 3 • Workspace Nexus
                    </span>
                    <Globe className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                    <span className="bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent">
                      TOTAL COGNITIVE NEXUS
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Unifying collaboration, enterprise document workflows, and transparent licensing. Discover team communication across <strong className="text-white">Google Workspace</strong>, secure file storage in <strong className="text-white">Google Drive</strong>, real-time editing in <strong className="text-white">Docs & Sheets</strong>, and HD video on <strong className="text-white">Google Meet</strong>.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {['google-workspace', 'google-drive', 'google-docs', 'google-meet'].map((slug) => (
                      <button
                        key={slug}
                        onClick={() => onNavigate('product-detail', slug)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-700/60 hover:bg-emerald-600 hover:text-white text-slate-300 font-medium transition-colors cursor-pointer"
                      >
                        {slug === 'google-workspace' ? 'Workspace' : slug === 'google-drive' ? 'Drive' : slug === 'google-docs' ? 'Docs' : 'Meet'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const el = document.getElementById('productivity-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else onNavigate('pricing');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <span>Explore Total Nexus</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

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
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-bold shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                  <span>Next-Gen Gemini Intelligence</span>
                </div>
                <span className="text-[10px] tracking-wider font-black uppercase bg-violet-200/80 text-violet-900 px-2.5 py-0.5 rounded-full border border-violet-300/60">
                  ONE-CLICK-TO-NEURAL
                </span>
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
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                <div className="w-5 h-5 rounded-lg glass-icon-indigo flex items-center justify-center text-indigo-600">
                  <Code className="w-3.5 h-3.5" />
                </div>
                <span>Engineering & Infrastructure</span>
              </div>
              <span className="text-[10px] tracking-wider font-black uppercase bg-indigo-100 text-indigo-900 px-2.5 py-0.5 rounded-full border border-indigo-200">
                QUANTUM ENGINE
              </span>
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
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                <div className="w-5 h-5 rounded-lg glass-icon-emerald flex items-center justify-center text-emerald-600">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <span>Office Suite & Teamwork</span>
              </div>
              <span className="text-[10px] tracking-wider font-black uppercase bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-200">
                TOTAL COGNITIVE NEXUS
              </span>
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

      {/* Bottom AdSense Billboard Placement */}
      <AdPlacement slot="footer_banner" onOpenAdmin={() => onNavigate('admin' as any)} />

      {/* 11. CLIENT SOFTWARE DEVELOPMENT ENQUIRY SECTION (3-COLUMN RESPONSIVE LAYOUT) */}
      <section id="enquiry-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 items-stretch">

          {/* LEFT COLUMN: WHAT WE DO */}
          <div className="lg:col-span-3 min-w-0 h-full">
            <div className="water-glass-panel h-full p-5 sm:p-6 space-y-5 flex flex-col">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold shadow-2xs border border-blue-200/60">
                  <Code className="w-3.5 h-3.5 text-blue-600" />
                  <span>Engineering</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold crystal-heading tracking-tight">
                  What We Do
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  We learn from giants. We work with giants’ products and tools. We develop solutions with Automation.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-200/70">
                {/* 1. Portal Development */}
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs hover:border-cyan-400 hover:bg-white transition-all">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 tracking-tight">Portal Development</span>
                </div>

                {/* 2. Web Development */}
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs hover:border-cyan-400 hover:bg-white transition-all">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Laptop className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 tracking-tight">Web Development</span>
                </div>

                {/* 3. E-commerce Solutions */}
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs hover:border-cyan-400 hover:bg-white transition-all">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 tracking-tight">E-commerce Solutions</span>
                </div>

                {/* 4. Management Solutions */}
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs hover:border-cyan-400 hover:bg-white transition-all">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <Sliders className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 tracking-tight">Management Solutions</span>
                </div>

                {/* 5. CRM Development */}
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs hover:border-cyan-400 hover:bg-white transition-all">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 tracking-tight">CRM Development</span>
                </div>

                {/* 6. Entire Marketing System */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-cyan-50/50 border border-cyan-200/80 shadow-2xs hover:border-cyan-400 hover:bg-white transition-all space-y-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 tracking-tight">Entire Marketing System</span>
                  </div>
                  <p className="text-[11px] text-cyan-800 font-medium pl-9 leading-snug">
                    And it’s tailored to your requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: PROJECT ENQUIRY FORM */}
          <div className="lg:col-span-6 min-w-0 h-full">
            <div className="water-glass-form-elevated h-full p-5 sm:p-7 lg:p-8 space-y-6 flex flex-col">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-800 text-xs font-bold shadow-2xs border border-indigo-200/60">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Client Intake</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold crystal-heading tracking-tight">
                  Project Inquiry Form
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Tell us about your project requirements and expected timeframe. We review every enquiry and reply within 24 hours.
                </p>
              </div>

              {enquirySuccess ? (
                <div role="status" aria-live="polite" className="p-6 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 space-y-4 shadow-sm animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-950">Enquiry Submitted Successfully</h4>
                      <p className="text-xs text-emerald-800">Reference Confirmation ID: <span className="font-mono font-bold">{enquirySuccess.confirmationId}</span></p>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    {enquirySuccess.message}
                  </p>
                  <div className="p-3 bg-white/90 rounded-xl border border-emerald-200 text-[11px] text-slate-600 space-y-1">
                    <div><strong>Project Type:</strong> {enquiryForm.projectType || 'Custom Project'}</div>
                    <div><strong>Status:</strong> Dispatched to engineering team</div>
                    <div><strong>Response Guarantee:</strong> Within 24–48 hours</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetEnquiry}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    Submit Another Project Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4" noValidate aria-label="Software development project enquiry form">
                  {enquiryServerError && (
                    <div role="alert" aria-live="assertive" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="font-bold">Submission Notice</div>
                        <div className="leading-relaxed">{enquiryServerError}</div>
                        <div className="pt-1 text-[11px]">Direct Email: <a href="mailto:bringmybite@gmail.com" className="underline font-bold">bringmybite@gmail.com</a></div>
                      </div>
                    </div>
                  )}

                  {/* Honeypot field for spam bots */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="sr-only"
                    aria-hidden="true"
                  />

                  {/* Row 1: Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label htmlFor="enquiry-name" className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="enquiry-name"
                        type="text"
                        required
                        disabled={isSubmittingEnquiry}
                        value={enquiryForm.name}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full px-3.5 py-2.5 bg-white border ${enquiryErrors.name ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 focus:border-cyan-500 focus:ring-cyan-400/30'} rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 shadow-2xs transition-all disabled:opacity-60`}
                      />
                      {enquiryErrors.name && (
                        <p className="text-[10.5px] text-red-600 font-medium">{enquiryErrors.name}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="enquiry-email" className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="enquiry-email"
                        type="email"
                        required
                        disabled={isSubmittingEnquiry}
                        value={enquiryForm.email}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                        placeholder="e.g. rahul@example.com"
                        className={`w-full px-3.5 py-2.5 bg-white border ${enquiryErrors.email ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 focus:border-cyan-500 focus:ring-cyan-400/30'} rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 shadow-2xs transition-all disabled:opacity-60`}
                      />
                      {enquiryErrors.email && (
                        <p className="text-[10.5px] text-red-600 font-medium">{enquiryErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Phone/WhatsApp & Project Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label htmlFor="enquiry-phone" className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                        Phone / WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        <input
                          id="enquiry-phone"
                          type="tel"
                          required
                          disabled={isSubmittingEnquiry}
                          value={enquiryForm.phone}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className={`w-full pl-9 pr-3.5 py-2.5 bg-white border ${enquiryErrors.phone ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 focus:border-cyan-500 focus:ring-cyan-400/30'} rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 shadow-2xs transition-all disabled:opacity-60`}
                        />
                      </div>
                      {enquiryErrors.phone && (
                        <p className="text-[10.5px] text-red-600 font-medium">{enquiryErrors.phone}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="enquiry-project-type" className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                        Project Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="enquiry-project-type"
                        required
                        disabled={isSubmittingEnquiry}
                        value={enquiryForm.projectType}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, projectType: e.target.value })}
                        className={`w-full px-3.5 py-2.5 bg-white border ${enquiryErrors.projectType ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 focus:border-cyan-500 focus:ring-cyan-400/30'} rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 shadow-2xs transition-all disabled:opacity-60 cursor-pointer`}
                      >
                        <option value="Portal">Portal Development</option>
                        <option value="Web App">Web Application</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="Custom Software">Custom Software Solutions</option>
                        <option value="Other">Other Project</option>
                      </select>
                      {enquiryErrors.projectType && (
                        <p className="text-[10.5px] text-red-600 font-medium">{enquiryErrors.projectType}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Budget Range & Preferred Delivery Timeframe */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label htmlFor="enquiry-budget" className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                        Budget Range <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="enquiry-budget"
                        required
                        disabled={isSubmittingEnquiry}
                        value={enquiryForm.budgetRange}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, budgetRange: e.target.value })}
                        className={`w-full px-3.5 py-2.5 bg-white border ${enquiryErrors.budgetRange ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 focus:border-cyan-500 focus:ring-cyan-400/30'} rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 shadow-2xs transition-all disabled:opacity-60 cursor-pointer`}
                      >
                        <option value="Under ₹50,000 / $600">Under ₹50,000 / $600 (Starter / MVP)</option>
                        <option value="₹50,000 – ₹1,50,000 / $600 – $1,800">₹50,000 – ₹1,50,000 / $600 – $1,800</option>
                        <option value="₹1,50,000 – ₹3,50,000 / $1,800 – $4,200">₹1,50,000 – ₹3,50,000 / $1,800 – $4,200</option>
                        <option value="₹3,50,000 – ₹7,50,000 / $4,200 – $9,000">₹3,50,000 – ₹7,50,000 / $4,200 – $9,000</option>
                        <option value="₹7,50,000+ / $9,000+ (Enterprise)">₹7,50,000+ / $9,000+ (Enterprise)</option>
                        <option value="Flexible / Scope-dependent">Flexible / Scope-dependent</option>
                      </select>
                      {enquiryErrors.budgetRange && (
                        <p className="text-[10.5px] text-red-600 font-medium">{enquiryErrors.budgetRange}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="enquiry-timeframe" className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                        Preferred Delivery Timeframe <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="enquiry-timeframe"
                        required
                        disabled={isSubmittingEnquiry}
                        value={enquiryForm.timeframe}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, timeframe: e.target.value })}
                        className={`w-full px-3.5 py-2.5 bg-white border ${enquiryErrors.timeframe ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 focus:border-cyan-500 focus:ring-cyan-400/30'} rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 shadow-2xs transition-all disabled:opacity-60 cursor-pointer`}
                      >
                        <option value="Urgent (< 2 weeks)">Urgent (&lt; 2 weeks)</option>
                        <option value="2 to 4 weeks">2 to 4 weeks</option>
                        <option value="1 to 2 months">1 to 2 months</option>
                        <option value="2 to 3 months">2 to 3 months</option>
                        <option value="Flexible / Ongoing">Flexible / Ongoing</option>
                      </select>
                      {enquiryErrors.timeframe && (
                        <p className="text-[10.5px] text-red-600 font-medium">{enquiryErrors.timeframe}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Existing Website / App URL (Optional) */}
                  <div className="space-y-1">
                    <label htmlFor="enquiry-existing-url" className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                      Existing Website / App URL <span className="text-slate-400 font-normal normal-case">(optional)</span>
                    </label>
                    <div className="relative">
                      <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        id="enquiry-existing-url"
                        type="url"
                        disabled={isSubmittingEnquiry}
                        value={enquiryForm.existingUrl}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, existingUrl: e.target.value })}
                        placeholder="https://yourcompany.com"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-300 focus:border-cyan-500 focus:ring-cyan-400/30 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 shadow-2xs transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Row 5: Brief Project Description */}
                  <div className="space-y-1">
                    <label htmlFor="enquiry-description" className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                      Brief Project Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="enquiry-description"
                      rows={3}
                      required
                      disabled={isSubmittingEnquiry}
                      value={enquiryForm.description}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, description: e.target.value })}
                      placeholder="Summarize your project goals, target audience, and primary problem to solve..."
                      className={`w-full px-3.5 py-2.5 bg-white border ${enquiryErrors.description ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 focus:border-cyan-500 focus:ring-cyan-400/30'} rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 shadow-2xs transition-all disabled:opacity-60 resize-y`}
                    />
                    {enquiryErrors.description && (
                      <p className="text-[10.5px] text-red-600 font-medium">{enquiryErrors.description}</p>
                    )}
                  </div>

                  {/* Row 6: Required Features & Key Requirements */}
                  <div className="space-y-1">
                    <label htmlFor="enquiry-requirements" className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                      Required Features & Key Requirements <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="enquiry-requirements"
                      rows={3}
                      required
                      disabled={isSubmittingEnquiry}
                      value={enquiryForm.keyRequirements}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, keyRequirements: e.target.value })}
                      placeholder="List key modules (e.g. user authentication, payment gateway, admin portal, analytics API, mobile responsiveness)..."
                      className={`w-full px-3.5 py-2.5 bg-white border ${enquiryErrors.keyRequirements ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 focus:border-cyan-500 focus:ring-cyan-400/30'} rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 shadow-2xs transition-all disabled:opacity-60 resize-y`}
                    />
                    {enquiryErrors.keyRequirements && (
                      <p className="text-[10.5px] text-red-600 font-medium">{enquiryErrors.keyRequirements}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingEnquiry}
                      className="w-full py-3 px-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:via-indigo-700 hover:to-cyan-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmittingEnquiry ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Project Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Project Enquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              <div className="pt-2 text-[11px] text-slate-500 text-center font-medium">
                Bring My Bite Software Services &bull; All enquiries handled confidentially under NDA &bull; No spam guaranteed.
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: WHY WORK WITH US */}
          <div className="lg:col-span-3 min-w-0 h-full">
            <div className="water-glass-panel h-full p-5 sm:p-6 space-y-5 flex flex-col">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold shadow-2xs border border-emerald-200/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Advantage</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold crystal-heading tracking-tight">
                  Why Work With Us
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Direct engineering accountability, rapid turnaround, and lifecycle continuity from concept to production.
                </p>
              </div>

              <div className="space-y-3.5 pt-1 border-t border-slate-200/70">
                {/* Benefit Card 1: Your Portal. Your Language. */}
                <div className="water-glass-benefit-card space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Languages className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-snug">
                      Your Portal. Your Language.
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-0.5">
                    We will make your portal talk in your language with your own friendly AI.
                  </p>
                  <p className="text-[10px] text-slate-400 italic pl-0.5 pt-0.5">
                    *Terms and conditions apply.
                  </p>
                </div>

                {/* Benefit Card 2: Be Truly Independent */}
                <div className="water-glass-benefit-card space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-snug">
                      Be Truly Independent
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-0.5">
                    We build solutions that give you greater control, so you can manage everyday changes without depending on a developer for every small update.
                  </p>
                  <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-950 leading-relaxed font-normal">
                    Every project includes a practical PDF guide covering how your software works, configuration, environment variables, API integrations, and step-by-step instructions for future changes.
                  </div>
                </div>
              </div>

              {/* Direct Contact Card */}
              <div className="pt-2 border-t border-slate-200/70">
                <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Direct Inquiries</span>
                  </div>
                  <a
                    href="mailto:bringmybite@gmail.com"
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 break-all block"
                  >
                    bringmybite@gmail.com
                  </a>
                  <p className="text-[10px] text-slate-500 leading-snug">
                    Prefer direct email? Send your project brief directly to our team.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
