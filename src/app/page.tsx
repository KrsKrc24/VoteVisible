import Link from "next/link";
import { allBills, getBillStats } from "@/data/bills";
import StatCard from "@/components/StatCard";
import BillCard from "@/components/BillCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import ScrollReveal from "@/components/ScrollReveal";
import InteractiveMap from "@/components/InteractiveMap";
import TopicCloud from "@/components/TopicCloud";
import StatusChart from "@/components/StatusChart";
import FloatingOrbs from "@/components/FloatingOrbs";
import BillTicker from "@/components/BillTicker";
import WhyItMatters from "@/components/WhyItMatters";
import ProgressRing from "@/components/ProgressRing";

export default function Home() {
  const stats = getBillStats();
  const featured = allBills.filter((b) => b.status === "enacted").slice(0, 6);
  const enactedPct = stats.total > 0 ? (stats.enacted / stats.total) * 100 : 0;

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-950">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <FloatingOrbs />

        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <span className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-300">
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
              className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-400"
            >
              Explore the bills
            </Link>
            <Link
              href="/take-action"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-blue-400 hover:text-blue-300"
            >
              Contact your representatives
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard value={<AnimatedCounter value={stats.total} />} label="Bills tracked" />
            <StatCard value={<AnimatedCounter value={stats.enacted} />} label="Signed into law" />
            <StatCard value={<AnimatedCounter value={4} />} label="States covered" />
            <StatCard value={<AnimatedCounter value={18} />} label="Health topics" />
          </div>
        </div>
      </section>

      <BillTicker bills={featured} />

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-3">
          <ScrollReveal>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold">1</div>
            <h3 className="mt-4 text-lg font-semibold text-navy-900">Real bills, plain language</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Every entry is drawn from real state legislation &mdash; condensed
              into a sentence or two anyone can understand, with status and
              topic tags so you can find what matters to you.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold">2</div>
            <h3 className="mt-4 text-lg font-semibold text-navy-900">Search &amp; filter by state or topic</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Filter by state, status, or topic &mdash; from reproductive health
              and mental health to drug pricing and rural hospital access.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold">3</div>
            <h3 className="mt-4 text-lg font-semibold text-navy-900">Take direct action</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Once you know what a bill does, we help you find and message the
              representatives who can act on it.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy-950 py-20">
        <FloatingOrbs />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <ScrollReveal className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-300">
                Why this matters
              </span>
              <h2 className="mt-2 max-w-xl text-2xl font-bold text-white sm:text-3xl">
                The resources you rely on are decided by laws like these
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-300">
                These aren&apos;t abstract policy debates &mdash; they&apos;re the
                hospitals, counselors, and prescriptions people depend on every day.
              </p>
            </div>
            <ProgressRing pct={enactedPct} label="of tracked bills have been signed into law" />
          </ScrollReveal>

          <div className="mt-10">
            <WhyItMatters bills={allBills} />
          </div>
        </div>
      </section>

      <section className="bg-navy-950 py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <ScrollReveal>
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-300">
              Explore by state
            </span>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Click a state to see what&apos;s moving
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Washington, Oregon, California, and Texas are highlighted &mdash;
              click one to jump straight into its bills.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1} className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-8">
            <InteractiveMap billCounts={stats.byState} />
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-2">
          <ScrollReveal>
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Browse by topic
            </span>
            <h2 className="mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">
              Find the issues that affect you
            </h2>
            <div className="mt-6">
              <TopicCloud bills={allBills} />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Where bills stand
            </span>
            <h2 className="mt-2 text-2xl font-bold text-navy-900 sm:text-3xl">
              Status at a glance
            </h2>
            <div className="mt-6">
              <StatusChart bills={allBills} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <ScrollReveal className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">
                Recently signed into law
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                A sample of healthcare bills that have already become law.
              </p>
            </div>
            <Link href="/bills" className="hidden shrink-0 text-sm font-semibold text-blue-700 hover:text-blue-800 sm:block">
              View all bills &rarr;
            </Link>
          </ScrollReveal>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((bill, i) => (
              <ScrollReveal key={bill.id} delay={Math.min(i * 0.05, 0.3)}>
                <BillCard bill={bill} />
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link href="/bills" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
              View all bills &rarr;
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <ScrollReveal className="rounded-3xl bg-navy-900 px-8 py-14 text-center sm:px-16">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Your health resources are decided by people you can email today.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300">
            Find your representatives, see what they&apos;ve voted on, and send
            a message about the healthcare issues affecting your community.
          </p>
          <Link
            href="/take-action"
            className="mt-8 inline-flex rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-400"
          >
            Get started
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
