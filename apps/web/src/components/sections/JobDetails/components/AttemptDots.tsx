import type { FC } from "react";
import { JobStateEnum } from "@/enums/jobStateEnum.ts";

interface IAttemptDotsProps {
  attempt: {
    made: number;
    max: number;
  };
  state: JobStateEnum;
}

function getRealIndex(index: number) {
  return index + 1;
}

export const AttemptDots: FC<IAttemptDotsProps> = ({ attempt, state }) => {
  function isError(index: number) {
    const realIndex = getRealIndex(index);
    return realIndex < attempt.made || (realIndex === attempt.max && state === JobStateEnum.FAILED);
  }

  function getClassColor(index: number) {
    const realIndex = getRealIndex(index);

    if (isError(index)) return "bg-status-error";

    if (realIndex === attempt.max && state === JobStateEnum.COMPLETED) return "bg-primary";

    return "bg-muted-foreground";
  }

  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: attempt.max }).map((_, i) => (
        <span key={i} className={`w-2 h-2 rounded-full ${getClassColor(i)}`} />
      ))}
    </div>
  );
};
