import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResultsModal } from "./ResultsModal";
import type { InvestmentResult } from "@/lib/investment-model";

// Mock child components
vi.mock("@/components/AllocationChart", () => ({
  AllocationChart: vi.fn(() => <div data-testid="allocation-chart" />),
}));

vi.mock("@/components/ReturnsBarChart", () => ({
  ReturnsBarChart: vi.fn(() => <div data-testid="returns-bar-chart" />),
}));

vi.mock("@/components/ui/dialog", () => ({
  Dialog: vi.fn(({ children, open, onOpenChange }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  ),
  DialogContent: vi.fn(({ children, className }) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  )),
  DialogHeader: vi.fn(({ children, className }) => (
    <div data-testid="dialog-header" className={className}>
      {children}
    </div>
  )),
  DialogTitle: vi.fn(({ children, className }) => (
    <div data-testid="dialog-title" className={className}>
      {children}
    </div>
  )),
  DialogDescription: vi.fn(({ children, className }) => (
    <div data-testid="dialog-description" className={className}>
      {children}
    </div>
  )),
}));

vi.mock("@/components/ui/card", () => ({
  Card: vi.fn(({ children, className }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  )),
  CardContent: vi.fn(({ children, className }) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  )),
  CardHeader: vi.fn(({ children, className }) => (
    <div data-testid="card-header" className={className}>
      {children}
    </div>
  )),
  CardTitle: vi.fn(({ children, className }) => (
    <div data-testid="card-title" className={className}>
      {children}
    </div>
  )),
}));

vi.mock("@/components/ui/button", () => ({
  Button: vi.fn(({ children, onClick, className }) => (
    <button data-testid="button" onClick={onClick} className={className}>
      {children}
    </button>
  )),
}));

vi.mock("@/components/ui/accordion", () => ({
  Accordion: vi.fn(({ children, className, type, collapsible }) => (
    <div
      data-testid="accordion"
      className={className}
      data-type={type}
      data-collapsible={collapsible}
    >
      {children}
    </div>
  )),
  AccordionItem: vi.fn(({ children, className, value }) => (
    <div data-testid="accordion-item" className={className} data-value={value}>
      {children}
    </div>
  )),
  AccordionTrigger: vi.fn(({ children, className }) => (
    <div data-testid="accordion-trigger" className={className}>
      {children}
    </div>
  )),
  AccordionContent: vi.fn(({ children, className }) => (
    <div data-testid="accordion-content" className={className}>
      {children}
    </div>
  )),
}));

vi.mock("lucide-react", () => ({
  TrendingUp: vi.fn(() => <span data-testid="trending-up-icon" />),
  Shield: vi.fn(() => <span data-testid="shield-icon" />),
  DollarSign: vi.fn(() => <span data-testid="dollar-sign-icon" />),
  X: vi.fn(() => <span data-testid="x-icon" />),
  Lightbulb: vi.fn(() => <span data-testid="lightbulb-icon" />),
  PieChart: vi.fn(() => <span data-testid="pie-chart-icon" />),
  ChevronDown: vi.fn(() => <span data-testid="chevron-down-icon" />),
  ChevronUp: vi.fn(() => <span data-testid="chevron-up-icon" />),
}));

describe("ResultsModal", () => {
  const mockResult: InvestmentResult = {
    expectedReturn: 8.5,
    category: "Mid-Career Investor",
    allocation: [
      {
        name: "Stock Market (Blue Chip / Large Cap)",
        percentage: 30,
        color: "hsl(211, 86%, 45%)",
        amount: 30000,
      },
      {
        name: "Government Bonds",
        percentage: 30,
        color: "hsl(142, 72%, 46%)",
        amount: 30000,
      },
      {
        name: "Gold Funds / Sovereign Gold Bonds",
        percentage: 20,
        color: "hsl(35, 92%, 55%)",
        amount: 20000,
      },
      {
        name: "Fixed Deposits",
        percentage: 20,
        color: "hsl(168, 84%, 38%)",
        amount: 20000,
      },
    ],
    strategy:
      "Balanced strategy with a mix of equities and safer instruments. Suitable for moderate risk tolerance.",
    investmentRange: [50000, 150000] as [number, number],
    suggestedInvestment: 100000,
    projections: [
      { year: 1, return: 8.2, cumulativeValue: 108200 },
      { year: 2, return: 8.7, cumulativeValue: 117600 },
      { year: 3, return: 8.5, cumulativeValue: 127600 },
      { year: 4, return: 8.9, cumulativeValue: 138900 },
      { year: 5, return: 8.3, cumulativeValue: 150400 },
    ],
    factorExplanations: [
      "Knowledge Factor: 1.05 (based on education: Commerce and aware of financial markets)",
      "Stability Factor: 1.02 (source: Salary, income: 25K-75K)",
      "Combined Factor: 1.07 (knowledge × stability)",
      "Age Factor: 0.9 (mid-career)",
      "Risk Adjustment: 8.6 (original: 8, adjusted by factors)",
      "Education Impact: High financial literacy - supports complex investments",
      "Income Impact: Moderate income - capacity for regular investments. Stable regular income - predictable cash flow",
      "Market Awareness Impact: Positive - better understanding of risks",
    ],
  };

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal when isOpen is true", () => {
    render(
      <ResultsModal result={mockResult} isOpen={true} onClose={mockOnClose} />,
    );

    expect(screen.getByTestId("dialog")).toBeInTheDocument();
    expect(screen.getByTestId("dialog-content")).toBeInTheDocument();
  });

  it("does not render modal when isOpen is false", () => {
    const { queryByTestId } = render(
      <ResultsModal result={mockResult} isOpen={false} onClose={mockOnClose} />,
    );

    expect(queryByTestId("dialog")).not.toBeInTheDocument();
  });

  it("displays correct header with title and description", () => {
    render(
      <ResultsModal result={mockResult} isOpen={true} onClose={mockOnClose} />,
    );

    expect(screen.getByTestId("dialog-header")).toBeInTheDocument();
    expect(screen.getByTestId("dialog-header")).toHaveClass("px-3", "sm:px-4");

    expect(screen.getByText("Investment Strategy Results")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Personalized investment recommendations based on your investor profile",
      ),
    ).toBeInTheDocument();
  });

  it("shows risk analysis with expected return and category", () => {
    render(
      <ResultsModal result={mockResult} isOpen={true} onClose={mockOnClose} />,
    );

    expect(screen.getByText("Risk Analysis")).toBeInTheDocument();
    expect(screen.getByText("8.5%")).toBeInTheDocument();
    expect(screen.getByText("Expected Annual Return")).toBeInTheDocument();
    expect(screen.getByText("Mid-Career Investor")).toBeInTheDocument();
    expect(screen.getByText("Investor Category")).toBeInTheDocument();
  });

  it("displays investment recommendation with asset allocation", () => {
    render(
      <ResultsModal result={mockResult} isOpen={true} onClose={mockOnClose} />,
    );

    expect(screen.getByText("Asset Allocation")).toBeInTheDocument();
    expect(screen.getByText("Allocation Details")).toBeInTheDocument();

    // Check allocation items
    mockResult.allocation.forEach((item) => {
      
      // Escape regex special characters in the name and create flexible pattern
      const escapedName = item.name.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
      const percentageFormatted = item.percentage.toFixed(2).replace('.', '\\.');
      const pattern = new RegExp(
        `${escapedName}\\s*:\\s*${percentageFormatted}\\s*%`,
      );
      expect(screen.getByText(pattern)).toBeInTheDocument();
      expect(
        screen.getAllByText(`₹${item.amount?.toLocaleString("en-IN")}`).length,
      ).toBeGreaterThanOrEqual(1);
    });

    // Check strategy text
    expect(screen.getByText(mockResult.strategy)).toBeInTheDocument();

    // Check allocation chart is rendered
    expect(screen.getByTestId("allocation-chart")).toBeInTheDocument();
  });

  it("shows suggested investment amount with range", () => {
    render(
      <ResultsModal result={mockResult} isOpen={true} onClose={mockOnClose} />,
    );

    expect(screen.getByText("Suggested Investment")).toBeInTheDocument();
    // Check for rupee amounts with flexible formatting (Indian or Western)
    expect(screen.getByText(/₹\s*1[,\s]*00[,\s]*000/)).toBeInTheDocument();
    expect(
      screen.getByText(/Range:\s*₹\s*50[,\s]*000\s*–\s*₹\s*1[,\s]*50[,\s]*000/),
    ).toBeInTheDocument();
  });

  it("displays disclaimer warning", () => {
    render(
      <ResultsModal result={mockResult} isOpen={true} onClose={mockOnClose} />,
    );

    expect(
      screen.getByText(
        /This model is for academic purposes only and does not constitute financial advice/i,
      ),
    ).toBeInTheDocument();
  });

  it("has close button that calls onClose when clicked", async () => {
    const user = userEvent.setup();
    render(
      <ResultsModal result={mockResult} isOpen={true} onClose={mockOnClose} />,
    );

    const closeButton = screen.getByRole("button", { name: /close results/i });
    expect(closeButton).toBeInTheDocument();

    await user.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("applies correct padding alignment between header and content", () => {
    render(
      <ResultsModal result={mockResult} isOpen={true} onClose={mockOnClose} />,
    );

    // DialogHeader should have px-3 sm:px-4
    const dialogHeader = screen.getByTestId("dialog-header");
    expect(dialogHeader).toHaveClass("px-3", "sm:px-4");

    // DialogContent should have px-0 sm:px-0 (no horizontal padding on root)
    const dialogContent = screen.getByTestId("dialog-content");
    expect(dialogContent.className).toContain("px-0");

    // Check that content inside DialogContent has padding
    const contentDiv = screen.getByText("Risk Analysis").closest(".py-4");
    expect(contentDiv).toBeInTheDocument();
  });

  it("handles dark mode compatible styling for text and backgrounds", () => {
    render(
      <ResultsModal result={mockResult} isOpen={true} onClose={mockOnClose} />,
    );

    // Check that text uses theme-aware classes
    const dialogTitle = screen.getByTestId("dialog-title");
    expect(dialogTitle).toHaveClass(
      "text-2xl",
      "font-display",
      "text-foreground",
    );

    const dialogDescription = screen.getByTestId("dialog-description");
    expect(dialogDescription).toHaveClass("text-muted-foreground");

    // Check card styling
    const cards = screen.getAllByTestId("card");
    cards.forEach((card) => {
      expect(card.className).toContain("shadow-lg");
    });
  });

  it("formats currency amounts correctly with Indian locale", () => {
    const resultWithLargeAmount: InvestmentResult = {
      ...mockResult,
      suggestedInvestment: 1500000,
      investmentRange: [1000000, 2000000] as [number, number],
      allocation: mockResult.allocation.map((item) => ({
        ...item,
        amount: (item.amount || 0) * 10,
      })),
    };

    render(
      <ResultsModal
        result={resultWithLargeAmount}
        isOpen={true}
        onClose={mockOnClose}
      />,
    );

    // Check for rupee amounts with flexible formatting (Indian or Western)
    expect(screen.getByText(/₹\s*15[,\s]*00[,\s]*000/)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Range:\s*₹\s*10[,\s]*00[,\s]*000\s*–\s*₹\s*20[,\s]*00[,\s]*000/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/₹\s*3[,\s]*00[,\s]*000/).length,
    ).toBeGreaterThanOrEqual(1); // First allocation item * 10 (there are two items with this amount)
  });
});
