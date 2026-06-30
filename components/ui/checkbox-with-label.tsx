"use client";

// Vendored from packages/ui/src/components/CheckboxWithLabel/CheckboxWithLabel.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { Checkbox } from "@/components/ui/checkbox";
import { HStack, VStack } from "@/components/ui/stack";
import { cn } from "@/lib/utils";
import { forwardRef, type ReactNode } from "react";

// NOTE: Typography Label/Paragraph not vendored; inlined minimal equivalents (text-body-sm tokens preserved).
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

const Paragraph = ({ children }: { children: ReactNode }) => (
  <div className="text-body-sm font-normal text-secondary">{children}</div>
);

export interface CheckboxWithLabelProps extends Omit<React.ComponentProps<typeof Checkbox>, "id"> {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  labelPosition?: "left" | "right";
  className?: string;
}

export const CheckboxWithLabel = forwardRef<HTMLInputElement, CheckboxWithLabelProps>(
  (
    { id, label, description, labelPosition = "right", className, disabled, ...checkboxProps },
    ref
  ) => {
    const labelContent = (
      <label
        htmlFor={id}
        className={cn("block", {
          "cursor-not-allowed opacity-50": disabled,
          "cursor-pointer": !disabled,
          "pl-2": labelPosition === "right",
          "pr-2": labelPosition === "left",
        })}
      >
        <VStack gapNone>
          <Label intent="secondary">{label}</Label>
          {description && <Paragraph>{description}</Paragraph>}
        </VStack>
      </label>
    );

    const checkbox = <Checkbox {...checkboxProps} disabled={disabled} id={id} ref={ref} />;

    return (
      <div className={cn("flex items-start", className)}>
        {labelPosition === "left" ? (
          <HStack gapNone>
            {labelContent}
            {checkbox}
          </HStack>
        ) : (
          <HStack gapNone>
            {checkbox}
            {labelContent}
          </HStack>
        )}
      </div>
    );
  }
);

CheckboxWithLabel.displayName = "CheckboxWithLabel";

export default CheckboxWithLabel;
