"use client";

import InitialsAvatar from "@/components/ui/avatar";
import { Tag } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Page from "@/components/ui/page";
import { HStack, VStack } from "@/components/ui/stack";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/*
 * Smoke-test screen. Proves the tokens + primitives render together and gives
 * v0 a reference for how Windmill screens are composed:
 * Page > VStack(sections) > Card > HStack(rows).
 */
const people = [
  { first: "Ada", last: "Lovelace", role: "Staff Engineer", cycle: "complete" as const },
  { first: "Alan", last: "Turing", role: "Eng Manager", cycle: "in-progress" as const },
  { first: "Grace", last: "Hopper", role: "Principal Engineer", cycle: "not-started" as const },
];

const cycleTag = {
  complete: <Tag intent="success">Complete</Tag>,
  "in-progress": <Tag intent="warning">In progress</Tag>,
  "not-started": <Tag intent="default">Not started</Tag>,
};

export default function DemoPage() {
  return (
    <Page
      title="Q2 2026 Review Cycle"
      subtitle="Track self-reviews and manager reviews across your reports."
      width="default"
      primaryCTA={<Button intent="primary">Start review</Button>}
      secondaryCTA={<Button intent="secondary">Export</Button>}
    >
      <VStack gapMd alignStretch>
        <Tabs defaultValue="reviews">
          <TabsList>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews">
            <VStack gapMd alignStretch>
              <Card>
                <Card.Header title="Direct reports" button={<Button size="sm">Add</Button>} />
                <Card.Body>
                  <VStack gapSm alignStretch divide>
                    {people.map((p) => (
                      <HStack key={p.first} gapSm alignYCenter justifyBetween className="py-2">
                        <HStack gapSm alignYCenter>
                          <InitialsAvatar firstName={p.first} lastName={p.last} />
                          <VStack gapNone>
                            <span className="text-ui text-primary">
                              {p.first} {p.last}
                            </span>
                            <span className="text-body-sm text-tertiary">{p.role}</span>
                          </VStack>
                        </HStack>
                        {cycleTag[p.cycle]}
                      </HStack>
                    ))}
                  </VStack>
                </Card.Body>
              </Card>

              <Card>
                <Card.Header title="Nominate a peer reviewer" />
                <Card.Body>
                  <HStack gapSm alignYCenter>
                    <Input placeholder="Search members…" />
                    <Button intent="primary">Send request</Button>
                  </HStack>
                </Card.Body>
              </Card>
            </VStack>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <Card.Body>
                <span className="text-body-sm text-secondary">Cycle settings go here.</span>
              </Card.Body>
            </Card>
          </TabsContent>
        </Tabs>
      </VStack>
    </Page>
  );
}
