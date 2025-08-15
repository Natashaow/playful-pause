import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconBreath } from "@/components/doodles/Icons";

const COLORS = [
  { name: "Sunshine", value: "#FFE66D" },
  { name: "Ocean", value: "#4ECDC4" },
  { name: "Lavender", value: "#C7CEEA" },
  { name: "Coral", value: "#FF6B6B" },
  { name: "Mint", value: "#95E1D3" },
  { name: "Peach", value: "#FFB4B4" },
  { name: "Sky", value: "#A8E6CF" },
  { name: "Rose", value: "#FFD93D" },
] as const;

type Phase = "inhale" | "hold" | "exhale";

function nextPhase(p: Phase): Phase {
  if (p === "inhale") return "hold";
  if (p === "hold") return "exhale";
  return "inhale";
}

export default function ColorBreathing({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<typeof COLORS[number] | null>(null);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [secondsLeft, setSecondsLeft] = useState<number>(4);
  const [running, setRunning] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // Start breathing when a color is selected
  useEffect(() => {
    if (!selected) return;
    setPhase("inhale");
    setSecondsLeft(4);
    setRunning(true);
  }, [selected]);

  // Phase timer (4-4-4 loop)
  useEffect(() => {
    if (!running || !selected) return;
    if (timerRef.current) window.clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setSecondsLeft((t) => {
        if (t > 1) return t - 1;
        // Switch phase and reset
        setPhase((p) => nextPhase(p));
        return 4;
      });
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [running, selected, phase]);

  // Soft background that "breathes" with the phase
  const bgStyle = useMemo(() => {
    const base = selected?.value ?? "hsl(var(--background))";
    const strength = !selected
      ? "55%"
      : phase === "inhale"
      ? "85%"
      : phase === "hold"
      ? "70%"
      : "50%";

    return {
      background:
        `radial-gradient(60% 60% at 50% 28%, ${base} ${strength}, transparent 80%), ` +
        `radial-gradient(70% 60% at 50% 100%, rgba(255,255,255,0.65) 0%, transparent 70%)`,
      transition: "background 4s ease-out",
    } as React.CSSProperties;
  }, [selected, phase]);

  // Bubble transform per phase
  const bubbleTransform = running
    ? phase === "inhale"
      ? "translate(0,0) scale(1.5)"
      : phase === "hold"
      ? "translate(0,0) scale(1.5)"
      : "translate(0,0) scale(1)"
    : "translate(0,0) scale(1)";

  const bubbleShadow = phase === "hold" ? "var(--shadow-glow)" : "var(--shadow-soft)";

  // Reset to picker
  const resetPicker = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setRunning(false);
    setSelected(null);
    setPhase("inhale");
    setSecondsLeft(4);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Button onClick={onBack} variant="ghost" className="mb-6" aria-label="Back to Activities">
        ← Back to Activities
      </Button>

      <div aria-hidden className="fixed inset-0 -z-10" style={bgStyle} />

      {!selected && (
        <>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold mb-4 text-primary">What color makes you feel good right now?</h2>
            <p className="font-sans text-muted-foreground">Choose a color that speaks to your current mood</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {COLORS.map((c) => (
              <Card
                key={c.name}
                className="p-4 cursor-pointer transition-all duration-300 ease-out hover:scale-105 border-2 border-border hover:border-primary/50"
                onClick={() => setSelected(c)}
                aria-label={`Choose ${c.name}`}
                role="button"
              >
                <div className="w-full h-16 rounded-lg mb-3 shadow-soft" style={{ backgroundColor: c.value }} />
                <h3 className="font-semibold text-center text-sm">{c.name}</h3>
              </Card>
            ))}
          </div>
        </>
      )}

      {selected && (
        <Card className="p-0 border-0 shadow-soft overflow-hidden">
          <div className="relative p-10 sm:p-12 text-center bg-white/70 backdrop-blur min-h-[60vh] flex flex-col items-center justify-center">
            {/* Pastel radial glow band */}
            <div 
              aria-hidden 
              className="absolute inset-x-0 top-0 -z-10 h-32" 
              style={{
                background: `radial-gradient(60% 60% at 50% 10%, ${selected.value}40 0%, transparent 70%)`,
              }}
            />
            
            {/* Header with doodle */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <IconBreath className="h-6 w-6 text-foreground/80 animate-float-slow" />
              <h2 className="text-2xl font-heading font-semibold text-foreground">Color Breathing</h2>
            </div>

            <div className="relative mb-6">
              {/* Breathing circle */}
              <div
                className="w-32 h-32 rounded-full mx-auto animate-breathe"
                aria-label="Breathing bubble"
                style={{
                  background: `radial-gradient(circle at 40% 35%, ${selected.value} 0%, rgba(255,255,255,0.7) 70%)`,
                  boxShadow: bubbleShadow,
                }}
              />
              <div className="absolute inset-0 w-32 h-32 rounded-full border-2 border-primary/30 animate-pulse" />
              
              {/* Sparkles */}
              <div className="absolute -top-2 -right-2 size-2 rounded-full bg-foreground/20 animate-twinkle" />
              <div className="absolute top-4 -left-4 size-1.5 rounded-full bg-foreground/20 animate-twinkle" />
              <div className="absolute bottom-2 right-4 size-1.5 rounded-full bg-foreground/20 animate-twinkle" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-heading font-semibold animate-letter-in">
                {phase === "inhale" ? "Breathe In" : phase === "hold" ? "Hold" : "Breathe Out"}
              </h4>
              <p className="text-4xl font-mono font-bold text-primary">{secondsLeft}</p>
            </div>

            <div className="flex items-center justify-center gap-3 mt-6">
              <Button onClick={() => setRunning((r) => !r)} variant={running ? "secondary" : "default"} size="lg" className="px-8">
                {running ? "Pause" : "Start"}
              </Button>
              <Button variant="ghost" onClick={resetPicker} aria-label="Pick another color">
                Pick another color
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}