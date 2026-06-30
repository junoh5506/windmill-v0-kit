"use client";

// Vendored from packages/ui/src/components/StatusIcon/StatusIcon.tsx. Styling verbatim; Remix/workspace deps stripped for v0.

import { cn } from "@/lib/utils";
import { IconCircleCheck as CheckCircle, IconLoader as Loader, IconPlayerPause as PauseCircle, IconCircleX as XCircle } from "@tabler/icons-react";

interface Props {
  className?: string;
  status: string | boolean;
  size?: "sm" | "md" | "lg";
}

const SUCCESS_STRINGS = [
  "SUCCESS",
  "FINISHED",
  "COMPLETED",
  "DONE",
  "ACHIEVED",
  "FULFILLED",
  "REACHED",
  "COMPLETE",
  "ACTIVE",
  "ACCEPTED",
];
const ERROR_STRINGS = [
  "ERROR",
  "FAILED",
  "ABORTED",
  "TERMINATED",
  "STOPPED",
  "UNSUCCESSFUL",
  "DISRUPTED",
  "DECLINED",
];

const WARNING_STRINGS = ["WARNING", "UNSTABLE", "UNRELIABLE"];
const IN_PROGRESS_STRINGS = [
  "RUNNING",
  "STARTED",
  "IN_PROGRESS",
  "ONGOING",
  "PROGRESSING",
  "UNDERWAY",
  "UNFINISHED",
  "LOADING",
];

const PAUSED_STRINGS = ["PAUSED", "SUSPENDED"];

const options = {
  success: SUCCESS_STRINGS,
  error: ERROR_STRINGS,
  in_progress: IN_PROGRESS_STRINGS,
  paused: PAUSED_STRINGS,
  warning: WARNING_STRINGS,
};

// NOTE: react-icons mapped to @tabler/icons-react: FaRegCheckCircle->CheckCircle,
// FaRegTimesCircle->XCircle, VscLoading->Loader, BsPauseCircle->PauseCircle.
// The warning glyph (FaExclamation in a ring) is recreated inline.
export const StatusIcon = ({ status, size = "md" }: Props) => {
  let resolvedStatus = status;
  if (resolvedStatus === true) {
    resolvedStatus = "success";
  }
  if (resolvedStatus === false) {
    resolvedStatus = "error";
  }
  const uppercaseStatus = resolvedStatus.toString().toUpperCase();

  const parsedStatus = Object.entries(options).find(([, value]) => {
    return value.includes(uppercaseStatus);
  })?.[0] as keyof typeof options | undefined;

  if (!parsedStatus) {
    return null;
  }

  // Ensure consistent application of classes
  const iconClassName = cn(
    "flex-none circle-6",
    {
      "text-xs": size === "sm",
      "": size === "md",
      "text-xl": size === "lg",
    },
    {
      "text-green bg-green": parsedStatus === "success",
      "text-red bg-red": parsedStatus === "error",
      "text-yellow bg-yellow": parsedStatus === "warning",
      "": parsedStatus === "paused",
      "animate-spin": parsedStatus === "in_progress",
    }
  );

  const statusIcon = {
    success: <CheckCircle />,
    warning: (
      <div className="circle-4 flex items-center justify-center border-[1.5px] border-orange-500 text-[0.5em] font-bold">
        !
      </div>
    ),
    error: <XCircle />,
    in_progress: <Loader />,
    paused: <PauseCircle />,
  };

  return (
    <div className="flex justify-start">
      <div className={iconClassName}>{statusIcon[parsedStatus]}</div>
    </div>
  );
};

export default StatusIcon;
