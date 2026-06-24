import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "~/components/shell/sidebar";
import { Topbar } from "~/components/shell/topbar";
import { AskMinoProvider } from "~/components/ask-mino/context";
import { AskMinoDrawer } from "~/components/ask-mino/ask-mino-drawer";
import { APPROVAL_ITEMS } from "~/data/mock";
import { cn } from "~/lib/utils";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pendingApprovals = APPROVAL_ITEMS.filter((a) => a.status === "pending").length;

  return (
    <AskMinoProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-border lg:block">
          <Sidebar approvalsCount={pendingApprovals} />
        </aside>

        {/* Mobile sidebar */}
        <div
          className={cn(
            "fixed inset-0 z-50 lg:hidden",
            mobileOpen ? "pointer-events-auto" : "pointer-events-none",
          )}
        >
          <div
            className={cn(
              "absolute inset-0 bg-foreground/30 transition-opacity duration-300",
              mobileOpen ? "opacity-100" : "opacity-0",
            )}
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className={cn(
              "absolute left-0 top-0 h-full w-72 border-r border-border bg-sidebar transition-transform duration-300 mino-shadow-lg",
              mobileOpen ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <Sidebar approvalsCount={pendingApprovals} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenSidebar={() => setMobileOpen(true)} />
          <main className="mino-scroll flex-1 overflow-y-auto">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              <Outlet />
            </div>
          </main>
        </div>

        <AskMinoDrawer />
      </div>
    </AskMinoProvider>
  );
}
