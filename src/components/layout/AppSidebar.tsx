import { NavLink, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  CheckSquare, 
  Layers, 
  Menu,
  StickyNote
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

const navigationItems = [
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
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

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
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Collapse Toggle */}
        <div className={`mt-6 ${collapsed ? 'mx-auto' : ''}`}>
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