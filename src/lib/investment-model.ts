import type { InvestorProfile } from "@/components/InvestorForm";

interface AllocationItem {
  name: string;
  percentage: number;
  color: string;
  amount?: number;
}

export interface InvestmentResult {
  expectedReturn: number;
  category: string;
  allocation: AllocationItem[];
  strategy: string;
  investmentRange: [number, number];
  suggestedInvestment: number;
}

export function computeInvestment(profile: InvestorProfile): InvestmentResult {
  const { age, riskAppetite, capitalRange, awareOfFinancialMarkets, income } = profile;

  // Determine investor category
  let category: string;
  if (age <= 30) {
    category = "Young Investor";
  } else if (age <= 50) {
    category = "Mid-Career Investor";
  } else {
    category = "Conservative Investor";
  }

  // Compute expected return based on risk (0-20) & age
  const baseReturn = 6 + (riskAppetite / 20) * 8;
  const ageFactor = age <= 30 ? 1.0 : age <= 50 ? 0.9 : 0.8;
  const awarenessFactor = awareOfFinancialMarkets ? 1.0 : 0.9;
  const expectedReturn = Math.round(baseReturn * ageFactor * awarenessFactor * 100) / 100;

  // Investment range based on capital
  let investmentRange: [number, number];
  switch (capitalRange) {
    case "0-25K": investmentRange = [1000, 5000]; break;
    case "25K-50K": investmentRange = [5000, 15000]; break;
    case "50K-75K": investmentRange = [10000, 25000]; break;
    default: investmentRange = [20000, 50000]; break;
  }

  // Suggested investment (midpoint adjusted by risk)
  const midpoint = (investmentRange[0] + investmentRange[1]) / 2;
  const riskRatio = riskAppetite / 20;
  const suggestedInvestment = Math.round(
    investmentRange[0] + (investmentRange[1] - investmentRange[0]) * riskRatio
  );

  // Indian market allocation logic based on risk level and age
  let allocation: AllocationItem[];
  let strategy: string;

  if (riskAppetite >= 15) {
    // High risk
    allocation = [
      { name: "Stock Market (Mid Cap / Blue Chip)", percentage: 40, color: "hsl(210, 70%, 50%)" },
      { name: "Gold Funds / Sovereign Gold Bonds", percentage: 20, color: "hsl(45, 85%, 55%)" },
      { name: "Government Bonds", percentage: 25, color: "hsl(145, 55%, 42%)" },
      { name: "Fixed Deposits", percentage: 15, color: "hsl(28, 85%, 55%)" },
    ];
    strategy = "Aggressive growth strategy with diversified Indian market instruments. Higher equity allocation for long-term wealth accumulation.";
  } else if (riskAppetite >= 8) {
    // Moderate risk
    allocation = [
      { name: "Stock Market (Blue Chip / Large Cap)", percentage: 30, color: "hsl(210, 70%, 50%)" },
      { name: "Government Bonds", percentage: 30, color: "hsl(145, 55%, 42%)" },
      { name: "Gold Funds / Sovereign Gold Bonds", percentage: 20, color: "hsl(45, 85%, 55%)" },
      { name: "Fixed Deposits", percentage: 20, color: "hsl(28, 85%, 55%)" },
    ];
    strategy = "Balanced strategy with a mix of equities and safer instruments. Suitable for moderate risk tolerance.";
  } else {
    // Low risk
    allocation = [
      { name: "Government Bonds", percentage: 35, color: "hsl(145, 55%, 42%)" },
      { name: "Fixed Deposits", percentage: 30, color: "hsl(28, 85%, 55%)" },
      { name: "Gold Funds / Sovereign Gold Bonds", percentage: 20, color: "hsl(45, 85%, 55%)" },
      { name: "Stock Market (Large Cap / Index Funds)", percentage: 15, color: "hsl(210, 70%, 50%)" },
    ];
    strategy = "Conservative income-focused strategy. Emphasis on capital preservation with fixed-income and gold instruments.";
  }

  // Add calculated amounts
  allocation = allocation.map((item) => ({
    ...item,
    amount: Math.round((item.percentage / 100) * suggestedInvestment),
  }));

  return { expectedReturn, category, allocation, strategy, investmentRange, suggestedInvestment };
}
