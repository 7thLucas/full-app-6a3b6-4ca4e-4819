import { useMemo, useState } from "react";
import { ShieldCheck, Database, User2, ArrowRight, Search } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { AUDIT_ENTRIES } from "~/data/mock";
import type { AuditEntry, StatusTone } from "~/data/types";
import { AGENTS } from "~/data/agents";
import { AgentIcon } from "~/components/agent-icon";
import { Badge } from "~/components/ui/badge";
import { Card, EmptyState } from "~/components/ui/primitives";
import { PageHeader } from "~/components/shell/page-header";

export function meta() {
  return [{ title: "Audit Log · Mino Autopilot" }];
}

const outcomeTone: Record<StatusTone, "completed" | "warning" | "info" | "critical"> = {
  completed: "completed",
  warning: "warning",
  info: "info",
  critical: "critical",
  neutral: "info",
};

export default function AuditPage() {
  const { config } = useConfigurables();
  const [query, setQuery] = useState("");
  const enabled = config?.enableAuditLog !== false;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return AUDIT_ENTRIES;
    return AUDIT_ENTRIES.filter((e) =>
      [e.action, e.reasoning, e.dataAccessed, AGENTS[e.agent].name].join(" ").toLowerCase().includes(q),
    );
  }, [query]);

  if (!enabled) {
    return (
      <div>
        <PageHeader eyebrow="Transparency" title="Audit Log" />
        <EmptyState
          icon={<ShieldCheck className="h-6 w-6" />}
          title="Audit log is disabled"
          description="Enable the audit log in Settings to record every agent action, the data it accessed, and the human who approved it."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Transparency"
        title="Audit Log"
        description="Every agent action, the data it accessed, its reasoning, the human approval, and the final outcome — a provable trail for enterprise trust."
      />

      <Card className="mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm text-foreground">
          <ShieldCheck className="h-4 w-4 text-[var(--chart-2)]" />
          {AUDIT_ENTRIES.length} actions logged · 100% with a matching approval or auto-safe policy.
        </p>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the trail..."
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[color-mix(in_srgb,var(--primary)_50%,var(--border))]"
          />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-6 w-6" />}
          title="No matching trail entries"
          description="Try a different search term — every agent action is recorded here."
        />
      ) : (
        <Card className="overflow-hidden">
          <ol className="divide-y divide-border">
            {filtered.map((entry) => (
              <AuditRow key={entry.id} entry={entry} />
            ))}
          </ol>
        </Card>
      )}
    </div>
  );
}

function AuditRow({ entry }: { entry: AuditEntry }) {
  const agent = AGENTS[entry.agent];
  return (
    <li className="flex gap-3.5 px-5 py-4 transition-colors hover:bg-secondary/40">
      <AgentIcon agent={entry.agent} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{entry.action}</p>
          <Badge tone={outcomeTone[entry.outcome]}>{agent.short} Agent</Badge>
          <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{entry.reasoning}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5" />
            {entry.dataAccessed}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <User2 className="h-3.5 w-3.5" />
            {entry.approvedBy ? `Approved by ${entry.approvedBy}` : "Awaiting approval"}
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
            <ArrowRight className="h-3.5 w-3.5 text-[var(--primary)]" />
            {entry.finalAction}
          </span>
        </div>
      </div>
    </li>
  );
}
