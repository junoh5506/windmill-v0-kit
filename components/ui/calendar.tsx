"use client";
// Vendored from packages/ui/src/shadcn/ShadCalendar.tsx. Styling verbatim; Remix/workspace deps stripped for v0.
// buttonVariants is inlined from ShadButton (only the variants used by the calendar classNames); Paragraph -> span.

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { IconCheck as Check, IconChevronDown as ChevronDown, IconChevronLeft as ChevronLeft, IconChevronRight as ChevronRight } from "@tabler/icons-react";
import { DateTime } from "luxon";
import {
  Children,
  isValidElement,
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
} from "react";
import { DayPicker, type DropdownProps } from "react-day-picker";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-ui transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-surface-muted hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-black/5",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type CalendarProps = ComponentProps<typeof DayPicker>;

const CALENDAR_YEAR_LOOKBACK = 5;
const CALENDAR_YEAR_LOOKAHEAD = 5;

interface OptionData {
  value: number;
  label: string;
}

function parseOptionChildren(children: ReactNode): OptionData[] {
  const options: OptionData[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement<{ value: number; children: string }>(child)) {
      return;
    }

    options.push({ value: child.props.value, label: child.props.children });
  });

  return options;
}

function CalendarDropdown({
  onChange,
  value,
  children,
  caption,
  className,
  style,
  "aria-label": ariaLabel,
}: DropdownProps) {
  const options = parseOptionChildren(children);

  const handleSelect = (optionValue: number): void => {
    if (!onChange) {
      return;
    }

    const syntheticEvent = {
      target: { value: String(optionValue) },
    } as ChangeEvent<HTMLSelectElement>;

    onChange(syntheticEvent);
  };

  return (
    <div className={className} style={style}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            aria-label={ariaLabel}
            className="flex cursor-pointer select-none items-center gap-1 rounded-sm px-1 py-0.5 text-body-sm font-medium transition-colors hover:bg-surface-muted"
          >
            {caption}
            <ChevronDown className="h-3.5 w-3.5 opacity-40" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="max-h-60 overflow-y-auto">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => handleSelect(option.value)}
              className={cn(
                "cursor-pointer gap-2 text-body-sm focus:bg-surface-muted",
                option.value === value && "text-accent"
              )}
            >
              <span className="flex-grow">{option.label}</span>
              <Check
                className={cn("h-3.5 w-3.5 text-accent", option.value !== value && "invisible")}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const currentYear = DateTime.now().year;

  // react-day-picker's parseFromToProps gives fromYear/toYear priority over fromDate/toDate,
  // so only provide default year bounds when no date/month bounds exist in props.
  const needsDefaultFromYear = !props.fromDate && !props.fromMonth && !props.fromYear;
  const needsDefaultToYear = !props.toDate && !props.toMonth && !props.toYear;

  return (
    <DayPicker
      captionLayout="dropdown-buttons"
      {...(needsDefaultFromYear && { fromYear: currentYear - CALENDAR_YEAR_LOOKBACK })}
      {...(needsDefaultToYear && { toYear: currentYear + CALENDAR_YEAR_LOOKAHEAD })}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 px-10 relative items-center",
        caption_label: "text-body-sm font-medium select-none flex items-center gap-1",
        caption_dropdowns: "flex items-center gap-1",
        dropdown_month: "relative inline-flex items-center",
        dropdown_year: "relative inline-flex items-center",
        vhidden: "sr-only",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-body-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-surface-muted [&:has([aria-selected].day-outside)]:bg-surface-muted [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-accent text-accent-inverse hover:bg-accent focus:bg-accent focus:text-accent-inverse",
        day_today: cn(
          "font-medium",
          "relative after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-accent",
          "aria-selected:after:bg-surface"
        ),
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-surface-muted aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-surface-muted text-primary hover:text-primary",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        Dropdown: CalendarDropdown,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export default Calendar;
