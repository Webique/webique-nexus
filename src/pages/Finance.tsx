import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProjects } from "@/contexts/ProjectContext";
import { DollarSign, TrendingUp, TrendingDown, BarChart3, Calendar, Filter } from "lucide-react";
import { useState, useMemo } from "react";

const Finance = () => {
  const { getFinanceOverview, getProjectFinances } = useProjects();
  const [dateFilter, setDateFilter] = useState<string>("all");
  
  // Get date filter function
  const getDateFilter = (filter: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filter) {
      case "month":
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return oneMonthAgo;
      case "3months":
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return threeMonthsAgo;
      case "6months":
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return sixMonthsAgo;
      case "year":
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return oneYearAgo;
      default:
        return null; // No filter
    }
  };

  // Filter projects based on date filter
  const filteredProjectFinances = useMemo(() => {
    const allProjectFinances = getProjectFinances();
    const filterDate = getDateFilter(dateFilter);
    
    if (!filterDate) {
      return allProjectFinances;
    }
    
    return allProjectFinances.filter(project => {
      // Use finishedDate if available (for completed projects), otherwise use createdAt
      const projectDate = project.finishedDate ? new Date(project.finishedDate) : new Date(project.createdAt);
      return projectDate >= filterDate;
    });
  }, [getProjectFinances, dateFilter]);

  // Calculate filtered overview
  const filteredOverview = useMemo(() => {
    const totalRevenue = filteredProjectFinances.reduce((sum, project) => sum + (project.totalAmount || 0), 0);
    const totalAmountReceived = filteredProjectFinances.reduce((sum, project) => sum + (project.amountReceived || 0), 0);
    const totalRemainingAmount = filteredProjectFinances.reduce((sum, project) => sum + (project.remainingAmount || 0), 0);
    const totalCosts = filteredProjectFinances.reduce((sum, project) => sum + (project.domainCost || 0) + (project.additionalCosts || 0), 0);
    const totalProfit = totalAmountReceived - totalCosts;

    return { totalRevenue, totalAmountReceived, totalRemainingAmount, totalCosts, totalProfit };
  }, [filteredProjectFinances]);
  
  const overview = dateFilter === "all" ? getFinanceOverview() : filteredOverview;
  const projectFinances = filteredProjectFinances;
  
  const profitMargin = overview.totalRevenue > 0 ? (overview.totalProfit / overview.totalRevenue) * 100 : 0;

  const getProfitMarginDescription = (margin: number) => {
    if (margin < 0) return 'Operating at a loss';
    if (margin === 0) return 'Break-even point';
    if (margin < 5) return 'Very low margin';
    if (margin < 10) return 'Low margin';
    if (margin < 15) return 'Moderate margin';
    if (margin < 25) return 'Good margin';
    if (margin < 35) return 'Strong margin';
    if (margin < 50) return 'Excellent margin';
    return 'Outstanding margin';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLabelVariant = (label: string) => {
    return label === 'In-House' ? 'default' : 'secondary';
  };

  const getStatusVariant = (status: string) => {
    return status === 'completed' ? 'default' : 'secondary';
  };

  const getProfitColor = (profit: number) => {
    if (profit > 0) return 'text-success';
    if (profit < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Finance Overview</h1>
          <p className="text-muted-foreground mt-1">
            Track your revenue, costs, and profit across all projects
          </p>
        </div>
        
        {/* Date Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span>Filter by:</span>
          </div>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-success mt-1">
                {formatCurrency(overview.totalRevenue)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                From all projects
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
          </div>
        </Card>

        {/* Amount Received */}
        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Amount Received</p>
              <p className="text-3xl font-bold text-primary mt-1">
                {formatCurrency(overview.totalAmountReceived)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Payments received
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        {/* Remaining Amount */}
        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Remaining</p>
              <p className="text-3xl font-bold text-warning mt-1">
                {formatCurrency(overview.totalRemainingAmount)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Outstanding payments
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-warning" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Costs</p>
              <p className="text-3xl font-bold text-destructive mt-1">
                {formatCurrency(overview.totalCosts)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Domain & additional costs
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-destructive" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total Profit</p>
              <p className={`text-3xl font-bold mt-1 ${getProfitColor(overview.totalProfit)}`}>
                {formatCurrency(overview.totalProfit)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Revenue minus costs
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Profit Margin Card */}
      <Card className="p-6 bg-gradient-card border-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-info" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Profit Margin</h3>
            <p className="text-2xl font-bold text-primary">
              {profitMargin.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">
              {getProfitMarginDescription(profitMargin)}
            </p>
          </div>
        </div>
      </Card>

      {/* Project Breakdown Table */}
      <Card className="bg-gradient-card border-border">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Project Financial Breakdown</h2>
          
          {projectFinances.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No Financial Data</h3>
              <p className="text-muted-foreground">Add some projects to see financial breakdowns</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Domain Cost</TableHead>
                    <TableHead>Additional Costs</TableHead>
                    <TableHead>Total Costs</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Label</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectFinances.map((project) => (
                    <TableRow key={project.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {project.finishedDate ? formatDate(project.finishedDate) : formatDate(project.createdAt)}
                          </span>
                        </div>
                        {project.finishedDate && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Completed
                          </div>
                        )}
                        {!project.finishedDate && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Created
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-success font-medium">
                        {formatCurrency(project.revenue)}
                      </TableCell>
                      <TableCell className="text-destructive">
                        {formatCurrency(project.domainCost || 0)}
                      </TableCell>
                      <TableCell className="text-destructive">
                        {formatCurrency(project.additionalCosts || 0)}
                      </TableCell>
                      <TableCell className="text-destructive font-medium">
                        {formatCurrency(project.totalProjectCosts)}
                      </TableCell>
                      <TableCell className={`font-medium ${getProfitColor(project.profit)}`}>
                        {formatCurrency(project.profit || 0)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(project.status)}>
                          {project.status === 'completed' ? 'Completed' : 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getLabelVariant(project.label)}>
                          {project.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Finance;