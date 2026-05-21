import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import type { Category, Product } from '../../types';
import ProductCard from '../../components/ui/ProductCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  ArrowRight, Truck, Shield, Clock, Headphones as HeadphonesIcon,
  Paintbrush, Building2, Zap, Droplets, Wrench, HardHat,
  ChevronLeft, ChevronRight, Star, TrendingUp, BadgePercent, Quote
} from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../../lib/mockData';

const categoryIcons: Record<string, typeof Paintbrush> = {
  paints: Paintbrush,
  cement: Building2,
  'iron-materials': HardHat,
  'electrical-items': Zap,
  'plumbing-products': Droplets,
  'hardware-tools': Wrench,
};

const heroSlides = [
  {
    badge: 'Mega Sale Event',
    title: 'Build Your Dreams With Premium Tools',
    subtitle: 'Up to 40% off on power tools, cement, and construction essentials. Free delivery above ₹999!',
    cta: 'Shop Now',
    link: '/products',
  },
  {
    badge: 'New Arrivals',
    title: 'Professional Power Tools Collection',
    subtitle: 'DeWalt, Bosch, Makita - Industry-leading brands at best prices',
    cta: 'Explore Tools',
    link: '/products?category=hardware-tools',
  },
  {
    badge: 'Paint Festival',
    title: 'Transform Your Space With Premium Paints',
    subtitle: 'Asian Paints, Berger, Dulux - Free delivery on paint orders over ₹999',
    cta: 'Shop Paints',
    link: '/products?category=paints',
  },
];

function HeroSlideBackground({ idx }: { idx: number }) {
  if (idx === 0) {
    // Mega Sale Event - Construction Gradient with abstract grid/gears SVG overlay
    return (
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-600 via-slate-800 to-slate-900">
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Abstract circles */}
          <circle cx="85%" cy="30%" r="200" fill="none" stroke="#fff" strokeWidth="4" />
          <circle cx="85%" cy="30%" r="120" fill="none" stroke="#fff" strokeWidth="2" />
        </svg>
      </div>
    );
  }
  if (idx === 1) {
    // Power Tools Collection - Steel Blue & Indigo Gradient with circular saw teeth / bolts overlay
    return (
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 via-indigo-900 to-slate-950">
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" stroke="#fff" strokeWidth="2" transform="translate(450, 200)">
            <circle cx="0" cy="0" r="180" />
            <circle cx="0" cy="0" r="100" />
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 360) / 12;
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1="0"
                  y1="0"
                  x2={Math.cos(rad) * 220}
                  y2={Math.sin(rad) * 220}
                />
              );
            })}
          </g>
        </svg>
      </div>
    );
  }
  // Paint Festival - Fuchsia/Purple splash gradient
  return (
    <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-600 via-purple-800 to-slate-950">
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <path d="M 300 100 Q 250 150, 320 220 Q 390 290, 420 180 Q 450 100, 300 100 Z" fill="#f43f5e" />
        <path d="M 200 280 Q 150 320, 220 380 Q 290 400, 320 310 Q 300 240, 200 280 Z" fill="#3b82f6" />
      </svg>
    </div>
  );
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('');
};

const getAvatarBg = (name: string) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    'from-blue-500 to-indigo-600 text-white',
    'from-amber-500 to-orange-600 text-white',
    'from-emerald-500 to-teal-600 text-white',
    'from-purple-500 to-pink-600 text-white',
    'from-rose-500 to-red-600 text-white',
    'from-cyan-500 to-blue-600 text-white'
  ];
  return colors[hash % colors.length];
};



export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [catSnap, featSnap, bestSnap, dealsSnap] = await Promise.all([
          getDocs(query(collection(db, 'categories'), orderBy('name'))),
          getDocs(query(collection(db, 'products'), where('is_featured', '==', true), limit(8))),
          getDocs(query(collection(db, 'products'), where('rating', '>=', 4.5), limit(4))),
          getDocs(query(collection(db, 'products'), where('compare_price', '!=', null), limit(4))),
        ]);

        const dbCategories = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        const dbFeatured = featSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        const dbBest = bestSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        const dbDeals = dealsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

        if (dbCategories.length > 0) {
          setCategories(dbCategories);
          setFeatured(dbFeatured);
          setBestSellers(dbBest);
          setDeals(dbDeals);
        } else {
          // Fallback to Mock Data if DB is empty
          setCategories(MOCK_CATEGORIES);
          setFeatured(MOCK_PRODUCTS);
          setBestSellers(MOCK_PRODUCTS.slice(0, 4));
          setDeals(MOCK_PRODUCTS.filter(p => p.compare_price));
        }
      } catch (error) {
        console.error('Database connection failed, using mock data:', error);
        setCategories(MOCK_CATEGORIES);
        setFeatured(MOCK_PRODUCTS);
        setBestSellers(MOCK_PRODUCTS.slice(0, 4));
        setDeals(MOCK_PRODUCTS.filter(p => p.compare_price));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setHeroIdx((i) => (i + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setHeroIdx((i) => (i - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => setHeroIdx((i) => (i + 1) % heroSlides.length);

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      {/* Hero Carousel */}
      <section className="relative h-[420px] sm:h-[480px] md:h-[540px] overflow-hidden">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              i === heroIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <HeroSlideBackground idx={i} />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/50 to-transparent" />
          </div>
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-1.5 bg-amber-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-full mb-5 uppercase tracking-wider">
              <BadgePercent className="w-3.5 h-3.5" /> {heroSlides[heroIdx].badge}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-[1.1] mb-4">
              {heroSlides[heroIdx].title}
            </h1>
            <p className="text-gray-300 text-base sm:text-lg mb-7 leading-relaxed">
              {heroSlides[heroIdx].subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to={heroSlides[heroIdx].link}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-400 transition-all hover:shadow-lg hover:shadow-amber-500/25"
              >
                {heroSlides[heroIdx].cta} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Nav arrows */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition">
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroSlides.map((_, i: number) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === heroIdx ? 'bg-amber-400 w-8' : 'bg-white/40 w-2 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹999' },
            { icon: Shield, title: 'Secure Payment', desc: 'UPI, Card, COD' },
            { icon: Clock, title: 'Fast Shipping', desc: '3-5 business days' },
            { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Call: 8143247090' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 group-hover:bg-amber-500 transition-colors">
                <Icon className="w-5 h-5 text-amber-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Shop by Category</h2>
            <p className="text-gray-500 text-sm mt-1">Browse our wide range of construction materials and tools</p>
          </div>
          <Link to="/products" className="hidden sm:inline-flex items-center gap-1 text-amber-600 font-semibold text-sm hover:text-amber-700 transition">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat: Category) => {
            const Icon = categoryIcons[cat.slug] || Wrench;
            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group relative flex flex-col items-center p-6 bg-white rounded-xl border border-gray-100 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-amber-600 transition-colors text-center">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Deals of the Day */}
      {deals.length > 0 && (
        <section className="bg-gradient-to-r from-red-50 to-amber-50">
          <div className="max-w-7xl mx-auto px-4 py-14">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <BadgePercent className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Deals of the Day</h2>
                  <p className="text-gray-500 text-sm">Limited time offers - Grab them before they're gone!</p>
                </div>
              </div>
              <Link to="/products" className="hidden sm:inline-flex items-center gap-1 text-red-600 font-semibold text-sm hover:text-red-700 transition">
                View All Deals <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {deals.map((p: Product, idx: number) => (
                <ProductCard key={p.id} product={p} variant="deal" priority={idx < 4} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-14">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Featured Products</h2>
                <p className="text-gray-500 text-sm">Handpicked deals you don't want to miss</p>
              </div>
            </div>
            <Link to="/products" className="hidden sm:inline-flex items-center gap-1 text-amber-600 font-semibold text-sm hover:text-amber-700 transition">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p: Product, idx: number) => (
              <ProductCard key={p.id} product={p} priority={idx < 4} />
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-14">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Best Sellers</h2>
                  <p className="text-gray-500 text-sm">Top-rated products loved by our customers</p>
                </div>
              </div>
              <Link to="/products" className="hidden sm:inline-flex items-center gap-1 text-green-600 font-semibold text-sm hover:text-green-700 transition">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {bestSellers.map((p: Product) => (
                <ProductCard key={p.id} product={p} variant="bestseller" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews Section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">What Our Customers Say</h2>
            <p className="text-gray-500">Trusted by over 10,000+ homeowners and professional contractors</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Rajesh Kumar",
                role: "Construction Contractor",
                text: "Ace Hardware has completely changed how I source materials. The real-time tracking and quality assurance are unmatched in the industry.",
                rating: 5,
                image: "https://i.pravatar.cc/150?u=rajesh"
              },
              {
                name: "Anjali Sharma",
                role: "Interior Designer",
                text: "The product variety is amazing. I can find everything from premium paints to heavy-duty tools in one place. Their delivery is always on time!",
                rating: 5,
                image: "https://i.pravatar.cc/150?u=anjali"
              },
              {
                name: "Vikram Singh",
                role: "Homeowner",
                text: "Easy to use website and great customer support. I ordered materials for my home renovation and the experience was seamless.",
                rating: 5,
                image: "https://i.pravatar.cc/150?u=vikram"
              }
            ].map((review, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
                <Quote className="absolute top-6 right-6 w-8 h-8 text-amber-500/10" />
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-br border-2 border-white shadow-sm shrink-0 ${getAvatarBg(review.name)}`}>
                    {getInitials(review.name)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{review.name}</h4>
                    <p className="text-gray-400 text-xs">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-amber-950/40 border border-slate-700/30">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent" />
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <pattern id="cta-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#fff" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
          <div className="relative z-10 px-8 py-14 md:py-20 md:px-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Need Bulk Orders for Your Project?
              </h2>
              <p className="text-gray-300 text-lg max-w-xl">
                Get special pricing for large orders. Contact our sales team for custom quotes on construction materials.
              </p>
            </div>
            <Link
              to="/contact"
              className="shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-400 transition-all hover:shadow-lg hover:shadow-amber-500/25"
            >
              Get a Quote <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
