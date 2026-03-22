import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
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

  // Responsive values
  const margin = isMobile
    ? { top: 15, right: 100, left: 80, bottom: 5 } // Mobile-optimized
    : { top: 20, right: 140, left: 120, bottom: 10 }; // Desktop

  const yAxisLabelOffset = isMobile ? 25 : 40;
  const maxBarSize = isMobile ? 30 : 40;
  const containerHeight = isMobile ? "h-60" : "h-80"; // 240px on mobile, 320px on desktop

  // Format the data for the chart
  const chartData = projections.map((proj) => ({
    year: `Year ${proj.year}`,
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
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: isMobile ? 12 : 14 }}
            />
            <YAxis
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: isMobile ? 12 : 14 }}
              label={{
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
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: isMobile ? 12 : 14 }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              label={{
                value: "Cumulative Value (₹)",
                angle: 90,
                position: "outsideRight",
                offset: yAxisLabelOffset,
                style: {
                  fill: "hsl(var(--muted-foreground))",
                  textAnchor: "start" // Text starts at label position, extends rightward away from chart
                },
              }}
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
