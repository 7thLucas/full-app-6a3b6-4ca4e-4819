import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Rocket,
  Banknote,
  UserPlus,
  ShieldCheck,
  HeartPulse,
  CheckSquare,
  ScrollText,
  Settings,
  Sparkles,
} from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { cn } from "~/lib/utils";

const NAV = [
  { to: "/today", label: "Today", icon: LayoutDashboard },
  { to: "/missions", label: "Agent Missions", icon: Rocket },
  { to: "/payroll", label: "Payroll Close", icon: Banknote },
  { to: "/onboarding", label: "Onboarding", icon: UserPlus },
  { to: "/compliance", label: "Compliance", icon: ShieldCheck },
  { to: "/retention", label: "Retention", icon: HeartPulse },
  { to: "/approvals", label: "Approvals", icon: CheckSquare, badgeKey: "approvals" },
  { to: "/audit", label: "Audit Log", icon: ScrollText },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  approvalsCount,
  onNavigate,
}: {
  approvalsCount: number;
  onNavigate?: () => void;
}) {
  const { config } = useConfigurables();
  const appName = config?.appName || "Mino Autopilot";
  const company = config?.companyName || "Omni HR";
  const logo = config?.logoUrl;

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex items-center gap-2.5 px-5 py-5">
        {logo ? (
          <img src={logo} alt={appName} className="h-9 w-9 rounded-xl object-cover" />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-4.5 w-4.5" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{appName}</p>
          <p className="truncate text-xs text-sidebar-foreground">for {company}</p>
        </div>
      </div>

      <nav className="mino-scroll flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {NAV.map(({ to, label, icon: Icon, badgeKey }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-secondary hover:text-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn(
                    "h-4.5 w-4.5 shrink-0 transition-colors",
                    isActive ? "text-[var(--sidebar-primary)]" : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                <span className="flex-1 truncate">{label}</span>
                {badgeKey === "approvals" && approvalsCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                    {approvalsCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4">
        <div className="rounded-xl border border-border bg-card p-3.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-[var(--chart-2)] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--chart-2)]" />
            </span>
            <p className="text-xs font-semibold text-foreground">7 agents online</p>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Monitoring payroll, compliance, onboarding & retention across 5 countries.
          </p>
        </div>
      </div>
    </div>
  );
}
