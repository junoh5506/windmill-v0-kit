"use client";

// Vendored from packages/ui/src/components/ResizableSidePanel/ResizableSidePanel.tsx. Styling verbatim; @wind/Remix/app-state deps stubbed for v0 (none required).

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

interface ResizableSidePanelProps {
  open: boolean;
  children: [ReactNode, ReactNode];
  className?: string;
  autoSaveId?: string;
}

export const ResizableSidePanel = ({
  open,
  children,
  className,
  autoSaveId,
}: ResizableSidePanelProps) => {
  const rightPanelRef = useRef<ImperativePanelHandle>(null);
  const [isDragging, setIsDragging] = useState(false);

  const lastOpenSizeRef = useRef<number>(30);
  const [left, right] = children;

  useEffect(() => {
    const rightPanel = rightPanelRef.current;
    if (!rightPanel) {
      return;
    }

    if (open) {
      const sizeToOpen = Math.max(10, Math.min(50, lastOpenSizeRef.current));
      rightPanel.resize(sizeToOpen);
    } else {
      rightPanel.resize(0);
    }
  }, [open]);

  return (
    <PanelGroup
      autoSaveId={autoSaveId ?? "ui:resizable-side-panel"}
      direction="horizontal"
      className={className}
      onLayout={(sizes) => {
        if (sizes?.[1] && sizes[1] > 0) {
          lastOpenSizeRef.current = sizes[1];
        }
      }}
    >
      <Panel id="left-panel" order={1} minSize={50} defaultSize={open ? 70 : 100}>
        {left}
      </Panel>
      <PanelResizeHandle onDragging={(dragging) => setIsDragging(dragging)} />
      <Panel
        id="right-panel"
        order={2}
        ref={rightPanelRef}
        minSize={open && isDragging ? 30 : 0}
        maxSize={50}
        defaultSize={open ? 30 : 0}
        style={{ transition: isDragging ? undefined : "flex-grow 150ms ease" }}
      >
        <div
          className={
            open ? "pointer-events-auto h-full w-full" : "pointer-events-none h-full w-full"
          }
        >
          {right}
        </div>
      </Panel>
    </PanelGroup>
  );
};

export default ResizableSidePanel;
