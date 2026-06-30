"use client";

// Vendored from apps/windmill-web/app/components/Avatar.tsx (the avatar actually used across the app), NOT the initials-only packages/ui primitive.
// Styling copied verbatim; @wind/ui cn -> @/lib/utils, and generateImageUrl (a CDN resizer) stripped so any imageUrl renders directly.
// IMPORTANT: the default fallback is a light surface (bg-base text-secondary) — it is NEVER black-on-white. The black fill is opt-in via the `accent` prop only.

import { cn } from "@/lib/utils";

export interface AvatarProps {
  className?: string;
  imageUrl?: string | null;
  letter?: string;
  size?: "xs" | "sm" | "md" | "lg";
  accent?: boolean;
  loading?: boolean;
  sizePixels?: number;
  topRightAvatar?: Omit<AvatarProps, "size" | "sizePixels">;
}

const Avatar = ({
  imageUrl,
  letter,
  className,
  accent,
  size = "md",
  sizePixels,
  loading,
  topRightAvatar,
}: AvatarProps) => {
  // Size map in pixels
  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 48,
    lg: 64,
  };

  if (!sizePixels) {
    sizePixels = sizeMap[size];
  }

  const fontSizePixels = sizePixels * 0.6;

  return (
    <div className="relative">
      <div
        className={cn(
          "relative overflow-hidden rounded-full border-[0.5px] bg-base flex-none",
          className
        )}
        style={{
          width: sizePixels,
          height: sizePixels,
        }}
      >
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center font-medium text-secondary",
            {
              "bg-accent text-accent-inverse": accent,
              "bg-base text-secondary": !accent,
              "bg-black/10 animate-pulse": loading,
            }
          )}
          style={{
            width: sizePixels,
            height: sizePixels,
            fontSize: fontSizePixels,
          }}
        >
          {letter?.toUpperCase()}
        </div>
        {imageUrl && (
          <div
            className="absolute inset-0"
            style={{
              borderRadius: "50%",
              width: sizePixels,
              height: sizePixels,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundImage: `url("${imageUrl}")`,
            }}
          ></div>
        )}
      </div>
      {topRightAvatar && (
        <div
          className="absolute"
          style={{
            top: `${(-1 * sizePixels) / 5}px`,
            right: `${(-1 * sizePixels) / 5}px`,
          }}
        >
          <Avatar {...topRightAvatar} sizePixels={sizePixels / 2} />
        </div>
      )}
    </div>
  );
};

// Back-compat convenience wrapper for the old firstName/lastName/src API.
// Derives the fallback letter and defaults to the light (non-accent) look.
interface InitialsAvatarProps {
  className?: string;
  firstName?: string | null;
  lastName?: string | null;
  src?: string;
  size?: AvatarProps["size"];
}

const InitialsAvatar = ({ className, firstName, lastName, src, size }: InitialsAvatarProps) => {
  const letter = firstName ? firstName.charAt(0) : lastName ? lastName.charAt(0) : "";
  return <Avatar className={className} imageUrl={src} letter={letter} size={size} />;
};

export { Avatar, InitialsAvatar };

export default Avatar;
