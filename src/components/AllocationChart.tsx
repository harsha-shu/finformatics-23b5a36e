import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface AllocationItem {
  name: string;
  percentage: number;
  color: string;
}

interface AllocationChartProps {
  data: AllocationItem[];
  title: string;
}

export function AllocationChart({ data, title }: AllocationChartProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold font-display">{title}</h3>
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={110}
              dataKey="percentage"
              nameKey="name"
              label={({ percentage, x, y }) => (
                <text
                  x={x}
                  y={y}
                  fill="hsl(var(--foreground))"
                  fontSize="0.875rem"
                  fontWeight="500"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {percentage.toFixed(2)}%
                </text>
              )}
              labelLine={false}
              strokeWidth={2}
              stroke="hsl(var(--border))"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value.toFixed(2)}%`}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                      <p className="font-medium text-foreground">
                        {payload[0].name}
                      </p>
                      <p className="text-sm text-foreground">
                        {payload[0].value.toFixed(2)}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
