"use client";

import { useMemo, useState } from "react";
import { Bill, BillStatus, USState, STATUS_META, TOPIC_META } from "@/data/bills/types";
import { filterBills } from "@/data/bills";
import BillCard from "./BillCard";

const STATES: USState[] = ["Washington", "Oregon", "California", "Texas"];
const STATUSES = Object.keys(STATUS_META) as BillStatus[];
const TOPICS = Object.keys(TOPIC_META);

export default function BillsExplorer({
  bills,
  initialTopic = "",
}: {
  bills: Bill[];
  initialTopic?: string;
}) {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<USState | "">("");
  const [status, setStatus] = useState<BillStatus | "">("");
  const [topic, setTopic] = useState<string>(initialTopic);

  const results = useMemo(
    () =>
      filterBills(bills, {
        query: query || undefined,
        state: state || undefined,
        status: status || undefined,
        topic: topic || undefined,
      }),
    [bills, query, state, status, topic]
  );

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by bill number, title, or keyword..."
          className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-navy-900 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
        />
        <div className="flex flex-wrap gap-3">
          <select
            value={state}
            onChange={(e) => setState(e.target.value as USState | "")}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-navy-900 focus:border-teal-400 focus:outline-none"
          >
            <option value="">All states</option>
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as BillStatus | "")}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-navy-900 focus:border-teal-400 focus:outline-none"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_META[s].label}</option>
            ))}
          </select>

          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-navy-900 focus:border-teal-400 focus:outline-none"
          >
            <option value="">All topics</option>
            {TOPICS.map((t) => (
              <option key={t} value={t}>{TOPIC_META[t].label}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-5 text-sm text-slate-500">
        Showing <span className="font-semibold text-navy-900">{results.length}</span> of {bills.length} bills
      </p>

      {results.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
          No bills match your filters. Try broadening your search.
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((bill) => (
            <BillCard key={bill.id} bill={bill} />
          ))}
        </div>
      )}
    </div>
  );
}
