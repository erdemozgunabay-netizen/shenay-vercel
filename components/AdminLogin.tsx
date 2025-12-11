import React, { useState, useEffect } from 'react';
import { Lock, AlertCircle, HelpCircle, X, Loader2, Mail } from 'lucide-react';
import { TranslationStructure } from '../types';
import { authService } from '../services/authService';

interface AdminLoginProps {
  t: TranslationStructure['admin'];
  onLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ t, onLogin }) => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Security States
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer(prev => {
          if (prev <= 1) {
             setIsLocked(false);
             setAttempts(0);
             return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimer]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);
    setError(null);

    try {
      // Firebase Auth ile giriş
      await authService.login(email, password);
      onLogin();
    } catch (err: any) {
      console.error(err);
      setError("Hatalı email veya şifre.");
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 5) { // 5 hatalı deneme
        setIsLocked(true);
        setLockTimer(60); // 60 saniye kilitle
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] flex items-center justify-center bg-[#F8F9FE] p-4 relative">
      
      {/* Recovery Modal */}
      {showRecovery && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
           <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl relative">
              <button 
                onClick={() => setShowRecovery(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              <div className="text-center">
                 <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle size={24} />
                 </div>
                 <h3 className="text-lg font-bold font-serif mb-2">{t.recoveryTitle}</h3>
                 <p className="text-sm text-gray-500 mb-6">{t.recoveryDesc}</p>
                 <a href="mailto:support@shenayileri.com" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm block w-full hover:bg-blue-700 transition">
                    Email Support
                 </a>
              </div>
           </div>
        </div>
      )}

      <div className={`bg-white p-10 rounded-3xl shadow-xl border border-white/50 max-w-sm w-full transition-transform ${error ? 'animate-shake' : ''}`}>
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-brand-dark text-brand-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            {isLocked ? <AlertCircle size={36} className="text-red-500" /> : <Lock size={36} strokeWidth={1.5} />}
          </div>
          <h2 className="text-3xl font-serif text-gray-800">{t.loginTitle}</h2>
          <p className="text-xs text-gray-400 mt-2">Firebase Auth</p>
        </div>

        {isLocked ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100 mb-4 animate-pulse">
            <h4 className="font-bold text-sm mb-1">{t.lockedMessage}</h4>
            <p className="text-xs font-mono">Try again in {lockTimer}s</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs uppercase font-bold text-gray-400 mb-2 tracking-wide">Email</label>
              <div className="relative">
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 pl-10 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-brand-gold focus:bg-white transition"
                    required
                    placeholder="admin@shenayileri.com"
                />
                <Mail className="absolute left-3 top-4 text-gray-400" size={18} />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-gray-400 mb-2 tracking-wide">{t.password}</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-brand-gold focus:bg-white transition"
                required
              />
            </div>

            {error && (
               <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg border border-red-100">
                 {error}
               </p>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold hover:shadow-xl hover:-translate-y-1 transition duration-300 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />} {t.loginBtn}
            </button>
            
            <button 
              type="button"
              onClick={() => setShowRecovery(true)}
              className="w-full text-center text-xs text-gray-400 hover:text-brand-gold transition"
            >
              {t.forgotPassword}
            </button>
          </form>
        )}
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};