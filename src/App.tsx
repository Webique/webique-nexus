import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { FreelancerManagerAuthProvider, useFreelancerManagerAuth } from "@/contexts/FreelancerManagerAuthContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { FreelancerManagerLayout } from "./components/freelancer-manager/FreelancerManagerLayout";
import { ProtectedDashboardRoute } from "./components/freelancer-manager/ProtectedDashboardRoute";
import { ProtectedFreelancerRoute } from "./components/freelancer-manager/ProtectedFreelancerRoute";
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
            {/* Freelancer Manager Routes */}
            <Route path="/freelancer-manager/login" element={<FreelancerManagerLogin />} />
            <Route path="/freelancer-manager" element={
              <ProtectedFreelancerRoute>
                <FreelancerManagerLayout>
                  <FreelancerManager />
                </FreelancerManagerLayout>
              </ProtectedFreelancerRoute>
            } />

            {/* Main Dashboard Routes - Protected from Freelancer Manager */}
            <Route path="/" element={
              <ProtectedDashboardRoute>
                <DashboardLayout>
                  <ActiveProjects />
                </DashboardLayout>
              </ProtectedDashboardRoute>
            } />
            <Route path="/completed" element={
              <ProtectedDashboardRoute>
                <DashboardLayout>
                  <CompletedProjects />
                </DashboardLayout>
              </ProtectedDashboardRoute>
            } />
            <Route path="/finance" element={
              <ProtectedDashboardRoute>
                <DashboardLayout>
                  <Finance />
                </DashboardLayout>
              </ProtectedDashboardRoute>
            } />
            <Route path="/notes" element={
              <ProtectedDashboardRoute>
                <DashboardLayout>
                  <Notes />
                </DashboardLayout>
              </ProtectedDashboardRoute>
            } />
            <Route path="/calculator" element={
              <ProtectedDashboardRoute>
                <DashboardLayout>
                  <Calculator />
                </DashboardLayout>
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
    <FreelancerManagerAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </FreelancerManagerAuthProvider>
  </QueryClientProvider>
);

export default App;
