"use client";

// Vendored from packages/ui/src/components/Sheet/Sheet.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { cn } from "@/lib/utils";
import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { IconX as X } from "@tabler/icons-react";
import {
  forwardRef,
  useState,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

// Inlined from packages/ui/src/shadcn/ShadSheet.tsx so this file is self-contained.
// NOTE: SheetLayoutContext (a workspace layout context) dropped — render() children are rendered directly.

const SheetPrimitive = Root;
const SheetTrigger = Trigger;
const SheetPortal = Portal;

const SheetOverlay = forwardRef<
  ElementRef<typeof Overlay>,
  ComponentPropsWithoutRef<typeof Overlay>
>(({ className, ...props }, ref) => (
  <Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-base p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-[90%] border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-lg lg:max-w-xl",
        right:
          "inset-y-0 right-0 h-full w-[90%] border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-lg lg:max-w-xl",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
        xl: "",
        "2xl": "",
      },
    },
    compoundVariants: [
      { side: "left", size: "sm", class: "sm:max-w-xs" },
      { side: "right", size: "sm", class: "sm:max-w-xs" },
      { side: "left", size: "lg", class: "lg:max-w-2xl" },
      { side: "right", size: "lg", class: "lg:max-w-2xl" },
      { side: "left", size: "xl", class: "lg:max-w-3xl" },
      { side: "right", size: "xl", class: "lg:max-w-3xl" },
      { side: "left", size: "2xl", class: "lg:max-w-4xl" },
      { side: "right", size: "2xl", class: "lg:max-w-4xl" },
    ],
    defaultVariants: {
      side: "right",
      size: "md",
    },
  }
);

interface SheetContentProps
  extends ComponentPropsWithoutRef<typeof Content>, VariantProps<typeof sheetVariants> {
  hideCloseButton?: boolean;
}

const SheetContent = forwardRef<ElementRef<typeof Content>, SheetContentProps>(
  ({ side = "right", size, className, children, hideCloseButton, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <Content ref={ref} className={cn(sheetVariants({ side, size }), className)} {...props}>
        {!hideCloseButton && (
          <Close
            tabIndex={0}
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Close>
        )}
        {children}
      </Content>
    </SheetPortal>
  )
);
SheetContent.displayName = Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { className?: string }) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = forwardRef<ElementRef<typeof Title>, ComponentPropsWithoutRef<typeof Title>>(
  ({ className, ...props }, ref) => (
    <Title ref={ref} className={cn("text-lg font-medium text-foreground", className)} {...props} />
  )
);
SheetTitle.displayName = Title.displayName;

const SheetDescription = forwardRef<
  ElementRef<typeof Description>,
  ComponentPropsWithoutRef<typeof Description>
>(({ className, ...props }, ref) => (
  <Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
SheetDescription.displayName = Description.displayName;

export type SheetRender = ({
  isOpen,
  closeSheet,
}: {
  isOpen: boolean;
  closeSheet: () => void;
}) => ReactNode;

interface Props {
  srTitle: string;
  children?: ReactNode;
  render: SheetRender;
  side?: "left" | "right";
  size?: ComponentProps<typeof SheetContent>["size"];
  open?: boolean;
  onClose?: () => void;
  sheetClassName?: string;
}

const Sheet = ({ children, render, side, size, open, onClose, sheetClassName, srTitle }: Props) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }

    if (!nextOpen && onClose) {
      onClose();
    }
  };

  return (
    <SheetPrimitive open={isOpen} onOpenChange={handleOpenChange}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}
      <SheetContent
        className={cn("overflow-y-auto", sheetClassName)}
        side={side}
        size={size}
        aria-describedby={undefined}
      >
        <SheetTitle className="sr-only">{srTitle}</SheetTitle>
        {render({
          isOpen,
          closeSheet: () => handleOpenChange(false),
        })}
      </SheetContent>
    </SheetPrimitive>
  );
};

export default Sheet;
