import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  SlidersHorizontal, 
  Sparkles, 
  Check, 
  ChevronRight,
  Layers
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ProductCategory, PricingStatus, Audience, Platform } from '../types';

interface ProductsPageProps {
  onSelectProduct: (slug: string) => void;
  initialCategory?: string;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ 
  onSelectProduct,
  initialCategory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'name' | 'category'>('popular');

  const audiences: Audience[] = [
    'General Public',
    'Students',
    'Professionals',
    'Developers',
    'Small Businesses',
    'Enterprises',
    'Creators',
    'Educators'
  ];

  const platforms: Platform[] = [
    'Web',
    'Android',
    'iOS',
    'ChromeOS',
    'Windows',
    'macOS',
    'API'
  ];

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSummary = product.summary.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesFeatures = product.keyFeatures.some(f => f.toLowerCase().includes(query));
        if (!matchesName && !matchesSummary && !matchesCategory && !matchesFeatures) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Pricing Status
      if (selectedPricing !== 'all') {
        if (selectedPricing === 'free_only' && product.pricingStatus !== 'free') return false;
        if (selectedPricing === 'free_tier_all' && (product.pricingStatus !== 'free' && product.pricingStatus !== 'free_tier')) return false;
        if (selectedPricing === 'paid' && product.pricingStatus !== 'paid' && product.pricingStatus !== 'trial') return false;
      }

      // Audience
      if (selectedAudience !== 'all' && !product.intendedAudience.includes(selectedAudience as Audience)) {
        return false;
      }

      // Platform
      if (selectedPlatform !== 'all' && !product.platforms.includes(selectedPlatform as Platform)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      // Popular first, then AI
      const aScore = (a.isPopular ? 10 : 0) + (a.isFeaturedAI ? 5 : 0);
      const bScore = (b.isPopular ? 10 : 0) + (b.isFeaturedAI ? 5 : 0);
      return bScore - aScore;
    });
  }, [searchTerm, selectedCategory, selectedPricing, selectedAudience, selectedPlatform, sortBy]);

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedPricing('all');
    setSelectedAudience('all');
    setSelectedPlatform('all');
    setSortBy('popular');
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || selectedPricing !== 'all' || selectedAudience !== 'all' || selectedPlatform !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Product Catalog & Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore Google Products
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          Filter and discover verified tools across AI, office productivity, developer APIs, cloud computing, and enterprise business suites.
        </p>
      </div>

      {/* Main Search & Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name, features, or keywords (e.g. Gemini, Sheets, Cloud Run, BigQuery)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-2 sm:w-56">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="popular">Recommended / Popular</option>
              <option value="name">Alphabetical (A - Z)</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
          {/* Category Dropdown */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Categories ({PRODUCTS.length})</option>
              {CATEGORIES.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Pricing Status */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Pricing Model
            </label>
            <select
              value={selectedPricing}
              onChange={(e) => setSelectedPricing(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Pricing Models</option>
              <option value="free_only">100% Free Forever</option>
              <option value="free_tier_all">Free or Free Tier Available</option>
              <option value="paid">Paid / Business Plans</option>
            </select>
          </div>

          {/* Intended Audience */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Target Audience
            </label>
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Any Audience</option>
              {audiences.map(aud => (
                <option key={aud} value={aud}>{aud}</option>
              ))}
            </select>
          </div>

          {/* Platform */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Supported Platform
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Platforms</option>
              {platforms.map(plat => (
                <option key={plat} value={plat}>{plat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Badges & Reset */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium">Active Filters:</span>
            {selectedCategory !== 'all' && (
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold flex items-center gap-1">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('all')}>&times;</button>
              </span>
            )}
            {selectedPricing !== 'all' && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
                {selectedPricing.replace('_', ' ')}
                <button onClick={() => setSelectedPricing('all')}>&times;</button>
              </span>
            )}
            {selectedAudience !== 'all' && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold flex items-center gap-1">
                {selectedAudience}
                <button onClick={() => setSelectedAudience('all')}>&times;</button>
              </span>
            )}
            {selectedPlatform !== 'all' && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold flex items-center gap-1">
                {selectedPlatform}
                <button onClick={() => setSelectedPlatform('all')}>&times;</button>
              </span>
            )}
            <button
              onClick={resetAllFilters}
              className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <strong>{filteredProducts.length}</strong> of {PRODUCTS.length} verified tools</span>
        <span>Click any tool to view comprehensive features & tutorials</span>
      </div>

      {/* Products Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No matching Google products found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn't find any tools matching your specific search query or active filter combination.
            </p>
          </div>
          <button
            onClick={resetAllFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All Filters & Reset
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
