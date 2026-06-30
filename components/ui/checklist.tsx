"use client";

// Vendored from packages/ui/src/components/Checklist. Styling verbatim; @wind/Remix deps stripped for v0.
// NOTE: react-icons FaCheck mapped to lucide-react Check. Header/Label imported from the kit typography primitive.

import { Header, Label } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface OnboardingItem {
  title: string;
  description: string;
}

interface Props {
  className?: string;
  items: OnboardingItem[];
}

const Item = ({ title, description }: OnboardingItem) => {
  return (
    <div className="flex gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-inverse">
        <Check className="h-4 w-4" />
      </div>
      <div>
        <Header level={3}>{title}</Header>
        <Label intent="secondary">{description}</Label>
      </div>
    </div>
  );
};

const Checklist = ({ className, items }: Props) => {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {items.map((item) => (
        <Item {...item} key={item.title} />
      ))}
    </div>
  );
};

export default Checklist;
