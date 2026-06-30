"use client";
// Vendored from packages/ui/src/components/Chat. Styling verbatim; @wind/Remix/app deps stubbed for v0.
// NOTE: requires the `streamdown` npm package for StreamingMarkdown's renderer (kept as-is).
// The source's shared DEFAULT_MARKDOWN_COMPONENTS / markdownSanitizeSchema (@wind utils) are
// dropped — Streamdown's default components render instead. ChatMessageAttachment relies on the
// vendored Sheet; ChatMessageActionRow on the vendored Button.

import { Button, type ButtonProps } from "@/components/ui/button";
import Sheet, { type SheetRender } from "@/components/ui/sheet";
import { VStack } from "@/components/ui/stack";
import { Label } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Circle } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type JSX,
  type ReactNode,
} from "react";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { Streamdown, type ControlsConfig } from "streamdown";

/* ------------------------------------------------------------------ helpers */

// NOTE: replaces @wind ArrayUtil.dedupe / urlUtil.isRelativeUrl with local copies.
const dedupe = <T,>(items: T[]): T[] => Array.from(new Set(items));

const isRelativeUrl = (href?: string): boolean =>
  !!href && !/^([a-z][a-z0-9+.-]*:)?\/\//i.test(href) && !href.startsWith("//");

/* ----------------------------------------------------------- StreamingMarkdown */

type Components = {
  [Key in keyof JSX.IntrinsicElements]?: ComponentType<JSX.IntrinsicElements[Key]>;
};

interface StreamingMarkdownProps {
  children: string;
  isStreaming?: boolean;
  className?: string;
  components?: Components;
}

const TABLE_CONTROLS: ControlsConfig = {
  table: { fullscreen: false },
};

export const StreamingMarkdown = ({
  children,
  isStreaming = false,
  className,
  components,
}: StreamingMarkdownProps) => {
  return (
    <div className={cn("markdown min-w-0 max-w-full break-words", className)}>
      <Streamdown
        isAnimating={isStreaming}
        components={components}
        controls={TABLE_CONTROLS}
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
      >
        {children}
      </Streamdown>
    </div>
  );
};

/* ------------------------------------------------------------ ChatTypingBubble */

const DOT_VARIANTS = {
  start: { opacity: 0.2, y: 1.5 },
  end: { opacity: 1, y: -1.5 },
};

const DOT_TRANSITION = {
  duration: 0.6,
  repeat: Infinity,
  repeatType: "reverse",
  ease: "easeInOut",
} as const;

export const ChatTypingBubble = () => (
  <div className="inline-flex gap-1 rounded-full border bg-surface px-2 py-2 text-[0.4rem] text-tertiary">
    {[0, 0.2, 0.4].map((delay, i) => (
      <motion.span
        key={`dot${i}`}
        variants={DOT_VARIANTS}
        transition={{ ...DOT_TRANSITION, delay }}
        initial="start"
        animate="end"
      >
        <Circle className="h-[0.4rem] w-[0.4rem] fill-current" />
      </motion.span>
    ))}
  </div>
);

/* ------------------------------------------------------------ ChatMessageEmotes */

interface ChatMessageEmotesProps {
  emotes: string[];
  position?: "left" | "right";
}

export const ChatMessageEmotes = ({ emotes, position = "right" }: ChatMessageEmotesProps) => {
  const dedupedEmotes = useMemo(() => dedupe(emotes), [emotes]);

  if (!dedupedEmotes.length) {
    return null;
  }

  return (
    <div
      className={`absolute -top-3 ${position === "left" ? "left-0" : "right-0"} pointer-events-none z-50 flex items-center -space-x-1`}
      role="img"
    >
      {dedupedEmotes.map((emote) => (
        <div
          key={emote}
          className="circle-6 z-0 flex items-center justify-center border bg-surface text-sm"
          aria-label={emote}
        >
          {emote}
        </div>
      ))}
    </div>
  );
};

/* ---------------------------------------------------------- ChatMessageActionRow */

export interface ChatMessageAction extends Omit<ButtonProps, "intent"> {}

export const ChatMessageActionRow = ({ actions }: { actions: ChatMessageAction[] }) => (
  <div className="flex flex-row gap-2">
    {actions.map((action, i) => (
      <Button key={i} {...action} intent="icon" icon={action.icon}>
        {action.label}
      </Button>
    ))}
  </div>
);

/* ---------------------------------------------------------- ChatMessageAttachment */

export interface Attachment {
  label: string;
  icon?: ReactNode;
  render: SheetRender;
}

export const ChatMessageAttachment = ({ attachment }: { attachment: Attachment }) => (
  <Sheet srTitle={attachment.label} key={attachment.label} render={attachment.render} size="xl">
    <button className="hover:border-highlight flex items-center gap-2 rounded-full border bg-surface py-2 pl-2 pr-6 hover:bg-surface-muted">
      <div className="circle-8 flex-none bg-highlight text-accent-inverse">{attachment.icon}</div>
      <Label maxLines={1}>{attachment.label}</Label>
    </button>
  </Sheet>
);

/* -------------------------------------------------------------- ChatMessageUser */

interface ChatMessageUserProps {
  message: string;
  children?: ReactNode;
  emotes?: string[];
}

export const ChatMessageUser = ({ message, children, emotes }: ChatMessageUserProps) => (
  <div className="flex flex-row justify-end">
    <div className="relative max-w-[90%] rounded-l-[1.5em] rounded-br-[0.25em] rounded-tr-[1.5em] bg-surface-muted px-4 py-1.5">
      {emotes && <ChatMessageEmotes emotes={emotes} position="left" />}
      {children ? (
        <div className="text-base sm:text-sm">{children}</div>
      ) : (
        <StreamingMarkdown className="!text-base sm:!text-sm">{message}</StreamingMarkdown>
      )}
    </div>
  </div>
);

/* --------------------------------------------------------- ChatMessageAssistant */

export interface LinkComponentProps {
  to: string | { pathname?: string; search?: string; hash?: string };
  children: ReactNode;
  className?: string;
}

interface ChatMessageAssistantProps {
  message: string;
  isStreaming?: boolean;
  actions?: ChatMessageAction[];
  attachments?: Attachment[];
  emotes?: string[];
  className?: string;
  RelativeLinkComponent?: ComponentType<LinkComponentProps>;
}

export const ChatMessageAssistant = ({
  message,
  isStreaming = false,
  actions,
  attachments,
  emotes,
  className,
  RelativeLinkComponent,
}: ChatMessageAssistantProps) => {
  const markdownComponents = RelativeLinkComponent
    ? {
        a: ({ children, href }: { children?: ReactNode; href?: string }) => {
          if (isRelativeUrl(href)) {
            return (
              <RelativeLinkComponent to={href!} className="underline hover:bg-accent/10">
                {children}
              </RelativeLinkComponent>
            );
          }
          return (
            <a
              href={href}
              rel="noopener noreferrer"
              target="_blank"
              className="underline hover:bg-accent/10"
            >
              {children}
            </a>
          );
        },
      }
    : undefined;

  return (
    <div className={cn("flex flex-col gap-2 group/message relative", className)}>
      {emotes && <ChatMessageEmotes emotes={emotes} position="right" />}
      <StreamingMarkdown
        isStreaming={isStreaming}
        components={markdownComponents}
        className="!text-base sm:!text-body-sm"
      >
        {message}
      </StreamingMarkdown>
      {attachments && attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <ChatMessageAttachment key={attachment.label} attachment={attachment} />
          ))}
        </div>
      )}
      {actions && actions.length > 0 && (
        <div className="opacity-0 transition-all group-hover/message:opacity-100">
          <ChatMessageActionRow actions={actions} />
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------- ChatMessageList */

interface ChatMessageListProps {
  className?: string;
  children: ReactNode;
  typing?: boolean;
  loadingMessages?: string[];
}

const ROTATION_INTERVAL_MS = 3000;

const MotionWrapper = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, translateY: 10 }}
    animate={{ opacity: 1, translateY: 0 }}
    exit={{ opacity: 0, translateY: -10 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

export const ChatMessageList = forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, children, typing, loadingMessages }, ref) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
      if (!loadingMessages || loadingMessages.length === 0) {
        setCurrentMessageIndex(0);
        return;
      }

      setCurrentMessageIndex(0);
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, ROTATION_INTERVAL_MS);

      return () => clearInterval(interval);
    }, [loadingMessages]);

    const renderAnimate =
      (loadingMessages?.length && loadingMessages[currentMessageIndex]) || typing;
    const currentLoadingMessage =
      loadingMessages && loadingMessages.length > 0 ? loadingMessages[currentMessageIndex] : null;

    return (
      <VStack ref={ref} className={cn("relative", className)}>
        {children}
        {renderAnimate && (
          <AnimatePresence>
            {currentLoadingMessage && (
              <MotionWrapper>
                <div className="inline-flex animate-pulse gap-1 py-2 text-sm text-tertiary">
                  {currentLoadingMessage}
                </div>
              </MotionWrapper>
            )}
            {typing && (
              <MotionWrapper>
                <ChatTypingBubble />
              </MotionWrapper>
            )}
          </AnimatePresence>
        )}
      </VStack>
    );
  }
);
ChatMessageList.displayName = "ChatMessageList";

/* ------------------------------------------------------- ChatAutoScrollContainer */
// Copied from https://github.com/ibelick/prompt-kit/blob/main/components/prompt-kit/chat-container.tsx

export interface ChatAutoScrollContainerHandle {
  scrollToBottom: (behavior?: ScrollBehavior) => void;
}

interface UseAutoScrollOptions {
  onScrollStateChange?: (isAtBottom: boolean) => void;
}

const useAutoScroll = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
  options?: UseAutoScrollOptions
) => {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [isAtBottomState, setIsAtBottomState] = useState(true);
  const lastScrollTopRef = useRef(0);
  const autoScrollingRef = useRef(false);

  const checkIsAtBottom = useCallback((element: HTMLDivElement) => {
    const { scrollTop, scrollHeight, clientHeight } = element;
    return scrollHeight - scrollTop - clientHeight <= 2;
  }, []);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      autoScrollingRef.current = true;
      setAutoScrollEnabled(true);

      const targetScrollTop = container.scrollHeight - container.clientHeight;

      if (behavior === "smooth") {
        container.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });

        const checkScrollEnd = () => {
          if (Math.abs(container.scrollTop - targetScrollTop) < 2) {
            autoScrollingRef.current = false;
            setIsAtBottomState(true);
            return;
          }

          requestAnimationFrame(checkScrollEnd);
        };

        requestAnimationFrame(checkScrollEnd);

        const safetyTimeout = setTimeout(() => {
          autoScrollingRef.current = false;
          setIsAtBottomState(checkIsAtBottom(container));
        }, 500);

        try {
          const handleScrollEnd = () => {
            autoScrollingRef.current = false;
            setIsAtBottomState(checkIsAtBottom(container));
            clearTimeout(safetyTimeout);
            container.removeEventListener("scrollend", handleScrollEnd);
          };

          container.addEventListener("scrollend", handleScrollEnd, {
            once: true,
          });
        } catch (_e) {
          // scrollend event not supported in this browser, fallback to requestAnimationFrame
        }
      } else {
        container.scrollTop = targetScrollTop;
        autoScrollingRef.current = false;
        setIsAtBottomState(true);
      }
    },
    [containerRef, checkIsAtBottom]
  );

  useEffect(() => {
    options?.onScrollStateChange?.(isAtBottomState);
  }, [isAtBottomState, options]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const container = containerRef?.current;
    if (!container) {
      return;
    }

    lastScrollTopRef.current = container.scrollTop;
    setIsAtBottomState(checkIsAtBottom(container));

    const handleScroll = () => {
      if (autoScrollingRef.current) {
        return;
      }

      const currentScrollTop = container.scrollTop;
      const atBottom = checkIsAtBottom(container);

      setIsAtBottomState(atBottom);

      if (currentScrollTop < lastScrollTopRef.current && autoScrollEnabled) {
        setAutoScrollEnabled(false);
      }

      if (atBottom && !autoScrollEnabled) {
        setAutoScrollEnabled(true);
      }

      lastScrollTopRef.current = currentScrollTop;
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY < 0 && autoScrollEnabled) {
        setAutoScrollEnabled(false);
      }
    };

    const handleTouchStart = () => {
      lastScrollTopRef.current = container.scrollTop;
    };

    const handleTouchMove = () => {
      if (container.scrollTop < lastScrollTopRef.current && autoScrollEnabled) {
        setAutoScrollEnabled(false);
      }

      lastScrollTopRef.current = container.scrollTop;
    };

    const handleTouchEnd = () => {
      const atBottom = checkIsAtBottom(container);
      setIsAtBottomState(atBottom);
      if (atBottom && !autoScrollEnabled) {
        setAutoScrollEnabled(true);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("wheel", handleWheel, { passive: true });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [containerRef, enabled, autoScrollEnabled, checkIsAtBottom]);

  return {
    autoScrollEnabled,
    scrollToBottom,
    isAtBottom: isAtBottomState,
  };
};

export type ChatContainerProps = {
  children: ReactNode;
  className?: string;
  autoScroll?: boolean;
  scrollToRef?: React.RefObject<HTMLDivElement>;
  onScrollStateChange?: (isAtBottom: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const ChatAutoScrollContainer = forwardRef<
  ChatAutoScrollContainerHandle,
  ChatContainerProps
>(function ChatAutoScrollContainer(
  { className, children, autoScroll = true, scrollToRef, onScrollStateChange, ...props },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const localBottomRef = useRef<HTMLDivElement>(null);
  const bottomRef = scrollToRef || localBottomRef;

  const { autoScrollEnabled, scrollToBottom, isAtBottom } = useAutoScroll(
    containerRef,
    autoScroll,
    {
      onScrollStateChange,
    }
  );

  useImperativeHandle(ref, () => ({
    scrollToBottom: (behavior: ScrollBehavior = "smooth") => {
      scrollToBottom(behavior);
    },
  }));

  useEffect(() => {
    if (autoScroll && autoScrollEnabled && isAtBottom) {
      requestAnimationFrame(() => {
        scrollToBottom("smooth");
      });
    }
  }, [children, autoScroll, autoScrollEnabled, isAtBottom, scrollToBottom]);

  return (
    <div
      className={cn("flex flex-col overflow-y-auto [scrollbar-gutter:stable]", className)}
      role="log"
      ref={containerRef}
      {...props}
    >
      {children}
      <div
        ref={bottomRef}
        className="h-[1px] w-full flex-shrink-0 scroll-mt-4"
        aria-hidden="true"
      />
    </div>
  );
});
