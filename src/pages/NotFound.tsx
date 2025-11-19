import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useFreelancerManagerAuth } from "@/contexts/FreelancerManagerAuthContext";
import { useDashboardAuth } from "@/contexts/DashboardAuthContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isFreelancerManager } = useFreelancerManagerAuth();
  const { isAuthenticated } = useDashboardAuth();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // If Freelancer Manager, redirect to their portal
    if (isFreelancerManager) {
      navigate("/freelancer-manager", { replace: true });
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated && !isFreelancerManager) {
      navigate("/login", { replace: true });
    }
  }, [location.pathname, isFreelancerManager, isAuthenticated, navigate]);

  // Don't render if redirecting
  if (isFreelancerManager || (!isAuthenticated && !isFreelancerManager)) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
