import { LANGUAGES, type LanguageCode } from "@/data/languages";

export const LANGUAGE_STORAGE_KEY = "votevisible-lang";

export function getStoredLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && LANGUAGES.some((l) => l.code === stored)) return stored as LanguageCode;
  // Fall back to the cookie for sessions saved before localStorage was used.
  // Google sometimes rewrites the source segment to "auto" after it runs,
  // so match either /en/xx or /auto/xx rather than assuming /en/ stays put.
  const match = document.cookie.match(/googtrans=\/(?:en|auto)\/([a-zA-Z-]+)/);
  const code = match?.[1];
  return (LANGUAGES.find((l) => l.code === code)?.code as LanguageCode) ?? "en";
}

export function clearTranslateCookies() {
  // Clear every scope we might have written to previously (host-only,
  // with an explicit domain, and the apex domain) so a stale value never
  // lingers and fights with the one we're about to set.
  const hostname = window.location.hostname;
  const scopes = [
    "path=/",
    `path=/; domain=${hostname}`,
    `path=/; domain=.${hostname}`,
  ];
  for (const scope of scopes) {
    document.cookie = `googtrans=; ${scope}; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
  }
}

export function reloadPage() {
  window.location.href = window.location.pathname + window.location.search;
}

// Google's combo doesn't reliably restore the original text when set to an
// empty value, so resetting to English always goes through a clean reload
// instead of the in-place combo switch used for every other language.
export function resetToEnglish() {
  clearTranslateCookies();
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "en");
  reloadPage();
}
