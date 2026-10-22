import Link from "next/link";
import { Bill } from "@/data/bills/types";

export default function BillTicker({ bills }: { bills: Bill[] }) {
  const items = [...bills, ...bills];

  return (
    <div className="group relative overflow-hidden border-y border-white/10 bg-navy-900 py-3">
      <div className="animate-marquee flex w-max gap-10 group-hover:[animation-play-state:paused]">
        {items.map((bill, i) => (
          <Link
            key={`${bill.id}-${i}`}
            href={`/bills/${bill.id}`}
            className="flex shrink-0 items-center gap-2 text-sm text-slate-300 transition-colors hover:text-blue-300"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            <span className="font-semibold text-white">{bill.state}</span>
            <span>{bill.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
