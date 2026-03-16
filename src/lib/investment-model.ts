import type { InvestorProfile } from "@/components/InvestorForm";

interface AllocationItem {
  name: string;
  percentage: number;
  color: string;
  amount?: number;
}

export interface YearlyProjection {
  year: number;
  return: number;
  cumulativeValue: number;
}

export interface InvestmentResult {
  expectedReturn: number;
  category: string;
  allocation: AllocationItem[];
  strategy: string;
  investmentRange: [number, number];
  suggestedInvestment: number;
  projections: YearlyProjection[];
  factorExplanations: string[];
}

function getKnowledgeFactor(
  educationBackground: string,
  awareOfFinancialMarkets: boolean,
): number {
  // Base factor based on education background
  let baseFactor: number;
  switch (educationBackground) {
    case "Commerce":
    case "B.B.A / Hotel Management":
    case "M.B.A / Ph.D.":
    case "CA/CS":
      baseFactor = 1.1;
      break;
    case "B.Tech":
    case "Science":
    case "Medicine":
      baseFactor = 1.05;
      break;
    case "Arts/Humanities":
    case "Law":
    case "Diploma":
    case "Others":
      baseFactor = 1.0;
      break;
    case "No Formal Education":
      baseFactor = 0.9;
      break;
    default:
      baseFactor = 1.0;
  }

  // Awareness factor
  const awarenessFactor = awareOfFinancialMarkets ? 1.0 : 0.9;

  return Math.round(baseFactor * awarenessFactor * 100) / 100;
}

function getStabilityFactor(sourceOfIncome: string, income: string): number {
  let sourceFactor: number;
  switch (sourceOfIncome) {
    case "Salary":
      sourceFactor = 1.05; // Stable regular income
      break;
    case "Self-employed":
      sourceFactor = 0.95; // Variable income
      break;
    case "Retirement Funds":
      sourceFactor = 1.0; // Stable but fixed
      break;
    case "Savings":
      sourceFactor = 0.9; // No active income
      break;
    default:
      sourceFactor = 1.0;
  }

  // Income range factor
  let incomeFactor: number;
  switch (income) {
    case "0-25K":
      incomeFactor = 0.9; // Low income
      break;
    case "25K-75K":
      incomeFactor = 1.0; // Moderate income
      break;
    case "75K-125K":
      incomeFactor = 1.05; // Good income
      break;
    case "More than 125K":
      incomeFactor = 1.1; // High income
      break;
    default:
      incomeFactor = 1.0;
  }

  // Combined stability factor (weighted average: 60% source, 40% income)
  const combinedFactor = sourceFactor * 0.6 + incomeFactor * 0.4;
  return Math.round(combinedFactor * 100) / 100;
}

function getAllocationAndStrategy(
  age: number,
  adjustedRiskAppetite: number,
  knowledgeFactor: number,
  stabilityFactor: number,
  combinedFactor: number,
): { allocation: AllocationItem[]; strategy: string } {
  // Fine-grained allocation based on multiple factors
  // Age factor: younger investors can take more risk
  const ageRiskFactor =
    age <= 30 ? 1.2 : age <= 45 ? 1.0 : age <= 60 ? 0.8 : 0.6;

  // Education factor: higher financial literacy supports complex investments
  const educationFactor =
    knowledgeFactor >= 1.1 ? 1.1 : knowledgeFactor >= 1.05 ? 1.05 : 1.0;

  // Stability factor: stable income allows for longer-term investments
  const incomeStabilityFactor =
    stabilityFactor >= 1.05 ? 1.05 : stabilityFactor >= 1.0 ? 1.0 : 0.95;

  // Combined adjustment factor
  const adjustmentFactor =
    (ageRiskFactor * educationFactor * incomeStabilityFactor) /
    (1.0 * 1.0 * 1.0);

  // Crypto eligibility: only for investors under 45 with moderate+ risk and financial awareness
  const includeCrypto =
    age < 45 && adjustedRiskAppetite >= 8 && knowledgeFactor >= 1.0;

  let baseAllocation: AllocationItem[];
  let baseStrategy: string;

  if (adjustedRiskAppetite >= 15) {
    // High risk
    baseAllocation = [
      {
        name: "Equity (Large Cap)",
        percentage: 25,
        color: "hsl(211, 86%, 45%)",
      },
      {
        name: "Equity (Mid & Small Cap)",
        percentage: 15,
        color: "hsl(211, 70%, 55%)",
      },
      {
        name: "Gold Funds / Sovereign Gold Bonds",
        percentage: 15,
        color: "hsl(35, 92%, 55%)",
      },
      { name: "Government Bonds", percentage: 20, color: "hsl(142, 72%, 46%)" },
      { name: "Corporate Bonds", percentage: 15, color: "hsl(168, 84%, 38%)" },
      { name: "Fixed Deposits", percentage: 10, color: "hsl(200, 84%, 38%)" },
    ];
    baseStrategy = `Aggressive growth strategy with emphasis on equities. Higher allocation to mid/small caps for potential high returns. ${knowledgeFactor >= 1.1 ? "Your financial education supports understanding of market risks and opportunities." : ""} ${stabilityFactor >= 1.05 ? "Your stable income provides cushion for market volatility." : ""}`;
  } else if (adjustedRiskAppetite >= 8) {
    // Moderate risk
    baseAllocation = [
      {
        name: "Equity (Large Cap & Index Funds)",
        percentage: 25,
        color: "hsl(211, 86%, 45%)",
      },
      { name: "Government Bonds", percentage: 25, color: "hsl(142, 72%, 46%)" },
      {
        name: "Gold Funds / Sovereign Gold Bonds",
        percentage: 15,
        color: "hsl(35, 92%, 55%)",
      },
      { name: "Corporate Bonds", percentage: 15, color: "hsl(168, 84%, 38%)" },
      { name: "Fixed Deposits", percentage: 20, color: "hsl(200, 84%, 38%)" },
    ];
    baseStrategy = `Balanced strategy with equity-debt mix. Suitable for moderate risk tolerance with steady growth. ${knowledgeFactor >= 1.0 ? "Your educational background helps in understanding balanced portfolios." : ""} ${stabilityFactor >= 1.0 ? "Your income stability supports regular investments." : ""}`;
  } else {
    // Low risk
    baseAllocation = [
      { name: "Government Bonds", percentage: 30, color: "hsl(142, 72%, 46%)" },
      { name: "Fixed Deposits", percentage: 25, color: "hsl(200, 84%, 38%)" },
      {
        name: "Gold Funds / Sovereign Gold Bonds",
        percentage: 20,
        color: "hsl(35, 92%, 55%)",
      },
      { name: "Corporate Bonds", percentage: 15, color: "hsl(168, 84%, 38%)" },
      {
        name: "Equity (Large Cap & Dividend Stocks)",
        percentage: 10,
        color: "hsl(211, 86%, 45%)",
      },
    ];
    baseStrategy = `Conservative income-focused strategy. Emphasis on capital preservation with stable returns. ${knowledgeFactor < 1.0 ? "Consider financial literacy programs before exploring complex instruments." : ""} ${stabilityFactor < 1.0 ? "Build emergency fund covering 6-12 months expenses first." : ""}`;
  }

  // Adjust percentages based on combined factors
  const adjustedAllocation = baseAllocation.map((item) => ({
    ...item,
    percentage: Math.round(item.percentage * adjustmentFactor * 100) / 100,
  }));

  // Normalize percentages to sum to 100
  const totalPercentage = adjustedAllocation.reduce(
    (sum, item) => sum + item.percentage,
    0,
  );
  const normalizedAllocation = adjustedAllocation.map((item) => ({
    ...item,
    percentage: Math.round((item.percentage / totalPercentage) * 100),
  }));

  // Add crypto allocation if eligible (reallocates from equity)
  let finalAllocation = normalizedAllocation;
  let cryptoStrategy = "";

  if (includeCrypto) {
    // Find all equity items and reduce proportionally by 5%
    const equityItems = finalAllocation.filter((item) =>
      item.name.includes("Equity"),
    );

    if (equityItems.length > 0) {
      const totalEquityPercentage = equityItems.reduce(
        (sum, item) => sum + item.percentage,
        0,
      );

      // Ensure we don't reduce equity below 0 and avoid division by zero
      const cryptoAllocation = Math.min(5, totalEquityPercentage);

      if (cryptoAllocation > 0 && totalEquityPercentage > 0) {
        // Reduce each equity item proportionally
        equityItems.forEach((item) => {
          const itemIndex = finalAllocation.findIndex((i) => i === item);
          const reduction =
            (item.percentage / totalEquityPercentage) * cryptoAllocation;
          finalAllocation[itemIndex].percentage =
            Math.round((item.percentage - reduction) * 100) / 100;
        });

        // Add crypto allocation
        finalAllocation.push({
          name: "Crypto (Bitcoin/ETH - High Risk)",
          percentage: Math.round(cryptoAllocation * 100) / 100,
          color: "hsl(280, 86%, 45%)",
        });

        cryptoStrategy = ` Includes ${cryptoAllocation.toFixed(1)}% crypto allocation (high-risk, high-potential) suitable for younger investors with financial market awareness.`;
      }
    }
  }

  // Final normalization to ensure sum is 100
  const finalTotal = finalAllocation.reduce(
    (sum, item) => sum + item.percentage,
    0,
  );
  // Use tolerance for floating point errors
  if (Math.abs(finalTotal - 100) > 0.001) {
    const diff = 100 - finalTotal;
    const equityIndex = finalAllocation.findIndex((item) =>
      item.name.includes("Equity"),
    );
    if (equityIndex !== -1) {
      finalAllocation[equityIndex].percentage = Math.round((finalAllocation[equityIndex].percentage + diff) * 100) / 100;
    }
  }

  const strategy = `${baseStrategy}${cryptoStrategy} ${combinedFactor >= 1.1 ? "Your overall profile indicates strong capacity for growth-oriented investments." : combinedFactor < 0.95 ? "Focus on stability-building before aggressive growth." : ""}`;

  return { allocation: finalAllocation, strategy };
}

function getEducationImpact(educationBackground: string): string {
  switch (educationBackground) {
    case "Commerce":
    case "B.B.A / Hotel Management":
    case "M.B.A / Ph.D.":
    case "CA/CS":
      return "High financial literacy - supports complex investments";
    case "B.Tech":
    case "Science":
    case "Medicine":
      return "Medium-high - technical background aids understanding";
    case "Arts/Humanities":
    case "Law":
    case "Diploma":
    case "Others":
      return "Medium - general understanding";
    case "No Formal Education":
      return "Low - consider basic financial education";
    default:
      return "Medium - general understanding";
  }
}

function getIncomeImpact(income: string, source: string): string {
  const incomeMap: Record<string, string> = {
    "0-25K": "Low income - focus on essentials first",
    "25K-75K": "Moderate income - capacity for regular investments",
    "75K-125K": "Good income - can allocate more to investments",
    "More than 125K": "High income - significant investment capacity",
  };

  const sourceMap: Record<string, string> = {
    Salary: "Stable regular income - predictable cash flow",
    "Self-employed": "Variable income - need emergency buffer",
    "Retirement Funds": "Fixed income - capital preservation important",
    Savings: "No active income - focus on capital protection",
  };

  return `${incomeMap[income] || "Moderate income"}. ${sourceMap[source] || "Regular income"}`;
}

function generateProjections(
  initialInvestment: number,
  expectedReturn: number,
  years: number = 5,
): YearlyProjection[] {
  const projections: YearlyProjection[] = [];
  let cumulativeValue = initialInvestment;

  for (let year = 1; year <= years; year++) {
    // Add some randomness to simulate market volatility (±2%)
    const annualReturn = expectedReturn + (Math.random() * 4 - 2);
    const yearlyReturn = cumulativeValue * (annualReturn / 100);
    cumulativeValue += yearlyReturn;

    projections.push({
      year,
      return: Math.round(annualReturn * 100) / 100,
      cumulativeValue: Math.round(cumulativeValue),
    });
  }

  return projections;
}

export function computeInvestment(profile: InvestorProfile): InvestmentResult {
  const {
    age,
    riskAppetite,
    capitalRange,
    awareOfFinancialMarkets,
    income,
    educationBackground,
    sourceOfIncome,
  } = profile;

  // Determine investor category with more granularity
  let category: string;
  if (age <= 25) {
    category = "Very Young Investor";
  } else if (age <= 35) {
    category = "Young Investor";
  } else if (age <= 45) {
    category = "Early Mid-Career Investor";
  } else if (age <= 55) {
    category = "Mid-Career Investor";
  } else if (age <= 65) {
    category = "Late Career Investor";
  } else {
    category = "Conservative Investor";
  }

  // Compute knowledge factor based on education and market awareness
  const knowledgeFactor = getKnowledgeFactor(
    educationBackground,
    awareOfFinancialMarkets,
  );

  // Compute stability factor based on source of income and income range
  const stabilityFactor = getStabilityFactor(sourceOfIncome, income);

  // Combined factor incorporating knowledge and stability
  const combinedFactor =
    Math.round(knowledgeFactor * stabilityFactor * 100) / 100;

  // Compute expected return based on risk (0-20), age, knowledge, and stability
  const baseReturn = 6 + (riskAppetite / 20) * 8;
  const ageFactor = age <= 30 ? 1.0 : age <= 50 ? 0.9 : 0.8;
  const expectedReturn =
    Math.round(baseReturn * ageFactor * combinedFactor * 100) / 100;

  // Investment range based on capital
  let investmentRange: [number, number];
  switch (capitalRange) {
    case "0-25K":
      investmentRange = [5000, 25000];
      break;
    case "25K-50K":
      investmentRange = [25000, 50000];
      break;
    case "50K-75K":
      investmentRange = [50000, 75000];
      break;
    default:
      investmentRange = [75000, 200000];
      break;
  }

  // Suggested investment (midpoint adjusted by risk)
  const riskRatio = riskAppetite / 20;
  const suggestedInvestment = Math.round(
    investmentRange[0] + (investmentRange[1] - investmentRange[0]) * riskRatio,
  );

  // Adjust risk appetite based on combined factor (knowledge and stability)
  const adjustedRiskAppetite = Math.min(
    20,
    Math.max(0, riskAppetite * combinedFactor),
  );

  // Get fine-grained allocation and strategy
  const { allocation, strategy } = getAllocationAndStrategy(
    age,
    adjustedRiskAppetite,
    knowledgeFactor,
    stabilityFactor,
    combinedFactor,
  );

  // Add calculated amounts
  const allocationWithAmounts = allocation.map((item) => ({
    ...item,
    amount: Math.round((item.percentage / 100) * suggestedInvestment),
  }));

  // Generate 5-year projections
  const projections = generateProjections(
    suggestedInvestment,
    expectedReturn,
    5,
  );

  // Generate factor explanations
  const factorExplanations = [
    `Knowledge Factor: ${knowledgeFactor.toFixed(2)} (based on education: ${educationBackground} and ${awareOfFinancialMarkets ? "aware of" : "not aware of"} financial markets)`,
    `Stability Factor: ${stabilityFactor.toFixed(2)} (source: ${sourceOfIncome}, income: ${income})`,
    `Combined Factor: ${combinedFactor.toFixed(2)} (knowledge × stability)`,
    `Age Factor: ${age <= 30 ? "1.0 (young)" : age <= 50 ? "0.9 (mid-career)" : "0.8 (conservative)"}`,
    `Risk Adjustment: ${adjustedRiskAppetite.toFixed(1)} (original: ${riskAppetite}, adjusted by factors)`,
    `Education Impact: ${getEducationImpact(educationBackground)}`,
    `Income Impact: ${getIncomeImpact(income, sourceOfIncome)}`,
    `Market Awareness Impact: ${awareOfFinancialMarkets ? "Positive - better understanding of risks" : "Conservative - limited market knowledge"}`,
  ];

  return {
    expectedReturn,
    category,
    allocation: allocationWithAmounts,
    strategy,
    investmentRange,
    suggestedInvestment,
    projections,
    factorExplanations,
  };
}
