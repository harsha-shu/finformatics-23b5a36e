import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AllocationChart } from "./AllocationChart";

// Mock recharts to simplify testing
vi.mock("recharts", () => ({
  PieChart: vi.fn(({ children }) => (
    <div data-testid="pie-chart">{children}</div>
  )),
  Pie: vi.fn(({ children, data, dataKey, nameKey, label }) => (
    <div
      data-testid="pie"
      data-data={JSON.stringify(data)}
      data-data-key={dataKey}
      data-name-key={nameKey}
    >
      {children}
    </div>
  )),
  Cell: vi.fn(({ fill }) => <div data-testid="cell" data-fill={fill} />),
  Tooltip: vi.fn(({ content, formatter }) => (
    <div
      data-testid="tooltip"
      data-has-content={content ? "true" : "false"}
      data-formatter={formatter?.toString()}
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

describe("AllocationChart", () => {
  const mockData = [
    { name: "Stocks", percentage: 40, color: "hsl(211, 86%, 45%)" },
    { name: "Bonds", percentage: 30, color: "hsl(142, 72%, 46%)" },
    { name: "Gold", percentage: 20, color: "hsl(35, 92%, 55%)" },
    { name: "Cash", percentage: 10, color: "hsl(168, 84%, 38%)" },
  ];

  const mockTitle = "Test Asset Allocation";

  it("renders the component with title", () => {
    render(<AllocationChart data={mockData} title={mockTitle} />);

    expect(screen.getByText(mockTitle)).toBeInTheDocument();
  });

  it("renders ResponsiveContainer with correct dimensions", () => {
    render(<AllocationChart data={mockData} title={mockTitle} />);

    const container = screen.getByTestId("responsive-container");
    expect(container).toBeInTheDocument();
    expect(container.getAttribute("data-width")).toBe("100%");
    expect(container.getAttribute("data-height")).toBe("280");
  });

  it("passes data to Pie component", () => {
    render(<AllocationChart data={mockData} title={mockTitle} />);

    const pie = screen.getByTestId("pie");
    expect(pie).toBeInTheDocument();
    expect(pie.getAttribute("data-data-key")).toBe("percentage");
    expect(pie.getAttribute("data-name-key")).toBe("name");

    const parsedData = JSON.parse(pie.getAttribute("data-data") || "[]");
    expect(parsedData).toEqual(mockData);
  });

  it("renders Cell components with correct colors", () => {
    render(<AllocationChart data={mockData} title={mockTitle} />);

    const cells = screen.getAllByTestId("cell");
    expect(cells).toHaveLength(mockData.length);

    mockData.forEach((item, index) => {
      expect(cells[index].getAttribute("data-fill")).toBe(item.color);
    });
  });

  it("configures Tooltip with custom content prop", () => {
    render(<AllocationChart data={mockData} title={mockTitle} />);

    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip).toBeInTheDocument();

    // Check that tooltip uses custom content prop
    expect(tooltip.getAttribute("data-has-content")).toBe("true");

    // Check formatter function
    expect(tooltip.getAttribute("data-formatter")).toContain("value");
  });

  it("renders legend items with correct colors and labels", () => {
    render(<AllocationChart data={mockData} title={mockTitle} />);

    // Check that all legend items are rendered
    mockData.forEach((item) => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });

    // Check that color indicators are present
    const colorIndicators = screen.getAllByRole("generic", { name: "" });
    // The color indicators are spans with inline style for background color
    const colorSpans = Array.from(
      document.querySelectorAll("span.w-3.h-3.rounded-full"),
    );
    expect(colorSpans.length).toBeGreaterThanOrEqual(mockData.length);
  });

  it("applies correct CSS classes for responsive design", () => {
    const { container } = render(
      <AllocationChart data={mockData} title={mockTitle} />,
    );

    // Check main container classes
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass("space-y-4");

    // Check flex container for legend
    const flexContainer = container.querySelector(
      ".flex.flex-wrap.justify-center.gap-4",
    );
    expect(flexContainer).toBeInTheDocument();
  });

  it("handles empty data array gracefully", () => {
    render(<AllocationChart data={[]} title={mockTitle} />);

    expect(screen.getByText(mockTitle)).toBeInTheDocument();

    // Pie should still be rendered with empty data
    const pie = screen.getByTestId("pie");
    expect(pie).toBeInTheDocument();

    const parsedData = JSON.parse(pie.getAttribute("data-data") || "[]");
    expect(parsedData).toEqual([]);
  });
});
