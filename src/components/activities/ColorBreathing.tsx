import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconBreath } from "@/components/doodles/Icons";
import { readPersonalization, moodHints } from "@/lib/personalization";

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

type Phase = "inhale" | "holdInhale" | "exhale" | "holdExhale";

function nextPhase(p: Phase): Phase {
  if (p === "inhale") return "holdInhale";
  if (p === "holdInhale") return "exhale";
  if (p === "exhale") return "holdExhale";
  return "inhale";
}

export default function ColorBreathing({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<typeof COLORS[number] | null>(null);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [secondsLeft, setSecondsLeft] = useState<number>(4);
  const [running, setRunning] = useState<boolean>(false);
  const [suggestedColor, setSuggestedColor] = useState<string | null>(null);
  const [timing, setTiming] = useState<{inhale:number;holdInhale:number;exhale:number;holdExhale:number}>({ 
    inhale: 4, 
    holdInhale: 4, 
    exhale: 6, 
    holdExhale: 4 
  });
  const timerRef = useRef<number | null>(null);

  // Personalization setup on mount
  useEffect(() => {
    const { context } = readPersonalization();
    const hints = moodHints(context);

    if (hints.isStressed || hints.isTired) {
      setSuggestedColor("Lavender");
      setTiming({ inhale:4, holdInhale:4, exhale:6, holdExhale:4 }); // longer exhale to downshift
    } else if (hints.isBlue) {
      setSuggestedColor("Peach");
      setTiming({ inhale:4, holdInhale:4, exhale:4, holdExhale:4 });
    } else if (hints.isUp) {
      setSuggestedColor("Mint");
      setTiming({ inhale:4, holdInhale:4, exhale:4, holdExhale:4 });
    }
  }, []);

  // Start breathing when a color is selected
  useEffect(() => {
    if (!selected) return;
    setPhase("inhale");
    setSecondsLeft(timing.inhale);
    setRunning(true);
  }, [selected, timing.inhale]);

  // Phase timer (using 4-4-6-4 cycle)
  useEffect(() => {
    if (!running || !selected) return;
    if (timerRef.current) window.clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setSecondsLeft((t) => {
        if (t > 1) return t - 1;
        // Switch phase and reset with appropriate timing
        setPhase((p) => {
          const next = nextPhase(p);
          if (next === "inhale") setSecondsLeft(timing.inhale);
          else if (next === "holdInhale") setSecondsLeft(timing.holdInhale);
          else if (next === "exhale") setSecondsLeft(timing.exhale);
          else setSecondsLeft(timing.holdExhale);
          return next;
        });
        return 0; // Will be set by the phase change above
      });
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [running, selected, phase, timing]);

  // Soft background that "breathes" with the phase
  const bgStyle = useMemo(() => {
    const base = selected?.value ?? "hsl(var(--background))";
    const strength = !selected
      ? "55%"
      : phase === "inhale"
      ? "85%"
      : phase === "holdInhale"
      ? "70%"
      : "50%";

    return {
      background:
        `radial-gradient(60% 60% at 50% 28%, ${base} ${strength}, transparent 80%), ` +
        `radial-gradient(70% 60% at 100%, rgba(255,255,255,0.65) 0%, transparent 70%)`,
      transition: "background 4s ease-out",
    } as React.CSSProperties;
  }, [selected, phase]);

  // Enhanced shadow for hold phases
  const bubbleShadow = (phase === "holdInhale" || phase === "holdExhale") ? "var(--shadow-glow)" : "var(--shadow-soft)";

  // Reset to picker
  const resetPicker = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setRunning(false);
    setSelected(null);
    setPhase("inhale");
    setSecondsLeft(timing.inhale);
  };

  // Pre-select suggested color if available
  useEffect(() => {
    if (suggestedColor && !selected) {
      const color = COLORS.find(c => c.name === suggestedColor);
      if (color) {
        setSelected(color);
      }
    }
  }, [suggestedColor, selected]);

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
            {suggestedColor && (
              <p className="mt-3 font-sans text-sm text-muted-foreground/80">
                Suggested for now: <span className="font-medium text-primary">{suggestedColor}</span> (you can pick anything)
              </p>
            )}
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
        <div className="relative text-center min-h-[60vh] flex flex-col items-center justify-center">
          {/* Transparent/frosted background */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm rounded-3xl" />
          
          {/* Header with doodle */}
          <div className="relative z-10 flex items-center justify-center gap-3 mb-12">
            <IconBreath className="h-6 w-6 text-foreground/80 animate-float-slow" />
            <h2 className="text-2xl font-heading font-semibold text-foreground">Color Breathing</h2>
          </div>

          {/* Custom breathing animations */}
          <style>{`
            /* Breathe In (expand over 4s) */
            @keyframes breatheIn {
              0% { transform: scale(1); opacity: 0.9; }
              100% { transform: scale(1.3); opacity: 1; }
            }

            /* Hold after inhale (gentle pulse, 4s looped) */
            @keyframes holdExpanded {
              0%, 100% { transform: scale(1.3); opacity: 1; }
              50% { transform: scale(1.32); opacity: 0.95; }
            }

            /* Breathe Out (contract over 6s) */
            @keyframes breatheOut {
              0% { transform: scale(1.3); opacity: 1; }
              100% { transform: scale(1); opacity: 0.9; }
            }

            /* Hold after exhale (gentle pulse, 4s looped) */
            @keyframes holdContracted {
              0%, 100% { transform: scale(1); opacity: 0.9; }
              50% { transform: scale(1.02); opacity: 1; }
            }
          `}</style>

          {/* Breathing visualization container */}
          <div className="relative mb-8">
            {/* Background circle - expands/contracts with bubble */}
            <div
              className="absolute inset-0 w-32 h-32 rounded-full mx-auto opacity-10"
              style={{
                background: `radial-gradient(circle, ${selected.value} 0%, transparent 70%)`,
                animation: phase === "inhale" ? "breatheIn 4s ease-in-out forwards" :
                           phase === "holdInhale" ? "holdExpanded 4s ease-in-out infinite" :
                           phase === "exhale" ? "breatheOut 6s ease-in-out forwards" :
                           "holdContracted 4s ease-in-out infinite",
              }}
            />
            
            {/* Breathing bubble - main focal point */}
            <div
              className="relative w-32 h-32 rounded-full mx-auto"
              aria-label="Breathing bubble"
              style={{
                background: `radial-gradient(circle at 40% 35%, ${selected.value} 0%, rgba(255,255,255,0.8) 70%)`,
                animation: phase === "inhale" ? "breatheIn 4s ease-in-out forwards" :
                           phase === "holdInhale" ? "holdExpanded 4s ease-in-out infinite" :
                           phase === "exhale" ? "breatheOut 6s ease-in-out forwards" :
                           "holdContracted 4s ease-in-out infinite",
                boxShadow: phase === "holdInhale" || phase === "holdExhale"
                  ? "0 0 30px rgba(0,0,0,0.15), 0 0 60px rgba(0,0,0,0.1)" 
                  : "0 4px 20px rgba(0,0,0,0.1)",
              }}
            />
            
            {/* Subtle border ring */}
            <div 
              className="absolute inset-0 w-32 h-32 rounded-full border border-primary/20"
              style={{
                animation: phase === "inhale" ? "breatheIn 4s ease-in-out forwards" :
                           phase === "holdInhale" ? "holdExpanded 4s ease-in-out infinite" :
                           phase === "exhale" ? "breatheOut 6s ease-in-out forwards" :
                           "holdContracted 4s ease-in-out infinite",
              }}
            />
            
            {/* Sparkles */}
            <div className="absolute -top-2 -right-2 size-2 rounded-full bg-foreground/20 animate-twinkle" />
            <div className="absolute top-4 -left-4 size-1.5 rounded-full bg-foreground/20 animate-twinkle" />
            <div className="absolute bottom-2 right-4 size-1.5 rounded-full bg-foreground/20 animate-twinkle" />
          </div>

          {/* Breathing prompt text - directly under the bubble */}
          <div className="relative z-10 space-y-3 mb-8 text-center">
            <h4 className="text-2xl font-heading font-semibold text-foreground">
              {phase === "inhale" ? "Breathe In" : 
               phase === "holdInhale" ? "Hold" : 
               phase === "exhale" ? "Breathe Out" : 
               "Hold"}
            </h4>
            <p className="text-4xl font-mono font-bold text-primary">{secondsLeft}</p>
          </div>

            {/* Controls */}
          <div className="relative z-10 flex items-center justify-center gap-3">
            <Button onClick={() => setRunning((r) => !r)} variant={running ? "secondary" : "default"} size="lg" className="px-8">
              {running ? "Pause" : "Start"}
            </Button>
            <Button variant="ghost" onClick={resetPicker} aria-label="Pick another color">
              Pick another color
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}