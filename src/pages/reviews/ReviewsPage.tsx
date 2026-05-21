import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, MessageSquare, User, Calendar, CheckCircle, ChevronRight, Send } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Review {
  id?: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  image?: string;
  created_at: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    name: "Rajesh Kumar",
    role: "Construction Contractor",
    text: "Ace Hardware has completely changed how I source materials. The real-time tracking and quality assurance are unmatched in the industry.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=rajesh",
    created_at: new Date().toISOString()
  },
  {
    name: "Anjali Sharma",
    role: "Interior Designer",
    text: "The product variety is amazing. I can find everything from premium paints to heavy-duty tools in one place. Their delivery is always on time!",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=anjali",
    created_at: new Date().toISOString()
  },
  {
    name: "Vikram Singh",
    role: "Homeowner",
    text: "Easy to use website and great customer support. I ordered materials for my home renovation and the experience was seamless.",
    rating: 4,
    image: "https://i.pravatar.cc/150?u=vikram",
    created_at: new Date().toISOString()
  },
  {
    name: "Priya Patel",
    role: "Architect",
    text: "As an architect, I appreciate the detailed technical specifications provided for every product. It makes my job much easier.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=priya",
    created_at: new Date().toISOString()
  }
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: 'Customer',
    text: '',
    rating: 5
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, 'reviews'), orderBy('created_at', 'desc'), limit(20));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
        
        if (data.length > 0) {
          setReviews(data);
        } else {
          setReviews(MOCK_REVIEWS);
        }
      } catch (err) {
        setReviews(MOCK_REVIEWS);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        ...form,
        created_at: new Date().toISOString(),
        image: `https://i.pravatar.cc/150?u=${encodeURIComponent(form.name)}`
      });
      setSuccess(true);
      setForm({ name: '', role: 'Customer', text: '', rating: 5 });
      setTimeout(() => setSuccess(false), 3000);
      setShowForm(false);
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Check your database rules.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-amber-600 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-800 font-medium">Customer Reviews</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">Customer Reviews</h1>
          <p className="text-gray-500 max-w-xl">
            Hear from our community of homeowners, contractors, and professionals who trust Ace Hardware for their projects.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all hover:shadow-lg hover:shadow-amber-200"
        >
          <MessageSquare className="w-5 h-5" /> Write a Review
        </button>
      </div>

      {/* Write a Review Form */}
      {showForm && (
        <div className="mb-12 bg-white rounded-2xl border-2 border-amber-100 p-8 shadow-xl shadow-amber-500/5 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Share Your Experience</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-amber-500 transition-all outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Role</label>
                <input
                  type="text"
                  required
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-amber-500 transition-all outline-none"
                  placeholder="e.g. Homeowner, Architect"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm({ ...form, rating: star })}
                    className="p-1"
                  >
                    <Star className={`w-8 h-8 ${star <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Review Content</label>
              <textarea
                required
                rows={4}
                value={form.text}
                onChange={e => setForm({ ...form, text: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-amber-500 transition-all outline-none resize-none"
                placeholder="How was your experience with our tools and service?"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : <><Send className="w-5 h-5" /> Submit Review</>}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-8 py-4 border-2 border-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {success && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
          <CheckCircle className="w-5 h-5" />
          <p className="font-medium">Thank you! Your review has been submitted successfully.</p>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div 
              key={review.id || i} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-amber-500/5 group-hover:text-amber-500/10 transition-colors" />
              
              <div className="flex items-center gap-1 mb-5">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed italic text-lg">
                "{review.text}"
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-100 shadow-sm shrink-0">
                  <img 
                    src={review.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=random`} 
                    alt={review.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 truncate">{review.name}</h4>
                  <p className="text-gray-400 text-sm flex items-center gap-2">
                    {review.role}
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="text-xs">{new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Section */}
      <div className="mt-20 bg-slate-800 rounded-3xl p-10 md:p-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-10">Our Community Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Happy Customers', value: '15k+' },
            { label: 'Products Delivered', value: '50k+' },
            { label: 'Average Rating', value: '4.9/5' },
            { label: 'Service Areas', value: '120+' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-4xl font-bold text-amber-500 mb-2">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
