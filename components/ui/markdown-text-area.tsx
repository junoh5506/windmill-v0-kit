"use client";
// Vendored from packages/ui/src/components/MarkdownTextArea. Styling verbatim; @wind/Remix/app deps stubbed for v0.
// NOTE: requires the `@mdxeditor/editor` npm package (and its CSS) — keep it installed;
// the MDX editor engine is preserved as-is. CorrectedLinkDialog is inlined below.

import { cn } from "@/lib/utils";
import "@mdxeditor/editor/style.css";
import {
  activeEditor$,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  cancelLinkEdit$,
  codeBlockPlugin,
  codeMirrorPlugin,
  CodeToggle,
  CreateLink,
  editorRootElementRef$,
  frontmatterPlugin,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  linkDialogState$,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  onWindowChange$,
  quotePlugin,
  removeLink$,
  Separator,
  switchFromPreviewToLinkEdit$,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
  updateLink$,
  useCellValues,
  usePublisher,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import * as Popover from "@radix-ui/react-popover";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const findContainerQueryAncestor = (element: HTMLElement | null) => {
  let current = element?.parentElement ?? null;

  while (current) {
    if (window.getComputedStyle(current).containerType !== "normal") {
      return current;
    }

    current = current.parentElement;
  }

  return null;
};

const CorrectedLinkDialog = () => {
  const [editorRootElementRef, activeEditor, linkDialogState] = useCellValues(
    editorRootElementRef$,
    activeEditor$,
    linkDialogState$
  );
  const publishWindowChange = usePublisher(onWindowChange$);
  const publishUpdateLink = usePublisher(updateLink$);
  const publishCancelLinkEdit = usePublisher(cancelLinkEdit$);
  const publishSwitchToEdit = usePublisher(switchFromPreviewToLinkEdit$);
  const publishRemoveLink = usePublisher(removeLink$);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const linkDialogStateRef = useRef(linkDialogState);
  linkDialogStateRef.current = linkDialogState;

  useEffect(() => {
    const update = () => {
      if (linkDialogStateRef.current.type === "edit") {
        return;
      }

      activeEditor?.getEditorState().read(() => {
        publishWindowChange(true);
      });
    };

    window.addEventListener("resize", update);
    document.addEventListener("scroll", update, true);

    return () => {
      window.removeEventListener("resize", update);
      document.removeEventListener("scroll", update, true);
    };
  }, [activeEditor, publishWindowChange]);

  useEffect(() => {
    if (linkDialogState.type !== "edit") {
      return;
    }

    setUrl(linkDialogState.url);
    setTitle(linkDialogState.title);
    setText(linkDialogState.text);
  }, [linkDialogState]);

  const correctedRect = useMemo(() => {
    if (linkDialogState.type === "inactive") {
      return null;
    }

    const containerQueryAncestor = findContainerQueryAncestor(
      editorRootElementRef?.current ?? null
    );
    if (!containerQueryAncestor) {
      return linkDialogState.rectangle;
    }

    const ancestorRect = containerQueryAncestor.getBoundingClientRect();

    return {
      top: linkDialogState.rectangle.top + Math.round(ancestorRect.top),
      left: linkDialogState.rectangle.left + Math.round(ancestorRect.left),
      width: linkDialogState.rectangle.width,
      height: linkDialogState.rectangle.height,
    };
  }, [editorRootElementRef, linkDialogState]);

  if (linkDialogState.type === "inactive" || !correctedRect) {
    return <></>;
  }

  return (
    <Popover.Root open>
      <Popover.Anchor
        data-visible={linkDialogState.type === "edit"}
        className="fixed -z-10 bg-highlight"
        style={{
          top: `${correctedRect.top}px`,
          left: `${correctedRect.left}px`,
          width: `${correctedRect.width}px`,
          height: `${correctedRect.height}px`,
          visibility: linkDialogState.type === "edit" ? "visible" : "hidden",
        }}
      />
      <Popover.Portal container={editorRootElementRef?.current ?? undefined}>
        <Popover.Content
          sideOffset={5}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
          }}
          className="z-[1102] w-80 rounded-md border bg-surface p-3 shadow-lg"
        >
          {linkDialogState.type === "edit" ? (
            <form
              className="flex flex-col gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                publishUpdateLink({
                  url,
                  title,
                  text: linkDialogState.withAnchorText ? text : undefined,
                });
              }}
              onReset={(event) => {
                event.preventDefault();
                event.stopPropagation();
                publishCancelLinkEdit();
              }}
            >
              <label className="flex flex-col gap-1 text-sm">
                <span>URL</span>
                <input
                  autoFocus
                  value={url}
                  onChange={(event) => {
                    setUrl(event.target.value);
                  }}
                  className="outline-hidden rounded-md border bg-base px-3 py-2 focus:ring-2 focus:ring-highlight/20"
                />
              </label>
              {linkDialogState.withAnchorText && (
                <label className="flex flex-col gap-1 text-sm">
                  <span>Link text</span>
                  <input
                    value={text}
                    onChange={(event) => {
                      setText(event.target.value);
                    }}
                    className="outline-hidden rounded-md border bg-base px-3 py-2 focus:ring-2 focus:ring-highlight/20"
                  />
                </label>
              )}
              <div className="flex justify-end gap-2">
                <button type="reset" className="rounded-md border px-3 py-2 text-sm font-medium">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-inverse"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href={linkDialogState.url}
                target={linkDialogState.url.startsWith("http") ? "_blank" : undefined}
                rel={linkDialogState.url.startsWith("http") ? "noreferrer" : undefined}
                className="min-w-0 flex-1 truncate text-sm text-accent"
              >
                {linkDialogState.url}
              </a>
              <button
                type="button"
                className={cn("rounded-md border px-2 py-1 text-sm font-medium")}
                onClick={() => {
                  publishSwitchToEdit();
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="rounded-md border px-2 py-1 text-sm font-medium"
                onClick={() => {
                  publishRemoveLink();
                }}
              >
                Remove
              </button>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export interface MarkdownTextAreaHandle {
  scrollToTop: () => void;
  setMarkdown: (markdown: string) => void;
  getMarkdown: () => string;
}

interface Props {
  className?: string;
  value: string;
  placeholder?: string | ReactNode;
  onChange: (value: string) => void;
  onBlur?: () => void;
  editorRef?: React.RefObject<MDXEditorMethods>;
  readOnly?: boolean;
  theme?: "light" | "dark";
}

export const MarkdownTextArea = forwardRef<MarkdownTextAreaHandle, Props>(
  ({ className, editorRef, value, onChange, placeholder, onBlur, readOnly, theme }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const internalEditorRef = useRef<MDXEditorMethods>(null);
    const mdxEditorRef = editorRef ?? internalEditorRef;
    const [overlayContainer, setOverlayContainer] = useState<HTMLDivElement | null>(null);

    const handleContainerRef = useCallback((node: HTMLDivElement | null) => {
      containerRef.current = node;
      setOverlayContainer(node);
    }, []);

    useImperativeHandle(ref, () => ({
      scrollToTop: () => {
        const node = containerRef.current?.querySelector(".mdxeditor");
        if (!node) {
          return;
        }
        requestAnimationFrame(() => {
          node.scrollTop = 0;
        });
      },
      setMarkdown: (markdown: string) => {
        mdxEditorRef.current?.setMarkdown(markdown);
      },
      getMarkdown: () => {
        return mdxEditorRef.current?.getMarkdown() ?? "";
      },
    }));

    return (
      <>
        <style>{`
    .mdxeditor-popup-container {
      z-index: 1101;
    }
    .mdxeditor {
      overflow-anchor: none;
    }
    .markdown-text-area-shell > .mdxeditor {
      position: relative;
      min-height: inherit;
      max-height: inherit;
      overflow-y: auto;
      border-radius: inherit;
    }

    .markdown-text-area-shell > .mdxeditor.dark-theme,
    .mdxeditor-popup-container.dark-theme {
      --basePageBg: var(--slate-1);
    }
  `}</style>
        <div
          ref={handleContainerRef}
          className={cn(
            "markdown-text-area-shell overflow-anchor:none relative max-h-[50vh] rounded-b-lg border bg-surface",
            className
          )}
        >
          <MDXEditor
            ref={mdxEditorRef}
            className={cn(theme === "dark" && "dark-theme dark-editor")}
            overlayContainer={overlayContainer}
            contentEditableClassName={cn("prose", theme === "dark" && "prose-invert", className)}
            markdown={value}
            plugins={[
              ...(!readOnly
                ? [
                    toolbarPlugin({
                      toolbarContents: () => (
                        <>
                          <UndoRedo />
                          <Separator />
                          <BoldItalicUnderlineToggles />
                          <Separator />
                          <CodeToggle />
                          <CreateLink />
                          <Separator />
                          <ListsToggle options={["bullet", "number"]} />
                          <Separator />
                          <BlockTypeSelect />
                        </>
                      ),
                    }),
                  ]
                : []),
              listsPlugin(),
              quotePlugin(),
              headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
              linkPlugin(),
              linkDialogPlugin({ LinkDialog: CorrectedLinkDialog }),
              tablePlugin(),
              thematicBreakPlugin(),
              frontmatterPlugin(),
              codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
              codeMirrorPlugin({
                codeBlockLanguages: {
                  "": "Plain Text",
                  js: "JavaScript",
                  ts: "TypeScript",
                  tsx: "TypeScript (React)",
                  jsx: "JavaScript (React)",
                  css: "CSS",
                  html: "HTML",
                  json: "JSON",
                  python: "Python",
                  sql: "SQL",
                  bash: "Bash",
                  yaml: "YAML",
                  markdown: "Markdown",
                },
              }),
              markdownShortcutPlugin(),
            ]}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            readOnly={readOnly}
            suppressHtmlProcessing
          />
        </div>
      </>
    );
  }
);

MarkdownTextArea.displayName = "MarkdownTextArea";

export default MarkdownTextArea;
