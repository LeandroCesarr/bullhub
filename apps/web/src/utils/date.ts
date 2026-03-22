const MINUTE = 60;
const HOUR = MINUTE * 60;

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < MINUTE) return "just now";
  if (seconds < HOUR) return `${Math.floor(seconds / MINUTE)}m ago`;
  return `${Math.floor(seconds / HOUR)}h ago`;
}
