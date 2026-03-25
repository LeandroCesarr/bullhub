import type { FC } from "react";

export const JsonViewer: FC<{ payload: Record<string, unknown> }> = ({ payload }) => {
  return (
    <pre className="bg-background border border-border rounded-md p-4 text-xs leading-relaxed overflow-x-auto">
      {Object.entries(payload).map(([key, val]) => (
        <div key={key}>
          <span className="text-accent">&quot;{key}&quot;</span>
          <span className="text-muted-foreground">: </span>
          {typeof val === "string" ? (
            <span className="text-[oklch(0.78_0.12_100)]">&quot;{val}&quot;</span>
          ) : (
            <span className="text-primary">{String(val)}</span>
          )}
        </div>
      ))}
    </pre>
  );
};
