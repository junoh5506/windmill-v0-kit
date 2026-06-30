"use client";

// Vendored from packages/ui/src/components/Checkbox/Checkbox.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { forwardRef, type ComponentProps } from "react";

export type CheckboxProps = Omit<
  ComponentProps<"input">,
  "type" | "value" | "onChange" | "defaultValue" | "checked" | "defaultChecked"
> & {
  value?: boolean | null;
  defaultValue?: boolean | null;
  onChange?: (value: boolean) => void;
  issue?: unknown;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onChange, issue, value, defaultValue, ...rest }, ref) => {
    return (
      <input
        {...rest}
        ref={ref}
        type="checkbox"
        checked={value ?? undefined}
        defaultChecked={defaultValue ?? undefined}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={rest.disabled}
        className={className}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
