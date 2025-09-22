import React, { createContext, useContext, useState, useCallback } from 'react';
import { Project, FinanceOverview, ProjectFinance } from '@/types/project';
import { useToast } from '@/hooks/use-toast';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  completeProject: (id: string) => void;
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
        ? { ...project, status: 'completed' as const, finishedDate: new Date().toISOString() }
        : project
    ));
    toast({
      title: "Project Completed",
      description: `${project?.name || 'Project'} has been moved to completed projects.`,
    });
  }, [projects, toast]);

  const getActiveProjects = useCallback(() => {
    return projects.filter(project => project.status === 'active');
  }, [projects]);

  const getCompletedProjects = useCallback(() => {
    return projects.filter(project => project.status === 'completed');
  }, [projects]);

  const getFinanceOverview = useCallback((): FinanceOverview => {
    const totalRevenue = projects.reduce((sum, project) => sum + project.totalAmount, 0);
    const totalCosts = projects.reduce((sum, project) => sum + project.domainCost + project.additionalCosts, 0);
    const totalProfit = totalRevenue - totalCosts;

    return { totalRevenue, totalCosts, totalProfit };
  }, [projects]);

  const getProjectFinances = useCallback((): ProjectFinance[] => {
    return projects.map(project => ({
      ...project,
      revenue: project.totalAmount,
      totalProjectCosts: project.domainCost + project.additionalCosts,
      profit: project.totalAmount - (project.domainCost + project.additionalCosts),
    }));
  }, [projects]);

  const value: ProjectContextType = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    completeProject,
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