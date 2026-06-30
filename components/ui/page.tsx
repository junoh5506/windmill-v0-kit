"use client";

// Vendored from packages/ui/src/components/Layouts/Page.tsx. Styling copied verbatim; Remix loaders/router and framer-motion stripped for v0.
// NOTE: Breadcrumbs/BreadcrumbList sub-components are not vendored — `breadcrumbs` (string[]) and `crumbs` render as a minimal inline trail. Typography Header/Label are inlined as plain elements with the same token classes. CTAs accept ReactNode instead of Button props.

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { useEffect, type ReactNode } from "react";

const PageStyles = cva(
  "mx-auto flex min-h-screen w-full flex-col px-4 py-4 @lg/page-layout:px-8 @lg/page-layout:py-8 @lg/page-layout:pt-12 transition-all duration-300",
  {
    variants: {
      largeTopMargin: {
        true: "mt-16 lg:mt-24 xl:mt-24",
      },

      width: {
        full: "max-w-[2000px]",
        wide: "max-w-screen-2xl",
        default: "max-w-screen-lg",
        narrow: "max-w-screen-md",
      },
    },
    defaultVariants: {
      largeTopMargin: false,
      width: "default",
    },
  }
);

const BannerStyles = cva("py-2 mx-auto w-full px-4 md:px-8 lg:px-12", {
  variants: {
    width: {
      full: "max-w-[2000px]",
      wide: "max-w-screen-2xl",
      default: "max-w-screen-lg",
      narrow: "max-w-screen-md",
    },
  },
  defaultVariants: {
    width: "default",
  },
});

interface Props {
  banner?: {
    contents: ReactNode;
    to?: string;
  };
  className?: string;
  children: ReactNode;
  title: string;
  pageTitle?: ReactNode;
  breadcrumbs?: string[];
  crumbs?: Array<{ label: string; to?: string }>;
  subtitle?: ReactNode;
  primaryCTA?: ReactNode;
  secondaryCTA?: ReactNode;
  accessory?: ReactNode;
  loading?: boolean;
  smallVPadding?: boolean;
  hideTitle?: boolean;
  icon?: ReactNode;
  headerSpacing?: "default" | "loose";
  topBar?: {
    accessory?: ReactNode;
  };
}

const Crumbs = ({
  crumbs,
  className,
}: {
  crumbs: Array<{ label: string }>;
  className?: string;
}) => (
  <div className={cn("flex items-center gap-2 text-body-sm text-secondary", className)}>
    {crumbs.map((c, i) => (
      <span key={i} className="flex items-center gap-2">
        {i > 0 && <span className="text-tertiary">/</span>}
        <span>{c.label}</span>
      </span>
    ))}
  </div>
);

const Page = ({
  title,
  pageTitle,
  banner,
  children,
  breadcrumbs,
  crumbs,
  subtitle,
  primaryCTA,
  secondaryCTA,
  accessory,
  smallVPadding,
  hideTitle,
  icon,
  headerSpacing = "default",
  topBar,
  className,
  ...variantStyles
}: Props & VariantProps<typeof PageStyles>) => {
  const isLooseHeaderSpacing = headerSpacing === "loose";

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="@container/page-layout w-full">
      {topBar && (
        <div className="@lg/page-layout:px-6 flex min-h-12 items-center justify-between gap-4 px-4 py-2">
          {crumbs ? <Crumbs crumbs={crumbs} /> : <div />}
          {topBar.accessory && (
            <div className="flex flex-none items-center gap-2">{topBar.accessory}</div>
          )}
        </div>
      )}
      {banner && !banner.to && (
        <div className="bg-surface-muted text-center font-medium">
          <div className={cn(BannerStyles(variantStyles))}>{banner.contents}</div>
        </div>
      )}
      {banner?.to && (
        <a
          className="block bg-surface-muted font-medium transition-colors hover:bg-surface"
          href={banner.to}
          target="_blank"
          rel="noreferrer"
        >
          <div className={cn(BannerStyles(variantStyles))}>{banner.contents}</div>
        </a>
      )}

      <div className={cn(PageStyles(variantStyles), className)}>
        <div>
          <div className="flex-grow">
            {crumbs && !topBar && (
              <Crumbs
                crumbs={crumbs}
                className={cn({
                  "mb-2": !isLooseHeaderSpacing,
                  "mb-8": isLooseHeaderSpacing,
                })}
              />
            )}
            {breadcrumbs && (
              <Crumbs
                crumbs={[...breadcrumbs, title].map((label) => ({ label }))}
                className={cn({
                  "mb-2": !isLooseHeaderSpacing,
                  "mb-4": isLooseHeaderSpacing,
                })}
              />
            )}
            <div
              className={cn("flex flex-col justify-between @2xl/page-layout:flex-row", {
                "gap-4 @2xl/page-layout:items-start": !isLooseHeaderSpacing,
                "gap-6 @2xl/page-layout:items-center": isLooseHeaderSpacing,
              })}
            >
              <div>
                <div
                  className={cn("flex flex-col", {
                    "gap-2": !isLooseHeaderSpacing,
                    "gap-3": isLooseHeaderSpacing,
                  })}
                >
                  <div className="flex flex-row items-center gap-4">
                    {icon && <div className="aspect-square flex-none py-2">{icon}</div>}
                    <div>
                      {!hideTitle && (
                        <h1 className="w-full text-header-lg text-primary">{pageTitle || title}</h1>
                      )}
                      {subtitle && (
                        <div
                          className={cn("text-body-md text-primary", {
                            "mt-1": !isLooseHeaderSpacing,
                            "mt-2": isLooseHeaderSpacing,
                          })}
                        >
                          {subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-none gap-2">
                {secondaryCTA}
                {primaryCTA}
                {accessory}
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn("flex h-full flex-grow flex-col gap-8", {
            "pt-4": smallVPadding,
            "pt-8": !smallVPadding,
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Page;
