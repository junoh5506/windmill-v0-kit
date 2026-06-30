"use client";

// Vendored from packages/ui/src/components/EmptyState/EmptyState.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { HStack, VStack } from "@/components/ui/stack";
import { cn } from "@/lib/utils";
import { ExternalLink, XCircle } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

// NOTE: GradientBackground inlined (gradientBanner token classes preserved verbatim).
const GradientBackground = ({ className }: { className?: string }) => (
  <div className={cn("overflow-hidden -z-10 pointer-events-none rounded-lg", className)}>
    <div className="bg-gradientBanner-accent1/30 absolute bottom-[-34%] left-[-20%] h-[40%] w-[60%] rounded-full blur-2xl"></div>
    <div className="bg-gradientBanner-accent2/30 absolute bottom-[-36%] right-[10%] h-[50%] w-[70%] rounded-full blur-2xl"></div>
    <div className="bg-gradientBanner-accent3/30 absolute bottom-[-30%] right-[-20%] h-[45%] w-[65%] rounded-full blur-2xl"></div>
  </div>
);

// NOTE: Typography Header(level=3)/Label/Paragraph inlined (token classes preserved verbatim).
const Header = ({ children, className }: { children: ReactNode; className?: string }) => (
  <h3 className={cn("text-primary text-header-sm", className)}>{children}</h3>
);

const Label = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("text-secondary text-caption", className)}>{children}</div>
);

const Paragraph = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("text-body-sm text-secondary font-normal", className)}>{children}</div>
);

interface EmptyStateProps {
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
  title: string;
  description: string;
  cadence?: string;
  primaryCTA?: ComponentProps<typeof Button>;
  secondaryCTA?: ComponentProps<typeof Button>;
  externalLink?: string;
  borderless?: boolean;
  intent?: "error" | "loading" | "empty" | "marketing";
  footer?: ReactNode;
}

const EmptyState = ({
  className,
  icon,
  children,
  title,
  description,
  secondaryCTA,
  primaryCTA,
  externalLink,
  borderless,
  intent = "empty",
  footer,
}: EmptyStateProps) => {
  // NOTE: react-icons VscError mapped to lucide-react XCircle.
  if (!icon && intent === "error") {
    icon = (
      <div className="text-red">
        <XCircle />
      </div>
    );
  }

  if (!icon && intent === "loading") {
    icon = <Spinner />;
  }

  return (
    <div className="@container">
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4 px-8 py-12 text-center @md:px-12 relative group/empty-state",
          {
            "rounded-xl border border-dashed": !borderless,
            "bg-gradientBanner ring-1 ring-inset ring-accent/10 border-none hover:ring-accent/20 transition-all duration-500":
              intent === "marketing",
          },
          className
        )}
      >
        {intent === "marketing" && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
            <GradientBackground className="absolute inset-0 z-0 translate-y-6 opacity-50 transition-all duration-500 group-hover/empty-state:translate-y-0 group-hover/empty-state:opacity-70" />
          </div>
        )}
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
          {icon && <div className="text-6xl text-tertiary">{icon}</div>}
          <Header>{title}</Header>
          {description && (
            <Paragraph className="max-w-lg text-balance text-center">{description}</Paragraph>
          )}
          <div className="w-full">{children}</div>
          <VStack gapNone>
            <HStack>
              {secondaryCTA && <Button intent="transparent" {...secondaryCTA} />}
              {primaryCTA && <Button intent="primary" {...primaryCTA} />}
            </HStack>
            {externalLink && (
              <a href={externalLink} target="_blank" rel="noreferrer" className="hover:underline">
                <HStack gapXs>
                  <Label>Learn more</Label>
                  <ExternalLink />
                </HStack>
              </a>
            )}
          </VStack>
          {footer && (
            <Paragraph className="text-muted mt-4 text-center text-xs">{footer}</Paragraph>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
