"use client";

// Vendored from packages/ui/src/components/ComponentLabelWrapper/ComponentLabelWrapper.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { cn } from "@/lib/utils";
import { useMemo, type PropsWithChildren, type ReactNode } from "react";

// NOTE: react-hook-form FieldError replaced with a minimal structural type.
export interface FieldError {
  type?: string;
  message?: string;
}

// NOTE: Typography Paragraph not vendored; inlined minimal equivalent (text-body-sm tokens preserved).
const Paragraph = ({ children }: { children: ReactNode }) => (
  <div className="text-body-sm font-normal text-secondary">{children}</div>
);

export interface ComponentLabelWrapperProps {
  label?: ReactNode;
  htmlFor?: string;
  helpText?: ReactNode;
  helpTextPlacement?: "top" | "bottom";
  inline?: boolean;
  tooltip?: ReactNode;
  error?: FieldError;
}

export const ComponentLabelWrapper = ({
  label,
  htmlFor,
  helpText,
  helpTextPlacement = "bottom",
  children,
  inline,
  tooltip,
  error,
}: PropsWithChildren<ComponentLabelWrapperProps>) => {
  const help = <Paragraph>{helpText}</Paragraph>;

  const errorMessage = useMemo(() => {
    if (!error) {
      return undefined;
    }

    if (error.message) {
      return error.message;
    } else if (error.type === "required") {
      return "This field is required";
    } else if (error.type === "minLength") {
      return `Min length not met`;
    } else if (error.type === "maxLength") {
      return `Max length exceeded`;
    } else {
      return "Field is invalid";
    }
  }, [error]);

  return (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={htmlFor}
          className={cn(
            "cursor-pointer text-header-sm text-secondary font-medium flex items-center gap-1",
            {
              "mb-1": !inline,
            }
          )}
        >
          {label}
          {/* NOTE: InfoTooltip dropped for v0; tooltip text rendered inline when present. */}
          {tooltip && <span className="text-tertiary">{tooltip}</span>}
        </label>
      )}
      {helpText && helpTextPlacement === "top" && (
        <label htmlFor={htmlFor} className="mb-1 block">
          {help}
        </label>
      )}
      {children}
      {helpText && helpTextPlacement === "bottom" && (
        <label htmlFor={htmlFor} className="mt-1">
          {help}
        </label>
      )}
      {errorMessage && <p className="mt-2 text-sm text-red">{errorMessage}</p>}
    </div>
  );
};

export default ComponentLabelWrapper;
