import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Label,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { YearlyProjection } from "@/lib/investment-model";
import { useState, useEffect } from "react";

function useIsMobile() {
  // Initialize with false for SSR, will update on client
  const [isMobile, setIsMobile] = useState(() => {
    // Check if window is available (client-side)
    if (typeof window !== "undefined") {
      return window.matchMedia("(max-width: 767px)").matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateIsMobile = () => {
      setIsMobile(mediaQuery.matches);
    };

    // Add event listener
    mediaQuery.addEventListener("change", updateIsMobile);

    // Cleanup
    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  return isMobile;
}

interface ReturnsBarChartProps {
  projections: YearlyProjection[];
  initialInvestment?: number;
}

export function ReturnsBarChart({
  projections,
  initialInvestment,
}: ReturnsBarChartProps) {
  const isMobile = useIsMobile();

  // Custom right Y-axis label renderer to control tspan dy
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderRightAxisLabel = (labelProps: any) => {
    const { viewBox, x, y, width, height } = labelProps;
    const boxX = viewBox?.x ?? x ?? 0;
    const boxY = viewBox?.y ?? y ?? 0;
    const boxWidth = viewBox?.width ?? width ?? 0;
    const boxHeight = viewBox?.height ?? height ?? 0;

    const labelX = boxX + boxWidth - (isMobile ? 26 : 36) + rightAxisLabelOffset;
    const labelY = boxY + boxHeight / 2;

    return (
      <text
        x={labelX}
        y={labelY}
        fill="hsl(var(--muted-foreground))"
        textAnchor="start"
        transform={`rotate(90, ${labelX}, ${labelY})`}
      >
        <tspan x={labelX} dy="-1em">
          Cumulative Value (₹)
        </tspan>
      </text>
    );
  };

  // Responsive values
  const margin = isMobile
    ? { top: 12, right: 24, left: 28, bottom: 12 }
    : { top: 20, right: 40, left: 72, bottom: 10 }; // Desktop

  const yAxisLabelOffset = isMobile ? 25 : 42;
  const rightAxisLabelOffset = 0;
  const maxBarSize = isMobile ? 22 : 40;
  const containerHeight = isMobile ? "h-64" : "h-80";

  const formatCumulativeTick = (value: number) => {
    if (isMobile && value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${(value / 1000).toFixed(0)}k`;
  };

  // Format the data for the chart
  const chartData = projections.map((proj) => ({
    year: isMobile ? `Y${proj.year}` : `Year ${proj.year}`,
    annualReturn: proj.return,
    cumulativeValue: proj.cumulativeValue,
    // For tooltip display
    formattedReturn: `${proj.return.toFixed(1)}%`,
    formattedCumulative: `₹${proj.cumulativeValue.toLocaleString("en-IN")}`,
  }));

  // Custom tooltip
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Find the correct payload items by dataKey
      const annualReturnPayload = payload.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any) => p.dataKey === "annualReturn",
      );
      const cumulativeValuePayload = payload.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any) => p.dataKey === "cumulativeValue",
      );

      return (
        <div className="bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                Annual Return:
              </span>{" "}
              <span className="text-foreground">
                {annualReturnPayload?.value?.toFixed(1)}%
              </span>
            </p>
            <p className="text-sm">
              <span className="text-green-600 dark:text-green-400 font-medium">
                Cumulative Value:
              </span>{" "}
              <span className="text-foreground">
                ₹{cumulativeValuePayload?.value?.toLocaleString("en-IN")}
              </span>
            </p>
            {initialInvestment && (
              <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                From initial investment of ₹
                {initialInvestment.toLocaleString("en-IN")}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full space-y-4">
      <div>
        <h3 className="text-base sm:text-lg font-semibold font-display text-foreground">
          Projected Returns Over {projections.length} Years
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Annual returns and cumulative portfolio value projection
        </p>
      </div>

      <div className={containerHeight}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={margin}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: isMobile ? 11 : 12 }}
              interval="preserveStartEnd"
              minTickGap={isMobile ? 16 : 18}
            />
            <YAxis
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: isMobile ? 11 : 12 }}
              label={isMobile ? undefined : {
                value: "Annual Return (%)",
                angle: -90,
                position: "outsideLeft",
                offset: yAxisLabelOffset,
                style: {
                  fill: "hsl(var(--muted-foreground))",
                  textAnchor: "end" // Text ends at label position, extends leftward away from chart
                },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: isMobile ? 11 : 12 }}
              tickFormatter={formatCumulativeTick}
              label={isMobile ? undefined : <Label content={renderRightAxisLabel} />}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              yAxisId="left"
              dataKey="annualReturn"
              name="Annual Return (%)"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              maxBarSize={maxBarSize}
            />
            <Bar
              yAxisId="right"
              dataKey="cumulativeValue"
              name="Cumulative Value (₹)"
              fill="hsl(142, 72%, 46%)" // Green color from allocation chart
              radius={[4, 4, 0, 0]}
              maxBarSize={maxBarSize}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs text-muted-foreground">
        <p>
          Note: Projections based on expected annual return with simulated
          market volatility (±2%). Past performance does not guarantee future
          results.
        </p>
      </div>
    </div>
  );
}
