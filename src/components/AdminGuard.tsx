import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, KeyRound, CheckCircle2, ArrowLeft, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface AdminGuardProps {
  children: (props: { token: string; onLogout: () => void }) => React.ReactNode;
  onNavigateHome: () => void;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children, onNavigateHome }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [serverUnconfigured, setServerUnconfigured] = useState(false);

  // Check stored token on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem('gtf_admin_token');
    if (!storedToken) {
      setIsVerifying(false);
      return;
    }

    // Verify token with backend
    fetch('/api/admin/auth', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${storedToken}`
      }
    })
      .then(async (res) => {
        if (res.status === 503) {
          setServerUnconfigured(true);
          sessionStorage.removeItem('gtf_admin_token');
          setToken(null);
        } else if (res.ok) {
          setToken(storedToken);
        } else {
          sessionStorage.removeItem('gtf_admin_token');
          setToken(null);
        }
      })
      .catch(() => {
        sessionStorage.removeItem('gtf_admin_token');
        setToken(null);
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setServerUnconfigured(false);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: password.trim() })
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 503) {
        setServerUnconfigured(true);
        setErrorMessage(data.message || 'Server environment variable ADMIN_PASSWORD is not configured.');
        return;
      }

      if (!res.ok || !data.success || !data.token) {
        setErrorMessage(data.message || 'Invalid administrative password.');
        return;
      }

      // Store in sessionStorage (session-only, cleared when tab closes)
      sessionStorage.setItem('gtf_admin_token', data.token);
      setToken(data.token);
      setPassword('');
    } catch {
      setErrorMessage('Network connection error. Unable to reach administrative auth service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('gtf_admin_token');
    setToken(null);
    setPassword('');
  };

  if (isVerifying) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4 animate-pulse">
          <Lock className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-700">Verifying administrator authorization...</p>
      </div>
    );
  }

  // If authenticated, render children
  if (token) {
    return <>{children({ token, onLogout: handleLogout })}</>;
  }

  // Otherwise, render Admin Login Barrier
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-slate-900 to-blue-900 text-white flex items-center justify-center shadow-lg">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Console</h1>
          <p className="text-xs text-slate-600">
            Secure administrative access for Google Tool Finder configuration
          </p>
        </div>

        {serverUnconfigured && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Authentication Unconfigured (Fail-Closed)</span>
            </div>
            <p className="leading-relaxed">
              The <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">ADMIN_PASSWORD</code> environment variable is missing on the server. For security, the administrative console is locked until configured.
            </p>
          </div>
        )}

        {errorMessage && !serverUnconfigured && (
          <div id="admin-auth-error" role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4" aria-label="Administrator sign in form">
          <div className="space-y-1.5">
            <label htmlFor="admin-password" className="text-xs font-bold text-slate-700 block">
              Administrator Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter server admin password"
                disabled={isSubmitting}
                aria-invalid={Boolean(errorMessage)}
                aria-describedby={errorMessage ? "admin-auth-error" : undefined}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!password.trim() || isSubmitting}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Console'}</span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            onClick={onNavigateHome}
            className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Directory</span>
          </button>

          <span className="text-[10px] text-slate-400 font-mono">HMAC-SHA256 Auth</span>
        </div>

      </div>
    </div>
  );
};
