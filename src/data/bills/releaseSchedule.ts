import { USState } from "./types";

// States not listed here are already public. A listed state's bills stay
// hidden from every listing/count/static page until its date (UTC) arrives,
// so new research can be committed well ahead of its public release.
export const RELEASE_SCHEDULE: Partial<Record<USState, string>> = {
  Colorado: "2026-11-05",
  Massachusetts: "2026-11-15",
  Virginia: "2026-11-25",
  Tennessee: "2026-12-05",
  Wisconsin: "2026-12-15",
  "New Jersey": "2026-12-25",
};

export function isStateReleased(state: USState, now: Date = new Date()): boolean {
  const releaseDate = RELEASE_SCHEDULE[state];
  if (!releaseDate) return true;
  return now.toISOString().slice(0, 10) >= releaseDate;
}

export function getUpcomingReleases(
  now: Date = new Date(),
): { state: USState; releaseDate: string }[] {
  return (Object.entries(RELEASE_SCHEDULE) as [USState, string][])
    .filter(([state]) => !isStateReleased(state, now))
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([state, releaseDate]) => ({ state, releaseDate }));
}
