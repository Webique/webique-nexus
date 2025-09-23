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

  const normalizeSubscription = (doc: any): Subscription => ({
    id: doc.id || doc._id,
    name: doc.name,
    price: Number(doc.price ?? 0),
    date: doc.date ? new Date(doc.date).toISOString() : new Date().toISOString(),
    createdAt: doc.createdAt || new Date().toISOString(),
  });

  const normalizeTikTokAd = (doc: any): TikTokAd => ({
    id: doc.id || doc._id,
    name: doc.name,
    price: Number(doc.price ?? 0),
    date: doc.date ? new Date(doc.date).toISOString() : new Date().toISOString(),
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
      const response = await ApiService.getSubscriptions({ page: 1, limit: 1000 });
      const items = Array.isArray(response)
        ? response
        : Array.isArray((response as any)?.data) ? (response as any).data : [];
      setSubscriptions(items.map(normalizeSubscription));
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    }
  }, []);

  const loadTikTokAds = useCallback(async () => {
    try {
      const response = await ApiService.getTikTokAds({ page: 1, limit: 1000 });
      const items = Array.isArray(response)
        ? response
        : Array.isArray((response as any)?.data) ? (response as any).data : [];
      setTiktokAds(items.map(normalizeTikTokAd));
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
  const addSubscription = useCallback(async (subscriptionData: Omit<Subscription, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      const payload = {
        name: subscriptionData.name,
        price: subscriptionData.price,
        date: subscriptionData.date,
      };
      const response = await ApiService.createSubscription(payload);
      const created = normalizeSubscription(response);
      setSubscriptions(prev => [...prev, created]);
      toast({
        title: "Subscription Added",
        description: `${created.name} has been added to your subscriptions.`,
      });
    } catch (error) {
      console.error('Failed to add subscription:', error);
      toast({
        title: "Error",
        description: "Failed to add subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateSubscription = useCallback(async (id: string, updates: Partial<Subscription>) => {
    try {
      setLoading(true);
      const payload: any = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.price !== undefined) payload.price = updates.price;
      if (updates.date !== undefined) payload.date = updates.date;
      const response = await ApiService.updateSubscription(id, payload);
      const updated = normalizeSubscription(response);
      setSubscriptions(prev => prev.map(subscription => 
        subscription.id === id ? updated : subscription
      ));
      toast({
        title: "Subscription Updated",
        description: "Subscription has been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to update subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteSubscription = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await ApiService.deleteSubscription(id);
      setSubscriptions(prev => prev.filter(subscription => subscription.id !== id));
      toast({
        title: "Subscription Deleted",
        description: `Subscription has been removed.`,
      });
    } catch (error) {
      console.error('Failed to delete subscription:', error);
      toast({
        title: "Error",
        description: "Failed to delete subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // TikTok Ad management
  const addTikTokAd = useCallback(async (tiktokAdData: Omit<TikTokAd, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      const payload = {
        name: tiktokAdData.name,
        price: tiktokAdData.price,
        date: tiktokAdData.date,
      };
      const response = await ApiService.createTikTokAd(payload);
      const created = normalizeTikTokAd(response);
      setTiktokAds(prev => [...prev, created]);
      toast({
        title: "TikTok Ad Added",
        description: `${created.name} has been added to your campaigns.`,
      });
    } catch (error) {
      console.error('Failed to add TikTok ad:', error);
      toast({
        title: "Error",
        description: "Failed to add TikTok ad. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateTikTokAd = useCallback(async (id: string, updates: Partial<TikTokAd>) => {
    try {
      setLoading(true);
      const payload: any = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.price !== undefined) payload.price = updates.price;
      if (updates.date !== undefined) payload.date = updates.date;
      const response = await ApiService.updateTikTokAd(id, payload);
      const updated = normalizeTikTokAd(response);
      setTiktokAds(prev => prev.map(ad => ad.id === id ? updated : ad));
      toast({
        title: "TikTok Ad Updated",
        description: "Campaign has been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to update TikTok ad:', error);
      toast({
        title: "Error",
        description: "Failed to update TikTok ad. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteTikTokAd = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await ApiService.deleteTikTokAd(id);
      setTiktokAds(prev => prev.filter(ad => ad.id !== id));
      toast({
        title: "TikTok Ad Deleted",
        description: `Campaign has been removed.`,
      });
    } catch (error) {
      console.error('Failed to delete TikTok ad:', error);
      toast({
        title: "Error",
        description: "Failed to delete TikTok ad. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

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