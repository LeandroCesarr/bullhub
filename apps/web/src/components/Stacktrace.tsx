import type { FC } from "react";

export const Stacktrace: FC<{ raw: string }> = ({ raw }) => {
  const [errorLine, ...stackLines] = raw.split("\n");
  return (
    <div className="bg-background border border-status-error/30 border-l-[3px] border-l-status-error rounded-md p-4 text-xs leading-relaxed overflow-x-auto">
      <p className="text-status-error font-semibold mb-2">{errorLine}</p>
      {stackLines.map((line, i) => {
        const isUserCode = !line.includes("node_modules");
        return (
          <div key={i} className={isUserCode ? "text-foreground" : "text-muted-foreground"}>
            <span className="text-muted-foreground/50 mr-1.5">at</span>
            {line.trim().replace(/^at\s*/, "")}
          </div>
        );
      })}
    </div>
  );
};
