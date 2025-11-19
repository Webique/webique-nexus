export interface Project {
  id: string;
  name: string;
  phoneNumber: string;
  notes?: string;
  instagram?: string;
  websiteLink?: string;
  totalAmount?: number;
  amountReceived?: number;
  remainingAmount?: number;
  finishedDate?: string;
  domainCost?: number;
  additionalCosts?: number;
  additionalCostReason?: string;
  freelancerManagerFees?: number;
  freelancerFees?: number;
  freelancer?: string;
  label?: 'In-House' | 'Freelancer';
  status: 'active' | 'completed';
  createdAt: string;
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  date: string;
  createdAt: string;
}

export interface TikTokAd {
  id: string;
  name: string;
  price: number;
  date: string;
  createdAt: string;
}

export interface FinanceOverview {
  totalRevenue: number;
  totalAmountReceived: number;
  totalRemainingAmount: number;
  totalCosts: number;
  totalSubscriptionCosts: number;
  totalTikTokAdCosts: number;
  totalProfit: number;
}

export interface ProjectFinance extends Project {
  revenue: number;
  totalProjectCosts: number;
  profit: number;
}