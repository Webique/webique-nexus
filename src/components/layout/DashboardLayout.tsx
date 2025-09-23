import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { NotesProvider } from "@/contexts/NotesContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
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