import { Link } from 'react-router-dom';
import { Wrench, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, CreditCard, Truck, Shield, RotateCcw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-gray-300">
      {/* Trust bar */}
      <div className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
            { icon: Shield, title: 'Secure Payment', desc: '256-bit SSL encryption' },
            { icon: RotateCcw, title: 'Easy Returns', desc: '7-day return policy' },
            { icon: CreditCard, title: 'Multiple Payment', desc: 'Card, UPI, COD' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="font-extrabold text-white text-lg block leading-none">Ace Hardware</span>
                <span className="text-[10px] text-gray-400 tracking-widest uppercase">and Tools</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Your one-stop shop for quality hardware, construction materials, and tools. Serving builders and homeowners across Telangana since 1995.
            </p>
            <div className="flex gap-2">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center hover:bg-amber-500 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'All Products' },
                { to: '/products?category=paints', label: 'Paints & Finishes' },
                { to: '/products?category=cement', label: 'Cement & Concrete' },
                { to: '/products?category=iron-materials', label: 'Iron & Steel' },
                { to: '/products?category=hardware-tools', label: 'Power Tools' },
                { to: '/products?category=electrical-items', label: 'Electrical' },
                { to: '/products?category=plumbing-products', label: 'Plumbing' },
              ].map((link) => (
                <li key={link.to + link.label}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Customer Service</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/contact', label: 'Contact Us' },
                { to: '/reviews', label: 'Customer Reviews' },
                { to: '/orders', label: 'Track Your Order' },
                { to: '/', label: 'Shipping Policy' },
                { to: '/', label: 'Returns & Refunds' },
                { to: '/', label: 'FAQ' },
                { to: '/', label: 'Privacy Policy' },
                { to: '/', label: 'Terms of Service' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" />
                <span className="text-sm text-gray-400">3-4, Naimnagar, Warangal, Telangana, 506002</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-sm text-gray-400">8143247090</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-sm text-gray-400">
                  <p>chirrakrishna0246@gmail.com</p>
                  <p className="text-xs text-gray-500">info@acehardware.com</p>
                </div>
              </li>
            </ul>
            <div className="mt-5 p-4 bg-slate-700 rounded-xl">
              <p className="text-xs text-gray-400 mb-1.5 font-semibold uppercase tracking-wider">Store Hours</p>
              <p className="text-sm text-gray-300">Mon - Sat: 8:00 AM - 9:00 PM</p>
              <p className="text-sm text-gray-300">Sunday: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Ace Hardware and Tools. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link to="/" className="hover:text-amber-400 transition">Terms</Link>
            <Link to="/" className="hover:text-amber-400 transition">Privacy</Link>
            <Link to="/" className="hover:text-amber-400 transition">Cookies</Link>
            <span>Visa</span>
            <span>Mastercard</span>
            <span>UPI</span>
            <span>RuPay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
