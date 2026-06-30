"use client";

// Vendored from packages/ui/src/components/Panel/Panel.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { HStack } from "@/components/ui/stack";
import type { ComponentProps, FC, ReactNode } from "react";
import {
  Panel as RRPanel,
  PanelGroup as RRPanelGroup,
  PanelResizeHandle as RRPanelResizeHandle,
  type PanelGroupProps,
} from "react-resizable-panels";

// NOTE: FlexibleSpacer dropped — replaced with a flex-1 spacer div.
// NOTE: ScrollArea dropped — replaced with a native overflow-y-auto container.

interface Props {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  accessories?: ReactNode;
  scroll?: "none" | "y";
  onClick?: () => void;
}

export const Panel = ({
  title,
  icon,
  children,
  accessories,
  scroll = "none",
  onClick,
  ...props
}: Props & ComponentProps<typeof RRPanel>) => {
  return (
    <RRPanel {...props} className="relative">
      <style
        dangerouslySetInnerHTML={{
          __html: `.w-md-editor-toolbar { padding-right: 2rem; }`,
        }}
      />
      <div className="absolute inset-0 flex flex-col overflow-hidden" onClick={onClick}>
        {title && (
          <HStack className="h-8 flex-none border-b bg-surface/50 px-2" gapSm>
            {icon && <div className="opacity/50">{icon}</div>}
            {title && <p className="text-muted text-sm">{title}</p>}
            <div className="flex-1" />
            <HStack>{accessories}</HStack>
          </HStack>
        )}

        <div className="flex-grow overflow-hidden">
          {scroll === "y" && <div className="h-full overflow-y-auto">{children}</div>}
          {scroll === "none" && children}
        </div>
      </div>
    </RRPanel>
  );
};

export const PanelGroup: FC<PanelGroupProps> = RRPanelGroup;

export const PanelResizeHandle = () => {
  return (
    <RRPanelResizeHandle className="bg-border relative shrink-0 grow-0 basis-[1px] rounded-md transition hover:basis-1 hover:bg-accent"></RRPanelResizeHandle>
  );
};
