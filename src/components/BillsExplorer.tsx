"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  Bill,
  BillStatus,
  USState,
  STATUS_META,
  TOPIC_META,
} from "@/data/bills/types";
import { filterBills } from "@/data/bills/filters";
import { useSavedBills } from "@/lib/saved-bills";
import BillCard from "./BillCard";
import SaveBillButton from "./SaveBillButton";

const STATUSES = Object.keys(STATUS_META) as BillStatus[];
const TOPICS = Object.keys(TOPIC_META);
const PAGE_SIZE = 18;
type Sort = "title" | "state" | "year";
type ExplorerFilters = {
  query: string;
  state: USState | "";
  status: BillStatus | "";
  topic: string;
  sort: Sort;
  savedOnly: boolean;
};

function readUrlFilters(states: USState[]): ExplorerFilters {
  const params = new URLSearchParams(window.location.search);
  const sort = params.get("sort");
  const topic = params.get("topic") ?? "";
  return {
    query: params.get("q") ?? "",
    state: states.find((value) => value === params.get("state")) ?? "",
    status: STATUSES.find((value) => value === params.get("status")) ?? "",
    topic: TOPICS.includes(topic) ? topic : "",
    sort: sort === "state" || sort === "year" ? sort : "title",
    savedOnly: params.get("saved") === "1",
  };
}

function writeUrlFilters(filters: ExplorerFilters, replace: boolean) {
  const url = new URL(window.location.href);
  const values = {
    q: filters.query,
    state: filters.state,
    status: filters.status,
    topic: filters.topic,
    sort: filters.sort === "title" ? "" : filters.sort,
    saved: filters.savedOnly ? "1" : "",
  };
  for (const [key, value] of Object.entries(values)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  // Preserve unrelated parameters and the hash, and avoid redundant history entries.
  if (url.href !== window.location.href) {
    window.history[replace ? "replaceState" : "pushState"](
      null,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }
}
const controlClass =
  "mt-1.5 min-h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-navy-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";
const buttonClass =
  "min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-navy-900 transition-colors hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-40";

export default function BillsExplorer({
  bills,
  initialTopic = "",
  initialState = "",
  initialStatus = "",
  initialQuery = "",
  initialSort = "title",
  initialSavedOnly = false,
}: {
  bills: Bill[];
  initialTopic?: string;
  initialState?: string;
  initialStatus?: string;
  initialQuery?: string;
  initialSort?: string;
  initialSavedOnly?: boolean;
}) {
  const id = useId();
  const states = useMemo(
    () =>
      [...new Set(bills.map((bill) => bill.state))].sort((a, b) =>
        a.localeCompare(b, "en"),
      ),
    [bills],
  );
  const [filters, setFilters] = useState<ExplorerFilters>(() => ({
    query: initialQuery,
    state: states.find((value) => value === initialState) ?? "",
    status: STATUSES.find((value) => value === initialStatus) ?? "",
    topic: TOPICS.includes(initialTopic) ? initialTopic : "",
    sort:
      initialSort === "year" || initialSort === "state" ? initialSort : "title",
    savedOnly: initialSavedOnly,
  }));
  const { query, state, status, topic, sort, savedOnly } = filters;

  useEffect(() => {
    // Read after hydration so browser-only parameters never cause an SSR mismatch.
    // The URL is authoritative on mount and when navigating back or forward.
    function readLocation() {
      setFilters(readUrlFilters(states));
    }
    readLocation();
    window.addEventListener("popstate", readLocation);
    return () => window.removeEventListener("popstate", readLocation);
  }, [states]);

  function updateFilters(patch: Partial<ExplorerFilters>, replace = false) {
    const next = { ...filters, ...patch };
    setFilters(next);
    writeUrlFilters(next, replace);
  }
  const { ids: savedIds, storageAvailable } = useSavedBills();
  const activeState = states.includes(state as USState) ? state : "";
  const savedCount = bills.filter((bill) => savedIds.includes(bill.id)).length;

  const results = useMemo(() => {
    const matches = filterBills(bills, {
      query: query.trim() || undefined,
      state: activeState || undefined,
      status: status || undefined,
      topic: topic || undefined,
    }).filter((bill) => !savedOnly || savedIds.includes(bill.id));
    const byTitle = (a: Bill, b: Bill) =>
      a.title.localeCompare(b.title, "en") || a.id.localeCompare(b.id, "en");
    return matches.sort((a, b) => {
      if (sort === "state")
        return a.state.localeCompare(b.state, "en") || byTitle(a, b);
      if (sort === "year") return b.year - a.year || byTitle(a, b);
      return byTitle(a, b);
    });
  }, [bills, query, activeState, status, topic, sort, savedOnly, savedIds]);

  // Tie the requested page to the result set, so filtering and unsaving cannot leave a stale page.
  const resultsKey = JSON.stringify([
    query.trim(),
    activeState,
    status,
    topic,
    sort,
    savedOnly,
    results.map((bill) => bill.id),
  ]);
  const [pagination, setPagination] = useState({ key: resultsKey, page: 1 });
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page =
    pagination.key === resultsKey ? Math.min(pagination.page, pageCount) : 1;
  const start = (page - 1) * PAGE_SIZE;
  const visible = results.slice(start, start + PAGE_SIZE);
  const hasFilters = Boolean(
    query || activeState || status || topic || savedOnly,
  );

  function clearFilters() {
    updateFilters({
      query: "",
      state: "",
      status: "",
      topic: "",
      savedOnly: false,
    });
    setPagination({ key: resultsKey, page: 1 });
  }

  return (
    <div className="notranslate" translate="no">
      <section
        aria-label="Find and filter bills"
        className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-navy-900">
              Find legislation
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Search, explore, and save bills that matter to you.
            </p>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasFilters}
            className={buttonClass}
          >
            Clear filters
          </button>
        </div>

        <label
          htmlFor={`${id}-query`}
          className="mt-4 block text-sm font-medium text-navy-900"
        >
          Search bills
          <input
            id={`${id}-query`}
            type="search"
            value={query}
            onChange={(event) =>
              updateFilters({ query: event.target.value }, true)
            }
            placeholder="Bill number, title, or keyword"
            className={controlClass}
          />
        </label>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label
            htmlFor={`${id}-state`}
            className="min-w-0 text-sm font-medium text-navy-900"
          >
            State
            <select
              id={`${id}-state`}
              value={activeState}
              onChange={(event) =>
                updateFilters({ state: event.target.value as USState | "" })
              }
              className={controlClass}
            >
              <option value="">All states</option>
              {states.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label
            htmlFor={`${id}-status`}
            className="min-w-0 text-sm font-medium text-navy-900"
          >
            Status
            <select
              id={`${id}-status`}
              value={status}
              onChange={(event) =>
                updateFilters({ status: event.target.value as BillStatus | "" })
              }
              className={controlClass}
            >
              <option value="">All statuses</option>
              {STATUSES.map((value) => (
                <option key={value} value={value}>
                  {STATUS_META[value].label}
                </option>
              ))}
            </select>
          </label>
          <label
            htmlFor={`${id}-topic`}
            className="min-w-0 text-sm font-medium text-navy-900"
          >
            Topic
            <select
              id={`${id}-topic`}
              value={topic}
              onChange={(event) => updateFilters({ topic: event.target.value })}
              className={controlClass}
            >
              <option value="">All topics</option>
              {TOPICS.map((value) => (
                <option key={value} value={value}>
                  {TOPIC_META[value].label}
                </option>
              ))}
            </select>
          </label>
          <label
            htmlFor={`${id}-sort`}
            className="min-w-0 text-sm font-medium text-navy-900"
          >
            Sort by
            <select
              id={`${id}-sort`}
              value={sort}
              onChange={(event) =>
                updateFilters({ sort: event.target.value as Sort })
              }
              className={controlClass}
            >
              <option value="title">Title: A–Z</option>
              <option value="state">State: A–Z</option>
              <option value="year">Year: newest first</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-blue-50 px-3 py-2">
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium text-navy-900">
            <input
              type="checkbox"
              checked={savedOnly}
              onChange={(event) =>
                updateFilters({ savedOnly: event.target.checked })
              }
              className="h-4 w-4 accent-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            />
            Saved bills only ({savedCount})
          </label>
          <p className="text-xs text-slate-600" role="status">
            {storageAvailable
              ? "Saved on this device · no account needed"
              : "Device storage unavailable. Saves last only for this visit."}
          </p>
        </div>
      </section>

      <p
        className="mt-5 text-sm text-slate-600"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Showing{" "}
        <span className="font-semibold text-navy-900">
          {results.length ? `${start + 1}–${start + visible.length}` : "0"}
        </span>{" "}
        of {results.length} matching bills · {bills.length} bills total
      </p>

      {results.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-blue-200 bg-white px-5 py-12 text-center">
          <h3 className="font-semibold text-navy-900">
            No bills match your filters
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            {savedOnly && savedCount === 0
              ? "Save a bill to keep it handy on this device, or clear filters to explore all bills."
              : "Try another keyword or clear your filters to explore more legislation."}
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className={`${buttonClass} mt-5`}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((bill) => (
            <div
              key={bill.id}
              className="flex min-w-0 flex-col gap-2 rounded-2xl"
            >
              <div className="flex-1 [&>div]:h-full">
                <BillCard bill={bill} />
              </div>
              <div className="flex items-center justify-between gap-2 rounded-xl border border-blue-100 bg-white px-3 py-1">
                <span className="text-xs font-medium text-slate-500">
                  {bill.year} session
                </span>
                <SaveBillButton
                  billId={bill.id}
                  billLabel={`${bill.state} ${bill.billNumber}: ${bill.title}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <nav
          aria-label="Bill results pages"
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPagination({ key: resultsKey, page: page - 1 })}
            className={buttonClass}
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">
            Page <span className="font-semibold text-navy-900">{page}</span> of{" "}
            {pageCount}
          </span>
          <button
            type="button"
            disabled={page === pageCount}
            onClick={() => setPagination({ key: resultsKey, page: page + 1 })}
            className={buttonClass}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
