// Demo data for Storybook and live documentation examples; **not published with the package**.
//
// Always use **abstract, neutral** concepts: items, units, categories, owner groups, and statuses.
// This is not fussiness—demo data gets copied. Once a demo includes industry-specific fields,
// people copy that industry’s data model along with it.
//
// Before v0.2.1 this used a full set of transaction-system fields and called itself a
// “neutral business scenario”—it had only swapped one domain for another (see ADR-0006).
// Current fields deliberately map to no real business: A/B/C/D are labels, and `name` length
// varies only to demonstrate truncation and resizable columns.
export type RecordStatus = "draft" | "confirmed" | "done" | "void";

export interface DemoRecord {
  id: string;
  unit: string;
  name: string;
  category: string;
  qty: number;
  amount: number;
  status: RecordStatus;
  createdAt: string;
  owner: string;
}

export const STATUS_LABEL: Record<RecordStatus, string> = {
  draft: "Draft",
  confirmed: "Confirmed",
  done: "Complete",
  void: "Voided",
};

export const demoRecords: DemoRecord[] = [
  { id: "R-2401", unit: "Unit A", name: "Plan A — Phase 1", category: "Category A", qty: 120, amount: 84_000, status: "done", createdAt: "2024-01-08", owner: "Group 1" },
  { id: "R-2402", unit: "Unit B", name: "Plan B — Additional specification deliberately made long to demonstrate truncation and resizable columns", category: "Category B", qty: 40, amount: 156_400, status: "confirmed", createdAt: "2024-01-11", owner: "Group 2" },
  { id: "R-2403", unit: "Unit C", name: "Plan C — First draft", category: "Category C", qty: 6, amount: 213_000, status: "confirmed", createdAt: "2024-01-12", owner: "Group 1" },
  { id: "R-2404", unit: "Unit A", name: "Plan A — Phase 2", category: "Category D", qty: 80, amount: 32_800, status: "draft", createdAt: "2024-01-15", owner: "Group 3" },
  { id: "R-2405", unit: "Unit D", name: "Plan D — Routine item", category: "Category A", qty: 5_000, amount: 47_500, status: "done", createdAt: "2024-01-16", owner: "Group 2" },
  { id: "R-2406", unit: "Unit E", name: "Plan E — Consolidation", category: "Category C", qty: 12, amount: 268_800, status: "confirmed", createdAt: "2024-01-18", owner: "Group 1" },
  { id: "R-2407", unit: "Unit B", name: "Plan B — Supporting item", category: "Category B", qty: 300, amount: 91_200, status: "void", createdAt: "2024-01-19", owner: "Group 3" },
  { id: "R-2408", unit: "Unit C", name: "Plan C — Second version", category: "Category C", qty: 4, amount: 128_000, status: "draft", createdAt: "2024-01-22", owner: "Group 2" },
  { id: "R-2409", unit: "Unit D", name: "Plan D — Small item", category: "Category D", qty: 12_000, amount: 18_600, status: "done", createdAt: "2024-01-23", owner: "Group 3" },
  { id: "R-2410", unit: "Unit E", name: "Plan E — Follow-up", category: "Category A", qty: 250, amount: 137_500, status: "confirmed", createdAt: "2024-01-25", owner: "Group 1" },
  { id: "R-2411", unit: "Unit A", name: "Plan A — Phase 3", category: "Category A", qty: 90, amount: 76_500, status: "confirmed", createdAt: "2024-01-26", owner: "Group 2" },
  { id: "R-2412", unit: "Unit D", name: "Plan D — Routine item (continued)", category: "Category D", qty: 2_000, amount: 24_000, status: "done", createdAt: "2024-01-29", owner: "Group 3" },
  { id: "R-2413", unit: "Unit B", name: "Plan B — Basic item", category: "Category B", qty: 150, amount: 64_500, status: "draft", createdAt: "2024-01-30", owner: "Group 1" },
  { id: "R-2414", unit: "Unit C", name: "Plan C — Third version", category: "Category C", qty: 8, amount: 184_000, status: "confirmed", createdAt: "2024-02-01", owner: "Group 2" },
  { id: "R-2415", unit: "Unit E", name: "Plan E — Supplement", category: "Category D", qty: 600, amount: 42_000, status: "done", createdAt: "2024-02-02", owner: "Group 3" },
  { id: "R-2416", unit: "Unit A", name: "Plan A — Notes", category: "Category A", qty: 400, amount: 28_800, status: "confirmed", createdAt: "2024-02-05", owner: "Group 1" },
  { id: "R-2417", unit: "Unit D", name: "Plan D — Project item", category: "Category C", qty: 2, amount: 96_000, status: "draft", createdAt: "2024-02-06", owner: "Group 2" },
  { id: "R-2418", unit: "Unit B", name: "Plan B — Expansion", category: "Category B", qty: 60, amount: 110_400, status: "confirmed", createdAt: "2024-02-07", owner: "Group 3" },
];

/** One master record for the read-only-first editing demo. Fields remain deliberately abstract. */
export interface DemoProfile extends Record<string, unknown> {
  name: string;
  code: string;
  tier: string;
  quota: number;
  adjustRate: number;
  channels: string[];
  active: boolean;
  contact: string;
  since: string;
}

export const demoProfile: DemoProfile = {
  name: "Unit A (abstract demo name)",
  code: "U-1042",
  tier: "gold",
  quota: 1_500_000,
  adjustRate: 0.08,
  channels: ["online", "phone"],
  active: true,
  contact: "Group 1, extension 214",
  since: "2019-04-01",
};

export const TIER_OPTIONS = [
  { value: "bronze", label: "Bronze" },
  { value: "silver", label: "Silver" },
  { value: "gold", label: "Gold" },
  { value: "platinum", label: "Platinum" },
];

export const CHANNEL_OPTIONS = [
  { value: "online", label: "Online" },
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "onsite", label: "On-site" },
];

/**
 * Completed changes for the ChangeSummary demo.
 * Keep this in one place: every duplicate is an entry point for a new domain to slip in.
 * See tests/demo-data.test.ts for the guard.
 */
export const demoChanges = [
  {
    field: "quota",
    label: "Quota",
    before: demoProfile.quota,
    after: 1_650_000,
    beforeText: "$1,500,000",
    afterText: "$1,650,000",
  },
  {
    field: "tier",
    label: "Tier",
    before: demoProfile.tier,
    after: "platinum",
    beforeText: "Gold",
    afterText: "Platinum",
  },
  {
    field: "contact",
    label: "Contact",
    before: demoProfile.contact,
    after: "Group 1, extension 220",
    beforeText: "Group 1, extension 214",
    afterText: "Group 1, extension 220",
  },
];

/**
 * Timeline demo (Gantt). Dates span two months so the weekly grid, today line, and bar positions
 * remain visible. category maps to `--chart-N`; the same category keeps the same color across charts.
 */
export interface DemoPhase {
  id: string;
  label: string;
  start: string;
  end: string;
  category?: number;
  progress?: number;
}

export const demoPhases: DemoPhase[] = [
  { id: "P-01", label: "Plan A — Phase 1", start: "2024-01-08", end: "2024-01-26", category: 1, progress: 100 },
  { id: "P-02", label: "Plan A — Phase 2", start: "2024-01-22", end: "2024-02-16", category: 1, progress: 55 },
  { id: "P-03", label: "Plan B — Basic item", start: "2024-01-15", end: "2024-02-02", category: 2, progress: 80 },
  { id: "P-04", label: "Plan B — Expansion", start: "2024-02-05", end: "2024-02-23", category: 2, progress: 10 },
  { id: "P-05", label: "Plan C — First draft", start: "2024-01-29", end: "2024-02-09", category: 3, progress: 40 },
  { id: "P-06", label: "Plan D — Routine item", start: "2024-01-10", end: "2024-02-28", category: 4 },
  { id: "P-07", label: "Plan E — Consolidation", start: "2024-02-12", end: "2024-03-01", category: 5, progress: 0 },
];

/**
 * Node canvas demo (GraphCanvas). The flow is an abstract staged progression;
 * node categories reuse demoPhases to show one entity keeping its color across views.
 */
export const demoGraphNodes = [
  { id: "n1", label: "Receive", position: { x: 0, y: 80 }, category: 1 },
  { id: "n2", label: "Initial review", position: { x: 180, y: 0 }, category: 2 },
  { id: "n3", label: "Verify", position: { x: 180, y: 160 }, category: 2 },
  { id: "n4", label: "Consolidate", position: { x: 360, y: 80 }, category: 3 },
  { id: "n5", label: "Confirm", position: { x: 540, y: 80 }, category: 5 },
];

export const demoGraphEdges = [
  { id: "e1-2", source: "n1", target: "n2" },
  { id: "e1-3", source: "n1", target: "n3" },
  { id: "e2-4", source: "n2", target: "n4", label: "Pass" },
  { id: "e3-4", source: "n3", target: "n4" },
  { id: "e4-5", source: "n4", target: "n5" },
];
