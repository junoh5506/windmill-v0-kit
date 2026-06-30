"use client";

// Vendored from packages/ui/src/components/CheckboxGroup/CheckboxGroup.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { Checkbox } from "@/components/ui/checkbox";
import { HStack, VStack } from "@/components/ui/stack";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

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

export interface CheckboxGroupOption {
  icon?: ReactNode;
  value: string | number;
  label: string;
  description?: string | null;
  disabled?: boolean;
}

interface Props {
  className?: string;
  options: CheckboxGroupOption[];
  value?: Array<string | number>;
  onChange?: (value: Array<string | number>) => void;
  disabled?: boolean;
  varient?: "cards" | "checkboxes";
}

const CheckboxGroupCheckboxes = ({
  options,
  value = [],
  disabled,
  className,
  handleCheckboxChange,
}: Props & { handleCheckboxChange: (optionValue: string | number, checked: boolean) => void }) => (
  <div className={cn("my-1", className)}>
    {options.map((option) => {
      const optionId = `checkbox-${option.value}`;
      const isChecked = value.includes(option.value);
      const isDisabled = disabled || option.disabled;

      return (
        <div
          className={cn("relative flex items-center", {
            "cursor-not-allowed opacity-50": isDisabled,
          })}
          key={option.value}
        >
          <div className="flex h-5 items-center">
            <Checkbox
              id={optionId}
              value={isChecked}
              onChange={(checked) => handleCheckboxChange(option.value, checked)}
              disabled={isDisabled}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor={optionId} className={cn({ "cursor-not-allowed": isDisabled })}>
              <span className="font-medium text-primary">{option.label}</span>
              {option.description && (
                <span className="text-secondary">
                  {` - `}
                  {option.description}
                </span>
              )}
            </label>
          </div>
        </div>
      );
    })}
  </div>
);

const CheckboxGroupCards = ({
  options,
  value = [],
  disabled,
  className,
  handleCheckboxChange,
}: Props & { handleCheckboxChange: (optionValue: string | number, checked: boolean) => void }) => (
  <div className={cn("flex flex-col gap-2", className)}>
    {options.map((option) => {
      const optionId = `checkbox-${option.value}`;
      const isChecked = value.includes(option.value);
      const isDisabled = disabled || option.disabled;

      return (
        <label
          htmlFor={optionId}
          className={cn("card px-3 py-2", {
            "cursor-not-allowed opacity-50": isDisabled,
            "hover:bg-surface-muted/50": !isDisabled,
          })}
          key={option.value}
        >
          <HStack alignYTop>
            <Checkbox
              id={optionId}
              value={isChecked}
              onChange={(checked) => handleCheckboxChange(option.value, checked)}
              disabled={isDisabled}
              className="mt-1"
            />
            <VStack gapNone>
              <Label>{option.label}</Label>
              {option.description && <Label intent="secondary">{option.description}</Label>}
            </VStack>
          </HStack>
        </label>
      );
    })}
  </div>
);

export const CheckboxGroup = ({
  value = [],
  onChange,
  varient = "checkboxes",
  ...props
}: Props) => {
  const handleCheckboxChange = (optionValue: string | number, checked: boolean) => {
    if (!onChange) {
      return;
    }

    const newValue = checked ? [...value, optionValue] : value.filter((v) => v !== optionValue);

    onChange(newValue);
  };

  switch (varient) {
    case "checkboxes":
      return (
        <CheckboxGroupCheckboxes
          {...props}
          handleCheckboxChange={handleCheckboxChange}
          value={value}
        />
      );
    case "cards":
      return (
        <CheckboxGroupCards {...props} handleCheckboxChange={handleCheckboxChange} value={value} />
      );
  }
};

export default CheckboxGroup;
