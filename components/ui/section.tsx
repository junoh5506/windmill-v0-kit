"use client";

// Vendored from packages/ui/src/components/Section/Section.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState, type ComponentProps, type ReactNode } from "react";

// NOTE: react-animate-height dropped — collapse rendered as conditional + max-height transition.
// NOTE: Typography Header/Paragraph dropped — inlined as a heading element + muted paragraph.

interface Props {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  cta?: ComponentProps<typeof Button>;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  icon?: ReactNode;
  id?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Section = ({
  children,
  title,
  description,
  className,
  cta,
  defaultCollapsed = false,
  icon,
  id,
  collapsible = true,
  level = 4,
}: Props) => {
  const [expanded, setExpanded] = useState(!defaultCollapsed);
  const Heading = `h${level}` as const;

  return (
    <div className={className} id={id}>
      <div className="-mx-4 -my-1 flex items-center justify-between px-4 py-1">
        <button
          className="flex-grow py-1 text-left"
          disabled={!collapsible}
          onClick={() => {
            setExpanded((prev) => !prev);
          }}
          type="button"
        >
          <div className="flex items-center gap-2">
            {icon && <div className="opacity-50">{icon}</div>}
            <Heading className="text-header-sm">{title}</Heading>

            {collapsible && (
              <ChevronRight
                className={cn("text-lg opacity-50 transition-all", {
                  // Rotate with animation 90 degrees if expanded
                  "rotate-90 ": !expanded,
                  "-rotate-90": expanded,
                })}
              />
            )}
          </div>
          {description && <p className="text-body-sm text-secondary">{description}</p>}
        </button>
        {cta && <Button intent="link" size="sm" {...cta} />}
      </div>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          expanded ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Section;
