"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Pill,
  HeartPulse,
  ShieldCheck,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { Bill, TOPIC_META } from "@/data/bills/types";
import StatusBadge from "./StatusBadge";

const interests = [
  { id: "mental-health", icon: Brain, label: "Mental health" },
  { id: "drug-pricing", icon: Pill, label: "Prescription costs" },
  {
    id: "insurance-coverage",
    icon: ShieldCheck,
    label: "Insurance & coverage",
  },
  {
    id: "youth-school-health",
    icon: GraduationCap,
    label: "School & youth health",
  },
  { id: "maternal-health", icon: HeartPulse, label: "Maternal care" },
];

export default function IssueFinder({
  bills,
}: {
  bills: Pick<
    Bill,
    "id" | "state" | "billNumber" | "title" | "status" | "topics"
  >[];
}) {
  const [topic, setTopic] = useState("mental-health");
  const [state, setState] = useState("");
  const states = useMemo(
    () => [...new Set(bills.map((b) => b.state))].sort(),
    [bills],
  );
  const matches = useMemo(
    () =>
      bills.filter(
        (b) => b.topics.includes(topic) && (!state || b.state === state),
      ),
    [bills, state, topic],
  );
  const href = `/bills?topic=${topic}${state ? `&state=${encodeURIComponent(state)}` : ""}`;
  return (
    <div
      className="notranslate issue-finder border-t-2 border-blue-700 bg-transparent pt-7"
      translate="no"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div>
          <span className="section-label">Browse by topic</span>
          <h2 className="editorial-title mt-4 text-3xl sm:text-4xl">
            Which issue are you following?
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">
            Choose a topic and a state to see matching bills.
          </p>
          <div
            className="mt-6 flex flex-wrap gap-2"
            role="group"
            aria-label="Choose a healthcare interest"
          >
            {interests.map(({ id, icon: Icon, label }) => (
              <button
                type="button"
                key={id}
                aria-pressed={topic === id}
                onClick={() => setTopic(id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-3 text-xs font-medium transition-colors ${topic === id ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"}`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
          <label className="mt-7 flex max-w-xs items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm">
            <MapPin size={17} className="shrink-0 text-blue-600" />
            <span className="sr-only">Choose your state</span>
            <select
              aria-label="Choose your state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full min-w-0 bg-transparent"
            >
              <option value="">Across all covered states</option>
              {states.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="rounded-2xl bg-blue-50/70 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 border-b border-blue-100 pb-4">
            <div>
              <p className="text-xs text-slate-500">Matching records</p>
              <h3 className="mt-1 font-semibold">{TOPIC_META[topic].label}</h3>
            </div>
            <span
              aria-live="polite"
              className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-blue-700"
            >
              {matches.length} bills
            </span>
          </div>
          <div className="mt-3 min-h-48">
            {matches.slice(0, 2).map((b) => (
              <Link
                key={b.id}
                href={`/bills/${b.id}`}
                className="group my-3 block rounded-xl border border-blue-100 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                    {b.state} · {b.billNumber}
                  </span>
                  <StatusBadge status={b.status} />
                </div>
                <p className="text-sm font-medium leading-6 group-hover:text-blue-700">
                  {b.title}
                </p>
              </Link>
            ))}
            {!matches.length && (
              <p className="py-10 text-sm leading-7 text-slate-500">
                We don’t have a matching bill in this state yet. Try another
                issue or view all covered states.
              </p>
            )}
          </div>
          <Link
            href={href}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700"
          >
            See all matching bills <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
