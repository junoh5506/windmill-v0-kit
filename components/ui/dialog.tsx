"use client";

// Vendored from packages/ui/src/components/Dialog/DialogCore.tsx. Overlay/Content styling copied verbatim; the @wind useBool BoolState API is replaced with standard open/onOpenChange props for v0.

import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

interface DialogContentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  closeable?: boolean;
  onClose?: () => void;
  onOpenAutoFocus?: (event: Event) => void;
  children: ReactNode;
}

export function DialogContent({
  open,
  onOpenChange,
  size = "md",
  closeable = true,
  onClose,
  onOpenAutoFocus,
  children,
}: DialogContentProps) {
  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next && (closeable ?? true)) {
          onClose?.();
        }
        onOpenChange(next);
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-8 text-center sm:p-0 sm:pt-8">
            <DialogPrimitive.Content
              aria-describedby={undefined}
              onOpenAutoFocus={onOpenAutoFocus}
              className={cn(
                "relative transform overflow-hidden w-full mb-8 sm:mb-0 rounded-lg border border-base bg-base text-left shadow-xl transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-1/2 data-[state=open]:slide-in-from-top-1/2",
                {
                  "sm:my-4 sm:max-w-md": size === "sm",
                  "sm:my-8 sm:max-w-lg": size === "md",
                  "sm:my-10 sm:max-w-2xl": size === "lg",
                  "sm:my-12 sm:max-w-4xl": size === "xl",
                  "sm:my-12 sm:max-w-6xl": size === "2xl",
                }
              )}
            >
              {children}
            </DialogPrimitive.Content>
          </div>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export default DialogContent;
