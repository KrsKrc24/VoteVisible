"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Hospital, Brain, Pill, HeartHandshake } from "lucide-react";
import { Bill } from "@/data/bills/types";

const ITEMS = [
  {
    topic: "hospital-oversight",
    icon: Hospital,
    title: "Rural hospitals & clinics",
    blurb: "Keeping emergency rooms open and clinics funded in the communities that need them most.",
  },
  {
    topic: "mental-health",
    icon: Brain,
    title: "Mental health access",
    blurb: "Expanding school counselors, crisis lines, and treatment coverage for young people.",
  },
  {
    topic: "drug-pricing",
    icon: Pill,
    title: "Affordable prescriptions",
    blurb: "Capping insulin costs and cracking down on surprise drug pricing.",
  },
  {
    topic: "maternal-health",
    icon: HeartHandshake,
    title: "Maternal & reproductive care",
    blurb: "Protecting access to care during pregnancy and beyond.",
  },
];

export default function WhyItMatters({ bills }: { bills: Bill[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {ITEMS.map(({ topic, icon: Icon, title, blurb }, i) => {
        const count = bills.filter((b) => b.topics.includes(topic)).length;
        return (
          <motion.div
            key={topic}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ y: -6 }}
          >
            <Link
              href={`/bills?topic=${topic}`}
              className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-blue-400/40 hover:bg-white/[0.07]"
            >
              <Icon className="h-8 w-8 text-blue-400" strokeWidth={1.75} />
              <div className="mt-4 text-3xl font-bold text-white">{count}</div>
              <h3 className="mt-1 text-sm font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{blurb}</p>
              <span className="mt-4 text-xs font-semibold text-blue-300 opacity-0 transition-opacity group-hover:opacity-100">
                See the bills &rarr;
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
