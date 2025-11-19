import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { FreelancerManagerAuthProvider, useFreelancerManagerAuth } from "@/contexts/FreelancerManagerAuthContext";
import { DashboardAuthProvider } from "@/contexts/DashboardAuthContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { FreelancerManagerLayout } from "./components/freelancer-manager/FreelancerManagerLayout";
import { ProtectedDashboardRoute as ProtectedFreelancerDashboardRoute } from "./components/freelancer-manager/ProtectedDashboardRoute";
import { ProtectedDashboardRoute } from "./components/dashboard/ProtectedDashboardRoute";
import { ProtectedFreelancerRoute } from "./components/freelancer-manager/ProtectedFreelancerRoute";
import { DashboardLogin } from "./components/dashboard/DashboardLogin";
import { FreelancerManagerLogin } from "./components/freelancer-manager/FreelancerManagerLogin";
import ActiveProjects from "./pages/ActiveProjects";
import CompletedProjects from "./pages/CompletedProjects";
import Finance from "./pages/Finance";
import Notes from "./pages/Notes";
import Calculator from "./pages/Calculator";
import FreelancerManager from "./pages/FreelancerManager";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Global navigation guard component - must be inside BrowserRouter and AuthProvider
function NavigationGuard() {
  const location = useLocation();
  const { isFreelancerManager } = useFreelancerManagerAuth();

  useEffect(() => {
    // List of protected dashboard routes
    const protectedRoutes = ['/', '/completed', '/finance', '/notes', '/calculator'];
    const currentPath = location.pathname;

    // If Freelancer Manager tries to access any dashboard route, redirect
    if (isFreelancerManager && protectedRoutes.includes(currentPath)) {
      window.location.href = '/freelancer-manager';
    }
  }, [location.pathname, isFreelancerManager]);

  return null;
}

// Inner app component that has access to router and auth
function AppRoutes() {
  return (
    <>
      <NavigationGuard />
      <Routes>
            {/* Dashboard Login */}
            <Route path="/login" element={<DashboardLogin />} />

            {/* Freelancer Manager Routes */}
            <Route path="/freelancer-manager/login" element={<FreelancerManagerLogin />} />
            <Route path="/freelancer-manager" element={
              <ProtectedFreelancerRoute>
                <FreelancerManagerLayout>
                  <FreelancerManager />
                </FreelancerManagerLayout>
              </ProtectedFreelancerRoute>
            } />

            {/* Main Dashboard Routes - Protected with authentication */}
            <Route path="/" element={
              <ProtectedDashboardRoute>
                <ProtectedFreelancerDashboardRoute>
                  <DashboardLayout>
                    <ActiveProjects />
                  </DashboardLayout>
                </ProtectedFreelancerDashboardRoute>
              </ProtectedDashboardRoute>
            } />
            <Route path="/completed" element={
              <ProtectedDashboardRoute>
                <ProtectedFreelancerDashboardRoute>
                  <DashboardLayout>
                    <CompletedProjects />
                  </DashboardLayout>
                </ProtectedFreelancerDashboardRoute>
              </ProtectedDashboardRoute>
            } />
            <Route path="/finance" element={
              <ProtectedDashboardRoute>
                <ProtectedFreelancerDashboardRoute>
                  <DashboardLayout>
                    <Finance />
                  </DashboardLayout>
                </ProtectedFreelancerDashboardRoute>
              </ProtectedDashboardRoute>
            } />
            <Route path="/notes" element={
              <ProtectedDashboardRoute>
                <ProtectedFreelancerDashboardRoute>
                  <DashboardLayout>
                    <Notes />
                  </DashboardLayout>
                </ProtectedFreelancerDashboardRoute>
              </ProtectedDashboardRoute>
            } />
            <Route path="/calculator" element={
              <ProtectedDashboardRoute>
                <ProtectedFreelancerDashboardRoute>
                  <DashboardLayout>
                    <Calculator />
                  </DashboardLayout>
                </ProtectedFreelancerDashboardRoute>
              </ProtectedDashboardRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DashboardAuthProvider>
      <FreelancerManagerAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </FreelancerManagerAuthProvider>
    </DashboardAuthProvider>
  </QueryClientProvider>
);

export default App;
