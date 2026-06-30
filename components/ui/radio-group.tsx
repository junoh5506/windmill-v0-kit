"use client";

// Vendored from packages/ui/src/components/RadioGroup/RadioGroup.tsx (+ RadioCircle.tsx). Styling verbatim; Remix/workspace deps stripped for v0.

import { cn } from "@/lib/utils";
import { Description, RadioGroup as HeadlessRadioGroup } from "@headlessui/react";
import { IconCheck as Check, IconCircle as Circle } from "@tabler/icons-react";
import type { ReactNode } from "react";

// NOTE: react-icons BsCheck/BsCircle mapped to lucide Check/Circle.
// NOTE: Typography Label not vendored; inlined minimal equivalent (text-body-sm tokens preserved).
const Label = ({
  intent = "primary",
  children,
}: {
  intent?: "primary" | "secondary";
  children: ReactNode;
}) => (
  <div
    className={cn("text-body-sm font-medium", {
      "text-primary": intent === "primary",
      "text-secondary": intent === "secondary",
    })}
  >
    {children}
  </div>
);

// Inlined from RadioGroup/RadioCircle.tsx.
const RadioCircle = ({ checked }: { checked: boolean }) => (
  <div className="circle-5 relative flex-none">
    <Check
      className={cn(
        "circle-5 absolute inset-0",
        checked ? "opacity-100" : "opacity-0",
        "bg-accent text-sm text-accent-inverse"
      )}
      aria-hidden="true"
    />
    <Circle
      className={cn(
        "circle-5 absolute inset-0",
        checked ? "opacity-0" : "opacity-100",
        "text-sm text-accent"
      )}
      aria-hidden="true"
    />
  </div>
);

export interface RadioGroupOption {
  value: string;
  icon?: ReactNode;
  label: string;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioCardsProps {
  options: RadioGroupOption[];
  listStyle?: "horizontal" | "vertical";
  value: string | undefined;
  onChange: (value: string) => void;
}

export const RadioGroup = ({
  options,
  listStyle = "vertical",
  value,
  onChange,
}: RadioCardsProps) => (
  <HeadlessRadioGroup
    value={value}
    onChange={onChange}
    className={cn({
      "flex flex-row gap-4": listStyle === "horizontal",
      "flex flex-col": listStyle === "vertical",
    })}
  >
    {options.map((o, i) => {
      const isFirst = i === 0;
      const isLast = i === options.length - 1;

      return (
        <HeadlessRadioGroup.Option
          data-value={o.value}
          key={o.value}
          value={o.value}
          disabled={o.disabled}
          className={() =>
            cn(
              "relative flex cursor-pointer bg-surface focus:outline-none hover:bg-surface-muted/50 flex-1",
              o.disabled ? "cursor-not-allowed opacity-50" : "",
              {
                "p-4 rounded-lg border": listStyle === "horizontal",
                "px-4 py-3 first:rounded-t-lg border-l border-r border-t last:rounded-b-lg last:border-b":
                  listStyle === "vertical",
              }
            )
          }
        >
          {({ checked, focus }) => (
            <>
              <span
                className={cn("flex flex-1 gap-2", {
                  "items-start": listStyle === "horizontal",
                  "items-center": listStyle === "vertical",
                })}
              >
                {o.icon && listStyle === "horizontal" && (
                  <div className="mt-1">
                    <div className="opacity-70">{o.icon}</div>
                  </div>
                )}
                <span
                  className={cn({
                    "flex flex-col gap-1": listStyle === "horizontal",
                    "flex flex-row items-center gap-4": listStyle === "vertical",
                  })}
                >
                  {listStyle === "vertical" && <RadioCircle checked={checked} />}
                  <div
                    className={cn("", {
                      "flex flex-col items-start": listStyle === "horizontal",
                      "flex flex-col": listStyle === "vertical",
                    })}
                  >
                    <Label intent="primary">{o.label}</Label>
                    <Description
                      as="span"
                      className="flex items-center text-body-sm text-secondary"
                    >
                      {o.description}
                    </Description>
                  </div>
                </span>
              </span>
              {listStyle === "horizontal" && (
                <Check
                  className={cn(
                    !checked ? "invisible" : "",
                    "circle-6 flex-none bg-accent text-lg text-accent-inverse"
                  )}
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  "pointer-events-none absolute inset-0 z-10",
                  {
                    "ring-accent ring-1": checked && listStyle === "horizontal",
                    "ring-accent ring-2": focus,
                  },
                  {
                    "rounded-lg": listStyle === "horizontal",
                    "rounded-t-lg": listStyle === "vertical" && isFirst,
                    "rounded-b-lg": listStyle === "vertical" && isLast,
                  }
                )}
                aria-hidden="true"
              />
            </>
          )}
        </HeadlessRadioGroup.Option>
      );
    })}
  </HeadlessRadioGroup>
);

export default RadioGroup;
