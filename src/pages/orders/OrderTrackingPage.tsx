import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrice } from '../../lib/format';
import { IMAGES } from '../../lib/images';
import type { Order, OrderItem, Product } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Package, Search, ChevronDown, Truck, CheckCircle, Clock, XCircle, ChevronRight } from 'lucide-react';

const statusConfig: Record<string, { color: string; icon: typeof Package; label: string; bg: string }> = {
  pending: { color: 'text-amber-700', icon: Clock, label: 'Pending', bg: 'bg-amber-50' },
  confirmed: { color: 'text-blue-700', icon: CheckCircle, label: 'Confirmed', bg: 'bg-blue-50' },
  processing: { color: 'text-indigo-700', icon: Package, label: 'Processing', bg: 'bg-indigo-50' },
  shipped: { color: 'text-purple-700', icon: Truck, label: 'Shipped', bg: 'bg-purple-50' },
  delivered: { color: 'text-green-700', icon: CheckCircle, label: 'Delivered', bg: 'bg-green-50' },
  cancelled: { color: 'text-red-700', icon: XCircle, label: 'Cancelled', bg: 'bg-red-50' },
};

export default function OrderTrackingPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<(Order & { order_items?: (OrderItem & { product?: Product })[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [trackSearch, setTrackSearch] = useState('');

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('user_id', '==', user.uid),
          orderBy('created_at', 'desc')
        );
        const ordSnap = await getDocs(q);
        const dbOrders = ordSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        
        // Get demo orders from localStorage
        const demoOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]')
          .filter((o: any) => o.user_id === user.uid);

        // Merge and remove duplicates
        const merged = [...(dbOrders || [])];
        demoOrders.forEach((do_: any) => {
          if (!merged.find(mo => mo.id === do_.id)) {
            merged.push(do_);
          }
        });

        // Sort by date
        merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setOrders(merged as typeof orders);
      } catch (err) {
        console.error('Fetch orders error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const toggleExpand = async (orderId: string) => {
    if (expanded === orderId) { setExpanded(null); return; }
    setExpanded(orderId);
    const order = orders.find((o) => o.id === orderId);
    if (order?.order_items) return;

    try {
      const itemsQuery = query(collection(db, 'order_items'), where('order_id', '==', orderId));
      const itemsSnap = await getDocs(itemsQuery);
      const items = itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrderItem));

      if (items && items.length > 0) {
        const enriched = await Promise.all(items.map(async (item) => {
          const prodRef = doc(db, 'products', item.product_id);
          const prodSnap = await getDoc(prodRef);
          return {
            ...item,
            product: prodSnap.exists() ? ({ id: prodSnap.id, ...prodSnap.data() } as Product) : undefined
          };
        }));

        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, order_items: enriched } : o))
        );
      }
    } catch (err) {
      console.error('Error expanding order:', err);
    }
  };

  if (authLoading || loading) return <LoadingSpinner />;

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <Package className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign In to Track Orders</h2>
        <p className="text-gray-500 mb-6">You need to be logged in to view your orders</p>
        <Link to="/login" className="px-7 py-3.5 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-all hover:shadow-lg hover:shadow-amber-200">
          Sign In
        </Link>
      </div>
    );
  }

  const filteredOrders = trackSearch
    ? orders.filter((o) => o.tracking_number?.toLowerCase().includes(trackSearch.toLowerCase()) || o.id.includes(trackSearch))
    : orders;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-amber-600 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-800 font-medium">My Orders</span>
      </nav>

      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Orders</h1>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={trackSearch}
          onChange={(e) => setTrackSearch(e.target.value)}
          placeholder="Search by order ID or tracking number..."
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition bg-white"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No orders found</p>
          <Link to="/products" className="mt-4 inline-block text-amber-600 font-medium hover:underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const sc = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = sc.icon;
            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 transition">
                <button
                  onClick={() => toggleExpand(order.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${sc.bg}`}>
                      <StatusIcon className={`w-5 h-5 ${sc.color}`} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-800">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${sc.bg} ${sc.color}`}>{sc.label}</span>
                    <span className="font-bold text-slate-800">{formatPrice(Number(order.total))}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded === order.id ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {expanded === order.id && order.order_items && (
                  <div className="border-t border-gray-100 p-5 bg-gray-50/50">
                    {order.tracking_number && (
                      <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700">
                          Tracking: <span className="font-bold">{order.tracking_number}</span>
                        </span>
                      </div>
                    )}
                    <div className="space-y-3">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                          <img
                            src={item.product?.image_url || IMAGES.fallbackSmall}
                            alt=""
                            className="w-14 h-14 object-cover rounded-lg"
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            onError={(e) => { (e.target as HTMLImageElement).src = IMAGES.fallbackSmall; }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-700 truncate">{item.product?.name || 'Product'}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity} x {formatPrice(item.price)}</p>
                          </div>
                          <span className="text-sm font-bold text-slate-800">{formatPrice(item.quantity * item.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
