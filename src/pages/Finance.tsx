import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProjects } from "@/contexts/ProjectContext";
import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

const Finance = () => {
  const { getFinanceOverview, getProjectFinances } = useProjects();
  
  const overview = getFinanceOverview();
  const projectFinances = getProjectFinances();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              {overview.totalRevenue > 0 
                ? `${((overview.totalProfit / overview.totalRevenue) * 100).toFixed(1)}%`
                : '0%'
              }
            </p>
            <p className="text-sm text-muted-foreground">
              {overview.totalProfit >= 0 ? 'Healthy profit margin' : 'Operating at a loss'}
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
                      <TableCell className="text-success font-medium">
                        {formatCurrency(project.revenue)}
                      </TableCell>
                      <TableCell className="text-destructive">
                        {formatCurrency(project.domainCost)}
                      </TableCell>
                      <TableCell className="text-destructive">
                        {formatCurrency(project.additionalCosts)}
                      </TableCell>
                      <TableCell className="text-destructive font-medium">
                        {formatCurrency(project.totalProjectCosts)}
                      </TableCell>
                      <TableCell className={`font-medium ${getProfitColor(project.profit)}`}>
                        {formatCurrency(project.profit)}
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