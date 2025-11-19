import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDashboardAuth } from '@/contexts/DashboardAuthContext';

interface ProtectedDashboardRouteProps {
  children: React.ReactNode;
}

export function ProtectedDashboardRoute({ children }: ProtectedDashboardRouteProps) {
  const { isAuthenticated } = useDashboardAuth();
  const location = useLocation();

  // Check authentication on every route change
  useEffect(() => {
    // Verify sessionStorage still has auth
    const authKey = 'dashboard_auth';
    const stored = sessionStorage.getItem(authKey);
    if (!stored && isAuthenticated) {
      // Session was cleared, force logout
      window.location.href = '/login';
    }
  }, [isAuthenticated, location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

