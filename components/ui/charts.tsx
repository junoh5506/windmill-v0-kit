"use client";

// Vendored from packages/ui/src/components/Charts. Styling verbatim; @wind/Remix deps stripped for v0.

import { VStack } from "@/components/ui/stack";
import { Label } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { IconCircleX as CircleX } from "@tabler/icons-react";
import { DateTime } from "luxon";
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ComponentType,
  type Dispatch,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  Bar,
  CartesianGrid,
  Dot,
  Legend,
  Line,
  Pie,
  ReferenceLine,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as ReChartsDonutChart,
} from "recharts";
import type { NameType, Payload, ValueType } from "recharts/types/component/DefaultTooltipContent";

/* ---------------------------------------------------------------------------
 * Chart colors — mirror of packages/ui/src/util/chartColors.ts (verbatim).
 * ------------------------------------------------------------------------- */

export enum ColorType {
  BACKGROUND = "bg",
  STROKE = "stroke",
  FILL = "fill",
  TEXT = "text",
}

export enum ChartColor {
  BLUE = "BLUE",
  EMERALD = "EMERALD",
  VIOLET = "VIOLET",
  AMBER = "AMBER",
  GRAY = "GRAY",
  CYAN = "CYAN",
  PINK = "PINK",
  RED = "RED",
  GREEN = "GREEN",
  PURPLE = "PURPLE",
}

export const chartColors: Record<ChartColor, Record<ColorType, string>> = {
  [ChartColor.BLUE]: {
    bg: "bg-blue-500",
    stroke: "stroke-blue-500",
    fill: "fill-blue-500",
    text: "text-blue-500",
  },
  [ChartColor.EMERALD]: {
    bg: "bg-emerald-500",
    stroke: "stroke-emerald-500",
    fill: "fill-emerald-500",
    text: "text-emerald-500",
  },
  [ChartColor.VIOLET]: {
    bg: "bg-violet-500",
    stroke: "stroke-violet-500",
    fill: "fill-violet-500",
    text: "text-violet-500",
  },
  [ChartColor.AMBER]: {
    bg: "bg-amber-500",
    stroke: "stroke-amber-500",
    fill: "fill-amber-500",
    text: "text-amber-500",
  },
  [ChartColor.GRAY]: {
    bg: "bg-gray-500",
    stroke: "stroke-gray-500",
    fill: "fill-gray-500",
    text: "text-gray-500",
  },
  [ChartColor.CYAN]: {
    bg: "bg-cyan-500",
    stroke: "stroke-cyan-500",
    fill: "fill-cyan-500",
    text: "text-cyan-500",
  },
  [ChartColor.PINK]: {
    bg: "bg-pink-500",
    stroke: "stroke-pink-500",
    fill: "fill-pink-500",
    text: "text-pink-500",
  },
  [ChartColor.RED]: {
    bg: "bg-red-500",
    stroke: "stroke-red-500",
    fill: "fill-red-500",
    text: "text-red",
  },
  [ChartColor.GREEN]: {
    bg: "bg-green-500",
    stroke: "stroke-green-500",
    fill: "fill-green-500",
    text: "text-green",
  },
  [ChartColor.PURPLE]: {
    bg: "bg-purple-500",
    stroke: "stroke-purple-500",
    fill: "fill-purple-500",
    text: "text-purple-500",
  },
} as const;

export const DEFAULT_CHART_COLORS: ChartColor[] = [
  ChartColor.BLUE,
  ChartColor.AMBER,
  ChartColor.PURPLE,
  ChartColor.RED,
  ChartColor.GREEN,
  ChartColor.PINK,
  ChartColor.CYAN,
  ChartColor.GRAY,
];

export const constructCategoryColors = (
  categories: string[],
  colors: ChartColor[] = DEFAULT_CHART_COLORS
): Map<string, ChartColor> => {
  const categoryColors = new Map<string, ChartColor>();
  categories.forEach((category, index) => {
    categoryColors.set(category, colors[index % colors.length]);
  });
  return categoryColors;
};

export const chartColorHex: Record<ChartColor, string> = {
  [ChartColor.BLUE]: "#0072b2",
  [ChartColor.EMERALD]: "#009e73",
  [ChartColor.VIOLET]: "#785ef0",
  [ChartColor.AMBER]: "#e69f00",
  [ChartColor.GRAY]: "#4b5563",
  [ChartColor.CYAN]: "#56b4e9",
  [ChartColor.PINK]: "#cc79a7",
  [ChartColor.RED]: "#d55e00",
  [ChartColor.GREEN]: "#009e73",
  [ChartColor.PURPLE]: "#785ef0",
};

export const getColorHex = (color: ChartColor = ChartColor.GRAY): string => {
  return chartColorHex[color] ?? "#6b7280";
};

export const getColorClassName = (color: ChartColor = ChartColor.GRAY, type: ColorType): string => {
  const fallbackColor = {
    bg: "bg-gray-500",
    stroke: "stroke-gray-500",
    fill: "fill-gray-500",
    text: "text-gray-500",
  };
  return chartColors[color][type] ?? fallbackColor[type];
};

/* ---------------------------------------------------------------------------
 * Number formatting — inlined from @wind/util NumberUtil.format (millify path
 * stripped; falls back to Intl.NumberFormat). Replaces the @wind/util dep.
 * ------------------------------------------------------------------------- */

interface FormatOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  millify?: boolean;
  showPositiveSign?: boolean;
}

// NOTE: millify() from the real NumberUtil is stubbed with Intl compact notation.
const formatNumber = (
  value: number,
  options: FormatOptions = { maximumFractionDigits: 2 }
): string => {
  const formatted = options.millify
    ? new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(
        value
      )
    : new Intl.NumberFormat("en-US", options).format(value);
  if (options.showPositiveSign && value > 0) {
    return `+${formatted}`;
  }
  return formatted;
};

/* ---------------------------------------------------------------------------
 * Models — from Charts/model/ChartCurveType.ts and ValueFormatter.ts.
 * ------------------------------------------------------------------------- */

export type ChartCurveType = "linear" | "monotone" | "natural" | "step";
export type ValueFormatter = (value: number, category: string) => string;

/* ---------------------------------------------------------------------------
 * ChartLegend — verbatim from Charts/ChartLegend.tsx.
 * ------------------------------------------------------------------------- */

interface ChartLegendCategory {
  key: string;
  label: string;
  color: ChartColor;
}

interface ChartLegendProps {
  categories: ChartLegendCategory[];
  setLegendHeight: Dispatch<SetStateAction<number>>;
}

const ChartLegend = ({ categories, setLegendHeight }: ChartLegendProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateLegendHeight = () => {
      setLegendHeight(containerRef.current ? containerRef.current.clientHeight + 20 : 60);
    };

    updateLegendHeight();

    if (!containerRef.current || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver(updateLegendHeight);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [categories, setLegendHeight]);

  return (
    <div ref={containerRef} className="flex flex-wrap items-center justify-start gap-x-4 gap-y-1">
      {categories.map((category) => (
        <div
          key={category.key}
          className="text-tremor-content dark:text-dark-tremor-content inline-flex items-center gap-2 whitespace-nowrap px-2 py-0.5"
        >
          <svg className="h-2 w-2 shrink-0" viewBox="0 0 8 8" aria-hidden="true">
            <circle cx={4} cy={4} r={4} fill={getColorHex(category.color)} />
          </svg>
          <span className="text-tremor-default truncate">{category.label}</span>
        </div>
      ))}
    </div>
  );
};

/* ---------------------------------------------------------------------------
 * ChartTooltip — verbatim from Charts/ChartTooltip.tsx.
 * ------------------------------------------------------------------------- */

export const ChartTooltipFrame = ({ children }: { children: ReactNode }) => (
  <div className="rounded-tremor-default border-tremor-border bg-tremor-background text-tremor-default shadow-tremor-dropdown dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:shadow-dark-tremor-dropdown border">
    {children}
  </div>
);

export interface ChartTooltipRowProps {
  value: string;
  name: string;
  color: ChartColor;
}

export const ChartTooltipRow = ({ value, name, color }: ChartTooltipRowProps) => (
  <div className="flex items-center justify-between space-x-8">
    <div className="flex items-center space-x-2">
      <span
        className="rounded-tremor-full border-tremor-background shadow-tremor-card dark:border-dark-tremor-background dark:shadow-dark-tremor-card h-3 w-3 shrink-0 border-2"
        style={{ backgroundColor: getColorHex(color) }}
      />
      <p className="text-tremor-content dark:text-dark-tremor-content whitespace-nowrap text-right">
        {name}
      </p>
    </div>
    <p className="text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis whitespace-nowrap text-right font-medium tabular-nums">
      {value}
    </p>
  </div>
);

export interface ChartTooltipProps {
  active: boolean | undefined;
  payload: Array<Payload<ValueType, NameType>> | undefined;
  label: string;
  categoryColors: Map<string, ChartColor>;
  valueFormatter: ValueFormatter;
  categoryFormatter?: (category: string, index: number) => string | undefined;
}

export const ChartTooltip = ({
  active,
  payload,
  label,
  categoryColors,
  categoryFormatter,
  valueFormatter,
}: ChartTooltipProps) => {
  if (active && payload) {
    const rows: Array<{ value: number; name: string }> = payload.flatMap((item) => {
      if (item.type === "none" || typeof item.value !== "number") {
        return [];
      }
      const value: number = item.value;
      return [{ value, name: item.dataKey?.toString() ?? item.name?.toString() ?? "" }];
    });

    return (
      <ChartTooltipFrame>
        <div className="border-tremor-border dark:border-dark-tremor-border border-b px-4 py-2">
          <p className="text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis font-medium">
            {label}
          </p>
        </div>

        <div className="space-y-1 px-4 py-2">
          {rows.map(({ value, name }, index) => (
            <ChartTooltipRow
              key={`id-${name}`}
              value={valueFormatter(value, name)}
              name={categoryFormatter?.(name, index) ?? name}
              color={categoryColors.get(name) ?? ChartColor.GRAY}
            />
          ))}
        </div>
      </ChartTooltipFrame>
    );
  }
  return null;
};

/* ---------------------------------------------------------------------------
 * BarChart — verbatim from Charts/BarChart.tsx.
 * ------------------------------------------------------------------------- */

export interface TimeSeriesItem {
  key: string;
  values: Record<string, number>;
}

export interface BarChartOptions {
  dateFormat: string;
  valueFormatter: (value: number, category: string) => string;
  yAxisFormatter: (value: number) => string;
  yAxisWidth: number;
  categoryFormatter?: (category: string, index: number) => string | undefined;
  xAxisFormatter?: (value: string) => string;
  showLegend: boolean;
  showTooltip: boolean;
  yAxisDomain?: ComponentProps<typeof YAxis>["domain"];
  yAxisTicks?: ComponentProps<typeof YAxis>["ticks"];
  colors: ChartColor[];
  hideYAxis?: boolean;
  hideXAxis?: boolean;
  stacked?: boolean;
}

export interface BarChartLoadedProps extends Partial<BarChartOptions> {
  items: TimeSeriesItem[];
  categories: string[];
}

export interface BarChartProps extends Partial<BarChartOptions> {
  className?: string;
  isLoading: boolean;
  error?: unknown;
  items?: TimeSeriesItem[];
  categories?: string[];
}

const DEFAULT_BAR_CHART_OPTIONS: BarChartOptions = {
  dateFormat: "LLL d",
  valueFormatter: (value) => formatNumber(value),
  yAxisFormatter: (value) => formatNumber(value, { millify: true }),
  yAxisWidth: 30,
  showLegend: true,
  showTooltip: true,
  colors: DEFAULT_CHART_COLORS,
};

const BarChartCore = ({ items, categories, ...rest }: BarChartLoadedProps) => {
  const options: BarChartOptions = { ...DEFAULT_BAR_CHART_OPTIONS, ...rest };

  const {
    dateFormat,
    valueFormatter,
    yAxisFormatter,
    categoryFormatter,
    xAxisFormatter,
    yAxisWidth,
    showLegend,
    yAxisTicks,
    yAxisDomain,
    colors,
    showTooltip,
    hideYAxis,
    hideXAxis,
    stacked,
  } = options;

  const categoryColors = constructCategoryColors(categories, colors);
  const [legendHeight, setLegendHeight] = useState(60);
  const legendCategories = categories.map((category, index) => ({
    key: category,
    label: categoryFormatter?.(category, index) ?? category,
    color: categoryColors.get(category) ?? ChartColor.GRAY,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={items.map((item) => ({ key: item.key, ...item.values }))}>
        <CartesianGrid
          className="stroke-tremor-border dark:stroke-dark-tremor-border stroke-1"
          horizontal={!hideYAxis}
          vertical={false}
        />
        <XAxis
          dataKey="key"
          interval="preserveStartEnd"
          tick={{ transform: "translate(0, 6)" }}
          className="fill-tremor-content text-tremor-label dark:fill-dark-tremor-content"
          tickFormatter={
            xAxisFormatter ?? ((date: string) => DateTime.fromISO(date).toFormat(dateFormat))
          }
          tickLine={false}
          axisLine={false}
          minTickGap={5}
          hide={hideXAxis}
        />
        <YAxis
          width={yAxisWidth}
          hide={hideYAxis}
          axisLine={false}
          tickLine={false}
          type="number"
          domain={yAxisDomain}
          tick={{ transform: "translate(-3, 0)" }}
          ticks={yAxisTicks}
          className="fill-tremor-content text-tremor-label dark:fill-dark-tremor-content"
          tickFormatter={yAxisFormatter}
          allowDecimals={false}
        />
        <Tooltip
          wrapperStyle={{ outline: "none" }}
          isAnimationActive={false}
          cursor={{ fill: "#d1d5db", opacity: 0.15 }}
          content={({ active, payload, label }) =>
            showTooltip ? (
              <ChartTooltip
                active={active}
                payload={payload}
                label={label}
                valueFormatter={valueFormatter}
                categoryColors={categoryColors}
                categoryFormatter={categoryFormatter}
              />
            ) : null
          }
          position={{ y: 0 }}
        />
        {showLegend ? (
          <Legend
            verticalAlign="top"
            height={legendHeight}
            content={() => (
              <div>
                <ChartLegend categories={legendCategories} setLegendHeight={setLegendHeight} />
              </div>
            )}
          />
        ) : null}
        {categories.map((category, index) => (
          <Bar
            key={category}
            dataKey={category}
            name={categoryFormatter?.(category, index) ?? category}
            fill={getColorHex(categoryColors.get(category) ?? ChartColor.GRAY)}
            stackId={stacked ? "stack" : undefined}
            radius={stacked ? undefined : [2, 2, 0, 0]}
            isAnimationActive={false}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

const ChartLoadingState = () => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed p-2">
      <div className="h-full w-full animate-pulse rounded-lg bg-black/5" />
    </div>
  </div>
);

const ChartErrorState = () => (
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
);

export const BarChart = ({
  className,
  isLoading,
  error,
  categories,
  items,
  ...options
}: BarChartProps) => {
  return (
    <div className={cn("h-[350px]", className)}>
      {isLoading && <ChartLoadingState />}
      {!!error && <ChartErrorState />}
      {!isLoading && !error && items && categories && (
        <div className="h-full w-full">
          <BarChartCore items={items} categories={categories} {...options} />
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------------------
 * LineChart — verbatim from Charts/LineChart.tsx.
 * ------------------------------------------------------------------------- */

export interface LineChartOptions {
  dateFormat: string;
  valueFormatter: (value: number, category: string) => string;
  yAxisFormatter: (value: number) => string;
  yAxisWidth: number;
  categoryFormatter?: (category: string, index: number) => string | undefined;
  xAxisFormatter?: (value: string) => string;
  showLegend: boolean;
  showTooltip: boolean;
  yAxisDomain?: ComponentProps<typeof YAxis>["domain"];
  yAxisTicks?: ComponentProps<typeof YAxis>["ticks"];
  colors: ChartColor[];
  referenceLines?: Array<Omit<ComponentProps<typeof ReferenceLine>, "ref">>;
  onClick?: ComponentProps<typeof RechartsLineChart>["onClick"];
  onActivePeriodChange?: (period: string | undefined) => void;
  syncId?: string;
  hideYAxis?: boolean;
  hideXAxis?: boolean;
  curveType?: ChartCurveType;
}

export interface LineChartLoadedProps extends Partial<LineChartOptions> {
  items: TimeSeriesItem[];
  categories: string[];
}

export interface LineChartProps extends Partial<LineChartOptions> {
  className?: string;
  isLoading: boolean;
  error?: unknown;
  items?: TimeSeriesItem[];
  categories?: string[];
}

const DEFAULT_LINE_CHART_OPTIONS: LineChartOptions = {
  dateFormat: "LLL d",
  valueFormatter: (value) => formatNumber(value),
  yAxisFormatter: (value) => formatNumber(value, { millify: true }),
  yAxisWidth: 30,
  showLegend: true,
  showTooltip: true,
  colors: DEFAULT_CHART_COLORS,
};

const LineChartCore = ({
  items,
  categories,
  yAxisDomain,
  onClick,
  ...rest
}: LineChartLoadedProps) => {
  const options: LineChartOptions = { ...DEFAULT_LINE_CHART_OPTIONS, ...rest };

  const {
    dateFormat,
    valueFormatter,
    yAxisFormatter,
    categoryFormatter,
    xAxisFormatter,
    yAxisWidth,
    showLegend,
    yAxisTicks,
    colors,
    showTooltip,
    referenceLines,
    onActivePeriodChange,
    syncId,
    hideYAxis,
    hideXAxis,
    curveType,
  } = options;

  const showAnimation = false;
  const animationDuration = 900;
  const connectNulls = true;
  const categoryColors = constructCategoryColors(categories, colors);
  const [legendHeight, setLegendHeight] = useState(60);
  const legendCategories = categories.map((category, index) => ({
    key: category,
    label: categoryFormatter?.(category, index) ?? category,
    color: categoryColors.get(category) ?? ChartColor.GRAY,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={items.map((item) => ({ key: item.key, ...item.values }))}
        onClick={onClick}
        onMouseMove={(event) => {
          onActivePeriodChange?.(event.activeLabel);
        }}
        onMouseLeave={() => {
          onActivePeriodChange?.(undefined);
        }}
        syncId={syncId}
      >
        <CartesianGrid
          className="stroke-tremor-border dark:stroke-dark-tremor-border stroke-1"
          horizontal={!hideYAxis}
          vertical={false}
        />
        <XAxis
          dataKey="key"
          interval="preserveStartEnd"
          tick={{ transform: "translate(0, 6)" }}
          className="fill-tremor-content text-tremor-label dark:fill-dark-tremor-content"
          tickFormatter={
            xAxisFormatter ?? ((date: string) => DateTime.fromISO(date).toFormat(dateFormat))
          }
          tickLine={false}
          axisLine={false}
          minTickGap={5}
          hide={hideXAxis}
        />
        <YAxis
          width={yAxisWidth}
          hide={hideYAxis}
          axisLine={false}
          tickLine={false}
          type="number"
          domain={yAxisDomain}
          tick={{ transform: "translate(-3, 0)" }}
          ticks={yAxisTicks}
          className="fill-tremor-content text-tremor-label dark:fill-dark-tremor-content"
          tickFormatter={yAxisFormatter}
          allowDecimals={false}
        />
        <Tooltip
          wrapperStyle={{ outline: "none" }}
          isAnimationActive={false}
          cursor={{ stroke: "#d1d5db", strokeWidth: 1 }}
          content={({ active, payload, label }) =>
            showTooltip ? (
              <ChartTooltip
                active={active}
                payload={payload}
                label={label}
                valueFormatter={valueFormatter}
                categoryColors={categoryColors}
                categoryFormatter={categoryFormatter}
              />
            ) : null
          }
          position={{ y: 0 }}
        />

        {showLegend ? (
          <Legend
            verticalAlign="top"
            height={legendHeight}
            content={() => (
              <div>
                <ChartLegend categories={legendCategories} setLegendHeight={setLegendHeight} />
              </div>
            )}
          />
        ) : null}
        {referenceLines?.map((line) => (
          <ReferenceLine key={line.x} {...line} />
        ))}

        {categories.map((category, index) => (
          <Line
            key={category}
            type={curveType ?? "linear"}
            activeDot={(props: {
              cx: number;
              cy: number;
              stroke: string;
              strokeLinecap: ComponentProps<typeof Dot>["strokeLinecap"];
              strokeLinejoin: ComponentProps<typeof Dot>["strokeLinejoin"];
              strokeWidth: number;
            }) => {
              const { cx, cy, stroke, strokeLinecap, strokeLinejoin, strokeWidth } = props;
              return (
                <Dot
                  className="stroke-tremor-background dark:stroke-dark-tremor-background"
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill={getColorHex(categoryColors.get(category) ?? ChartColor.GRAY)}
                  stroke={stroke}
                  strokeLinecap={strokeLinecap}
                  strokeLinejoin={strokeLinejoin}
                  strokeWidth={strokeWidth}
                />
              );
            }}
            dot={() => <></>}
            name={categoryFormatter?.(category, index) ?? category}
            dataKey={category}
            stroke={getColorHex(categoryColors.get(category) ?? ChartColor.GRAY)}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            isAnimationActive={showAnimation}
            animationDuration={animationDuration}
            connectNulls={connectNulls}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export const LineChart = ({
  className,
  isLoading,
  error,
  categories,
  items,
  ...options
}: LineChartProps) => {
  return (
    <div className={cn("h-[350px]", className)}>
      {isLoading && <ChartLoadingState />}
      {error && <ChartErrorState />}
      {!isLoading && !error && items && categories && (
        <div className="h-full w-full">
          <LineChartCore items={items} categories={categories} {...options} />
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------------------
 * GaugeChart — verbatim from Charts/GaugeChart.tsx (Tremor Raw DonutChart).
 * ------------------------------------------------------------------------- */

const sumNumericArray = (arr: number[]): number => arr.reduce((sum, num) => sum + num, 0);

const parseData = (
  data: Array<Record<string, unknown>>,
  categoryColors: Map<string, ChartColor>,
  category: string
) =>
  data.map((dataPoint) => ({
    ...dataPoint,
    color: categoryColors.get(String(dataPoint[category])) || DEFAULT_CHART_COLORS[0],
    className: getColorClassName(
      categoryColors.get(String(dataPoint[category])) || DEFAULT_CHART_COLORS[0],
      ColorType.FILL
    ),
  }));

const calculateDefaultLabel = (data: Array<Record<string, unknown>>, valueKey: string): number =>
  sumNumericArray(data.map((dataPoint) => Number(dataPoint[valueKey])));

const parseLabelInput = (
  labelInput: string | undefined,
  valueFormatter: (value: number) => string,
  data: Array<Record<string, unknown>>,
  valueKey: string
): string => labelInput || valueFormatter(calculateDefaultLabel(data, valueKey));

export type GaugeTooltipProps = Pick<GaugeChartTooltipProps, "active" | "payload">;

interface PayloadItem {
  category: string;
  value: number;
  color: ChartColor | undefined;
}

interface GaugeChartTooltipProps {
  active: boolean | undefined;
  payload: PayloadItem[];
  valueFormatter: (value: number) => string;
}

const GaugeChartTooltip = ({ active, payload, valueFormatter }: GaugeChartTooltipProps) => {
  if (active && payload.length) {
    return (
      <div
        className={cn(
          // base
          "rounded-md border text-sm shadow-md",
          // border color
          "border-gray-200 dark:border-gray-800",
          // background color
          "bg-white dark:bg-gray-950"
        )}
      >
        <div className="space-y-1 px-4 py-2">
          {payload.map(({ value, category, color }, index) => (
            <div key={`id-${index}`} className="flex items-center justify-between space-x-8">
              <div className="flex items-center space-x-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    getColorClassName(color ?? ChartColor.GRAY, ColorType.BACKGROUND)
                  )}
                />
                <p
                  className={cn(
                    // base
                    "whitespace-nowrap text-right",
                    // text color
                    "text-gray-700 dark:text-gray-300"
                  )}
                >
                  {category}
                </p>
              </div>
              <p
                className={cn(
                  // base
                  "whitespace-nowrap text-right font-medium tabular-nums",
                  // text color
                  "text-gray-900 dark:text-gray-50"
                )}
              >
                {valueFormatter(value)}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const renderInactiveShape = (props: ComponentProps<typeof Sector>) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, className } = props;

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      className={className}
      fill=""
      opacity={0.3}
      style={{ outline: "none" }}
    />
  );
};

interface BaseEventProps {
  eventType: "sector";
  categoryClicked: string;
  [key: string]: number | string;
}

type GaugeChartEventProps = BaseEventProps | null | undefined;

export interface GaugeChartProps extends HTMLAttributes<HTMLDivElement> {
  data: Array<Record<string, unknown>>;
  category: string;
  value: string;
  colors?: ChartColor[];
  valueFormatter?: (value: number) => string;
  label?: string;
  showLabel?: boolean;
  showTooltip?: boolean;
  onValueChange?: (value: GaugeChartEventProps) => void;
  tooltipCallback?: (tooltipCallbackContent: GaugeTooltipProps) => void;
  customTooltip?: ComponentType<GaugeTooltipProps>;
}

export const GaugeChart = forwardRef<HTMLDivElement, GaugeChartProps>(
  (
    {
      data = [],
      value,
      category,
      colors = DEFAULT_CHART_COLORS,
      valueFormatter = (value: number) => value.toString(),
      label,
      showLabel = false,
      showTooltip = true,
      onValueChange,
      tooltipCallback,
      customTooltip,
      className,
      ...other
    },
    forwardedRef
  ) => {
    const CustomTooltip = customTooltip;
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
    const isDonut = true;
    const parsedLabelInput = parseLabelInput(label, valueFormatter, data, value);

    const categories = Array.from(new Set(data.map((item) => String(item[category]))));
    const categoryColors = constructCategoryColors(categories, colors);

    const prevActiveRef = useRef<boolean | undefined>(undefined);
    const prevCategoryRef = useRef<string | undefined>(undefined);

    const handleShapeClick = (
      data: { payload: Record<string, number | string> },
      index: number,
      event: MouseEvent
    ) => {
      event.stopPropagation();
      if (!onValueChange) {
        return;
      }

      if (activeIndex === index) {
        setActiveIndex(undefined);
        onValueChange(null);
      } else {
        setActiveIndex(index);
        onValueChange({
          eventType: "sector",
          categoryClicked: String(data.payload[category]),
          ...data.payload,
        });
      }
    };

    return (
      <div ref={forwardedRef} className={cn("w-full aspect-[2/1]", className)} {...other}>
        <ResponsiveContainer className="size-full">
          <ReChartsDonutChart
            onClick={
              onValueChange && activeIndex !== undefined
                ? () => {
                    setActiveIndex(undefined);
                    onValueChange(null);
                  }
                : undefined
            }
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {showLabel && isDonut && (
              <text
                className="fill-gray-700 text-3xl dark:fill-gray-300"
                x="50%"
                y="85%"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {parsedLabelInput}
              </text>
            )}
            <Pie
              className={cn(
                "stroke-white dark:stroke-gray-950 [&_.recharts-pie-sector]:outline-none",
                onValueChange ? "cursor-pointer" : "cursor-default"
              )}
              data={parseData(data, categoryColors, category)}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius="160%"
              outerRadius="200%"
              stroke=""
              strokeLinejoin="round"
              dataKey={value}
              nameKey={category}
              isAnimationActive={false}
              onClick={handleShapeClick}
              activeIndex={activeIndex}
              inactiveShape={renderInactiveShape}
              style={{ outline: "none" }}
            />
            {showTooltip && (
              <Tooltip
                wrapperStyle={{ outline: "none" }}
                isAnimationActive={false}
                content={({ active, payload }) => {
                  const cleanPayload: PayloadItem[] = payload
                    ? payload.map((item) => {
                        const cat = String(item.payload[category]);
                        return {
                          category: cat,
                          value: Number(item.value),
                          color: categoryColors.get(cat),
                        };
                      })
                    : [];

                  const payloadCategory: string = cleanPayload[0]?.category;

                  if (
                    tooltipCallback &&
                    (active !== prevActiveRef.current ||
                      payloadCategory !== prevCategoryRef.current)
                  ) {
                    tooltipCallback({
                      active,
                      payload: cleanPayload,
                    });
                    prevActiveRef.current = active;
                    prevCategoryRef.current = payloadCategory;
                  }

                  return showTooltip && active ? (
                    CustomTooltip ? (
                      <CustomTooltip active={active} payload={cleanPayload} />
                    ) : (
                      <GaugeChartTooltip
                        active={active}
                        payload={cleanPayload}
                        valueFormatter={valueFormatter}
                      />
                    )
                  ) : null;
                }}
              />
            )}
          </ReChartsDonutChart>
        </ResponsiveContainer>
      </div>
    );
  }
);

GaugeChart.displayName = "GaurgeChart";
