import { cn } from "~/lib/utils";
import type { Severity, RiskLevel, StatusTone } from "~/data/types";

type Tone = StatusTone;

const toneClasses: Record<Tone, string> = {
  completed: "bg-[color-mix(in_srgb,var(--chart-2)_14%,transparent)] text-[var(--chart-2)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--chart-2)_28%,transparent)]",
  warning: "bg-[color-mix(in_srgb,var(--chart-3)_15%,transparent)] text-[var(--chart-3)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--chart-3)_30%,transparent)]",
  critical: "bg-[color-mix(in_srgb,var(--destructive)_12%,transparent)] text-[var(--destructive)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--destructive)_28%,transparent)]",
  info: "bg-accent text-accent-foreground ring-1 ring-inset ring-[color-mix(in_srgb,var(--primary)_22%,transparent)]",
  neutral: "bg-secondary text-secondary-foreground ring-1 ring-inset ring-border",
};

export function Badge({
  tone = "neutral",
  className,
  children,
  dot = false,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

const severityTone: Record<Severity, Tone> = {
  critical: "critical",
  important: "warning",
  suggested: "info",
};
const severityLabel: Record<Severity, string> = {
  critical: "Critical",
  important: "Important",
  suggested: "Suggested",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <Badge tone={severityTone[severity]} dot>
      {severityLabel[severity]}
    </Badge>
  );
}

const riskTone: Record<RiskLevel, Tone> = {
  low: "completed",
  medium: "warning",
  high: "critical",
};
const riskLabel: Record<RiskLevel, string> = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
};

export function RiskBadge({ risk, compact = false }: { risk: RiskLevel; compact?: boolean }) {
  return <Badge tone={riskTone[risk]}>{compact ? risk[0].toUpperCase() + risk.slice(1) : riskLabel[risk]}</Badge>;
}
