"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Globe, Check, ChevronDown, Loader2, Search } from "lucide-react";
import { LANGUAGES, type LanguageCode } from "@/data/languages";

// Selection belongs to the reader, never to Google's cookies or mutable DOM.
export default function LanguageSelector({
  current,
  loading,
  onSelect,
}: {
  current: LanguageCode;
  loading: boolean;
  onSelect: (code: LanguageCode) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const menuId = useId();
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

  const currentOption =
    LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter(
      (l) =>
        l.label.toLowerCase().includes(q) ||
        l.nativeLabel.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div
      ref={ref}
      className="relative notranslate"
      translate="no"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          setQuery("");
          toggle.current?.focus();
        }
      }}
    >
      <button
        ref={toggle}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 disabled:cursor-wait disabled:opacity-70"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label="Choose reading language"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Globe className="h-3.5 w-3.5" />
        )}
        <span>
          {loading
            ? `Loading ${currentOption.nativeLabel}…`
            : `Read in ${currentOption.nativeLabel}`}
        </span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div
          id={menuId}
          className="absolute left-0 right-auto z-20 mt-2 w-64 sm:left-auto sm:right-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
        >
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search languages"
              placeholder="Search languages..."
              className="w-full text-sm text-navy-900 outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <p className="px-3.5 py-4 text-center text-sm text-slate-400">
                No languages match.
              </p>
            )}
            {filtered.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  onSelect(lang.code);
                  setOpen(false);
                  setQuery("");
                  toggle.current?.focus();
                }}
                className="flex w-full items-center justify-between px-3.5 py-2 text-left text-sm text-navy-900 hover:bg-blue-50 disabled:cursor-wait disabled:opacity-60"
              >
                <span>
                  {lang.nativeLabel}
                  {lang.nativeLabel !== lang.label && (
                    <span className="ml-1 text-xs text-slate-400">
                      ({lang.label})
                    </span>
                  )}
                </span>
                {lang.code === current && (
                  <Check className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
