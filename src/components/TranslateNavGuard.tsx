"use client";

import { useEffect } from "react";

function isTranslated(): boolean {
  return /googtrans=\/(?:en|auto)\/(?!en\b)[a-zA-Z-]+/.test(document.cookie);
}

/**
 * Google Translate rewrites live DOM text nodes. Next.js client-side
 * routing then swaps page content without reloading the document, which
 * can crash React's reconciler (NotFoundError: removeChild) when it tries
 * to remove nodes Google already restructured. Forcing a real navigation
 * while a translation is active sidesteps that conflict entirely.
 */
export default function TranslateNavGuard() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!isTranslated()) return;
      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#") || anchor.target === "_blank") {
        return;
      }
      e.preventDefault();
      e.stopImmediatePropagation();
      window.location.href = href;
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
