import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export const GoogleSignInModal: React.FC = () => {
  const { isSignInModalOpen, closeSignInModal, signInWithGoogle, signInWithGoogleCredential, signInReason, isLoading } = useAuth();
  const [emailInput, setEmailInput] = useState('demo.developer@gmail.com');
  const [nameInput, setNameInput] = useState('Alex Developer');
  const [gisError, setGisError] = useState<string | null>(null);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSignInModalOpen) return;

    // Load Google Identity Services script dynamically if not present
    const loadGis = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '41533331-nillgoiujcvit7fkknj4ks7n0ms3tcd8.apps.googleusercontent.com';

      if (window.google?.accounts?.id && googleButtonRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response: any) => {
              if (response.credential) {
                try {
                  await signInWithGoogleCredential(response.credential);
                } catch (err: any) {
                  setGisError(err.message || 'Token verification failed.');
                }
              }
            }
          });

          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: 320,
            text: 'continue_with',
            shape: 'pill'
          });
        } catch (e: any) {
          console.warn('[GIS Init Notice]', e);
        }
      }
    };

    if (!window.google?.accounts) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = loadGis;
      document.body.appendChild(script);
    } else {
      loadGis();
    }
  }, [isSignInModalOpen]);

  if (!isSignInModalOpen) return null;

  const handleManualDevSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGisError(null);
    try {
      await signInWithGoogle({
        email: emailInput.trim(),
        displayName: nameInput.trim()
      });
    } catch (err: any) {
      setGisError(err.message || 'Authentication error.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={closeSignInModal}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
            {/* Google SVG G-Logo */}
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.15z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.93H1.21v3.13C3.25 21.43 7.31 24 12 24z" />
              <path fill="#FBBC05" d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.6H1.21C.44 8.13 0 9.87 0 12s.44 3.87 1.21 5.4l4.11-3.13z" />
              <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.57 1.21 6.6l4.11 3.13c.94-2.83 3.58-4.96 6.68-4.96z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sign in with Google</h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            {signInReason || 'Sign in with your Google account to unlock your personal Google Tool Stack.'}
          </p>
        </div>

        {/* Benefits list */}
        <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs space-y-2 text-slate-700">
          <div className="flex items-center gap-2 font-semibold text-blue-900 text-xs">
            <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>Authenticated Member Benefits</span>
          </div>
          <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
            <li>Curate your private Google Tool Stack & bookmark tools</li>
            <li>Receive verified India pricing updates & telecom offers</li>
            <li>Zero unwanted marketing emails; cancel anytime</li>
          </ul>
        </div>

        {gisError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{gisError}</span>
          </div>
        )}

        {/* Official Google Identity Services Render Target */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div ref={googleButtonRef} className="min-h-[44px] flex items-center justify-center" />
          <p className="text-[10px] text-slate-400">Authenticates directly with accounts.google.com</p>
        </div>

        {/* Developer Sandbox Alternative (for offline / test runs) */}
        <div className="relative border-t border-slate-100 pt-3">
          <details className="text-[11px] text-slate-500">
            <summary className="cursor-pointer font-semibold hover:text-slate-800 text-center py-1">
              Development & Sandbox Testing Login
            </summary>
            <form onSubmit={handleManualDevSubmit} className="space-y-3 mt-3 pt-2 border-t border-slate-100">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Developer Display Name</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Developer Email</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs"
              >
                {isLoading ? 'Processing...' : 'Sign in as Test Developer'}
              </button>
            </form>
          </details>
        </div>

        {/* Security & Privacy Notice */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Identity & Token Vault</span>
          </span>
          <span>Independent Guide</span>
        </div>

      </div>
    </div>
  );
};
