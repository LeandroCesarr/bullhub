import { useMatches } from "@tanstack/react-router";

export function usePageTitle() {
  const matches = useMatches();
  const title = matches.findLast((match) => match.staticData?.title)?.staticData?.title;

  return title ?? "Bullhub";
}
