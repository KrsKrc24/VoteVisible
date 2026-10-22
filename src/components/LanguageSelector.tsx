"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { LANGUAGES, type LanguageCode } from "@/data/languages";

function getCurrentLanguage(): LanguageCode {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
  const code = match?.[1];
  return (LANGUAGES.find((l) => l.code === code)?.code as LanguageCode) ?? "en";
}

function setLanguage(code: LanguageCode) {
  const value = code === "en" ? "/en/en" : `/en/${code}`;
  document.cookie = `googtrans=${value}; path=/`;
  document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname}`;
  window.location.reload();
}

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<LanguageCode>("en");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the googtrans cookie on mount
    setCurrent(getCurrentLanguage());
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const currentOption = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

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
        <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
          {LANGUAGES.map((lang) => (
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
              {lang.code === current && <Check className="h-3.5 w-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
