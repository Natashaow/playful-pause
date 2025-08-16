import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const COLORS = [
  { name: "Cream", value: "#FFE5A3" },        // Soft pastel yellow (like your whimsy-cream)
  { name: "Sky", value: "#B8D4E3" },    // Muted pastel blue (complements primary teal)
  { name: "Blush", value: "#F4B8B8" },      // Soft pastel red (gentle, not harsh)
  { name: "Sage", value: "#C8E6C9" },    // Muted pastel green (like your whimsy-sage)
  { name: "Lavender", value: "#D4C5E8" },       // Soft pastel purple (like your whimsy-lavender)
  { name: "Teal", value: "#A8E6CF" },    // Soft teal (aligned with your primary)
  { name: "Lime", value: "#D4ED91" },       // Gentle pastel lime
  { name: "Rose", value: "#F8C8D8" }, // Soft pastel pink (like your whimsy-blush)
  { name: "Peach", value: "#F4D4A3" },  // Warm pastel orange (complements whimsy-cream)
] as const;

// Color psychology information
const COLOR_INFO = {
  "Cream": {
    description: "Cream is a soft, warm pastel yellow that creates a gentle, welcoming atmosphere. This color can represent comfort, warmth, and gentle energy. In color therapy, soft yellow tones are believed to stimulate mental activity and create feelings of cheerfulness and warmth.",
    associations: "Associated with: comfort, warmth, gentleness, mental clarity, sunshine, welcoming"
  },
  "Sky": {
    description: "Sky is a muted pastel blue that evokes feelings of tranquility and peace. This color can represent openness, calmness, and reflection. In color therapy, blue tones are believed to have a calming effect on the mind and body, helping to reduce stress and promote relaxation.",
    associations: "Associated with: calmness, peace, reflection, openness, stability, depth"
  },
  "Blush": {
    description: "Blush is a soft pastel red that represents gentle warmth and soft energy. This color can symbolize tenderness, care, and gentle passion. In color therapy, soft red tones are believed to stimulate gentle energy and can help create feelings of warmth and comfort.",
    associations: "Associated with: tenderness, care, gentle warmth, softness, comfort, nurturing"
  },
  "Sage": {
    description: "Sage is a muted pastel green that symbolizes nature, growth, and renewal. This color can represent balance, harmony, and natural healing. In color therapy, green tones are believed to have a balancing effect, helping to restore harmony and promote feelings of safety and security.",
    associations: "Associated with: balance, harmony, growth, renewal, nature, safety"
  },
  "Lavender": {
    description: "Lavender is a soft pastel purple that represents calmness and gentle spirituality. This color can symbolize peace, introspection, and gentle creativity. In color therapy, purple tones are believed to have a calming effect on the nervous system and can help promote inner peace and tranquility.",
    associations: "Associated with: peace, tranquility, introspection, gentle creativity, calm, serenity"
  },
  "Teal": {
    description: "Teal is a soft blue-green that represents calm and tranquility. This color can symbolize emotional balance, mental clarity, and peaceful energy. In color therapy, teal tones are believed to have a soothing effect on the mind, helping to promote mental clarity and emotional balance.",
    associations: "Associated with: calmness, tranquility, mental clarity, emotional balance, peace, harmony"
  },
  "Lime": {
    description: "Lime is a gentle pastel green that represents freshness and gentle growth. This color can symbolize new beginnings, gentle energy, and natural vitality. In color therapy, lime tones are believed to help balance emotions and promote feelings of gentle renewal and contentment.",
    associations: "Associated with: freshness, gentle growth, new beginnings, vitality, balance, harmony"
  },
  "Rose": {
    description: "Rose is a soft pastel pink that represents gentleness and soft beauty. This color can symbolize tenderness, care, and gentle nurturing. In color therapy, pink tones are believed to have a nurturing effect, helping to promote feelings of softness and gentle emotional healing.",
    associations: "Associated with: gentleness, tenderness, care, nurturing, softness, beauty"
  },
  "Peach": {
    description: "Peach is a warm pastel orange that represents comfort and gentle warmth. This color can symbolize coziness, gentle energy, and welcoming comfort. In color therapy, warm orange tones are believed to promote feelings of security and gentle emotional comfort.",
    associations: "Associated with: comfort, coziness, gentle warmth, welcoming, security, softness"
  }
} as const;

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
  const [showAccordion, setShowAccordion] = useState(false);
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

  // Timer to show accordion after 30 seconds
  useEffect(() => {
    if (running) {
      const timer = setTimeout(() => {
        setShowAccordion(true);
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    } else {
      setShowAccordion(false);
    }
  }, [running]);

  // Start breathing when a color is selected
  const startBreathing = () => {
    setRunning(true);
    setPhaseIndex(0);
  };

  return (
          <div className="mx-auto max-w-5xl p-6">
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

      <Button onClick={onBack} variant="ghost" className="mb-6" aria-label="Back to Activities">
        ← Back to Activities
      </Button>

      <Card className="p-0 border-0 shadow-soft overflow-hidden mb-8">
        <div className="relative p-6 text-center">
          {/* Pastel radial glow band */}
          <div 
            aria-hidden 
            className="absolute inset-x-0 top-0 -z-10 h-24" 
            style={{
              background: "radial-gradient(60% 60% at 50% 10%, rgba(195, 245, 230, 0.3) 0%, transparent 70%)",
            }}
          />
          
          <h2 className="text-3xl font-heading font-bold mb-3 text-foreground">
            Color Breathing
          </h2>
          <p className="text-muted-foreground font-sans">Pick a color, breathe with it, and let a small calm settle in</p>
        </div>
      </Card>

      <Card className="p-8 border-0 shadow-soft relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10" style={{
          background: `radial-gradient(60% 60% at 50% 30%, ${selectedColor.value}22 0%, transparent 70%), radial-gradient(60% 50% at 50% 100%, ${selectedColor.value}15 0%, transparent 60%)`,
          transition: "background 500ms ease",
        }} />

        {!running ? (
          <>
            {/* Color selection */}
            <div className="text-center">
              <div className="grid grid-cols-3 gap-4 mb-8">
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
                    <span className="text-sm font-medium text-foreground">{c.name}</span>
                  </button>
                ))}
              </div>

              <Button onClick={startBreathing} size="lg" className="px-8 bg-foreground text-white hover:bg-foreground/90">
                Start Breathing
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Center cluster */}
            <div className="flex flex-col items-center text-center">
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

              {/* Did you know? Accordion */}
              {showAccordion && (
                <div className="mt-8 w-full max-w-md mx-auto">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="color-info" className="border-border">
                      <AccordionTrigger className="text-foreground/80 hover:text-foreground font-sans text-sm">
                        💡 Did you know?
                      </AccordionTrigger>
                      <AccordionContent className="text-foreground/70 font-sans text-sm leading-relaxed">
                        <p className="mb-3">{COLOR_INFO[selectedColor.name].description}</p>
                        <p className="text-foreground/60 italic">{COLOR_INFO[selectedColor.name].associations}</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}