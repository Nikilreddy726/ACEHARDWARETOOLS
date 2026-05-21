import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Truck, Zap } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatPrice, FREE_DELIVERY_THRESHOLD } from '../../lib/format';
import ProductImage from './ProductImage';
import { useState } from 'react';

interface Props {
  product: Product;
  variant?: 'default' | 'deal' | 'bestseller';
  priority?: boolean;
}

export default function ProductCard({ product, variant = 'default', priority = false }: Props) {
  const { items, addItem, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    addItem(product);
  };

  const handleUpdate = (e: React.MouseEvent, delta: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    updateQuantity(product.id, quantity + delta);
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-amber-200 transition-all duration-300 flex flex-col">
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden">
        <ProductImage
          src={product.image_url}
          alt={product.name}
          className="aspect-square"
          priority={priority}
        />
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              {discount}% OFF
            </span>
          )}
          {variant === 'deal' && (
            <span className="bg-orange-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-0.5">
              <Zap className="w-3 h-3" /> Deal
            </span>
          )}
          {variant === 'bestseller' && product.rating >= 4.5 && (
            <span className="bg-green-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              Best Seller
            </span>
          )}
        </div>
        <div className="absolute top-2.5 right-2.5">
          {product.stock === 0 ? (
            <span className="bg-gray-800 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              Out of Stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              Only {product.stock} left
            </span>
          ) : null}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/products/${product.id}`} className="block mb-1">
          <h3 className="font-semibold text-gray-800 text-sm leading-snug group-hover:text-amber-600 transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-400">{product.rating}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl font-bold text-slate-800">{formatPrice(product.price)}</span>
          {product.compare_price && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
          )}
        </div>

        {/* Delivery info */}
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-3">
          <Truck className="w-3.5 h-3.5 text-green-500" />
          <span>{product.price >= FREE_DELIVERY_THRESHOLD ? 'FREE Delivery' : `Delivery ₹${79}`}</span>
        </div>

        {/* Add to Cart / Quantity Selector */}
        {quantity > 0 ? (
          <div className="mt-auto flex items-center justify-between bg-amber-50 rounded-lg border border-amber-200 overflow-hidden">
            <button
              onClick={(e) => handleUpdate(e, -1)}
              className="p-2.5 text-amber-600 hover:bg-amber-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg>
            </button>
            <span className="font-bold text-amber-700 text-sm">{quantity}</span>
            <button
              onClick={(e) => handleUpdate(e, 1)}
              disabled={product.stock > 0 && quantity >= product.stock}
              className="p-2.5 text-amber-600 hover:bg-amber-100 transition-colors disabled:opacity-30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`mt-auto w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-amber-500 text-white hover:bg-amber-600 hover:shadow-md hover:shadow-amber-200'
            }`}
          >
            {product.stock === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
