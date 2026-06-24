import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface AskMinoContextValue {
  open: boolean;
  seedPrompt: string | null;
  openPanel: (prompt?: string) => void;
  closePanel: () => void;
  consumeSeed: () => string | null;
}

const AskMinoContext = createContext<AskMinoContextValue | null>(null);

export function AskMinoProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [seedPrompt, setSeedPrompt] = useState<string | null>(null);

  const openPanel = useCallback((prompt?: string) => {
    if (prompt) setSeedPrompt(prompt);
    setOpen(true);
  }, []);

  const closePanel = useCallback(() => setOpen(false), []);

  const consumeSeed = useCallback(() => {
    const s = seedPrompt;
    setSeedPrompt(null);
    return s;
  }, [seedPrompt]);

  const value = useMemo(
    () => ({ open, seedPrompt, openPanel, closePanel, consumeSeed }),
    [open, seedPrompt, openPanel, closePanel, consumeSeed],
  );

  return <AskMinoContext.Provider value={value}>{children}</AskMinoContext.Provider>;
}

export function useAskMino() {
  const ctx = useContext(AskMinoContext);
  if (!ctx) throw new Error("useAskMino must be used within <AskMinoProvider>");
  return ctx;
}
