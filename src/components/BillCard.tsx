import Link from "next/link";
import { Bill, TOPIC_META } from "@/data/bills/types";
import StatusBadge from "./StatusBadge";

export default function BillCard({ bill }: { bill: Bill }) {
  return (
    <div>
      <Link
        href={`/bills/${bill.id}`}
        prefetch={false}
        className="group flex h-full flex-col rounded-none border border-slate-200 bg-paper p-5  hover:border-blue-300"
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

        <p className="mt-3 line-clamp-4 max-w-3xl flex-1 text-sm leading-6 text-slate-600">
          {bill.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {bill.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="rounded-none bg-surface px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {TOPIC_META[topic]?.label ?? topic}
            </span>
          ))}
        </div>
        <span className="mt-5 text-xs font-semibold text-blue-700">
          Read full summary &rarr;
        </span>
      </Link>
    </div>
  );
}
