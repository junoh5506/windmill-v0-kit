"use client";
// Vendored from packages/ui/src/components/TipTapEditor/TipTapSimpleEditor.tsx. Styling verbatim where
// feasible; @wind/Remix/app deps stubbed for v0.
// NOTE: fidelity: medium. The real @tiptap engine (StarterKit + extensions) is preserved. The source's
// deep custom toolbar/UI tree (../../tiptap/components/tiptap-ui*, slash-commands, editor-context-menu,
// LinkHoverPopover, useCursorVisibility) and Hocuspocus/Liveblocks collaboration are too workspace-coupled
// to vendor — they are replaced by a minimal self-contained toolbar of bold/italic/strike/code/heading/
// list/quote buttons that drive the same editor commands. A consumer wanting the production toolbar must
// wire up the packages/ui/src/tiptap/* primitives and slash-command + collaboration extensions.

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TableKit } from "@tiptap/extension-table";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography as TiptapTypography } from "@tiptap/extension-typography";
import { Placeholder, Selection } from "@tiptap/extensions";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { EditorContent, EditorContext, useEditor, type Editor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { IconBold as Bold, IconCode as Code, IconH1 as Heading1, IconH2 as Heading2, IconItalic as Italic, IconList as List, IconListNumbers as ListOrdered, IconQuote as Quote, IconArrowForwardUp as Redo2, IconStrikethrough as Strikethrough, IconUnderline as UnderlineIcon, IconArrowBackUp as Undo2 } from "@tabler/icons-react";
import * as React from "react";

// NOTE: replaces @wind ArrayUtil.clean — strips nullish entries from the extension list.
const cleanArray = <T,>(items: Array<T | null | undefined | false>): T[] =>
  items.filter((item): item is T => item != null && item !== false);

const ToolbarButton = ({
  onClick,
  active,
  disabled,
  children,
  label,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  label: string;
}) => (
  <Button
    type="button"
    intent="transparent"
    size="sm"
    aria-label={label}
    aria-pressed={active}
    disabled={disabled}
    onClick={onClick}
    className={cn("px-2", active && "bg-accent/10 text-accent")}
  >
    {children}
  </Button>
);

const MainToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b bg-surface px-2 py-1">
      <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>
      <div className="bg-border mx-1 h-5 w-px" />
      <ToolbarButton
        label="Heading 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Ordered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      <div className="bg-border mx-1 h-5 w-px" />
      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Strike"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
};

interface Props {
  className?: string;
  editorContentClassName?: string;
  toolbarClassName?: string;
  contentHeader?: React.ReactNode;
  contentFooter?: React.ReactNode;
  onBlur?: () => void;
  onFocus?: () => void;
  placeholder?: string;
  initialContent?: string;
  onUpdate?: (html: string) => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

const TipTapEditor = ({
  className,
  editorContentClassName,
  toolbarClassName,
  contentHeader,
  contentFooter,
  onBlur,
  onFocus,
  placeholder,
  initialContent,
  onUpdate,
  onDirtyChange,
}: Props) => {
  const initialEditorDocRef = React.useRef<ProseMirrorNode | null>(null);
  const hasRealContentChangeRef = React.useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor rich-text-editor",
      },
    },
    content: initialContent || "",
    onCreate: ({ editor }) => {
      initialEditorDocRef.current = editor.state.doc;
      hasRealContentChangeRef.current = false;
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const initialEditorDoc = initialEditorDocRef.current;
      const isDirty = !!initialEditorDoc && !editor.state.doc.eq(initialEditorDoc);

      if (isDirty) {
        hasRealContentChangeRef.current = true;
      }
      if (isDirty || hasRealContentChangeRef.current) {
        onDirtyChange?.(isDirty);
      }
      onUpdate?.(html);
    },
    onBlur,
    onFocus,
    extensions: cleanArray([
      StarterKit.configure({
        horizontalRule: false,
        link: false,
      }),
      Link.extend({ inclusive: false }).configure({
        openOnClick: true,
        enableClickSelection: true,
      }),
      Placeholder.configure({
        placeholder: placeholder || "Press '/' for commands",
        showOnlyCurrent: true,
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      TiptapTypography,
      Superscript,
      Subscript,
      Selection,
      TableKit.configure({
        table: {
          resizable: true,
          cellMinWidth: 50,
        },
      }),
    ]),
  });

  return (
    <div className={cn("bg-surface simple-editor-wrapper", className)}>
      <EditorContext.Provider value={{ editor }}>
        <div className={toolbarClassName}>
          <MainToolbar editor={editor} />
        </div>
        <div>
          {contentHeader}
          <EditorContent
            editor={editor}
            role="presentation"
            className={cn("simple-editor-content p-4", editorContentClassName)}
          />
          {contentFooter}
        </div>
      </EditorContext.Provider>
    </div>
  );
};

export default TipTapEditor;
