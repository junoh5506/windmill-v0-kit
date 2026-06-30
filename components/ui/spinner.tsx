"use client";

// Vendored from packages/ui/src/components/Spinner/Spinner.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

interface Props {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

// NOTE: react-icons CgSpinner mapped to lucide-react Loader2.
const Spinner = forwardRef<HTMLDivElement, Props>(({ className, size = "md" }, ref) => (
  <div ref={ref} className={cn("flex items-center justify-center p-4", className)}>
    <Loader2
      className={cn("animate-spin  opacity-70", {
        "text-sm": size === "xs",
        "text-base": size === "sm",
        "text-2xl": size === "md",
        "text-4xl": size === "lg",
      })}
    />
  </div>
));

Spinner.displayName = "Spinner";

export default Spinner;
