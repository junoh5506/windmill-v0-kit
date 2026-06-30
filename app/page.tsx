"use client";

import AvatarStack from "@/components/ui/avatar-stack";
import { Tag } from "@/components/ui/badge";
import Card from "@/components/ui/card";
import FlexibleSpacer from "@/components/ui/flexible-spacer";
import { StatusIndicator, type TodoStatus } from "@/components/ui/indicator";
import Page from "@/components/ui/page";
import { HStack, VStack } from "@/components/ui/stack";
import { IconHeadset, IconPlugConnected, IconUserPlus } from "@tabler/icons-react";
import type { ReactNode } from "react";

/*
 * Faithful Home screen — this is the reference v0 learns Windmill composition from.
 * What it demonstrates (match these patterns, don't loosen them):
 *  - Real Tabler icons (@tabler/icons-react) for UI; a full-color BRAND logo for Slack.
 *  - Compact dense lists: Card.Body py-2 > VStack gapXs > rows with -mx-2 px-2 py-1 hover.
 *  - StatusIndicator (RED ring = overdue/not-started) instead of a neutral checkbox.
 *  - AvatarStack of real photos for multi-person rows (never a single initials bubble).
 */

// Brand logos are the ONE exception to the monochrome rule — render the real, full-color
// mark (here, an inline Slack SVG), never a gray Tabler glyph.
const SlackLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 122.8 122.8" className={className} aria-hidden role="img" width={24} height={24}>
    <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a"/>
    <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0"/>
    <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d"/>
    <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e"/>
  </svg>
);

const setupCards: { icon: ReactNode; title: string; description: string }[] = [
  { icon: <IconHeadset className="size-6 text-secondary" />, title: "Connect with us on Slack", description: "Get a dedicated support channel with our team" },
  { icon: <IconUserPlus className="size-6 text-secondary" />, title: "Invite members", description: "Invite your team members to the account" },
  { icon: <SlackLogo />, title: "Add Slack channels", description: "Add Windy to more Slack channels (141 currently connected)" },
  { icon: <IconPlugConnected className="size-6 text-secondary" />, title: "Add integrations", description: "Add integrations to your account" },
];

// Real photos for people; the AI participant is a small accent avatar.
const face = (n: number) => `https://i.pravatar.cc/96?img=${n}`;
const WINDY = { letter: "W", accent: true };

type Todo = { label: string; status: TodoStatus; people: { imageUrl?: string; letter?: string; accent?: boolean }[]; due?: string };
const cycles: { name: string; todos: Todo[] }[] = [
  {
    name: "MYPR",
    todos: [
      { label: "Upward Feedback for Adit Pareek", status: "overdue", people: [{ imageUrl: face(12) }, WINDY, { imageUrl: face(5) }], due: "Due May 27, 2026, 7:00 PM" },
    ],
  },
  {
    name: "MYPR",
    todos: [
      { label: "Self review", status: "not-started", people: [{ imageUrl: face(12) }, WINDY, { imageUrl: face(33) }] },
      { label: "Upward Feedback for Max Shaw", status: "not-started", people: [{ imageUrl: face(12) }, WINDY, { imageUrl: face(8) }] },
      { label: "Peer nominations", status: "in-progress", people: [{ imageUrl: face(12) }] },
    ],
  },
  {
    name: "asdasdsa",
    todos: [
      { label: "Upward Feedback for Eric Von Bevern", status: "not-started", people: [{ imageUrl: face(12) }, WINDY, { imageUrl: face(15) }] },
    ],
  },
];

export default function HomePage() {
  return (
    <Page title="Windmill" width="default">
      <VStack gapMd alignStretch>
        {/* Account setup — responsive grid of cards, full-color Slack brand logo */}
        <VStack gapSm alignStretch>
          <HStack gapSm alignYCenter>
            <span className="text-header-sm text-primary">Account setup</span>
            <FlexibleSpacer />
            <span className="text-body-sm text-tertiary">Dismiss</span>
          </HStack>
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-2">
            {setupCards.map((c) => (
              <div
                key={c.title}
                className="flex flex-col items-start gap-2 rounded-xl border border-muted bg-surface px-4 py-6 ring-1 ring-inset ring-accent/5 transition-all hover:shadow-sm"
              >
                <span>{c.icon}</span>
                <span className="text-ui font-medium text-primary">{c.title}</span>
                <span className="text-body-sm text-tertiary">{c.description}</span>
              </div>
            ))}
          </div>
        </VStack>

        {/* Performance review to-dos — grouped, COMPACT rows with red status + avatar stacks */}
        <VStack gapSm alignStretch>
          <HStack gapSm alignYCenter>
            <span className="text-header-sm text-primary">Performance review to-dos</span>
            <Tag>{cycles.reduce((n, c) => n + c.todos.length, 0)}</Tag>
          </HStack>

          {cycles.map((cycle, i) => (
            <Card key={`${cycle.name}-${i}`}>
              <Card.Header title={cycle.name} viewDetailLink={{ to: "#", label: "View cycle" }} />
              <Card.Body className="py-2">
                <VStack gapXs alignStretch>
                  {cycle.todos.map((t) => (
                    <HStack
                      key={t.label}
                      gapSm
                      alignYCenter
                      className="-mx-2 rounded-md px-2 py-1 transition-all hover:bg-surface-muted"
                    >
                      <StatusIndicator status={t.status} size="sm" />
                      <AvatarStack avatars={t.people} size="sm" />
                      <span className="text-ui text-primary">{t.label}</span>
                      <FlexibleSpacer />
                      {t.due && <Tag intent="error">{t.due}</Tag>}
                    </HStack>
                  ))}
                </VStack>
              </Card.Body>
            </Card>
          ))}
        </VStack>
      </VStack>
    </Page>
  );
}
