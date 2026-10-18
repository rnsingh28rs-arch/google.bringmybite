import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  Compass, 
  Sparkles, 
  Gift, 
  Layers, 
  Tag, 
  BookOpen, 
  Scale, 
  Bell, 
  Info, 
  Mail, 
  ChevronDown,
  ShieldCheck,
  ExternalLink,
  Briefcase,
  Bookmark,
  LogOut
} from 'lucide-react';
import { WaterLightGlass } from './WaterLightGlass';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, slug?: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenSearch }) => {
  const { user, openSignInModal, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [activeSpySection, setActiveSpySection] = useState<string>('home');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reliable scroll spy using getBoundingClientRect()
  useEffect(() => {
    if (currentView !== 'home') {
      setActiveSpySection(currentView);
      return;
    }

    const handleScroll = () => {
      // If near the top, mark as home
      if (window.scrollY < 140) {
        setActiveSpySection('home');
        return;
      }

      // Sections in visual reading order from top to bottom
      const sections = [
        { id: 'hero-section', navId: 'home' },
        { id: 'popular-section', navId: 'products' },
        { id: 'ai-tools-section', navId: 'ai-tools' },
        { id: 'india-offers-section', navId: 'india-offers' },
        { id: 'tutorials-section', navId: 'tutorials' },
        { id: 'our-software-section', navId: 'pricing' },
      ];

      let matchedNav = 'home';
      // Find the last section whose top is at or above viewport threshold
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Threshold of 200px from top of viewport
          if (rect.top <= 200) {
            matchedNav = section.navId;
          }
        }
      }

      setActiveSpySection(matchedNav);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (viewId: string, sectionId?: string, forceNavigateToPage = false) => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);

    // If already on Home and a section anchor is specified and user isn't forcing full page view
    if (currentView === 'home' && sectionId && !forceNavigateToPage) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setActiveSpySection(viewId);
        return;
      }
    }

    onNavigate(viewId);
  };

  const isMoreActive = ['tutorials', 'tutorial-detail', 'comparisons', 'comparison-detail', 'latest-updates', 'about', 'contact', 'affiliate-disclosure'].includes(currentView);

  const getActiveTab = () => {
    if (currentView === 'home') {
      return activeSpySection;
    }
    return currentView;
  };

  const activeTab = getActiveTab();

  return (
    <>
      {/* Google 4-Color Ambient Top Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]"></div>

      {/* Top Compact Editorial Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-[11px] font-medium border-b border-slate-800 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse"></span>
            <span className="text-slate-200 truncate">
              <strong className="font-semibold text-white">Google Tool Finder:</strong> Independent Technology Discovery & Monetisation Guide by parent company Bring My Bite. Not affiliated with Google LLC.
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 flex-shrink-0 text-[11px]">
            <span className="hidden sm:inline">Audited: Oct 2026</span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <button 
              onClick={() => handleNavClick('admin')}
              className="text-slate-300 hover:text-white transition-colors underline-offset-2 hover:underline cursor-pointer"
            >
              Admin & AdSense
            </button>
            <span className="text-slate-700">•</span>
            <button 
              onClick={() => handleNavClick('india-offers', 'india-offers-section')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1.5 group cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform"></span>
              <span>India Offers: Jio & Airtel Perks (₹)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header with Liquid Glass Backdrop */}
      <header className="sticky top-0 z-40 liquid-glass-nav transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3 lg:gap-4">
            
            {/* 1. Brand Identity with Water Light Glass Ripple Effect */}
            <WaterLightGlass
              onClick={() => handleNavClick('home', 'hero-section')}
              className="rounded-2xl px-2.5 py-1.5 -ml-1 cursor-pointer group select-none flex-shrink-0 transition-transform duration-200 hover:scale-[1.02]"
              title="Google Tool Finder • by Bring My Bite"
              intensity="medium"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl liquid-logo-vessel shadow-md transition-all duration-300 group-hover:scale-110 flex items-center justify-center flex-shrink-0">
                  <Compass className="w-5 h-5 text-blue-600 transition-transform duration-300 group-hover:rotate-45" />
                </div>
                <div className="flex flex-col whitespace-nowrap">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 leading-tight flex items-center gap-1.5">
                    <span className="bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] bg-clip-text text-transparent font-black">
                      Google
                    </span>
                    <span className="text-slate-900 font-extrabold">Tool Finder</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium tracking-wide flex items-center gap-1">
                    <span>by</span>
                    <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">Bring My Bite</span>
                  </span>
                </div>
              </div>
            </WaterLightGlass>

            {/* 2. Desktop Navigation Links with Scroll-Spy & Animated Sliding Highlight */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-semibold text-slate-600 whitespace-nowrap">
              
              {/* Home */}
              <button
                onClick={() => handleNavClick('home', 'hero-section')}
                className={`relative px-3.5 py-2 rounded-xl whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  activeTab === 'home'
                    ? 'text-blue-700 font-bold nav-active-pill'
                    : 'hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                Home
              </button>

              {/* Directory */}
              <button
                onClick={() => {
                  // If on home, smooth scroll to popular-section; if already at popular-section, open full directory page
                  if (currentView === 'home' && activeTab === 'products') {
                    onNavigate('products');
                  } else {
                    handleNavClick('products', 'popular-section');
                  }
                }}
                className={`relative px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                  activeTab === 'products'
                    ? 'text-blue-700 font-bold nav-active-pill'
                    : 'hover:text-slate-900 hover:bg-slate-100/80'
                }`}
                title="Scroll to Directory on Home, or click to open full Catalog"
              >
                <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-transform ${
                  activeTab === 'products' ? 'glass-icon-blue text-blue-600 scale-110' : 'text-slate-400'
                }`}>
                  <Layers className="w-3 h-3" />
                </div>
                <span>Directory</span>
              </button>

              {/* AI Tools */}
              <button
                onClick={() => {
                  if (currentView === 'home' && activeTab === 'ai-tools') {
                    onNavigate('ai-tools');
                  } else {
                    handleNavClick('ai-tools', 'ai-tools-section');
                  }
                }}
                className={`relative px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                  activeTab === 'ai-tools'
                    ? 'text-violet-700 font-bold bg-violet-50/95 border border-violet-200/90 shadow-sm'
                    : 'hover:text-violet-700 hover:bg-violet-50/60'
                }`}
              >
                <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-transform ${
                  activeTab === 'ai-tools' ? 'glass-icon-violet text-violet-600 scale-110' : 'text-violet-500'
                }`}>
                  <Sparkles className="w-3 h-3" />
                </div>
                <span>AI Tools</span>
              </button>

              {/* Free Tools (Dedicated page route) */}
              <button
                onClick={() => onNavigate('free-tools')}
                className={`relative px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                  currentView === 'free-tools'
                    ? 'text-emerald-700 font-bold bg-emerald-50/95 border border-emerald-200/90 shadow-sm'
                    : 'hover:text-emerald-700 hover:bg-emerald-50/60'
                }`}
              >
                <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-transform ${
                  currentView === 'free-tools' ? 'glass-icon-emerald text-emerald-600 scale-110' : 'text-emerald-500'
                }`}>
                  <Gift className="w-3 h-3" />
                </div>
                <span>Free Tools</span>
              </button>

              {/* Pricing & Plans */}
              <button
                onClick={() => {
                  if (currentView === 'home' && activeTab === 'pricing') {
                    onNavigate('pricing');
                  } else {
                    handleNavClick('pricing', 'our-software-section');
                  }
                }}
                className={`relative px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                  activeTab === 'pricing'
                    ? 'text-blue-700 font-bold nav-active-pill'
                    : 'hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className={`w-4 h-4 rounded-md flex items-center justify-center transition-transform ${
                  activeTab === 'pricing' ? 'glass-icon-blue text-blue-600 scale-110' : 'text-slate-400'
                }`}>
                  <Briefcase className="w-3 h-3" />
                </div>
                <span>Pricing & Plans</span>
              </button>

              {/* India Offers & Jio */}
              <button
                onClick={() => {
                  if (currentView === 'home' && activeTab === 'india-offers') {
                    onNavigate('india-offers');
                  } else {
                    handleNavClick('india-offers', 'india-offers-section');
                  }
                }}
                className={`relative px-3.5 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                  activeTab === 'india-offers'
                    ? 'text-emerald-800 font-bold bg-emerald-50/95 border border-emerald-300 shadow-sm'
                    : 'hover:text-emerald-800 hover:bg-emerald-50/60'
                }`}
              >
                <div className="w-4 h-4 rounded-full glass-icon-emerald flex items-center justify-center text-[10px] font-bold text-emerald-700">
                  ₹
                </div>
                <span>India Offers</span>
              </button>

              {/* Extra Wide Screens: Direct Access to Guides & Comparisons */}
              <button
                onClick={() => handleNavClick('tutorials', 'tutorials-section')}
                className={`hidden 2xl:inline-flex px-3.5 py-2 rounded-xl whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  activeTab === 'tutorials' || currentView === 'tutorial-detail'
                    ? 'text-blue-700 font-bold nav-active-pill'
                    : 'hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                Guides
              </button>

              <button
                onClick={() => onNavigate('comparisons')}
                className={`hidden 2xl:inline-flex px-3.5 py-2 rounded-xl whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  currentView === 'comparisons' || currentView === 'comparison-detail'
                    ? 'text-blue-700 font-bold nav-active-pill'
                    : 'hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                Comparisons
              </button>

              {/* Functional "More" Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    isMoreActive 
                      ? 'text-blue-700 nav-active-pill font-bold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                  aria-expanded={moreDropdownOpen}
                >
                  <span>More</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 glass-card rounded-2xl shadow-2xl py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 border border-white/90">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Resources & Tools
                    </div>

                    <button
                      onClick={() => handleNavClick('tutorials', 'tutorials-section')}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                        activeTab === 'tutorials'
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl glass-icon-blue flex items-center justify-center text-blue-600 flex-shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold">Tutorials & Guides</div>
                        <div className="text-[10px] text-slate-400">7 practical masterclasses</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setMoreDropdownOpen(false);
                        onNavigate('comparisons');
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                        currentView === 'comparisons' || currentView === 'comparison-detail'
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl glass-icon-violet flex items-center justify-center text-violet-600 flex-shrink-0">
                        <Scale className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold">Product Comparisons</div>
                        <div className="text-[10px] text-slate-400">Side-by-side matrices</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleNavClick('latest-updates')}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                        currentView === 'latest-updates'
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl glass-icon-amber flex items-center justify-center text-amber-600 flex-shrink-0">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold">Latest Updates</div>
                        <div className="text-[10px] text-slate-400">Changelog & releases</div>
                      </div>
                    </button>

                    <div className="my-1.5 border-t border-slate-100"></div>

                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      About & Editorial
                    </div>

                    <button
                      onClick={() => handleNavClick('about')}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                        currentView === 'about'
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl glass-icon-base flex items-center justify-center text-slate-600 flex-shrink-0">
                        <Info className="w-4 h-4" />
                      </div>
                      <span>About Us & Mission</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('contact')}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                        currentView === 'contact'
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl glass-icon-base flex items-center justify-center text-slate-600 flex-shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span>Contact Editorial</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('affiliate-disclosure')}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                        currentView === 'affiliate-disclosure'
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl glass-icon-emerald flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span>Affiliate Disclosure</span>
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* 3. Search Action, Google Auth & Mobile Hamburger */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-2.5 px-3.5 py-2 bg-slate-100/90 hover:bg-white text-slate-600 rounded-xl text-xs font-medium border border-slate-200/80 hover:border-blue-400 transition-all shadow-2xs hover:shadow-sm group cursor-pointer"
                title="Search directory (Ctrl+K or ⌘K)"
              >
                <div className="w-5 h-5 rounded-lg glass-icon-blue flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Search className="w-3 h-3 transition-transform group-hover:scale-110" />
                </div>
                <span className="hidden sm:inline whitespace-nowrap">Search tools...</span>
                <span className="sm:hidden text-xs">Search</span>
                <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
                  ⌘K
                </kbd>
              </button>

              {/* Google Sign-in / Member Stack Button */}
              {user ? (
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50/90 border border-blue-200 rounded-xl text-xs shadow-2xs">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                    {user.displayName ? user.displayName[0].toUpperCase() : 'G'}
                  </div>
                  <span className="font-semibold text-slate-800 max-w-[85px] truncate" title={user.email}>
                    {user.displayName?.split(' ')[0] || 'User'}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center gap-0.5" title={`${user.savedTools?.length || 0} tools in your saved stack`}>
                    <Bookmark className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
                    <span>{user.savedTools?.length || 0}</span>
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="ml-0.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer p-0.5"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openSignInModal('Sign in with Google to save tools to your private stack.')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 shadow-2xs hover:border-blue-400 transition-all cursor-pointer group"
                  title="Sign in with Google"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.15z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.93H1.21v3.13C3.25 21.43 7.31 24 12 24z" />
                    <path fill="#FBBC05" d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.6H1.21C.44 8.13 0 9.87 0 12s.44 3.87 1.21 5.4l4.11-3.13z" />
                    <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.57 1.21 6.6l4.11 3.13c.94-2.83 3.58-4.96 6.68-4.96z" />
                  </svg>
                  <span>Sign in</span>
                </button>
              )}

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl space-y-3 max-h-[85vh] overflow-y-auto">
            
            {/* Quick search button for mobile */}
            <button
              onClick={() => { onOpenSearch(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg glass-icon-blue flex items-center justify-center text-blue-600">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <span>Search Google tools & offers...</span>
              </span>
              <kbd className="text-[10px] font-mono bg-white px-1.5 py-0.5 border border-slate-200 rounded">⌘K</kbd>
            </button>

            {/* Mobile Auth Identity Pill */}
            {user ? (
              <div className="flex items-center justify-between p-2.5 bg-blue-50/90 border border-blue-200 rounded-xl text-xs">
                <div className="flex items-center gap-2 truncate">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {user.displayName ? user.displayName[0].toUpperCase() : 'G'}
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-slate-900 leading-tight truncate">{user.displayName || 'Member'}</div>
                    <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center gap-1">
                    <Bookmark className="w-3 h-3 fill-amber-600 text-amber-600" />
                    <span>{user.savedTools?.length || 0}</span>
                  </span>
                  <button
                    onClick={() => { signOut(); setMobileMenuOpen(false); }}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { openSignInModal('Sign in with Google to save tools to your private stack.'); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 p-2.5 bg-white border border-slate-200 hover:border-blue-400 rounded-xl text-xs font-bold text-slate-700 shadow-2xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.15z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.93H1.21v3.13C3.25 21.43 7.31 24 12 24z" />
                  <path fill="#FBBC05" d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.6H1.21C.44 8.13 0 9.87 0 12s.44 3.87 1.21 5.4l4.11-3.13z" />
                  <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.57 1.21 6.6l4.11 3.13c.94-2.83 3.58-4.96 6.68-4.96z" />
                </svg>
                <span>Sign in with Google</span>
              </button>
            )}

            {/* Core Destinations */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1">
                Primary Sections
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'home', label: 'Home', sectionId: 'hero-section', icon: 'Compass', color: 'blue' },
                  { id: 'products', label: 'Directory', sectionId: 'popular-section', icon: 'Layers', color: 'blue' },
                  { id: 'ai-tools', label: 'AI Tools', sectionId: 'ai-tools-section', badge: 'AI', icon: 'Sparkles', color: 'violet' },
                  { id: 'free-tools', label: 'Free Tools', icon: 'Gift', color: 'emerald' },
                  { id: 'pricing', label: 'Pricing & Plans', sectionId: 'our-software-section', icon: 'Briefcase', color: 'blue' },
                  { id: 'india-offers', label: 'India Offers', sectionId: 'india-offers-section', badge: '₹', icon: 'Tag', color: 'emerald' },
                ].map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id, link.sectionId)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      activeTab === link.id
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                        : 'text-slate-700 hover:bg-slate-50 bg-white border border-slate-100'
                    }`}
                  >
                    <span className="truncate">{link.label}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 text-slate-700 font-bold ml-1">
                        {link.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Knowledge & Guides */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                Guides & Resources
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'tutorials', label: 'Tutorials (7)', sectionId: 'tutorials-section' },
                  { id: 'comparisons', label: 'Comparisons' },
                  { id: 'latest-updates', label: 'Latest Updates' },
                  { id: 'about', label: 'About Us' },
                  { id: 'contact', label: 'Contact' },
                  { id: 'affiliate-disclosure', label: 'Affiliate Policy' },
                ].map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id, link.sectionId)}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      activeTab === link.id
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Disclaimer pill */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-snug">
              <strong className="text-slate-700">Notice:</strong> Independent directory. Not affiliated with Google LLC.
            </div>

          </div>
        )}
      </header>
    </>
  );
};
