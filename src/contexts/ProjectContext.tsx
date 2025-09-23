import React, { createContext, useContext, useState, useCallback } from 'react';
import { Project, FinanceOverview, ProjectFinance, Subscription, TikTokAd } from '@/types/project';
import { useToast } from '@/hooks/use-toast';

interface ProjectContextType {
  projects: Project[];
  subscriptions: Subscription[];
  tiktokAds: TikTokAd[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  completeProject: (id: string) => void;
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt'>) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  addTikTokAd: (tiktokAd: Omit<TikTokAd, 'id' | 'createdAt'>) => void;
  updateTikTokAd: (id: string, updates: Partial<TikTokAd>) => void;
  deleteTikTokAd: (id: string) => void;
  getActiveProjects: () => Project[];
  getCompletedProjects: () => Project[];
  getFinanceOverview: () => FinanceOverview;
  getProjectFinances: () => ProjectFinance[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [tiktokAds, setTiktokAds] = useState<TikTokAd[]>([]);
  const { toast } = useToast();

  const addProject = useCallback((projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    
    setProjects(prev => [...prev, newProject]);
    toast({
      title: "Project Added",
      description: `${newProject.name} has been added successfully.`,
    });
  }, [toast]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, ...updates } : project
    ));
    toast({
      title: "Project Updated",
      description: "Project has been updated successfully.",
    });
  }, [toast]);

  const deleteProject = useCallback((id: string) => {
    const project = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(project => project.id !== id));
    toast({
      title: "Project Deleted",
      description: `${project?.name || 'Project'} has been deleted.`,
      variant: "destructive",
    });
  }, [projects, toast]);

  const completeProject = useCallback((id: string) => {
    const project = projects.find(p => p.id === id);
    setProjects(prev => prev.map(project => 
      project.id === id 
        ? { 
            ...project, 
            status: 'completed' as const, 
            finishedDate: project.finishedDate || new Date().toISOString() 
          }
        : project
    ));
    toast({
      title: "Project Completed",
      description: `${project?.name || 'Project'} has been moved to completed projects.`,
    });
  }, [projects, toast]);

  // Subscription management
  const addSubscription = useCallback((subscriptionData: Omit<Subscription, 'id' | 'createdAt'>) => {
    const newSubscription: Subscription = {
      ...subscriptionData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setSubscriptions(prev => [...prev, newSubscription]);
    toast({
      title: "Subscription Added",
      description: `${subscriptionData.name} has been added to your subscriptions.`,
    });
  }, [toast]);

  const updateSubscription = useCallback((id: string, updates: Partial<Subscription>) => {
    setSubscriptions(prev => prev.map(subscription => 
      subscription.id === id ? { ...subscription, ...updates } : subscription
    ));
    toast({
      title: "Subscription Updated",
      description: "Subscription has been updated successfully.",
    });
  }, [toast]);

  const deleteSubscription = useCallback((id: string) => {
    const subscription = subscriptions.find(s => s.id === id);
    setSubscriptions(prev => prev.filter(subscription => subscription.id !== id));
    toast({
      title: "Subscription Deleted",
      description: `${subscription?.name || 'Subscription'} has been removed.`,
    });
  }, [subscriptions, toast]);

  // TikTok Ad management
  const addTikTokAd = useCallback((tiktokAdData: Omit<TikTokAd, 'id' | 'createdAt'>) => {
    const newTikTokAd: TikTokAd = {
      ...tiktokAdData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setTiktokAds(prev => [...prev, newTikTokAd]);
    toast({
      title: "TikTok Ad Added",
      description: `${tiktokAdData.name} has been added to your campaigns.`,
    });
  }, [toast]);

  const updateTikTokAd = useCallback((id: string, updates: Partial<TikTokAd>) => {
    setTiktokAds(prev => prev.map(ad => 
      ad.id === id ? { ...ad, ...updates } : ad
    ));
    toast({
      title: "TikTok Ad Updated",
      description: "Campaign has been updated successfully.",
    });
  }, [toast]);

  const deleteTikTokAd = useCallback((id: string) => {
    const ad = tiktokAds.find(a => a.id === id);
    setTiktokAds(prev => prev.filter(ad => ad.id !== id));
    toast({
      title: "TikTok Ad Deleted",
      description: `${ad?.name || 'Campaign'} has been removed.`,
    });
  }, [tiktokAds, toast]);

  const getActiveProjects = useCallback(() => {
    return projects.filter(project => project.status === 'active');
  }, [projects]);

  const getCompletedProjects = useCallback(() => {
    return projects.filter(project => project.status === 'completed');
  }, [projects]);

  const getFinanceOverview = useCallback((): FinanceOverview => {
    const totalRevenue = projects.reduce((sum, project) => sum + (project.amountReceived || 0), 0);
    const totalAmountReceived = projects.reduce((sum, project) => sum + (project.amountReceived || 0), 0);
    const totalRemainingAmount = projects.reduce((sum, project) => sum + (project.remainingAmount || 0), 0);
    const projectCosts = projects.reduce((sum, project) => sum + (project.domainCost || 0) + (project.additionalCosts || 0), 0);
    const totalSubscriptionCosts = subscriptions.reduce((sum, subscription) => sum + subscription.price, 0);
    const totalTikTokAdCosts = tiktokAds.reduce((sum, ad) => sum + ad.price, 0);
    const totalCosts = projectCosts + totalSubscriptionCosts + totalTikTokAdCosts;
    const totalProfit = totalAmountReceived - totalCosts;

    return { 
      totalRevenue, 
      totalAmountReceived, 
      totalRemainingAmount, 
      totalCosts, 
      totalSubscriptionCosts,
      totalTikTokAdCosts,
      totalProfit 
    };
  }, [projects, subscriptions, tiktokAds]);

  const getProjectFinances = useCallback((): ProjectFinance[] => {
    return projects.map(project => ({
      ...project,
      revenue: project.amountReceived || 0,
      totalProjectCosts: (project.domainCost || 0) + (project.additionalCosts || 0),
      profit: (project.amountReceived || 0) - ((project.domainCost || 0) + (project.additionalCosts || 0)),
    }));
  }, [projects]);

  const value: ProjectContextType = {
    projects,
    subscriptions,
    tiktokAds,
    addProject,
    updateProject,
    deleteProject,
    completeProject,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    addTikTokAd,
    updateTikTokAd,
    deleteTikTokAd,
    getActiveProjects,
    getCompletedProjects,
    getFinanceOverview,
    getProjectFinances,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};