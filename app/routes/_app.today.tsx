import { useMemo } from "react";
import { Link } from "react-router";
import {
  AlertTriangle,
  ClipboardCheck,
  Globe2,
  Clock,
  Rocket,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { TODO_CARDS, STAT_SUMMARY } from "~/data/mock";
import type { Severity } from "~/data/types";
import { TodoCard } from "~/components/today/todo-card";
import { Stat, Button, Card } from "~/components/ui/primitives";
import { useAskMino } from "~/components/ask-mino/context";

export function meta() {
  return [{ title: "Today · Mino Autopilot" }];
}

const groups: { key: Severity; label: string; hint: string }[] = [
  { key: "critical", label: "Critical", hint: "Act now — risk or deadline exposure" },
  { key: "important", label: "Important", hint: "Address today to stay ahead" },
  { key: "suggested", label: "Suggested", hint: "Mino recommends, when you're ready" },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function TodayPage() {
  const { config } = useConfigurables();
  const { openPanel } = useAskMino();
  const name = config?.operatorName || "Sarah";
  const safety = config?.safetyStatement || "Mino never executes a sensitive HR action without human approval.";

  const grouped = useMemo(() => {
    return groups.map((g) => ({
      ...g,
      cards: TODO_CARDS.filter((c) => c.severity === g.key),
    }));
  }, []);

  const total = TODO_CARDS.length;

  return (
    <div>
      {/* Hero */}
      <div className="mb-6 animate-fade-in">
        <p className="text-sm font-medium text-muted-foreground">
          {greeting()}, {name}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
          {total} HR actions need your attention today
        </h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-[var(--chart-2)]" />
          {safety}
        </p>
      </div>

      {/* Stats */}
      <div className="mb-7 grid grid-cols-2 gap-3 mino-stagger lg:grid-cols-4">
        <Stat label="Actions today" value={STAT_SUMMARY.actionsToday} hint="2 critical · 2 important · 3 suggested" icon={<AlertTriangle className="h-4 w-4" />} />
        <Stat label="Pending approvals" value={STAT_SUMMARY.pendingApprovals} hint="Gated for safety" icon={<ClipboardCheck className="h-4 w-4" />} />
        <Stat label="Countries monitored" value={STAT_SUMMARY.countriesMonitored} hint="SG · ID · MY · PH · HK" icon={<Globe2 className="h-4 w-4" />} />
        <Stat label="Hours saved (month)" value={STAT_SUMMARY.hoursSavedThisMonth} hint="Across 7 agents" icon={<Clock className="h-4 w-4" />} />
      </div>

      {/* Flagship CTA */}
      <Card className="mb-8 overflow-hidden border-[color-mix(in_srgb,var(--primary)_30%,var(--border))] bg-gradient-to-br from-accent to-card p-5 animate-fade-in sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Rocket className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">Flagship mission</p>
              <h3 className="mt-0.5 text-lg font-semibold text-foreground">It's payroll week — Mino is ready to close.</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                One variance to explain (Indonesia overtime). Mino can prepare the Finance-ready packet in seconds.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" onClick={() => openPanel("Why did payroll increase this month?")}>
              <Sparkles className="h-4 w-4" />
              Ask Mino
            </Button>
            <Link to="/payroll">
              <Button>
                Prepare payroll close
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Grouped todos */}
      <div className="space-y-8">
        {grouped.map((group) => (
          <section key={group.key}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">{group.label}</h2>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1.5 text-xs font-semibold text-muted-foreground">
                  {group.cards.length}
                </span>
              </div>
              <p className="hidden text-xs text-muted-foreground sm:block">{group.hint}</p>
            </div>
            <div className="space-y-3 mino-stagger">
              {group.cards.map((card) => (
                <TodoCard key={card.id} card={card} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
