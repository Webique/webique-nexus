export interface Project {
  id: string;
  name: string;
  phoneNumber: string;
  instagram: string;
  websiteLink: string;
  totalAmount: number;
  deadline: string;
  domainCost: number;
  additionalCosts: number;
  label: 'In-House' | 'Freelancer';
  status: 'active' | 'completed';
  finishedDate?: string;
  createdAt: string;
}

export interface FinanceOverview {
  totalRevenue: number;
  totalCosts: number;
  totalProfit: number;
}

export interface ProjectFinance extends Project {
  revenue: number;
  totalProjectCosts: number;
  profit: number;
}