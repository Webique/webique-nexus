import { Navigate } from 'react-router-dom';
import { useFreelancerManagerAuth } from '@/contexts/FreelancerManagerAuthContext';
import { useDashboardAuth } from '@/contexts/DashboardAuthContext';

interface ProtectedFreelancerRouteProps {
  children: React.ReactNode;
}

export function ProtectedFreelancerRoute({ children }: ProtectedFreelancerRouteProps) {
  const { isAuthenticated: isFreelancerAuthenticated } = useFreelancerManagerAuth();
  const { isAuthenticated: isDashboardAuthenticated } = useDashboardAuth();

  // Allow access if either Freelancer Manager is authenticated OR Dashboard user is authenticated
  if (!isFreelancerAuthenticated && !isDashboardAuthenticated) {
    return <Navigate to="/freelancer-manager/login" replace />;
  }

  return <>{children}</>;
}

