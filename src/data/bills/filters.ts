import { Bill, BillStatus, USState, TOPIC_META } from "./types";

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
      !bill.billNumber.toLowerCase().includes(query) &&
      !bill.state.toLowerCase().includes(query) &&
      !bill.topics.some((topic) =>
        TOPIC_META[topic]?.label.toLowerCase().includes(query),
      )
    ) {
      return false;
    }
    return true;
  });
}
