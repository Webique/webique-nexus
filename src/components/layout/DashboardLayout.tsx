import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { NotesProvider } from "@/contexts/NotesContext";
import { useFreelancerManagerAuth } from "@/contexts/FreelancerManagerAuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isFreelancerManager } = useFreelancerManagerAuth();
  const navigate = useNavigate();

  // Additional security check - redirect if Freelancer Manager tries to access
  useEffect(() => {
    if (isFreelancerManager) {
      navigate("/freelancer-manager", { replace: true });
    }
  }, [isFreelancerManager, navigate]);

  // Don't render anything if Freelancer Manager
  if (isFreelancerManager) {
    return null;
  }

  return (
    <ProjectProvider>
      <NotesProvider>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            <AppSidebar />
            <main className="flex-1 overflow-hidden">
              <div className="h-full p-6">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </NotesProvider>
    </ProjectProvider>
  );
}