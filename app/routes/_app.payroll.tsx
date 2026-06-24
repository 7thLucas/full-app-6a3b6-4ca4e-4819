import { useState } from "react";
import { Link } from "react-router";
import {
  Sparkles,
  ShieldCheck,
  Check,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  FileText,
  ScrollText,
  Play,
  PartyPopper,
} from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { PAYROLL_COUNTRIES } from "~/data/mock";
import type { CountryPayroll, StatusTone } from "~/data/types";
import { Badge } from "~/components/ui/badge";
import { Button, Card } from "~/components/ui/primitives";
import { PageHeader } from "~/components/shell/page-header";
import { MissionRunner } from "~/components/missions/mission-runner";
import { MISSIONS } from "~/data/mock";
import { useAskMino } from "~/components/ask-mino/context";
import { AgentIcon } from "~/components/agent-icon";
import { cn } from "~/lib/utils";

export function meta() {
  return [{ title: "Payroll Close · Mino Autopilot" }];
}

const payrollMission = MISSIONS.find((m) => m.id === "mission-payroll-close")!;

const CHECKLIST = [
  "All five countries reconciled against the trailing 3-month baseline",
  "Indonesia overtime variance isolated and explained",
  "Statutory contributions verified (CPF, BPJS, EPF, SSS, MPF)",
  "Finance-ready explanation drafted and attached",
  "No salary or headcount surprises in the other four countries",
];

type Phase = "idle" | "ready" | "approved";

export default function PayrollPage() {
  const { config } = useConfigurables();
  const { openPanel } = useAskMino();
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");

  const currency = (n: number) => "$" + n.toLocaleString("en-US");
  const totalGross = PAYROLL_COUNTRIES.reduce((s, c) => s + c.gross, 0);
  const totalHeadcount = PAYROLL_COUNTRIES.reduce((s, c) => s + c.headcount, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Flagship mission"
        title="Payroll Close"
        description="Mino analyzes multi-country payroll, isolates every variance, and prepares a Finance-ready packet. Nothing is finalized until you approve."
        actions={
          <>
            <Button variant="outline" onClick={() => openPanel("Why did payroll increase this month?")}>
              <Sparkles className="h-4 w-4" />
              Ask Mino to explain
            </Button>
            {phase === "idle" && (
              <Button onClick={() => setRunning(true)}>
                <Play className="h-4 w-4" />
                Prepare payroll close
              </Button>
            )}
          </>
        }
      />

      {phase === "idle" && (
        <IdleState onPrepare={() => setRunning(true)} totalGross={currency(totalGross)} totalHeadcount={totalHeadcount} />
      )}

      {phase !== "idle" && (
        <div className="space-y-6">
          {phase === "approved" && (
            <Card className="border-[color-mix(in_srgb,var(--chart-2)_35%,var(--border))] bg-[color-mix(in_srgb,var(--chart-2)_8%,var(--card))] p-5 animate-scale-in">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--chart-2)] text-white">
                  <PartyPopper className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground">Payroll packet approved & logged</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    The Payroll Agent marked the close complete and the Audit Agent wrote a full trail entry with
                    your approval. Finance has been notified.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link to="/audit">
                      <Button variant="outline" size="sm">
                        <ScrollText className="h-3.5 w-3.5" />
                        View audit trail
                      </Button>
                    </Link>
                    <Link to="/today">
                      <Button variant="ghost" size="sm">
                        Back to Today
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <SummaryStat label="Total gross payroll" value={currency(totalGross)} tone="neutral" />
            <SummaryStat label="Headcount" value={String(totalHeadcount)} hint="+2 net this cycle" tone="neutral" />
            <SummaryStat label="Overall variance" value="+2.9%" hint="vs 3-month baseline" tone="warning" />
            <SummaryStat label="Compliance flags" value="3" hint="all explained / staged" tone="warning" />
          </div>

          {/* Country table */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2.5">
                <AgentIcon agent="payroll" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Country-by-country summary</h3>
                  <p className="text-xs text-muted-foreground">Prepared by the Payroll Agent</p>
                </div>
              </div>
              <Badge tone="info" dot>
                Ready for review
              </Badge>
            </div>
            <div className="mino-scroll overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Country</th>
                    <th className="px-3 py-3 font-medium">Headcount</th>
                    <th className="px-3 py-3 font-medium">Gross</th>
                    <th className="px-3 py-3 font-medium">Salary var.</th>
                    <th className="px-3 py-3 font-medium">Overtime var.</th>
                    <th className="px-3 py-3 font-medium">Expense var.</th>
                    <th className="px-5 py-3 font-medium">Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  {PAYROLL_COUNTRIES.map((c) => (
                    <CountryRow key={c.code} c={c} currency={currency} />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Explanation + checklist */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-5">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--primary)]" />
                <h3 className="text-sm font-semibold text-foreground">Suggested explanation for Finance</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Total payroll is up <span className="font-medium text-foreground">2.9%</span> this cycle. The single
                material driver is <span className="font-medium text-foreground">Indonesia Ops overtime (+31%)</span>,
                concentrated in two warehouse teams during peak demand — not a salary or headcount change. The
                remaining four countries are within normal variance, and all statutory contributions are current or
                staged for the next run.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={() => openPanel("Prepare a summary for Finance")}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Ask Mino to refine this
              </Button>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[var(--chart-2)]" />
                <h3 className="text-sm font-semibold text-foreground">Approval checklist</h3>
              </div>
              <ul className="mt-3 space-y-2">
                {CHECKLIST.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--chart-2)] text-white">
                      <Check className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Approve bar */}
          <Card className="sticky bottom-4 border-[color-mix(in_srgb,var(--primary)_28%,var(--border))] p-4 mino-shadow-lg">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-[var(--chart-2)]" />
                {config?.safetyStatement || "Mino never executes a sensitive HR action without human approval."}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => openPanel("Explain the Indonesia overtime variance")}>
                  <Sparkles className="h-4 w-4" />
                  Ask Mino to explain
                </Button>
                {phase === "approved" ? (
                  <Button variant="success" disabled>
                    <Check className="h-4 w-4" />
                    Packet approved
                  </Button>
                ) : (
                  <Button onClick={() => setPhase("approved")}>
                    Approve payroll packet
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {running && (
        <MissionRunner
          mission={payrollMission}
          onClose={() => {
            setRunning(false);
            setPhase("ready");
          }}
        />
      )}
    </div>
  );
}

function IdleState({
  onPrepare,
  totalGross,
  totalHeadcount,
}: {
  onPrepare: () => void;
  totalGross: string;
  totalHeadcount: number;
}) {
  return (
    <Card className="overflow-hidden border-[color-mix(in_srgb,var(--primary)_24%,var(--border))]">
      <div className="bg-gradient-to-br from-accent to-card px-6 py-10 text-center sm:px-10 animate-fade-in">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground animate-pulse-ring">
          <AgentIcon agent="payroll" size="lg" className="bg-transparent text-primary-foreground" />
        </span>
        <h3 className="mt-5 text-xl font-semibold text-foreground">Ready to close {new Date().toLocaleString("en-US", { month: "long" })} payroll</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {totalHeadcount} employees across 5 countries · {totalGross} gross. Mino will reconcile every line,
          isolate variances, and prepare a Finance-ready packet for your approval.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button size="lg" onClick={onPrepare}>
            <Play className="h-4 w-4" />
            Prepare payroll close
          </Button>
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-[var(--chart-2)]" />
          Nothing executes until you approve.
        </p>
      </div>
    </Card>
  );
}

function CountryRow({ c, currency }: { c: CountryPayroll; currency: (n: number) => string }) {
  const flag: Record<StatusTone, "completed" | "warning" | "critical"> = {
    completed: "completed",
    warning: "warning",
    critical: "critical",
    info: "warning",
    neutral: "warning",
  };
  return (
    <tr className="border-b border-border last:border-0 transition-colors hover:bg-secondary/50">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{c.flag}</span>
          <div>
            <p className="font-medium text-foreground">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.code}</p>
          </div>
        </div>
      </td>
      <td className="px-3 py-3.5">
        <span className="text-foreground">{c.headcount}</span>{" "}
        {c.headcountChange !== 0 && (
          <span className={cn("text-xs", c.headcountChange > 0 ? "text-[var(--chart-2)]" : "text-muted-foreground")}>
            ({c.headcountChange > 0 ? "+" : ""}
            {c.headcountChange})
          </span>
        )}
      </td>
      <td className="px-3 py-3.5 text-foreground">{currency(c.gross)}</td>
      <td className="px-3 py-3.5">
        <Variance value={c.variancePct} />
      </td>
      <td className="px-3 py-3.5">
        <Variance value={c.overtimeVariancePct} highlight={c.overtimeVariancePct > 15} />
      </td>
      <td className="px-3 py-3.5">
        <Variance value={c.expenseVariancePct} />
      </td>
      <td className="px-5 py-3.5">
        <Badge tone={flag[c.complianceFlag]}>{c.complianceNote}</Badge>
      </td>
    </tr>
  );
}

function Variance({ value, highlight }: { value: number; highlight?: boolean }) {
  const Icon = value > 0.5 ? TrendingUp : value < -0.5 ? TrendingDown : Minus;
  const color =
    highlight || Math.abs(value) > 8
      ? "text-[var(--destructive)]"
      : value > 0.5
        ? "text-[var(--chart-3)]"
        : "text-muted-foreground";
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm font-medium", color)}>
      <Icon className="h-3.5 w-3.5" />
      {value > 0 ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

function SummaryStat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone: StatusTone;
}) {
  const accent = tone === "warning" ? "text-[var(--chart-3)]" : "text-foreground";
  return (
    <Card className="p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-2 text-2xl font-semibold tracking-tight", accent)}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}
