import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Check, Loader2, X, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import type { MissionCard } from "~/data/types";
import { MISSION_STAGES } from "~/data/mock";
import { AGENTS } from "~/data/agents";
import { AgentIcon } from "~/components/agent-icon";
import { Button } from "~/components/ui/primitives";
import { cn } from "~/lib/utils";

type StageState = "pending" | "running" | "done";

export function MissionRunner({ mission, onClose }: { mission: MissionCard; onClose: () => void }) {
  const [states, setStates] = useState<StageState[]>(() => MISSION_STAGES.map(() => "pending"));
  const [active, setActive] = useState(0);
  const agent = AGENTS[mission.agent];
  const isPayroll = mission.id === "mission-payroll-close";
  const complete = states.every((s) => s === "done");

  useEffect(() => {
    let cancelled = false;
    setStates(MISSION_STAGES.map((_, i) => (i === 0 ? "running" : "pending")));
    setActive(0);

    function runStage(i: number) {
      if (cancelled || i >= MISSION_STAGES.length) return;
      const delay = 850 + Math.random() * 500;
      const timer = setTimeout(() => {
        if (cancelled) return;
        setStates((prev) => {
          const next = [...prev];
          next[i] = "done";
          if (i + 1 < next.length) next[i + 1] = "running";
          return next;
        });
        setActive(Math.min(i + 1, MISSION_STAGES.length - 1));
        runStage(i + 1);
      }, delay);
      return timer;
    }
    const t = runStage(0);
    return () => {
      cancelled = true;
      if (t) clearTimeout(t);
    };
  }, [mission.id]); // eslint-disable-line

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm animate-fade-in-fast" onClick={onClose} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card mino-shadow-lg animate-scale-in">
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div className="flex items-start gap-3">
            <AgentIcon agent={mission.agent} size="lg" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                {complete ? "Mission ready" : "Running mission"}
              </p>
              <h3 className="text-lg font-semibold text-foreground">{mission.name}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{agent.name} coordinating</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          <ol className="relative space-y-1">
            {MISSION_STAGES.map((stage, i) => {
              const state = states[i];
              return (
                <li key={stage.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300",
                        state === "done" && "border-[var(--chart-2)] bg-[var(--chart-2)] text-white",
                        state === "running" && "border-[var(--primary)] bg-accent text-[var(--primary)]",
                        state === "pending" && "border-border bg-card text-muted-foreground",
                      )}
                    >
                      {state === "done" ? (
                        <Check className="h-4 w-4" />
                      ) : state === "running" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span className="text-xs font-semibold">{i + 1}</span>
                      )}
                    </span>
                    {i < MISSION_STAGES.length - 1 && (
                      <span
                        className={cn(
                          "my-1 w-0.5 flex-1 rounded-full transition-colors duration-500",
                          states[i] === "done" ? "bg-[var(--chart-2)]" : "bg-border",
                        )}
                        style={{ minHeight: 18 }}
                      />
                    )}
                  </div>
                  <div className={cn("pb-3 transition-opacity", state === "pending" ? "opacity-50" : "opacity-100")}>
                    <p className="text-sm font-medium text-foreground">{stage.label}</p>
                    <p className="text-xs text-muted-foreground">{stage.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="border-t border-border bg-secondary/50 px-6 py-4">
          {complete ? (
            <div className="animate-fade-in">
              <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <ShieldCheck className="h-4 w-4 text-[var(--chart-2)]" />
                Ready to execute — nothing has run yet. Your approval is required.
              </p>
              <div className="mt-3 flex items-center justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                {isPayroll ? (
                  <Link to="/payroll" onClick={onClose}>
                    <Button>
                      Review payroll packet
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/approvals" onClick={onClose}>
                    <Button>
                      Review in Approvals
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-[var(--primary)]" />
              {MISSION_STAGES[active].label}…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
