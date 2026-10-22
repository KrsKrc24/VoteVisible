"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { BillStatus, STATUS_META } from "@/data/bills/types";

const BAR_COLORS: Record<BillStatus, string> = {
  enacted: "bg-emerald-500",
  "partial-progress": "bg-amber-500",
  "did-not-pass": "bg-rose-500",
  introduced: "bg-sky-500",
  vetoed: "bg-orange-500",
  "pending-verification": "bg-slate-400",
};

export default function StatusChart({
  counts,
  total,
}: {
  counts: { status: BillStatus; count: number }[];
  total: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-4">
      {counts.map(({ status, count }, i) => {
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <Link
            key={status}
            href={`/bills?status=${status}`}
            className="group block"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-navy-900 group-hover:text-blue-700">
                {STATUS_META[status].label}
              </span>
              <span className="text-slate-500">{count} bills</span>
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className={`h-full rounded-full ${BAR_COLORS[status]}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{
                  duration: reduceMotion ? 0 : 0.8,
                  delay: reduceMotion ? 0 : i * 0.08,
                  ease: "easeOut",
                }}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
