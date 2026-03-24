import { useMatches } from "@tanstack/react-router";

export function usePageTitle() {
  const matches = useMatches();
  const match = matches.at(-1);

  const staticTitle = match?.staticData?.title as string | undefined;
  const params = match?.params as Record<string, string>;

  if (!staticTitle) return "Bullhub";

  return Object.entries(params).reduce(
    (title, [key, val]) => title.replace(`:${key}`, val),
    staticTitle,
  );
}
