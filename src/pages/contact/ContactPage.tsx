import { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle, ChevronRight } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'contact_messages'), {
        ...form,
        created_at: new Date().toISOString()
      });
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-amber-600 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-800 font-medium">Contact Us</span>
      </nav>

      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">Get In Touch</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Have questions about our products or need a custom quote? We'd love to hear from you.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contact info cards */}
        <div className="space-y-3">
          {[
            { icon: Phone, title: 'Call Us', lines: ['8143247090'], color: 'bg-blue-50 text-blue-600' },
            { icon: Mail, title: 'Email Us', lines: ['chirrakrishna0246@gmail.com', 'info@acehardware.com'], color: 'bg-amber-50 text-amber-600' },
            { icon: MapPin, title: 'Visit Our Store', lines: ['3-4, Naimnagar', 'Warangal, Telangana, 506002'], color: 'bg-green-50 text-green-600' },
            { icon: Clock, title: 'Store Hours', lines: ['Mon-Sat: 8AM - 9PM', 'Sunday: 9AM - 6PM'], color: 'bg-purple-50 text-purple-600' },
          ].map(({ icon: Icon, title, lines, color }) => (
            <div key={title} className="flex gap-4 p-5 bg-white rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-sm transition-all">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
                {lines.map((line, i) => (
                  <p key={i} className="text-sm text-gray-500">{line}</p>
                ))}
              </div>
            </div>
          ))}

          {/* WhatsApp */}
          <a
            href="https://wa.me/918143247090"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-5 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 hover:shadow-sm transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-green-800 text-sm">WhatsApp</h3>
              <p className="text-sm text-green-600">Chat with us on WhatsApp</p>
            </div>
          </a>
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-8">
          {success ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Message Sent Successfully!</h2>
              <p className="text-gray-500 mb-6">We'll get back to you within 24 hours</p>
              <button
                onClick={() => setSuccess(false)}
                className="text-amber-600 font-bold text-sm hover:text-amber-700 transition"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Send us a Message</h2>
              <p className="text-sm text-gray-500 mb-4">Fill out the form below and we'll respond promptly</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 disabled:bg-gray-300 transition-all hover:shadow-lg hover:shadow-amber-200"
              >
                <Send className="w-4 h-4" /> {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Map placeholder */}
      <div className="mt-10 bg-gray-100 rounded-xl overflow-hidden h-64 flex items-center justify-center border border-gray-200">
        <div className="text-center">
          <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 font-medium">3-4, Naimnagar, Warangal, Telangana 506002</p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 text-sm font-bold hover:underline mt-1.5 inline-block"
          >
            View on Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
