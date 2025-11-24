import React, { useState } from 'react';

interface LoginModalProps {
  onLogin: () => void;
  onClose: () => void;
}

type ModalView = 'login' | 'recovery';

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  const [view, setView] = useState<ModalView>('login');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!validateEmail(email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    // Simulate network delay for login
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!validateEmail(email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    // Simulate checking Stripe database
    setTimeout(() => {
      setLoading(false);
      setRecoverySuccess(true);
      // In a real app, this would trigger a backend resend of the magic link
    }, 2000);
  };

  // clear error when typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (validationError) setValidationError(null);
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
              <p className="text-stone-500 mt-2 text-sm">Enter your email to access the inner circle.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full p-3 border rounded focus:ring-2 outline-none transition-all ${
                    validationError 
                      ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                      : 'border-stone-300 focus:ring-stone-900 focus:border-stone-900'
                  }`}
                  placeholder="you@example.com"
                />
                {validationError && (
                  <p className="mt-1 text-xs text-red-600 font-medium animate-fadeIn">{validationError}</p>
                )}
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-stone-900 text-white font-medium rounded hover:bg-stone-800 transition-colors disabled:opacity-70 flex justify-center items-center"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : "Enter"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-stone-100 text-center">
               <button 
                 onClick={() => {
                   setView('recovery');
                   setValidationError(null);
                   setEmail('');
                 }}
                 className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:text-stone-900 transition-colors"
               >
                 Paid $3 but can't login?
               </button>
            </div>
            
            <p className="mt-4 text-center text-[10px] text-stone-300">
              Secure login via email link.
            </p>
          </div>
        )}

        {view === 'recovery' && (
          <div className="animate-fadeIn">
             {!recoverySuccess ? (
                <>
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-serif text-stone-900">Access Recovery</h2>
                    <p className="text-stone-600 mt-2 text-sm leading-relaxed">
                      We migrated our system. If you have an active $3 subscription but lost access, enter your email below to verify your account.
                    </p>
                  </div>

                  <form onSubmit={handleRecovery} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Stripe Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={handleEmailChange}
                        className={`w-full p-3 border rounded focus:ring-2 outline-none transition-all ${
                          validationError 
                            ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                            : 'border-stone-300 focus:ring-brand-gold focus:border-brand-gold'
                        }`}
                        placeholder="email@used-for-payment.com"
                      />
                       {validationError && (
                        <p className="mt-1 text-xs text-red-600 font-medium animate-fadeIn">{validationError}</p>
                      )}
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-3 bg-brand-gold text-stone-900 font-bold rounded hover:bg-yellow-500 transition-colors disabled:opacity-70 flex justify-center items-center"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin"></span>
                      ) : "Verify & Restore Access"}
                    </button>
                  </form>

                  <button 
                    onClick={() => {
                      setView('login');
                      setValidationError(null);
                      setEmail('');
                    }}
                    className="w-full mt-4 text-xs text-stone-400 hover:text-stone-900"
                  >
                    Back to standard login
                  </button>
                </>
             ) : (
                <div className="text-center py-4">
                   <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                   </div>
                   <h3 className="text-xl font-serif text-stone-900 mb-2">Subscription Found</h3>
                   <p className="text-stone-600 mb-6 text-sm">
                     We successfully located your payment record for <span className="font-bold text-stone-900">{email}</span>.
                   </p>
                   <div className="bg-stone-50 p-4 rounded border border-stone-200 mb-6">
                     <p className="text-xs text-stone-500">
                       An instant login link has been sent to your inbox. Please check your spam folder.
                     </p>
                   </div>
                   <button 
                      onClick={() => { setRecoverySuccess(false); setView('login'); setEmail(''); setValidationError(null); }}
                      className="w-full py-3 border border-stone-300 text-stone-900 font-medium rounded hover:bg-stone-50 transition-colors"
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