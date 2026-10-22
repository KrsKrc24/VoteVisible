"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

type BillData = Pick<typeof import("@/data/bills"), "allBills" | "filterBills">;

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [billData, setBillData] = useState<BillData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const dataRequest = useRef<Promise<void> | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogId = useId();
  const resultsId = useId();
  const hintId = useId();
  const router = useRouter();

  const loadBills = useCallback(() => {
    if (dataRequest.current) return;
    setLoadError(false);
    // Keep the dataset out of the navbar's eager imports; reuse it after loading.
    dataRequest.current = import("@/data/bills")
      .then(({ allBills, filterBills }) => {
        setBillData({ allBills, filterBills });
      })
      .catch(() => {
        dataRequest.current = null;
        setLoadError(true);
      });
  }, []);

  const openSearch = useCallback(() => {
    setOpen(true);
    loadBills();
  }, [loadBills]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialogRef.current?.open) close();
        else openSearch();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, openSearch]);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    // A native modal keeps focus inside and makes the rest of the page inert.
    dialog.showModal();
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [open]);

  const results = useMemo(() => {
    if (!billData) return [];
    const { allBills, filterBills } = billData;
    const matches = new Set(filterBills(allBills, { query }));
    const stateQuery = query.trim().toLowerCase();
    return allBills
      .filter(
        (bill) =>
          matches.has(bill) ||
          (stateQuery && bill.state.toLowerCase().includes(stateQuery)),
      )
      .slice(0, 8);
  }, [billData, query]);
  const selectedIndex = results.length
    ? Math.min(activeIndex, results.length - 1)
    : -1;

  useEffect(() => {
    if (!open || selectedIndex < 0) return;
    document
      .getElementById(`${resultsId}-${selectedIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, resultsId, selectedIndex]);

  function go(id: string) {
    const href = `/bills/${encodeURIComponent(id)}`;
    close();
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        aria-label="Search bills"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
      >
        <Search size={17} aria-hidden="true" />
        <span className="hidden lg:inline">Search bills</span>
        <kbd
          aria-hidden="true"
          className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-sans text-[10px] lg:inline"
        >
          ⌘ / Ctrl K
        </kbd>
      </button>

      {open &&
        createPortal(
          <dialog
            ref={dialogRef}
            id={dialogId}
            aria-label="Search bills"
            aria-describedby={hintId}
            className="notranslate fixed inset-x-0 top-[min(15vh,6rem)] m-0 mx-auto max-h-[75dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-900/40 backdrop:backdrop-blur-sm"
            translate="no"
            onCancel={(event) => {
              event.preventDefault();
              close();
            }}
            onClose={close}
            onClick={(event) => {
              if (event.target !== event.currentTarget) return;
              const bounds = event.currentTarget.getBoundingClientRect();
              if (
                event.clientX < bounds.left ||
                event.clientX > bounds.right ||
                event.clientY < bounds.top ||
                event.clientY > bounds.bottom
              )
                close();
            }}
          >
            <div className="flex items-center gap-3 border-b border-slate-200 px-4">
              <Search
                size={20}
                className="shrink-0 text-blue-600"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                value={query}
                type="text"
                role="combobox"
                aria-label="Search bills by bill number, title, summary, or state"
                aria-autocomplete="list"
                aria-expanded={true}
                aria-controls={resultsId}
                aria-activedescendant={
                  selectedIndex >= 0
                    ? `${resultsId}-${selectedIndex}`
                    : undefined
                }
                autoComplete="off"
                spellCheck={false}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={(event) => {
                  if (event.nativeEvent.isComposing) return;
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    if (!results.length) return;
                    setActiveIndex((index) =>
                      Math.max(
                        0,
                        Math.min(
                          index + (event.key === "ArrowDown" ? 1 : -1),
                          results.length - 1,
                        ),
                      ),
                    );
                  } else if (event.key === "Enter" && selectedIndex >= 0) {
                    event.preventDefault();
                    go(results[selectedIndex].id);
                  }
                }}
                placeholder="Search bills, keywords, or states…"
                className="min-w-0 flex-1 bg-transparent py-5 text-sm text-slate-900 outline-none placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="px-2 py-2">
              <p className="px-3 py-2 text-xs font-medium text-slate-500">
                {query.trim() ? "Search results" : "Explore bills"}
              </p>
              <div
                id={resultsId}
                role="listbox"
                aria-label="Bills"
                aria-busy={!billData && !loadError}
                className="max-h-[45dvh] overflow-y-auto"
              >
                {results.map((bill, index) => (
                  <button
                    key={bill.id}
                    id={`${resultsId}-${index}`}
                    type="button"
                    role="option"
                    aria-selected={index === selectedIndex}
                    tabIndex={-1}
                    onClick={() => go(bill.id)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex w-full flex-col items-start gap-1 rounded-lg px-3 py-3 text-left transition-colors ${
                      index === selectedIndex
                        ? "bg-blue-50 text-blue-950"
                        : "text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-xs font-semibold tracking-wide text-blue-700">
                      {bill.state} &middot; {bill.billNumber}
                    </span>
                    <span className="text-sm font-medium">{bill.title}</span>
                  </button>
                ))}
              </div>
              {!billData && !loadError && (
                <p
                  role="status"
                  className="px-3 py-8 text-center text-sm text-slate-500"
                >
                  Loading bills…
                </p>
              )}
              {loadError && (
                <div className="px-3 py-8 text-center text-sm text-slate-500">
                  <p role="alert">Bills could not be loaded.</p>
                  <button
                    type="button"
                    onClick={loadBills}
                    className="mt-3 rounded-lg px-3 py-2 font-medium text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    Try again
                  </button>
                </div>
              )}
              {billData && results.length === 0 && (
                <p
                  role="status"
                  className="px-3 py-8 text-center text-sm text-slate-500"
                >
                  No bills match. Try another keyword or state.
                </p>
              )}
            </div>
            <p
              id={hintId}
              className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-500"
            >
              Use ↑ ↓ to browse, Enter to open, and Esc to close.
            </p>
          </dialog>,
          document.body,
        )}
    </>
  );
}
