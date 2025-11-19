import { Navigate } from 'react-router-dom';
import { useFreelancerManagerAuth } from '@/contexts/FreelancerManagerAuthContext';

interface ProtectedFreelancerRouteProps {
  children: React.ReactNode;
}

export function ProtectedFreelancerRoute({ children }: ProtectedFreelancerRouteProps) {
  const { isAuthenticated } = useFreelancerManagerAuth();

  if (!isAuthenticated) {
    return <Navigate to="/freelancer-manager/login" replace />;
  }

  return <>{children}</>;
}

