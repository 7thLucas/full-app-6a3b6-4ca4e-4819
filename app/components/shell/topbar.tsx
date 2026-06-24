import { Search, Sparkles, Menu, ShieldCheck } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { useAskMino } from "~/components/ask-mino/context";
import { Button } from "~/components/ui/primitives";

export function Topbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { config } = useConfigurables();
  const { openPanel } = useAskMino();
  const askLabel = config?.askMinoLabel || "Ask Mino";
  const enableAsk = config?.enableAskMino !== false;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-[color-mix(in_srgb,var(--navbar-background)_88%,transparent)] px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onOpenSidebar}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search people, missions, approvals..."
          className="h-9 w-full rounded-xl border border-border bg-background pl-9 pr-16 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[color-mix(in_srgb,var(--primary)_50%,var(--border))] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_18%,transparent)]"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground sm:block">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--chart-2)_12%,transparent)] px-3 py-1 text-xs font-medium text-[var(--chart-2)] md:inline-flex">
          <ShieldCheck className="h-3.5 w-3.5" />
          Approval-gated
        </span>
        {enableAsk && (
          <Button onClick={() => openPanel()} size="md" className="animate-pulse-ring">
            <Sparkles className="h-4 w-4" />
            {askLabel}
          </Button>
        )}
      </div>
    </header>
  );
}
