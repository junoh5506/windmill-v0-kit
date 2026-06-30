"use client";
// Vendored from packages/ui/src/components/DatePicker/DatePicker.tsx. Styling verbatim; Remix/workspace deps stripped for v0.
// useTimezone (@wind) dropped — tz defaults to "UTC"; ShadButton outline trigger inlined as a styled <button>.

import Calendar from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";

interface Props {
  value: string | undefined;
  onChange: (date: string | undefined) => void;
  fromDate?: DateTime;
  toDate?: DateTime;
  tz?: string;
}

function toCalendarDate(dt: DateTime | undefined): Date | undefined {
  if (!dt) {
    return undefined;
  }

  return dt.setZone("local", { keepLocalTime: true }).toJSDate();
}

function fromCalendarDate(date: Date, targetZone: string): DateTime {
  return DateTime.fromJSDate(date).setZone(targetZone, { keepLocalTime: true });
}

const DatePicker = ({ value, onChange, fromDate, toDate, tz }: Props) => {
  const [open, setOpen] = useState(false);
  const effectiveTz = tz ?? "UTC";

  const parsedDate = useMemo(
    () => (value ? DateTime.fromFormat(value, "yyyy-MM-dd", { zone: effectiveTz }) : undefined),
    [value, effectiveTz]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id="date"
          className={cn(
            "inline-flex items-center justify-between whitespace-nowrap rounded-md text-ui font-normal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            "border border-input bg-background shadow-sm hover:bg-surface-muted hover:text-accent-foreground",
            "h-9 px-4 py-2 w-48"
          )}
        >
          {parsedDate?.toLocaleString(DateTime.DATE_MED) ?? "Select date"}
          <ChevronDownIcon />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          fromDate={toCalendarDate(fromDate)}
          toDate={toCalendarDate(toDate)}
          mode="single"
          selected={toCalendarDate(parsedDate)}
          onSelect={(date) => {
            if (date) {
              onChange(fromCalendarDate(date, effectiveTz).toFormat("yyyy-MM-dd"));
            } else {
              onChange(undefined);
            }
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
