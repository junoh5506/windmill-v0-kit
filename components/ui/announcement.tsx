"use client";

// Vendored from packages/ui/src/components/Announcement/AnnouncementCard.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { Button } from "@/components/ui/button";
import { VStack } from "@/components/ui/stack";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRightIcon, CircleXIcon, InfoIcon, XIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

// NOTE: Typography Label/Paragraph inlined (token classes preserved verbatim).
const Label = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("text-primary text-body-sm font-medium", className)}>{children}</div>
);

const Paragraph = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("text-body-sm text-secondary font-normal", className)}>{children}</div>
);

interface Props extends VariantProps<typeof AnnouncementCardStyles> {
  className?: string;
  icon?: ReactNode;
  image?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  cta?: ComponentProps<typeof Button>;
  onDismiss?: () => void;
}

const AnnouncementCardStyles = cva("relative overflow-hidden rounded-lg border", {
  variants: {
    intent: {
      promo: "bg-surface border-border",
      info: "bg-surface border-border",
      error: "bg-surface border-red/30",
    },
  },
  defaultVariants: {
    intent: "info",
  },
});

const AnnouncementCardIconStyles = cva("flex-none mt-[2px] circle-5", {
  variants: {
    intent: {
      info: "text-tertiary",
      error: "text-red",
    },
  },
  defaultVariants: {
    intent: "info",
  },
});

const DismissButton = ({ onClick }: { onClick: () => void }) => (
  <button
    aria-label="Dismiss"
    className="absolute right-2 top-2 z-10 text-tertiary transition-colors hover:text-primary"
    onClick={onClick}
    type="button"
  >
    <XIcon className="circle-4" />
  </button>
);

const AnnouncementCard = ({
  className,
  icon,
  image,
  title,
  description,
  cta,
  onDismiss,
  ...cvaProps
}: Props) => {
  const { intent = "info" } = cvaProps;

  if (intent === "promo") {
    return (
      <div className={cn(AnnouncementCardStyles(cvaProps), className)}>
        <div className="aspect-[16/10] w-full bg-surface-muted">{image}</div>
        <VStack gapXs className="p-3">
          <Label>{title}</Label>
          {description && <Paragraph>{description}</Paragraph>}
          {cta && (
            <Button
              className="-ml-2 mt-1 self-start font-normal hover:text-primary hover:underline hover:underline-offset-4"
              icon={<ArrowRightIcon className="circle-4" />}
              iconRight
              intent="link"
              size="sm"
              {...cta}
            />
          )}
        </VStack>
        {onDismiss && <DismissButton onClick={onDismiss} />}
      </div>
    );
  }

  const IconNode = (
    <div className={AnnouncementCardIconStyles({ intent })}>
      {icon}
      {!icon && (
        <>
          {intent === "info" && <InfoIcon />}
          {intent === "error" && <CircleXIcon />}
        </>
      )}
    </div>
  );

  return (
    <VStack gapSm className={cn(AnnouncementCardStyles(cvaProps), "p-3", className)}>
      {IconNode}
      <VStack gapXs className="min-w-0">
        <Label>{title}</Label>
        {description && <Paragraph>{description}</Paragraph>}
        {cta && (
          <Button
            className="-ml-2 mt-1 self-start font-normal hover:text-primary hover:underline hover:underline-offset-4"
            icon={<ArrowRightIcon className="circle-4" />}
            iconRight
            intent="link"
            size="sm"
            {...cta}
          />
        )}
      </VStack>
      {onDismiss && <DismissButton onClick={onDismiss} />}
    </VStack>
  );
};

export default AnnouncementCard;
