"use client";
// Vendored from packages/ui/src/components/Settings. Styling verbatim; @wind/Remix/app deps stubbed for v0.

import AutoHeightTransition from "@/components/ui/auto-height-transition";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { VStack } from "@/components/ui/stack";
import { Label } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// NOTE: source SettingsSection wraps children in <DividedListCard> (a Card variant
// not vendored into this kit). The divided-card styling is inlined verbatim below
// so the bordered/divided look matches without that dependency.
const DividedListCard = ({ children }: { children: ReactNode }) => (
  <div className="divide-y overflow-hidden rounded-lg border bg-surface">{children}</div>
);

export const SettingsContainer = ({ children }: { children: ReactNode }) => {
  return <VStack gapLg>{children}</VStack>;
};

const SettingsSectionHeader = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => {
  if (!title && !description) {
    return null;
  }

  return (
    <div className="flex flex-col gap-0.5">
      {title && <Label>{title}</Label>}
      {description && <p className="text-sm text-secondary">{description}</p>}
    </div>
  );
};

interface SettingsSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  borderless?: boolean;
}

export const SettingsSection = ({
  title,
  description,
  children,
  className,
  borderless = false,
}: SettingsSectionProps) => {
  if (!borderless) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <SettingsSectionHeader title={title} description={description} />
        <DividedListCard>{children}</DividedListCard>
      </div>
    );
  } else {
    return (
      <div className={cn("flex flex-col divide-y", className)}>
        <SettingsSectionHeader title={title} description={description} />
        {children}
      </div>
    );
  }
};

interface SettingsRowProps {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  accessory?: ReactNode;
  children?: ReactNode;
  showChildren?: boolean;
  className?: string;
  onClick?: () => void;
  to?: string;
  learnMoreLink?: string;
}

const INTERACTIVE_CLASSES = "hover:bg-surface-muted transition-colors";

export const SettingsRow = ({
  title,
  description,
  icon,
  accessory,
  children,
  showChildren,
  className,
  onClick,
  to,
  learnMoreLink,
}: SettingsRowProps) => {
  const content = (
    <>
      {icon && <div className="flex-shrink-0 text-lg text-secondary">{icon}</div>}
      <div className="flex w-full min-w-0 max-w-md flex-1 flex-col items-start gap-0.5">
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="text-sm text-secondary">{description}</p>}
        {learnMoreLink && (
          <Button size="sm" intent="link" className="mt-1 px-0">
            Learn More
          </Button>
        )}
      </div>
      {accessory && <div className="ml-auto flex-shrink-0">{accessory}</div>}
    </>
  );

  const baseClassName = cn(
    "flex items-center gap-4 px-4 py-3",
    {
      "pl-3": icon,
    },
    className
  );

  const row = (() => {
    if (to) {
      return (
        <Link to={to} className={cn(baseClassName, INTERACTIVE_CLASSES)}>
          {content}
        </Link>
      );
    }

    if (onClick) {
      return (
        <button
          type="button"
          onClick={onClick}
          className={cn(baseClassName, INTERACTIVE_CLASSES, "w-full text-left")}
        >
          {content}
        </button>
      );
    }

    return <div className={baseClassName}>{content}</div>;
  })();

  if (children === undefined) {
    return row;
  }

  return (
    <div>
      {row}
      <AutoHeightTransition>
        {showChildren && <div className="px-4 pb-3 pt-px">{children}</div>}
      </AutoHeightTransition>
    </div>
  );
};

export const SettingsRowIcon = ({ children }: { children: ReactNode }) => (
  <div className="flex size-10 items-center justify-center rounded-md bg-surface-muted">
    {children}
  </div>
);
