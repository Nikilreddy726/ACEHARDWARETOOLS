import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { auth, db, isDemoMode } from '../../lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  addDoc
} from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrice } from '../../lib/format';
import { IMAGES } from '../../lib/images';
import type { Product, Category, Order, Profile } from '../../types';
import ProductImage from '../../components/ui/ProductImage';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  X, Save, AlertTriangle, Users, FolderTree, Settings, TrendingUp, Search,
  Filter, MoreVertical, RefreshCw, Radio, Database, LayoutDashboard, 
  ShoppingCart, BarChart3, Plus, Pencil, Trash2, Package
} from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_ORDERS } from '../../lib/mockData';

type Tab = 'overview' | 'products' | 'orders' | 'inventory' | 'users' | 'categories';

export default function AdminDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', compare_price: '', image_url: '',
    category_id: '', stock: '', sku: '', is_featured: false, rating: '0',
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());

  if (authLoading) return <LoadingSpinner />;
  if (!user || !profile?.is_admin) return <Navigate to="/" replace />;

  const fetchData = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    setIsRefreshing(true);
    try {
      // Products
      const prodQuery = query(collection(db, 'products'), orderBy('created_at', 'desc'));
      const prodSnap = await getDocs(prodQuery);
      const dbProducts = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

      // Categories
      const catQuery = query(collection(db, 'categories'), orderBy('name'));
      const catSnap = await getDocs(catQuery);
      const dbCategories = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));

      // Orders
      const ordQuery = query(collection(db, 'orders'), orderBy('created_at', 'desc'));
      const ordSnap = await getDocs(ordQuery);
      const dbOrders = ordSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));

      // Profiles
      const profQuery = query(collection(db, 'profiles'), orderBy('created_at', 'desc'));
      const profSnap = await getDocs(profQuery);
      const dbProfiles = profSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Profile));
      
      let mergedOrders = [...dbOrders];
      
      if (isDemoMode) {
        const demoOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
        demoOrders.forEach((do_: any) => {
          if (!mergedOrders.some(o => o.id === do_.id)) {
            mergedOrders.push(do_);
          }
        });
      }
      
      mergedOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setProducts(dbProducts.length > 0 ? dbProducts : MOCK_PRODUCTS);
      setCategories(dbCategories.length > 0 ? dbCategories : MOCK_CATEGORIES);
      setOrders(mergedOrders.length > 0 ? mergedOrders : MOCK_ORDERS);
      setProfiles(dbProfiles);
      setLastSynced(new Date());
    } catch (err) {
      console.error('Admin fetch error:', err);
      if (isDemoMode) {
        setProducts(MOCK_PRODUCTS);
        setCategories(MOCK_CATEGORIES);
        setOrders(MOCK_ORDERS);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(true);

    // 1. Listen for real-time DB changes (Orders)
    const ordQuery = query(collection(db, 'orders'), orderBy('created_at', 'desc'));
    const unsubscribeOrders = onSnapshot(ordQuery, (snapshot) => {
      const dbOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      
      setOrders(prev => {
        let merged = [...dbOrders];
        if (isDemoMode) {
          const demoOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
          demoOrders.forEach((do_: any) => {
            if (!merged.some(o => o.id === do_.id)) {
              merged.push(do_);
            }
          });
        }
        return merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      });
      setLastSynced(new Date());
    });

    // 2. Listen for Demo Mode changes (other tabs)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'demo_orders' && isDemoMode) {
        const demoOrders = JSON.parse(e.newValue || '[]');
        setOrders(prev => {
          const dbOnly = prev.filter(o => !demoOrders.some(d => d.id === o.id));
          const combined = [...demoOrders, ...dbOnly];
          return combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        });
        setLastSynced(new Date());
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      unsubscribeOrders();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const openNewProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: '', description: '', price: '', compare_price: '', image_url: '', category_id: '', stock: '', sku: '', is_featured: false, rating: '0' });
    setShowProductModal(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name, description: p.description, price: String(p.price),
      compare_price: p.compare_price ? String(p.compare_price) : '',
      image_url: p.image_url, category_id: p.category_id || '',
      stock: String(p.stock), sku: p.sku || '', is_featured: p.is_featured, rating: String(p.rating),
    });
    setShowProductModal(true);
  };

  const saveProduct = async () => {
    const payload = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price) || 0,
      compare_price: productForm.compare_price ? parseFloat(productForm.compare_price) : null,
      image_url: productForm.image_url,
      category_id: productForm.category_id || null,
      stock: parseInt(productForm.stock) || 0,
      sku: productForm.sku || null,
      is_featured: productForm.is_featured,
      rating: parseFloat(productForm.rating) || 0,
      updated_at: new Date().toISOString()
    };

    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), payload);
      } else {
        await addDoc(collection(db, 'products'), {
          ...payload,
          created_at: new Date().toISOString()
        });
      }
      fetchData(false);
      setShowProductModal(false);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product. Check console for details.');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { 
        status, 
        updated_at: new Date().toISOString() 
      });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const updateStock = async (productId: string, stock: number) => {
    try {
      await updateDoc(doc(db, 'products', productId), { stock });
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock } : p)));
    } catch (err) {
      console.error('Error updating stock:', err);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure? This might affect products in this category.')) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const seedDatabase = async () => {
    if (isDemoMode) {
      alert('Please add your Firebase keys to .env first!');
      return;
    }
    if (!confirm('This will upload mock products and categories to your Firebase. Continue?')) return;
    
    setLoading(true);
    try {
      // 1. Categories
      for (const cat of MOCK_CATEGORIES) {
        const { id, ...data } = cat;
        await setDoc(doc(db, 'categories', id), { ...data, created_at: new Date().toISOString() });
      }
      // 2. Products
      for (const prod of MOCK_PRODUCTS) {
        const { id, ...data } = prod;
        await setDoc(doc(db, 'products', id), { ...data, created_at: new Date().toISOString() });
      }
      alert('Success! Database seeded with mock data.');
      fetchData(true);
    } catch (err) {
      console.error('Seeding error:', err);
      alert('Error seeding database. Check console for rules/permissions.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const stats = [
    { label: 'Total Sales', value: formatPrice(orders.reduce((s, o) => s + Number(o.total), 0)), icon: TrendingUp, color: 'bg-green-50 text-green-600', trend: '+12%' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'bg-amber-50 text-amber-600', trend: '+5%' },
    { label: 'Products', value: products.length, icon: Package, color: 'bg-blue-50 text-blue-600', trend: 'Stable' },
    { label: 'Customers', value: profiles.length, icon: Users, color: 'bg-purple-50 text-purple-600', trend: '+18%' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800">Ace Admin</span>
          </Link>
          
          <nav className="space-y-1">
            {([
              { key: 'overview', label: 'Dashboard', icon: LayoutDashboard },
              { key: 'products', label: 'Products', icon: Package },
              { key: 'orders', label: 'Orders', icon: ShoppingCart },
              { key: 'inventory', label: 'Inventory', icon: BarChart3 },
              { key: 'users', label: 'Customers', icon: Users },
              { key: 'categories', label: 'Categories', icon: FolderTree },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  tab === key ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4.5 h-4.5" /> {label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-gray-50">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all">
            <Settings className="w-4.5 h-4.5" /> Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 capitalize">{tab} Management</h1>
              <p className="text-sm text-gray-500">Welcome back, {profile?.full_name}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-lg shadow-sm">
                <div className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-400' : 'bg-green-500 animate-pulse'}`} />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {isDemoMode ? 'Demo Mode' : 'Live Sync'}
                </span>
                <span className="w-px h-3 bg-gray-100 mx-1" />
                <button 
                  onClick={() => fetchData(false)}
                  disabled={isRefreshing}
                  className="p-1 hover:bg-gray-50 rounded transition-colors disabled:opacity-50"
                  title="Force Sync"
                >
                  <RefreshCw className={`w-3 h-3 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              {!isDemoMode && products.length === 0 && (
                <button 
                  onClick={seedDatabase}
                  className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-lg hover:bg-amber-600 transition"
                >
                  <Database className="w-3 h-3" /> Seed DB
                </button>
              )}
              <Link to="/" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">View Store</Link>
            </div>
          </div>

          {/* Overview Tab */}
          {tab === 'overview' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(({ label, value, icon: Icon, color, trend }) => (
                  <div key={label} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                        {trend}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{value}</p>
                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="font-bold text-slate-800">Recent Orders</h2>
                  <button onClick={() => setTab('orders')} className="text-sm text-amber-600 font-bold hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="text-left px-6 py-4 font-semibold text-gray-600">ID</th>
                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Customer</th>
                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Total</th>
                        <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                        <th className="text-right px-6 py-4 font-semibold text-gray-600">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50/50 transition">
                          <td className="px-6 py-4 font-medium text-gray-800">#{o.id.slice(0, 8)}</td>
                          <td className="px-6 py-4 text-gray-500">{o.user_id.slice(0, 8)}...</td>
                          <td className="px-6 py-4 font-bold">{formatPrice(Number(o.total))}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] uppercase font-extrabold px-2 py-1 rounded-full ${
                              o.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-gray-400">{new Date(o.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Products tab */}
          {tab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="font-bold text-lg text-slate-800">Inventory ({products.length})</h2>
                  <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-amber-600 font-medium"><Filter className="w-4 h-4" /> Filter</button>
                </div>
                <button
                  onClick={openNewProduct}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 transition shadow-lg shadow-amber-200"
                >
                  <Plus className="w-4 h-4" /> Add New Product
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="text-left px-6 py-4 font-semibold text-gray-600">Product</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-600">Category</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-600">Price</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-600">Stock</th>
                      <th className="text-right px-6 py-4 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((p) => {
                      const cat = categories.find((c) => c.id === p.category_id);
                      return (
                        <tr key={p.id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <ProductImage
                                src={p.image_url}
                                alt={p.name}
                                className="w-12 h-12 rounded-lg"
                                size="sm"
                              />
                              <div>
                                <p className="font-bold text-gray-800">{p.name}</p>
                                <p className="text-[10px] text-gray-400 font-medium">SKU: {p.sku || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-500 font-medium">{cat?.name || 'Uncategorized'}</td>
                          <td className="px-6 py-4 font-bold text-slate-800">{formatPrice(p.price)}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <div className="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${p.stock > 10 ? 'bg-green-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, (p.stock / 50) * 100)}%` }} />
                              </div>
                              <span className="text-[10px] font-bold text-gray-400">{p.stock} units</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => openEditProduct(p)} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition"><Pencil className="w-4 h-4" /></button>
                              <button onClick={() => deleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders tab */}
          {tab === 'orders' && (
            <div>
              <h2 className="font-bold text-lg text-slate-800 mb-6">Manage Orders ({orders.length})</h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="text-left px-6 py-4 font-semibold text-gray-600">Order ID</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-600">Date</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-600">Customer</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-600">Amount</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                      <th className="text-right px-6 py-4 font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-bold text-gray-800">#{o.id.slice(0, 8)}</td>
                        <td className="px-6 py-4 text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="text-gray-800 font-medium">Customer ID: {o.user_id.slice(0, 8)}</div>
                          <div className="text-[10px] text-gray-400">Items: {o.order_items?.length || 0}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800">{formatPrice(Number(o.total))}</td>
                        <td className="px-6 py-4">
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                            className={`text-xs font-bold border-2 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                              o.status === 'delivered' ? 'border-green-100 text-green-600' : 
                              o.status === 'cancelled' ? 'border-red-100 text-red-600' : 'border-gray-100'
                            }`}
                          >
                            {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                              <option key={s} value={s}>{s.toUpperCase()}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => alert(`Order Items:\n${o.order_items?.map((i: any) => `- ${i.product?.name} x${i.quantity}`).join('\n')}`)}
                            className="text-xs font-bold text-amber-600 hover:underline"
                          >
                            View Items
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users tab */}
          {tab === 'users' && (
            <div>
              <h2 className="font-bold text-lg text-slate-800 mb-6">Customer Management ({profiles.length})</h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="text-left px-6 py-4 font-semibold text-gray-600">Customer</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-600">Role</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-600">Joined</th>
                      <th className="text-right px-6 py-4 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {profiles.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
                              {p.full_name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">{p.full_name || 'Anonymous'}</p>
                              <p className="text-[10px] text-gray-400">ID: {p.id.slice(0, 12)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-extrabold px-2 py-1 rounded-full ${p.is_admin ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                            {p.is_admin ? 'ADMIN' : 'CUSTOMER'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-amber-500 px-3 py-1 font-bold text-xs uppercase transition">Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {tab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg text-slate-800">Categories ({categories.length})</h2>
                <button className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 transition shadow-lg shadow-amber-200">
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between group hover:border-amber-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
                        <FolderTree className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{cat.name}</p>
                        <p className="text-[10px] text-gray-400">Slug: {cat.slug}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-2 text-gray-400 hover:text-amber-500 transition"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => deleteCategory(cat.id)} className="p-2 text-gray-400 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Product Modal (Existing) */}
      {showProductModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white">
              <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                <Package className="w-6 h-6 text-amber-500" />
                {editingProduct ? 'Edit Product Details' : 'Register New Product'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Product Info Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Basic Information</label>
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
                  />
                </div>
                <textarea
                  placeholder="Detailed description..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
                />
              </div>

              {/* Pricing & Stock Section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Stock Level</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Image & Settings Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={productForm.image_url}
                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm font-bold text-gray-700">Featured on Home Page?</span>
                  <input
                    type="checkbox"
                    checked={productForm.is_featured}
                    onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex gap-4">
              <button
                onClick={() => setShowProductModal(false)}
                className="flex-1 py-4 font-bold text-gray-500 hover:text-gray-800 transition"
              >
                Discard Changes
              </button>
              <button
                onClick={saveProduct}
                className="flex-[2] py-4 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-600 transition shadow-xl shadow-amber-200 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" /> {editingProduct ? 'Save Updates' : 'Add to Catalog'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 z-50 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {([
          { key: 'overview', icon: LayoutDashboard, label: 'Home' },
          { key: 'products', icon: Package, label: 'Products' },
          { key: 'orders', icon: ShoppingCart, label: 'Orders' },
          { key: 'users', icon: Users, label: 'Users' },
          { key: 'categories', icon: FolderTree, label: 'Cats' },
        ] as const).map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              tab === key ? 'text-amber-500' : 'text-gray-400'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-bold">{label}</span>
          </button>
        ))}
      </nav>

      {/* Adjust main content for mobile bottom nav */}
      <style>{`
        @media (max-width: 1023px) {
          main { padding-bottom: 80px; }
        }
      `}</style>
    </div>
  );
}
