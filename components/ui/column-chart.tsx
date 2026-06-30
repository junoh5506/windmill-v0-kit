"use client";

// Vendored from packages/ui/src/components/ColumnChart. Styling verbatim; @wind/Remix deps stripped for v0.

import { Header } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type StringKey<T> = Extract<keyof T, string>;

interface Props<T extends Record<string, unknown>> {
  className?: string;
  data: T[];
  columns: Array<StringKey<T>>;
  xAxis: StringKey<T>;
  showXAxis?: boolean;
  showYAxis?: boolean;
  title?: string;
  stacked?: boolean;
}

const chartColors: string[] = ["#003f5c", "#58508d", "#bc5090", "#ff6361", "#ffa600"];

const columnChartStyles = cva("", {
  variants: {},
  defaultVariants: {},
});

// NOTE: remix-utils ClientOnly wrapper dropped — recharts renders directly in v0.
function ColumnChart<T extends Record<string, unknown>>({
  className,
  data,
  title,
  columns,
  xAxis,
  stacked,
  showXAxis = false,
  showYAxis = false,
  ...variants
}: Props<T> & VariantProps<typeof columnChartStyles>) {
  return (
    <div className={cn(columnChartStyles(variants), className)}>
      {title && <Header level={3}>{title}</Header>}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            {xAxis && <XAxis dataKey={xAxis} hide={!showXAxis} />}
            {/* Dynamic Y Axis */}
            <YAxis hide={!showYAxis} domain={[0, "dataMax"]} type="number" />
            <Tooltip />
            {columns.map((c, i) => (
              // Use css variable for fill
              <Bar
                dataKey={c}
                isAnimationActive={false}
                fill={chartColors[i]}
                key={c}
                minPointSize={2}
                stackId={stacked ? "a" : undefined}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ColumnChart;
