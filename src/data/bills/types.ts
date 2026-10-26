export type BillStatus =
  | "enacted"
  | "partial-progress"
  | "did-not-pass"
  | "introduced"
  | "vetoed"
  | "pending-verification";

export type USState =
  | "Alaska"
  | "Washington"
  | "Oregon"
  | "California"
  | "Texas"
  | "New York"
  | "Pennsylvania"
  | "Florida"
  | "Illinois"
  | "Nevada"
  | "Arizona"
  | "Georgia"
  | "North Carolina"
  | "Ohio"
  | "Michigan"
  | "Colorado"
  | "Massachusetts"
  | "Virginia"
  | "Tennessee"
  | "Wisconsin"
  | "New Jersey";

export interface Bill {
  id: string;
  state: USState;
  billNumber: string;
  year: number;
  title: string;
  summary: string;
  status: BillStatus;
  statusLabel: string;
  statusDate?: string;
  topics: string[];
  sources?: { title: string; url: string }[];
  summaryReviewedOn?: string;
}

export const STATUS_META: Record<BillStatus, { label: string; color: string }> =
  {
    enacted: { label: "Enacted", color: "emerald" },
    "partial-progress": { label: "Partial Progress", color: "amber" },
    "did-not-pass": { label: "Did Not Pass", color: "rose" },
    introduced: { label: "Introduced", color: "sky" },
    vetoed: { label: "Vetoed", color: "orange" },
    "pending-verification": { label: "Pending Verification", color: "slate" },
  };

export const TOPIC_META: Record<string, { label: string }> = {
  "reproductive-health": { label: "Reproductive Health" },
  "mental-health": { label: "Mental Health" },
  "youth-school-health": { label: "Youth & School Health" },
  "insurance-coverage": { label: "Insurance & Coverage" },
  "hospital-oversight": { label: "Hospital & Facility Oversight" },
  "medical-debt": { label: "Medical Debt & Billing" },
  "drug-pricing": { label: "Drug Pricing & Access" },
  "emergency-care": { label: "Emergency Care" },
  "patient-rights-privacy": { label: "Patient Rights & Privacy" },
  workforce: { label: "Healthcare Workforce" },
  "substance-use": { label: "Substance Use & Recovery" },
  "maternal-health": { label: "Maternal & Reproductive Care" },
  "disability-access": { label: "Disability Access" },
  "public-health": { label: "Public Health" },
  telehealth: { label: "Telehealth" },
  "rural-health": { label: "Rural Health" },
  "lgbtq-health": { label: "LGBTQ+ Health" },
  "consumer-protection": { label: "Consumer Protection" },
};
