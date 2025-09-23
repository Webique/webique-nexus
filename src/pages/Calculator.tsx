import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator as CalculatorIcon, DollarSign, Users, User, Building2 } from "lucide-react";

interface ProjectScenario {
  name: string;
  description: string;
  inHouseProjects: number;
  freelancerProjects: number;
  totalProjects: number;
  totalCost: number;
  totalRevenue: number;
  profit: number;
  profitMargin: number;
  color: string;
}

interface CalculationResult {
  campaignPrice: number;
  scenarios: ProjectScenario[];
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
    const PROJECT_REVENUE = 890; // Revenue per project
    const DOMAIN_COST = 100; // Domain cost per project
    const FREELANCER_MANAGER_COST = 50; // Manager cost per project
    const FREELANCER_COST = 310; // Freelancer cost per project
    
    // Cost per project
    const IN_HOUSE_COST_PER_PROJECT = PROJECT_REVENUE - DOMAIN_COST; // 790 SAR (break-even)
    const FREELANCER_COST_PER_PROJECT = FREELANCER_MANAGER_COST + FREELANCER_COST; // 360 SAR
    
    // Profit per project
    const IN_HOUSE_PROFIT_PER_PROJECT = PROJECT_REVENUE - IN_HOUSE_COST_PER_PROJECT; // 100 SAR
    const FREELANCER_PROFIT_PER_PROJECT = PROJECT_REVENUE - FREELANCER_COST_PER_PROJECT; // 530 SAR
    
    const scenarios: ProjectScenario[] = [];
    
    // Scenario 1: Break-even (0 profit)
    const breakEvenInHouse = Math.floor(price / IN_HOUSE_COST_PER_PROJECT);
    const breakEvenFreelancer = Math.floor(price / FREELANCER_COST_PER_PROJECT);
    
    scenarios.push({
      name: "Break-Even",
      description: "0% profit margin",
      inHouseProjects: breakEvenInHouse,
      freelancerProjects: 0,
      totalProjects: breakEvenInHouse,
      totalCost: breakEvenInHouse * IN_HOUSE_COST_PER_PROJECT,
      totalRevenue: breakEvenInHouse * PROJECT_REVENUE,
      profit: 0,
      profitMargin: 0,
      color: "bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800"
    });
    
    scenarios.push({
      name: "Break-Even (Freelancers)",
      description: "0% profit margin",
      inHouseProjects: 0,
      freelancerProjects: breakEvenFreelancer,
      totalProjects: breakEvenFreelancer,
      totalCost: breakEvenFreelancer * FREELANCER_COST_PER_PROJECT,
      totalRevenue: breakEvenFreelancer * PROJECT_REVENUE,
      profit: 0,
      profitMargin: 0,
      color: "bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800"
    });
    
    // Scenario 2: Little profit (10-20% margin)
    const littleProfitTarget = price * 0.15; // 15% profit target
    const littleProfitInHouse = Math.floor((price - littleProfitTarget) / IN_HOUSE_COST_PER_PROJECT);
    const littleProfitFreelancer = Math.floor((price - littleProfitTarget) / FREELANCER_COST_PER_PROJECT);
    
    if (littleProfitInHouse > 0) {
      scenarios.push({
        name: "Little Profit (In-House)",
        description: "~15% profit margin",
        inHouseProjects: littleProfitInHouse,
        freelancerProjects: 0,
        totalProjects: littleProfitInHouse,
        totalCost: littleProfitInHouse * IN_HOUSE_COST_PER_PROJECT,
        totalRevenue: littleProfitInHouse * PROJECT_REVENUE,
        profit: littleProfitInHouse * IN_HOUSE_PROFIT_PER_PROJECT,
        profitMargin: littleProfitInHouse > 0 ? (littleProfitInHouse * IN_HOUSE_PROFIT_PER_PROJECT) / (littleProfitInHouse * PROJECT_REVENUE) * 100 : 0,
        color: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
      });
    }
    
    if (littleProfitFreelancer > 0) {
      scenarios.push({
        name: "Little Profit (Freelancers)",
        description: "~15% profit margin",
        inHouseProjects: 0,
        freelancerProjects: littleProfitFreelancer,
        totalProjects: littleProfitFreelancer,
        totalCost: littleProfitFreelancer * FREELANCER_COST_PER_PROJECT,
        totalRevenue: littleProfitFreelancer * PROJECT_REVENUE,
        profit: littleProfitFreelancer * FREELANCER_PROFIT_PER_PROJECT,
        profitMargin: littleProfitFreelancer > 0 ? (littleProfitFreelancer * FREELANCER_PROFIT_PER_PROJECT) / (littleProfitFreelancer * PROJECT_REVENUE) * 100 : 0,
        color: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
      });
    }
    
    // Scenario 3: High profit (30%+ margin)
    const highProfitTarget = price * 0.3; // 30% profit target
    const highProfitInHouse = Math.floor((price - highProfitTarget) / IN_HOUSE_COST_PER_PROJECT);
    const highProfitFreelancer = Math.floor((price - highProfitTarget) / FREELANCER_COST_PER_PROJECT);
    
    if (highProfitInHouse > 0) {
      scenarios.push({
        name: "High Profit (In-House)",
        description: "~30% profit margin",
        inHouseProjects: highProfitInHouse,
        freelancerProjects: 0,
        totalProjects: highProfitInHouse,
        totalCost: highProfitInHouse * IN_HOUSE_COST_PER_PROJECT,
        totalRevenue: highProfitInHouse * PROJECT_REVENUE,
        profit: highProfitInHouse * IN_HOUSE_PROFIT_PER_PROJECT,
        profitMargin: highProfitInHouse > 0 ? (highProfitInHouse * IN_HOUSE_PROFIT_PER_PROJECT) / (highProfitInHouse * PROJECT_REVENUE) * 100 : 0,
        color: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
      });
    }
    
    if (highProfitFreelancer > 0) {
      scenarios.push({
        name: "High Profit (Freelancers)",
        description: "~30% profit margin",
        inHouseProjects: 0,
        freelancerProjects: highProfitFreelancer,
        totalProjects: highProfitFreelancer,
        totalCost: highProfitFreelancer * FREELANCER_COST_PER_PROJECT,
        totalRevenue: highProfitFreelancer * PROJECT_REVENUE,
        profit: highProfitFreelancer * FREELANCER_PROFIT_PER_PROJECT,
        profitMargin: highProfitFreelancer > 0 ? (highProfitFreelancer * FREELANCER_PROFIT_PER_PROJECT) / (highProfitFreelancer * PROJECT_REVENUE) * 100 : 0,
        color: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
      });
    }

    setResult({
      campaignPrice: price,
      scenarios: scenarios.filter(s => s.totalProjects > 0)
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <CalculatorIcon className="w-8 h-8 text-primary" />
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
              <CalculatorIcon className="w-4 h-4 mr-2" />
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
                Project Scenarios
              </CardTitle>
              <CardDescription>
                Different profit scenarios for {result.campaignPrice.toLocaleString()} SAR campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.scenarios.map((scenario, index) => (
                <div key={index} className={`p-4 rounded-lg border ${scenario.color}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-lg">{scenario.name}</h4>
                    <span className="text-sm text-muted-foreground">{scenario.description}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">In-House:</span>
                      <span className="font-bold">{scenario.inHouseProjects}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Freelancers:</span>
                      <span className="font-bold">{scenario.freelancerProjects}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Total Projects:</span>
                        <span className="font-semibold">{scenario.totalProjects}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Cost:</span>
                        <span className="font-semibold">{scenario.totalCost.toLocaleString()} SAR</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Total Revenue:</span>
                        <span className="font-semibold">{scenario.totalRevenue.toLocaleString()} SAR</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Profit:</span>
                        <span className="font-bold">{scenario.profit.toLocaleString()} SAR</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Profit Margin:</span>
                      <span className={`font-bold text-lg ${scenario.profitMargin > 20 ? 'text-green-600' : scenario.profitMargin > 10 ? 'text-yellow-600' : 'text-gray-600'}`}>
                        {scenario.profitMargin.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Project Economics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground mb-2">
                    <strong>In-House Projects:</strong> Cost 790 SAR per project (890 revenue - 100 domain cost). 
                    Profit: 100 SAR per project (11.2% margin).
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2">
                    <strong>Freelancer Projects:</strong> Cost 360 SAR per project (50 manager + 310 freelancer). 
                    Profit: 530 SAR per project (59.6% margin).
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Profit Scenarios</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg">
                  <h5 className="font-semibold text-gray-700 dark:text-gray-300">Break-Even (0% profit)</h5>
                  <p className="text-xs text-muted-foreground">Maximum projects with 0 profit margin</p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                  <h5 className="font-semibold text-yellow-700 dark:text-yellow-300">Little Profit (~15%)</h5>
                  <p className="text-xs text-muted-foreground">Moderate projects with small profit margin</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <h5 className="font-semibold text-green-700 dark:text-green-300">High Profit (~30%)</h5>
                  <p className="text-xs text-muted-foreground">Fewer projects with high profit margin</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
