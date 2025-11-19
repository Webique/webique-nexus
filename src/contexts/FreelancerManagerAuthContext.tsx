import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface FreelancerManagerAuthContextType {
  isAuthenticated: boolean;
  isFreelancerManager: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const FreelancerManagerAuthContext = createContext<FreelancerManagerAuthContextType | undefined>(undefined);

const FREELANCER_MANAGER_PASSWORD = import.meta.env.VITE_FREELANCER_MANAGER_PASSWORD || 'freelancer2024';
const AUTH_STORAGE_KEY = 'freelancer_manager_auth';

export const useFreelancerManagerAuth = () => {
  const context = useContext(FreelancerManagerAuthContext);
  if (!context) {
    throw new Error('useFreelancerManagerAuth must be used within FreelancerManagerAuthProvider');
  }
  return context;
};

export const FreelancerManagerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check if user is authenticated on mount
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const authData = JSON.parse(stored);
        // Check if auth is still valid (not expired)
        if (authData.expiresAt && new Date(authData.expiresAt) > new Date()) {
          return authData.isAuthenticated === true;
        } else {
          // Expired, clear it
          localStorage.removeItem(AUTH_STORAGE_KEY);
          return false;
        }
      } catch {
        return false;
      }
    }
    return false;
  });

  const [isFreelancerManager, setIsFreelancerManager] = useState<boolean>(isAuthenticated);

  useEffect(() => {
    setIsFreelancerManager(isAuthenticated);
  }, [isAuthenticated]);

  const login = useCallback((password: string): boolean => {
    if (password === FREELANCER_MANAGER_PASSWORD) {
      const authData = {
        isAuthenticated: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      setIsAuthenticated(true);
      setIsFreelancerManager(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setIsFreelancerManager(false);
  }, []);

  // Check auth status on mount and periodically
  useEffect(() => {
    const checkAuth = () => {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        try {
          const authData = JSON.parse(stored);
          if (authData.expiresAt && new Date(authData.expiresAt) > new Date()) {
            setIsAuthenticated(authData.isAuthenticated === true);
          } else {
            logout();
          }
        } catch {
          logout();
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    // Check every 5 minutes
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [logout]);

  const value: FreelancerManagerAuthContextType = {
    isAuthenticated,
    isFreelancerManager,
    login,
    logout,
  };

  return (
    <FreelancerManagerAuthContext.Provider value={value}>
      {children}
    </FreelancerManagerAuthContext.Provider>
  );
};

