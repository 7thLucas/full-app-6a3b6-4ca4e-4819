import { useState } from "react";
import {
  ShieldCheck,
  Check,
  X,
  PencilLine,
  Database,
  User2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { APPROVAL_ITEMS } from "~/data/mock";
import type { ApprovalItem } from "~/data/types";
import { AGENTS } from "~/data/agents";
import { AgentIcon } from "~/components/agent-icon";
import { Badge, RiskBadge } from "~/components/ui/badge";
import { Button, Card, EmptyState } from "~/components/ui/primitives";
import { PageHeader } from "~/components/shell/page-header";
import { useAskMino } from "~/components/ask-mino/context";

export function meta() {
  return [{ title: "Approvals · Mino Autopilot" }];
}

type Decision = ApprovalItem["status"];

export default function ApprovalsPage() {
  const { config } = useConfigurables();
  const { openPanel } = useAskMino();
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});

  const pending = APPROVAL_ITEMS.filter((a) => (decisions[a.id] ?? a.status) === "pending");
  const decided = APPROVAL_ITEMS.filter((a) => (decisions[a.id] ?? a.status) !== "pending");

  const safety = config?.safetyStatement || "Mino never executes a sensitive HR action without human approval.";

  function decide(id: string, d: Decision) {
    setDecisions((prev) => ({ ...prev, [id]: d }));
  }

  return (
    <div>
      <PageHeader
        eyebrow="The safety layer"
        title="Approvals"
        description="Every agent-proposed action lands here first. Mino assembled the reasoning and evidence — you make the call."
      />

      <Card className="mb-6 flex items-center gap-2 border-[color-mix(in_srgb,var(--chart-2)_28%,var(--border))] bg-[color-mix(in_srgb,var(--chart-2)_7%,var(--card))] p-4">
        <ShieldCheck className="h-5 w-5 shrink-0 text-[var(--chart-2)]" />
        <p className="text-sm text-foreground">{safety}</p>
      </Card>

      {pending.length > 0 ? (
        <div className="space-y-3 mino-stagger">
          {pending.map((item) => (
            <ApprovalCard
              key={item.id}
              item={item}
              onDecide={(d) => decide(item.id, d)}
              onAsk={() => openPanel(`Walk me through this proposed action: ${item.action}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Check className="h-6 w-6" />}
          title="Inbox zero — every action is decided"
          description="No proposals are waiting for approval. Mino will route the next one here with full reasoning and the data it used."
        />
      )}

      {decided.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Decided</h2>
          <div className="space-y-2.5">
            {decided.map((item) => (
              <DecidedRow key={item.id} item={item} decision={decisions[item.id] ?? item.status} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ApprovalCard({
  item,
  onDecide,
  onAsk,
}: {
  item: ApprovalItem;
  onDecide: (d: Decision) => void;
  onAsk: () => void;
}) {
  const agent = AGENTS[item.agent];
  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <AgentIcon agent={item.agent} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">{agent.short} Agent</Badge>
            <RiskBadge risk={item.risk} />
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {item.requestedAt}
            </span>
          </div>
          <h3 className="mt-2.5 text-base font-semibold leading-snug text-foreground">{item.action}</h3>

          <div className="mt-3 rounded-xl bg-secondary/60 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Agent reasoning</p>
            <p className="mt-0.5 text-sm leading-relaxed text-foreground">{item.reasoning}</p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Database className="h-3.5 w-3.5" />
              Data used:
            </span>
            {item.dataUsed.map((d) => (
              <Badge key={d} tone="neutral">
                {d}
              </Badge>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <User2 className="h-3.5 w-3.5" />
              Approver: <span className="font-medium text-foreground">{item.approver}</span>
            </span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onAsk}>
                <Sparkles className="h-3.5 w-3.5" />
                Ask Mino
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDecide("changes-requested")}>
                <PencilLine className="h-3.5 w-3.5" />
                Request changes
              </Button>
              <Button variant="danger" size="sm" onClick={() => onDecide("rejected")}>
                <X className="h-3.5 w-3.5" />
                Reject
              </Button>
              <Button variant="success" size="sm" onClick={() => onDecide("approved")}>
                <Check className="h-3.5 w-3.5" />
                Approve
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function DecidedRow({ item, decision }: { item: ApprovalItem; decision: Decision }) {
  const meta: Record<Exclude<Decision, "pending">, { tone: "completed" | "critical" | "warning"; label: string; icon: React.ReactNode }> = {
    approved: { tone: "completed", label: "Approved", icon: <Check className="h-3.5 w-3.5" /> },
    rejected: { tone: "critical", label: "Rejected", icon: <X className="h-3.5 w-3.5" /> },
    "changes-requested": { tone: "warning", label: "Changes requested", icon: <PencilLine className="h-3.5 w-3.5" /> },
  };
  const m = meta[decision as Exclude<Decision, "pending">];
  return (
    <Card className="flex items-center justify-between gap-3 p-3.5 animate-fade-in">
      <div className="flex items-center gap-3">
        <AgentIcon agent={item.agent} size="sm" />
        <p className="text-sm text-foreground">{item.action}</p>
      </div>
      <Badge tone={m.tone}>
        {m.icon}
        {m.label}
      </Badge>
    </Card>
  );
}
