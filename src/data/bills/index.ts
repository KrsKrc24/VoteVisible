import { washingtonBills } from "./washington";
import { oregonBills } from "./oregon";
import { californiaBills } from "./california";
import { texasBills } from "./texas";
import { newYorkBills } from "./newYork";
import { pennsylvaniaBills } from "./pennsylvania";
import { floridaBills } from "./florida";
import { illinoisBills } from "./illinois";
import { nevadaBills } from "./nevada";
import { arizonaBills } from "./arizona";
import { georgiaBills } from "./georgia";
import { northCarolinaBills } from "./northCarolina";
import { Bill, USState } from "./types";

export * from "./types";
export { filterBills, type BillFilters } from "./filters";

export const allBills: Bill[] = [
  ...washingtonBills,
  ...oregonBills,
  ...californiaBills,
  ...texasBills,
  ...newYorkBills,
  ...pennsylvaniaBills,
  ...floridaBills,
  ...illinoisBills,
  ...nevadaBills,
  ...arizonaBills,
  ...georgiaBills,
  ...northCarolinaBills,
];

export const billsByState: Record<USState, Bill[]> = {
  Washington: washingtonBills,
  Oregon: oregonBills,
  California: californiaBills,
  Texas: texasBills,
  "New York": newYorkBills,
  Pennsylvania: pennsylvaniaBills,
  Florida: floridaBills,
  Illinois: illinoisBills,
  Nevada: nevadaBills,
  Arizona: arizonaBills,
  Georgia: georgiaBills,
  "North Carolina": northCarolinaBills,
};

export function getBillById(id: string): Bill | undefined {
  return allBills.find((bill) => bill.id === id);
}

export function getBillStats() {
  return {
    total: allBills.length,
    enacted: allBills.filter((b) => b.status === "enacted").length,
    byState: Object.fromEntries(
      Object.entries(billsByState).map(([state, bills]) => [state, bills.length])
    ) as Record<USState, number>,
  };
}
