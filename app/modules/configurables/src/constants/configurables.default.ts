/*
 * Default Configurable Data — seeded into Mongo on first boot.
 *
 * BEFORE EDITING: read ./RULES.md (especially R5: schema and defaults must
 * stay in sync) and ./configurables.schema.ts. For per-type schema and
 * default-value samples, see RULES.md §5 "Field Type Reference".
 */

export type TBrandColor = {
  // Base
  background: string;
  foreground: string;
  // Card
  card: string;
  cardForeground: string;
  // Popover
  popover: string;
  popoverForeground: string;
  // Primary
  primary: string;
  primaryForeground: string;
  // Secondary
  secondary: string;
  secondaryForeground: string;
  // Muted
  muted: string;
  mutedForeground: string;
  // Accent
  accent: string;
  accentForeground: string;
  // Destructive
  destructive: string;
  destructiveForeground: string;
  // Border / Input / Ring
  border: string;
  input: string;
  ring: string;
  // Charts
  chart1?: string;
  chart2?: string;
  chart3?: string;
  chart4?: string;
  chart5?: string;
  // Navbar
  navbarBackground: string;
  // Sidebar
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

export type TFont = {
  headingFont: string;
  textFont: string;
};

export type TCountry = {
  code: string;
  name: string;
  flag?: string;
};

export type TDefaultConfigurableData = {
  appName: string;
  logoUrl: string;
  tagline?: string;
  productDescription?: string;
  operatorName?: string;
  operatorRole?: string;
  companyName?: string;
  headcount?: number;
  askMinoLabel?: string;
  enableAskMino?: boolean;
  enableAuditLog?: boolean;
  safetyStatement?: string;
  countries?: TCountry[];
  askMinoSuggestions?: string[];
  brandColor: TBrandColor;
  font: TFont;
};

export const defaultConfigurablesData: TDefaultConfigurableData = {
  appName: "Mino Autopilot",
  logoUrl: "",
  tagline: "The agentic HR operating layer for Omni HR.",
  productDescription:
    "Mino turns Omni from a system of record into a system of action — AI agents detect issues, recommend actions, route approvals, and safely execute HR workflows.",
  operatorName: "Sarah",
  operatorRole: "HR Operations Lead",
  companyName: "Omni HR",
  headcount: 340,
  askMinoLabel: "Ask Mino",
  enableAskMino: true,
  enableAuditLog: true,
  safetyStatement:
    "Mino never executes a sensitive HR action without human approval. Every action lands in a transparent audit trail.",
  countries: [
    { code: "SG", name: "Singapore", flag: "🇸🇬" },
    { code: "ID", name: "Indonesia", flag: "🇮🇩" },
    { code: "MY", name: "Malaysia", flag: "🇲🇾" },
    { code: "PH", name: "Philippines", flag: "🇵🇭" },
    { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  ],
  askMinoSuggestions: [
    "Why did payroll increase this month?",
    "Which onboarding tasks are blocked?",
    "What compliance risks are due this week?",
    "Prepare a summary for Finance",
    "Draft reminders for managers",
  ],
  brandColor: {
    // Base
    background:        "#fafafa",
    foreground:        "#0a0a0b",
    // Card
    card:              "#ffffff",
    cardForeground:    "#0a0a0b",
    // Popover
    popover:           "#ffffff",
    popoverForeground: "#0a0a0b",
    // Primary
    primary:           "#2563eb",
    primaryForeground: "#ffffff",
    // Secondary
    secondary:           "#f4f5f7",
    secondaryForeground: "#1c1c20",
    // Muted
    muted:           "#f4f5f7",
    mutedForeground: "#71717a",
    // Accent
    accent:           "#eef2ff",
    accentForeground: "#1e3a8a",
    // Destructive
    destructive:           "#dc2626",
    destructiveForeground: "#ffffff",
    // Border / Input / Ring
    border: "#e8e8ec",
    input:  "#e8e8ec",
    ring:   "#2563eb",
    // Charts (semantic status palette)
    chart1: "#2563eb",
    chart2: "#16a34a",
    chart3: "#d97706",
    chart4: "#dc2626",
    chart5: "#7c3aed",
    // Navbar
    navbarBackground: "#ffffff",
    // Sidebar
    sidebarBackground:        "#ffffff",
    sidebarForeground:        "#52525b",
    sidebarPrimary:           "#2563eb",
    sidebarPrimaryForeground: "#ffffff",
    sidebarAccent:            "#eef2ff",
    sidebarAccentForeground:  "#1e3a8a",
    sidebarBorder:            "#ededf0",
    sidebarRing:              "#2563eb",
  },
  font: {
    headingFont: "Plus Jakarta Sans",
    textFont: "Inter",
  },
  // ─────────────────────────────────────────────────────────────────────
  // Add new field defaults here. See RULES.md §5 for per-type shape.
  // ─────────────────────────────────────────────────────────────────────
};
