import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { db, isDemoMode } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { formatPrice, FREE_DELIVERY_THRESHOLD, SHIPPING_COST, TAX_RATE } from '../../lib/format';
import { IMAGES } from '../../lib/images';
import {
  CreditCard, Truck, Shield, ArrowLeft, CheckCircle, Lock,
  Smartphone, Banknote, Package, ChevronDown,
} from 'lucide-react';
import type { ShippingAddress } from '../../types';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir', 
  'Ladakh', 'Lakshadweep', 'Puducherry'
].sort();

const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'United Arab Emirates', 'Singapore'
].sort();

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [address, setAddress] = useState<ShippingAddress>({
    full_name: '', phone: '', address_line_1: '', address_line_2: '',
    city: '', state: 'Telangana', postal_code: '', country: 'India',
  });
  const [payment, setPayment] = useState({
    method: 'card',
    card_number: '', expiry: '', cvv: '', name: '',
    upi_id: '',
  });

  const shipping = totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = totalPrice * TAX_RATE;
  const grandTotal = totalPrice + shipping + tax;

  const isAddressValid = () => {
    const isPhoneValid = /^\d{10}$/.test(address.phone);
    const isPincodeValid = /^\d{6}$/.test(address.postal_code);
    const isNameValid = /^[a-zA-Z\s]{3,}$/.test(address.full_name);
    
    return address.full_name && address.phone && address.address_line_1 && 
           address.city && address.postal_code && 
           isPhoneValid && isPincodeValid && isNameValid;
  };

  const isPaymentValid = () => {
    if (payment.method === 'card') {
      return payment.card_number && payment.expiry && payment.cvv && payment.name;
    }
    if (payment.method === 'upi') {
      return payment.upi_id;
    }
    return true; // COD is always valid
  };

  const handlePlaceOrder = async () => {
    if (!user) { navigate('/login'); return; }
    if (!isAddressValid() || !isPaymentValid()) {
      alert('Please fill in all required details correctly.');
      return;
    }
    setLoading(true);
    try {
      // 1. Create order in Firestore
      const orderData = {
        user_id: user.uid,
        status: 'confirmed',
        total: grandTotal,
        shipping_address: address,
        payment_method: payment.method,
        payment_status: 'paid',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      const newOrderId = orderRef.id;

      if (newOrderId) {
        // 2. Add order items
        const itemsPromises = items.map((item) => {
          return addDoc(collection(db, 'order_items'), {
            order_id: newOrderId,
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            created_at: new Date().toISOString()
          });
        });
        await Promise.all(itemsPromises);
        
        // Only save to local demo storage if NOT in production/real-db mode
        if (isDemoMode) {
          const demoOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
          const newOrder = {
            id: newOrderId,
            ...orderData,
            order_items: items.map(item => ({
              ...item,
              product: item.product
            }))
          };
          localStorage.setItem('demo_orders', JSON.stringify([newOrder, ...demoOrders]));
        }

        setOrderId(newOrderId);
        clearCart();
        setStep(3);
      }
    } catch (err) {
      console.error('Order placement error:', err);
      // Fallback for Demo Mode
      if (isDemoMode || user?.uid === 'demo-user-id') {
        const simulatedOrderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Save to demo storage for local-only preview
        const demoOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
        const simulatedOrder = {
          id: simulatedOrderId,
          user_id: user?.uid || 'demo-user',
          total: grandTotal,
          status: 'pending',
          payment_status: 'paid',
          shipping_address: `${address.address_line_1}, ${address.city}`,
          phone: address.phone,
          created_at: new Date().toISOString(),
          order_items: items.map(item => ({
            id: Math.random().toString(),
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            product: item.product
          }))
        };
        localStorage.setItem('demo_orders', JSON.stringify([simulatedOrder, ...demoOrders]));

        setOrderId(simulatedOrderId);
        clearCart();
        setStep(3);
      } else {
        alert('Failed to place order. Please check your connection or try again.');
      }
    }
    setLoading(false);
  };

  if (items.length === 0 && step !== 3) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Steps indicator */}
      <div className="flex items-center justify-center mb-8">
        {[
          { n: 1, label: 'Shipping' },
          { n: 2, label: 'Payment' },
          { n: 3, label: 'Confirmation' },
        ].map(({ n, label }, i) => (
          <div key={n} className="flex items-center">
            <div className={`flex items-center gap-2 ${step >= n ? 'text-amber-600' : 'text-gray-400'}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step > n ? 'bg-amber-500 text-white' : step === n ? 'border-2 border-amber-500 text-amber-600 bg-amber-50' : 'border-2 border-gray-300 text-gray-400'
              }`}>
                {step > n ? <CheckCircle className="w-5 h-5" /> : n}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{label}</span>
            </div>
            {i < 2 && <div className={`w-12 sm:w-20 h-0.5 mx-3 transition-colors ${step > n ? 'bg-amber-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-500" /> Shipping Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: 'full_name', label: 'Full Name', span: false, required: true, type: 'text', placeholder: 'John Doe' },
                  { key: 'phone', label: 'Mobile Number', span: false, required: true, type: 'tel', placeholder: '10-digit number', pattern: '[0-9]*', maxLength: 10 },
                  { key: 'address_line_1', label: 'Address Line 1', span: true, required: true, type: 'text', placeholder: 'Flat, House no., Building' },
                  { key: 'address_line_2', label: 'Address Line 2 (Optional)', span: true, required: false, type: 'text', placeholder: 'Area, Colony, Street' },
                  { key: 'city', label: 'City / Town', span: false, required: true, type: 'text', placeholder: 'Warangal' },
                  { key: 'state', label: 'State', span: false, required: true, type: 'select', options: INDIAN_STATES },
                  { key: 'postal_code', label: 'PIN Code', span: false, required: true, type: 'tel', placeholder: '6-digit code', pattern: '[0-9]*', maxLength: 6 },
                  { key: 'country', label: 'Country', span: false, required: true, type: 'select', options: COUNTRIES },
                ].map(({ key, label, span, required, type, placeholder, pattern, maxLength, options }) => (
                  <div key={key} className={span ? 'sm:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {label} {required && <span className="text-red-500">*</span>}
                    </label>
                    {type === 'select' ? (
                      <div className="relative">
                        <select
                          value={address[key as keyof ShippingAddress] as string}
                          onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition appearance-none bg-white"
                          required={required}
                        >
                          <option value="">Select {label}</option>
                          {options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    ) : (
                      <input
                        type={type}
                        value={address[key as keyof ShippingAddress] as string}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (key === 'phone' || key === 'postal_code') {
                            if (!/^\d*$/.test(val)) return;
                          }
                          if (key === 'full_name') {
                            if (!/^[a-zA-Z\s]*$/.test(val)) return;
                          }
                          setAddress({ ...address, [key]: val });
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition"
                        required={required}
                      />
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  if (isAddressValid()) {
                    setStep(2);
                  } else {
                    const isPhoneValid = /^\d{10}$/.test(address.phone);
                    const isPincodeValid = /^\d{6}$/.test(address.postal_code);
                    const isNameValid = /^[a-zA-Z\s]{3,}$/.test(address.full_name);
                    
                    if (!isNameValid) alert('Please enter a valid name (at least 3 characters, no numbers).');
                    else if (!isPhoneValid) alert('Please enter a valid 10-digit mobile number.');
                    else if (!isPincodeValid) alert('Please enter a valid 6-digit PIN code.');
                    else alert('Please fill in all required fields.');
                  }
                }}
                className="mt-6 w-full py-3.5 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-all hover:shadow-lg hover:shadow-amber-200"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-500" /> Payment Method
              </h2>

              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                {[
                  { key: 'card', label: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
                  { key: 'upi', label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
                  { key: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when delivered' },
                ].map(({ key, label, icon: Icon, desc }) => (
                  <button
                    key={key}
                    onClick={() => setPayment({ ...payment, method: key })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      payment.method === key
                        ? 'border-amber-500 bg-amber-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${payment.method === key ? 'text-amber-600' : 'text-gray-400'}`} />
                    <p className={`text-sm font-semibold ${payment.method === key ? 'text-amber-700' : 'text-gray-700'}`}>{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>

              {payment.method === 'card' && (
                <div className="space-y-4 p-5 bg-gray-50 rounded-xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={payment.card_number}
                        onChange={(e) => setPayment({ ...payment, card_number: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                      />
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Cardholder Name</label>
                    <input
                      type="text"
                      value={payment.name}
                      onChange={(e) => setPayment({ ...payment, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                      <input
                        type="text"
                        value={payment.expiry}
                        onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                      <input
                        type="password"
                        value={payment.cvv}
                        onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                        placeholder="***"
                        maxLength={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {payment.method === 'upi' && (
                <div className="p-5 bg-gray-50 rounded-xl">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">UPI ID</label>
                  <input
                    type="text"
                    value={payment.upi_id}
                    onChange={(e) => setPayment({ ...payment, upi_id: e.target.value })}
                    placeholder="yourname@upi"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white"
                  />
                  <p className="text-xs text-gray-500 mt-2">You will receive a payment request on your UPI app</p>
                </div>
              )}

              {payment.method === 'cod' && (
                <div className="p-5 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-start gap-3">
                    <Banknote className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Cash on Delivery</p>
                      <p className="text-xs text-amber-700 mt-1">Pay when your order is delivered. A COD fee of ₹40 may apply.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-1" /> Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 py-3.5 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 disabled:bg-gray-300 transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-200"
                >
                  <Shield className="w-4 h-4" /> {loading ? 'Processing...' : `Pay ${formatPrice(Math.round(grandTotal))}`}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Placed Successfully!</h2>
              <p className="text-gray-500 mb-1">Thank you for your purchase</p>
              <p className="text-sm text-gray-400 mb-6">Order ID: #{orderId.slice(0, 8)}</p>
              <div className="bg-gray-50 rounded-xl p-5 mb-6 max-w-sm mx-auto">
                <div className="flex items-center gap-3 justify-center mb-3">
                  <Package className="w-5 h-5 text-amber-500" />
                  <span className="font-semibold text-gray-800">Estimated Delivery</span>
                </div>
                <p className="text-lg font-bold text-slate-800">3-5 Business Days</p>
              </div>
              <div className="flex justify-center gap-3">
                <Link
                  to="/orders"
                  className="px-6 py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-all hover:shadow-lg hover:shadow-amber-200"
                >
                  Track Your Order
                </Link>
                <Link
                  to="/products"
                  className="px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        {step < 3 && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
              <h3 className="font-bold text-slate-800 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-52 overflow-y-auto">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3 text-sm">
                    <div className="relative shrink-0">
                      <img
                        src={product.image_url || IMAGES.fallbackSmall}
                        alt=""
                        className="w-12 h-12 object-cover rounded"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        onError={(e) => { (e.target as HTMLImageElement).src = IMAGES.fallbackSmall; }}
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-700 truncate text-xs">{product.name}</p>
                    </div>
                    <span className="font-medium text-sm shrink-0">{formatPrice(product.price * quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">{formatPrice(totalPrice)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">GST (18%)</span><span>{formatPrice(Math.round(tax))}</span></div>
                <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-slate-800">
                  <span>Total</span><span className="text-lg">{formatPrice(Math.round(grandTotal))}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <Lock className="w-3.5 h-3.5 text-green-500" />
                <span>Secure 256-bit SSL encrypted checkout</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
