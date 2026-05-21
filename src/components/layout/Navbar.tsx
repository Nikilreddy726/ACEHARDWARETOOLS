import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import {
  Menu, X, ShoppingCart, User, LogOut, Wrench, Search,
  ChevronDown, LayoutDashboard, Package, Heart,
} from 'lucide-react';

const categories = [
  { name: 'Paints', slug: 'paints' },
  { name: 'Cement', slug: 'cement' },
  { name: 'Iron Materials', slug: 'iron-materials' },
  { name: 'Electrical Items', slug: 'electrical-items' },
  { name: 'Plumbing Products', slug: 'plumbing-products' },
  { name: 'Hardware Tools', slug: 'hardware-tools' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const { user, profile, signOut, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navLink = (to: string, label: string) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`text-sm font-medium transition-colors hover:text-amber-500 ${
          active ? 'text-amber-500' : 'text-gray-700'
        }`}
        onClick={() => setMobileOpen(false)}
      >
        {label}
      </Link>
    );
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchVal.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchVal.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      {/* Top bar */}
      <div className="bg-slate-800 text-white text-xs py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6">
            <span>Free Delivery on Orders Above ₹999</span>
            <span>Same Day Delivery Available in Selected Areas</span>
          </div>
          <div className="flex gap-6">
            <span>Call: 8143247090</span>
            <span>Track Order</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center shadow-sm">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight hidden sm:block">
              <span className="font-extrabold text-slate-800 text-lg block leading-none">Ace Hardware</span>
              <span className="text-[10px] text-gray-500 tracking-widest uppercase">and Tools</span>
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search for cement, paints, tools, electrical..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-0 focus:border-amber-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Wishlist */}
            <Link to="/" className="hidden lg:flex p-2.5 text-gray-500 hover:text-red-500 transition rounded-lg hover:bg-red-50">
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2.5 text-gray-600 hover:text-amber-500 transition rounded-lg hover:bg-amber-50">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2.5 text-gray-600 hover:text-amber-500 transition rounded-lg hover:bg-amber-50">
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-amber-700">
                      {(profile?.full_name || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden lg:inline text-sm font-medium">
                    {profile?.full_name || 'Account'}
                  </span>
                  <ChevronDown className="w-3 h-3 hidden lg:block" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{profile?.full_name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link to="/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition">
                    <Package className="w-4 h-4" /> My Orders
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition">
                      <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                    </Link>
                  )}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 text-white text-sm font-bold rounded-lg hover:bg-amber-600 transition-all hover:shadow-md hover:shadow-amber-200"
              >
                <User className="w-4 h-4" /> Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2.5 text-gray-600 hover:text-amber-500 rounded-lg hover:bg-amber-50 transition"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category nav - desktop */}
      <div className="hidden lg:block border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1">
            <div
              className="relative"
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-amber-500 rounded-b-lg hover:bg-amber-600 transition">
                <Menu className="w-4 h-4" /> All Categories <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/products?category=${cat.slug}`}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition"
                      onClick={() => setCatOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <nav className="flex items-center gap-1 ml-2">
              {navLink('/', 'Home')}
              {navLink('/products', 'All Products')}
              {navLink('/reviews', 'Reviews')}
              {navLink('/products?category=paints', 'Paints')}
              {navLink('/products?category=cement', 'Cement')}
              {navLink('/products?category=hardware-tools', 'Tools')}
              {navLink('/contact', 'Contact')}
            </nav>
        </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            {navLink('/', 'Home')}
            {navLink('/products', 'All Products')}
            <div className="pl-2 space-y-2 border-l-2 border-amber-200 ml-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">Categories</p>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/products?category=${cat.slug}`}
                  className="block text-sm text-gray-600 hover:text-amber-500 px-2 py-1"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            {navLink('/contact', 'Contact Us')}
            <div className="border-t border-gray-100 pt-3">
              {user ? (
                <div className="space-y-2">
                  {navLink('/orders', 'My Orders')}
                  {isAdmin && navLink('/admin', 'Admin Dashboard')}
                  <button
                    onClick={() => { handleSignOut(); setMobileOpen(false); }}
                    className="text-sm font-medium text-red-600 hover:text-red-700 px-2 py-1"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block text-center px-4 py-3 bg-amber-500 text-white text-sm font-bold rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
