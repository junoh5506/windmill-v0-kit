"use client";

// Vendored from packages/ui/src/components/ComposedChart. Styling verbatim; @wind/Remix deps stripped for v0.

import type { ChartColor } from "@/components/ui/charts";
import {
  ChartTooltip,
  DEFAULT_CHART_COLORS,
  getColorHex,
  type ChartCurveType,
} from "@/components/ui/charts";
import { VStack } from "@/components/ui/stack";
import { Label } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { CircleX } from "lucide-react";
import { useId, useMemo, useState, type ComponentProps, type ReactNode } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart as RechartsComposedChart,
} from "recharts";

/* ---------------------------------------------------------------------------
 * Models — verbatim from ComposedChart/models.ts.
 * ------------------------------------------------------------------------- */

interface BaseSeriesConfig {
  key: string;
  name?: string;
  color?: ChartColor;
}

export interface BarSeries extends BaseSeriesConfig {
  type: "bar";
  stackId?: string;
  /** Per-data-point CSS color strings. When provided, each bar gets the corresponding color. */
  barColors?: string[];
}

export interface LineSeries extends BaseSeriesConfig {
  type: "line";
  curveType?: ChartCurveType;
  connectNulls?: boolean;
  strokeDasharray?: string;
  strokeWidth?: number;
  dotRadius?: number;
}

export interface AreaSeries extends BaseSeriesConfig {
  type: "area";
  curveType?: ChartCurveType;
  connectNulls?: boolean;
  fillOpacity?: number;
  showGradient?: boolean;
  strokeWidth?: number;
}

export type SeriesConfig = BarSeries | LineSeries | AreaSeries;

export interface ComposedChartProps {
  className?: string;
  isLoading: boolean;
  error?: unknown;
  data?: object[];
  index?: string;
  series?: SeriesConfig[];

  valueFormatter?: (value: number, category: string) => string;
  yAxisFormatter?: (value: number) => string;

  yAxisWidth?: number;
  yAxisDomain?: ComponentProps<typeof YAxis>["domain"];
  showXAxis?: boolean;
  showYAxis?: boolean;
  showGridLines?: boolean;
  xAxisFormatter?: (value: string) => string;
  autoMinValue?: boolean;
  allowDecimals?: boolean;

  showLegend?: boolean;
  showTooltip?: boolean;
  showBarLabels?: boolean;
  wrapXAxisLabels?: boolean;
  showAnimation?: boolean;
  colors?: ChartColor[];

  /** Callback when a bar is clicked. Receives the data-point index and the series key. */
  onBarClick?: (dataIndex: number, seriesKey: string) => void;
  /** When set, non-active bars are dimmed to 0.3 opacity. null/undefined = no dimming. */
  activeBarIndex?: number | null;

  /** Custom tooltip renderer. When provided, replaces the default ChartTooltip. */
  renderTooltip?: (props: {
    active?: boolean;
    payload?: Array<Record<string, unknown>>;
    label: string;
  }) => ReactNode | null;

  /** Formats bar label values when showBarLabels is true. */
  barLabelFormatter?: (value: number) => string;
  onClick?: ComponentProps<typeof RechartsComposedChart>["onClick"];
}

/* ---------------------------------------------------------------------------
 * ChartLegend — verbatim from ComposedChart/ChartLegend.tsx.
 * ------------------------------------------------------------------------- */

interface ChartLegendProps {
  categories: string[];
  categoryColors: Map<string, ChartColor>;
  hiddenSeries: Set<string>;
  onToggle: (category: string) => void;
}

const ChartLegend = ({ categories, categoryColors, hiddenSeries, onToggle }: ChartLegendProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 pb-3">
      {categories.map((cat) => {
        const isHidden = hiddenSeries.has(cat);

        return (
          <button
            key={cat}
            type="button"
            className={cn(
              "flex items-center gap-2 cursor-pointer transition-opacity",
              isHidden && "opacity-40"
            )}
            onClick={() => onToggle(cat)}
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: getColorHex(categoryColors.get(cat)) }}
            />
            <span
              className={cn(
                "text-sm text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis",
                isHidden && "line-through"
              )}
            >
              {cat}
            </span>
          </button>
        );
      })}
    </div>
  );
};

/* ---------------------------------------------------------------------------
 * ComposedChart — verbatim from ComposedChart/ComposedChart.tsx.
 * NumberUtil.format inlined via Intl; remix-utils ClientOnly dropped.
 * ------------------------------------------------------------------------- */

const formatNumber = (value: number, millify = false): string =>
  millify
    ? new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(
        value
      )
    : new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);

const RENDER_ORDER: Record<SeriesConfig["type"], number> = { area: 0, bar: 1, line: 2 };

const WRAPPED_TICK_LINE_HEIGHT = 14;

const WrappedAxisTick = ({
  x,
  y,
  payload,
}: {
  x: number;
  y: number;
  payload: { value: string };
}) => {
  const words = String(payload.value).split(" ");

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill="rgb(var(--text-secondary))" className="text-tremor-label">
        {words.map((word, i) => (
          <tspan key={i} x={0} dy={i === 0 ? 10 : WRAPPED_TICK_LINE_HEIGHT}>
            {word}
          </tspan>
        ))}
      </text>
    </g>
  );
};

const resolveSeriesName = (s: SeriesConfig): string => s.name ?? s.key;

const ComposedChartCore = ({
  data,
  index,
  series,
  valueFormatter = (value) => formatNumber(value),
  yAxisFormatter = (value) => formatNumber(value, true),
  yAxisWidth = 30,
  yAxisDomain,
  showXAxis = true,
  showYAxis = true,
  showGridLines = true,
  xAxisFormatter,
  autoMinValue = false,
  allowDecimals = false,
  showLegend = true,
  showTooltip = true,
  showBarLabels = false,
  wrapXAxisLabels = false,
  showAnimation = true,
  colors = DEFAULT_CHART_COLORS,
  onBarClick,
  activeBarIndex,
  renderTooltip,
  barLabelFormatter,
  onClick,
}: {
  data: object[];
  index: string;
  series: SeriesConfig[];
} & Omit<
  ComposedChartProps,
  "className" | "isLoading" | "error" | "data" | "index" | "series"
>) => {
  const gradientIdPrefix = useId();
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  const categoryColors = useMemo(() => {
    const map = new Map<string, ChartColor>();
    series.forEach((s, i) => {
      const color = s.color ?? colors[i % colors.length];
      map.set(s.key, color);
      map.set(resolveSeriesName(s), color);
    });
    return map;
  }, [series, colors]);

  const seriesNamesByKey = useMemo(() => {
    const map = new Map<string, string>();
    series.forEach((s) => {
      map.set(s.key, resolveSeriesName(s));
    });
    return map;
  }, [series]);

  const categories = useMemo(() => series.map(resolveSeriesName), [series]);

  const visibleSeries = useMemo(
    () => series.filter((s) => !hiddenSeries.has(resolveSeriesName(s))),
    [series, hiddenSeries]
  );

  const sortedSeries = useMemo(
    () => [...visibleSeries].sort((a, b) => RENDER_ORDER[a.type] - RENDER_ORDER[b.type]),
    [visibleSeries]
  );

  const hasBars = visibleSeries.some((s) => s.type === "bar");
  const resolvedDomain = yAxisDomain ?? [autoMinValue ? "auto" : 0, "auto"];

  const handleLegendToggle = (category: string) => {
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsComposedChart data={data} onClick={onClick}>
        <defs>
          {series
            .filter((s): s is SeriesConfig & { type: "area" } => s.type === "area")
            .map((area) => {
              const name = resolveSeriesName(area);
              const hex = getColorHex(categoryColors.get(name));
              const gradientId = `${gradientIdPrefix}-area-${area.key}`;

              return (
                <linearGradient key={gradientId} id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={hex} stopOpacity={area.fillOpacity ?? 0.3} />
                  <stop offset="95%" stopColor={hex} stopOpacity={0.05} />
                </linearGradient>
              );
            })}
        </defs>

        {showGridLines && (
          <CartesianGrid
            className="stroke-tremor-border dark:stroke-dark-tremor-border stroke-1"
            horizontal
            vertical={false}
            strokeDasharray="3 3"
          />
        )}

        {showXAxis && (
          <XAxis
            dataKey={index}
            tick={
              wrapXAxisLabels
                ? (props) => <WrappedAxisTick {...props} />
                : { transform: "translate(0, 6)", fill: "rgb(var(--text-secondary))" }
            }
            className="text-tremor-label"
            tickLine={false}
            axisLine={false}
            tickFormatter={xAxisFormatter}
            interval={wrapXAxisLabels ? 0 : undefined}
            height={wrapXAxisLabels ? 60 : undefined}
            padding={!hasBars ? { left: 40, right: 40 } : undefined}
          />
        )}

        {showYAxis && (
          <YAxis
            width={yAxisWidth}
            axisLine={false}
            tickLine={false}
            type="number"
            domain={resolvedDomain}
            tick={{ transform: "translate(-3, 0)", fill: "rgb(var(--text-secondary))" }}
            className="text-tremor-label"
            tickFormatter={yAxisFormatter}
            allowDecimals={allowDecimals}
          />
        )}

        <Tooltip
          wrapperStyle={{ outline: "none" }}
          isAnimationActive={false}
          cursor={{ stroke: "rgb(var(--border-primary))", strokeWidth: 1 }}
          content={({ active, payload, label }) =>
            showTooltip ? (
              renderTooltip ? (
                renderTooltip({
                  active,
                  payload: payload?.map((item) => ({ ...item })),
                  label: String(label),
                })
              ) : (
                <ChartTooltip
                  active={active}
                  payload={payload}
                  label={String(label)}
                  valueFormatter={valueFormatter}
                  categoryColors={categoryColors}
                  categoryFormatter={(category) => seriesNamesByKey.get(category) ?? category}
                />
              )
            ) : null
          }
          position={{ y: 0 }}
        />

        {showLegend && (
          <Legend
            verticalAlign="top"
            height={40}
            content={() => (
              <ChartLegend
                categories={categories}
                categoryColors={categoryColors}
                hiddenSeries={hiddenSeries}
                onToggle={handleLegendToggle}
              />
            )}
          />
        )}

        {sortedSeries.map((s) => {
          const name = resolveSeriesName(s);
          const hex = getColorHex(categoryColors.get(name));

          switch (s.type) {
            case "area": {
              const gradientId = `${gradientIdPrefix}-area-${s.key}`;
              return (
                <Area
                  key={`area-${s.key}`}
                  type={s.curveType ?? "monotone"}
                  dataKey={s.key}
                  name={name}
                  stroke={hex}
                  strokeWidth={s.strokeWidth ?? 2}
                  fill={s.showGradient === false ? hex : `url(#${gradientId})`}
                  fillOpacity={s.showGradient === false ? (s.fillOpacity ?? 0.3) : 1}
                  dot={{ r: 3, fill: hex }}
                  activeDot={{ r: 5, fill: hex }}
                  connectNulls={s.connectNulls}
                  isAnimationActive={showAnimation}
                />
              );
            }

            case "bar": {
              const hasDimming = activeBarIndex !== undefined && activeBarIndex !== null;
              const barColors = s.barColors;
              const needsCells = !!barColors || hasDimming;

              return (
                <Bar
                  key={`bar-${s.key}`}
                  dataKey={s.key}
                  name={name}
                  fill={hex}
                  isAnimationActive={showAnimation}
                  stackId={s.stackId}
                  radius={s.stackId ? undefined : [3, 3, 0, 0]}
                  cursor={onBarClick ? "pointer" : undefined}
                  onClick={
                    onBarClick
                      ? (_data: unknown, dataIndex: number) => onBarClick(dataIndex, s.key)
                      : undefined
                  }
                >
                  {showBarLabels && (
                    <LabelList
                      dataKey={s.key}
                      position="top"
                      fill="rgb(var(--text-secondary))"
                      className="text-xs"
                      offset={4}
                      formatter={barLabelFormatter}
                    />
                  )}
                  {needsCells &&
                    data.map((_, i) => (
                      <Cell
                        key={i}
                        fill={barColors?.[i] ?? hex}
                        fillOpacity={hasDimming ? (activeBarIndex === i ? 1 : 0.3) : 1}
                        style={{ transition: "fill-opacity 150ms ease" }}
                      />
                    ))}
                </Bar>
              );
            }

            case "line":
              return (
                <Line
                  key={`line-${s.key}`}
                  type={s.curveType ?? "monotone"}
                  dataKey={s.key}
                  name={name}
                  stroke={hex}
                  strokeWidth={s.strokeWidth ?? 2}
                  strokeDasharray={s.strokeDasharray}
                  dot={{ r: s.dotRadius ?? 3, fill: hex }}
                  activeDot={{ r: (s.dotRadius ?? 3) + 2, fill: hex }}
                  connectNulls={s.connectNulls}
                  isAnimationActive={showAnimation}
                />
              );
          }
        })}
      </RechartsComposedChart>
    </ResponsiveContainer>
  );
};

const ComposedChart = ({
  className,
  isLoading,
  error,
  data,
  index,
  series,
  ...options
}: ComposedChartProps) => {
  return (
    <div className={cn("h-72", className)}>
      {isLoading && (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed p-2">
            <div className="h-full w-full animate-pulse rounded-lg bg-black/5" />
          </div>
        </div>
      )}

      {!!error && (
        <div className="flex h-full w-full items-center justify-center rounded-lg">
          <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed bg-black/5 p-2">
            <VStack gapSm alignCenter className="opacity-50">
              <div className="text-2xl">
                <CircleX />
              </div>
              <Label>Error Loading Data</Label>
            </VStack>
          </div>
        </div>
      )}

      {!isLoading && !error && data && index && series && (
        <div className="h-full w-full">
          <ComposedChartCore data={data} index={index} series={series} {...options} />
        </div>
      )}
    </div>
  );
};

export default ComposedChart;
