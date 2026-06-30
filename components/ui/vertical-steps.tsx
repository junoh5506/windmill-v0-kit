"use client";

// Vendored from packages/ui/src/components/VerticalSteps/VerticalSteps.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { IconCircleCheck as CircleCheckBig } from "@tabler/icons-react";

interface Props {
  steps: Array<{
    name: string;
  }>;
  currentStepIndex: number;
}

export default function VerticalSteps({ steps, currentStepIndex }: Props) {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <nav className="flex justify-center" aria-label="Progress">
        <ol className="space-y-6">
          {steps.map((step, i) => (
            <li key={step.name}>
              {i < currentStepIndex ? (
                <button className="group flex items-start text-left" type="button">
                  <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                    <CircleCheckBig
                      className="h-full w-full text-accent group-hover:text-accent"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="ml-3 text-sm font-medium text-secondary group-hover:text-primary">
                    {step.name}
                  </span>
                </button>
              ) : i === currentStepIndex ? (
                <div className="flex items-start" aria-current="step">
                  <span
                    className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center"
                    aria-hidden="true"
                  >
                    <span className="absolute h-6 w-6 rounded-full bg-accent/20" />
                    <span className="relative block h-2 w-2 rounded-full bg-accent" />
                  </span>
                  <span className="ml-3 text-sm font-medium text-accent">{step.name}</span>
                </div>
              ) : (
                <div className="group">
                  <div className="flex items-start">
                    <div
                      className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center"
                      aria-hidden="true"
                    >
                      <div className="h-3 w-3 rounded-full bg-surface" />
                    </div>
                    <p className="ml-3 text-sm font-medium text-secondary">{step.name}</p>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
