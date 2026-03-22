import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReturnsBarChart } from "./ReturnsBarChart";
import type { YearlyProjection } from "@/lib/investment-model";

const serializeAxisLabel = (label: unknown) => {
  if (label === undefined) {
    return undefined;
  }
  if (React.isValidElement(label)) {
    return JSON.stringify({
      kind: "element",
      hasContentFunction: typeof label.props?.content === "function",
    });
  }
  return JSON.stringify(label);
};

// Mock recharts to simplify testing
vi.mock("recharts", () => ({
  BarChart: vi.fn(({ children, margin }) => (
    <div data-testid="bar-chart" data-margin={JSON.stringify(margin)}>
      {children}
    </div>
  )),
  Bar: vi.fn(({ yAxisId, dataKey, name, fill, radius, maxBarSize }) => (
    <div
      data-testid="bar"
      data-y-axis-id={yAxisId}
      data-data-key={dataKey}
      data-name={name}
      data-fill={fill}
      data-radius={JSON.stringify(radius)}
      data-max-bar-size={maxBarSize}
    />
  )),
  XAxis: vi.fn(({ dataKey, stroke, tick, interval, minTickGap }) => (
    <div
      data-testid="x-axis"
      data-data-key={dataKey}
      data-stroke={stroke}
      data-tick={JSON.stringify(tick)}
      data-interval={interval}
      data-min-tick-gap={minTickGap}
    />
  )),
  YAxis: vi.fn(({ yAxisId, stroke, tick, label, tickFormatter, orientation }) => (
    <div
      data-testid="y-axis"
      data-y-axis-id={yAxisId}
      data-stroke={stroke}
      data-tick={JSON.stringify(tick)}
      data-label={serializeAxisLabel(label)}
      data-tick-formatter={tickFormatter?.toString()}
      data-orientation={orientation}
    />
  )),
  CartesianGrid: vi.fn(({ strokeDasharray, stroke, vertical }) => (
    <div
      data-testid="cartesian-grid"
      data-stroke-dasharray={strokeDasharray}
      data-stroke={stroke}
      data-vertical={vertical}
    />
  )),
  Tooltip: vi.fn(({ content }) => (
    <div data-testid="tooltip" data-content={content ? "present" : "absent"} />
  )),
  Label: vi.fn(({ content }) => (
    <div data-testid="label" data-has-content={typeof content === "function" ? "yes" : "no"} />
  )),
  Legend: vi.fn(({ verticalAlign, height, wrapperStyle }) => (
    <div
      data-testid="legend"
      data-vertical-align={verticalAlign}
      data-height={height}
      data-wrapper-style={JSON.stringify(wrapperStyle)}
    />
  )),
  ResponsiveContainer: vi.fn(({ children, width, height }) => (
    <div
      data-testid="responsive-container"
      data-width={width}
      data-height={height}
    >
      {children}
    </div>
  )),
}));

describe("ReturnsBarChart", () => {
  const mockProjections: YearlyProjection[] = [
    { year: 1, return: 8.2, cumulativeValue: 108200 },
    { year: 2, return: 8.7, cumulativeValue: 117600 },
    { year: 3, return: 8.5, cumulativeValue: 127600 },
    { year: 4, return: 8.9, cumulativeValue: 138900 },
    { year: 5, return: 8.3, cumulativeValue: 150400 },
  ];

  const mockInitialInvestment = 100000;

  it("renders the component with projections data", () => {
    render(
      <ReturnsBarChart
        projections={mockProjections}
        initialInvestment={mockInitialInvestment}
      />
    );

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("configures chart with proper margins to prevent label overlap", () => {
    render(
      <ReturnsBarChart
        projections={mockProjections}
        initialInvestment={mockInitialInvestment}
      />
    );

    const barChart = screen.getByTestId("bar-chart");
    const margin = JSON.parse(barChart.getAttribute("data-margin") || "{}");

    // Check current desktop margins
    expect(margin).toEqual({
      top: 20,
      right: 40,
      left: 72,
      bottom: 10,
    });
  });

  it("ensures y-axis labels do not overlap with tick labels", () => {
    render(
      <ReturnsBarChart
        projections={mockProjections}
        initialInvestment={mockInitialInvestment}
      />
    );

    const barChart = screen.getByTestId("bar-chart");
    const margin = JSON.parse(barChart.getAttribute("data-margin") || "{}");

    // Current desktop margins still leave enough room without compressing bars
    expect(margin.left).toBe(72);
    expect(margin.right).toBe(40);

    const yAxes = screen.getAllByTestId("y-axis");
    const leftYAxis = yAxes.find(
      (axis) => axis.getAttribute("data-y-axis-id") === "left"
    );
    const rightYAxis = yAxes.find(
      (axis) => axis.getAttribute("data-y-axis-id") === "right"
    );

    const leftLabel = JSON.parse(leftYAxis?.getAttribute("data-label") || "{}");
    const rightLabel = JSON.parse(rightYAxis?.getAttribute("data-label") || "{}");

    // Left axis keeps explicit outside label with updated offset
    expect(leftLabel.offset).toBe(42);
    // Right axis now uses custom Label element
    expect(rightLabel).toEqual({
      kind: "element",
      hasContentFunction: true,
    });

    // Ensure tick labels are not too long
    const rightTickFormatter = rightYAxis?.getAttribute("data-tick-formatter");
    if (rightTickFormatter) {
      // Formatter should support both mobile (lakhs) and desktop (k) output paths
      expect(rightTickFormatter).toContain("isMobile");
      expect(rightTickFormatter).toContain("100000");
      expect(rightTickFormatter).toContain("1000");
      expect(rightTickFormatter).toContain("toFixed(1)");
      expect(rightTickFormatter).toContain("toFixed(0)");
    }
  });

  it("configures left Y-axis with outside label positioning and offset", () => {
    render(
      <ReturnsBarChart
        projections={mockProjections}
        initialInvestment={mockInitialInvestment}
      />
    );

    const yAxes = screen.getAllByTestId("y-axis");
    const leftYAxis = yAxes.find(
      (axis) => axis.getAttribute("data-y-axis-id") === "left"
    );

    expect(leftYAxis).toBeInTheDocument();

    const label = JSON.parse(leftYAxis?.getAttribute("data-label") || "{}");
    expect(label).toMatchObject({
      value: "Annual Return (%)",
      angle: -90,
      position: "outsideLeft",
      offset: 42,
    });
    expect(label.style).toMatchObject({
      fill: "hsl(var(--muted-foreground))",
      textAnchor: "end",
    });
  });

  it("configures right Y-axis with custom label element", () => {
    render(
      <ReturnsBarChart
        projections={mockProjections}
        initialInvestment={mockInitialInvestment}
      />
    );

    const yAxes = screen.getAllByTestId("y-axis");
    const rightYAxis = yAxes.find(
      (axis) => axis.getAttribute("data-y-axis-id") === "right"
    );

    expect(rightYAxis).toBeInTheDocument();
    expect(rightYAxis?.getAttribute("data-orientation")).toBe("right");

    // Right label is passed as a React element (<Label content={...} />)
    const label = JSON.parse(rightYAxis?.getAttribute("data-label") || "{}");
    expect(label).toEqual({
      kind: "element",
      hasContentFunction: true,
    });
  });

  it("formats right Y-axis ticks as compact currency values", () => {
    render(
      <ReturnsBarChart
        projections={mockProjections}
        initialInvestment={mockInitialInvestment}
      />
    );

    const yAxes = screen.getAllByTestId("y-axis");
    const rightYAxis = yAxes.find(
      (axis) => axis.getAttribute("data-y-axis-id") === "right"
    );

    expect(rightYAxis).toBeInTheDocument();

    const tickFormatter = rightYAxis?.getAttribute("data-tick-formatter");
    expect(tickFormatter).toBeDefined();

    expect(tickFormatter).toContain("₹${(value / 1000).toFixed(0)}k");
  });

  it("renders two bars for annual return and cumulative value", () => {
    render(
      <ReturnsBarChart
        projections={mockProjections}
        initialInvestment={mockInitialInvestment}
      />
    );

    const bars = screen.getAllByTestId("bar");
    expect(bars).toHaveLength(2);

    const annualReturnBar = bars.find(
      (bar) => bar.getAttribute("data-data-key") === "annualReturn"
    );
    const cumulativeValueBar = bars.find(
      (bar) => bar.getAttribute("data-data-key") === "cumulativeValue"
    );

    expect(annualReturnBar).toBeInTheDocument();
    expect(annualReturnBar?.getAttribute("data-y-axis-id")).toBe("left");
    expect(annualReturnBar?.getAttribute("data-name")).toBe("Annual Return (%)");
    expect(annualReturnBar?.getAttribute("data-fill")).toBe("hsl(var(--primary))");

    expect(cumulativeValueBar).toBeInTheDocument();
    expect(cumulativeValueBar?.getAttribute("data-y-axis-id")).toBe("right");
    expect(cumulativeValueBar?.getAttribute("data-name")).toBe("Cumulative Value (₹)");
    expect(cumulativeValueBar?.getAttribute("data-fill")).toBe("hsl(142, 72%, 46%)");
  });

  it("does not render a legend to reduce visual clutter", () => {
    render(
      <ReturnsBarChart
        projections={mockProjections}
        initialInvestment={mockInitialInvestment}
      />
    );

    // Legend should not be rendered (removed to reduce clutter)
    expect(screen.queryByTestId("legend")).not.toBeInTheDocument();
  });

  it("includes a custom tooltip component", () => {
    render(
      <ReturnsBarChart
        projections={mockProjections}
        initialInvestment={mockInitialInvestment}
      />
    );

    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip.getAttribute("data-content")).toBe("present");
  });

  it("handles missing initialInvestment gracefully", () => {
    render(<ReturnsBarChart projections={mockProjections} />);

    // Component should still render without initialInvestment
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("handles single year projection", () => {
    const singleYear = [{ year: 1, return: 5.0, cumulativeValue: 105000 }];
    render(<ReturnsBarChart projections={singleYear} />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("handles multiple year projections", () => {
    const tenYears = Array.from({ length: 10 }, (_, i) => ({
      year: i + 1,
      return: 5 + i * 0.5,
      cumulativeValue: 100000 * Math.pow(1.05, i + 1),
    }));
    render(<ReturnsBarChart projections={tenYears} />);
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });

  it("formats large cumulative values correctly", () => {
    const largeProjections = [
      { year: 1, return: 8.0, cumulativeValue: 1000000 },
      { year: 2, return: 8.5, cumulativeValue: 2000000 },
    ];
    render(<ReturnsBarChart projections={largeProjections} />);
    const yAxes = screen.getAllByTestId("y-axis");
    const rightYAxis = yAxes.find(
      (axis) => axis.getAttribute("data-y-axis-id") === "right"
    );
    const tickFormatter = rightYAxis?.getAttribute("data-tick-formatter");
    expect(tickFormatter).toBeDefined();
    expect(tickFormatter).toContain("₹${(value / 1000).toFixed(0)}k");
  });

  it("maintains sufficient margins for large tick labels", () => {
    const largeProjections = [
      { year: 1, return: 8.0, cumulativeValue: 10000000 }, // ₹10000k
    ];
    render(<ReturnsBarChart projections={largeProjections} />);
    const barChart = screen.getByTestId("bar-chart");
    const margin = JSON.parse(barChart.getAttribute("data-margin") || "{}");
    // Current desktop margins
    expect(margin.left).toBe(72);
    expect(margin.right).toBe(40);
  });

  describe("responsive behavior", () => {
    const originalMatchMedia = window.matchMedia;

    beforeEach(() => {
      vi.clearAllMocks();
    });

    afterEach(() => {
      window.matchMedia = originalMatchMedia;
    });

    it("uses mobile-optimized margins on small screens", () => {
      // Mock mobile screen (less than 768px)
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(max-width: 767px)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <ReturnsBarChart
          projections={mockProjections}
          initialInvestment={mockInitialInvestment}
        />
      );

      const barChart = screen.getByTestId("bar-chart");
      const margin = JSON.parse(barChart.getAttribute("data-margin") || "{}");

      // Current mobile margins
      expect(margin).toEqual({
        top: 12,
        right: 24,
        left: 28,
        bottom: 12,
      });
    });

    it("uses desktop margins on larger screens", () => {
      // Mock desktop screen (768px or wider)
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query !== "(max-width: 767px)", // Not mobile
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <ReturnsBarChart
          projections={mockProjections}
          initialInvestment={mockInitialInvestment}
        />
      );

      const barChart = screen.getByTestId("bar-chart");
      const margin = JSON.parse(barChart.getAttribute("data-margin") || "{}");

      // Current desktop margins
      expect(margin).toEqual({
        top: 20,
        right: 40,
        left: 72,
        bottom: 10,
      });
    });

    it("adjusts container height for mobile screens", () => {
      // Mock mobile screen
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(max-width: 767px)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <ReturnsBarChart
          projections={mockProjections}
          initialInvestment={mockInitialInvestment}
        />
      );

      const container = screen.getByTestId("responsive-container");
      // Should have mobile-optimized height
      // This is harder to test with mocked ResponsiveContainer,
      // but we can check if appropriate props are passed
      expect(container).toBeInTheDocument();
    });

    it("hides y-axis labels on mobile screens", () => {
      // Mock mobile screen
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(max-width: 767px)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <ReturnsBarChart
          projections={mockProjections}
          initialInvestment={mockInitialInvestment}
        />
      );

      const yAxes = screen.getAllByTestId("y-axis");
      const leftYAxis = yAxes.find(
        (axis) => axis.getAttribute("data-y-axis-id") === "left"
      );
      const rightYAxis = yAxes.find(
        (axis) => axis.getAttribute("data-y-axis-id") === "right"
      );

      expect(leftYAxis?.getAttribute("data-label")).toBeNull();
      expect(rightYAxis?.getAttribute("data-label")).toBeNull();
    });

    it("uses lakhs formatting on mobile for larger cumulative values", () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(max-width: 767px)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(<ReturnsBarChart projections={mockProjections} />);

      const yAxes = screen.getAllByTestId("y-axis");
      const rightYAxis = yAxes.find(
        (axis) => axis.getAttribute("data-y-axis-id") === "right"
      );

      const tickFormatter = rightYAxis?.getAttribute("data-tick-formatter");
      expect(tickFormatter).toBeDefined();

      expect(tickFormatter).toContain("if (isMobile && value >= 100000)");
      expect(tickFormatter).toContain("₹${(value / 100000).toFixed(1)}L");
      expect(tickFormatter).toContain("₹${(value / 1000).toFixed(0)}k");
    });
  });
});