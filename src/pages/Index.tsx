import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvestorForm, type InvestorProfile } from "@/components/InvestorForm";
import { AllocationChart } from "@/components/AllocationChart";
import { computeInvestment } from "@/lib/investment-model";
import { TrendingUp, Shield, DollarSign, User } from "lucide-react";

const Index = () => {
  const [profile, setProfile] = useState<InvestorProfile>({
    name: "",
    age: 30,
    educationBackground: "Commerce",
    income: "25K-75K",
    sourceOfIncome: "Salary",
    awareOfFinancialMarkets: true,
    riskAppetite: 8,
    capitalRange: "25K-50K",
  });

  const result = useMemo(() => computeInvestment(profile), [profile]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container max-w-5xl py-6">
          <p className="text-sm text-primary font-medium tracking-wide uppercase">
            Investor Profiling and Multi-Factor Risk-Based Investment Model
          </p>
        </div>
      </header>

      <main className="container max-w-5xl py-8 space-y-8">
        {/* Investor Details */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <User className="h-6 w-6 text-primary" />
              Investor Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InvestorForm profile={profile} onChange={setProfile} />
          </CardContent>
        </Card>

        {/* Risk Analysis */}
        <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Shield className="h-6 w-6 text-primary" />
              Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Expected Annual Return (%)</p>
                <p className="text-4xl font-display font-bold text-foreground">
                  {result.expectedReturn}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Investor Category</p>
                <p className="text-lg font-semibold text-foreground">
                  {result.category}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Recommendation */}
        <Card className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TrendingUp className="h-6 w-6 text-primary" />
              Investment Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Asset Allocation List with amounts */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Recommended Asset Allocation</h3>
              <ul className="space-y-2">
                {result.allocation.map((item, i) => (
                  <li key={i} className="flex items-center justify-between text-foreground">
                    <span className="flex items-center gap-3">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}: {item.percentage}%
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">
                      ₹{item.amount?.toLocaleString("en-IN")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strategy callout */}
            <div className="rounded-lg bg-info p-4">
              <p className="text-sm text-info-foreground">{result.strategy}</p>
            </div>

            {/* Pie Chart */}
            <AllocationChart
              data={result.allocation}
              title="Recommended Indian Market Asset Allocation"
            />
          </CardContent>
        </Card>

        {/* Suggested Investment */}
        <Card className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <DollarSign className="h-6 w-6 text-primary" />
              Suggested Investment Amount
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Suggested investment:{" "}
                <span className="text-2xl font-bold text-foreground">
                  ₹{result.suggestedInvestment.toLocaleString("en-IN")}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Range: ₹{result.investmentRange[0].toLocaleString("en-IN")} – ₹{result.investmentRange[1].toLocaleString("en-IN")}
              </p>
            </div>

            <div className="rounded-lg bg-warning/15 border border-warning/30 p-4">
              <p className="text-sm text-warning-foreground">
                Disclaimer: This model is for academic purposes only and does not constitute financial advice.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
