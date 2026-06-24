import {
  Banknote,
  ShieldCheck,
  UserPlus,
  HeartPulse,
  Target,
  Route,
  ScrollText,
} from "lucide-react";
import type { AgentKey } from "~/data/types";
import { AGENTS } from "~/data/agents";
import { cn } from "~/lib/utils";

const iconMap: Record<AgentKey, React.ComponentType<{ className?: string }>> = {
  payroll: Banknote,
  compliance: ShieldCheck,
  onboarding: UserPlus,
  retention: HeartPulse,
  performance: Target,
  "approval-routing": Route,
  audit: ScrollText,
};

export function AgentIcon({
  agent,
  className,
  size = "md",
}: {
  agent: AgentKey;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const Icon = iconMap[agent];
  const accent = AGENTS[agent].accent;
  const box = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-11 w-11" : "h-9 w-9";
  const ic = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-5 w-5" : "h-4.5 w-4.5";
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-xl", box, className)}
      style={{
        background: `color-mix(in srgb, var(--${accent}) 14%, transparent)`,
        color: `var(--${accent})`,
      }}
    >
      <Icon className={ic} />
    </span>
  );
}
