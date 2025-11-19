import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { 
  BarChart3, 
  Calculator,
  CheckSquare, 
  Layers, 
  Menu,
  StickyNote,
  Users,
  LogOut
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useFreelancerManagerAuth } from "@/contexts/FreelancerManagerAuthContext";
import { useDashboardAuth } from "@/contexts/DashboardAuthContext";

const navigationItems: Array<{
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  external?: boolean;
}> = [
  { 
    title: "Active Projects", 
    url: "/", 
    icon: Layers,
    description: "Manage ongoing projects"
  },
  { 
    title: "Completed Projects", 
    url: "/completed", 
    icon: CheckSquare,
    description: "View finished projects"
  },
  { 
    title: "Finance", 
    url: "/finance", 
    icon: BarChart3,
    description: "Revenue & profit overview"
  },
  { 
    title: "Notes", 
    url: "/notes", 
    icon: StickyNote,
    description: "Important notes & daily tasks"
  },
  { 
    title: "Calculator", 
    url: "/calculator", 
    icon: Calculator,
    description: "Project cost calculator"
  },
  { 
    title: "Freelancer Manager", 
    url: "/freelancer-manager/login", 
    icon: Users,
    description: "Access freelancer portal",
    external: true
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { isFreelancerManager } = useFreelancerManagerAuth();
  const { logout } = useDashboardAuth();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Security check - redirect Freelancer Manager if they somehow access sidebar
  useEffect(() => {
    if (isFreelancerManager) {
      navigate("/freelancer-manager", { replace: true });
    }
  }, [isFreelancerManager, navigate]);

  // Don't render sidebar if Freelancer Manager
  if (isFreelancerManager) {
    return null;
  }

  const isActive = (path: string) => currentPath === path;

  const getNavClass = (path: string) => {
    const baseClass = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden";
    return isActive(path)
      ? `${baseClass} bg-primary text-primary-foreground shadow-lg font-semibold transform scale-[1.02]`
      : `${baseClass} text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-md hover:transform hover:scale-[1.01]`;
  };

  return (
    <Sidebar
      className="transition-all duration-300 bg-sidebar border-r border-sidebar-border shadow-xl"
      collapsible="icon"
    >
      <SidebarContent className="p-6 flex flex-col h-full">
        {/* Brand Header */}
        <div className="mb-10 px-2">
          {!collapsed ? (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center p-1">
                <img 
                  src="/LOGO.jpg" 
                  alt="Webique Logo" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">Webique</h1>
                <p className="text-sm text-muted-foreground font-medium">Project Dashboard</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center mx-auto p-1">
              <img 
                src="/LOGO.jpg" 
                alt="Webique Logo" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="flex-1">
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4 px-2">
              {!collapsed && "Navigation"}
            </SidebarGroupLabel>
            
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="p-0">
                      {item.external ? (
                        <NavLink
                          to={item.url}
                          className={getNavClass(item.url)}
                          title={collapsed ? item.title : undefined}
                        >
                          <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-105`} />
                          {!collapsed && (
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold text-sm">{item.title}</span>
                            </div>
                          )}
                        </NavLink>
                      ) : (
                        <NavLink 
                          to={item.url} 
                          className={getNavClass(item.url)}
                          title={collapsed ? item.title : undefined}
                        >
                          <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive(item.url) ? 'scale-110' : 'group-hover:scale-105'}`} />
                          {!collapsed && (
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold text-sm">{item.title}</span>
                            </div>
                          )}
                          {isActive(item.url) && (
                            <div className="absolute right-2 w-2 h-2 bg-primary-foreground rounded-full opacity-80"></div>
                          )}
                        </NavLink>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Logout Button */}
        <div className={`mt-6 ${collapsed ? 'mx-auto' : ''}`}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all duration-300 hover:shadow-md group"
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            {!collapsed && (
              <span className="text-sm font-medium">
                Logout
              </span>
            )}
          </button>
        </div>

        {/* Collapse Toggle */}
        <div className={`mt-2 ${collapsed ? 'mx-auto' : ''}`}>
          <SidebarTrigger className="w-full flex items-center justify-center p-3 rounded-xl bg-sidebar-accent hover:bg-sidebar-border transition-all duration-300 hover:shadow-md group">
            <Menu className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            {!collapsed && (
              <span className="ml-2 text-sm font-medium text-sidebar-foreground">
                {collapsed ? 'Expand' : 'Collapse'}
              </span>
            )}
          </SidebarTrigger>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}