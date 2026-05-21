import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import type { Category, Product } from '../../types';
import ProductCard from '../../components/ui/ProductCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { SlidersHorizontal, X, ChevronDown, Grid3x3 as Grid3X3, List } from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../../lib/mockData';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Best Discount' },
];

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(5000);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [inStockOnly, setInStockOnly] = useState(false);

  const activeCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const catSnap = await getDocs(query(collection(db, 'categories'), orderBy('name')));
        const data = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          setCategories(MOCK_CATEGORIES);
        }
      } catch (err) {
        setCategories(MOCK_CATEGORIES);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let q = query(collection(db, 'products'));

        if (activeCategory) {
          const cat = categories.find((c) => c.slug === activeCategory);
          if (cat) q = query(q, where('category_id', '==', cat.id));
        }

        const prodSnap = await getDocs(q);
        const data = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

        let filtered = (data && data.length > 0 ? data : MOCK_PRODUCTS) as Product[];

        if (searchQuery) {
          const qStr = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (p) => p.name.toLowerCase().includes(qStr) || p.description.toLowerCase().includes(qStr)
          );
        }

        filtered = filtered.filter((p) => p.price >= priceMin && p.price <= priceMax);
        if (inStockOnly) filtered = filtered.filter((p) => p.stock > 0);

        switch (sortBy) {
          case 'price_asc': filtered.sort((a, b) => a.price - b.price); break;
          case 'price_desc': filtered.sort((a, b) => b.price - a.price); break;
          case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
          case 'discount': filtered.sort((a, b) => {
            const dA = a.compare_price ? (a.compare_price - a.price) / a.compare_price : 0;
            const dB = b.compare_price ? (b.compare_price - b.price) / b.compare_price : 0;
            return dB - dA;
          }); break;
          default: filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }

        setProducts(filtered);
      } catch (err) {
        console.error('Fetch products error:', err);
        setProducts(MOCK_PRODUCTS as Product[]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory, searchQuery, categories, sortBy, priceMin, priceMax, inStockOnly]);

  const activeCatName = useMemo(() => {
    if (!activeCategory) return '';
    return categories.find((c) => c.slug === activeCategory)?.name || '';
  }, [activeCategory, categories]);

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) params.set('category', slug);
    else params.delete('category');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPriceMin(0);
    setPriceMax(5000);
    setInStockOnly(false);
    setSortBy('newest');
  };

  const activeFilters = [
    activeCategory && { label: activeCatName, clear: () => setCategory('') },
    searchQuery && { label: `"${searchQuery}"`, clear: () => { const p = new URLSearchParams(searchParams); p.delete('search'); setSearchParams(p); } },
    inStockOnly && { label: 'In Stock Only', clear: () => setInStockOnly(false) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <a href="/" className="hover:text-amber-600 transition">Home</a>
        <span>/</span>
        <span className="text-gray-800 font-medium">{activeCatName || searchQuery ? (activeCatName || `Search: "${searchQuery}"`) : 'All Products'}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {activeCatName || searchQuery ? (activeCatName || `Results for "${searchQuery}"`) : 'All Products'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} products found</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition ${viewMode === 'grid' ? 'bg-amber-50 text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition ${viewMode === 'list' ? 'bg-amber-50 text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs text-gray-500 font-medium">Active Filters:</span>
          {activeFilters.map((f, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
              {f.label}
              <button onClick={f.clear} className="hover:text-amber-900 transition"><X className="w-3 h-3" /></button>
            </span>
          ))}
          <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 font-medium ml-1">Clear All</button>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-black/50' : 'hidden'} lg:relative lg:block lg:bg-transparent`}>
          <div className={`${showFilters ? 'absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto shadow-xl' : ''} lg:static lg:w-56 lg:p-0 lg:shadow-none shrink-0`}>
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-semibold text-sm text-gray-800 mb-3 uppercase tracking-wider">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setCategory('')}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    !activeCategory ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.slug)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      activeCategory === cat.slug ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="mb-6">
              <h3 className="font-semibold text-sm text-gray-800 mb-3 uppercase tracking-wider">Price Range</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceMin || ''}
                  onChange={(e) => setPriceMin(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  placeholder="Min"
                />
                <span className="text-gray-300">-</span>
                <input
                  type="number"
                  value={priceMax || ''}
                  onChange={(e) => setPriceMax(Number(e.target.value) || 5000)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Stock filter */}
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>

            {showFilters && (
              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-2.5 bg-amber-500 text-white font-medium rounded-lg"
              >
                Apply Filters
              </button>
            )}
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <LoadingSpinner />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-2">No products found</p>
              <p className="text-gray-400 text-sm mb-4">Try adjusting your filters or search terms</p>
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                : 'space-y-4'
            }>
              {products.map((p, idx) => (
                <ProductCard key={p.id} product={p} priority={idx < 6} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
