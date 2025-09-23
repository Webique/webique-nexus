import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, DollarSign, Users, User, Building2 } from "lucide-react";

interface CalculationResult {
  totalProjects: number;
  inHouseProjects: number;
  freelancerProjects: number;
  inHouseRevenue: number;
  freelancerRevenue: number;
  totalRevenue: number;
  profit: number;
  profitMargin: number;
}

export default function Calculator() {
  const [campaignPrice, setCampaignPrice] = useState<string>("");
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateProjects = () => {
    const price = parseFloat(campaignPrice);
    if (isNaN(price) || price <= 0) {
      setResult(null);
      return;
    }

    // Constants
    const PROJECT_COST = 890; // Total project cost
    const DOMAIN_COST = 100; // Domain cost per project
    const FREELANCER_MANAGER_COST = 50; // Manager cost per project
    const FREELANCER_COST = 310; // Freelancer cost per project
    
    // Calculate available budget after domain costs
    const availableBudget = price - DOMAIN_COST;
    
    // Calculate how many projects we can do
    const totalProjects = Math.floor(price / PROJECT_COST);
    
    if (totalProjects === 0) {
      setResult({
        totalProjects: 0,
        inHouseProjects: 0,
        freelancerProjects: 0,
        inHouseRevenue: 0,
        freelancerRevenue: 0,
        totalRevenue: 0,
        profit: 0,
        profitMargin: 0,
      });
      return;
    }

    // Calculate costs
    const totalProjectCost = totalProjects * PROJECT_COST;
    const totalDomainCost = totalProjects * DOMAIN_COST;
    const totalFreelancerManagerCost = totalProjects * FREELANCER_MANAGER_COST;
    const totalFreelancerCost = totalProjects * FREELANCER_COST;
    
    // Calculate in-house vs freelancer distribution
    // For simplicity, let's assume we can do all projects in-house
    // and calculate the cost difference
    const inHouseCostPerProject = PROJECT_COST - DOMAIN_COST; // 790 SAR
    const freelancerCostPerProject = FREELANCER_MANAGER_COST + FREELANCER_COST; // 360 SAR
    
    // Calculate how many projects we can afford with freelancers
    const maxFreelancerProjects = Math.floor(availableBudget / freelancerCostPerProject);
    const freelancerProjects = Math.min(maxFreelancerProjects, totalProjects);
    const inHouseProjects = totalProjects - freelancerProjects;
    
    // Calculate revenues and profits
    const inHouseRevenue = inHouseProjects * PROJECT_COST;
    const freelancerRevenue = freelancerProjects * PROJECT_COST;
    const totalRevenue = inHouseRevenue + freelancerRevenue;
    
    const inHouseProfit = inHouseProjects * (PROJECT_COST - inHouseCostPerProject);
    const freelancerProfit = freelancerProjects * (PROJECT_COST - freelancerCostPerProject);
    const totalProfit = inHouseProfit + freelancerProfit;
    
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    setResult({
      totalProjects,
      inHouseProjects,
      freelancerProjects,
      inHouseRevenue,
      freelancerRevenue,
      totalRevenue,
      profit: totalProfit,
      profitMargin,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Project Calculator</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Campaign Input
            </CardTitle>
            <CardDescription>
              Enter your TikTok ad campaign budget to calculate project distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-price">TikTok Ad Campaign Price (SAR)</Label>
              <Input
                id="campaign-price"
                type="number"
                placeholder="Enter campaign budget..."
                value={campaignPrice}
                onChange={(e) => setCampaignPrice(e.target.value)}
                className="text-lg"
              />
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Project Assumptions:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Project cost: 890 SAR</li>
                <li>Domain cost: 100 SAR per project</li>
                <li>Freelancer manager: 50 SAR per project</li>
                <li>Freelancer: 310 SAR per project</li>
              </ul>
            </div>

            <Button onClick={calculateProjects} className="w-full" size="lg">
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Projects
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Calculation Results
              </CardTitle>
              <CardDescription>
                Project distribution and financial breakdown
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Total Projects */}
              <div className="bg-primary/10 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total Projects Possible</span>
                  <span className="text-2xl font-bold text-primary">{result.totalProjects}</span>
                </div>
              </div>

              {/* Project Distribution */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-900 dark:text-blue-100">In-House</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{result.inHouseProjects}</div>
                  <div className="text-sm text-blue-600/70">projects</div>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-900 dark:text-green-100">Freelancers</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{result.freelancerProjects}</div>
                  <div className="text-sm text-green-600/70">projects</div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Financial Breakdown</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>In-House Revenue:</span>
                    <span className="font-semibold">{result.inHouseRevenue.toLocaleString()} SAR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Freelancer Revenue:</span>
                    <span className="font-semibold">{result.freelancerRevenue.toLocaleString()} SAR</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Total Revenue:</span>
                    <span className="font-bold text-lg">{result.totalRevenue.toLocaleString()} SAR</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Total Profit:</span>
                    <span className="font-bold">{result.profit.toLocaleString()} SAR</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Profit Margin:</span>
                    <span className="font-bold">{result.profitMargin.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">In-House Projects</h4>
              <p className="text-muted-foreground">
                Projects completed by your team. Cost per project: 790 SAR (890 - 100 domain cost).
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Freelancer Projects</h4>
              <p className="text-muted-foreground">
                Projects outsourced to freelancers. Cost per project: 360 SAR (50 manager + 310 freelancer).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
