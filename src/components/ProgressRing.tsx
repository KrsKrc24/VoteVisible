"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function ProgressRing({ pct, label }: { pct: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative h-[110px] w-[110px]">
        <svg width="110" height="110" viewBox="0 0 110 110" className="-rotate-90">
          <circle cx="55" cy="55" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
          <motion.circle
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke="#5b93ff"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={inView ? { strokeDashoffset: circumference * (1 - pct / 100) } : {}}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
          {Math.round(pct)}%
        </div>
      </div>
      <div className="max-w-[140px] text-center text-xs text-slate-300">{label}</div>
    </div>
  );
}
