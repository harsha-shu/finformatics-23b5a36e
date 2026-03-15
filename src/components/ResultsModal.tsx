import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AllocationChart } from "@/components/AllocationChart";
import { TrendingUp, Shield, DollarSign, X } from "lucide-react";
import type { InvestmentResult } from "@/lib/investment-model";

interface ResultsModalProps {
  result: InvestmentResult;
  isOpen: boolean;
  onClose: () => void;
}

export function ResultsModal({ result, isOpen, onClose }: ResultsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-w-[95vw] sm:max-h-[85vh] px-0 sm:px-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Investment Strategy Results
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm sm:text-base">
            Personalized investment recommendations based on your investor
            profile
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 py-4 px-3 sm:px-4">
          {/* Risk Analysis */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Shield className="h-5 w-5 text-primary" />
                Risk Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Expected Annual Return (%)
                  </p>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
                    {result.expectedReturn}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Investor Category
                  </p>
                  <p className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
                    {result.category}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Recommendation */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <TrendingUp className="h-5 w-5 text-primary" />
                Investment Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                  Recommended Asset Allocation
                </h3>
                <ul className="space-y-2">
                  {result.allocation.map((item, i) => (
                    <li
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center justify-between text-foreground gap-2 sm:gap-0"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs sm:text-sm md:text-base">
                          {item.name}: {item.percentage}%
                        </span>
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-muted-foreground pl-7 sm:pl-0">
                        ₹{item.amount?.toLocaleString("en-IN")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-info p-3 sm:p-4 border border-info/30">
                <p className="text-xs sm:text-sm text-info-foreground">
                  {result.strategy}
                </p>
              </div>

              <AllocationChart
                data={result.allocation}
                title="Recommended Indian Market Asset Allocation"
              />
            </CardContent>
          </Card>

          {/* Suggested Investment */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <DollarSign className="h-5 w-5 text-primary" />
                Suggested Investment Amount
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Suggested investment:{" "}
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                    ₹{result.suggestedInvestment.toLocaleString("en-IN")}
                  </span>
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Range: ₹{result.investmentRange[0].toLocaleString("en-IN")} –
                  ₹{result.investmentRange[1].toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-lg bg-warning/15 border border-warning/30 p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-warning-foreground">
                  Disclaimer: This model is for academic purposes only and does
                  not constitute financial advice.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Close Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={onClose}
              className="px-6 py-4 sm:py-3 w-full sm:w-auto text-base sm:text-sm min-h-[44px] sm:min-h-0"
            >
              Close Results
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
