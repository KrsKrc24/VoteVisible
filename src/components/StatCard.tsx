import { ReactNode } from "react";

export default function StatCard({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
      <div className="text-3xl font-bold text-white sm:text-4xl">{value}</div>
      <div className="mt-2 text-sm text-slate-300">{label}</div>
    </div>
  );
}
