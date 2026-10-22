import Link from "next/link";
import { notFound } from "next/navigation";
import { allBills, getBillById } from "@/data/bills";
import { TOPIC_META } from "@/data/bills/types";
import StatusBadge from "@/components/StatusBadge";
import BillCard from "@/components/BillCard";

export function generateStaticParams() {
  return allBills.map((bill) => ({ id: bill.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bill = getBillById(id);
  if (!bill) return { title: "Bill not found | VoteVisible" };
  return {
    title: `${bill.billNumber}: ${bill.title} | VoteVisible`,
    description: bill.summary,
  };
}

export default async function BillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bill = getBillById(id);
  if (!bill) notFound();

  const related = allBills
    .filter((b) => b.id !== bill.id && b.topics.some((t) => bill.topics.includes(t)))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <Link href="/bills" className="text-sm font-medium text-blue-700 hover:text-blue-800">
        &larr; Back to all bills
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          {bill.state} &middot; {bill.billNumber} &middot; {bill.year}
        </span>
        <StatusBadge status={bill.status} />
      </div>

      <h1 className="mt-3 text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">
        {bill.title}
      </h1>

      <p className="mt-5 text-lg leading-8 text-slate-700">{bill.summary}</p>

      <dl className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</dt>
          <dd className="mt-1 text-sm text-navy-900">{bill.statusLabel}</dd>
        </div>
        {bill.statusDate && (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status date</dt>
            <dd className="mt-1 text-sm text-navy-900">{bill.statusDate}</dd>
          </div>
        )}
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">State</dt>
          <dd className="mt-1 text-sm text-navy-900">{bill.state}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Session year</dt>
          <dd className="mt-1 text-sm text-navy-900">{bill.year}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Topics</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {bill.topics.map((topic) => (
            <Link
              key={topic}
              href={`/bills?topic=${topic}`}
              className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200"
            >
              {TOPIC_META[topic]?.label ?? topic}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-2xl bg-navy-900 p-6 text-center">
        <h2 className="text-lg font-semibold text-white">
          Want to weigh in on this bill?
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Find your representatives and let them know how this issue affects you.
        </p>
        <Link
          href="/take-action"
          className="mt-4 inline-flex rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-400"
        >
          Contact your representatives
        </Link>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-navy-900">Related bills</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((b) => (
              <BillCard key={b.id} bill={b} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
