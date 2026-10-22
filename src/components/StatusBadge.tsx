import { BillStatus, STATUS_META } from "@/data/bills/types";

const COLOR_CLASSES: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  amber: "bg-amber-100 text-amber-800 ring-amber-600/20",
  rose: "bg-rose-100 text-rose-800 ring-rose-600/20",
  sky: "bg-sky-100 text-sky-800 ring-sky-600/20",
  slate: "bg-slate-100 text-slate-700 ring-slate-500/20",
};

export default function StatusBadge({ status }: { status: BillStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${COLOR_CLASSES[meta.color]}`}
    >
      {meta.label}
    </span>
  );
}
