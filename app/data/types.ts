// Shared domain types for the Mino Autopilot prototype.

export type Severity = "critical" | "important" | "suggested";
export type RiskLevel = "low" | "medium" | "high";
export type StatusTone = "completed" | "warning" | "critical" | "info" | "neutral";

export type AgentKey =
  | "payroll"
  | "compliance"
  | "onboarding"
  | "retention"
  | "performance"
  | "approval-routing"
  | "audit";

export interface AgentProfile {
  key: AgentKey;
  name: string;
  short: string;
  goal: string;
  inputs: string[];
  reasoningSummary: string;
  suggestedAction: string;
  approvalLevel: string;
  executionStatus: "idle" | "monitoring" | "preparing" | "awaiting-approval" | "executing" | "completed";
  accent: string; // chart color var name e.g. "chart-1"
}

export interface TodoCard {
  id: string;
  severity: Severity;
  agent: AgentKey;
  title: string;
  explanation: string;
  impact: string;
  suggestedAction: string;
  confidence: number; // 0-100
  approvalStatus: "needs-approval" | "auto-safe" | "in-review";
  country?: string;
}

export interface MissionStage {
  label: string;
  detail: string;
}

export interface MissionCard {
  id: string;
  name: string;
  agent: AgentKey;
  description: string;
  timeSaved: string;
  risk: RiskLevel;
  lastRun: string;
  flagship?: boolean;
  cta: string;
}

export interface CountryPayroll {
  code: string;
  name: string;
  flag: string;
  headcount: number;
  headcountChange: number;
  gross: number;
  variancePct: number;
  overtimeVariancePct: number;
  expenseVariancePct: number;
  leaveImpact: string;
  complianceFlag: StatusTone;
  complianceNote: string;
  note: string;
}

export interface OnboardingHire {
  id: string;
  name: string;
  initials: string;
  role: string;
  country: string;
  countryCode: string;
  startDate: string;
  daysToStart: number;
  manager: string;
  completion: number;
  status: "on-track" | "at-risk" | "blocked";
  blockers: string[];
  documents: { label: string; done: boolean }[];
  equipment: "ordered" | "shipped" | "delivered" | "pending";
  training: "not-started" | "in-progress" | "complete";
  recommendedActions: string[];
}

export interface ComplianceItem {
  id: string;
  title: string;
  countryCode: string;
  country: string;
  category: string;
  severity: Severity;
  owner: string;
  deadline: string;
  daysLeft: number;
  remediation: string;
  status: "open" | "in-progress" | "resolved";
}

export interface RetentionCluster {
  id: string;
  team: string;
  countryCode: string;
  country: string;
  headcount: number;
  riskLevel: RiskLevel;
  attritionRisk: number; // 0-100
  engagementDelta: number; // negative = drop
  leaveDelta: number; // percent change
  managerChangeDays?: number;
  signals: string[];
  suggestedIntervention: string;
  actionPlan: string[];
}

export interface ApprovalItem {
  id: string;
  action: string;
  agent: AgentKey;
  reasoning: string;
  dataUsed: string[];
  risk: RiskLevel;
  approver: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected" | "changes-requested";
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  agent: AgentKey;
  action: string;
  dataAccessed: string;
  reasoning: string;
  approvedBy: string | null;
  finalAction: string;
  outcome: StatusTone;
}
