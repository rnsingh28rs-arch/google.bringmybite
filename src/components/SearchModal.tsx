import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, BookOpen, Scale, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { TUTORIALS } from '../data/tutorials';
import { COMPARISONS } from '../data/comparisons';
import { INDIA_OFFERS } from '../data/indiaOffers';
import { IconHelper } from './IconHelper';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, slug?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const filteredProducts = PRODUCTS.filter(p => 
    !cleanQuery || 
    p.name.toLowerCase().includes(cleanQuery) ||
    p.category.toLowerCase().includes(cleanQuery) ||
    p.summary.toLowerCase().includes(cleanQuery) ||
    p.keyFeatures.some(f => f.toLowerCase().includes(cleanQuery))
  ).slice(0, 5);

  const filteredTutorials = TUTORIALS.filter(t =>
    !cleanQuery ||
    t.title.toLowerCase().includes(cleanQuery) ||
    t.summary.toLowerCase().includes(cleanQuery) ||
    t.category.toLowerCase().includes(cleanQuery)
  ).slice(0, 3);

  const filteredComparisons = COMPARISONS.filter(c =>
    !cleanQuery ||
    c.title.toLowerCase().includes(cleanQuery) ||
    c.subtitle.toLowerCase().includes(cleanQuery)
  ).slice(0, 2);

  const filteredOffers = INDIA_OFFERS.filter(o =>
    !cleanQuery ||
    o.title.toLowerCase().includes(cleanQuery) ||
    o.benefit.toLowerCase().includes(cleanQuery) ||
    o.productName.toLowerCase().includes(cleanQuery)
  ).slice(0, 2);

  const totalResults = filteredProducts.length + filteredTutorials.length + filteredComparisons.length + filteredOffers.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, tutorials, pricing, India offers... (e.g. Gemini, Drive 15GB, Workspace, GCP trial)"
            className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-6 divide-y divide-slate-100">
          {totalResults === 0 ? (
            <div className="text-center py-12">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No results found for "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for "Gemini", "Free", "Drive", "Cloud Credits", or "Workspace".</p>
            </div>
          ) : (
            <>
              {/* Products Group */}
              {filteredProducts.length > 0 && (
                <div className="space-y-2 pt-2 first:pt-0">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                    <span>Google Products ({filteredProducts.length})</span>
                    <button 
                      onClick={() => { onClose(); onNavigate('products'); }}
                      className="text-blue-600 hover:underline capitalize"
                    >
                      View all in directory &rarr;
                    </button>
                  </div>
                  <div className="space-y-1">
                    {filteredProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onClose();
                          onNavigate('product-detail', p.slug);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl glass-icon-blue text-blue-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
                            <IconHelper name={p.iconName} className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">{p.name}</span>
                              <span className="text-[10px] text-slate-500">({p.category})</span>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{p.tagline}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* India Offers Group */}
              {filteredOffers.length > 0 && (
                <div className="space-y-2 pt-4">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified India Offers ({filteredOffers.length})</span>
                  </div>
                  <div className="space-y-1">
                    {filteredOffers.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => {
                          onClose();
                          onNavigate('india-offers');
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/50 text-left transition-colors group border border-transparent hover:border-emerald-200"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">{o.title}</span>
                            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] rounded font-semibold">
                              Verified
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{o.benefit}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tutorials Group */}
              {filteredTutorials.length > 0 && (
                <div className="space-y-2 pt-4">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tutorials & Step-by-Step Guides ({filteredTutorials.length})</span>
                  </div>
                  <div className="space-y-1">
                    {filteredTutorials.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          onClose();
                          onNavigate('tutorial-detail', t.slug);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">{t.title}</span>
                            <span className="text-[10px] text-slate-400 font-medium">({t.readingTimeMinutes} min)</span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{t.subtitle}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Comparisons Group */}
              {filteredComparisons.length > 0 && (
                <div className="space-y-2 pt-4">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-purple-600" />
                    <span>Product Comparisons ({filteredComparisons.length})</span>
                  </div>
                  <div className="space-y-1">
                    {filteredComparisons.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onClose();
                          onNavigate('comparison-detail', c.slug);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors group"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">{c.title}</span>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{c.subtitle}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Independent verified database
          </span>
          <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">ESC</kbd> to exit</span>
        </div>
      </div>
    </div>
  );
};
