import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ProductImage from '../../components/ui/ProductImage';
import { formatPrice, FREE_DELIVERY_THRESHOLD, SHIPPING_COST } from '../../lib/format';
import { MOCK_PRODUCTS } from '../../lib/mockData';
import {
  ShoppingCart, Star, Minus, Plus, Package, Truck, Shield,
  Heart, Share2, CheckCircle, MapPin, Clock, RotateCcw, ChevronRight,
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          const mock = MOCK_PRODUCTS.find(p => p.id === id);
          setProduct(mock || null);
        }
      } catch (err) {
        const mock = MOCK_PRODUCTS.find(p => p.id === id);
        setProduct(mock || null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    if (!user) {
      navigate('/login');
      return;
    }
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <p className="text-gray-500 text-lg">Product not found</p>
      <Link to="/products" className="mt-4 inline-block text-amber-600 font-medium hover:underline">Back to Shop</Link>
    </div>
  );

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const savings = product.compare_price ? (product.compare_price - product.price) * quantity : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-amber-600 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-amber-600 transition">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-800 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="relative">
            <ProductImage
              src={product.image_url}
              alt={product.name}
              className="aspect-square"
              size="lg"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg shadow">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          {product.sku && <p className="text-xs text-gray-400 mb-2">SKU: {product.sku}</p>}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">{product.name}</h1>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4.5 h-4.5 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600">{product.rating} out of 5</span>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-amber-600 font-medium">{Math.floor(product.rating * 127)} ratings</span>
            </div>
          )}

          {/* Price block */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-800">{formatPrice(product.price)}</span>
              {product.compare_price && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded">Save {discount}%</span>
                </>
              )}
            </div>
            {savings > 0 && (
              <p className="text-sm text-green-600 font-medium mt-1">You save {formatPrice(savings)} on this order</p>
            )}
            <p className="text-xs text-gray-500 mt-1.5">Inclusive of all taxes</p>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-5">
            {product.stock > 5 ? (
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-semibold text-green-600">In Stock</span>
              </div>
            ) : product.stock > 0 ? (
              <div className="flex items-center gap-1.5">
                <Package className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-amber-600">Only {product.stock} left - order soon</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Package className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-red-600">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2.5 hover:bg-gray-50 transition text-gray-600"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-sm font-bold min-w-[3rem] text-center border-x border-gray-200">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                className="px-3 py-2.5 hover:bg-gray-50 transition text-gray-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-bold rounded-lg transition-all duration-200 ${
                added
                  ? 'bg-green-500 text-white'
                  : product.stock === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-amber-500 text-white hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-200'
              }`}
            >
              {added ? (
                <><CheckCircle className="w-5 h-5" /> Added to Cart!</>
              ) : product.stock === 0 ? (
                'Out of Stock'
              ) : (
                <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
              )}
            </button>
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className={`p-3.5 border-2 rounded-lg transition ${wishlisted ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500'}`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
            <button className="p-3.5 border-2 border-gray-200 rounded-lg text-gray-400 hover:border-amber-200 hover:text-amber-500 transition">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery info */}
          <div className="border border-gray-100 rounded-xl p-4 mb-5 space-y-3">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {product.price >= FREE_DELIVERY_THRESHOLD ? 'FREE Delivery' : `Standard Delivery ${formatPrice(SHIPPING_COST)}`}
                </p>
                <p className="text-xs text-gray-500">Estimated delivery: 3-5 business days</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-gray-700">Deliver to Warangal, Telangana 506002</p>
                <p className="text-xs text-amber-600 font-medium cursor-pointer hover:underline">Change delivery PIN code</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-gray-700">Same Day Delivery available in selected areas</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RotateCcw className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-gray-700">7-Day Return Policy</p>
                <p className="text-xs text-gray-500">Easy returns if you change your mind</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <h3 className="font-bold text-gray-800 mb-2">Product Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl">
            {[
              { icon: Truck, label: 'Free Delivery', sub: `Over ${formatPrice(FREE_DELIVERY_THRESHOLD)}` },
              { icon: Shield, label: 'Warranty', sub: '1 Year' },
              { icon: RotateCcw, label: 'Easy Returns', sub: '7 Days' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center">
                <Icon className="w-5 h-5 text-amber-600 mb-1" />
                <span className="text-xs font-semibold text-gray-700">{label}</span>
                <span className="text-[10px] text-gray-400">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
