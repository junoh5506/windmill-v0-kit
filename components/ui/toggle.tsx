"use client";

// Vendored from packages/ui/src/components/Toggle/Toggle.tsx (+ BooleanToggle.tsx). Styling verbatim; Remix/workspace deps stripped for v0.

import { cn } from "@/lib/utils";
import { Root, Thumb } from "@radix-ui/react-switch";
import { CheckIcon, XIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface ToggleMode<T> {
  icon: ReactNode;
  value: T;
}

interface Props<T> {
  id?: string;
  modes: [ToggleMode<T>, ToggleMode<T>];
  selectedMode: T;
  onModeChange: (mode: T) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  leftLabel?: string;
}

export const Toggle = <T,>({
  id,
  modes,
  selectedMode,
  disabled,
  className,
  onModeChange,
  label,
  leftLabel,
}: Props<T>) => {
  const isSelected = selectedMode === modes[1].value;

  const handleLabelClick = () => {
    if (!disabled) {
      onModeChange(isSelected ? modes[0].value : modes[1].value);
    }
  };

  return (
    <div className="flex items-center">
      {leftLabel && (
        <button
          type="button"
          className="pr-2 text-sm text-secondary"
          disabled={disabled}
          onClick={handleLabelClick}
        >
          {leftLabel}
        </button>
      )}
      <Root
        id={id}
        checked={isSelected}
        onCheckedChange={(checked) => {
          onModeChange(checked ? modes[1].value : modes[0].value);
        }}
        className={cn(
          "peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border",
          "hover:ring-1 disabled:hover:ring-0 hover:ring-border transition-all focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-accent dark:data-[state=checked]:bg-accent dark:bg-white/15 hover:dark:bg-white/20 bg-surface-muted",
          className
        )}
        disabled={disabled}
      >
        <Thumb
          className={cn(
            "pointer-events-none h-5 w-5 rounded-full bg-surface shadow-lg ring-0 transition-all data-[state=checked]:translate-x-[1.55rem] data-[state=unchecked]:translate-x-[0.07rem] flex items-center justify-center text-xs",
            {
              "dark:bg-white dark:text-accent-inverse": !isSelected,
            }
          )}
        >
          <div
            className={cn("absolute transition-opacity", {
              "opacity-0": isSelected,
            })}
          >
            {modes[0].icon}
          </div>
          <div
            className={cn("absolute transition-opacity", {
              "opacity-0": !isSelected,
            })}
          >
            {modes[1].icon}
          </div>
        </Thumb>
      </Root>
      {label && (
        <button
          type="button"
          className="pl-2 text-sm text-secondary"
          disabled={disabled}
          onClick={handleLabelClick}
        >
          {label}
        </button>
      )}
    </div>
  );
};

interface BooleanToggleProps {
  id?: string;
  value: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  label?: string;
  leftLabel?: string;
}

export const BooleanToggle = ({
  id,
  onChange,
  value,
  disabled,
  label,
  leftLabel,
}: BooleanToggleProps) => {
  return (
    <Toggle
      disabled={disabled}
      id={id}
      modes={[
        { icon: <XIcon className="h-3" />, value: false },
        { icon: <CheckIcon className="h-3" />, value: true },
      ]}
      selectedMode={value}
      onModeChange={onChange}
      label={label}
      leftLabel={leftLabel}
    />
  );
};

export default Toggle;
