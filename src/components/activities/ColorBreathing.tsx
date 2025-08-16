import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const COLORS = [
  { name: "Ocean", value: "#4ECDC4" },
  { name: "Lavender", value: "#C7CEEA" },
  { name: "Coral", value: "#FF6B6B" },
  { name: "Mint", value: "#95E1D3" },
  { name: "Peach", value: "#FFB4B4" },
  { name: "Sky", value: "#A8E6CF" },
  { name: "Sunshine", value: "#FFE66D" },
  { name: "Rose", value: "#FFD93D" },
] as const;

type PhaseKey = "inhale" | "hold1" | "exhale" | "hold2";

const PHASES: Array<{
  key: PhaseKey;
  label: string;
  seconds: number;
  anim: "breatheIn" | "holdExpanded" | "breatheOut" | "holdContracted";
  isHold?: boolean;
}> = [
  { key: "inhale", label: "Breathe In", seconds: 4, anim: "breatheIn" },
  { key: "hold1", label: "Hold",       seconds: 4, anim: "holdExpanded",  isHold: true },
  { key: "exhale", label: "Breathe Out", seconds: 4, anim: "breatheOut" },
  { key: "hold2", label: "Hold",       seconds: 4, anim: "holdContracted", isHold: true },
];

export default function ColorBreathing({ onBack }: { onBack: () => void }) {
  const [selectedColor, setSelectedColor] = useState<typeof COLORS[number]>(COLORS[0]);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(PHASES[0].seconds);
  const [running, setRunning] = useState(false);
  const tickRef = useRef<number | null>(null);

  const phase = PHASES[phaseIndex];

  // Set up 1s countdown + switch to next phase
  useEffect(() => {
    if (!running) return;

    setSecondsLeft(phase.seconds);
    const start = Date.now();

    // A small interval that updates every ~250ms for smoother countdown
    tickRef.current = window.setInterval(() => {
      const elapsedMs = Date.now() - start;
      const remaining = Math.max(0, phase.seconds - Math.floor(elapsedMs / 1000));
      setSecondsLeft(remaining);

      if (elapsedMs >= phase.seconds * 1000) {
        window.clearInterval(tickRef.current!);
        setPhaseIndex((i) => (i + 1) % PHASES.length);
      }
    }, 250) as unknown as number;

    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseIndex, running]);

  const animStyle = useMemo<React.CSSProperties>(() => {
    return {
      animationName: phase.anim,
      animationDuration: `${phase.seconds * 1000}ms`,
      animationTimingFunction: "ease-in-out",
      animationFillMode: "forwards",
      animationIterationCount: phase.isHold ? "infinite" : 1,
    };
  }, [phase]);

  // Subtle halo behind the bubble (never overpowering)
  const haloStyle = useMemo<React.CSSProperties>(() => {
    return {
      background: `radial-gradient(closest-side, ${selectedColor.value}22, transparent 70%)`,
      filter: "blur(12px)",
    };
  }, [selectedColor.value]);

  // Start breathing when a color is selected
  const startBreathing = () => {
    setRunning(true);
    setPhaseIndex(0);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      {/* Custom breathing animations */}
      <style>{`
        /* --- Color Breathing keyframes --- */

        /* Breathe In (expand over 4s) */
        @keyframes breatheIn {
          0%   { transform: scale(1);   opacity: 0.9; }
          100% { transform: scale(1.3); opacity: 1;   }
        }

        /* Hold after inhale (gentle pulse at expanded size) */
        @keyframes holdExpanded {
          0%,100% { transform: scale(1.3); opacity: 1;   }
          50%     { transform: scale(1.32); opacity: 0.95; }
        }

        /* Breathe Out (contract over 6s) */
        @keyframes breatheOut {
          0%   { transform: scale(1.3); opacity: 1;   }
          100% { transform: scale(1);   opacity: 0.9; }
        }

        /* Hold after exhale (gentle pulse at contracted size) */
        @keyframes holdContracted {
          0%,100% { transform: scale(1);   opacity: 0.9; }
          50%     { transform: scale(1.02); opacity: 1;   }
        }
      `}</style>

      <div className="fixed inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 10%, rgba(255,236,209,.7) 0%, transparent 70%)," +
            "radial-gradient(55% 45% at 85% 0%, rgba(195,245,230,.7) 0%, transparent 70%)," +
            "radial-gradient(70% 60% at 40% 90%, rgba(162,210,255,.55) 0%, transparent 75%)",
        }}
      />

      <Card className="w-full max-w-2xl md:max-w-3xl p-8 md:p-10 bg-white/30 backdrop-blur-md ring-1 ring-white/50 shadow-2xl">
        <div className="flex items-center gap-3 text-sm text-foreground/60">
          <button onClick={onBack} className="hover:underline">
            ← Back to Activities
          </button>
          <span aria-hidden>•</span>
          <span>Color Breathing</span>
        </div>

        {!running ? (
          <>
            {/* Color selection */}
            <div className="mt-8 text-center">
              <h2 className="text-3xl font-heading font-bold mb-4 text-foreground">What color makes you feel good right now?</h2>
              <p className="font-sans text-muted-foreground mb-8">Choose a color that speaks to your current mood</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 border-2 ${
                      selectedColor.value === c.value 
                        ? 'border-primary shadow-lg' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    aria-label={`Choose ${c.name}`}
                  >
                    <div className="w-full h-16 rounded-lg mb-3 shadow-soft" style={{ backgroundColor: c.value }} />
                    <h3 className="font-semibold text-sm text-foreground">{c.name}</h3>
                  </button>
                ))}
              </div>

              <Button onClick={startBreathing} size="lg" className="px-8">
                Start Breathing
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Center cluster */}
            <div className="mt-8 flex flex-col items-center text-center">
              {/* Bubble + halo */}
              <div className="relative h-56 w-56 md:h-64 md:w-64">
                {/* halo */}
                <div
                  className="absolute inset-0 rounded-full opacity-70"
                  style={haloStyle}
                  aria-hidden
                />
                {/* main bubble */}
                <div
                  className="absolute inset-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
                  style={{
                    ...animStyle,
                    background: `radial-gradient(circle at 45% 35%, ${selectedColor.value}CC, ${selectedColor.value} 65%)`,
                    boxShadow: `0 0 0 2px #ffffffaa inset, 0 12px 36px ${selectedColor.value}44`,
                  }}
                />
                {/* subtle inner ring so the center stays visible */}
                <div
                  className="absolute inset-12 rounded-full border"
                  style={{ borderColor: `${selectedColor.value}55` }}
                  aria-hidden
                />
              </div>

              {/* Prompt + countdown */}
              <div className="mt-6">
                <p className="font-heading text-xl md:text-2xl text-foreground">
                  {phase.label}
                </p>
                <p className="mt-1 text-4xl md:text-5xl font-semibold text-foreground/90 tabular-nums">
                  {secondsLeft}
                </p>
              </div>

              {/* Controls */}
              <div className="mt-8 flex items-center gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setRunning(false)}
                  className="px-6"
                >
                  Stop
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    // restart from inhale
                    setPhaseIndex(0);
                    setRunning(true);
                  }}
                >
                  Restart
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}