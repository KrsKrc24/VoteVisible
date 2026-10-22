"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Globe2, Loader2, RotateCcw } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import { LANGUAGES, type LanguageCode } from "@/data/languages";
import {
  buildTranslationDocument,
  isReaderMessage,
} from "@/lib/translation-frame";

export default function BillReader({
  title,
  summary,
}: {
  title: string;
  summary: string;
}) {
  const [selection, setSelection] = useState({
    language: "en" as LanguageCode,
    request: 0,
  });
  const [result, setResult] = useState({
    request: -1,
    status: "loading" as "loading" | "ready" | "error",
    height: 260,
  });
  const frame = useRef<HTMLIFrameElement>(null);
  const language =
    LANGUAGES.find((option) => option.code === selection.language) ??
    LANGUAGES[0];
  const translated = selection.language !== "en";
  const status =
    result.request === selection.request ? result.status : "loading";
  const source = useMemo(
    () =>
      translated
        ? buildTranslationDocument({ ...selection, title, summary })
        : "",
    [selection, title, summary, translated],
  );

  useEffect(() => {
    // Migrate old page-wide translator sessions without trusting their persisted language.
    try {
      localStorage.removeItem("votevisible-lang");
    } catch {
      /* Storage may be disabled. */
    }
    const labels = location.hostname.split(".");
    const scopes = [""];
    for (let i = 0; i < labels.length - 1; i++)
      scopes.push(labels.slice(i).join("."), `.${labels.slice(i).join(".")}`);
    for (const domain of scopes)
      document.cookie = `googtrans=; path=/; Max-Age=0${domain ? `; domain=${domain}` : ""}`;
  }, []);

  useEffect(() => {
    if (!translated) return;
    function onMessage(event: MessageEvent) {
      if (
        event.source !== frame.current?.contentWindow ||
        !isReaderMessage(event.data, selection.request, selection.language)
      )
        return;
      const message = event.data;
      const height =
        typeof message.height === "number" && Number.isFinite(message.height)
          ? Math.min(1400, Math.max(180, message.height))
          : 260;
      setResult((previous) => ({
        request: selection.request,
        status: message.status === "resize" ? previous.status : message.status,
        height,
      }));
    }
    window.addEventListener("message", onMessage);
    const timeout = window.setTimeout(
      () =>
        setResult((previous) =>
          previous.request === selection.request && previous.status === "ready"
            ? previous
            : { request: selection.request, status: "error", height: 260 },
        ),
      24000,
    );
    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(timeout);
    };
  }, [selection, translated]);

  function choose(language: LanguageCode) {
    setSelection((previous) => ({ language, request: previous.request + 1 }));
  }

  return (
    <section
      aria-label="Bill reading tools"
      className="notranslate"
      translate="no"
    >
      <h1 className="mt-3 text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-5 text-lg leading-8 text-slate-700">{summary}</p>
      <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50/70 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Globe2 className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="font-semibold text-navy-900">
                Make it make sense. In your language.
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                The English original stays above for reference.
              </p>
            </div>
          </div>
          <LanguageSelector
            current={selection.language}
            loading={translated && status === "loading"}
            onSelect={choose}
          />
        </div>
        {translated && (
          <div className="relative mt-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
              <span>Machine translation by Google · {language.label}</span>
              <button
                type="button"
                className="font-semibold text-blue-700 underline underline-offset-4"
                onClick={() => choose("en")}
              >
                Show English original
              </button>
            </div>
            {status === "loading" && (
              <div
                role="status"
                className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white p-6 text-sm text-slate-600"
              >
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                Preparing {language.nativeLabel}. You can choose another
                language at any time.
              </div>
            )}
            {status === "error" && (
              <div
                role="alert"
                className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900"
              >
                Google could not finish this translation. The original above is
                unchanged.
                <button
                  type="button"
                  onClick={() => choose(selection.language)}
                  className="mt-3 flex items-center gap-2 font-semibold underline"
                >
                  <RotateCcw className="h-4 w-4" />
                  Retry translation
                </button>
              </div>
            )}
            <iframe
              key={selection.request}
              ref={frame}
              title={`${language.label} bill translation`}
              srcDoc={source}
              aria-hidden={status !== "ready"}
              tabIndex={status === "ready" ? 0 : -1}
              sandbox="allow-scripts allow-same-origin"
              referrerPolicy="no-referrer"
              className={
                status === "ready"
                  ? "block w-full rounded-xl border border-blue-100 bg-white p-4"
                  : "pointer-events-none absolute left-0 top-0 h-80 w-full opacity-0"
              }
              style={
                status === "ready" ? { height: result.height + 36 } : undefined
              }
            />
            <p className="mt-3 text-xs leading-5 text-slate-600">
              Automated translations can change names, dates, or legal meaning.
              Verify details against the English original and official
              legislature records.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
