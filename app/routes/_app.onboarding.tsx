import { useState } from "react";
import {
  Check,
  AlertTriangle,
  Laptop,
  GraduationCap,
  Calendar,
  User2,
  Sparkles,
  Zap,
  Send,
} from "lucide-react";
import { ONBOARDING_HIRES } from "~/data/mock";
import type { OnboardingHire } from "~/data/types";
import { Badge } from "~/components/ui/badge";
import { Avatar, Button, Card, ProgressBar } from "~/components/ui/primitives";
import { PageHeader } from "~/components/shell/page-header";
import { useAskMino } from "~/components/ask-mino/context";
import { cn } from "~/lib/utils";

export function meta() {
  return [{ title: "Onboarding · Mino Autopilot" }];
}

const statusBadge: Record<OnboardingHire["status"], { tone: "completed" | "warning" | "critical"; label: string }> = {
  "on-track": { tone: "completed", label: "On track" },
  "at-risk": { tone: "warning", label: "At risk" },
  blocked: { tone: "critical", label: "Blocked" },
};

const equipmentLabel: Record<OnboardingHire["equipment"], string> = {
  ordered: "Ordered",
  shipped: "Shipped",
  delivered: "Delivered",
  pending: "Pending",
};

const trainingLabel: Record<OnboardingHire["training"], string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  complete: "Complete",
};

export default function OnboardingPage() {
  const { openPanel } = useAskMino();
  const blocked = ONBOARDING_HIRES.filter((h) => h.status === "blocked").length;
  const onTrack = ONBOARDING_HIRES.filter((h) => h.status === "on-track").length;

  return (
    <div>
      <PageHeader
        eyebrow="Onboarding autopilot"
        title="Onboarding"
        description="The Onboarding Agent sequences every pre-start task and clears blockers before day one."
        actions={
          <Button variant="outline" onClick={() => openPanel("Which onboarding tasks are blocked?")}>
            <Sparkles className="h-4 w-4" />
            Ask Mino
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-3 gap-3">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Starting soon</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{ONBOARDING_HIRES.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Blocked</p>
          <p className="mt-2 text-2xl font-semibold text-[var(--destructive)]">{blocked}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">On track</p>
          <p className="mt-2 text-2xl font-semibold text-[var(--chart-2)]">{onTrack}</p>
        </Card>
      </div>

      <div className="space-y-3 mino-stagger">
        {ONBOARDING_HIRES.map((hire) => (
          <HireCard key={hire.id} hire={hire} />
        ))}
      </div>
    </div>
  );
}

function HireCard({ hire }: { hire: OnboardingHire }) {
  const [actionsSent, setActionsSent] = useState<Record<string, boolean>>({});
  const status = statusBadge[hire.status];

  return (
    <Card interactive className="p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <Avatar initials={hire.initials} className="h-11 w-11 text-sm" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">{hire.name}</h3>
              <Badge tone={status.tone} dot>
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {hire.role} · {hire.country}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Starts {hire.startDate} ({hire.daysToStart}d)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <User2 className="h-3.5 w-3.5" />
                {hire.manager}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[220px] shrink-0">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Readiness</span>
            <span className="font-semibold text-foreground">{hire.completion}%</span>
          </div>
          <ProgressBar
            value={hire.completion}
            tone={hire.completion >= 80 ? "success" : hire.completion >= 50 ? "warning" : "danger"}
          />
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Laptop className="h-3.5 w-3.5" />
              {equipmentLabel[hire.equipment]}
            </span>
            <span className="inline-flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5" />
              {trainingLabel[hire.training]}
            </span>
          </div>
        </div>
      </div>

      {/* Blockers */}
      {hire.blockers.length > 0 && (
        <div className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--destructive)_30%,var(--border))] bg-[color-mix(in_srgb,var(--destructive)_6%,var(--card))] px-4 py-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-[var(--destructive)]">
            <AlertTriangle className="h-3.5 w-3.5" />
            {hire.blockers.length} blocker{hire.blockers.length > 1 ? "s" : ""}
          </p>
          <ul className="mt-1.5 space-y-0.5">
            {hire.blockers.map((b) => (
              <li key={b} className="text-sm text-foreground">
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Documents + recommended actions */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Required documents</p>
          <div className="flex flex-wrap gap-1.5">
            {hire.documents.map((d) => (
              <span
                key={d.label}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs",
                  d.done
                    ? "bg-[color-mix(in_srgb,var(--chart-2)_12%,transparent)] text-[var(--chart-2)]"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {d.done ? <Check className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                {d.label}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Mino recommends
          </p>
          <div className="flex flex-col gap-1.5">
            {hire.recommendedActions.map((a) => {
              const sent = actionsSent[a];
              return (
                <button
                  key={a}
                  disabled={sent}
                  onClick={() => setActionsSent((s) => ({ ...s, [a]: true }))}
                  className={cn(
                    "group flex items-center justify-between gap-2 rounded-lg border px-3 py-1.5 text-left text-sm transition-all",
                    sent
                      ? "border-[color-mix(in_srgb,var(--chart-2)_30%,var(--border))] bg-[color-mix(in_srgb,var(--chart-2)_8%,transparent)] text-[var(--chart-2)]"
                      : "border-border bg-background text-foreground hover:border-[color-mix(in_srgb,var(--primary)_40%,var(--border))] hover:bg-accent",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {sent ? <Check className="h-3.5 w-3.5" /> : <Zap className="h-3.5 w-3.5 text-[var(--primary)]" />}
                    {a}
                  </span>
                  {!sent && (
                    <Send className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
