"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { allBills } from "@/data/bills";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function close() {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allBills.slice(0, 8);
    return allBills
      .filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.billNumber.toLowerCase().includes(q) ||
          b.summary.toLowerCase().includes(q) ||
          b.state.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query]);

  function go(id: string) {
    close();
    router.push(`/bills/${id}`);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-blue-400/40 hover:text-white sm:flex"
      >
        <span>Search bills</span>
        <kbd className="rounded border border-white/15 px-1.5 py-0.5 font-sans text-[10px]">⌘K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-start justify-center bg-navy-950/70 px-4 pt-24 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 border-b border-slate-200 pr-3">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActiveIndex((i) => Math.max(i - 1, 0));
                    } else if (e.key === "Enter" && results[activeIndex]) {
                      go(results[activeIndex].id);
                    }
                  }}
                  placeholder="Search by bill number, title, or state..."
                  className="w-full px-5 py-4 text-sm text-navy-900 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close search"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto py-2">
                {results.length === 0 && (
                  <p className="px-5 py-6 text-center text-sm text-slate-400">No bills match.</p>
                )}
                {results.map((bill, i) => (
                  <button
                    key={bill.id}
                    onClick={() => go(bill.id)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex w-full flex-col items-start px-5 py-2.5 text-left transition-colors ${
                      i === activeIndex ? "bg-blue-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      {bill.state} &middot; {bill.billNumber}
                    </span>
                    <span className="text-sm font-medium text-navy-900">{bill.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
