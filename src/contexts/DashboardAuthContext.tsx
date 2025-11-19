import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface DashboardAuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const DashboardAuthContext = createContext<DashboardAuthContextType | undefined>(undefined);

const DASHBOARD_USERNAME = import.meta.env.VITE_DASHBOARD_USERNAME || 'webiquedev';
const DASHBOARD_PASSWORD = import.meta.env.VITE_DASHBOARD_PASSWORD || '';
const AUTH_STORAGE_KEY = 'dashboard_auth';

export const useDashboardAuth = () => {
  const context = useContext(DashboardAuthContext);
  if (!context) {
    throw new Error('useDashboardAuth must be used within DashboardAuthProvider');
  }
  return context;
};

export const DashboardAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check sessionStorage on mount (clears when tab closes)
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        try {
          const authData = JSON.parse(stored);
          // Verify it's valid auth data
          if (authData.isAuthenticated === true && authData.username === DASHBOARD_USERNAME) {
            return true;
          } else {
            sessionStorage.removeItem(AUTH_STORAGE_KEY);
            return false;
          }
        } catch {
          sessionStorage.removeItem(AUTH_STORAGE_KEY);
          return false;
        }
      }
    }
    return false;
  });

  const login = useCallback((username: string, password: string): boolean => {
    // Verify username and password
    if (username === DASHBOARD_USERNAME && password === DASHBOARD_PASSWORD) {
      const authData = {
        isAuthenticated: true,
        username: DASHBOARD_USERNAME,
        timestamp: Date.now(),
      };
      // Use sessionStorage - clears when tab/browser closes
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  // Check auth status on mount and handle tab visibility
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          try {
            const authData = JSON.parse(stored);
            if (authData.isAuthenticated === true && authData.username === DASHBOARD_USERNAME) {
              setIsAuthenticated(true);
            } else {
              logout();
            }
          } catch {
            logout();
          }
        } else {
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();

    // Check when tab becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuth();
      }
    };

    // Check on storage changes (if user opens another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AUTH_STORAGE_KEY) {
        checkAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [logout]);

  // Clear auth if sessionStorage is cleared (browser closed)
  useEffect(() => {
    const checkSession = setInterval(() => {
      if (typeof window !== 'undefined') {
        const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
        if (!stored && isAuthenticated) {
          logout();
        }
      }
    }, 1000); // Check every second

    return () => clearInterval(checkSession);
  }, [isAuthenticated, logout]);

  const value: DashboardAuthContextType = {
    isAuthenticated,
    login,
    logout,
  };

  return (
    <DashboardAuthContext.Provider value={value}>
      {children}
    </DashboardAuthContext.Provider>
  );
};

