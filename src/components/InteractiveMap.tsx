"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { USState } from "@/data/bills/types";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const TRACKED_STATES: Record<string, USState> = {
  Washington: "Washington",
  Oregon: "Oregon",
  California: "California",
  Texas: "Texas",
  "New York": "New York",
  Pennsylvania: "Pennsylvania",
  Florida: "Florida",
  Illinois: "Illinois",
};

export default function InteractiveMap({
  billCounts,
}: {
  billCounts: Record<USState, number>;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative">
      <ComposableMap projection="geoAlbersUsa" className="w-full">
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = (geo.properties?.name as string | undefined) ?? "";
              const tracked = TRACKED_STATES[name];
              const isHovered = hovered === name;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => tracked && setHovered(name)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => {
                    if (tracked) router.push(`/bills?state=${encodeURIComponent(tracked)}`);
                  }}
                  fill={tracked ? (isHovered ? "#5b93ff" : "#3b7cf9") : "#1a2a4a"}
                  stroke="#0a1328"
                  strokeWidth={0.75}
                  style={{
                    outline: "none",
                    cursor: tracked ? "pointer" : "default",
                    transition: "fill 150ms ease",
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {hovered && TRACKED_STATES[hovered] && (
        <div className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-navy-950 px-4 py-1.5 text-xs font-semibold text-white shadow-lg">
          {hovered} &middot; {billCounts[TRACKED_STATES[hovered]]} bills tracked
        </div>
      )}

      <p className="mt-2 text-center text-xs text-slate-400">
        Click a highlighted state to see its bills
      </p>
    </div>
  );
}
