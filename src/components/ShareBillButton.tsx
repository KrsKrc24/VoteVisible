"use client";
import { useState } from "react";
export default function ShareBillButton() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setError("");
    } catch {
      setError("Copy the link from your browser’s address bar.");
    }
  }
  return (
    <div translate="no" className="notranslate">
      <button
        type="button"
        onClick={share}
        className="inline-flex min-h-10 items-center gap-2 rounded-none border border-slate-200 bg-paper px-4 text-xs font-medium text-slate-600"
      >
        {copied ? "Link copied" : "Share this bill"}
      </button>
      <span role="status" className="mt-1 block text-xs text-slate-500">
        {error}
      </span>
    </div>
  );
}
