import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useFreelancerManagerAuth } from '@/contexts/FreelancerManagerAuthContext';

interface ProtectedDashboardRouteProps {
  children: React.ReactNode;
}

export function ProtectedDashboardRoute({ children }: ProtectedDashboardRouteProps) {
  const { isFreelancerManager } = useFreelancerManagerAuth();
  const location = useLocation();

  // Multiple security checks on every route change
  useEffect(() => {
    // Check if Freelancer Manager is authenticated
    if (isFreelancerManager) {
      // Force redirect using window.location to prevent any bypass
      window.location.href = '/freelancer-manager';
      return;
    }

    // Additional check: verify localStorage hasn't been tampered with
    const authKey = 'freelancer_manager_auth';
    const stored = localStorage.getItem(authKey);
    if (stored) {
      try {
        const authData = JSON.parse(stored);
        // If there's valid auth data, user is Freelancer Manager
        if (authData.isAuthenticated === true && authData.expiresAt) {
          const expiresAt = new Date(authData.expiresAt);
          if (expiresAt > new Date()) {
            // Valid Freelancer Manager session - redirect
            window.location.href = '/freelancer-manager';
          }
        }
      } catch {
        // Invalid data, ignore
      }
    }
  }, [isFreelancerManager, location.pathname]);

  // If user is authenticated as Freelancer Manager, block access to main dashboard
  if (isFreelancerManager) {
    return <Navigate to="/freelancer-manager" replace />;
  }

  return <>{children}</>;
}

