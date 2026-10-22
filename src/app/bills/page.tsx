import { Suspense } from "react";
import { allBills } from "@/data/bills";
import BillsExplorer from "@/components/BillsExplorer";

export const metadata = {
  title: "Bills Explorer | VoteVisible",
  description:
    "Search and filter healthcare legislation across Washington, Oregon, California, Texas, New York, Pennsylvania, Florida, Illinois, Nevada, Arizona, Georgia, and North Carolina.",
};

async function BillsExplorerWithTopic({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; state?: string; status?: string }>;
}) {
  const { topic, state, status } = await searchParams;
  return (
    <BillsExplorer
      bills={allBills}
      initialTopic={topic ?? ""}
      initialState={state ?? ""}
      initialStatus={status ?? ""}
    />
  );
}

export default function BillsPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; state?: string; status?: string }>;
}) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
        Bills Explorer
      </span>
      <h1 className="mt-2 text-3xl font-bold text-navy-900 sm:text-4xl">
        Healthcare legislation, state by state
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        Search {allBills.length} bills from Washington, Oregon, California, Texas,
        New York, Pennsylvania, Florida, Illinois, Nevada, Arizona, Georgia, and
        North Carolina. Filter by state, status, or topic to find the laws that
        affect the resources you care about.
      </p>

      <div className="mt-8">
        <Suspense fallback={<BillsExplorer bills={allBills} />}>
          <BillsExplorerWithTopic searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
