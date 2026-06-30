"use client";

// Vendored from packages/ui/src/components/HelpBanner/HelpBanner.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { IconX as XIcon } from "@tabler/icons-react";
import type { ReactNode } from "react";

// NOTE: GradientBackground inlined (gradientBanner token classes preserved verbatim).
const GradientBackground = ({ className }: { className?: string }) => (
  <div className={cn("overflow-hidden -z-10 pointer-events-none rounded-lg", className)}>
    <div className="bg-gradientBanner-accent1/30 absolute bottom-[-34%] left-[-20%] h-[40%] w-[60%] rounded-full blur-2xl"></div>
    <div className="bg-gradientBanner-accent2/30 absolute bottom-[-36%] right-[10%] h-[50%] w-[70%] rounded-full blur-2xl"></div>
    <div className="bg-gradientBanner-accent3/30 absolute bottom-[-30%] right-[-20%] h-[45%] w-[65%] rounded-full blur-2xl"></div>
  </div>
);

// NOTE: Typography Header(level=3)/Paragraph inlined (token classes preserved verbatim).
const Header = ({ children, className }: { children: ReactNode; className?: string }) => (
  <h3 className={cn("text-primary text-header-sm", className)}>{children}</h3>
);

const Paragraph = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("text-body-sm text-secondary font-normal", className)}>{children}</div>
);

const roundedStyles = cva("", {
  variants: {
    size: {
      sm: "rounded-lg",
      md: "rounded-[1rem]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const helpBannerContainerStyles = cva("bg-gradientBanner relative z-0 @container/help-banner", {
  variants: {
    size: {
      sm: "rounded-lg",
      md: "rounded-[1rem]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const helpBannerContentStyles = cva("flex flex-col gap-2", {
  variants: {
    size: {
      sm: "px-4 py-4",
      md: "p-4 @lg/help-banner:px-6 @lg/help-banner:py-5 @lg/help-banner:gap-3",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const helpBannerTitleStyles = cva("font-medium", {
  variants: {
    size: {
      sm: "text-md @lg/help-banner:text-lg",
      md: "text-lg @lg/help-banner:text-xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const helpBannerDescriptionStyles = cva("text-secondary text-sm");

interface HelpBannerContainerProps {
  className?: string;
  children: ReactNode;
  onDismiss?: () => void;
}

export const HelpBannerContainer = ({
  className,
  children,
  onDismiss,
  ...cvaProps
}: HelpBannerContainerProps & VariantProps<typeof helpBannerContainerStyles>) => (
  <div
    className={cn(
      helpBannerContainerStyles(cvaProps),
      {
        "pr-6": onDismiss,
      },
      className
    )}
  >
    <GradientBackground className={cn("absolute inset-0 opacity-30", roundedStyles(cvaProps))} />
    {onDismiss && (
      <button
        onClick={onDismiss}
        className="text-foreground/60 hover:text-foreground absolute right-4 top-4 z-10 rounded-md bg-accent/5 p-2 transition-colors hover:bg-accent/10"
        aria-label="Dismiss"
      >
        <XIcon className="h-4 w-4" />
      </button>
    )}
    {children}
    <div
      className={cn(
        "ring-1 ring-inset ring-accent/10 absolute inset-0 pointer-events-none",
        roundedStyles(cvaProps)
      )}
    ></div>
  </div>
);

interface HelpBannerContentsProps extends VariantProps<typeof helpBannerContentStyles> {
  className?: string;
  title?: string;
  description?: string;
  cta?: ButtonProps;
  secondaryCta?: ButtonProps;
  tertiaryCta?: ButtonProps;
  quaternaryCta?: ButtonProps;
}

export const HelpBannerContents = ({
  className,
  title,
  description,
  cta,
  secondaryCta,
  tertiaryCta,
  quaternaryCta,
  ...cvaProps
}: HelpBannerContentsProps) => {
  const { size = "md" } = cvaProps;

  return (
    <div className={cn(helpBannerContentStyles(cvaProps), className)}>
      {title && <Header className="text-secondary">{title}</Header>}

      {description && <Paragraph>{description}</Paragraph>}

      {cta && (
        <div className="@lg/help-banner:flex-row @lg/help-banner:flex-wrap @lg/help-banner:gap-2 mt-2 flex flex-col gap-1">
          <Button size={size === "sm" ? "sm" : "lg"} intent="transparent" {...cta} />
          {secondaryCta && (
            <Button size={size === "sm" ? "sm" : "lg"} intent="link" {...secondaryCta} />
          )}
          {tertiaryCta && (
            <Button size={size === "sm" ? "sm" : "lg"} intent="link" {...tertiaryCta} />
          )}
          {quaternaryCta && (
            <Button size={size === "sm" ? "sm" : "lg"} intent="link" {...quaternaryCta} />
          )}
        </div>
      )}
    </div>
  );
};

interface Props extends VariantProps<typeof helpBannerContentStyles> {
  className?: string;
  title?: string;
  description?: string;
  cta?: ButtonProps;
  secondaryCta?: ButtonProps;
  tertiaryCta?: ButtonProps;
  quaternaryCta?: ButtonProps;
  onDismiss?: () => void;
}

const HelpBanner = ({
  className,
  title,
  description,
  cta,
  secondaryCta,
  tertiaryCta,
  quaternaryCta,
  onDismiss,
  ...cvaProps
}: Props) => (
  <HelpBannerContainer className={className} onDismiss={onDismiss} {...cvaProps}>
    <HelpBannerContents
      title={title}
      description={description}
      cta={cta}
      secondaryCta={secondaryCta}
      tertiaryCta={tertiaryCta}
      quaternaryCta={quaternaryCta}
      {...cvaProps}
    />
  </HelpBannerContainer>
);

export default HelpBanner;
