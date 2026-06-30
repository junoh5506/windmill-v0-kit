"use client";

// Vendored from packages/ui/src/components/Banner/Banner.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, CircleXIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

// NOTE: Typography Paragraph inlined (token classes preserved verbatim).
const Paragraph = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("text-body-sm text-secondary font-normal", className)}>{children}</div>
);

interface Props extends VariantProps<typeof BannerStyles> {
  className?: string;
  description?: ReactNode;
  cta?: ComponentProps<typeof Button>;
  secondaryCta?: ComponentProps<typeof Button>;
  tertiaryCta?: ComponentProps<typeof Button>;
  icon?: ReactNode;
}

const BannerStyles = cva(["flex-col md:flex-row flex md:items-start gap-4 py-2 pl-4 pr-2"], {
  variants: {
    intent: {
      info: "bg-surface-muted/50",
      success: "bg-green",
      error: "bg-red",
      warning: "bg-yellow",
    },
  },
  defaultVariants: {
    intent: "info",
  },
});

const BannerIconStyles = cva(["flex-none"], {
  variants: {
    intent: {
      info: "text-tertiary",
      success: "text-green",
      error: "text-red",
      warning: "text-yellow",
    },
    inline: {
      true: "circle-6 text-sm",
      false: "circle-8",
      undefined: "circle-8",
    },
  },
  defaultVariants: {
    intent: "info",
  },
});

const BannerParagraphStyle = cva("text-primary", {
  variants: {
    intent: {},
    borderless: {},
  },
});

const Banner = ({
  className,
  description,
  cta,
  secondaryCta,
  tertiaryCta,
  icon,
  ...cvaProps
}: Props) => {
  const { intent = "info" } = cvaProps;

  const IconNode = (
    <div className={BannerIconStyles(cvaProps)}>
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
    <div className="@container/banner">
      <div className={cn(BannerStyles(cvaProps), className)}>
        <div className="@lg/banner:flex @lg/banner:items-center @lg/banner:gap-2 w-full">
          <div className="@lg/banner:flex-row flex flex-col items-center gap-4">
            {IconNode}
            {description && <Paragraph className={BannerParagraphStyle()}>{description}</Paragraph>}
          </div>
          <div className="@xl/banner:flex-row flex flex-none flex-col">
            {cta && <Button intent="transparent" size="sm" {...cta} />}
            {secondaryCta && <Button intent="link" size="sm" {...secondaryCta} />}
            {tertiaryCta && <Button intent="link" size="sm" {...tertiaryCta} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
