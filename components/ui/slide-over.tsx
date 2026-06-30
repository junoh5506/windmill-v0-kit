"use client";

// Vendored from packages/ui/src/components/SlideOver/SlideOver.tsx. Styling verbatim; @wind/Remix/app-state deps stubbed for v0.

import { Button, type ButtonProps } from "@/components/ui/button";
import FlexibleSpacer from "@/components/ui/flexible-spacer";
import ScrollArea from "@/components/ui/scroll-area";
import { HStack, VStack } from "@/components/ui/stack";
import { Header } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { IconX as XIcon } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { Fragment } from "react";

// NOTE: BoolState came from the @wind useBool hook. Re-declared locally so the
// component stays standalone; pair it with React.useState in the consumer.
export interface BoolState {
  value: boolean;
  setFalse: () => void;
}

function SlideOver({
  title,
  children,
  bool,
  size = "md",
  enableClickOutside = false,
  iconButtons = [],
  afterLeave,
}: {
  title?: string;
  children: ReactNode;
  bool: BoolState;
  size?: "sm" | "md" | "lg" | "xl";

  /**
   * If true you can click outside the slideover. If false it will close it
   */
  enableClickOutside?: boolean;

  /**
   * List of icon buttons added next to the close button.
   * NOTE: production used IconButton; the kit's <Button intent="icon"> stands in.
   */
  iconButtons?: ButtonProps[];

  /**
   * Function that runs after the slideover is closed
   */
  afterLeave?: () => void;
}) {
  return (
    <div>
      <Transition show={bool.value} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={bool.setFalse}>
          {!enableClickOutside && <div className="fixed inset-0 bg-black/20" />}

          <div
            className={cn("fixed inset-0 overflow-hidden", {
              "pointer-events-none": enableClickOutside,
            })}
          >
            <div
              className={cn("absolute inset-0 overflow-hidden", {
                "pointer-events-none": enableClickOutside,
              })}
            >
              <div
                className={cn("fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16", {
                  "pointer-events-none": !enableClickOutside,
                })}
              >
                <TransitionChild
                  as={Fragment}
                  enter="transform transition ease-in-out duration-200 sm:duration-200"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-200 sm:duration-200"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                  afterLeave={afterLeave}
                >
                  <DialogPanel
                    className={cn("pointer-events-auto w-screen border-l  shadow-2xl", {
                      "max-w-md": size === "sm",
                      "max-w-lg": size === "md",
                      "max-w-xl": size === "lg",
                      "max-w-2xl": size === "xl",
                    })}
                  >
                    <div className="flex h-screen flex-col bg-base shadow-2xl">
                      <ScrollArea orientation="vertical" className="flex-1">
                        <div
                          className={cn(
                            "sticky top-0 border-b bg-base/50 px-2 pb-4 pt-2 backdrop-blur-md z-10",
                            {
                              "max-w-md": size === "sm",
                              "max-w-lg": size === "md",
                              "max-w-xl": size === "lg",
                              "max-w-2xl": size === "xl",
                            }
                          )}
                        >
                          <VStack>
                            <HStack>
                              <FlexibleSpacer />
                              {iconButtons.map((b, index) => (
                                <Button key={index} intent="icon" size="sm" {...b} />
                              ))}
                              <Button
                                intent="icon"
                                size="sm"
                                aria-label="Close"
                                onClick={bool.setFalse}
                                icon={<XIcon />}
                              />
                            </HStack>
                            {title && (
                              <div className="px-2 md:px-4">
                                <Header level={2}>{title}</Header>
                              </div>
                            )}
                          </VStack>
                        </div>
                        <VStack className="px-6 py-4">{children}</VStack>
                      </ScrollArea>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default SlideOver;
