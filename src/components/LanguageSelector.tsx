"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Globe, Check, ChevronDown, Search } from "lucide-react";
import { LANGUAGES, type LanguageCode } from "@/data/languages";

function getCurrentLanguage(): LanguageCode {
  if (typeof document === "undefined") return "en";
  // Google sometimes rewrites the source segment to "auto" after it runs,
  // so match either /en/xx or /auto/xx rather than assuming /en/ stays put.
  const match = document.cookie.match(/googtrans=\/(?:en|auto)\/([a-zA-Z-]+)/);
  const code = match?.[1];
  return (LANGUAGES.find((l) => l.code === code)?.code as LanguageCode) ?? "en";
}

function clearTranslateCookies() {
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

function setLanguage(code: LanguageCode) {
  clearTranslateCookies();
  if (code !== "en") {
    document.cookie = `googtrans=/en/${code}; path=/`;
  }
  // A full navigation (not just reload) guarantees a clean document and
  // avoids Google Translate's live DOM rewrites colliding with React's
  // reconciler when switching straight from one translated language to another.
  window.location.href = window.location.pathname + window.location.search;
}

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<LanguageCode>("en");
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the googtrans cookie on mount
    setCurrent(getCurrentLanguage());
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const currentOption = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter(
      (l) => l.label.toLowerCase().includes(q) || l.nativeLabel.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div ref={ref} className="relative notranslate" translate="no">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
      >
        <Globe className="h-3.5 w-3.5" />
        <span>Read in {currentOption.nativeLabel}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search languages..."
              className="w-full text-sm text-navy-900 outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <p className="px-3.5 py-4 text-center text-sm text-slate-400">No languages match.</p>
            )}
            {filtered.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className="flex w-full items-center justify-between px-3.5 py-2 text-left text-sm text-navy-900 hover:bg-blue-50"
              >
                <span>
                  {lang.nativeLabel}
                  {lang.nativeLabel !== lang.label && (
                    <span className="ml-1 text-xs text-slate-400">({lang.label})</span>
                  )}
                </span>
                {lang.code === current && <Check className="h-3.5 w-3.5 shrink-0 text-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
