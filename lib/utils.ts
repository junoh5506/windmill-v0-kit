import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/*
 * Mirror of packages/ui/src/util/cn.ts. The custom font sizes (text-ui,
 * text-body-*, text-header-*, caption) and token text colors are registered
 * with tailwind-merge so conflicting classes dedupe the same way they do in
 * the real app.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["header-lg", "header-md", "header-sm", "body-md", "body-sm", "caption", "ui"] },
      ],
      "text-color": [
        {
          text: [
            "primary",
            "secondary",
            "tertiary",
            "accent",
            "accent-inverse",
            "inverse",
            "error",
            "green",
            "red",
            "yellow",
            "blue",
            "purple",
            "fuchsia",
            "orange",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default cn;
