import { alaskaBills } from "./alaska";
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
import { ohioBills } from "./ohio";
import { michiganBills } from "./michigan";
import { coloradoBills } from "./colorado";
import { massachusettsBills } from "./massachusetts";
import { virginiaBills } from "./virginia";
import { tennesseeBills } from "./tennessee";
import { wisconsinBills } from "./wisconsin";
import { newJerseyBills } from "./newJersey";
import { Bill, USState } from "./types";
import { isStateReleased } from "./releaseSchedule";

export * from "./types";
export { filterBills, type BillFilters } from "./filters";
export { RELEASE_SCHEDULE, isStateReleased, getUpcomingReleases } from "./releaseSchedule";

export const allBills: Bill[] = [
  ...alaskaBills,
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
  ...ohioBills,
  ...michiganBills,
  ...coloradoBills,
  ...massachusettsBills,
  ...virginiaBills,
  ...tennesseeBills,
  ...wisconsinBills,
  ...newJerseyBills,
];

export const billsByState: Record<USState, Bill[]> = {
  Alaska: alaskaBills,
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
  Ohio: ohioBills,
  Michigan: michiganBills,
  Colorado: coloradoBills,
  Massachusetts: massachusettsBills,
  Virginia: virginiaBills,
  Tennessee: tennesseeBills,
  Wisconsin: wisconsinBills,
  "New Jersey": newJerseyBills,
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

// Released-only views: these respect the publication schedule in
// releaseSchedule.ts. Every public-facing listing/page should read from
// these instead of the raw allBills/billsByState above.
export function getReleasedBillsByState(now?: Date): Record<USState, Bill[]> {
  const entries = Object.entries(billsByState) as [USState, Bill[]][];
  return Object.fromEntries(
    entries.filter(([state]) => isStateReleased(state, now)),
  ) as Record<USState, Bill[]>;
}

export function getReleasedBills(now?: Date): Bill[] {
  return Object.values(getReleasedBillsByState(now)).flat();
}

export function getReleasedBillStats(now?: Date) {
  const bills = getReleasedBills(now);
  return {
    total: bills.length,
    enacted: bills.filter((b) => b.status === "enacted").length,
    byState: Object.fromEntries(
      Object.entries(getReleasedBillsByState(now)).map(([state, stateBills]) => [
        state,
        stateBills.length,
      ]),
    ) as Record<USState, number>,
  };
}
