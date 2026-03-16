import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Index from "./Index";

// Mock components that are used in Index
vi.mock("@/components/ResultsModal", () => ({
  ResultsModal: vi.fn(() => null),
}));

vi.mock("@/components/InvestorForm", () => ({
  InvestorForm: vi.fn(() => <div data-testid="investor-form" />),
}));

vi.mock("@/components/theme-toggle", () => ({
  ThemeToggle: vi.fn(() => (
    <button data-testid="theme-toggle">Theme Toggle</button>
  )),
}));

vi.mock("lottie-react", () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="lottie-animation" />),
}));

// Mock next-themes to avoid context issues
vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
  }),
}));

describe("Index Page", () => {
  it("renders the header with logo and title", () => {
    render(<Index />);

    // Check logo is present
    expect(screen.getByAltText("finformatics logo")).toBeInTheDocument();

    // Check title
    expect(screen.getByText("finformatics")).toBeInTheDocument();
    expect(
      screen.getByText("Predictive Modeling for Retail Wealth Diversification"),
    ).toBeInTheDocument();
  });

  it("includes the theme toggle in the header", () => {
    render(<Index />);

    // Theme toggle should be rendered
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    expect(screen.getByText("Theme Toggle")).toBeInTheDocument();
  });

  it("renders the investor profile form", () => {
    render(<Index />);

    expect(screen.getByTestId("investor-form")).toBeInTheDocument();
  });

  it("renders the calculate button", () => {
    render(<Index />);

    expect(
      screen.getByRole("button", { name: /calculate investment strategy/i }),
    ).toBeInTheDocument();
  });

  it('renders the "How It Works" information panel', () => {
    render(<Index />);

    expect(screen.getByText("How It Works")).toBeInTheDocument();
    expect(screen.getByText("Risk Assessment")).toBeInTheDocument();
    expect(screen.getByText("Asset Allocation")).toBeInTheDocument();
    expect(screen.getByText("Investment Amount")).toBeInTheDocument();
  });

  it("has skip to main content link for accessibility", () => {
    render(<Index />);

    const skipLink = screen.getByText("Skip to main content");
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  it("has badge with proper contrast adaptation for light and dark modes", () => {
    render(<Index />);

    const badgeText = screen.getByText("Intelligent Investment Advisory");
    expect(badgeText).toBeInTheDocument();

    // Find the parent badge element
    const badgeContainer = badgeText.closest("div");
    expect(badgeContainer).toBeInTheDocument();

    // Check that badge uses theme-aware background classes
    expect(badgeContainer?.className).toContain("bg-white/20");
    expect(badgeContainer?.className).toContain("dark:bg-white/10");

    // Check that text uses white color for visibility on gradient
    expect(badgeText.className).toContain("text-white");
  });

  it("has text shadow on header text for better contrast in light mode", () => {
    render(<Index />);

    // Check main title has text shadow
    const title = screen.getByText("finformatics");
    expect(title).toBeInTheDocument();
    expect(title.className).toContain("text-shadow-md");

    // Check subtitle has text shadow
    const subtitle = screen.getByText(
      "Predictive Modeling for Retail Wealth Diversification",
    );
    expect(subtitle).toBeInTheDocument();
    expect(subtitle.className).toContain("text-shadow-md");
  });

  it("has no truncation on header text for full visibility", () => {
    render(<Index />);

    // Check main title does NOT have truncation class
    const title = screen.getByText("finformatics");
    expect(title).toBeInTheDocument();
    expect(title.className).not.toContain("truncate");

    // Check subtitle does NOT have line-clamp class
    const subtitle = screen.getByText(
      "Predictive Modeling for Retail Wealth Diversification",
    );
    expect(subtitle).toBeInTheDocument();
    expect(subtitle.className).not.toContain("line-clamp-1");
  });
});
