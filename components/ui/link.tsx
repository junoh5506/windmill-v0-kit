"use client";

// Vendored from packages/ui/src/components/Link/Link.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { cn } from "@/lib/utils";
import { forwardRef, type AnchorHTMLAttributes } from "react";

// NOTE: Remix <Link to=...> replaced with a plain styled <a href=...>; the
// UrlUtil safe-link check, PostLink, and prefetch behavior are dropped for v0.
type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ children, className, to, ...props }, ref) => {
    return (
      <a ref={ref} href={to} className={cn(className)} {...props}>
        {children}
      </a>
    );
  }
);

Link.displayName = "Link";

export default Link;
