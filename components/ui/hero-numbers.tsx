"use client";

// Vendored from packages/ui/src/components/HeroNumbers. Styling verbatim; @wind/Remix deps stripped for v0.
// NOTE several app-coupled sub-deps are stubbed locally:
//   - Remix <Link>/<Await>/<Suspense> deferred loading -> plain wrappers; DeferredNumber resolves the promise via state.
//   - react-loading-skeleton -> a div with the pulse animation.
//   - FormattedNumber (millify formatting) -> Intl.NumberFormat with compact notation.
//   - PercentChange -> minimal up/down delta badge.
//   - InfoTooltip -> the kit Tooltip wrapping a lucide Info icon.

import { HStack } from "@/components/ui/stack";
import { Tooltip, type TooltipProps } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { Children, useEffect, useState, type ComponentProps, type ReactNode } from "react";

// NOTE: react-loading-skeleton stand-in.
const Skeleton = ({ width }: { width?: number }) => (
  <span
    className="inline-block animate-pulse rounded bg-surface-muted align-middle"
    style={{ width: width ?? 80, height: "1em" }}
  />
);

// NOTE: @wind FormattedNumber stand-in (millify -> Intl compact notation).
const FormattedNumber = ({
  number,
  millify,
  prefix,
  suffix,
  decimals,
}: {
  number: number;
  millify?: boolean;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) => {
  const formatted = new Intl.NumberFormat("en-US", {
    notation: millify ? "compact" : "standard",
    maximumFractionDigits: decimals ?? (millify ? 1 : 2),
    minimumFractionDigits: decimals ?? 0,
  }).format(number);
  return (
    <>
      {prefix}
      {formatted}
      {suffix}
    </>
  );
};

// NOTE: @wind PercentChange stand-in.
const PercentChange = ({
  className,
  current,
  previous,
}: {
  className?: string;
  current?: number;
  previous?: number | null;
}) => {
  if (current == null || previous == null || previous === 0) {
    return null;
  }
  const pct = ((current - previous) / Math.abs(previous)) * 100;
  const up = pct >= 0;
  return (
    <span className={cn("font-medium", up ? "text-green" : "text-red", className)}>
      {up ? "+" : ""}
      {pct.toFixed(1)}%
    </span>
  );
};

// NOTE: @wind InfoTooltip stand-in built on the kit Tooltip.
const InfoTooltip = ({
  className,
  side,
  tooltip,
}: {
  className?: string;
  side?: TooltipProps["side"];
  tooltip?: ReactNode;
}) => (
  <Tooltip tooltip={tooltip} side={side}>
    <span className={cn("inline-flex text-tertiary", className)}>
      <Info className="h-3.5 w-3.5" />
    </span>
  </Tooltip>
);

export interface HeroNumberProps {
  className?: string;
  title: string;
  to?: string;
  loading?: boolean;
  /** Help text for the title */
  helpText?: string;
  helpTooltipSide?: ComponentProps<typeof InfoTooltip>["side"];
  number?: number;
  children?: ReactNode;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Label below the number usually the unit of measure */
  label?: string;
  showPercentChange?: boolean;
  previousNumber?: number | null | undefined;
  /** Optional action (e.g. button) rendered at the bottom of the tile */
  action?: ReactNode;
  /** Compact variant: smaller number, reduced padding, balanced vertical spacing */
  compact?: boolean;
}

export const HeroNumberInner = ({
  title,
  number,
  decimals,
  prefix,
  suffix,
  label,
  loading,
  helpText,
  helpTooltipSide,
  showPercentChange,
  previousNumber,
  children,
  action,
  compact,
}: HeroNumberProps) => {
  const titleRow = (
    <HStack gapSm className={compact ? "pt-1" : "pb-1"}>
      <Label className="text-secondary">{title}</Label>
      {helpText && (
        <InfoTooltip
          className="opacity-0 transition-opacity group-hover:opacity-100"
          side={helpTooltipSide}
          tooltip={helpText}
        />
      )}
    </HStack>
  );

  return (
    <div className="group">
      {/* Compact (perf-review) renders the title below the number; default keeps it above. */}
      {!compact && titleRow}
      <HStack alignYBottom gapSm>
        <div className={cn("text-4xl font-medium", { "text-2xl": compact })}>
          {loading ? (
            <Skeleton width={100} />
          ) : (
            <>
              {number != null ? (
                <FormattedNumber
                  number={number}
                  millify
                  prefix={prefix}
                  suffix={suffix}
                  decimals={decimals}
                />
              ) : (
                children
              )}
            </>
          )}
        </div>
        {showPercentChange && (
          <PercentChange className="text-base" current={number} previous={previousNumber} />
        )}
      </HStack>
      {compact && titleRow}
      {label && <div className="text-sm font-medium text-tertiary">{label}</div>}
      {action && <div className="pt-3">{action}</div>}
    </div>
  );
};

const HeroNumber = ({ className, to, ...props }: HeroNumberProps) => {
  const inner = (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-surface shadow-sm px-4 py-3 transition-all group",
        {
          "hover:bg-surface-muted hover:shadow": to,
          "py-5": props.compact,
        },
        className
      )}
    >
      <HeroNumberInner {...props} />
    </div>
  );

  // NOTE: Remix <Link> replaced with a plain anchor.
  if (to) {
    return <a href={to}>{inner}</a>;
  }
  return inner;
};

type DeferredHeroNumberProps<T> = Omit<ComponentProps<typeof HeroNumber>, "number"> & {
  resolve: Promise<T>;
  resolvedNumber: (resolved: T) => number;
};

// NOTE: Remix <Suspense>/<Await> replaced with promise-resolving state so the tile renders standalone.
const DeferredHeroNumber = <T,>({
  resolve,
  resolvedNumber,
  ...extraProps
}: DeferredHeroNumberProps<T>) => {
  const [resolved, setResolved] = useState<T | null>(null);

  useEffect(() => {
    let active = true;
    void resolve.then((r) => {
      if (active) {
        setResolved(r);
      }
    });
    return () => {
      active = false;
    };
  }, [resolve]);

  if (resolved == null) {
    return <HeroNumbers.Number number={0} {...extraProps} loading={true} />;
  }
  return <HeroNumbers.Number number={resolvedNumber(resolved)} {...extraProps} />;
};

export const HeroNumbers = ({
  className,
  children,
  gap = "default",
}: {
  className?: string;
  children: ReactNode;
  gap?: "default" | "lg";
}) => {
  const childrenArray = Children.toArray(children);

  return (
    <div className={cn("@container", className)}>
      <div
        className={cn(
          "grid place-content-stretch place-items-stretch",
          { "gap-4": gap === "default", "gap-6": gap === "lg" },
          {
            "grid-cols-1": childrenArray.length === 1,
            "grid grid-cols-1 @sm:grid-cols-2": childrenArray.length === 2,
            "grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3": childrenArray.length === 3,
            "grid grid-cols-1 @sm:grid-cols-2 @xl:grid-cols-4": childrenArray.length === 4,
            "grid grid-cols-1 @sm:grid-cols-2 @xl:grid-cols-5": childrenArray.length === 5,
          }
        )}
      >
        {children}
      </div>
    </div>
  );
};

HeroNumbers.Number = HeroNumber;
HeroNumbers.NumberInner = HeroNumberInner;
HeroNumbers.DeferredNumber = DeferredHeroNumber;

export default HeroNumbers;
