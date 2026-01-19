import React, { useState } from 'react';
import { ChevronDown, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface LoginProps {
  onLogin: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, lang, setLang }) => {
  // Safe access to translations with fallback to FR if current lang is invalid
  const t = TRANSLATIONS[lang] || TRANSLATIONS[Language.FR];
  
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Hardcoded credentials
  const VALID_ID = '19384726';
  const VALID_PASS = '5580A528';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setIsLoading(true);

    // Simulate API network delay
    setTimeout(() => {
        if (userId === VALID_ID && password === VALID_PASS) {
          onLogin();
        } else {
          setError(true);
          setIsLoading(false);
        }
    }, 2000);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setOtpSent(true);
    setTimeout(() => setOtpSent(false), 5000); // Hide message after 5 seconds
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (error) setError(false);
  };

  // If translations are somehow missing completely, render minimal fallback
  if (!t) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Bar */}
      <div className="bg-[#004b6b] text-white px-8 py-6 flex justify-between items-center shadow-md z-20">
        <img 
            src="https://i.imgur.com/eAwClBc.png" 
            alt="Ecobank" 
            className="h-12 md:h-16 brightness-0 invert" 
        />
        <div className="relative">
            <button 
                onClick={() => !isLoading && setShowLangMenu(!showLangMenu)}
                disabled={isLoading}
                className={`flex items-center gap-2 text-sm transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:text-teal-200'}`}
            >
                <span>{t.currentLangName}</span>
                <ChevronDown size={14} />
            </button>

            {showLangMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white shadow-xl rounded-lg py-2 w-48 z-50 text-slate-900 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                    <button 
                        onClick={() => { setLang(Language.EN); setShowLangMenu(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors flex items-center justify-between ${lang === Language.EN ? 'font-bold text-teal-600' : ''}`}
                    >
                        English (Anglais)
                        {lang === Language.EN && <div className="w-2 h-2 rounded-full bg-teal-600"></div>}
                    </button>
                    <button 
                        onClick={() => { setLang(Language.FR); setShowLangMenu(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors flex items-center justify-between ${lang === Language.FR ? 'font-bold text-teal-600' : ''}`}
                    >
                        Français (French)
                        {lang === Language.FR && <div className="w-2 h-2 rounded-full bg-teal-600"></div>}
                    </button>
                </div>
            )}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Left Side - Form */}
        <div className="w-full md:w-[45%] bg-white flex flex-col justify-center px-8 md:px-24 py-12 z-10">
            <div className="max-w-md w-full mx-auto">
                <h1 className="text-[3.5rem] font-light text-[#444] mb-12 leading-none">{t.login}</h1>
                
                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="group">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">{t.userId}</label>
                        <input 
                            type="text" 
                            value={userId}
                            onChange={(e) => handleInputChange(setUserId, e.target.value)}
                            className={`w-full border-b py-2 text-lg text-slate-800 outline-none transition-colors rounded-none bg-transparent ${error ? 'border-red-500' : 'border-slate-300 focus:border-[#008ac9]'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            autoFocus
                            disabled={isLoading}
                        />
                    </div>

                    <div className="group">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">{t.password}</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => handleInputChange(setPassword, e.target.value)}
                            className={`w-full border-b py-2 text-lg text-slate-800 outline-none transition-colors rounded-none bg-transparent ${error ? 'border-red-500' : 'border-slate-300 focus:border-[#008ac9]'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={18} />
                            <span className="text-sm font-medium">
                                {lang === Language.FR ? 'Identifiant ou mot de passe incorrect.' : 'Invalid User ID or Password.'}
                            </span>
                        </div>
                    )}
                    
                    {otpSent && (
                        <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg animate-in fade-in slide-in-from-top-2 border border-green-100">
                            <CheckCircle2 size={18} />
                            <span className="text-sm font-medium">
                                {lang === Language.FR 
                                    ? 'Un code OTP a été envoyé à votre numéro pour réinitialiser.' 
                                    : 'An OTP has been sent to your number for reset.'}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <button 
                            type="button"
                            onClick={handleForgotPassword}
                            className={`text-[#00aeb5] text-sm hover:underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            {t.forgotPassword}
                        </button>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-[#007ba8] hover:bg-[#006a91] text-white font-medium py-4 text-sm tracking-widest uppercase transition-colors shadow-sm flex items-center justify-center gap-3 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>{lang === Language.FR ? 'Connexion...' : 'Connecting...'}</span>
                            </>
                        ) : (
                            t.continue
                        )}
                    </button>
                </form>
            </div>
        </div>

        {/* Right Side - Image Only */}
        <div className="hidden md:block md:w-[55%] relative overflow-hidden bg-slate-800">
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-90"
                style={{ 
                    backgroundImage: "url('https://i.imgur.com/kkgFm1d.png')", 
                }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#008ac9]/40 to-transparent mix-blend-multiply"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#00364d] text-white px-6 py-4 flex flex-col md:flex-row justify-between items-center text-xs z-20">
        <div className="flex gap-4 mb-2 md:mb-0">
            <a 
                href="https://omniplus.ecobank.com/GCPCW/static/html/privacy_policy_en_us.html" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-teal-200"
            >
                {t.privacy}
            </a>
            <span>|</span>
            <a 
                href="https://omniplus.ecobank.com/GCPCW/static/html/security_information_en_us.html" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-teal-200"
            >
                {t.security}
            </a>
            <span>|</span>
            <a 
                href="https://omniplus.ecobank.com/GCPCW/static/html/term_condition_en_us.html" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-teal-200"
            >
                {t.agreement}
            </a>
        </div>
        <div className="opacity-80">
            ©2024 Ecobank. {t.rights}
        </div>
      </div>
    </div>
  );
};

export default Login;