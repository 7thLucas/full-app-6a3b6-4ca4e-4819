import { useState } from "react";
import { Link } from "react-router";
import { Sparkles, ShieldCheck, Check, ChevronRight, Zap } from "lucide-react";
import type { TodoCard as TodoCardType } from "~/data/types";
import { AGENTS } from "~/data/agents";
import { AgentIcon } from "~/components/agent-icon";
import { Badge, SeverityBadge } from "~/components/ui/badge";
import { Button, Card, Confidence } from "~/components/ui/primitives";
import { useAskMino } from "~/components/ask-mino/context";

const approvalLabel: Record<TodoCardType["approvalStatus"], { tone: "warning" | "completed" | "info"; text: string }> = {
  "needs-approval": { tone: "warning", text: "Needs approval" },
  "auto-safe": { tone: "completed", text: "Auto-safe action" },
  "in-review": { tone: "info", text: "In review" },
};

export function TodoCard({ card }: { card: TodoCardType }) {
  const { openPanel } = useAskMino();
  const [approved, setApproved] = useState(false);
  const agent = AGENTS[card.agent];
  const approval = approvalLabel[card.approvalStatus];
  const target = card.agent === "payroll" ? "/payroll" : card.agent === "onboarding" ? "/onboarding" : card.agent === "compliance" ? "/compliance" : card.agent === "retention" ? "/retention" : "/approvals";

  return (
    <Card interactive className="p-5">
      <div className="flex items-start gap-3">
        <AgentIcon agent={card.agent} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge severity={card.severity} />
            <Badge tone="neutral">{agent.short} Agent</Badge>
            {card.country && <Badge tone="neutral">{card.country}</Badge>}
          </div>
          <h3 className="mt-2.5 text-base font-semibold leading-snug text-foreground">{card.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{card.explanation}</p>

          <div className="mt-3.5 grid gap-2 rounded-xl bg-secondary/60 p-3 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Impact</p>
              <p className="mt-0.5 text-sm text-foreground">{card.impact}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Suggested next action
              </p>
              <p className="mt-0.5 flex items-start gap-1.5 text-sm text-foreground">
                <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--primary)]" />
                {card.suggestedAction}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Confidence value={card.confidence} />
              <span className="h-3 w-px bg-border" />
              <Badge tone={approval.tone}>
                {approval.tone === "completed" ? <Check className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                {approval.text}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => openPanel(`Tell me more about: ${card.title}`)}>
                <Sparkles className="h-3.5 w-3.5" />
                Ask Mino
              </Button>
              <Link to={target}>
                <Button variant="outline" size="sm">
                  Review
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              {approved ? (
                <Button variant="success" size="sm" disabled>
                  <Check className="h-3.5 w-3.5" />
                  Approved
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={() => setApproved(true)}>
                  Approve
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
