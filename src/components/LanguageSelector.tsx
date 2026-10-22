"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Globe, Check, ChevronDown, Search } from "lucide-react";
import { LANGUAGES, type LanguageCode } from "@/data/languages";
import {
  LANGUAGE_STORAGE_KEY,
  clearTranslateCookies,
  getStoredLanguage,
  reloadPage,
  resetToEnglish,
} from "@/lib/translation";

function getCombo(): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>("select.goog-te-combo");
}

// Polls briefly for the widget's hidden <select>, which Google injects
// asynchronously after its script loads, so a click right after page load
// doesn't fall through to the reload fallback unnecessarily.
function waitForCombo(retries = 10, delay = 150): Promise<HTMLSelectElement | null> {
  return new Promise((resolve) => {
    const attempt = (remaining: number) => {
      const combo = getCombo();
      if (combo || remaining <= 0) {
        resolve(combo);
        return;
      }
      setTimeout(() => attempt(remaining - 1), delay);
    };
    attempt(retries);
  });
}

// Drives Google's own hidden <select class="goog-te-combo"> directly so the
// page retranslates in place. The previous approach did a full navigation on
// every switch, which raced with Google's own cookie writes during init and
// caused the selection to flicker or revert when switching languages quickly.
async function applyLanguage(code: LanguageCode): Promise<boolean> {
  clearTranslateCookies();
  document.cookie = `googtrans=/en/${code}; path=/`;
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);

  const combo = await waitForCombo();
  if (!combo) return false;

  combo.value = code;
  combo.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<LanguageCode>("en");
  const [pending, setPending] = useState<LanguageCode | null>(null);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const applyingRef = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from storage/cookie on mount
    setCurrent(getStoredLanguage());
  }, []);

  async function handleSelect(code: LanguageCode) {
    setOpen(false);
    setQuery("");
    // Ignore a second click while one switch is still in flight, since
    // overlapping calls to the widget's <select> are what caused the
    // selection to flicker between languages.
    if (applyingRef.current) return;
    applyingRef.current = true;
    setPending(code);

    if (code === "en") {
      resetToEnglish();
      return;
    }

    const applied = await applyLanguage(code);
    if (applied) {
      setCurrent(code);
      setPending(null);
      applyingRef.current = false;
    } else {
      // Widget never became ready; fall back to a full navigation so
      // Google re-initializes and applies the cookie on load.
      reloadPage();
    }
  }

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

  const currentOption = LANGUAGES.find((l) => l.code === (pending ?? current)) ?? LANGUAGES[0];

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
                disabled={pending !== null}
                onClick={() => handleSelect(lang.code)}
                className="flex w-full items-center justify-between px-3.5 py-2 text-left text-sm text-navy-900 hover:bg-blue-50 disabled:cursor-wait disabled:opacity-60"
              >
                <span>
                  {lang.nativeLabel}
                  {lang.nativeLabel !== lang.label && (
                    <span className="ml-1 text-xs text-slate-400">({lang.label})</span>
                  )}
                </span>
                {lang.code === (pending ?? current) && <Check className="h-3.5 w-3.5 shrink-0 text-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
