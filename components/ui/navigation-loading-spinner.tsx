"use client";

// Vendored from packages/ui/src/components/NavigationLoadingSpinner/NavigationLoadingSpinner.tsx. Verbatim animation; @wind/Remix deps stripped for v0.
// NOTE: Remix useNavigation/useLocation (which detect a same-page reload) collapse to a single `loading` boolean prop.

import Spinner from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface NavigationLoadingSpinnerProps {
  /** Replaces Remix's "reloading the same page" detection. */
  loading?: boolean;
}

const NavigationLoadingSpinner = ({ loading = false }: NavigationLoadingSpinnerProps) => {
  return (
    <Spinner
      className={cn("opacity-0 p-2", {
        "md:opacity-50": loading,
      })}
    />
  );
};

export default NavigationLoadingSpinner;
