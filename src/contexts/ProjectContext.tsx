import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Project, FinanceOverview, ProjectFinance, Subscription, TikTokAd } from '@/types/project';
import { useToast } from '@/hooks/use-toast';
import ApiService from '@/services/api';

interface ProjectContextType {
  projects: Project[];
  subscriptions: Subscription[];
  tiktokAds: TikTokAd[];
  loading: boolean;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  completeProject: (id: string) => Promise<void>;
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt'>) => Promise<void>;
  updateSubscription: (id: string, updates: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  addTikTokAd: (tiktokAd: Omit<TikTokAd, 'id' | 'createdAt'>) => Promise<void>;
  updateTikTokAd: (id: string, updates: Partial<TikTokAd>) => Promise<void>;
  deleteTikTokAd: (id: string) => Promise<void>;
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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const normalizeProject = (doc: any): Project => ({
    id: doc.id || doc._id,
    name: doc.name,
    phoneNumber: doc.phoneNumber,
    notes: doc.notes,
    instagram: doc.instagram,
    websiteLink: doc.websiteLink,
    totalAmount: doc.totalAmount,
    amountReceived: doc.amountReceived,
    remainingAmount: doc.remainingAmount,
    finishedDate: doc.finishedDate ? new Date(doc.finishedDate).toISOString() : undefined,
    domainCost: doc.domainCost,
    additionalCosts: doc.additionalCosts,
    additionalCostReason: doc.additionalCostReason,
    freelancerManagerFees: doc.freelancerManagerFees,
    freelancerFees: doc.freelancerFees,
    label: doc.label,
    status: doc.status,
    createdAt: doc.createdAt || new Date().toISOString(),
  });

  // Load projects from API on component mount
  useEffect(() => {
    loadProjects();
    loadSubscriptions();
    loadTikTokAds();
  }, []);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch a large page to include all projects (avoid server-side pagination hiding items)
      const response = await ApiService.getProjects({ page: 1, limit: 1000 });
      // response is an array (ApiService unwraps .data)
      const normalized = Array.isArray(response)
        ? response.map(normalizeProject)
        : Array.isArray((response as any)?.data)
          ? (response as any).data.map(normalizeProject)
          : [];
      setProjects(normalized);
    } catch (error) {
      console.error('Failed to load projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadSubscriptions = useCallback(async () => {
    try {
      const response = await ApiService.getSubscriptions();
      const items = Array.isArray(response)
        ? response
        : Array.isArray((response as any)?.data) ? (response as any).data : [];
      setSubscriptions(items as Subscription[]);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    }
  }, []);

  const loadTikTokAds = useCallback(async () => {
    try {
      const response = await ApiService.getTikTokAds();
      const items = Array.isArray(response)
        ? response
        : Array.isArray((response as any)?.data) ? (response as any).data : [];
      setTiktokAds(items as TikTokAd[]);
    } catch (error) {
      console.error('Failed to load TikTok ads:', error);
    }
  }, []);

  const addProject = useCallback(async (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      const response = await ApiService.createProject(projectData);
      const created = normalizeProject(response);
      setProjects(prev => [...prev, created]);
      toast({
        title: "Project Added",
        description: `${created.name} has been added successfully.`,
      });
    } catch (error) {
      console.error('Failed to add project:', error);
      toast({
        title: "Error",
        description: "Failed to add project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    try {
      setLoading(true);
      const response = await ApiService.updateProject(id, updates);
      const updated = normalizeProject(response);
      setProjects(prev => prev.map(project => project.id === id ? updated : project));
      toast({
        title: "Project Updated",
        description: "Project has been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to update project:', error);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteProject = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await ApiService.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      toast({
        title: "Project Deleted",
        description: "Project has been deleted successfully.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const completeProject = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const updates = { 
        status: 'completed' as const, 
        finishedDate: new Date().toISOString() 
      };
      const response = await ApiService.updateProject(id, updates);
      const updated = normalizeProject(response);
      setProjects(prev => prev.map(project => project.id === id ? updated : project));
      toast({
        title: "Project Completed",
        description: "Project has been moved to completed projects.",
      });
    } catch (error) {
      console.error('Failed to complete project:', error);
      toast({
        title: "Error",
        description: "Failed to complete project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

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
    loading,
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