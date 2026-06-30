"use client";

// Vendored from apps/windmill-web/app/components/EmployeeAvatarStack.tsx.
// Styling verbatim: overlapping avatars via `-space-x-1` + descending z-index, and a
// `circle-8` "+N" overflow badge. The production `Icon icon={{ employee }}` avatar is
// swapped for the kit's image-first Avatar primitive (pass imageUrl for a photo).

import Avatar, { type AvatarProps } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface AvatarStackItem {
  imageUrl?: string | null;
  letter?: string;
  accent?: boolean;
}

interface AvatarStackProps {
  avatars: AvatarStackItem[];
  maxAvatars?: number;
  size?: AvatarProps["size"];
  className?: string;
  overflowClassName?: string;
}

const DEFAULT_MAX_AVATARS = 3;

const AvatarStack = ({
  avatars,
  maxAvatars = DEFAULT_MAX_AVATARS,
  size = "sm",
  className,
  overflowClassName,
}: AvatarStackProps) => {
  const avatarsToShow = avatars.slice(0, maxAvatars);
  const hiddenCount = avatars.length - maxAvatars;

  return (
    <div className={cn("flex items-center -space-x-1", className)}>
      {avatarsToShow.map((item, index) => (
        <div key={index} style={{ zIndex: avatarsToShow.length - index }}>
          <Avatar imageUrl={item.imageUrl} letter={item.letter} accent={item.accent} size={size} />
        </div>
      ))}
      {hiddenCount > 0 && (
        <div
          className={cn(
            "circle-8 z-0 flex items-center justify-center border bg-surface text-xs font-medium text-secondary",
            overflowClassName
          )}
        >
          +{hiddenCount}
        </div>
      )}
    </div>
  );
};

export default AvatarStack;
