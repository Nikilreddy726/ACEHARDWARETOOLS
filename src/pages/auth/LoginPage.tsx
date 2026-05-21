import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Wrench } from 'lucide-react';

export default function LoginPage() {
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await signIn('demo@example.com', 'demo123');
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800">Ace Hardware</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Please select your login type</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => { setLoginType('user'); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${loginType === 'user' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            User Login
          </button>
          <button
            onClick={() => { setLoginType('admin'); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${loginType === 'admin' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Admin Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8" autoComplete="off">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {loginType === 'user' ? 'Email Address' : 'Username'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  placeholder={loginType === 'user' ? 'you@example.com' : 'Enter ADMIN'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-amber-500 focus:ring-amber-500" />
              Keep me logged in
            </label>
            <Link to="/forgot-password" title={loginType === 'admin' ? 'Reset Admin Password' : 'Reset User Password'} className="text-sm text-amber-600 hover:text-amber-700 font-medium">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 disabled:bg-gray-300 transition mb-4 shadow-md shadow-amber-100"
          >
            {loading ? 'Processing...' : `Login as ${loginType === 'user' ? 'User' : 'Admin'}`}
          </button>

          {loginType === 'user' && (
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition flex items-center justify-center gap-2"
            >
              <div className="w-5 h-5 bg-amber-500 rounded flex items-center justify-center">
                <Wrench className="w-3 h-3 text-white" />
              </div>
              One-Click Demo User Login
            </button>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            {loginType === 'user' ? (
              <>Don't have an account? <Link to="/register" className="text-amber-600 font-medium hover:text-amber-700">Create one</Link></>
            ) : (
              <span className="text-xs italic">Restricted area for authorized personnel only</span>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
