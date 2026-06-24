import type { AgentProfile, AgentKey } from "./types";

export const AGENTS: Record<AgentKey, AgentProfile> = {
  payroll: {
    key: "payroll",
    name: "Payroll Agent",
    short: "Payroll",
    goal: "Close payroll accurately across every jurisdiction with zero surprises for Finance.",
    inputs: ["Salary ledger", "Headcount changes", "Overtime logs", "Expense claims", "Leave records"],
    reasoningSummary:
      "Reconciles this cycle against the prior three months, isolates variance drivers per country, and drafts a Finance-ready explanation.",
    suggestedAction: "Prepare the multi-country payroll close packet for approval.",
    approvalLevel: "HR Operations Lead",
    executionStatus: "preparing",
    accent: "chart-1",
  },
  compliance: {
    key: "compliance",
    name: "Compliance Agent",
    short: "Compliance",
    goal: "Keep every statutory obligation ahead of its deadline across all five jurisdictions.",
    inputs: ["Statutory calendars", "Document registry", "Country policy rules", "Employee records"],
    reasoningSummary:
      "Tracks filing windows and missing documents per country, scoring risk by deadline proximity and penalty exposure.",
    suggestedAction: "Route the three Singapore statutory document requests for sign-off.",
    approvalLevel: "Compliance Owner",
    executionStatus: "monitoring",
    accent: "chart-3",
  },
  onboarding: {
    key: "onboarding",
    name: "Onboarding Agent",
    short: "Onboarding",
    goal: "Make every new hire fully ready before day one — no blockers, no scramble.",
    inputs: ["New-hire roster", "Equipment status", "Document checklist", "Manager task list"],
    reasoningSummary:
      "Sequences pre-start tasks, detects blockers, and nudges the right owner before they become day-one failures.",
    suggestedAction: "Clear the two blocked hires before their start date.",
    approvalLevel: "Auto-safe (reminders)",
    executionStatus: "monitoring",
    accent: "chart-1",
  },
  retention: {
    key: "retention",
    name: "Retention Agent",
    short: "Retention",
    goal: "Surface team-level attrition risk early — without ever surveilling individuals.",
    inputs: ["Engagement pulse trends", "Leave patterns (team-level)", "Manager change events"],
    reasoningSummary:
      "Aggregates only team-level signals, flags clusters where multiple indicators move together, and proposes HR interventions.",
    suggestedAction: "Launch a manager check-in plan for Philippines Support.",
    approvalLevel: "People Partner",
    executionStatus: "monitoring",
    accent: "chart-4",
  },
  performance: {
    key: "performance",
    name: "Performance Agent",
    short: "Performance",
    goal: "Keep review cycles on time and calibration fair across managers.",
    inputs: ["Review completion status", "Manager roster", "Calibration ranges"],
    reasoningSummary:
      "Tracks outstanding reviews by manager and drafts targeted reminders with calibration context.",
    suggestedAction: "Send calibrated reminders to the 12 managers behind on reviews.",
    approvalLevel: "Auto-safe (reminders)",
    executionStatus: "monitoring",
    accent: "chart-5",
  },
  "approval-routing": {
    key: "approval-routing",
    name: "Approval Routing Agent",
    short: "Routing",
    goal: "Get every proposed action to the right human approver with full context.",
    inputs: ["Action proposals", "Approval matrix", "Risk scores"],
    reasoningSummary:
      "Maps each proposed action to its required approval level and assembles the evidence the approver needs to decide fast.",
    suggestedAction: "Route the payroll packet to the HR Operations Lead.",
    approvalLevel: "System",
    executionStatus: "monitoring",
    accent: "chart-2",
  },
  audit: {
    key: "audit",
    name: "Audit Agent",
    short: "Audit",
    goal: "Record every action, the data it touched, the reasoning, and the human who approved it.",
    inputs: ["Agent activity stream", "Approval decisions", "Executed actions"],
    reasoningSummary:
      "Writes an immutable trail entry for every agent step so enterprise trust is provable, not assumed.",
    suggestedAction: "All actions logged. No gaps in the trail.",
    approvalLevel: "System",
    executionStatus: "monitoring",
    accent: "chart-2",
  },
};

export const AGENT_LIST = Object.values(AGENTS);
