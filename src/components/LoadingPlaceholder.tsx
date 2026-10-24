/** A visible loading outline for real asynchronous content, with a spoken status. */
export default function LoadingPlaceholder({
  label = "Loading bills",
  kind = "results",
}: {
  label?: string;
  kind?: "results" | "filters" | "summary";
}) {
  return (
    <div
      role="status"
      aria-busy="true"
      className="loading-placeholder border border-slate-300 bg-paper p-5"
    >
      <p className="mb-5 text-sm text-slate-600">{label}</p>
      <div aria-hidden="true" className="space-y-4">
        {kind === "filters" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="h-11 bg-surface" />
            <div className="h-11 bg-surface" />
          </div>
        )}
        <div className="h-4 w-2/3 bg-surface" />
        <div className="h-3 w-full bg-surface" />
        <div className="h-3 w-5/6 bg-surface" />
        {kind !== "summary" && <div className="h-3 w-1/2 bg-surface" />}
      </div>
    </div>
  );
}
