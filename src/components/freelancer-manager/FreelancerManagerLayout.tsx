import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFreelancerManagerAuth } from '@/contexts/FreelancerManagerAuthContext';
import { useNavigate } from 'react-router-dom';
import { ProjectProvider } from '@/contexts/ProjectContext';

interface FreelancerManagerLayoutProps {
  children: React.ReactNode;
}

export function FreelancerManagerLayout({ children }: FreelancerManagerLayoutProps) {
  const { logout } = useFreelancerManagerAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/freelancer-manager/login');
  };

  return (
    <ProjectProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center p-1">
                <img 
                  src="/LOGO.jpg" 
                  alt="Webique Logo" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Freelancer Manager Portal</h1>
                <p className="text-sm text-muted-foreground">View freelancer projects</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="gap-2 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-6">
          {children}
        </main>
      </div>
    </ProjectProvider>
  );
}

