import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { AffiliateGlobalNotice } from './components/AffiliateNotice';
import { HomePage } from './pages/HomePage';
import { ToolFinderChatbot } from './components/ToolFinderChatbot';
import { AuthProvider } from './context/AuthContext';
import { GoogleSignInModal } from './components/GoogleSignInModal';
import { PRODUCTS } from './data/products';
import { TUTORIALS } from './data/tutorials';
import { COMPARISONS } from './data/comparisons';

// Code-split route components to optimize initial bundle size below 500kB
const ProductsPage = lazy(() => import('./pages/ProductsPage').then(m => ({ default: m.ProductsPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const AIToolsPage = lazy(() => import('./pages/AIToolsPage').then(m => ({ default: m.AIToolsPage })));
const FreeToolsPage = lazy(() => import('./pages/FreeToolsPage').then(m => ({ default: m.FreeToolsPage })));
const PricingPlansPage = lazy(() => import('./pages/PricingPlansPage').then(m => ({ default: m.PricingPlansPage })));
const IndiaOffersPage = lazy(() => import('./pages/IndiaOffersPage').then(m => ({ default: m.IndiaOffersPage })));
const TutorialsPage = lazy(() => import('./pages/TutorialsPage').then(m => ({ default: m.TutorialsPage })));
const TutorialDetailPage = lazy(() => import('./pages/TutorialDetailPage').then(m => ({ default: m.TutorialDetailPage })));
const ComparisonsPage = lazy(() => import('./pages/ComparisonsPage').then(m => ({ default: m.ComparisonsPage })));
const ComparisonDetailPage = lazy(() => import('./pages/ComparisonDetailPage').then(m => ({ default: m.ComparisonDetailPage })));
const LatestUpdatesPage = lazy(() => import('./pages/LatestUpdatesPage').then(m => ({ default: m.LatestUpdatesPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AffiliateDisclosurePage = lazy(() => import('./pages/AffiliateDisclosurePage').then(m => ({ default: m.AffiliateDisclosurePage })));
const LegalPage = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.LegalPage })));
const NotFoundPage = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.NotFoundPage })));
const AdminMonetizationPage = lazy(() => import('./pages/AdminMonetizationPage').then(m => ({ default: m.AdminMonetizationPage })));

export type AppView = 
  | 'home'
  | 'products'
  | 'product-detail'
  | 'ai-tools'
  | 'free-tools'
  | 'pricing'
  | 'india-offers'
  | 'tutorials'
  | 'tutorial-detail'
  | 'comparisons'
  | 'comparison-detail'
  | 'latest-updates'
  | 'about'
  | 'contact'
  | 'affiliate-disclosure'
  | 'privacy'
  | 'terms'
  | 'admin'
  | 'not-found';

const PageLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
    <div className="relative w-12 h-12 flex items-center justify-center">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 animate-spin opacity-80" />
      <div className="relative w-8 h-8 rounded-xl bg-white/90 backdrop-blur-md shadow-inner flex items-center justify-center">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
      </div>
    </div>
    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400 animate-pulse">Loading View...</p>
  </div>
);

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currentSlug, setCurrentSlug] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Parse location hash or clean pathname on load & navigation
  const parseRoute = () => {
    // 1. Check hash first for backward compatibility
    let raw = window.location.hash.replace(/^#\/?/, '');
    // 2. Fall back to pathname if no hash
    if (!raw && window.location.pathname && window.location.pathname !== '/') {
      raw = window.location.pathname.replace(/^\//, '');
    }

    if (!raw || raw === 'home') {
      setCurrentView('home');
      setCurrentSlug('');
      return;
    }

    const parts = raw.split('/');
    const view = parts[0] as AppView;
    const slug = parts[1] || '';

    if (view === 'products' && slug) {
      const isProduct = PRODUCTS.some(p => p.slug === slug);
      if (isProduct) {
        setCurrentView('product-detail');
        setCurrentSlug(slug);
      } else {
        setCurrentView('products');
        setCurrentSlug(slug);
      }
    } else if (view === 'tutorials' && slug) {
      setCurrentView('tutorial-detail');
      setCurrentSlug(slug);
    } else if (view === 'comparisons' && slug) {
      setCurrentView('comparison-detail');
      setCurrentSlug(slug);
    } else if ([
      'home', 'products', 'product-detail', 'ai-tools', 'free-tools', 
      'pricing', 'india-offers', 'tutorials', 'tutorial-detail', 
      'comparisons', 'comparison-detail', 'latest-updates', 'about', 
      'contact', 'affiliate-disclosure', 'privacy', 'terms', 'admin'
    ].includes(view)) {
      setCurrentView(view);
      setCurrentSlug(slug);
    } else {
      setCurrentView('not-found');
    }
  };

  useEffect(() => {
    parseRoute();
    const handlePopState = () => parseRoute();
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Dynamic SEO metadata updater (Page titles, descriptions, canonical URLs, and OG tags)
  useEffect(() => {
    let title = 'Google Tool Finder by Bring My Bite - Technology Discovery & Monetisation';
    let description = 'Google Tool Finder by parent company Bring My Bite — Independent Google technology directory, transparent INR pricing, verified free trials, and India telecom cloud perks.';
    let canonicalPath = '/';

    if (currentView === 'home') {
      title = 'Google Tool Finder by Bring My Bite - Technology Discovery & INR Pricing';
      canonicalPath = '/';
    } else if (currentView === 'products') {
      title = currentSlug 
        ? `${currentSlug.charAt(0).toUpperCase() + currentSlug.slice(1)} Google Tools Directory | Google Tool Finder`
        : 'All Google Products & Workspace Directory | Google Tool Finder';
      description = 'Browse complete directory of Google products, Workspace productivity tools, Cloud APIs, and AI models with transparent features.';
      canonicalPath = currentSlug ? `/products/${currentSlug}` : '/products';
    } else if (currentView === 'product-detail' && currentSlug) {
      const p = PRODUCTS.find(prod => prod.slug === currentSlug);
      if (p) {
        title = `${p.name} — Features, India INR Pricing & Alternatives | Google Tool Finder`;
        description = Array.isArray(p.description) ? p.description[0] : (p.tagline || '');
        canonicalPath = `/products/${p.slug}`;
      }
    } else if (currentView === 'ai-tools') {
      title = 'Google AI Tools & Models (Gemini, NotebookLM, AI Studio) | Google Tool Finder';
      description = 'Explore Google generative AI tools, free trials, developer API rate limits, and enterprise pricing.';
      canonicalPath = '/ai-tools';
    } else if (currentView === 'free-tools') {
      title = '100% Free Google Tools & Free-Tier Software | Google Tool Finder';
      description = 'Discover free Google tools for students, creators, and developers with zero monthly subscription fees.';
      canonicalPath = '/free-tools';
    } else if (currentView === 'pricing') {
      title = 'Google Workspace & Cloud Pricing Guide (India INR) | Google Tool Finder';
      description = 'Comprehensive INR pricing comparison for Google Workspace plans, Google One cloud storage, and AI tiers.';
      canonicalPath = '/pricing';
    } else if (currentView === 'india-offers') {
      title = 'Verified Google India Offers, Jio/Airtel Storage Perks & Cloud Credits | Google Tool Finder';
      description = 'Verified Indian carrier bundle perks, Jio Cloud storage partnerships, Airtel Thanks Google One promotions, and GCP credits.';
      canonicalPath = '/india-offers';
    } else if (currentView === 'tutorials') {
      title = 'Step-by-Step Google Tutorials & Setup Guides | Google Tool Finder';
      description = 'Practical step-by-step guides for Google Workspace setup, custom domain email configuration, Gemini API integration, and Drive optimization.';
      canonicalPath = '/tutorials';
    } else if (currentView === 'tutorial-detail' && currentSlug) {
      const tut = TUTORIALS.find(t => t.slug === currentSlug);
      if (tut) {
        title = `${tut.title} | Google Tool Finder`;
        description = tut.summary || tut.title;
        canonicalPath = `/tutorials/${tut.slug}`;
      }
    } else if (currentView === 'comparisons') {
      title = 'Google Product Comparisons (Head-to-Head Architecture) | Google Tool Finder';
      description = 'Side-by-side architecture, feature limits, and price comparisons across Google ecosystem products.';
      canonicalPath = '/comparisons';
    } else if (currentView === 'comparison-detail' && currentSlug) {
      const comp = COMPARISONS.find(c => c.slug === currentSlug);
      if (comp) {
        title = `${comp.title} | Google Tool Finder`;
        description = comp.subtitle || comp.title;
        canonicalPath = `/comparisons/${comp.slug}`;
      }
    } else if (currentView === 'latest-updates') {
      title = 'Latest Google Ecosystem Updates & Feature Releases | Google Tool Finder';
      description = 'Monthly editorial audits of newly released Google AI capabilities, pricing modifications, and policy changes.';
      canonicalPath = '/latest-updates';
    } else if (currentView === 'about') {
      title = 'About Google Tool Finder & Editorial Mission | Bring My Bite';
      description = 'Independent, community-first technology directory built by Bring My Bite to bring transparency to Google tool discovery.';
      canonicalPath = '/about';
    } else if (currentView === 'contact') {
      title = 'Contact Editorial Team & Inquiries | Google Tool Finder';
      description = 'Submit Google tool additions, report price corrections, flag suspicious links, or inquire about partnerships.';
      canonicalPath = '/contact';
    } else if (currentView === 'affiliate-disclosure') {
      title = 'Affiliate Disclosure & Transparency Statement | Google Tool Finder';
      description = 'Read our transparent affiliate disclosure and editorial independence guarantee.';
      canonicalPath = '/affiliate-disclosure';
    } else if (currentView === 'privacy') {
      title = 'Privacy Policy | Google Tool Finder';
      canonicalPath = '/privacy';
    } else if (currentView === 'terms') {
      title = 'Terms of Service | Google Tool Finder';
      canonicalPath = '/terms';
    } else if (currentView === 'admin') {
      title = 'Admin Console | Google Tool Finder';
      canonicalPath = '/admin';
    } else if (currentView === 'not-found') {
      title = 'Page Not Found (404) | Google Tool Finder';
    }

    document.title = title;
    
    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update Canonical
    const fullCanonical = `https://google-tool-finder.web.app${canonicalPath}`;
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', fullCanonical);

    // Update Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', fullCanonical);
  }, [currentView, currentSlug]);

  // Global cursor-tracking for liquid water-light glass refraction
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('.water-glass-surface') as HTMLElement | null;
      if (target) {
        const rect = target.getBoundingClientRect();
        target.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        target.style.setProperty('--my', `${e.clientY - rect.top}px`);
      }
    };
    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  const navigate = (view: string, slug?: string) => {
    let targetPath = `/${view}`;
    if (view === 'product-detail' && slug) {
      targetPath = `/products/${slug}`;
      setCurrentView('product-detail');
      setCurrentSlug(slug);
    } else if (view === 'products' && slug) {
      targetPath = `/products/${slug}`;
      setCurrentView('products');
      setCurrentSlug(slug);
    } else if (view === 'tutorial-detail' && slug) {
      targetPath = `/tutorials/${slug}`;
      setCurrentView('tutorial-detail');
      setCurrentSlug(slug);
    } else if (view === 'comparison-detail' && slug) {
      targetPath = `/comparisons/${slug}`;
      setCurrentView('comparison-detail');
      setCurrentSlug(slug);
    } else {
      setCurrentView(view as AppView);
      setCurrentSlug(slug || '');
    }

    if (window.location.hash) {
      window.history.pushState(null, '', `#${targetPath}`);
    } else {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
        
        {/* Accessible Skip to Content Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white text-xs font-bold"
        >
          Skip to main content
        </a>

        {/* Main Navigation Bar with unified compact announcement bar */}
        <Navbar
          currentView={currentView}
          onNavigate={navigate}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* Main Page View Area with Suspense boundary for code-split chunks */}
        <main id="main-content" className="flex-1" tabIndex={-1}>
          <Suspense fallback={<PageLoadingFallback />}>
            {currentView === 'home' && (
              <HomePage
                onNavigate={navigate}
                onOpenSearch={() => setIsSearchOpen(true)}
              />
            )}

            {currentView === 'products' && (
              <ProductsPage
                initialCategory={currentSlug || undefined}
                onSelectProduct={(slug) => navigate('product-detail', slug)}
              />
            )}

            {currentView === 'product-detail' && (
              <ProductDetailPage
                productSlug={currentSlug}
                onBack={() => navigate('products')}
                onNavigateProduct={(slug) => navigate('product-detail', slug)}
                onNavigateTutorial={(slug) => navigate('tutorial-detail', slug)}
              />
            )}

            {currentView === 'ai-tools' && (
              <AIToolsPage
                onSelectProduct={(slug) => navigate('product-detail', slug)}
                onNavigateTutorial={(slug) => navigate('tutorial-detail', slug)}
              />
            )}

            {currentView === 'free-tools' && (
              <FreeToolsPage
                onSelectProduct={(slug) => navigate('product-detail', slug)}
              />
            )}

            {currentView === 'pricing' && (
              <PricingPlansPage />
            )}

            {currentView === 'india-offers' && (
              <IndiaOffersPage
                onNavigateTutorial={(slug) => navigate('tutorial-detail', slug)}
              />
            )}

            {currentView === 'tutorials' && (
              <TutorialsPage
                onSelectTutorial={(slug) => navigate('tutorial-detail', slug)}
              />
            )}

            {currentView === 'tutorial-detail' && (
              <TutorialDetailPage
                tutorialSlug={currentSlug}
                onBack={() => navigate('tutorials')}
                onNavigateTutorial={(slug) => navigate('tutorial-detail', slug)}
                onNavigateProduct={(slug) => navigate('product-detail', slug)}
              />
            )}

            {currentView === 'comparisons' && (
              <ComparisonsPage
                onSelectComparison={(slug) => navigate('comparison-detail', slug)}
              />
            )}

            {currentView === 'comparison-detail' && (
              <ComparisonDetailPage
                comparisonSlug={currentSlug}
                onBack={() => navigate('comparisons')}
                onNavigateComparison={(slug) => navigate('comparison-detail', slug)}
              />
            )}

            {currentView === 'latest-updates' && (
              <LatestUpdatesPage />
            )}

            {currentView === 'about' && (
              <AboutPage />
            )}

            {currentView === 'contact' && (
              <ContactPage />
            )}

            {currentView === 'affiliate-disclosure' && (
              <AffiliateDisclosurePage />
            )}

            {currentView === 'privacy' && (
              <LegalPage type="privacy" onNavigateHome={() => navigate('home')} />
            )}

            {currentView === 'terms' && (
              <LegalPage type="terms" onNavigateHome={() => navigate('home')} />
            )}

            {currentView === 'admin' && (
              <AdminMonetizationPage onNavigateHome={() => navigate('home')} />
            )}

            {currentView === 'not-found' && (
              <NotFoundPage
                onNavigateHome={() => navigate('home')}
                onOpenSearch={() => setIsSearchOpen(true)}
              />
            )}
          </Suspense>
        </main>

      {/* Global Interactive Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigate}
      />

      {/* Floating Living Robot Assistant for Global Discovery */}
      <ToolFinderChatbot
        isFloatingWidget={true}
        onNavigateProduct={(slug) => navigate('product-detail', slug)}
        onNavigateTutorial={(slug) => navigate('tutorial-detail', slug)}
        onNavigateOffer={() => navigate('india-offers')}
      />

      {/* Site Footer */}
      <Footer onNavigate={navigate} />

      {/* Google Authentication Dialog for Gated Member Stack Actions */}
      <GoogleSignInModal />
    </div>
  </AuthProvider>
);
}
