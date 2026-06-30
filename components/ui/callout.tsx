"use client";

// Vendored from packages/ui/src/components/Callout/Callout.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, CircleXIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

// NOTE: Typography Label/Paragraph inlined (token classes preserved verbatim).
const Label = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("text-primary text-body-sm font-medium", className)}>{children}</div>
);

const Paragraph = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("text-body-sm text-secondary font-normal", className)}>{children}</div>
);

interface Props extends VariantProps<typeof CalloutStyles> {
  className?: string;
  description?: ReactNode;
  cta?: ComponentProps<typeof Button>;
  secondaryCta?: ComponentProps<typeof Button>;
  tertiaryCta?: ComponentProps<typeof Button>;
  title?: ReactNode;
  icon?: ReactNode;
  size?: "default" | "sm";
}

const CalloutStyles = cva(
  "flex-col @md/callout:flex-row flex @md/callout:items-start gap-4 px-4 py-3 rounded-lg ring-1",
  {
    variants: {
      intent: {
        info: "ring-accent/10 ring-inset bg-surface-muted/50",
        success: "bg-green ring-green/10 ring-inset",
        error: "bg-red ring-red/10 ring-inset",
        warning: "bg-yellow ring-yellow/10 ring-inset",
      },
    },
    defaultVariants: {
      intent: "info",
    },
  }
);

const CalloutIconStyles = cva("flex-none mt-[3px]", {
  variants: {
    intent: {
      info: "text-tertiary",
      success: "text-green",
      error: "text-red",
      warning: "text-yellow",
    },
  },
  defaultVariants: {
    intent: "info",
  },
});

const Callout = ({
  className,
  description,
  cta,
  secondaryCta,
  tertiaryCta,
  title,
  icon,
  size = "default",
  ...cvaProps
}: Props) => {
  const { intent = "info" } = cvaProps;

  const IconNode = (
    <div className={CalloutIconStyles(cvaProps)}>
      {icon}
      {!icon && (
        <>
          {intent === "info" && <InfoIcon />}
          {intent === "warning" && <TriangleAlertIcon />}
          {intent === "error" && <CircleXIcon />}
          {intent === "success" && <CheckIcon />}
        </>
      )}
    </div>
  );

  return (
    <div className="@container/callout">
      <div className={cn(CalloutStyles(cvaProps), className)}>
        {IconNode}
        <div className="flex flex-grow flex-col">
          {title && <Label>{title}</Label>}
          {description && (
            <Paragraph
              className={cn({
                "mt-1": Boolean(title),
              })}
            >
              {description}
            </Paragraph>
          )}
          {(cta || secondaryCta || tertiaryCta) && (
            <div className="@md/callout:flex-row mt-2 flex flex-col gap-2">
              {cta && <Button size="sm" {...cta} />}
              {secondaryCta && (
                <Button
                  className="hover:underline hover:underline-offset-4"
                  intent="link"
                  size="sm"
                  {...secondaryCta}
                />
              )}
              {tertiaryCta && (
                <Button
                  className="hover:underline hover:underline-offset-4"
                  intent="link"
                  size="sm"
                  {...tertiaryCta}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Callout;
