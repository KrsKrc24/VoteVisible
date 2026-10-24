import Link from "next/link";
import {
  allBills,
  billsByState,
  getBillById,
  getBillStats,
  STATUS_META,
  BillStatus,
} from "@/data/bills";
import IssueFinder from "@/components/IssueFinder";
import InteractiveMap from "@/components/InteractiveMap";
import StatusChart from "@/components/StatusChart";
import StatusBadge from "@/components/StatusBadge";

const readingList = [
  {
    id: "wa-hb-2360",
    question: "Can a school keep a spare inhaler?",
    note: "Washington lets schools keep a shared albuterol supply starting in 2027-28, with rules about who can administer it.",
  },
  {
    id: "tx-hb-1052",
    question: "What if a telehealth visit crosses state lines?",
    note: "Texas sets coverage requirements when the patient or provider is outside the state. Residency and provider requirements still apply.",
  },
  {
    id: "ca-ab-836",
    question: "What does a midwifery workforce bill fund?",
    note: "California calls for a study of midwifery education, subject to an appropriation. That is different from opening new training programs.",
  },
];

export default function Home() {
  const stats = getBillStats();
  const stateCount = Object.keys(billsByState).length;
  const example = getBillById("or-sb-605")!;
  return (
    <div>
      <section className="editorial-hero border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 text-xs text-slate-500">
            <span>VoteVisible / Healthcare legislation</span>
            <span>Founded in Issaquah, Washington</span>
          </div>
          <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <h1 className="editorial-title max-w-2xl text-[clamp(2.8rem,5.5vw,4.5rem)] leading-[1.08] text-navy-900">
                Understand the healthcare bills{" "}
                <em className="text-blue-700">in your state.</em>
              </h1>
              <p className="mt-7 max-w-lg text-base leading-8 text-slate-600">
                What would change? Who would it affect? Has it passed? Start
                with a plain-language summary, then check the official record.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/bills" className="button-primary">
                  Browse the bills
                </Link>
                <a href="#find-your-issue" className="button-secondary">
                  Choose an issue
                </a>
              </div>
              <p className="mt-7 max-w-sm text-xs leading-6 text-slate-500">
                A free project built by students. Read summaries in another
                language, save bills, and find your state representatives.
              </p>
            </div>
            <div>
              <article className="bill-notebook relative border border-blue-200 bg-paper">
                <div className="flex items-center justify-between border-b border-blue-100 px-6 py-4 text-xs">
                  <span className="font-medium text-blue-700">
                    Inside the collection
                  </span>
                  <span className="font-mono text-slate-500">OR / SB 605</span>
                </div>
                <div className="p-6 sm:p-8">
                  <StatusBadge status={example.status} />
                  <h2 className="editorial-title mt-5 text-3xl leading-tight">
                    Keeping medical debt off credit reports.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    Oregon’s SB 605 bars medical providers from reporting
                    medical debt to credit bureaus. It also limits what
                    credit-reporting agencies can include.
                  </p>
                  <div className="my-5 border-t border-slate-300 pt-4">
                    <span className="text-xs font-semibold text-navy-900">
                      What this covers
                    </span>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      The debt is not canceled. The rule changes how it can be
                      reported.
                    </p>
                  </div>
                  <Link
                    href={`/bills/${example.id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 underline decoration-blue-200 underline-offset-4"
                  >
                    Read the summary and source
                  </Link>
                </div>
              </article>
            </div>
          </div>
          <p className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-200 pt-5 text-xs text-slate-500">
            <span>
              <strong className="text-navy-900">{stats.total}</strong> bills in
              this collection
            </span>
            <span>
              <strong className="text-navy-900">{stateCount}</strong> states
              covered
            </span>
            <span>Coverage varies by state. This is not a live feed.</span>
          </p>
        </div>
      </section>

      <section
        id="find-your-issue"
        className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14 sm:px-8 sm:py-20"
      >
        <IssueFinder
          bills={allBills.map(
            ({ id, state, billNumber, title, status, topics }) => ({
              id,
              state,
              billNumber,
              title,
              status,
              topics,
            }),
          )}
        />
      </section>

      <section className="border-y border-slate-200 bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-label">A few examples</p>
              <h2 className="editorial-title mt-3 text-3xl sm:text-4xl">
                The details change the story.
              </h2>
            </div>
            <Link
              href="/bills"
              className="text-sm text-blue-700 underline underline-offset-4"
            >
              All bills
            </Link>
          </div>
          <div className="divide-y divide-slate-200">
            {readingList.map(({ id, question, note }, i) => {
              const bill = getBillById(id)!;
              return (
                <Link
                  key={id}
                  href={`/bills/${id}`}
                  className="reading-row group grid gap-4 py-7 sm:grid-cols-[40px_1fr_1fr_20px] sm:gap-8"
                >
                  <span className="font-mono text-xs text-slate-400">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="mb-2 text-xs text-blue-700">
                      {bill.state} / {bill.billNumber}
                    </p>
                    <h3 className="editorial-title text-2xl leading-tight group-hover:text-blue-700">
                      {question}
                    </h3>
                  </div>
                  <p className="text-sm leading-7 text-slate-600">{note}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="state-atlas"
        className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14 sm:px-8 sm:py-20"
      >
        <div className="mb-7 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="section-label">Browse by location</p>
            <h2 className="editorial-title mt-3 text-3xl sm:text-4xl">
              Find your state.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-600 sm:self-end">
            Select a covered state to see its bills. The totals reflect our
            collection, not everything its legislature has considered.
          </p>
        </div>
        <InteractiveMap
          billCounts={stats.byState}
          billStats={Object.fromEntries(
            Object.entries(billsByState).map(([state, bills]) => [
              state,
              {
                enacted: bills.filter((b) => b.status === "enacted").length,
                unverified: bills.filter(
                  (b) => b.status === "pending-verification",
                ).length,
              },
            ]),
          )}
        />
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 border-t border-slate-200 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="section-label">Reading the record</p>
          <h2 className="editorial-title mt-3 text-3xl sm:text-4xl">
            A bill is not always a law.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-600">
            Check the status before assuming a proposed benefit is available.
            Some entries still need verification. Each bill page keeps the
            recorded status separate from its summary.
          </p>
        </div>
        <StatusChart
          total={stats.total}
          counts={(Object.keys(STATUS_META) as BillStatus[]).map((status) => ({
            status,
            count: allBills.filter((b) => b.status === status).length,
          }))}
        />
      </section>

      <section className="border-t border-blue-200 bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-6 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="editorial-title text-3xl">
              Have a question for your representative?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
              Look up the right office and draft a message about a bill or an
              issue in your community.
            </p>
          </div>
          <Link href="/take-action" className="button-primary w-fit">
            Find your representatives
          </Link>
        </div>
      </section>
    </div>
  );
}
