import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Globe2,
  MessageSquare,
  HeartPulse,
  Languages,
  MoveDown,
} from "lucide-react";
import {
  allBills,
  getBillStats,
  billsByState,
  TOPIC_META,
  STATUS_META,
  BillStatus,
} from "@/data/bills";
import { LANGUAGES } from "@/data/languages";
import BillCard from "@/components/BillCard";
import ScrollReveal from "@/components/ScrollReveal";
import InteractiveMap from "@/components/InteractiveMap";
import StatusChart from "@/components/StatusChart";
import CivicGraphic from "@/components/CivicGraphic";
import IssueFinder from "@/components/IssueFinder";

export default function Home() {
  const stats = getBillStats();
  const featured = Object.values(billsByState)
    .flatMap((bills) => bills.find((b) => b.status === "enacted") ?? [])
    .slice(0, 6);
  const stateCount = Object.keys(stats.byState).length;
  const steps = [
    {
      icon: BookOpen,
      num: "01",
      title: "Understand the bill.",
      text: "Skip the legal jargon. Read a short summary, check its recorded status, and see the issues it touches.",
    },
    {
      icon: Languages,
      num: "02",
      title: "Read it your way.",
      text: "Choose a language on any bill page. Machine translation helps you get started; the English summary stays your reference.",
    },
    {
      icon: MessageSquare,
      num: "03",
      title: "Make yourself heard.",
      text: "Find your state representatives and use our message guide to tell them why an issue matters to you.",
    },
  ];
  return (
    <div>
      <section className="hero-section relative overflow-hidden">
        <div className="hero-grid" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 pb-12 pt-14 sm:px-8 sm:pt-20 md:grid-cols-[1.05fr_1fr] md:gap-0 lg:pb-16">
          <div className="relative z-10">
            <span className="eyebrow inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              CIVIC KNOWLEDGE. EVERYDAY POWER.
            </span>
            <h1 className="mt-6 max-w-xl text-[clamp(3.1rem,6.2vw,5.1rem)] font-semibold leading-[1.04] tracking-[-0.065em]">
              Big decisions.
              <br />
              Real lives.
              <br />
              <span className="text-blue-600">Your voice.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-8 text-slate-600">
              Healthcare laws shape the care you get, the costs you pay, and the
              places you turn to for help. Let’s make them easier to understand.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/bills" className="button-primary">
                Explore the bills <ArrowUpRight size={18} />
              </Link>
              <a href="#find-your-issue" className="button-secondary">
                Find my starting point <ArrowRight size={16} />
              </a>
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-slate-500">
              <Globe2 size={14} /> Student-built. Free to explore. For every
              background.
            </p>
          </div>
          <CivicGraphic />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid grid-cols-2 divide-x divide-blue-100 border-t border-blue-100 py-7 sm:grid-cols-4">
            {[
              [stats.total, "Bills in the collection"],
              [stateCount, "States to explore"],
              [Object.keys(TOPIC_META).length, "Healthcare topics"],
              [LANGUAGES.length, "Language choices"],
            ].map(([value, label]) => (
              <div key={label} className="px-3 py-3 first:pl-0 sm:px-7">
                <div className="text-3xl font-semibold tracking-tight text-navy-900 tabular-nums">
                  {value}
                </div>
                <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="find-your-issue"
        className="scroll-mt-24 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24"
      >
        <ScrollReveal>
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
        </ScrollReveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mb-10 flex items-center gap-4">
          <span className="eyebrow">FROM CONFUSING TO CLEAR</span>
          <div className="h-px flex-1 bg-slate-200" />
          <MoveDown size={16} className="text-blue-600" />
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map(({ icon: Icon, num, title, text }, i) => (
            <ScrollReveal key={num} delay={i * 0.08}>
              <div className="flex items-center justify-between">
                <Icon size={26} strokeWidth={1.5} className="text-blue-600" />
                <span className="font-mono text-xs text-slate-400">
                  {num} /
                </span>
              </div>
              <h2 className="mt-6 text-xl font-semibold tracking-tight">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">{text}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="overflow-hidden bg-navy-900 text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <ScrollReveal>
            <span className="eyebrow !text-blue-300">WHY THIS MATTERS</span>
            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              Policy isn’t distant. <br />
              <span className="text-blue-300">It’s personal.</span>
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-8 text-slate-300">
              A counselor at school. A prescription you can afford. A clinic
              close to home. State legislation can shape all of them.
            </p>
            <Link
              href="/about"
              className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-blue-200"
            >
              The reason we built VoteVisible <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              {
                title: "A place to turn",
                topic: "mental-health",
                caption: "Counselors, crisis care & treatment",
                symbol: "✳",
              },
              {
                title: "Care within reach",
                topic: "rural-health",
                caption: "Local hospitals & rural access",
                symbol: "+",
              },
              {
                title: "Room to breathe",
                topic: "drug-pricing",
                caption: "Prescriptions & affordability",
                symbol: "↗",
              },
              {
                title: "A healthier start",
                topic: "maternal-health",
                caption: "Pregnancy, birth & family care",
                symbol: "♡",
              },
            ].map(({ title, topic, caption, symbol }, i) => (
              <Link
                key={topic}
                href={`/bills?topic=${topic}`}
                className={`impact-tile group ${i === 0 || i === 3 ? "bg-blue-600" : "bg-white/5"}`}
              >
                <span aria-hidden="true" className="impact-symbol">
                  {symbol}
                </span>
                <div className="relative">
                  <p className="text-base font-medium">{title}</p>
                  <p className="mt-2 text-xs leading-5 text-blue-100/80">
                    {caption}
                  </p>
                  <p className="mt-6 inline-flex items-center gap-2 text-xs font-medium">
                    {allBills.filter((b) => b.topics.includes(topic)).length}{" "}
                    bills in collection{" "}
                    <ArrowUpRight
                      size={13}
                      className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="state-atlas"
        className="scroll-mt-24 mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24"
      >
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">THE STATE ATLAS</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Different states. Shared stakes.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-7 text-slate-500">
            Select a state to explore our collection and see where its tracked
            bills stand.
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

      <section className="border-y border-slate-200 bg-white py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <span className="eyebrow">A CLEARER PICTURE</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Follow the status. <br />
              Understand the stakes.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-500">
              These counts describe our tracked collection, not every bill in a
              state. A proposal is not a law, and some records still need
              verification.
            </p>
            <Link
              href="/bills"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700"
            >
              Explore every status <ArrowRight size={16} />
            </Link>
          </div>
          <StatusChart
            total={stats.total}
            counts={(Object.keys(STATUS_META) as BillStatus[]).map(
              (status) => ({
                status,
                count: allBills.filter((b) => b.status === status).length,
              }),
            )}
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">IN THE COLLECTION</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              A closer look at enacted bills.
            </h2>
          </div>
          <Link
            href="/bills?status=enacted"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700"
          >
            View enacted bills <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((bill) => (
            <BillCard key={bill.id} bill={bill} />
          ))}
        </div>
      </section>

      <section className="mx-auto mb-20 max-w-6xl px-5 sm:px-8">
        <div className="action-banner relative overflow-hidden rounded-[2rem] bg-blue-600 p-8 text-white sm:p-14">
          <HeartPulse
            className="absolute -right-5 -top-10 h-72 w-72 rotate-12 text-white/10"
            strokeWidth={0.5}
            aria-hidden="true"
          />
          <div className="relative max-w-xl">
            <span className="eyebrow !text-blue-100">
              KNOWLEDGE IS A STARTING POINT
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
              Your voice belongs <br />
              in the conversation.
            </h2>
            <p className="mt-5 text-sm leading-7 text-blue-100">
              Find the people who represent you. Tell them what access to
              healthcare means in your life.
            </p>
            <Link
              href="/take-action"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-blue-700 transition-transform hover:-translate-y-1"
            >
              Find your representatives <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
