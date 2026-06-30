"use client";

// Vendored from packages/ui/src/components/SortControl. Styling verbatim; @wind/Remix deps stripped for v0.
// NOTE: @wind/common-interfaces SortDirection inlined as a local enum. Popover imported from the kit primitive.

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { IconSortDescending as ArrowDownWideNarrow, IconSortAscending as ArrowUpNarrowWide } from "@tabler/icons-react";
import { useMemo, useState } from "react";

// NOTE: inlined stand-in for @wind/common-interfaces SortDirection.
export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

export interface SortState<T = string> {
  property: T;
  direction: SortDirection;
}

export interface SortOption<T = string> {
  value: T;
  label: string;
  description?: string;
  defaultDirection?: SortDirection;
  directions?: SortDirection[];
}

interface SortControlProps<T extends string = string> {
  className?: string;
  sort: SortState<T>;
  onSortChange: (sort: SortState<T>) => void;
  options: Array<SortOption<T>>;
  disabled?: boolean;
}

const SortControl = <T extends string>({
  className,
  sort,
  onSortChange,
  options,
  disabled = false,
}: SortControlProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = useMemo(
    () => options.find((option) => option.value === sort.property),
    [options, sort.property]
  );

  const allowedDirections = currentOption?.directions ?? [SortDirection.ASC, SortDirection.DESC];
  const hasBothDirections = allowedDirections.length > 1;

  const handlePropertyChange = (option: SortOption<T>) => {
    if (option.value === sort.property) {
      setIsOpen(false);
      return;
    }

    const directions = option.directions ?? [SortDirection.ASC, SortDirection.DESC];
    const defaultDir = option.defaultDirection ?? SortDirection.DESC;
    const direction = directions.includes(defaultDir) ? defaultDir : directions[0];

    onSortChange({ property: option.value, direction });
    setIsOpen(false);
  };

  const toggleDirection = () => {
    const nextDirection =
      sort.direction === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
    onSortChange({ ...sort, direction: nextDirection });
  };

  const DirectionIcon =
    sort.direction === SortDirection.ASC ? ArrowUpNarrowWide : ArrowDownWideNarrow;

  const directionToggleDisabled = disabled || !hasBothDirections;

  return (
    <div className={cn("flex items-center", { "opacity-50": disabled }, className)}>
      <button
        type="button"
        disabled={directionToggleDisabled}
        onClick={toggleDirection}
        className={cn(
          "h-7 flex items-center justify-center rounded-l-md border border-default bg-surface px-1.5",
          hasBothDirections && !disabled && "hover:bg-surface-muted",
          { "cursor-not-allowed": directionToggleDisabled }
        )}
      >
        <DirectionIcon className="h-3.5 w-3.5 text-tertiary" />
      </button>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "h-7 flex items-center gap-1.5 rounded-r-md border border-l-0 border-default bg-surface px-2 text-body-sm font-medium",
              !disabled && "hover:bg-surface-muted data-[state=open]:bg-surface-muted",
              { "cursor-not-allowed": disabled }
            )}
          >
            <span className="truncate">{currentOption?.label ?? sort.property}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto min-w-[140px] p-1" align="start">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handlePropertyChange(option)}
              className="flex w-full items-center justify-between gap-3 rounded-sm px-2 py-1.5 text-sm hover:bg-surface-muted"
            >
              <div className="flex flex-col items-start">
                <span>{option.label}</span>
                {option.description && (
                  <span className="text-[10px] text-tertiary">{option.description}</span>
                )}
              </div>
              {option.value === sort.property && <CheckIcon className="h-3.5 w-3.5 shrink-0" />}
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SortControl;
