import Link from "next/link";
import { BillStatus, STATUS_META } from "@/data/bills/types";

export default function StatusChart({
  counts,
  total,
}: {
  counts: { status: BillStatus; count: number }[];
  total: number;
}) {
  return (
    <div className="flex flex-col gap-4">
      {counts.map(({ status, count }) => {
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
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-none bg-surface">
              <div
                className="h-full bg-blue-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
