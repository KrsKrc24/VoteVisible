"use client";
import Link from "next/link";
import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { USState } from "@/data/bills/types";

export default function InteractiveMap({
  billCounts,
  billStats,
}: {
  billCounts: Record<USState, number>;
  billStats?: Record<string, { enacted: number; unverified: number }>;
}) {
  const [selected, setSelected] = useState<USState>("Washington");
  const [hovered, setHovered] = useState<string | null>(null);
  const states = (Object.keys(billCounts) as USState[]).sort();
  const detail = billStats?.[selected];
  return (
    <div
      className="notranslate grid overflow-hidden rounded-none border border-blue-100 bg-paper lg:grid-cols-[1fr_300px]"
      translate="no"
    >
      <div className="relative min-w-0 bg-surface p-3 sm:p-6">
        <div className="absolute left-6 top-6 z-10 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-blue-700">
          <span className="h-2 w-2 rounded-none bg-blue-600" /> Collection
          coverage
        </div>
        <ComposableMap
          projection="geoAlbersUsa"
          className="w-full"
          aria-label="Select a covered US state"
        >
          <Geographies geography="/us-states.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = String(geo.properties?.name ?? "");
                const tracked = states.includes(name as USState);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    role={tracked ? "button" : undefined}
                    tabIndex={tracked ? 0 : -1}
                    aria-label={
                      tracked
                        ? `${name}, ${billCounts[name as USState]} tracked bills`
                        : undefined
                    }
                    aria-pressed={tracked ? selected === name : undefined}
                    onMouseEnter={() => setHovered(tracked ? name : null)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(tracked ? name : null)}
                    onBlur={() => setHovered(null)}
                    onClick={() => tracked && setSelected(name as USState)}
                    onKeyDown={(e) => {
                      if (tracked && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        setSelected(name as USState);
                      }
                    }}
                    fill={
                      name === selected
                        ? "#1c3d67"
                        : hovered === name
                          ? "#6c8199"
                          : tracked
                            ? "#426a98"
                            : "#cdd3cd"
                    }
                    stroke="#e3e6e0"
                    strokeWidth={1.5}
                    className={
                      tracked
                        ? "cursor-pointer  focus:stroke-blue-900 focus:stroke-[3]"
                        : ""
                    }
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        <p
          aria-live="polite"
          className="absolute bottom-4 left-6 text-xs text-slate-500"
        >
          {hovered
            ? `${hovered} · ${billCounts[hovered as USState]} bills`
            : "Select a blue state, or use the list below."}
        </p>
      </div>
      <div className="flex flex-col p-6 sm:p-7">
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          YOUR SELECTED STATE
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">
          {selected}
        </h3>
        <div aria-live="polite" className="mt-6">
          <div className="text-5xl font-semibold tracking-tight text-blue-600 tabular-nums">
            {billCounts[selected]}
          </div>
          <p className="mt-1 text-xs text-slate-500">bills in our collection</p>
          {detail && (
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt>Recorded as enacted</dt>
                <dd className="font-semibold">{detail.enacted}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Needs verification</dt>
                <dd className="font-semibold">{detail.unverified}</dd>
              </div>
            </dl>
          )}
        </div>
        <Link
          href={`/bills?state=${encodeURIComponent(selected)}`}
          className="button-primary mt-8 justify-center text-xs"
        >
          Explore {selected}
        </Link>
        <p className="mt-4 text-[11px] leading-5 text-slate-400">
          A selected collection of healthcare bills. Coverage varies by state.
        </p>
      </div>
      <div
        className="flex flex-wrap gap-2 border-t border-slate-100 p-5 lg:col-span-2"
        role="group"
        aria-label="Select a covered state"
      >
        {states.map((state) => (
          <button
            key={state}
            type="button"
            aria-pressed={state === selected}
            onClick={() => setSelected(state)}
            className={`rounded-none border px-3 py-2 text-xs  ${state === selected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 text-slate-600 hover:border-blue-300"}`}
          >
            {state}
          </button>
        ))}
      </div>
    </div>
  );
}
