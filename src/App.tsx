import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import ActiveProjects from "./pages/ActiveProjects";
import CompletedProjects from "./pages/CompletedProjects";
import Finance from "./pages/Finance";
import Notes from "./pages/Notes";
import Calculator from "./pages/Calculator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <DashboardLayout>
              <ActiveProjects />
            </DashboardLayout>
          } />
          <Route path="/completed" element={
            <DashboardLayout>
              <CompletedProjects />
            </DashboardLayout>
          } />
          <Route path="/finance" element={
            <DashboardLayout>
              <Finance />
            </DashboardLayout>
          } />
          <Route path="/notes" element={
            <DashboardLayout>
              <Notes />
            </DashboardLayout>
          } />
          <Route path="/calculator" element={
            <DashboardLayout>
              <Calculator />
            </DashboardLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
