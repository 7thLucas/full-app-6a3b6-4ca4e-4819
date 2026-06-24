import { ShieldCheck, Globe2, Sparkles, Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useConfigurables } from "~/modules/configurables";
import { AGENT_LIST } from "~/data/agents";
import type { AgentProfile } from "~/data/types";
import { AgentIcon } from "~/components/agent-icon";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/primitives";
import { PageHeader } from "~/components/shell/page-header";
import { cn } from "~/lib/utils";

export function meta() {
  return [{ title: "Settings · Mino Autopilot" }];
}

const statusTone: Record<AgentProfile["executionStatus"], "completed" | "info" | "warning" | "neutral"> = {
  idle: "neutral",
  monitoring: "completed",
  preparing: "info",
  "awaiting-approval": "warning",
  executing: "info",
  completed: "completed",
};

const statusLabel: Record<AgentProfile["executionStatus"], string> = {
  idle: "Idle",
  monitoring: "Monitoring",
  preparing: "Preparing",
  "awaiting-approval": "Awaiting approval",
  executing: "Executing",
  completed: "Completed",
};

export default function SettingsPage() {
  const { config } = useConfigurables();
  const countries = config?.countries ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        description="The coordinated agent team, safety controls, and the jurisdictions Mino monitors."
      />

      {/* Workspace overview */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground">Workspace</h3>
          <dl className="mt-3 grid grid-cols-2 gap-y-3 text-sm">
            <Field label="App name" value={config?.appName || "Mino Autopilot"} />
            <Field label="Customer" value={config?.companyName || "Omni HR"} />
            <Field label="Operator" value={`${config?.operatorName || "Sarah"} · ${config?.operatorRole || "HR Operations Lead"}`} />
            <Field label="Headcount" value={String(config?.headcount ?? 340)} />
          </dl>
        </Card>

        <Card className="p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Globe2 className="h-4 w-4 text-[var(--primary)]" />
            Jurisdictions
          </h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {countries.map((c) => (
              <span
                key={c.code}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-sm text-foreground"
              >
                <span>{c.flag}</span>
                {c.name}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Safety */}
      <Card className="mb-8 flex items-start gap-3 border-[color-mix(in_srgb,var(--chart-2)_28%,var(--border))] bg-[color-mix(in_srgb,var(--chart-2)_7%,var(--card))] p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--chart-2)] text-white">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Safety model</h3>
            <Toggle on={config?.enableAuditLog !== false} label="Audit log" />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {config?.safetyStatement || "Mino never executes a sensitive HR action without human approval."}
          </p>
        </div>
      </Card>

      {/* Agent team */}
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[var(--primary)]" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">Agent team</h2>
        <span className="text-xs text-muted-foreground">{AGENT_LIST.length} specialized agents · coordinated</span>
      </div>
      <div className="space-y-3">
        {AGENT_LIST.map((agent) => (
          <AgentRow key={agent.key} agent={agent} />
        ))}
      </div>
    </div>
  );
}

function AgentRow({ agent }: { agent: AgentProfile }) {
  const [open, setOpen] = useState(false);
  return (
    <Card interactive={!open} className="overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <AgentIcon agent={agent.key} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{agent.name}</p>
            <Badge tone={statusTone[agent.executionStatus]} dot>
              {statusLabel[agent.executionStatus]}
            </Badge>
          </div>
          <p className="truncate text-xs text-muted-foreground">{agent.goal}</p>
        </div>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="grid gap-4 border-t border-border px-5 py-4 animate-fade-in sm:grid-cols-2">
          <Detail label="Goal" value={agent.goal} />
          <Detail label="Required approval level" value={agent.approvalLevel} />
          <div className="sm:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Inputs</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {agent.inputs.map((i) => (
                <Badge key={i} tone="neutral">
                  {i}
                </Badge>
              ))}
            </div>
          </div>
          <Detail label="Reasoning summary" value={agent.reasoningSummary} className="sm:col-span-2" />
          <Detail label="Suggested action" value={agent.suggestedAction} className="sm:col-span-2" />
        </div>
      )}
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium text-foreground">{value}</dd>
    </div>
  );
}

function Detail({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{value}</p>
    </div>
  );
}

function Toggle({ on, label }: { on: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      {label}
      <span
        className={cn(
          "inline-flex h-5 w-9 items-center rounded-full px-0.5 transition-colors",
          on ? "bg-[var(--chart-2)]" : "bg-secondary",
        )}
      >
        <span
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-full bg-white transition-transform",
            on ? "translate-x-4" : "translate-x-0",
          )}
        >
          {on && <Check className="h-2.5 w-2.5 text-[var(--chart-2)]" />}
        </span>
      </span>
    </span>
  );
}
