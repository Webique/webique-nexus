import { NavLink, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  CheckSquare, 
  Layers, 
  Menu,
  Briefcase 
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
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  const getNavClass = (path: string) => {
    const baseClass = "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group";
    return isActive(path)
      ? `${baseClass} bg-gradient-primary text-primary-foreground shadow-bronze font-medium`
      : `${baseClass} text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`;
  };

  return (
    <Sidebar
      className="transition-all duration-300 bg-sidebar border-r border-sidebar-border"
      collapsible="icon"
    >
      <SidebarContent className="p-4">
        {/* Brand Header */}
        <div className="mb-8 px-2">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">Webique</h1>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center mx-auto">
              <Briefcase className="w-4 h-4 text-primary-foreground" />
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="p-0">
                    <NavLink 
                      to={item.url} 
                      className={getNavClass(item.url)}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <span className="font-medium">{item.title}</span>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Collapse Toggle */}
        <div className={`mt-auto pt-4 ${collapsed ? 'mx-auto' : ''}`}>
          <SidebarTrigger className="w-full flex items-center justify-center p-2 rounded-lg bg-sidebar-accent hover:bg-sidebar-border transition-colors">
            <Menu className="w-4 h-4" />
          </SidebarTrigger>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}