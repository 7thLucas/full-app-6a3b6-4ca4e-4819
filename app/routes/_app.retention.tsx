import { useState } from "react";
import {
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  UserCog,
  ShieldCheck,
  Check,
  ArrowRight,
} from "lucide-react";
import { RETENTION_CLUSTERS } from "~/data/mock";
import type { RetentionCluster } from "~/data/types";
import { RiskBadge } from "~/components/ui/badge";
import { Button, Card, ProgressBar } from "~/components/ui/primitives";
import { PageHeader } from "~/components/shell/page-header";
import { useAskMino } from "~/components/ask-mino/context";
import { cn } from "~/lib/utils";

export function meta() {
  return [{ title: "Retention · Mino Autopilot" }];
}

export default function RetentionPage() {
  const { openPanel } = useAskMino();
  const highRisk = RETENTION_CLUSTERS.filter((c) => c.riskLevel === "high").length;

  return (
    <div>
      <PageHeader
        eyebrow="Retention autopilot"
        title="Retention"
        description="The Retention Agent surfaces team-level people-risk only — never individual surveillance. It flags clusters where multiple signals move together."
        actions={
          <Button variant="outline" onClick={() => openPanel("Where is our attrition risk highest?")}>
            <Sparkles className="h-4 w-4" />
            Ask Mino
          </Button>
        }
      />

      <Card className="mb-6 flex items-center gap-2 border-[color-mix(in_srgb,var(--primary)_22%,var(--border))] bg-accent/60 p-4">
        <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--primary)]" />
        <p className="text-sm text-foreground">
          Mino analyzes <span className="font-medium">team-level</span> engagement, leave, and manager-change signals.
          No individual is ever singled out or surveilled.
          {highRisk > 0 && <span className="ml-1 text-muted-foreground">{highRisk} team currently at high risk.</span>}
        </p>
      </Card>

      <div className="space-y-4 mino-stagger">
        {RETENTION_CLUSTERS.map((cluster) => (
          <ClusterCard key={cluster.id} cluster={cluster} />
        ))}
      </div>
    </div>
  );
}

function ClusterCard({ cluster }: { cluster: RetentionCluster }) {
  const { openPanel } = useAskMino();
  const [planLaunched, setPlanLaunched] = useState(false);
  const isLow = cluster.riskLevel === "low";

  return (
    <Card interactive className="p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: "color-mix(in srgb, var(--chart-4) 14%, transparent)",
              color: "var(--chart-4)",
            }}
          >
            <Users className="h-5 w-5" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">{cluster.team}</h3>
              <RiskBadge risk={cluster.riskLevel} />
            </div>
            <p className="text-sm text-muted-foreground">
              {cluster.country} · {cluster.headcount} people
            </p>
          </div>
        </div>

        <div className="w-full max-w-[200px] shrink-0">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Attrition risk</span>
            <span className="font-semibold text-foreground">{cluster.attritionRisk}%</span>
          </div>
          <ProgressBar
            value={cluster.attritionRisk}
            tone={cluster.attritionRisk >= 65 ? "danger" : cluster.attritionRisk >= 40 ? "warning" : "success"}
          />
        </div>
      </div>

      {/* Trend signals */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <SignalTile
          label="Engagement"
          value={`${cluster.engagementDelta > 0 ? "+" : ""}${cluster.engagementDelta} pts`}
          up={cluster.engagementDelta >= 0}
          good={cluster.engagementDelta >= 0}
        />
        <SignalTile
          label="Leave usage"
          value={`${cluster.leaveDelta > 0 ? "+" : ""}${cluster.leaveDelta}%`}
          up={cluster.leaveDelta >= 0}
          good={cluster.leaveDelta <= 0}
        />
        <SignalTile
          label="Manager change"
          value={cluster.managerChangeDays ? `${cluster.managerChangeDays}d ago` : "None"}
          icon={<UserCog className="h-3.5 w-3.5" />}
          neutral={!cluster.managerChangeDays}
          good={!cluster.managerChangeDays}
        />
      </div>

      {/* Signals list */}
      <div className="mt-4 rounded-xl bg-secondary/60 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Detected signals</p>
        <ul className="mt-1.5 space-y-1">
          {cluster.signals.map((s) => (
            <li key={s} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--chart-4)]" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Intervention */}
      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-[color-mix(in_srgb,var(--primary)_22%,var(--border))] bg-accent/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--primary)]">
            Suggested intervention
          </p>
          <p className="mt-0.5 text-sm text-foreground">{cluster.suggestedIntervention}</p>
          {!isLow && (
            <ul className="mt-2 space-y-0.5">
              {cluster.actionPlan.map((a) => (
                <li key={a} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-[var(--primary)]" />
                  {a}
                </li>
              ))}
            </ul>
          )}
        </div>
        {!isLow && (
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => openPanel(`Draft an HR action plan for ${cluster.team}`)}>
              <Sparkles className="h-3.5 w-3.5" />
              Ask Mino
            </Button>
            {planLaunched ? (
              <Button variant="success" size="sm" disabled>
                <Check className="h-3.5 w-3.5" />
                Plan launched
              </Button>
            ) : (
              <Button size="sm" onClick={() => setPlanLaunched(true)}>
                Launch action plan
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

function SignalTile({
  label,
  value,
  up,
  good,
  neutral,
  icon,
}: {
  label: string;
  value: string;
  up?: boolean;
  good?: boolean;
  neutral?: boolean;
  icon?: React.ReactNode;
}) {
  const color = neutral
    ? "text-muted-foreground"
    : good
      ? "text-[var(--chart-2)]"
      : "text-[var(--destructive)]";
  return (
    <div className="rounded-xl border border-border bg-background px-3.5 py-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-1 inline-flex items-center gap-1 text-sm font-semibold", color)}>
        {icon ? icon : up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
        {value}
      </p>
    </div>
  );
}
