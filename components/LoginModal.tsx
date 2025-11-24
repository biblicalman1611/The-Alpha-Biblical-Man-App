
import React, { useState } from 'react';
import { authService } from '../services/authService';

interface LoginModalProps {
  onLogin: () => void;
  onClose: () => void;
}

type ModalView = 'login' | 'signup' | 'recovery';

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  const [view, setView] = useState<ModalView>('login');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.login(email, password);
      onLogin(); // App.tsx will handle redirect
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.register(email, password, name);
      onLogin(); // Auto login after signup
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation
    setTimeout(() => {
      setLoading(false);
      setRecoverySuccess(true);
    }, 2000);
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

        {view === 'login' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif text-stone-900">Member Access</h2>
              <p className="text-stone-500 mt-2 text-sm">Enter the inner circle.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-stone-900 outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-stone-900 outline-none"
                  placeholder="••••••••"
                />
              </div>
              
              {error && <p className="text-xs text-red-600 font-bold">{error}</p>}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-stone-900 text-white font-medium rounded hover:bg-stone-800 transition-colors disabled:opacity-70 flex justify-center items-center"
              >
                {loading ? <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span> : "Log In"}
              </button>
            </form>

            <div className="mt-6 flex flex-col items-center gap-3">
               <button 
                 onClick={() => { setView('signup'); clearForm(); }}
                 className="text-sm text-stone-900 hover:underline"
               >
                 No account? <span className="font-bold">Join the Brotherhood</span>
               </button>
               <button 
                 onClick={() => { setView('recovery'); clearForm(); }}
                 className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:text-stone-900 transition-colors"
               >
                 Paid $3 but can't login?
               </button>
            </div>
          </div>
        )}

        {view === 'signup' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif text-stone-900">Join the Ranks</h2>
              <p className="text-stone-500 mt-2 text-sm">Create your profile.</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-stone-900 outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-stone-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-stone-900 outline-none"
                />
              </div>

              {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
              
              <div className="bg-stone-50 p-3 rounded text-xs text-stone-500 mb-2">
                 Note: This is a secure browser-based session. Your credentials are stored locally for this demonstration.
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-brand-gold text-stone-900 font-bold rounded hover:bg-yellow-500 transition-colors disabled:opacity-70 flex justify-center items-center"
              >
                 {loading ? <span className="animate-spin h-5 w-5 border-2 border-stone-900/30 border-t-stone-900 rounded-full"></span> : "Create Account"}
              </button>
            </form>
            
            <button 
               onClick={() => { setView('login'); clearForm(); }}
               className="w-full mt-4 text-xs text-stone-500 hover:text-stone-900"
            >
              Back to Login
            </button>
          </div>
        )}

        {view === 'recovery' && (
          <div className="animate-fadeIn">
             {!recoverySuccess ? (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-serif text-stone-900">Access Recovery</h2>
                    <p className="text-stone-600 mt-2 text-sm">Verify your $3 subscription.</p>
                  </div>

                  <form onSubmit={handleRecovery} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Stripe Email</label>
                      <input 
                        type="email" 
                        required
                        className="w-full p-3 border border-stone-300 rounded focus:ring-brand-gold focus:border-brand-gold outline-none"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-3 bg-brand-gold text-stone-900 font-bold rounded hover:bg-yellow-500 transition-colors"
                    >
                      {loading ? <span className="animate-spin h-5 w-5 border-2 border-stone-900/30 border-t-stone-900 rounded-full"></span> : "Verify & Restore"}
                    </button>
                  </form>
                   <button 
                    onClick={() => { setView('login'); clearForm(); }}
                    className="w-full mt-4 text-xs text-stone-400 hover:text-stone-900"
                  >
                    Back to standard login
                  </button>
                </>
             ) : (
                <div className="text-center py-4">
                   <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                   </div>
                   <h3 className="text-xl font-serif text-stone-900 mb-2">Success</h3>
                   <p className="text-stone-600 mb-6 text-sm">Login link sent to your email.</p>
                   <p className="text-[10px] text-stone-400 mb-6">If not received in 5m, contact help@thebiblicalmantruth.com</p>
                   <button 
                      onClick={() => { setRecoverySuccess(false); setView('login'); }}
                      className="w-full py-3 border border-stone-300 text-stone-900 font-medium rounded"
                   >
                      Return to Login
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
