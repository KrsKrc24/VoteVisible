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
import { Bill, BillStatus, USState } from "./types";

export * from "./types";

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

export interface BillFilters {
  state?: USState;
  status?: BillStatus;
  topic?: string;
  query?: string;
}

export function filterBills(bills: Bill[], filters: BillFilters): Bill[] {
  const query = filters.query?.trim().toLowerCase();

  return bills.filter((bill) => {
    if (filters.state && bill.state !== filters.state) return false;
    if (filters.status && bill.status !== filters.status) return false;
    if (filters.topic && !bill.topics.includes(filters.topic)) return false;
    if (
      query &&
      !bill.title.toLowerCase().includes(query) &&
      !bill.summary.toLowerCase().includes(query) &&
      !bill.billNumber.toLowerCase().includes(query)
    ) {
      return false;
    }
    return true;
  });
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
