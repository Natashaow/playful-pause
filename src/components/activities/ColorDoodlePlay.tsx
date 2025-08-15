import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* --- Color options --- */
const COLORS = [
  { name: "Sunshine", value: "#FFE66D", emotion: "energized" },
  { name: "Ocean", value: "#4ECDC4", emotion: "calm" },
  { name: "Lavender", value: "#C7CEEA", emotion: "peaceful" },
  { name: "Coral", value: "#FF6B6B", emotion: "passionate" },
  { name: "Mint", value: "#95E1D3", emotion: "fresh" },
  { name: "Peach", value: "#FFB4B4", emotion: "warm" },
  { name: "Sky", value: "#A8E6CF", emotion: "hopeful" },
  { name: "Rose", value: "#FFD93D", emotion: "joyful" },
] as const;

type Chip = typeof COLORS[number];
type Phase = "inhale" | "hold" | "exhale" | "hold2";
type Mode = "let-go" | "invite-calm";
type Pattern = { inhale: number; hold: number; exhale: number; hold2?: number };

/* emotion → gentle pattern */
function patternFor(emotion: string): Pattern {
  switch (emotion) {
    case "peaceful":   return { inhale: 4, hold: 4, exhale: 4, hold2: 4 };
    case "calm":       return { inhale: 5, hold: 0, exhale: 5 };
    case "energized":  return { inhale: 3, hold: 0, exhale: 3 };
    case "passionate": return { inhale: 4, hold: 0, exhale: 6 };
    case "fresh":      return { inhale: 5, hold: 0, exhale: 5 };
    case "warm":       return { inhale: 4, hold: 0, exhale: 4 };
    case "hopeful":    return { inhale: 4, hold: 0, exhale: 6 };
    case "joyful":     return { inhale: 3, hold: 0, exhale: 4 };
    default:           return { inhale: 4, hold: 0, exhale: 6 };
  }
}

/* color personality → motion profile */
function motionProfile(name: string) {
  switch (name) {
    case "Sunshine":
    case "Peach":
    case "Rose":
      return { amp: 36, drift: { x: 6,  y: -20 } };
    case "Ocean":
    case "Mint":
    case "Sky":
      return { amp: 28, drift: { x: 18, y: -8 } };
    case "Lavender":
      return { amp: 24, drift: { x: 12, y: -12 } };
    case "Coral":
      return { amp: 32, drift: { x: 20, y: -18 } };
    default:
      return { amp: 28, drift: { x: 10, y: -10 } };
  }
}

function transformForPhase(phase: Phase, profile: { amp: number; drift: { x: number; y: number } }) {
  const { amp, drift } = profile;
  if (phase === "inhale")   return `translate(${drift.x}px, ${drift.y - amp}px) scale(1.5)`;
  if (phase === "hold" || phase === "hold2")
                            return `translate(${Math.round(drift.x * 0.8)}px, ${Math.round(drift.y - amp * 0.9)}px) scale(1.5)`;
  return "translate(0px, 0px) scale(1)";
}

function nextPhase(p: Phase, pat: Pattern): Phase {
  if (p === "inhale") return pat.hold ? "hold" : "exhale";
  if (p === "hold")   return "exhale";
  if (p === "exhale") return pat.hold2 ? "hold2" : "inhale";
  if (p === "hold2")  return "inhale";
  return "inhale";
}
function durationFor(p: Phase, pat: Pattern): number {
  if (p === "inhale") return pat.inhale;
  if (p === "hold")   return pat.hold || 0;
  if (p === "exhale") return pat.exhale;
  if (p === "hold2")  return pat.hold2 || 0;
  return 4;
}

export const BreathingAnimation = ({ onBack }: { onBack: () => void }) => {
  /* steps: color → prompt → breathe */
  const [step, setStep] = useState<"color" | "prompt" | "breathe">("color");
  const [selected, setSelected] = useState<Chip | null>(null);
  const [mode, setMode] = useState<Mode>("let-go");

  // engine
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [seconds, setSeconds] = useState(0);
  const [phaseDuration, setPhaseDuration] = useState(0);
  const timerRef = useRef<number | null>(null);

  const pattern = useMemo(() => patternFor(selected?.emotion ?? "calm"), [selected]);

  /* when entering breathe step */
  useEffect(() => {
    if (step !== "breathe") return;
    setPhase("inhale");
    setSeconds(pattern.inhale);
    setPhaseDuration(pattern.inhale);
    setRunning(true);
  }, [step, pattern]);

  /* tick */
  useEffect(() => {
    if (!running) return;
    timerRef.current = window.setInterval(() => {
      setSeconds((t) => {
        if (t > 1) return t - 1;
        setPhase((p) => {
          const nxt = nextPhase(p, pattern);
          const nextDur = durationFor(nxt, pattern);
          queueMicrotask(() => { setSeconds(nextDur); setPhaseDuration(nextDur); });
          return nxt;
        });
        return 0;
      });
    }, 1000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [running, pattern]);

  /* keyboard: Space to start/pause on prompt/breathe; Esc back to color */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        if (step === "prompt") { setStep("breathe"); return; }
        if (step === "breathe") setRunning(r => !r);
      }
      if (e.key === "Escape") setStep("color");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  /* bg tint (soft) */
  const bgStyle = useMemo(() => {
    const base = selected?.value ?? "hsl(var(--background))";
    const calm = "rgba(195,245,230,0.55)";
    const strength = step === "breathe"
      ? (phase === "inhale" ? "85%" : phase.includes("hold") ? "65%" : "45%")
      : "60%";
    return {
      background:
        `radial-gradient(60% 60% at 50% 28%, ${base} ${strength}, transparent 80%),` +
        `radial-gradient(70% 60% at 50% 100%, ${calm} 0%, transparent 70%)`,
      transition: "background 600ms ease",
    } as React.CSSProperties;
  }, [selected, phase, step]);

  const profile = motionProfile(selected?.name ?? "");
  const bubbleTransform = step === "breathe"
    ? transformForPhase(phase, profile)
    : "translate(0px, 0px) scale(1)";

  /* —— RENDER —— */
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Button onClick={onBack} variant="ghost" className="mb-6">← Back to Activities</Button>
      <div aria-hidden className="fixed inset-0 -z-10" style={bgStyle} />

      {/* STEP 1 — Color picker UI */}
      {step === "color" && (
        <>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading mb-2 bg-gradient-joy bg-clip-text text-transparent">
              What color makes you feel good right now?
            </h2>
            <p className="text-muted-foreground">Choose a color that speaks to your current mood.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {COLORS.map((c) => (
              <Card
                key={c.name}
                className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
                  selected?.name === c.name ? "border-primary shadow-glow" : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelected(c)}
              >
                <div className="w-full h-16 rounded-lg mb-3 shadow-soft" style={{ backgroundColor: c.value }} />
                <h3 className="font-semibold text-center text-sm">{c.name}</h3>
              </Card>
            ))}
          </div>

          {selected && (
            <Card className="p-6 text-center bg-gradient-calm border-0 shadow-soft">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full shadow-soft" style={{ backgroundColor: selected.value }} />
                <h3 className="text-xl font-semibold">You chose {selected.name}!</h3>
                <p className="text-muted-foreground">Perfect for feeling <span className="font-medium">{selected.emotion}</span>.</p>

                {/* Ready prompt */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <ModeToggle mode={mode} onChange={setMode} />
                  <Button size="lg" className="px-8" onClick={() => setStep("prompt")}>
                    Continue
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      {/* STEP 2 — Ready prompt (asks user to start breathing) */}
      {step === "prompt" && selected && (
        <Card className="p-10 sm:p-12 text-center bg-card/70 backdrop-blur border-0 shadow-soft min-h-[60vh] flex flex-col items-center justify-center">
          <div className="relative mb-6">
            <div
              className="w-28 h-28 rounded-full transition-transform ease-gentle-custom"
              style={{
                transitionDuration: "1s",
                transform: "translate(0,0) scale(1.1)",
                background: `radial-gradient(circle at 40% 35%, ${selected.value} 0%, rgba(255,255,255,0.6) 70%)`,
                boxShadow: "var(--shadow-soft)",
              }}
            />
          </div>
          <h3 className="text-2xl font-heading mb-2">When you’re ready…</h3>
          <p className="text-muted-foreground">
            Focus on <span className="font-medium">{selected.name}</span>.  
            Inhale as the bubble grows, exhale as it returns.  
            Press <kbd>Start</kbd> or hit <kbd>Space</kbd> to begin.
          </p>
          <div className="mt-6">
            <Button size="lg" className="px-8" onClick={() => setStep("breathe")}>
              Start
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3 — Breathing animation */}
      {step === "breathe" && selected && (
        <Card className="p-10 sm:p-12 text-center bg-gradient-calm border-0 shadow-soft flex flex-col items-center justify-center min-h-[70vh]">
          <div className="relative mx-auto mb-6 flex items-center justify-center">
            <div
              className="w-32 h-32 rounded-full transition-transform ease-gentle-custom"
              style={{
                transitionDuration: `${Math.max(0.9, phaseDuration)}s`,
                transform: running ? bubbleTransform : "translate(0,0) scale(1)",
                background: `radial-gradient(circle at 40% 35%, ${selected.value} 0%, rgba(255,255,255,0.6) 70%)`,
                boxShadow: phase.includes("hold")
                  ? "0 0 0 0 rgba(0,0,0,0.0), 0 6px 22px -6px rgba(0,0,0,0.12)"
                  : "var(--shadow-soft)",
              }}
            />
            <div className="absolute inset-0 w-32 h-32 rounded-full border-2 border-primary/30 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h4 className="text-2xl font-heading">
              {phase === "inhale" ? "Breathe In" : phase.includes("hold") ? "Hold" : "Breathe Out"}
            </h4>
            <p className="text-4xl font-mono font-bold text-primary">{seconds}</p>
          </div>

          <div className="flex items-center justify-center gap-3 mt-6">
            <Button onClick={() => setRunning((r) => !r)} variant={running ? "secondary" : "default"} size="lg" className="px-8">
              {running ? "Pause" : "Start"}
            </Button>
            <Button variant="ghost" onClick={() => { setStep("color"); setRunning(false); }}>
              Choose another color
            </Button>
            <Button variant="ghost" onClick={onBack}>Done</Button>
          </div>

          {!running && (
            <p className="text-xs text-muted-foreground mt-4">
              Tip: <kbd>Space</kbd> to pause/resume · <kbd>Esc</kbd> to go back
            </p>
          )}
        </Card>
      )}
    </div>
  );
};

/* small UI helpers */
function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-muted px-1 py-1">
      <button
        className={`px-3 py-1.5 rounded-full text-sm ${mode === "let-go" ? "bg-foreground text-background" : "opacity-80"}`}
        onClick={() => onChange("let-go")}
      >
        Let it go
      </button>
      <button
        className={`px-3 py-1.5 rounded-full text-sm ${mode === "invite-calm" ? "bg-foreground text-background" : "opacity-80"}`}
        onClick={() => onChange("invite-calm")}
      >
        Invite calm
      </button>
    </div>
  );
}

export default BreathingAnimation;