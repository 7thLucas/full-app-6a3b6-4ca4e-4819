import { useMemo, useState } from "react";
import { Sparkles, CalendarClock, User2, ArrowRight, ShieldCheck } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { COMPLIANCE_ITEMS } from "~/data/mock";
import type { ComplianceItem } from "~/data/types";
import { Badge, SeverityBadge } from "~/components/ui/badge";
import { Button, Card } from "~/components/ui/primitives";
import { PageHeader } from "~/components/shell/page-header";
import { useAskMino } from "~/components/ask-mino/context";
import { cn } from "~/lib/utils";

export function meta() {
  return [{ title: "Compliance · Mino Autopilot" }];
}

const statusBadge: Record<ComplianceItem["status"], { tone: "completed" | "warning" | "info"; label: string }> = {
  open: { tone: "warning", label: "Open" },
  "in-progress": { tone: "info", label: "In progress" },
  resolved: { tone: "completed", label: "Resolved" },
};

export default function CompliancePage() {
  const { config } = useConfigurables();
  const { openPanel } = useAskMino();
  const countries = config?.countries ?? [];
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(
    () => (filter === "all" ? COMPLIANCE_ITEMS : COMPLIANCE_ITEMS.filter((c) => c.countryCode === filter)),
    [filter],
  );

  const dueThisWeek = COMPLIANCE_ITEMS.filter((c) => c.daysLeft <= 7).length;

  return (
    <div>
      <PageHeader
        eyebrow="Compliance watch"
        title="Compliance"
        description="The Compliance Agent tracks statutory deadlines, missing documents, and country-specific risk across all five jurisdictions."
        actions={
          <Button variant="outline" onClick={() => openPanel("What compliance risks are due this week?")}>
            <Sparkles className="h-4 w-4" />
            Ask Mino
          </Button>
        }
      />

      <Card className="mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm text-foreground">
          <CalendarClock className="h-4 w-4 text-[var(--chart-3)]" />
          <span className="font-semibold">{dueThisWeek} obligations</span> due within 7 days across your jurisdictions.
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-[var(--chart-2)]" />
          All remediation routes through human sign-off.
        </p>
      </Card>

      {/* Country filter */}
      <div className="mb-5 flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          All countries
        </FilterChip>
        {countries.map((c) => (
          <FilterChip key={c.code} active={filter === c.code} onClick={() => setFilter(c.code)}>
            <span>{c.flag}</span> {c.name}
          </FilterChip>
        ))}
      </div>

      <div className="space-y-3 mino-stagger">
        {filtered.map((item) => {
          const status = statusBadge[item.status];
          const urgent = item.daysLeft <= 7;
          return (
            <Card key={item.id} interactive className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <SeverityBadge severity={item.severity} />
                    <Badge tone="neutral">{item.country}</Badge>
                    <Badge tone="neutral">{item.category}</Badge>
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </div>
                  <h3 className="mt-2.5 text-base font-semibold text-foreground">{item.title}</h3>
                  <div className="mt-2.5 rounded-xl bg-secondary/60 px-3.5 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Suggested remediation
                    </p>
                    <p className="mt-0.5 text-sm text-foreground">{item.remediation}</p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-row gap-6 lg:flex-col lg:items-end lg:gap-3 lg:text-right">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Deadline</p>
                    <p className={cn("text-sm font-semibold", urgent ? "text-[var(--destructive)]" : "text-foreground")}>
                      {item.deadline}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.daysLeft} days left</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Owner</p>
                    <p className="inline-flex items-center gap-1 text-sm text-foreground">
                      <User2 className="h-3.5 w-3.5 text-muted-foreground" />
                      {item.owner}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="self-end" onClick={() => openPanel(`How should I remediate: ${item.title}?`)}>
                    Remediate
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-transparent bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
