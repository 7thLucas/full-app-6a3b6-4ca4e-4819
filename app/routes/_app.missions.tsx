import { useState } from "react";
import { Link } from "react-router";
import { Clock, History, Play, Star, ArrowRight } from "lucide-react";
import { MISSIONS } from "~/data/mock";
import { AGENTS, AGENT_LIST } from "~/data/agents";
import type { MissionCard as MissionCardType } from "~/data/types";
import { AgentIcon } from "~/components/agent-icon";
import { Badge, RiskBadge } from "~/components/ui/badge";
import { Button, Card } from "~/components/ui/primitives";
import { PageHeader } from "~/components/shell/page-header";
import { MissionRunner } from "~/components/missions/mission-runner";

export function meta() {
  return [{ title: "Agent Missions · Mino Autopilot" }];
}

export default function MissionsPage() {
  const [running, setRunning] = useState<MissionCardType | null>(null);

  return (
    <div>
      <PageHeader
        eyebrow="Mission control"
        title="Agent Missions"
        description="Launch a coordinated agentic workflow. Mino reads the data, checks policy, detects anomalies, prepares recommendations, and routes approvals — it never executes without you."
      />

      <div className="grid gap-4 mino-stagger md:grid-cols-2">
        {MISSIONS.map((mission) => {
          const agent = AGENTS[mission.agent];
          return (
            <Card
              key={mission.id}
              interactive
              className={cardClass(mission.flagship)}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <AgentIcon agent={mission.agent} size="lg" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-foreground">{mission.name}</h3>
                        {mission.flagship && (
                          <Badge tone="info">
                            <Star className="h-3 w-3" />
                            Flagship
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{agent.name}</p>
                    </div>
                  </div>
                  <RiskBadge risk={mission.risk} />
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{mission.description}</p>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[var(--chart-2)]" />
                    Saves {mission.timeSaved}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5" />
                    {mission.lastRun}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  {mission.flagship && (
                    <Link to="/payroll">
                      <Button variant="outline" size="sm">
                        Open Payroll Close
                      </Button>
                    </Link>
                  )}
                  <Button size="sm" onClick={() => setRunning(mission)}>
                    <Play className="h-3.5 w-3.5" />
                    {mission.cta}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Agent roster */}
      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
            The agent team behind the missions
          </h2>
          <Link
            to="/settings"
            className="inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:underline"
          >
            Configure agents
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-3 mino-stagger sm:grid-cols-2 lg:grid-cols-3">
          {AGENT_LIST.map((agent) => (
            <Card key={agent.key} className="p-4">
              <div className="flex items-center gap-2.5">
                <AgentIcon agent={agent.key} />
                <div>
                  <p className="text-sm font-semibold text-foreground">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.approvalLevel}</p>
                </div>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">{agent.goal}</p>
            </Card>
          ))}
        </div>
      </div>

      {running && <MissionRunner mission={running} onClose={() => setRunning(null)} />}
    </div>
  );
}

function cardClass(flagship?: boolean) {
  return flagship
    ? "border-[color-mix(in_srgb,var(--primary)_30%,var(--border))] bg-gradient-to-br from-accent to-card"
    : "";
}
