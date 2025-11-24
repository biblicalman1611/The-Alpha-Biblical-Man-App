import React, { useState } from 'react';
import { registerUser, loginUser, resetPassword } from '../services/authService';

interface LoginModalProps {
  onLogin: (user: any) => void;
  onClose: () => void;
}

type ModalView = 'login' | 'signup' | 'reset';

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  const [view, setView] = useState<ModalView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const user = await loginUser(email, password);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const user = await registerUser(email, password, name);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setResetSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError(null);
    setResetSuccess(false);
  };

  const switchView = (newView: ModalView) => {
    clearForm();
    setView(newView);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/80 backdrop-blur-sm p-4 fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* LOGIN VIEW */}
        {view === 'login' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif text-stone-900">Welcome Back</h2>
              <p className="text-stone-500 mt-2 text-sm">Sign in to access the inner circle</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  className={`w-full p-3 border rounded focus:ring-2 outline-none transition-all ${
                    error
                      ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                      : 'border-stone-300 focus:ring-stone-900 focus:border-stone-900'
                  }`}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  className={`w-full p-3 border rounded focus:ring-2 outline-none transition-all ${
                    error
                      ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                      : 'border-stone-300 focus:ring-stone-900 focus:border-stone-900'
                  }`}
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 font-medium animate-fadeIn">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-stone-900 text-white font-medium rounded hover:bg-stone-800 transition-colors disabled:opacity-70 flex justify-center items-center"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <button
                onClick={() => switchView('reset')}
                className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
              >
                Forgot your password?
              </button>

              <div className="pt-4 border-t border-stone-100">
                <p className="text-sm text-stone-600 mb-2">Don't have an account?</p>
                <button
                  onClick={() => switchView('signup')}
                  className="text-sm font-bold text-brand-gold hover:text-stone-900 transition-colors"
                >
                  Create Account →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SIGNUP VIEW */}
        {view === 'signup' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif text-stone-900">Join The Brotherhood</h2>
              <p className="text-stone-500 mt-2 text-sm">Create your account to begin your journey</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(null);
                  }}
                  className={`w-full p-3 border rounded focus:ring-2 outline-none transition-all ${
                    error
                      ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                      : 'border-stone-300 focus:ring-stone-900 focus:border-stone-900'
                  }`}
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  className={`w-full p-3 border rounded focus:ring-2 outline-none transition-all ${
                    error
                      ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                      : 'border-stone-300 focus:ring-stone-900 focus:border-stone-900'
                  }`}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  className={`w-full p-3 border rounded focus:ring-2 outline-none transition-all ${
                    error
                      ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                      : 'border-stone-300 focus:ring-stone-900 focus:border-stone-900'
                  }`}
                  placeholder="••••••••"
                  minLength={6}
                />
                <p className="mt-1 text-xs text-stone-400">Minimum 6 characters</p>
              </div>

              {error && (
                <p className="text-xs text-red-600 font-medium animate-fadeIn">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-stone-900 text-white font-medium rounded hover:bg-stone-800 transition-colors disabled:opacity-70 flex justify-center items-center"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-stone-600">
                Already have an account?{' '}
                <button
                  onClick={() => switchView('login')}
                  className="font-bold text-brand-gold hover:text-stone-900 transition-colors"
                >
                  Sign In
                </button>
              </p>
            </div>

            <p className="mt-4 text-center text-[10px] text-stone-300">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        )}

        {/* RESET PASSWORD VIEW */}
        {view === 'reset' && (
          <div className="animate-fadeIn">
            {!resetSuccess ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-serif text-stone-900">Reset Password</h2>
                  <p className="text-stone-600 mt-2 text-sm">
                    Enter your email and we'll send you a link to reset your password
                  </p>
                </div>

                <form onSubmit={handleReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                      }}
                      className={`w-full p-3 border rounded focus:ring-2 outline-none transition-all ${
                        error
                          ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
                          : 'border-stone-300 focus:ring-brand-gold focus:border-brand-gold'
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-red-600 font-medium animate-fadeIn">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-brand-gold text-stone-900 font-bold rounded hover:bg-yellow-500 transition-colors disabled:opacity-70 flex justify-center items-center"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin"></span>
                    ) : "Send Reset Link"}
                  </button>
                </form>

                <button
                  onClick={() => switchView('login')}
                  className="w-full mt-4 text-xs text-stone-400 hover:text-stone-900"
                >
                  Back to sign in
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-stone-900 mb-2">Check Your Email</h3>
                <p className="text-stone-600 mb-6 text-sm">
                  We've sent a password reset link to <span className="font-bold text-stone-900">{email}</span>
                </p>
                <div className="bg-stone-50 p-4 rounded border border-stone-200 mb-6">
                  <p className="text-xs text-stone-500">
                    The link will expire in 1 hour. Please check your spam folder if you don't see it.
                  </p>
                </div>
                <button
                  onClick={() => switchView('login')}
                  className="w-full py-3 border border-stone-300 text-stone-900 font-medium rounded hover:bg-stone-50 transition-colors"
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
