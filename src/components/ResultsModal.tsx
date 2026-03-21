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
import { ReturnsBarChart } from "@/components/ReturnsBarChart";
import {
  TrendingUp,
  Shield,
  DollarSign,
  X,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  PieChart,
} from "lucide-react";
import type { InvestmentResult } from "@/lib/investment-model";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ResultsModalProps {
  result: InvestmentResult;
  isOpen: boolean;
  onClose: () => void;
}

export function ResultsModal({ result, isOpen, onClose }: ResultsModalProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto sm:max-w-[95vw] sm:max-h-[85vh] px-0 sm:px-0">
        <DialogHeader className="px-3 sm:px-4">
          <DialogTitle className="text-2xl font-display flex items-center gap-2 text-foreground">
            <TrendingUp className="h-6 w-6 text-primary" />
            Investment Strategy Results
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm sm:text-base">
            Personalized investment recommendations based on your investor
            profile
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 px-3 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Left Column - Charts */}
            <div className="space-y-6">
              {/* Projected Returns Bar Chart */}
              <Card className="border">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-display font-semibold text-foreground">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Projected Returns (5 Years)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ReturnsBarChart
                    projections={result.projections}
                    initialInvestment={result.suggestedInvestment}
                  />
                </CardContent>
              </Card>

              {/* Asset Allocation Chart */}
              <Card className="border">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-display font-semibold text-foreground">
                    <PieChart className="h-5 w-5 text-primary" />
                    Asset Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <AllocationChart
                    data={result.allocation}
                    title="Recommended Indian Market Asset Allocation"
                  />

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                      Allocation Details
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
                              {item.name}: {item.percentage.toFixed(2)}%
                            </span>
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-muted-foreground pl-7 sm:pl-0">
                            ₹{item.amount?.toLocaleString("en-IN")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Information */}
            <div className="space-y-6">
              {/* Suggested Investment */}
              <Card className="border">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-display font-semibold text-foreground">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Suggested Investment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      Recommended amount:{" "}
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                        ₹{result.suggestedInvestment.toLocaleString("en-IN")}
                      </span>
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Range: ₹
                      {result.investmentRange[0].toLocaleString("en-IN")} – ₹
                      {result.investmentRange[1].toLocaleString("en-IN")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Analysis */}
              <Card className="border">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-display font-semibold text-foreground">
                    <Shield className="h-5 w-5 text-primary" />
                    Risk Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Expected Annual Return
                      </p>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
                        {result.expectedReturn}%
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

              {/* Why This Recommendation? - Expandable Section */}
              <Card className="border">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-display font-semibold text-foreground">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Why This Recommendation?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="factors">
                      <AccordionTrigger className="text-foreground hover:text-primary">
                        <span className="flex items-center gap-2">
                          Click to see detailed factor analysis
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="rounded-lg bg-muted/30 p-4 border border-muted">
                            <h4 className="font-semibold text-foreground mb-2">
                              Strategy Explanation
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {result.strategy}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-semibold text-foreground">
                              Factor Analysis
                            </h4>
                            <ul className="space-y-2">
                              {result.factorExplanations.map(
                                (explanation, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2 text-sm"
                                  >
                                    <span className="text-primary mt-1">•</span>
                                    <span className="text-foreground">
                                      {explanation}
                                    </span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>

                          {/* Crypto Eligibility Note */}
                          {result.allocation.some((item) =>
                            item.name.includes("Crypto"),
                          ) && (
                            <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-3 border border-purple-200 dark:border-purple-800">
                              <p className="text-sm text-purple-800 dark:text-purple-200">
                                <strong>Crypto Note:</strong> Crypto allocation
                                included as you're under 45 with financial
                                market awareness. This is a high-risk,
                                high-potential component.
                              </p>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl font-display font-semibold text-foreground">
                    Important Disclaimer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-warning/15 border border-warning/30 p-4">
                    <p className="text-sm text-warning-foreground">
                      This model is for academic purposes only and does not
                      constitute financial advice. Past performance does not
                      guarantee future results. Consult with a certified
                      financial advisor before making investment decisions.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Close Button */}
              <div className="pt-2">
                <Button
                  onClick={onClose}
                  className="w-full py-3 sm:py-2 text-base sm:text-sm bg-primary hover:bg-primary/90 transition-colors"
                >
                  Close Results
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
