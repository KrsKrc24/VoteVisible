"use client";

import { Bookmark } from "lucide-react";
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
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${saved ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : "text-slate-600 hover:bg-blue-50 hover:text-blue-800"}`}
    >
      <Bookmark
        aria-hidden="true"
        size={15}
        fill={saved ? "currentColor" : "none"}
      />
      {saved ? "Saved" : "Save bill"}
    </button>
  );
}
