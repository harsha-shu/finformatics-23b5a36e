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

interface ReturnsBarChartProps {
  projections: YearlyProjection[];
  initialInvestment?: number;
}

export function ReturnsBarChart({
  projections,
  initialInvestment,
}: ReturnsBarChartProps) {
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
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                Annual Return:
              </span>{" "}
              <span className="text-foreground">
                {payload[0].value.toFixed(1)}%
              </span>
            </p>
            <p className="text-sm">
              <span className="text-green-600 dark:text-green-400 font-medium">
                Cumulative Value:
              </span>{" "}
              <span className="text-foreground">
                ₹{payload[1].value.toLocaleString("en-IN")}
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
        <h3 className="text-lg font-semibold font-display text-foreground">
          Projected Returns Over {projections.length} Years
        </h3>
        <p className="text-sm text-muted-foreground">
          Annual returns and cumulative portfolio value projection
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              label={{
                value: "Annual Return (%)",
                angle: -90,
                position: "insideLeft",
                style: { fill: "hsl(var(--muted-foreground))" },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              label={{
                value: "Cumulative Value (₹)",
                angle: 90,
                position: "insideRight",
                style: { fill: "hsl(var(--muted-foreground))" },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ paddingBottom: "20px" }}
            />
            <Bar
              yAxisId="left"
              dataKey="annualReturn"
              name="Annual Return (%)"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              yAxisId="right"
              dataKey="cumulativeValue"
              name="Cumulative Value (₹)"
              fill="hsl(142, 72%, 46%)" // Green color from allocation chart
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
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
