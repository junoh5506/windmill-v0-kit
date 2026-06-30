"use client";

// Vendored from packages/ui/src/components/Sortable (SortableList.tsx + SortableCard.tsx). Styling verbatim; @wind/Remix deps stripped for v0.
// @dnd-kit/* drag engine and react-textarea-autosize kept intact. Button/VStack imported from the kit primitives.

import { Button } from "@/components/ui/button";
import { VStack } from "@/components/ui/stack";
import { cn } from "@/lib/utils";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical as GripVertical, IconPlus as Plus, IconX as X } from "@tabler/icons-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import TextareaAutosize from "react-textarea-autosize";

export interface SortableCardProps {
  id: string;
  content: string;
  canEdit?: boolean;
  canDelete?: boolean;
  canDrag?: boolean;
  placeholder?: string;
  onChange?: (content: string) => void;
  onDelete?: () => void;
  deleteLabel?: string;
  onEnter: () => void;
  isEditing?: boolean;
  hasPrev: boolean;
  hasNext: boolean;
  onFocusPrev: () => void;
  onFocusNext: () => void;
}

export const SortableCard = ({
  id,
  content,
  canDelete = true,
  canDrag = true,
  placeholder = "Enter content...",
  onChange,
  onDelete,
  deleteLabel = "Delete Item",
  onEnter,
  isEditing = false,
  hasPrev,
  hasNext,
  onFocusPrev,
  onFocusNext,
}: SortableCardProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: !canDrag,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Backspace") {
      if (content.trim().length === 0) {
        e.preventDefault();
        e.stopPropagation();
        if (hasPrev) {
          onFocusPrev();
        }
        if (canDelete && onDelete) {
          onDelete();
        }
        return;
      }
    }

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      textareaRef.current?.blur();
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onEnter();
    }

    if (e.key === "Tab" && !e.shiftKey) {
      if (hasNext) {
        e.preventDefault();
        onFocusNext();
      }
    }

    if (e.key === "Tab" && e.shiftKey) {
      if (hasPrev) {
        e.preventDefault();
        onFocusPrev();
      }
    }
  };

  const handleBlur = () => {
    if (canDelete && onDelete && content.trim().length === 0) {
      onDelete();
    }
  };

  const isEmpty = content.trim().length === 0;
  const showError = isEmpty && !isEditing;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("group relative touch-none cursor-default", isDragging && "opacity-50")}
      {...attributes}
      tabIndex={-1}
    >
      <div
        className={cn(
          "flex items-center gap-1 py-0 px-1 card focus-within:outline-none focus-within:ring-accent focus-within:ring-1 focus-within:border-accent",
          {
            "shadow-lg": isDragging,
            "ring-2 ring-offset-2 ring-red": showError,
          }
        )}
      >
        {canDrag && (
          <div
            {...listeners}
            className="flex-shrink-0 cursor-grab py-2 pl-2 text-tertiary active:cursor-grabbing"
          >
            <GripVertical size={16} />
          </div>
        )}

        <TextareaAutosize
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          maxRows={10}
          className="w-full resize-none border-none bg-transparent text-body-sm font-normal placeholder:text-tertiary focus:ring-0"
        />

        {canDelete && onDelete && (
          <Button size="sm" intent="icon" onClick={onDelete} icon={<X size={12} />} tabIndex={-1}>
            {deleteLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export interface SortableItem {
  id: string;
  content: string;
}

export interface SortableListProps {
  values: string[];
  onChange: (values: string[]) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canDrag?: boolean;
  restrictToVertical?: boolean;
  showAddButton?: boolean;
  addButtonText?: string;
  emptyPlaceholder?: string;
  placeholder?: string;
  minItems?: number;
  deleteLabel?: string;
  autoFocusFirstItem?: boolean;
}

const SortableList = ({
  values,
  onChange,
  canEdit = true,
  canDelete = true,
  canDrag = true,
  restrictToVertical = true,
  showAddButton = true,
  addButtonText = "Add Item",
  emptyPlaceholder = "No items yet",
  placeholder = "Enter content...",
  minItems = 0,
  deleteLabel: _deleteLabel = "Delete",
  autoFocusFirstItem = false,
}: SortableListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const idCounterRef = useRef(0);

  const [items, setItems] = useState<SortableItem[]>(() => {
    const initialItems = values.map((value, index) => ({
      id: `item-${index}`,
      content: value,
    }));
    idCounterRef.current = initialItems.length;
    return initialItems;
  });

  useEffect(() => {
    setItems((prevItems) => {
      // Only update if values actually changed
      if (
        values.length !== prevItems.length ||
        values.some((value, index) => value !== prevItems[index]?.content)
      ) {
        const updatedItems = values.map((value, index) => ({
          id: `item-${index}`,
          content: value,
        }));
        idCounterRef.current = updatedItems.length;
        return updatedItems;
      }
      return prevItems; // Return existing items if no change
    });
  }, [values]);

  useEffect(() => {
    if (autoFocusFirstItem && canEdit && items.length > 0 && !editingId) {
      const firstItem = items[0];
      if (firstItem) {
        setEditingId(firstItem.id);
      }
    }
  }, [autoFocusFirstItem, canEdit, items, editingId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        setItems(reorderedItems);
        onChange(reorderedItems.map((item) => item.content));
      }
    }
  };

  const handleContentChange = (item: SortableItem, newContent: string) => {
    const updatedItems = items.map((t) => (t.id === item.id ? { ...t, content: newContent } : t));
    setItems(updatedItems);
    onChange(updatedItems.map((item) => item.content));
  };

  const handleDelete = (item: SortableItem) => {
    if (items.length > minItems) {
      const updatedItems = items.filter((t) => t.id !== item.id);
      setItems(updatedItems);
      onChange(updatedItems.map((item) => item.content));
    }
  };

  const handleAddItem = () => {
    const newItem: SortableItem = {
      id: `item-${idCounterRef.current++}`,
      content: "",
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    onChange(updatedItems.map((item) => item.content));
    setEditingId(newItem.id);
  };

  const handleEnter = (item: SortableItem) => {
    const currentIndex = items.findIndex((t) => t.id === item.id);
    const newItem: SortableItem = {
      id: `item-${idCounterRef.current++}`,
      content: "",
    };
    const updatedItems = [
      ...items.slice(0, currentIndex + 1),
      newItem,
      ...items.slice(currentIndex + 1),
    ];
    setItems(updatedItems);
    onChange(updatedItems.map((item) => item.content));
    setEditingId(newItem.id);
  };

  const canDeleteItem = (_item: SortableItem) => canDelete && items.length > Math.max(1, minItems);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-surface-muted/20 py-8 text-center">
        <div className="mx-auto mb-4 max-w-lg text-sm text-tertiary">{emptyPlaceholder}</div>
        {showAddButton && (
          <Button size="sm" intent="secondary" onClick={handleAddItem} icon={<Plus size={16} />}>
            {addButtonText}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[
          restrictToParentElement,
          ...(restrictToVertical ? [restrictToVerticalAxis] : []),
        ]}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <VStack gapSm>
            {items.map((item) => {
              return (
                <SortableCard
                  key={item.id}
                  id={item.id}
                  content={item.content}
                  canEdit={canEdit}
                  canDelete={canDeleteItem(item)}
                  canDrag={canDrag}
                  placeholder={placeholder}
                  onChange={(content: string) => handleContentChange(item, content)}
                  onDelete={() => handleDelete(item)}
                  onEnter={() => handleEnter(item)}
                  isEditing={editingId === item.id}
                  hasPrev={items.findIndex((t) => t.id === item.id) > 0}
                  hasNext={items.findIndex((t) => t.id === item.id) < items.length - 1}
                  onFocusPrev={() => {
                    const currentIndex = items.findIndex((t) => t.id === item.id);
                    if (currentIndex > 0) {
                      const prevItem = items[currentIndex - 1];
                      if (prevItem) {
                        setEditingId(prevItem.id);
                      }
                    }
                  }}
                  onFocusNext={() => {
                    const currentIndex = items.findIndex((t) => t.id === item.id);
                    if (currentIndex < items.length - 1) {
                      const nextItem = items[currentIndex + 1];
                      if (nextItem) {
                        setEditingId(nextItem.id);
                      }
                    }
                  }}
                />
              );
            })}
          </VStack>
        </SortableContext>
      </DndContext>
      {showAddButton && (
        <div className="pt-2">
          <Button
            size="sm"
            intent="secondary"
            onClick={handleAddItem}
            icon={<Plus size={16} />}
            className="w-full"
          >
            {addButtonText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SortableList;
