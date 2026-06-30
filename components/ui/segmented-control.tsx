"use client";

// Vendored from packages/ui/src/components/SegmentedControl/SegmentedControl.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { cn } from "@/lib/utils";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

const DEFAULT_VARIANTS = {
  size: "md",
  variant: "segmented",
} as const;

const segmentedControlStyles = cva("inline-flex bg-surface p-[3px]", {
  variants: {
    size: {
      sm: "h-8",
      md: "",
      lg: "",
    },
    variant: {
      segmented: "rounded-lg border gap-0.5",
      pills: "rounded-full gap-1",
      icons: "rounded-lg border gap-0.5",
    },
  },
  defaultVariants: DEFAULT_VARIANTS,
});

const segmentedControlItemStyles = cva(
  "relative inline-flex items-center justify-center border border-transparent font-medium transition-colors hover:bg-accent/5",
  {
    variants: {
      size: {
        sm: "px-3 py-1 text-body-sm",
        md: "px-4 py-1.5 text-body-md",
        lg: "px-5 py-2 text-body-md",
      },
      variant: {
        segmented: "rounded-md",
        pills: "rounded-full border",
        icons: "rounded-md",
      },
      selected: {
        true: "border-accent text-primary shadow-sm",
        false: "text-secondary",
      },
    },
    defaultVariants: DEFAULT_VARIANTS,
  }
);

const segmentedControlIndicatorStyles = cva("absolute left-0 top-0 h-full w-full bg-accent/10", {
  variants: {
    variant: {
      segmented: "rounded-md",
      pills: "rounded-full",
      icons: "rounded-md",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: DEFAULT_VARIANTS,
});

interface Props extends VariantProps<typeof segmentedControlStyles> {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SegmentedControl = ({
  options,
  value,
  onChange,
  size = "md",
  variant = "segmented",
  className,
}: Props) => {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(newValue) => {
        if (newValue) {
          onChange(newValue);
        }
      }}
      asChild
    >
      {/* NOTE: framer-motion layout animation dropped; plain div + Tailwind transition stands in. */}
      <div className={cn(segmentedControlStyles({ size, variant }), className)}>
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            // NOTE: icons-variant Tooltip wrapper dropped for v0; label exposed via aria-label.
            <ToggleGroup.Item
              key={option.value}
              value={option.value}
              aria-label={variant === "icons" ? option.label : undefined}
              className={segmentedControlItemStyles({ size, variant, selected: isSelected })}
            >
              {isSelected && (
                <div
                  className={cn(
                    segmentedControlIndicatorStyles({ size, variant }),
                    "transition-all duration-100"
                  )}
                />
              )}
              <span className="relative inline-flex items-center gap-1.5">
                {option.icon}
                {variant !== "icons" && option.label}
              </span>
            </ToggleGroup.Item>
          );
        })}
      </div>
    </ToggleGroup.Root>
  );
};

export default SegmentedControl;
