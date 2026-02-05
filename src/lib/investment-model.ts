import type { InvestorProfile } from "@/components/InvestorForm";

interface AllocationItem {
  name: string;
  percentage: number;
  color: string;
}

export interface InvestmentResult {
  expectedReturn: number;
  category: string;
  allocation: AllocationItem[];
  strategy: string;
  investmentRange: [number, number];
}

export function computeInvestment(profile: InvestorProfile): InvestmentResult {
  const { age, riskAppetite, capitalRange } = profile;

  // Determine investor category
  let category: string;
  if (age <= 30) {
    category = "Young Investor";
  } else if (age <= 50) {
    category = "Mid-Career Investor";
  } else {
    category = "Conservative Investor";
  }

  // Compute expected return based on risk & age
  const baseReturn = 6 + (riskAppetite / 50) * 8;
  const ageFactor = age <= 30 ? 1.0 : age <= 50 ? 0.9 : 0.8;
  const expectedReturn = Math.round(baseReturn * ageFactor * 100) / 100;

  // Allocation logic
  let allocation: AllocationItem[];
  let strategy: string;

  if (age <= 30 && riskAppetite > 25) {
    allocation = [
      { name: "S&P 500 ETF", percentage: 60, color: "hsl(210, 70%, 50%)" },
      { name: "US Growth Stocks", percentage: 34, color: "hsl(28, 85%, 55%)" },
      { name: "US Bonds", percentage: 6, color: "hsl(145, 55%, 42%)" },
    ];
    strategy = "Aggressive growth strategy for long-term wealth accumulation.";
  } else if (age <= 30) {
    allocation = [
      { name: "US Treasury Bonds", percentage: 60, color: "hsl(210, 70%, 50%)" },
      { name: "S&P 500 ETF", percentage: 40, color: "hsl(28, 85%, 55%)" },
    ];
    strategy = "Balanced growth strategy with safety net.";
  } else if (age <= 50 && riskAppetite > 20) {
    allocation = [
      { name: "S&P 500 ETF", percentage: 45, color: "hsl(210, 70%, 50%)" },
      { name: "US Bonds", percentage: 30, color: "hsl(28, 85%, 55%)" },
      { name: "US Growth Stocks", percentage: 25, color: "hsl(145, 55%, 42%)" },
    ];
    strategy = "Growth-oriented strategy with moderate risk.";
  } else if (age <= 50) {
    allocation = [
      { name: "US Bonds", percentage: 50, color: "hsl(210, 70%, 50%)" },
      { name: "S&P 500 ETF", percentage: 30, color: "hsl(28, 85%, 55%)" },
      { name: "US Stocks", percentage: 20, color: "hsl(145, 55%, 42%)" },
    ];
    strategy = "Moderate strategy balancing safety and growth.";
  } else {
    allocation = [
      { name: "US Treasury Bonds", percentage: 70, color: "hsl(210, 70%, 50%)" },
      { name: "Dividend-Paying US Stocks", percentage: 30, color: "hsl(28, 85%, 55%)" },
    ];
    strategy = "Conservative income-focused strategy.";
  }

  // Investment range based on capital
  let investmentRange: [number, number];
  switch (capitalRange) {
    case "0-25K": investmentRange = [1000, 5000]; break;
    case "25K-50K": investmentRange = [5000, 10000]; break;
    case "50K-75K": investmentRange = [5000, 10000]; break;
    default: investmentRange = [10000, 25000]; break;
  }

  return { expectedReturn, category, allocation, strategy, investmentRange };
}
