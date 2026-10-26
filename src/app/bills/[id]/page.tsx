import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allBills, getBillById, isStateReleased } from "@/data/bills";
import { TOPIC_META } from "@/data/bills/types";
import StatusBadge from "@/components/StatusBadge";
import BillCard from "@/components/BillCard";
import SaveBillButton from "@/components/SaveBillButton";
import ShareBillButton from "@/components/ShareBillButton";
import BillReader from "@/components/BillReader";

// Frozen once at build time (module load), not re-read per request. This
// keeps every bill page statically prerenderable — reading the real clock
// inside the component itself would force all 548+ pages to render
// per-request, which is too slow to ship. The trade-off: a newly released
// state's bill pages go live on the next deploy, not the instant the date
// turns. The homepage/bills/take-action listings don't have this limit —
// they gate live by real-world date (see their `instant = false`) — so
// this only affects someone guessing a not-yet-public bill's direct URL.
const RELEASED_BILL_IDS = new Set(
  allBills.filter((bill) => isStateReleased(bill.state)).map((bill) => bill.id),
);

export function generateStaticParams() {
  return [...RELEASED_BILL_IDS].map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bill = getBillById(id);
  if (!bill) return { title: "Bill not found | VoteVisible" };
  return {
    title: `${bill.billNumber}: ${bill.title} | VoteVisible`,
    description: bill.summary,
  };
}

async function BillDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bill = getBillById(id);
  if (!bill || !RELEASED_BILL_IDS.has(bill.id)) notFound();

  const related = allBills
    .filter(
      (b) =>
        b.id !== bill.id &&
        RELEASED_BILL_IDS.has(b.id) &&
        b.topics.some((t) => bill.topics.includes(t)),
    )
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/bills"
          className="text-sm font-medium text-blue-700 hover:text-blue-800"
        >
          &larr; Back to all bills
        </Link>
      </div>

      <div
        className="notranslate mt-5 flex flex-wrap items-center gap-3"
        translate="no"
      >
        <SaveBillButton
          billId={bill.id}
          billLabel={`${bill.state} ${bill.billNumber}`}
        />
        <ShareBillButton key={bill.id} />
      </div>

      <div
        translate="no"
        className="notranslate mt-6 flex flex-wrap items-center gap-3"
      >
        <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          {bill.state} &middot; {bill.billNumber} &middot; {bill.year}
        </span>
        <StatusBadge status={bill.status} />
      </div>

      <BillReader key={bill.id} title={bill.title} summary={bill.summary} />

      <dl
        translate="no"
        className="notranslate mt-8 grid gap-4 rounded-none border border-slate-200 bg-paper p-6 sm:grid-cols-2"
      >
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Status
          </dt>
          <dd className="mt-1 text-sm text-navy-900">{bill.statusLabel}</dd>
        </div>
        {bill.statusDate && (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status date
            </dt>
            <dd className="mt-1 text-sm text-navy-900">{bill.statusDate}</dd>
          </div>
        )}
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            State
          </dt>
          <dd className="mt-1 text-sm text-navy-900">{bill.state}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Session year
          </dt>
          <dd className="mt-1 text-sm text-navy-900">{bill.year}</dd>
        </div>
      </dl>

      {bill.sources && bill.sources.length > 0 && (
        <section
          aria-label="Sources for this summary"
          className="mt-8 border-y border-slate-200 py-6"
        >
          <h2 className="text-sm font-semibold text-navy-900">
            Sources for this summary
          </h2>
          <ul className="mt-3 space-y-2">
            {bill.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-700 underline underline-offset-4"
                >
                  {source.title}{" "}
                  <span className="text-xs">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          {bill.summaryReviewedOn && (
            <p className="mt-3 text-xs text-slate-500">
              Summary source reviewed {bill.summaryReviewedOn}. Check the
              official record for later changes.
            </p>
          )}
        </section>
      )}

      <div className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Topics
        </h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {bill.topics.map((topic) => (
            <Link
              key={topic}
              href={`/bills?topic=${topic}`}
              className="rounded-none bg-surface px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-surface"
            >
              {TOPIC_META[topic]?.label ?? topic}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-none bg-navy-900 p-6 text-center">
        <h2 className="text-lg font-semibold text-white">
          Want to weigh in on this bill?
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Find your representatives and let them know how this issue affects
          you.
        </p>
        <Link
          href="/take-action"
          className="mt-4 inline-flex rounded-none bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-400"
        >
          Contact your representatives
        </Link>
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-navy-900">Related bills</h2>
          <div className="mt-4 space-y-4">
            {related.map((b) => (
              <BillCard key={b.id} bill={b} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-5 py-12">
          <LoadingPlaceholder kind="summary" label="Loading bill details" />
        </div>
      }
    >
      <BillDetailContent params={params} />
    </Suspense>
  );
}
