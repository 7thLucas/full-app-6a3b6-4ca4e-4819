// Deterministic fallback answers so the demo always feels alive even if the
// live LLM endpoint is unavailable. The Ask Mino drawer tries the agentic
// invokeLLM first and falls back to these structured responses.

export interface StructuredAnswer {
  summary: string;
  points: string[];
  nextActions: string[];
}

const KB: { match: RegExp; answer: StructuredAnswer }[] = [
  {
    match: /payroll.*(increase|up|higher|why|grew|rose)/i,
    answer: {
      summary:
        "Payroll is up 2.9% overall this cycle. The only material driver is Indonesia Ops overtime (+31%), concentrated in two warehouse teams — not salary or headcount.",
      points: [
        "Indonesia Ops gross +9.4% vs the trailing 3-month baseline.",
        "Driver: overtime +31% in two warehouse teams during peak.",
        "Singapore, Malaysia, Philippines, and Hong Kong are within normal variance.",
      ],
      nextActions: [
        "Open the Payroll Close packet to review the variance detail.",
        "Attach the overtime breakdown to the Finance explanation.",
        "Approve the payroll packet once you're satisfied.",
      ],
    },
  },
  {
    match: /onboarding.*(block|stuck|risk)|blocked.*onboarding|which.*block/i,
    answer: {
      summary: "Two new hires are blocked before day one, and one is at risk.",
      points: [
        "Daniel Reyes (PH) — missing bank details for payroll setup, starts in 3 days.",
        "Aisyah Putri (ID) — no laptop provisioned by IT, starts in 5 days.",
        "Wei Ling Chua (MY) — manager hasn't submitted the first-week plan.",
      ],
      nextActions: [
        "Send a bank-details request to Daniel Reyes.",
        "Escalate the equipment order for Aisyah Putri to IT.",
        "Nudge Hafiz Rahman to submit the first-week plan.",
      ],
    },
  },
  {
    match: /compliance.*(risk|due|deadline|this week)|risk.*compliance/i,
    answer: {
      summary: "Three compliance items are due within the week across the five jurisdictions.",
      points: [
        "Hong Kong — MPF auto-enrolment for 4 hires (6 days left).",
        "Malaysia — EPF rate update staged for next cycle (7 days left).",
        "Singapore — 3 employees missing IR8A declarations (11 days left).",
      ],
      nextActions: [
        "Approve the Hong Kong MPF enrolment batch.",
        "Confirm the Malaysia EPF rate is staged in payroll.",
        "Send IR8A document requests to the 3 Singapore employees.",
      ],
    },
  },
  {
    match: /summary.*finance|finance.*summary|prepare.*finance/i,
    answer: {
      summary:
        "Finance summary: payroll is up 2.9% this cycle, fully explained, with one variance to note.",
      points: [
        "Total variance is driven by Indonesia overtime (+31%) in two warehouse teams.",
        "No salary or headcount surprises across the other four countries.",
        "All statutory contributions are current or staged for the next run.",
      ],
      nextActions: [
        "Share the Finance explanation attached to the payroll packet.",
        "Flag the Indonesia overtime line for the Finance review call.",
        "Approve the packet to release the close.",
      ],
    },
  },
  {
    match: /reminder|managers|review/i,
    answer: {
      summary: "12 of 41 managers are behind on the current review cycle with 6 days left.",
      points: [
        "Calibrated reminders are drafted per manager with their outstanding count.",
        "A slipped cycle delays comp and calibration for ~120 employees.",
        "Sending reminders is an auto-safe action — no sensitive execution.",
      ],
      nextActions: [
        "Send the calibrated reminder batch to all 12 managers.",
        "Review calibration ranges in the Performance Calibration Mission.",
      ],
    },
  },
  {
    match: /retention|attrition|philippines|leave/i,
    answer: {
      summary: "Philippines Support shows elevated attrition risk from three team-level signals.",
      points: [
        "Leave usage +28%, engagement -14, manager change 21 days ago.",
        "All signals are team-level — no individual surveillance.",
        "Suggested: manager check-in plan plus an HR pulse survey.",
      ],
      nextActions: [
        "Approve the manager check-in plan in Approvals.",
        "Launch the team pulse survey this week.",
      ],
    },
  },
];

export function fallbackAnswer(question: string): StructuredAnswer {
  const hit = KB.find((k) => k.match.test(question));
  if (hit) return hit.answer;
  return {
    summary:
      "Here's what I'm seeing across your HR operations right now, based on the agents monitoring payroll, compliance, onboarding, and retention.",
    points: [
      "7 actions need attention today — 2 critical, 2 important, 3 suggested.",
      "The payroll close is ready to review with one explained variance (Indonesia).",
      "4 approvals are waiting in your inbox, gated for safety.",
    ],
    nextActions: [
      "Start with the Today dashboard to triage by severity.",
      "Run the Payroll Close Mission to produce the Finance packet.",
      "Clear the approvals inbox when you're ready.",
    ],
  };
}
