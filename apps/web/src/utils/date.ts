const MINUTE = 60;
const HOUR = MINUTE * 60;

export function epocToHours(epochMs: number) {
  return new Date(epochMs).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function epochToDuration(epochMs: number, nowMs: number = Date.now()) {
  if (!Number.isFinite(epochMs) || epochMs < 0) {
    throw new Error("Invalid epoch");
  }

  if (!Number.isFinite(nowMs) || nowMs < epochMs) {
    throw new Error("Invalid reference time");
  }

  const totalSeconds = Math.floor((nowMs - epochMs) / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

export function formatDurationRaw(d: ReturnType<typeof epochToDuration>): string {
  const parts: string[] = [];

  if (d.days) parts.push(`${d.days}d`);
  if (d.hours) parts.push(`${d.hours}h`);
  if (d.minutes) parts.push(`${d.minutes}m`);
  if (d.seconds) parts.push(`${d.seconds}s`);

  return parts.join(" ") || "0s";
}

export function format(value: string | number): string {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatEpocDuration(value: number): string {
  return formatDurationRaw(epochToDuration(value));
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < MINUTE) return "just now";
  if (seconds < HOUR) return `${Math.floor(seconds / MINUTE)}m ago`;
  return `${Math.floor(seconds / HOUR)}h ago`;
}

export const date = {
  format,
  timeAgo,
  duration: formatDuration,
};
