import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator as CalculatorIcon, DollarSign, Users, User, Building2 } from "lucide-react";

interface CalculationResult {
  campaignPrice: number;
  inHouseBreakEven: number;
  freelancerBreakEven: number;
  inHouseCost: number;
  freelancerCost: number;
  inHouseRevenue: number;
  freelancerRevenue: number;
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
    
    // Profit per project
    const IN_HOUSE_PROFIT_PER_PROJECT = PROJECT_REVENUE - DOMAIN_COST; // 790 SAR
    const FREELANCER_PROFIT_PER_PROJECT = PROJECT_REVENUE - (DOMAIN_COST + FREELANCER_MANAGER_COST + FREELANCER_COST); // 430 SAR

    // Cash cost per project
    const IN_HOUSE_COST_PER_PROJECT = DOMAIN_COST; // 100 SAR
    const FREELANCER_COST_PER_PROJECT = DOMAIN_COST + FREELANCER_MANAGER_COST + FREELANCER_COST; // 460 SAR

    // Calculate how many projects needed to break even (cover campaign with profit)
    const inHouseBreakEven = Math.ceil(price / IN_HOUSE_PROFIT_PER_PROJECT);
    const freelancerBreakEven = Math.ceil(price / FREELANCER_PROFIT_PER_PROJECT);
    
    // Calculate costs and revenues for break-even
    const inHouseCost = inHouseBreakEven * IN_HOUSE_COST_PER_PROJECT;
    const freelancerCost = freelancerBreakEven * FREELANCER_COST_PER_PROJECT;
    const inHouseRevenue = inHouseBreakEven * PROJECT_REVENUE;
    const freelancerRevenue = freelancerBreakEven * PROJECT_REVENUE;

    setResult({
      campaignPrice: price,
      inHouseBreakEven,
      freelancerBreakEven,
      inHouseCost,
      freelancerCost,
      inHouseRevenue,
      freelancerRevenue
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
              Enter your TikTok ad campaign budget to calculate break-even projects
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
                <li>Project revenue: 890 SAR</li>
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
                Break-Even Analysis
              </CardTitle>
              <CardDescription>
                Projects needed to break even with {result.campaignPrice.toLocaleString()} SAR campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* In-House Projects */}
              <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-lg text-blue-900 dark:text-blue-100">In-House Projects</h4>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{result.inHouseBreakEven} Projects</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex justify-between">
                      <span>Total Cost:</span>
                      <span className="font-semibold">{result.inHouseCost.toLocaleString()} SAR</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Revenue:</span>
                      <span className="font-semibold">{result.inHouseRevenue.toLocaleString()} SAR</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-green-600">
                      <span>Profit:</span>
                      <span className="font-bold">{(result.inHouseRevenue - result.inHouseCost).toLocaleString()} SAR</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Margin:</span>
                      <span className="font-bold">{(((result.inHouseRevenue - result.inHouseCost) / result.inHouseRevenue) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Freelancer Projects */}
              <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-lg text-green-900 dark:text-green-100">Freelancer Projects</h4>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">{result.freelancerBreakEven} Projects</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex justify-between">
                      <span>Total Cost:</span>
                      <span className="font-semibold">{result.freelancerCost.toLocaleString()} SAR</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Revenue:</span>
                      <span className="font-semibold">{result.freelancerRevenue.toLocaleString()} SAR</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-green-600">
                      <span>Profit:</span>
                      <span className="font-bold">{(result.freelancerRevenue - result.freelancerCost).toLocaleString()} SAR</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Margin:</span>
                      <span className="font-bold">{(((result.freelancerRevenue - result.freelancerCost) / result.freelancerRevenue) * 100).toFixed(1)}%</span>
                    </div>
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
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Project Economics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground mb-2">
                    <strong>In-House Projects:</strong> Cost 100 SAR per project (domain). 
                    Profit: 790 SAR per project.
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2">
                    <strong>Freelancer Projects:</strong> Cost 460 SAR per project (100 domain + 50 manager + 310 freelancer). 
                    Profit: 430 SAR per project.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Example: 1,290 SAR Campaign</h4>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p><strong>In-House Break-Even:</strong> Need 2 projects (Cost: 200 SAR, Revenue: 1,780 SAR, Profit: 1,580 SAR)</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p><strong>Freelancer Break-Even:</strong> Need 3 projects (Cost: 1,380 SAR, Revenue: 2,670 SAR, Profit: 1,290 SAR)</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
