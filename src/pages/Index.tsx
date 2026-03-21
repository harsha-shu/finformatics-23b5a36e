import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvestorForm, type InvestorProfile } from "@/components/InvestorForm";
import { ResultsModal } from "@/components/ResultsModal";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  computeInvestment,
  type InvestmentResult,
} from "@/lib/investment-model";
import {
  TrendingUp,
  Shield,
  DollarSign,
  User,
  Calculator,
  Sparkles,
  BarChart,
} from "lucide-react";
import logo from "@/assets/logo.png";
import Lottie from "lottie-react";
import loadingAnimation from "@/assets/loading-spinner.json";
import { Button } from "@/components/ui/button";

const DEFAULT_PROFILE: InvestorProfile = {
  name: "",
  age: 18,
  educationBackground: "Commerce",
  income: "0-25K",
  sourceOfIncome: "Salary",
  awareOfFinancialMarkets: false,
  riskAppetite: 5,
  capitalRange: "0-25K",
};

const Index = () => {
  const [profile, setProfile] = useState<InvestorProfile>(DEFAULT_PROFILE);

  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedResult, setCalculatedResult] =
    useState<InvestmentResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const prevProfileRef = useRef<InvestorProfile>(profile);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCalculate = () => {
    setIsCalculating(true);
    setIsModalOpen(false); // Close any open modal before calculation

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Simulate calculation delay for better UX
    timeoutRef.current = setTimeout(() => {
      const result = computeInvestment(profile);
      setCalculatedResult(result);
      setIsCalculating(false);
      setIsModalOpen(true); // Open modal when calculation completes
      timeoutRef.current = null;
    }, 800); // 0.8 second delay to show loading animation
  };

  const handleReset = () => {
    setCalculatedResult(null);
    setIsModalOpen(false);
    setIsCalculating(false);
    setProfile(DEFAULT_PROFILE);

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleProfileChange = useCallback((newProfile: InvestorProfile) => {
    setProfile(newProfile);
    // Note: Reset logic moved to useEffect below to prevent interference with user input
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Effect to reset results when relevant profile fields change (excluding name)
  useEffect(() => {
    if (!calculatedResult) {
      prevProfileRef.current = profile;
      return;
    }

    // Check if any calculation-relevant fields changed (excluding name)
    const prev = prevProfileRef.current;
    const relevantFields: (keyof InvestorProfile)[] = [
      "age",
      "educationBackground",
      "income",
      "sourceOfIncome",
      "awareOfFinancialMarkets",
      "riskAppetite",
      "capitalRange",
    ];

    const hasRelevantChange = relevantFields.some(
      (field) => profile[field] !== prev[field],
    );

    if (hasRelevantChange) {
      setCalculatedResult(null);
      setIsModalOpen(false);
    }

    prevProfileRef.current = profile;
  }, [profile, calculatedResult]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const result = calculatedResult;

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Editorial Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-7xl py-3 sm:py-4 px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-1.5 sm:p-2 rounded-md">
                <img
                  src={logo}
                  alt="finformatics logo"
                  className="h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-foreground">
                    finformatics
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                  Predictive Modeling for Retail Wealth Diversification
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block border border-border rounded-md px-3 py-1.5 sm:px-4 sm:py-2 bg-card/50">
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  Intelligent Investment Advisory
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="container max-w-7xl py-6 sm:py-8 px-4 sm:px-6 pb-24 sm:pb-32 animate-fade-in"
      >
        {/* Tool Description */}
        <div className="mb-8 sm:mb-10">
          <p className="text-lg sm:text-xl font-display font-semibold text-foreground mb-2">
            AI-powered investment advisory platform for personalized wealth
            management
          </p>
          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
            Get customized portfolio recommendations based on your financial
            profile, risk tolerance, and market insights
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Full Form (Split internally) */}
          <div className="lg:col-span-2">
            <div className="animate-fade-in bg-card border rounded-lg overflow-hidden hover:border-primary/50 transition-colors duration-200">
              <div className="p-6 pb-4">
                <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-display font-semibold text-foreground">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  Investor Profile
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Complete your financial profile (use tabs on mobile)
                </p>
              </div>
              <div className="p-6 pt-0">
                <InvestorForm
                  profile={profile}
                  onChange={handleProfileChange}
                />

                {/* Calculate Button */}
                <div className="pt-6 sm:pt-8 mt-4 sm:mt-6 border-t">
                  <Button
                    onClick={handleCalculate}
                    disabled={isCalculating}
                    className="w-full py-4 sm:py-6 text-base sm:text-lg font-semibold bg-primary hover:bg-primary/90 transition-colors text-primary-foreground min-h-[56px] sm:min-h-[64px]"
                    size="lg"
                  >
                    {isCalculating ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-6 w-6">
                          <Lottie
                            animationData={loadingAnimation}
                            loop={true}
                            style={{ height: 24, width: 24 }}
                          />
                        </div>
                        <span>Calculating Investment Strategy...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <Calculator className="h-6 w-6" />
                        <span>Calculate Investment Strategy</span>
                      </div>
                    )}
                  </Button>
                </div>

                {/* Reset Button */}
                {result && (
                  <div className="pt-4">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="w-full py-3 sm:py-2"
                      disabled={isCalculating}
                    >
                      Reset & Start Over
                    </Button>
                  </div>
                )}

                {/* Status Message */}
                {!result && !isCalculating && (
                  <div className="rounded-lg bg-muted/30 p-3 sm:p-4 border border-dashed mt-4 sm:mt-6">
                    <p className="text-xs sm:text-sm text-center text-muted-foreground">
                      Complete all fields and click "Calculate Investment
                      Strategy" to generate personalized recommendations in a
                      pop-up modal.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Information Panel */}
          <div className="mt-6 sm:mt-0">
            <div className="animate-fade-in bg-card border rounded-lg h-full p-6 hover:border-primary/50 transition-colors duration-200 animation-delay-100">
              <div className="pb-4">
                <h2 className="flex items-center gap-2 text-lg sm:text-xl font-display font-semibold text-foreground">
                  <BarChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  How It Works
                </h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">
                        Risk Assessment
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Your age, risk appetite, and market awareness determine
                        your investor category and expected returns.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">
                        Asset Allocation
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Based on your risk profile, we recommend a diversified
                        mix of Indian market instruments.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                      <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">
                        Investment Amount
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Suggested investment ranges are tailored to your capital
                        availability and risk tolerance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-info/20 p-3 sm:p-4 border border-info/30">
                  <h4 className="font-semibold text-info-foreground text-sm sm:text-base mb-1.5 sm:mb-2">
                    Real-time Calculation
                  </h4>
                  <p className="text-xs sm:text-sm text-info-foreground">
                    Click the calculate button to see personalized
                    recommendations in a detailed pop-up modal. No need to
                    scroll!
                  </p>
                </div>

                {result && (
                  <div className="rounded-lg bg-primary/10 p-3 sm:p-4 border border-primary/20">
                    <h4 className="font-semibold text-foreground text-sm sm:text-base mb-1.5 sm:mb-2">
                      Results Ready
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                      Your investment strategy has been calculated. Click below
                      to view.
                    </p>
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full py-2 sm:py-1.5"
                      size="sm"
                    >
                      View Results Again
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Calculate Button for Mobile */}
        <div className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4">
          <Button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full py-4 text-lg font-semibold bg-primary hover:bg-primary/90 transition-colors text-primary-foreground min-h-[56px]"
            size="lg"
          >
            {isCalculating ? (
              <div className="flex items-center justify-center gap-3">
                <div className="h-6 w-6">
                  <Lottie
                    animationData={loadingAnimation}
                    loop={true}
                    style={{ height: 24, width: 24 }}
                  />
                </div>
                <span>Calculating...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Calculator className="h-6 w-6" />
                <span>Calculate Strategy</span>
              </div>
            )}
          </Button>
        </div>
      </main>

      {/* Results Modal */}
      {result && (
        <ResultsModal
          result={result}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Index;
