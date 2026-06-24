import { useEffect, useRef, useState } from "react";
import { Sparkles, X, ArrowRight, Send, ShieldCheck } from "lucide-react";
import { invokeLLM } from "~/modules/agentic";
import { useConfigurables } from "~/modules/configurables";
import { useAskMino } from "./context";
import { fallbackAnswer, type StructuredAnswer } from "./answers";
import { Button } from "~/components/ui/primitives";
import { cn } from "~/lib/utils";

interface ChatTurn {
  id: string;
  role: "user" | "mino";
  text?: string;
  answer?: StructuredAnswer;
}

const ANSWER_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    points: { type: "array", items: { type: "string" } },
    nextActions: { type: "array", items: { type: "string" } },
  },
  required: ["summary", "points", "nextActions"],
};

export function AskMinoDrawer() {
  const { open, closePanel, consumeSeed } = useAskMino();
  const { config } = useConfigurables();
  const label = config?.askMinoLabel || "Ask Mino";
  const suggestions = config?.askMinoSuggestions ?? [];

  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const seed = consumeSeed();
    if (seed) {
      void send(seed);
    }
  }, [open]); // eslint-disable-line

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, busy]);

  async function send(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    setInput("");
    const userTurn: ChatTurn = { id: `u-${Date.now()}`, role: "user", text: q };
    setTurns((t) => [...t, userTurn]);
    setBusy(true);

    let answer: StructuredAnswer;
    try {
      const result = await invokeLLM({
        message: q,
        schema: ANSWER_SCHEMA,
        systemPrompt:
          "You are Mino, the HR chief-of-staff for Omni HR, a 340-person company across Singapore, Indonesia, Malaysia, Philippines, and Hong Kong. Answer concisely and structured. Context: payroll close has one variance (Indonesia overtime +31%); 3 Singapore employees missing IR8A docs; Philippines Support attrition risk cluster; 2 new hires blocked before day one; 12 managers behind on reviews; 4 approvals pending. You never execute sensitive actions without human approval. Always end with concrete suggested next actions.",
      });
      const r = result.response as Partial<StructuredAnswer> | null;
      if (r && r.summary && Array.isArray(r.points) && Array.isArray(r.nextActions)) {
        answer = { summary: r.summary, points: r.points, nextActions: r.nextActions };
      } else {
        answer = fallbackAnswer(q);
      }
    } catch {
      answer = fallbackAnswer(q);
    }

    setTurns((t) => [...t, { id: `m-${Date.now()}`, role: "mino", answer }]);
    setBusy(false);
  }

  return (
    <>
      {/* Scrim */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px] transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closePanel}
        aria-hidden
      />

      {/* Panel */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-card transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] mino-shadow-lg",
          open ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-label={label}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">Your HR chief of staff</p>
            </div>
          </div>
          <button
            onClick={closePanel}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div ref={scrollRef} className="mino-scroll flex-1 overflow-y-auto px-5 py-5">
          {turns.length === 0 && !busy && (
            <div className="animate-fade-in">
              <p className="text-sm text-muted-foreground">
                Ask me anything about payroll, onboarding, compliance, or retention. I'll answer
                concisely and always suggest the next action.
              </p>
              <div className="mt-5 space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Try asking
                </p>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="group flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-2.5 text-left text-sm text-foreground transition-all hover:border-[color-mix(in_srgb,var(--primary)_40%,var(--border))] hover:bg-accent"
                  >
                    <span>{s}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--primary)]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-5">
            {turns.map((turn) => (
              <div key={turn.id} className="animate-fade-in">
                {turn.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                      {turn.text}
                    </div>
                  </div>
                ) : (
                  turn.answer && <MinoAnswer answer={turn.answer} />
                )}
              </div>
            ))}

            {busy && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-[var(--primary)]">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <span className="mino-typing flex items-center">
                  <span /><span /><span />
                </span>
              </div>
            )}
          </div>
        </div>

        <footer className="border-t border-border px-5 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 focus-within:border-[color-mix(in_srgb,var(--primary)_50%,var(--border))] focus-within:ring-2 focus-within:ring-[color-mix(in_srgb,var(--primary)_20%,transparent)]"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${label}...`}
              className="flex-1 bg-transparent py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit" size="sm" disabled={!input.trim() || busy} className="h-8 w-8 p-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3" />
            Mino suggests — it never executes sensitive actions without approval.
          </p>
        </footer>
      </aside>
    </>
  );
}

function MinoAnswer({ answer }: { answer: StructuredAnswer }) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-[var(--primary)]">
        <Sparkles className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-border bg-background px-4 py-3">
        <p className="text-sm leading-relaxed text-foreground">{answer.summary}</p>
        {answer.points.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {answer.points.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        )}
        {answer.nextActions.length > 0 && (
          <div className="mt-3 rounded-xl bg-accent px-3 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
              Suggested next actions
            </p>
            <ul className="mt-1.5 space-y-1">
              {answer.nextActions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--primary)]" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
