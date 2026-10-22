"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bill, TOPIC_META } from "@/data/bills/types";

export default function TopicCloud({ bills }: { bills: Bill[] }) {
  const counts = new Map<string, number>();
  for (const bill of bills) {
    for (const topic of bill.topics) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
    }
  }

  const topics = Object.keys(TOPIC_META)
    .map((topic) => ({ topic, count: counts.get(topic) ?? 0 }))
    .sort((a, b) => b.count - a.count);

  const max = Math.max(...topics.map((t) => t.count), 1);

  return (
    <div className="flex flex-wrap gap-3">
      {topics.map(({ topic, count }, i) => {
        const scale = 0.85 + (count / max) * 0.5;
        return (
          <motion.div
            key={topic}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            whileHover={{ scale: scale * 1.05 }}
            style={{ fontSize: `${scale}rem` }}
          >
            <Link
              href={`/bills?topic=${topic}`}
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 font-medium text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100"
            >
              {TOPIC_META[topic]?.label ?? topic}
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-blue-600">
                {count}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
