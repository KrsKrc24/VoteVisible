import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import { Suspense } from "react";
import { connection } from "next/server";
import { getReleasedBills, getReleasedBillsByState } from "@/data/bills";
import BillsExplorer from "@/components/BillsExplorer";

// This page reads the release schedule (real-world date) outside any
// Suspense boundary, so render the whole route per-request instead of
// trying to statically prerender or stream it.
export const instant = false;

export const metadata = {
  title: "Bills Explorer | VoteVisible",
  description:
    "Search and filter healthcare legislation across Washington, Oregon, California, Texas, New York, Pennsylvania, Florida, Illinois, Nevada, Arizona, Georgia, and North Carolina.",
};

async function BillsExplorerWithTopic({
  searchParams,
}: {
  searchParams: Promise<{
    topic?: string;
    state?: string;
    status?: string;
    q?: string;
    sort?: string;
    saved?: string;
  }>;
}) {
  const { topic, state, status, q, sort, saved } = await searchParams;
  return (
    <BillsExplorer
      bills={getReleasedBills()}
      initialTopic={topic ?? ""}
      initialState={state ?? ""}
      initialStatus={status ?? ""}
      initialQuery={typeof q === "string" ? q : ""}
      initialSort={typeof sort === "string" ? sort : ""}
      initialSavedOnly={saved === "1"}
    />
  );
}

export default async function BillsPage({
  searchParams,
}: {
  searchParams: Promise<{
    topic?: string;
    state?: string;
    status?: string;
    q?: string;
    sort?: string;
    saved?: string;
  }>;
}) {
  // Bill/state counts depend on the release schedule, which unlocks states
  // by real-world date — opt out of static caching so a newly released
  // state appears without a redeploy.
  await connection();
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
        Bills Explorer
      </span>
      <h1 className="mt-2 text-3xl font-bold text-navy-900 sm:text-4xl">
        Healthcare legislation, state by state
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        Explore {getReleasedBills().length} healthcare bills across{" "}
        {Object.keys(getReleasedBillsByState()).length} states. Search, filter, and save the
        issues that matter to you. Open any bill for a plain-language summary
        and language reader.
      </p>

      <div className="mt-8">
        <Suspense
          fallback={
            <LoadingPlaceholder kind="filters" label="Loading bill filters" />
          }
        >
          <BillsExplorerWithTopic searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
