"use client";

import { toggleSavedBill, useSavedBills } from "@/lib/saved-bills";

export default function SaveBillButton({
  billId,
  billLabel,
}: {
  billId: string;
  billLabel: string;
}) {
  const { ids, storageAvailable } = useSavedBills();
  const saved = ids.includes(billId);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={`${saved ? "Unsave" : "Save"} ${billLabel} ${storageAvailable ? "on this device" : "for this visit"}`}
      onClick={() => toggleSavedBill(billId)}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-none px-3 text-xs font-semibold  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${saved ? "bg-surface text-blue-800 hover:bg-surface" : "text-slate-600 hover:bg-surface hover:text-blue-800"}`}
    >
      {saved ? "Saved" : "Save bill"}
    </button>
  );
}
