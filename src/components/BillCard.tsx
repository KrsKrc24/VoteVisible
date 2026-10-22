"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Bill, TOPIC_META } from "@/data/bills/types";
import StatusBadge from "./StatusBadge";

export default function BillCard({ bill }: { bill: Bill }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link
        href={`/bills/${bill.id}`}
        prefetch={false}
        className="group flex h-full flex-col rounded-md border border-slate-200 bg-white p-5 transition-colors hover:border-blue-300"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              {bill.state} &middot; {bill.billNumber}
            </span>
            <h3 className="mt-1 text-base font-semibold text-navy-900 group-hover:text-blue-700">
              {bill.title}
            </h3>
          </div>
          <StatusBadge status={bill.status} />
        </div>

        <p className="mt-3 line-clamp-4 flex-1 text-sm leading-6 text-slate-600">
          {bill.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {bill.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {TOPIC_META[topic]?.label ?? topic}
            </span>
          ))}
        </div>
        <span className="mt-5 text-xs font-semibold text-blue-700">
          Read full summary &rarr;
        </span>
      </Link>
    </motion.div>
  );
}
