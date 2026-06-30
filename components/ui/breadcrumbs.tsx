"use client";

// Vendored from packages/ui/src/components/Breadcrumbs. Styling verbatim; Remix/workspace deps stripped for v0.

import { Link } from "@/components/ui/link";
import { Label } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { IconChevronRight as ChevronRight } from "@tabler/icons-react";

export interface BreadcrumbItem {
  to?: string;
  label: string;
}

interface Props {
  className?: string;
  crumbs: BreadcrumbItem[];
}

// NOTE: BreadcrumbList rendering kept verbatim. The Breadcrumbs wrapper that
// derived crumbs from the Remix useCurrentPath() route is dropped — pass crumbs
// directly for v0.
export const BreadcrumbList = ({ crumbs, className }: Props) => {
  return (
    <div className={cn(className, "flex gap-1")}>
      {crumbs.map((b) => {
        if (b.to) {
          return (
            <div className="flex items-center justify-center gap-1" key={b.to}>
              <Link to={b.to} key={b.to} className="underline opacity-70 hover:opacity-100">
                <Label intent="secondary">{b.label}</Label>
              </Link>
              <div className="flex items-center justify-center text-body-sm opacity-50">
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          );
        } else {
          return (
            <Label key={b.label} intent="secondary" className="tracking-tight">
              {b.label}
            </Label>
          );
        }
      })}
    </div>
  );
};

export default BreadcrumbList;
