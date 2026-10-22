import Link from "next/link";
import { Bill, TOPIC_META } from "@/data/bills/types";
import StatusBadge from "./StatusBadge";

export default function BillCard({ bill }: { bill: Bill }) {
  return (
    <Link
      href={`/bills/${bill.id}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-teal-600">
            {bill.state} &middot; {bill.billNumber}
          </span>
          <h3 className="mt-1 text-base font-semibold text-navy-900 group-hover:text-teal-700">
            {bill.title}
          </h3>
        </div>
        <StatusBadge status={bill.status} />
      </div>

      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{bill.summary}</p>

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
    </Link>
  );
}
