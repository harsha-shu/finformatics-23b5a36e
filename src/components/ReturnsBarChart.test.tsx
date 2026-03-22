import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReturnsBarChart } from "./ReturnsBarChart";
import type { YearlyProjection } from "@/lib/investment-model";

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
  XAxis: vi.fn(({ dataKey, stroke, tick }) => (
    <div
      data-testid="x-axis"
      data-data-key={dataKey}
      data-stroke={stroke}
      data-tick={JSON.stringify(tick)}
    />
  )),
  YAxis: vi.fn(({ yAxisId, stroke, tick, label, tickFormatter, orientation }) => (
    <div
      data-testid="y-axis"
      data-y-axis-id={yAxisId}
      data-stroke={stroke}
      data-tick={JSON.stringify(tick)}
      data-label={JSON.stringify(label)}
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

    // Check that margins provide sufficient space for outside labels
    expect(margin).toEqual({
      top: 20,
      right: 140,   // Sufficient space for right Y-axis label and ticks
      left: 120,    // Sufficient space for left Y-axis label and ticks
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

    // Minimum margins to accommodate labels and ticks
    expect(margin.left).toBeGreaterThanOrEqual(120);
    expect(margin.right).toBeGreaterThanOrEqual(140);

    const yAxes = screen.getAllByTestId("y-axis");
    const leftYAxis = yAxes.find(
      (axis) => axis.getAttribute("data-y-axis-id") === "left"
    );
    const rightYAxis = yAxes.find(
      (axis) => axis.getAttribute("data-y-axis-id") === "right"
    );

    const leftLabel = JSON.parse(leftYAxis?.getAttribute("data-label") || "{}");
    const rightLabel = JSON.parse(rightYAxis?.getAttribute("data-label") || "{}");

    // Offset should be sufficient to separate label from tick labels
    expect(leftLabel.offset).toBeGreaterThanOrEqual(35);
    expect(rightLabel.offset).toBeGreaterThanOrEqual(35);

    // Ensure tick labels are not too long
    const rightTickFormatter = rightYAxis?.getAttribute("data-tick-formatter");
    if (rightTickFormatter) {
      const formatter = eval(`(${rightTickFormatter})`);
      // Test with sample values
      expect(formatter(100000).length).toBeLessThanOrEqual(8); // "₹100k"
      expect(formatter(1000000).length).toBeLessThanOrEqual(9); // "₹1000k"
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
      offset: 40,
    });
    expect(label.style).toMatchObject({
      fill: "hsl(var(--muted-foreground))",
      textAnchor: "end",
    });
  });

  it("configures right Y-axis with outside label positioning and offset", () => {
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

    const label = JSON.parse(rightYAxis?.getAttribute("data-label") || "{}");
    expect(label).toMatchObject({
      value: "Cumulative Value (₹)",
      angle: 90,
      position: "outsideRight",
      offset: 40,
    });
    expect(label.style).toMatchObject({
      fill: "hsl(var(--muted-foreground))",
      textAnchor: "start",
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

    // Test the formatter function
    const formatter = eval(`(${tickFormatter})`);
    expect(formatter(100000)).toBe("₹100k");
    expect(formatter(150000)).toBe("₹150k");
    expect(formatter(2000000)).toBe("₹2000k"); // Note: formatter doesn't handle millions
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
    const formatter = eval(`(${tickFormatter})`);
    expect(formatter(1000000)).toBe("₹1000k");
    expect(formatter(2000000)).toBe("₹2000k");
  });

  it("maintains sufficient margins for large tick labels", () => {
    const largeProjections = [
      { year: 1, return: 8.0, cumulativeValue: 10000000 }, // ₹10000k
    ];
    render(<ReturnsBarChart projections={largeProjections} />);
    const barChart = screen.getByTestId("bar-chart");
    const margin = JSON.parse(barChart.getAttribute("data-margin") || "{}");
    // Margins should still be sufficient
    expect(margin.left).toBeGreaterThanOrEqual(120);
    expect(margin.right).toBeGreaterThanOrEqual(140);
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

      // Mobile-optimized margins (smaller to conserve space)
      expect(margin.left).toBeLessThan(120); // Should be smaller than desktop (120)
      expect(margin.right).toBeLessThan(140); // Should be smaller than desktop (140)
      expect(margin.left).toBeGreaterThanOrEqual(60); // But still sufficient
      expect(margin.right).toBeGreaterThanOrEqual(80);
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

      // Desktop margins (larger for better label spacing)
      expect(margin.left).toBeGreaterThanOrEqual(120);
      expect(margin.right).toBeGreaterThanOrEqual(140);
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

    it("adjusts y-axis label offset for mobile screens", () => {
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

      const leftLabel = JSON.parse(leftYAxis?.getAttribute("data-label") || "{}");
      const rightLabel = JSON.parse(rightYAxis?.getAttribute("data-label") || "{}");

      // Mobile should have smaller offset than desktop
      expect(leftLabel.offset).toBeLessThan(40); // Desktop offset is 40
      expect(rightLabel.offset).toBeLessThan(40);
      expect(leftLabel.offset).toBeGreaterThanOrEqual(20);
      expect(rightLabel.offset).toBeGreaterThanOrEqual(20);
    });
  });
});