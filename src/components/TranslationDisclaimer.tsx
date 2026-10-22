"use client";

import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { LANGUAGES, type LanguageCode } from "@/data/languages";
import { getStoredLanguage, resetToEnglish } from "@/lib/translation";

export default function TranslationDisclaimer() {
  const [lang, setLang] = useState<LanguageCode>("en");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from storage/cookie on mount
    setLang(getStoredLanguage());
  }, []);

  if (lang === "en") return null;

  const nativeLabel = LANGUAGES.find((l) => l.code === lang)?.nativeLabel ?? lang;

  return (
    <div
      className="notranslate mt-6 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
      translate="no"
    >
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
      <p>
        This page was machine-translated into {nativeLabel}, and automated
        translation can occasionally distort names, dates, or legal details.
        For the exact wording,{" "}
        <button
          type="button"
          onClick={resetToEnglish}
          className="font-semibold underline underline-offset-2 hover:text-amber-700"
        >
          switch back to English
        </button>{" "}
        or check your state legislature&apos;s official records.
      </p>
    </div>
  );
}
