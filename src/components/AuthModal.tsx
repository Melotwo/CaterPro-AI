import React, { useState } from 'react';
import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { automationService } from './automationService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [founderCode, setFounderCode] = useState('');
  const [showFounderLogin, setShowFounderLogin] = useState(false);

  if (!isOpen) return null;

  const handleFounderLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (founderCode === 'CHEF2026') { // Example founder code
      localStorage.setItem('caterpro_is_founder', 'true');
      window.location.reload(); // Reload to apply authService changes
    } else {
      setError('Invalid Founder Code');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (!auth) {
        setError('Authentication service is not configured. Please check your environment variables.');
        setLoading(false);
        return;
      }
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Trigger automation webhook for new signup
        automationService.triggerSignupWebhook({
          email: userCredential.user.email || email,
          name: name || 'New Chef',
          businessType: 'Chef', // Default for signup
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    try {
      if (!auth) {
        setError('Authentication service is not configured.');
        setLoading(false);
        return;
      }
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#121212] bg-opacity-90">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border-2 border-slate-200 overflow-hidden animate-slide-in">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl tracking-tight">
              {showFounderLogin ? (
                <span className="font-black text-slate-900 dark:text-white">Founder Access</span>
              ) : (
                isLogin ? (
                  <span className="font-black text-slate-900 dark:text-white">Welcome Back</span>
                ) : (
                  <span className="text-slate-900 dark:text-white">
                    Join <span className="font-bold">CaterPro</span><span className="font-medium text-[#10b981]">Ai</span>
                  </span>
                )
              )}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <span className="text-xl text-slate-400">✕</span>
            </button>
          </div>

          {showFounderLogin ? (
            <form onSubmit={handleFounderLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Founder Access Code</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔒</span>
                  <input 
                    type="password" 
                    required
                    value={founderCode}
                    onChange={(e) => setFounderCode(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white font-bold"
                    placeholder="Enter Code"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
              <button 
                type="submit" 
                className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <span className="text-xl">✨</span>
                Unlock Founder Mode
              </button>
              <button 
                type="button"
                onClick={() => setShowFounderLogin(false)}
                className="w-full text-center text-sm font-bold text-slate-500 hover:text-primary-500 transition-colors"
              >
                Back to Standard Login
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Name</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">👤</span>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white font-bold"
                        placeholder="Chef John Doe"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">✉️</span>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white font-bold"
                      placeholder="chef@caterproai.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Password</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔒</span>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-primary-500 outline-none transition-all dark:text-white font-bold"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
                {message && <p className="text-emerald-500 text-sm font-bold">{message}</p>}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  {loading ? <span className="animate-spin text-xl">⏳</span> : (isLogin ? <span className="text-xl">🔑</span> : <span className="text-xl">➕</span>)}
                  {isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full text-center text-sm font-bold text-slate-500 hover:text-primary-500 transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
                {isLogin && (
                  <button 
                    onClick={handleResetPassword}
                    className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Forgot your password?
                  </button>
                )}
                <button 
                  onClick={() => setShowFounderLogin(true)}
                  className="w-full text-center text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-amber-500 transition-colors pt-4"
                >
                  Founder Access
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
