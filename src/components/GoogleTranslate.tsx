"use client";

import Script from "next/script";
import { LANGUAGES } from "@/data/languages";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            autoDisplay: boolean;
          },
          elementId: string
        ) => void;
      };
    };
  }
}

export default function GoogleTranslate() {
  const includedLanguages = LANGUAGES.filter((l) => l.code !== "en")
    .map((l) => l.code)
    .join(",");

  return (
    <>
      <div id="google_translate_element" className="hidden" />
      <Script id="google-translate-init" strategy="afterInteractive">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement(
              { pageLanguage: "en", includedLanguages: "${includedLanguages}", autoDisplay: false },
              "google_translate_element"
            );
          }
        `}
      </Script>
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
