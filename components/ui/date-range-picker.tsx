"use client";
// Vendored from packages/ui/src/components/DateRangePicker/DateRangePicker.tsx. Styling verbatim; Remix/workspace deps stripped for v0.
// @wind/util DateTimeRange/StringUtil replaced with a plain luxon DateRange ({ from, to } DateTimes) + inline quick-range/format helpers.
// Chip variant + FlexibleSpacer inlined; useTimezone dropped (tz defaults to "UTC").

import Calendar from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HStack, VStack } from "@/components/ui/stack";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { CheckIcon, ChevronDown } from "lucide-react";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";

export interface DateRange {
  from: DateTime;
  to: DateTime;
}

export type PickerDateRangeString =
  | "all time"
  | "tomorrow"
  | "today"
  | "yesterday"
  | "this week"
  | "last week"
  | "2 weeks ago"
  | "3 weeks ago"
  | "4 weeks ago";

interface Props {
  className?: string;
  tz?: string;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  placeholder?: string;
  quickRanges?: PickerDateRangeString[];
  variant?: "chip" | "button" | "button-sm";
}

export const QUICK_RANGES: PickerDateRangeString[] = [
  "all time",
  "tomorrow",
  "today",
  "yesterday",
  "this week",
  "last week",
  "2 weeks ago",
  "3 weeks ago",
  "4 weeks ago",
];

function formatAsReadableTitle(value: string): string {
  return value
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}

function rangesEqual(a: DateRange | undefined, b: DateRange | undefined): boolean {
  if (!a || !b) {
    return a === b;
  }
  return a.from.equals(b.from) && a.to.equals(b.to);
}

function quickRangeToDateRange(label: PickerDateRangeString, tz: string): DateRange | undefined {
  if (label === "all time") {
    return undefined;
  }

  const now = DateTime.now().setZone(tz);

  switch (label) {
    case "today":
      return { from: now.startOf("day"), to: now.endOf("day") };
    case "yesterday": {
      const day = now.minus({ days: 1 });
      return { from: day.startOf("day"), to: day.endOf("day") };
    }
    case "tomorrow": {
      const day = now.plus({ days: 1 });
      return { from: day.startOf("day"), to: day.endOf("day") };
    }
    case "this week":
      return { from: now.startOf("week"), to: now.endOf("week") };
    case "last week": {
      const week = now.minus({ weeks: 1 });
      return { from: week.startOf("week"), to: week.endOf("week") };
    }
    default: {
      // "N weeks ago"
      const match = /^(\d+)\s+weeks ago$/.exec(label);
      const count = match ? parseInt(match[1], 10) : 0;
      const week = now.minus({ weeks: count });
      return { from: week.startOf("week"), to: week.endOf("week") };
    }
  }
}

function formatRange(range: DateRange): string {
  const currentYear = DateTime.now().year;
  const isCurrentYear = range.from.year === currentYear && range.to.year === currentYear;
  const dateFormat = isCurrentYear ? "LLL d" : "LLL d, yyyy";

  return range.from.hasSame(range.to, "day")
    ? range.from.toFormat(dateFormat)
    : `${range.from.toFormat(dateFormat)} – ${range.to.toFormat(dateFormat)}`;
}

function toCalendarDateRange(range: DateRange | undefined): { from: Date; to: Date } | undefined {
  if (!range) {
    return undefined;
  }

  return {
    from: range.from.setZone("local", { keepLocalTime: true }).toJSDate(),
    to: range.to.setZone("local", { keepLocalTime: true }).toJSDate(),
  };
}

function fromCalendarDateRange(
  range: { from?: Date; to?: Date },
  targetZone: string
): DateRange | undefined {
  if (!range.from) {
    return undefined;
  }

  const from = DateTime.fromJSDate(range.from).startOf("day");
  if (!from.isValid) {
    return undefined;
  }

  const to = range.to ? DateTime.fromJSDate(range.to).endOf("day") : from.endOf("day");
  if (!to.isValid) {
    return undefined;
  }

  return {
    from: from.setZone(targetZone, { keepLocalTime: true }),
    to: to.setZone(targetZone, { keepLocalTime: true }),
  };
}

const DateRangePicker = ({
  className,
  dateRange,
  tz,
  setDateRange,
  quickRanges = QUICK_RANGES,
  variant = "button",
}: Props) => {
  const [isOpen, setOpen] = useState(false);
  const effectiveTz = tz ?? "UTC";

  const [pendingRange, setPendingRange] = useState<{ from: Date; to?: Date } | undefined>();

  const quickRangeOptions = useMemo(() => {
    return quickRanges.map((label) => ({
      label,
      range: quickRangeToDateRange(label, effectiveTz),
    }));
  }, [effectiveTz, quickRanges]);

  const matchingQuickRange = useMemo(() => {
    return quickRangeOptions.find((r) => {
      if (!dateRange && r.range === undefined) {
        return true;
      }
      if (!dateRange?.from || !dateRange.to) {
        return false;
      }
      return rangesEqual(r.range, dateRange);
    });
  }, [dateRange, quickRangeOptions]);

  const label = dateRange ? formatRange(dateRange) : "All Time";

  const committedCalendarRange = useMemo(() => toCalendarDateRange(dateRange), [dateRange]);
  const displayedRange = pendingRange ?? committedCalendarRange;

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          setPendingRange(undefined);
          setOpen(open);
        }}
      >
        <PopoverTrigger>
          <>
            {variant === "button" && (
              <div
                id="date"
                className={cn(
                  "w-full justify-start text-left font-normal border flex items-center gap-2 px-4 py-2 rounded-md hover:bg-surface-muted shadow-sm truncate",
                  !dateRange?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <div className="text-body-sm font-medium">{label}</div>
                <div className="flex-1" />
                <ChevronDown className="w-4" />
              </div>
            )}
            {variant === "button-sm" && (
              <div
                id="date"
                className={cn(
                  "w-full justify-start text-left font-normal border flex items-center gap-1 px-2 py-1 rounded-md h-8 hover:bg-surface-muted shadow-sm text-sm truncate",
                  !dateRange?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-1 h-3 w-3" />
                <div className="text-body-sm font-medium">{label}</div>
                <div className="flex-1" />
                <ChevronDown className="w-4" />
              </div>
            )}
            {variant === "chip" && (
              <div className="inline-flex items-center gap-1.5 rounded-full border bg-surface px-3 py-1 text-body-sm font-medium hover:bg-black/5">
                <CalendarIcon className="h-3.5 w-3.5" />
                {label}
              </div>
            )}
          </>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <HStack gapNone alignYStretch>
            <div className="overflow-y-auto border-r">
              <VStack className="w-[200px] px-1 py-2" gapNone>
                {quickRangeOptions.map(({ label, range }) => (
                  <button
                    key={label}
                    className={cn(
                      "py-1 pr-4 pl-2 text-left text-body-sm font-medium hover:bg-black/5 rounded-md flex items-center",
                      {
                        "bg-black/5": matchingQuickRange?.label === label,
                      }
                    )}
                    onClick={() => {
                      setDateRange(range);
                      setPendingRange(undefined);
                      setOpen(false);
                    }}
                  >
                    <div className="w-6">
                      {matchingQuickRange?.label === label && (
                        <CheckIcon className="mr-2 h-4 w-4" />
                      )}
                    </div>
                    {formatAsReadableTitle(label)}
                  </button>
                ))}
              </VStack>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from.toJSDate()}
              onSelect={(_range, selectedDay) => {
                if (!pendingRange) {
                  setPendingRange({ from: selectedDay });
                } else {
                  const [from, to] =
                    selectedDay < pendingRange.from
                      ? [selectedDay, pendingRange.from]
                      : [pendingRange.from, selectedDay];

                  const newRange = fromCalendarDateRange({ from, to }, effectiveTz);
                  setDateRange(newRange);
                  setPendingRange(undefined);
                }
              }}
              selected={displayedRange}
              numberOfMonths={2}
            />
          </HStack>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
