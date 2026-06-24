# Mino Autopilot — Backlog

Gap analysis of the implemented app against [product-overview.md](./product-overview.md).
Last reviewed: 2026-06-24.

**Verdict: ~95% complete.** All 9 surfaces + Ask Mino + shell + the 7-agent
scaffold + 340-person / 5-country mock data are built and content-complete.
Remaining gaps are depth/polish plus a few "looks-done-but-isn't" items.

## 🔴 Real gaps (contradict the spec)

1. **Safety gate is cosmetic.** Spec calls it *"non-negotiable… never executes
   without human approval"* and the emotional core. Reality: approval is local
   `useState`, not enforced; a refresh resets decisions to pending; and
   "auto-safe" agents (Onboarding, Performance) bypass the gate entirely. For a
   mock prototype "execution" is simulated anyway, but the gate should *feel*
   real and consistent.
   - `app/routes/_app.approvals.tsx:31`, `app/data/agents.ts:39,65`

2. **Top command-bar search is non-functional.** The input is static — no
   `onChange` / handler / navigation. Spec wants a working command bar; scope
   says *"no broken buttons."* Dead control.
   - `app/components/shell/topbar.tsx:25`

3. **No cross-route state.** Decisions are held in per-route `useState` with no
   shared store. Approving on Today is not reflected in Approvals or the sidebar
   badge, and navigating away then back resets state. Breaks demo continuity.
   - No shared store / context found for HR state.

## 🟡 Partial / thin vs spec

4. **Empty states.** Spec: *"excellent empty states."* Only Audit, Mission
   Runner, and Ask Mino have them. Compliance (filtered), Approvals (all
   decided), Retention, and Onboarding likely render nothing or awkwardly when
   empty.
5. **Mobile responsive.** Sidebar has a mobile toggle, but full per-page
   responsive behavior is unverified. Spec wants mobile responsive, desktop
   optimized.
6. **Hero demo flow continuity.** Each step works (Today → launch mission →
   runner → Payroll approve), but because of #3 the approval doesn't propagate;
   "Mino marks it complete" is per-page only.

## 🟢 Done well (no gap)

- All 9 nav surfaces render real content (not stubs).
- Today grouped Critical / Important / Suggested with confidence + CTAs.
- Payroll Close: all four variances + leave impact + compliance flags +
  suggested Finance explanation + approval checklist + both CTAs.
- Onboarding / Compliance / Retention / Approvals / Audit: full field coverage.
- 7 agents are real TS data structures with all six contract fields
  (`app/data/agents.ts`), wired to the agentic backend service.
- Configurables: branding / copy / colors flow through `useConfigurables()`,
  not hardcoded — follows CLAUDE.md.
- 340 employees across SG / ID / MY / PH / HK (96 / 88 / 64 / 58 / 34).
  Mock-only, as scoped.

## Priority order

1. Make search work (or remove it) — eliminates the broken-button.
2. Lift approvals/decisions into a shared store → demo continuity, sidebar badge
   sync, and the gate feels real.
3. Add empty states to the remaining surfaces.
