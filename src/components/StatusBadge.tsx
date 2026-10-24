import { BillStatus, STATUS_META } from "@/data/bills/types";

export default function StatusBadge({ status }: { status: BillStatus }) {
  return (
    <span className="inline-flex shrink-0 border border-slate-400 px-2 py-1 text-xs font-medium text-slate-700">
      {STATUS_META[status].label}
    </span>
  );
}
