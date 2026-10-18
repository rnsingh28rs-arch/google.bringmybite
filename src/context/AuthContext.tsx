import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  provider?: string;
  savedTools: string[];
  idToken?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signInWithGoogle: (customIdentity?: { email: string; displayName: string }) => Promise<AuthUser>;
  signInWithGoogleCredential: (idToken: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  toggleSavedTool: (toolSlug: string) => Promise<boolean>;
  isToolSaved: (toolSlug: string) => boolean;
  isSignInModalOpen: boolean;
  openSignInModal: (reason?: string) => void;
  closeSignInModal: () => void;
  signInReason: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'gtf_auth_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [signInReason, setSignInReason] = useState<string | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed: AuthUser = JSON.parse(stored);
        if (parsed.uid && parsed.email) {
          setUser(parsed);
          const headers: Record<string, string> = {};
          if (parsed.idToken) {
            headers['Authorization'] = `Bearer ${parsed.idToken}`;
          }
          // Sync with server in background to get latest saved tools
          fetch(`/api/user?uid=${encodeURIComponent(parsed.uid)}`, { headers })
            .then(res => res.json())
            .then(data => {
              if (data.success && data.user) {
                const refreshed: AuthUser = {
                  uid: data.user.uid,
                  email: data.user.email,
                  displayName: data.user.displayName,
                  photoURL: data.user.photoURL,
                  provider: data.user.provider,
                  savedTools: data.user.savedTools || [],
                  idToken: parsed.idToken
                };
                setUser(refreshed);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(refreshed));
              }
            })
            .catch(() => {});
        }
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const openSignInModal = (reason?: string) => {
    setSignInReason(reason || 'Sign in with your Google Account to save tools to your private stack and get India pricing alerts.');
    setIsSignInModalOpen(true);
  };

  const closeSignInModal = () => {
    setIsSignInModalOpen(false);
    setSignInReason(null);
  };

  // Sign in using verified Google ID token from Google Identity Services (GIS)
  const signInWithGoogleCredential = async (idToken: string): Promise<AuthUser> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/user/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ idToken })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success || !data.user) {
        throw new Error(data.message || 'Google token verification failed.');
      }

      const authUser: AuthUser = {
        uid: data.user.uid,
        email: data.user.email,
        displayName: data.user.displayName,
        photoURL: data.user.photoURL,
        provider: data.user.provider || 'accounts.google.com',
        savedTools: data.user.savedTools || [],
        idToken
      };

      setUser(authUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(authUser));
      closeSignInModal();
      return authUser;
    } finally {
      setIsLoading(false);
    }
  };

  // Development & test identity sync
  const signInWithGoogle = async (customIdentity?: { email: string; displayName: string }): Promise<AuthUser> => {
    setIsLoading(true);
    try {
      const email = customIdentity?.email || 'verified.developer@gmail.com';
      const displayName = customIdentity?.displayName || 'Google Developer';
      const uid = 'goog_' + btoa(email.toLowerCase()).replace(/=/g, '').slice(0, 20);

      const profile: AuthUser = {
        uid,
        email,
        displayName,
        photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=2563eb`,
        provider: 'google.com',
        savedTools: user?.savedTools || []
      };

      const syncRes = await fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });

      const syncData = await syncRes.json().catch(() => ({}));
      const resolvedUser: AuthUser = syncData.user ? {
        uid: syncData.user.uid,
        email: syncData.user.email,
        displayName: syncData.user.displayName,
        photoURL: syncData.user.photoURL || profile.photoURL,
        provider: syncData.user.provider || 'google.com',
        savedTools: syncData.user.savedTools || profile.savedTools
      } : profile;

      setUser(resolvedUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resolvedUser));
      closeSignInModal();
      return resolvedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setUser(null);
  };

  const toggleSavedTool = async (toolSlug: string): Promise<boolean> => {
    if (!user) {
      openSignInModal('Sign in with Google to save tools to your personal stack.');
      return false;
    }

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (user.idToken) {
        headers['Authorization'] = `Bearer ${user.idToken}`;
      }

      const res = await fetch('/api/user/save-tool', {
        method: 'POST',
        headers,
        body: JSON.stringify({ uid: user.uid, toolSlug, idToken: user.idToken })
      });

      const data = await res.json().catch(() => ({}));
      if (data.success && Array.isArray(data.savedTools)) {
        const updatedUser: AuthUser = {
          ...user,
          savedTools: data.savedTools
        };
        setUser(updatedUser);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUser));
        return data.saved;
      }
      return false;
    } catch {
      return false;
    }
  };

  const isToolSaved = (toolSlug: string): boolean => {
    return Boolean(user?.savedTools?.includes(toolSlug));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signInWithGoogle,
        signInWithGoogleCredential,
        signOut,
        toggleSavedTool,
        isToolSaved,
        isSignInModalOpen,
        openSignInModal,
        closeSignInModal,
        signInReason
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
