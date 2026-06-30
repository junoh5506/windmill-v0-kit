"use client";

// Vendored from packages/ui/src/components/Input/Input.tsx. Styling copied verbatim; Remix/workspace deps stripped for v0.

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        {...props}
        ref={ref}
        type={type}
        className={cn(
          "block w-full rounded-md placeholder:text-secondary/50 border-base sm:text-body-sm focus:outline-none focus:ring-accent focus:border-accent bg-surface focus:bg-surface placeholder-secondary",
          className
        )}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
