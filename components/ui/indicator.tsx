"use client";

// Vendored from apps/windmill-web/app/components/Indicator.tsx (+ the status mapping from
// PerformanceReviewStatusIndicator.tsx). Styling verbatim: a ring-{color} circle, a
// bg-{color}-foreground half-fill, and filled status glyphs. react-icons / Radix icons are
// mapped to @tabler/icons-react filled variants; Tooltip comes from the kit.
//
// On the home "to-dos" list, an incomplete/overdue item is RED + EMPTY_CIRCLE — use
// <StatusIndicator status="not-started" /> (or "overdue") for that red ring.

import Tooltip from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLock,
  IconPlayerPauseFilled,
} from "@tabler/icons-react";

export enum IndicatorType {
  EMPTY_CIRCLE = "empty_circle",
  HALF_FILLED_CIRCLE = "half_filled_circle",
  CHECK_CIRCLE = "check_circle",
  LOCK = "lock",
  PAUSE = "pause",
  CROSS_CIRCLE = "cross_circle",
}

export enum IndicatorColor {
  GREEN = "green",
  RED = "red",
  YELLOW = "yellow",
  BLUE = "blue",
  PURPLE = "purple",
  GRAY = "gray",
}

export interface IndicatorProps {
  type: IndicatorType;
  color: IndicatorColor;
  label: string;
  size?: "default" | "sm";
}

const OUTER_RING_CLASS =
  "absolute circle-3 ring-2 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2";

const getColorClasses = (color: IndicatorColor) => {
  switch (color) {
    case IndicatorColor.GREEN:
      return { ring: "ring-green", fill: "bg-green-foreground", text: "text-green" };
    case IndicatorColor.RED:
      return { ring: "ring-red", fill: "bg-red-foreground", text: "text-red" };
    case IndicatorColor.YELLOW:
      return { ring: "ring-yellow", fill: "bg-yellow-foreground", text: "text-yellow" };
    case IndicatorColor.BLUE:
      return { ring: "ring-blue", fill: "bg-blue-foreground", text: "text-blue" };
    case IndicatorColor.PURPLE:
      return { ring: "ring-purple", fill: "bg-purple-foreground", text: "text-purple" };
    case IndicatorColor.GRAY:
      return { ring: "ring-accent/50", fill: "bg-accent/50", text: "text-accent/50" };
  }
};

interface IndicatorSymbolProps {
  color: IndicatorColor;
}

const EmptyCircle = ({ color }: IndicatorSymbolProps) => {
  const colorClasses = getColorClasses(color);
  return <div className={cn(OUTER_RING_CLASS, colorClasses.ring)} />;
};

const HalfFilledCircle = ({ color }: IndicatorSymbolProps) => {
  const colorClasses = getColorClasses(color);
  return (
    <>
      <div
        className={cn(
          "absolute h-2 rounded-l-full w-1 right-1/2 top-1/2 -translate-y-1/2",
          colorClasses.fill
        )}
      />
      <div className={cn(OUTER_RING_CLASS, colorClasses.ring)} />
    </>
  );
};

const CheckCircle = ({ color }: IndicatorSymbolProps) => {
  const colorClasses = getColorClasses(color);
  return (
    <div className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", colorClasses.text)}>
      <IconCircleCheckFilled className="size-5" />
    </div>
  );
};

const LockIndicator = ({ color }: IndicatorSymbolProps) => {
  const colorClasses = getColorClasses(color);
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <IconLock className={cn("size-4", colorClasses.text)} />
    </div>
  );
};

const PauseIndicator = ({ color }: IndicatorSymbolProps) => {
  const colorClasses = getColorClasses(color);
  return (
    <>
      <div className={cn(OUTER_RING_CLASS, colorClasses.ring)} />
      <div
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[0.6rem]",
          colorClasses.text
        )}
      >
        <IconPlayerPauseFilled className="size-3" />
      </div>
    </>
  );
};

const CrossCircle = ({ color }: IndicatorSymbolProps) => {
  const colorClasses = getColorClasses(color);
  return (
    <div className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", colorClasses.text)}>
      <IconCircleXFilled className="size-5" />
    </div>
  );
};

const Indicator = ({ type, color, label, size = "default" }: IndicatorProps) => {
  const isSmall = size === "sm";

  const renderIndicator = () => {
    switch (type) {
      case IndicatorType.EMPTY_CIRCLE:
        return <EmptyCircle color={color} />;
      case IndicatorType.HALF_FILLED_CIRCLE:
        return <HalfFilledCircle color={color} />;
      case IndicatorType.CHECK_CIRCLE:
        return <CheckCircle color={color} />;
      case IndicatorType.LOCK:
        return <LockIndicator color={color} />;
      case IndicatorType.PAUSE:
        return <PauseIndicator color={color} />;
      case IndicatorType.CROSS_CIRCLE:
        return <CrossCircle color={color} />;
    }
  };

  return (
    <Tooltip tooltip={label}>
      <div className={cn("relative size-6", { "size-4": isSmall })}>
        <div className={cn("relative size-full", { "scale-[0.68]": isSmall })}>{renderIndicator()}</div>
      </div>
    </Tooltip>
  );
};

// Convenience wrapper mirroring PerformanceReviewStatusIndicator: maps a to-do status to
// the right (type, color). "not-started"/"overdue" render the RED empty ring used on Home.
export type TodoStatus = "not-started" | "overdue" | "in-progress" | "complete";

const STATUS_MAP: Record<TodoStatus, { type: IndicatorType; color: IndicatorColor; label: string }> = {
  "not-started": { type: IndicatorType.EMPTY_CIRCLE, color: IndicatorColor.RED, label: "Not started" },
  overdue: { type: IndicatorType.EMPTY_CIRCLE, color: IndicatorColor.RED, label: "Overdue" },
  "in-progress": { type: IndicatorType.HALF_FILLED_CIRCLE, color: IndicatorColor.BLUE, label: "In progress" },
  complete: { type: IndicatorType.CHECK_CIRCLE, color: IndicatorColor.GREEN, label: "Complete" },
};

export const StatusIndicator = ({
  status,
  label,
  size,
}: {
  status: TodoStatus;
  label?: string;
  size?: IndicatorProps["size"];
}) => {
  const cfg = STATUS_MAP[status];
  return <Indicator type={cfg.type} color={cfg.color} label={label ?? cfg.label} size={size} />;
};

export default Indicator;
