import Link from "next/link";
import { allBills, getBillStats } from "@/data/bills";
import StatCard from "@/components/StatCard";
import BillCard from "@/components/BillCard";

export default function Home() {
  const stats = getBillStats();
  const featured = allBills.filter((b) => b.status === "enacted").slice(0, 6);

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-950">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <span className="inline-flex items-center rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-300">
            Healthcare legislation, translated
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
            See how your state&apos;s laws affect the healthcare you depend on.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Young people across Washington, Oregon, California, and Texas have no
            easy way to understand how healthcare legislation affects the
            hospitals, clinics, and mental health resources they rely on.
            VoteVisible translates real bills into plain language &mdash; and
            gives you a direct line to the people who voted on them.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/bills"
              className="rounded-full bg-teal-400 px-6 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-teal-300"
            >
              Explore the bills
            </Link>
            <Link
              href="/take-action"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-gold-400 hover:text-gold-300"
            >
              Contact your representatives
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard value={`${stats.total}`} label="Bills tracked" />
            <StatCard value={`${stats.enacted}`} label="Signed into law" />
            <StatCard value="4" label="States covered" />
            <StatCard value="18" label="Health topics" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700 font-bold">1</div>
            <h3 className="mt-4 text-lg font-semibold text-navy-900">Real bills, plain language</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Every entry is drawn from real state legislation &mdash; condensed
              into a sentence or two anyone can understand, with status and
              topic tags so you can find what matters to you.
            </p>
          </div>
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700 font-bold">2</div>
            <h3 className="mt-4 text-lg font-semibold text-navy-900">Search &amp; filter by state or topic</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Filter by state, status, or topic &mdash; from reproductive health
              and mental health to drug pricing and rural hospital access.
            </p>
          </div>
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700 font-bold">3</div>
            <h3 className="mt-4 text-lg font-semibold text-navy-900">Take direct action</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Once you know what a bill does, we help you find and message the
              representatives who can act on it.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">
                Recently signed into law
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                A sample of healthcare bills that have already become law.
              </p>
            </div>
            <Link href="/bills" className="hidden shrink-0 text-sm font-semibold text-teal-700 hover:text-teal-800 sm:block">
              View all bills &rarr;
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link href="/bills" className="text-sm font-semibold text-teal-700 hover:text-teal-800">
              View all bills &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="rounded-3xl bg-navy-900 px-8 py-14 text-center sm:px-16">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Your health resources are decided by people you can email today.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300">
            Find your representatives, see what they&apos;ve voted on, and send
            a message about the healthcare issues affecting your community.
          </p>
          <Link
            href="/take-action"
            className="mt-8 inline-flex rounded-full bg-gold-400 px-6 py-3 text-sm font-semibold text-navy-950 hover:bg-gold-300"
          >
            Get started
          </Link>
        </div>
      </section>
    </div>
  );
}
