import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { formatPrice, FREE_DELIVERY_THRESHOLD, SHIPPING_COST, TAX_RATE } from '../../lib/format';
import { IMAGES } from '../../lib/images';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, ArrowLeft, Truck, Shield, Tag } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  const shipping = totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = totalPrice * TAX_RATE;
  const grandTotal = totalPrice + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <ShoppingCart className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet. Start shopping to fill it up!</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-all hover:shadow-lg hover:shadow-amber-200"
        >
          Start Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-amber-600 transition">Home</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Shopping Cart</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Shopping Cart <span className="text-gray-400 font-normal text-lg">({totalItems} items)</span></h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium transition">
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => {
            const discount = product.compare_price
              ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
              : 0;
            return (
              <div key={product.id} className="flex gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                <Link to={`/products/${product.id}`} className="shrink-0">
                  <img
                    src={product.image_url || IMAGES.fallbackSmall}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => { (e.target as HTMLImageElement).src = IMAGES.fallbackSmall; }}
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${product.id}`} className="font-semibold text-gray-800 text-sm hover:text-amber-600 transition line-clamp-2">
                    {product.name}
                  </Link>
                  {product.sku && <p className="text-xs text-gray-400 mt-0.5">SKU: {product.sku}</p>}

                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-lg font-bold text-slate-800">{formatPrice(product.price)}</span>
                    {product.compare_price && (
                      <>
                        <span className="text-sm text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">{discount}% off</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-2.5">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-2.5 py-1.5 hover:bg-gray-50 transition text-gray-500"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-sm font-bold border-x border-gray-200 min-w-[2.5rem] text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-2.5 py-1.5 hover:bg-gray-50 transition text-gray-500"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0 self-center">
                  <p className="font-bold text-slate-800 text-lg">{formatPrice(product.price * quantity)}</p>
                  {product.compare_price && (
                    <p className="text-xs text-green-600 font-medium">You save {formatPrice((product.compare_price - product.price) * quantity)}</p>
                  )}
                </div>
              </div>
            );
          })}

          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-amber-600 font-medium transition mt-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
            <h2 className="font-bold text-lg text-slate-800 mb-4">Order Summary</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal ({totalItems} items)</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">GST (18%)</span>
                <span className="font-medium">{formatPrice(Math.round(tax))}</span>
              </div>
              <div className="border-t border-gray-100 pt-2.5 flex justify-between">
                <span className="font-bold text-slate-800 text-base">Total</span>
                <span className="font-bold text-xl text-slate-800">{formatPrice(Math.round(grandTotal))}</span>
              </div>
            </div>

            {totalPrice < FREE_DELIVERY_THRESHOLD && (
              <div className="mt-3 p-3 bg-amber-50 rounded-lg flex items-start gap-2">
                <Truck className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700">
                  Add <strong>{formatPrice(FREE_DELIVERY_THRESHOLD - totalPrice)}</strong> more for <strong>FREE delivery</strong>!
                </p>
              </div>
            )}

            <Link
              to="/checkout"
              className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-all hover:shadow-lg hover:shadow-amber-200"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield className="w-3.5 h-3.5 text-green-500" />
                <span>Secure checkout with SSL encryption</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                <span>Apply coupons at checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
