import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const COLORS = [
  { name: "Joy", value: "#FFE5A3" },        // Soft pastel yellow (like your whimsy-cream)
  { name: "Sadness", value: "#B8D4E3" },    // Muted pastel blue (complements primary teal)
  { name: "Anger", value: "#F4B8B8" },      // Soft pastel red (gentle, not harsh)
  { name: "Disgust", value: "#C8E6C9" },    // Muted pastel green (like your whimsy-sage)
  { name: "Fear", value: "#D4C5E8" },       // Soft pastel purple (like your whimsy-lavender)
  { name: "Anxiety", value: "#A8E6CF" },    // Soft teal (aligned with your primary)
  { name: "Envy", value: "#D4ED91" },       // Gentle pastel lime
  { name: "Embarrassment", value: "#F8C8D8" }, // Soft pastel pink (like your whimsy-blush)
  { name: "Nostalgia", value: "#F4D4A3" },  // Warm pastel orange (complements whimsy-cream)
] as const;

// Color psychology information
const COLOR_INFO = {
  "Joy": {
    description: "Joy is often associated with bright, warm colors like yellow. This color can represent happiness, optimism, and energy. In color therapy, yellow is believed to stimulate mental activity and create feelings of cheerfulness and warmth.",
    associations: "Associated with: happiness, optimism, creativity, mental clarity, warmth, sunshine"
  },
  "Sadness": {
    description: "Sadness is often linked to cool, calming colors like blue. This color can represent tranquility, peace, and reflection. In color therapy, blue is believed to have a calming effect on the mind and body, helping to reduce stress and promote relaxation.",
    associations: "Associated with: calmness, peace, reflection, trust, stability, depth"
  },
  "Anger": {
    description: "Anger is commonly associated with warm, intense colors like red. This color can represent passion, energy, and strong emotions. In color therapy, red is believed to stimulate energy and can help release pent-up emotions in a controlled way.",
    associations: "Associated with: passion, energy, courage, strength, determination, warmth"
  },
  "Disgust": {
    description: "Disgust is often represented by green tones, which can symbolize nature, growth, and renewal. In color therapy, green is believed to have a balancing effect, helping to restore harmony and promote feelings of safety and security.",
    associations: "Associated with: balance, harmony, growth, renewal, nature, safety"
  },
  "Fear": {
    description: "Fear is often associated with purple tones, which can represent mystery and the unknown. In color therapy, purple is believed to have a calming effect on the nervous system and can help promote spiritual awareness and inner peace.",
    associations: "Associated with: mystery, spirituality, wisdom, calm, introspection, creativity"
  },
  "Anxiety": {
    description: "Anxiety is often linked to teal and blue-green colors, which can represent calm and tranquility. In color therapy, these colors are believed to have a soothing effect on the mind, helping to reduce anxiety and promote mental clarity.",
    associations: "Associated with: calmness, tranquility, mental clarity, emotional balance, peace"
  },
  "Envy": {
    description: "Envy is often represented by green tones, which can symbolize growth and abundance. In color therapy, green is believed to help balance emotions and promote feelings of contentment and satisfaction with what we have.",
    associations: "Associated with: growth, abundance, contentment, balance, harmony, renewal"
  },
  "Embarrassment": {
    description: "Embarrassment is often associated with soft pink tones, which can represent gentleness and self-compassion. In color therapy, pink is believed to have a nurturing effect, helping to promote self-love and emotional healing.",
    associations: "Associated with: gentleness, self-compassion, nurturing, love, emotional healing, warmth"
  },
  "Nostalgia": {
    description: "Nostalgia is often linked to warm, earthy colors like orange and amber. These colors can represent warmth, comfort, and memories. In color therapy, warm colors are believed to promote feelings of security and emotional comfort.",
    associations: "Associated with: warmth, comfort, memories, security, emotional comfort, stability"
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
          
          <h2 className="text-3xl font-heading font-bold mb-3 bg-gradient-joy bg-clip-text text-transparent">
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