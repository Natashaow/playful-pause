import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const COLORS = [
  { name: "Joy", value: "#FFE5A3" },        // Soft pastel yellow - happiness and warmth
  { name: "Calm", value: "#B8D4E3" },       // Muted pastel blue - tranquility and peace
  { name: "Love", value: "#F4B8B8" },       // Soft pastel red - tenderness and care
  { name: "Growth", value: "#C8E6C9" },     // Muted pastel green - balance and renewal
  { name: "Fear", value: "#D4C5E8" },      // Soft pastel purple - courage and transformation
  { name: "Peace", value: "#A8E6CF" },      // Soft pastel teal - serenity and calm
  { name: "Hope", value: "#D4ED91" },       // Gentle pastel lime - new beginnings
  { name: "Gentle", value: "#F8C8D8" },     // Soft pastel pink - softness and nurturing
  { name: "Anxiety", value: "#F4D4A3" },    // Warm pastel peach - nervous energy and tension
] as const;

// Color psychology information
const COLOR_INFO = {
  "Joy": {
    description: "Joy is a soft, warm pastel yellow that creates a gentle, welcoming atmosphere. This color can represent happiness, warmth, and gentle energy. In color therapy, soft yellow tones are believed to stimulate mental activity and create feelings of cheerfulness and warmth.",
    associations: "Associated with: happiness, warmth, gentleness, mental clarity, sunshine, welcoming"
  },
  "Calm": {
    description: "Calm is a muted pastel blue that evokes feelings of tranquility and peace. This color can represent openness, calmness, and reflection. In color therapy, blue tones are believed to have a calming effect on the mind and body, helping to reduce stress and promote relaxation.",
    associations: "Associated with: calmness, peace, reflection, openness, stability, depth"
  },
  "Love": {
    description: "Love is a soft pastel red that represents gentle warmth and soft energy. This color can symbolize tenderness, care, and gentle passion. In color therapy, soft red tones are believed to stimulate gentle energy and can help create feelings of warmth and comfort.",
    associations: "Associated with: tenderness, care, gentle warmth, softness, comfort, nurturing"
  },
  "Growth": {
    description: "Growth is a muted pastel green that symbolizes nature, growth, and renewal. This color can represent balance, harmony, and natural healing. In color therapy, green tones are believed to have a balancing effect, helping to restore harmony and promote feelings of safety and security.",
    associations: "Associated with: balance, harmony, growth, renewal, nature, safety"
  },
  "Fear": {
    description: "Fear is a soft pastel purple that represents courage and transformation. This color can symbolize facing challenges, inner strength, and the journey through difficult emotions. In color therapy, purple tones are believed to help transform fear into courage and promote spiritual growth.",
    associations: "Associated with: courage, transformation, inner strength, spiritual growth, facing challenges"
  },
  "Peace": {
    description: "Peace is a soft pastel teal that represents calmness and tranquility. This color can symbolize emotional balance, mental clarity, and peaceful energy. In color therapy, teal tones are believed to have a soothing effect on the mind, helping to promote mental clarity and emotional balance.",
    associations: "Associated with: peace, tranquility, mental clarity, emotional balance, calm, harmony"
  },
  "Hope": {
    description: "Hope is a gentle pastel lime that represents freshness and gentle growth. This color can symbolize new beginnings, gentle energy, and natural vitality. In color therapy, lime tones are believed to help balance emotions and promote feelings of gentle renewal and contentment.",
    associations: "Associated with: optimism, renewal, new beginnings, vitality, balance, harmony"
  },
  "Gentle": {
    description: "Gentle is a soft pastel pink that represents gentleness and soft beauty. This color can symbolize tenderness, care, and gentle nurturing. In color therapy, pink tones are believed to have a nurturing effect, helping to promote feelings of softness and gentle emotional healing.",
    associations: "Associated with: gentleness, tenderness, care, nurturing, softness, beauty"
  },
  "Anxiety": {
    description: "Anxiety is a warm pastel peach that represents nervous energy and tension. This color can symbolize restlessness, worry, and heightened awareness. In color therapy, warm orange tones are believed to help ground nervous energy and promote feelings of stability and calm.",
    associations: "Associated with: nervous energy, tension, restlessness, worry, heightened awareness, grounding"
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
  const [showInstructions, setShowInstructions] = useState(false);
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
      }, 8000); // 8 seconds

      return () => clearTimeout(timer);
    } else {
      setShowAccordion(false);
    }
  }, [running]);

  // Show instructions when a color is selected
  const showColorInstructions = () => {
    setShowInstructions(true);
  };

  // Start breathing after reading instructions
  const startBreathing = () => {
    setShowInstructions(false);
    setRunning(true);
    setPhaseIndex(0);
  };

  // Stop breathing (pause at current state)
  const stopBreathing = () => {
    setRunning(false);
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  return (
          <div className="mx-auto max-w-5xl p-6 pb-16">
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

      <Button onClick={onBack} variant="ghost" className="mb-6 text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all duration-300" aria-label="Back to Activities">
        ← Back to Activities
      </Button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold mb-3 text-foreground">
          Color Breathing
        </h2>
        <p className="text-muted-foreground font-sans">Pick a color, breathe with it, and let a small calm settle in</p>
      </div>

      <Card className="p-8 border-0 shadow-soft relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10" style={{
          background: `radial-gradient(60% 60% at 50% 30%, ${selectedColor.value}22 0%, transparent 70%), radial-gradient(60% 50% at 50% 100%, ${selectedColor.value}15 0%, transparent 60%)`,
          transition: "background 500ms ease",
        }} />

        {!running && !showInstructions ? (
          <>
            {/* Color selection */}
            <div className="text-center">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`p-6 rounded-xl transition-all duration-500 hover:scale-105 active:scale-98 active:rotate-1 border-2 ${
                      selectedColor.value === c.value 
                        ? 'border-primary shadow-lg' 
                        : 'border-border hover:border-primary/50'
                    } transform-gpu hover:shadow-lg hover:animate-pulse`}
                    style={{ backgroundColor: c.value }}
                    aria-label={`Choose ${c.name}`}
                  >
                    <div className="mb-3 text-foreground/80 flex justify-center items-center transition-all duration-500 relative hover:scale-110 group-hover:animate-float-slow">
                      {c.name === "Joy" && (
                        <div className="group-hover:animate-pulse">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            {/* Joy - aesthetic star */}
                            <path d="M12 1.5l3.2 6.5 7.3 0.8-5.3 5.2 1.2 7.2-6.2-3.7-6.2 3.7 1.2-7.2-5.3-5.2 7.3-0.8L12 1.5z" fill="#FFD700" opacity="0.9"/>
                            <path d="M12 2.5l2.8 5.7 6.4 0.7-4.6 4.5 1.1 6.3-5.7-3.4-5.7 3.4 1.1-6.3-4.6-4.5 6.4-0.7L12 2.5z" fill="#FFA500" opacity="0.7"/>
                            <path d="M12 3.5l2.4 4.9 5.5 0.6-3.9 3.8 0.9 5.4-4.9-2.9-4.9 2.9 0.9-5.4-3.9-3.8 5.5-0.6L12 3.5z" fill="#FF8C00" opacity="0.5"/>
                            {/* Star glow effect */}
                            <circle cx="12" cy="12" r="8" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.3"/>
                            <circle cx="12" cy="12" r="6" fill="none" stroke="#FFA500" strokeWidth="0.5" opacity="0.2"/>
                          </svg>
                        </div>
                      )}
                      {c.name === "Calm" && (
                        <div className="group-hover:animate-pulse">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            {/* Calm - gentle waves */}
                            <path d="M6 16c3-2 6-2 9 0s6 2 9 0" stroke="#87CEEB" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8"/>
                            <path d="M6 18c3-2 6-2 9 0s6 2 9 0" stroke="#4ECDC4" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
                            <path d="M6 20c3-2 6-2 9 0s6 2 9 0" stroke="#45B7D1" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                            {/* Calming center dot */}
                            <circle cx="12" cy="12" r="3" fill="#98FB98" opacity="0.8"/>
                          </svg>
                        </div>
                      )}
                      {c.name === "Love" && (
                        <div className="group-hover:animate-pulse">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            {/* Love - organic heart with flowing elements */}
                            <path d="M12 20c-3-2-6-4-8-7-2-3-2-7 0-10 2-3 6-4 8-3 2-1 6 0 8 3 2 3 2 7 0 10-2 3-5 5-8 7z" fill="#FFB6C1" opacity="0.8"/>
                            <path d="M12 20c-3-2-6-4-8-7-2-3-2-7 0-10 2-3 6-4 8-3 2-1 6 0 8 3 2 3 2 7 0 10-2 3-5 5-8 7z" fill="#FF69B4" opacity="0.4"/>
                            {/* Flowing love energy */}
                            <path d="M8 12c2-1 4-1 6 0" stroke="#FFB6C1" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
                            <path d="M10 12c2-1 4-1 6 0" stroke="#FFB6C1" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
                            <path d="M12 12c2-1 4-1 6 0" stroke="#FFB6C1" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
                          </svg>
                        </div>
                      )}
                      {c.name === "Growth" && (
                        <div className="group-hover:animate-pulse">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            {/* Growth - sprouting plant */}
                            <path d="M12 20v-8" stroke="#228B22" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M12 12c-3 0-6-2-6-6s3-6 6-6 6 2 6 6-3 6-6 6z" fill="#32CD32" opacity="0.8"/>
                            <path d="M8 8c2-1 4-1 6 0" stroke="#90EE90" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                            <path d="M16 8c-2-1-4-1-6 0" stroke="#90EE90" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                          </svg>
                        </div>
                      )}
                      {c.name === "Fear" && (
                        <div className="group-hover:animate-pulse">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            {/* Fear - transforming butterfly */}
                            <path d="M8 16c2-1 4-1 6 0s4 1 6 0" stroke="#D4C5E8" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8"/>
                            <path d="M6 18c3-2 6-2 9 0s6 2 9 0" stroke="#B8A9DC" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
                            {/* Transforming center */}
                            <circle cx="12" cy="14" r="2" fill="#D4C5E8" opacity="0.6"/>
                            {/* Courage elements */}
                            <path d="M8 12c2-1 4-1 6 0" stroke="#E6E6FA" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                            <path d="M10 12c2-1 4-1 6 0" stroke="#E6E6FA" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                            {/* Transformation flow */}
                            <path d="M7 10c3-2 6-2 9 0" stroke="#B8A9DC" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>
                            <path d="M9 10c3-2 6-2 9 0" stroke="#B8A9DC" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>
                          </svg>
                        </div>
                      )}
                      {c.name === "Peace" && (
                        <div className="group-hover:animate-pulse">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            {/* Peace - flowing tranquility */}
                            <path d="M8 18c2-1 4-1 6 0s4 1 6 0" stroke="#A8E6CF" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8"/>
                            <path d="M12 18v4" stroke="#7FCDCD" strokeWidth="2" strokeLinecap="round"/>
                            {/* Peaceful elements */}
                            <path d="M6 14c3-2 6-2 9 0" stroke="#B8E6CF" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
                            <path d="M9 14c3-2 6-2 9 0" stroke="#B8E6CF" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
                            {/* Flowing peace */}
                            <path d="M8 10c2-1 4-1 6 0" stroke="#A8E6CF" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                            <path d="M10 10c2-1 4-1 6 0" stroke="#A8E6CF" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                          </svg>
                        </div>
                      )}
                      {c.name === "Hope" && (
                        <div className="group-hover:animate-pulse">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            {/* Hope - sunflower */}
                            <circle cx="12" cy="12" r="6" fill="#FFD700" opacity="0.9"/>
                            <circle cx="12" cy="12" r="4" fill="#FFA500" opacity="0.8"/>
                            <circle cx="12" cy="12" r="2" fill="#8B4513" opacity="0.9"/>
                            {/* Petals */}
                            <path d="M12 2c0 2-1 3-2 3s-2-1-2-3 1-3 2-3 2 1 2 3z" fill="#FFD700" opacity="0.8"/>
                            <path d="M12 22c0-2-1-3-2-3s-2 1-2 3 1 3 2 3 2-1 2-3z" fill="#FFD700" opacity="0.8"/>
                            <path d="M2 12c2 0 3-1 3-2s-1-2-3-2-3 1-3 2 1 2 3 2z" fill="#FFD700" opacity="0.8"/>
                            <path d="M22 12c-2 0-3-1-3-2s1-2 3-2 3 1 3 2-1 2-3 2z" fill="#FFD700" opacity="0.8"/>
                            <path d="M4 4c1 1 2 1 3 0s1-2 0-3-2-1-3 0-1 2 0 3z" fill="#FFD700" opacity="0.8"/>
                            <path d="M20 20c-1-1-2-1-3 0s-1 2 0 3 2 1 3 0 1-2 0-3z" fill="#FFD700" opacity="0.8"/>
                            <path d="M4 20c1-1 2-1 3 0s1 2 0 3-2 1-3 0-1-2 0-3z" fill="#FFD700" opacity="0.8"/>
                            <path d="M20 4c-1 1-2 1-3 0s-1-2 0-3 2-1 3 0 1 2 0 3z" fill="#FFD700" opacity="0.8"/>
                            {/* Stem */}
                            <path d="M12 18v4" stroke="#228B22" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M10 20c2-1 4-1 6 0" stroke="#32CD32" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                          </svg>
                        </div>
                      )}
                      {c.name === "Gentle" && (
                        <div className="group-hover:animate-pulse">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            {/* Gentle - flowing mist */}
                            <path d="M6 16c3-2 6-2 9 0s6 2 9 0" stroke="#FFB6C1" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8"/>
                            <path d="M6 18c3-2 6-2 9 0s6 2 9 0" stroke="#FFC0CB" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
                            <path d="M6 20c3-2 6-2 9 0s6 2 9 0" stroke="#FFC0CB" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                            {/* Gentle center */}
                            <circle cx="12" cy="14" r="2" fill="#FFB6C1" opacity="0.6"/>
                            {/* Soft flowing elements */}
                            <path d="M8 12c2-1 4-1 6 0" stroke="#FFB6C1" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>
                            <path d="M10 12c2-1 4-1 6 0" stroke="#FFB6C1" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>
                          </svg>
                        </div>
                      )}
                      {c.name === "Anxiety" && (
                        <div className="group-hover:animate-pulse">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            {/* Anxiety - nervous energy */}
                            <path d="M8 16c2-1 4-1 6 0s4 1 6 0" stroke="#F4D4A3" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8"/>
                            <path d="M8 18c2-1 4-1 6 0s4 1 6 0" stroke="#F0C080" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
                            <path d="M8 20c2-1 4-1 6 0s4 1 6 0" stroke="#E6B800" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                            {/* Nervous center */}
                            <circle cx="12" cy="14" r="3" fill="#F4D4A3" opacity="0.6"/>
                            {/* Restless energy */}
                            <path d="M6 12c3-2 6-2 9 0" stroke="#F0C080" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
                            <path d="M9 12c3-2 6-2 9 0" stroke="#F0C080" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
                            {/* Grounding element */}
                            <circle cx="12" cy="10" r="1" fill="#8B4513" opacity="0.7"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <span className="text-sm font-medium text-foreground">{c.name}</span>
                  </button>
                ))}
              </div>

              <Button onClick={showColorInstructions} size="lg" className="px-8 bg-black text-white hover:bg-black/90 shadow-md">
                Continue with {selectedColor.name}
              </Button>
            </div>
          </>
        ) : showInstructions ? (
          <>
            {/* Instructional page */}
            <div className="text-center max-w-lg mx-auto">
              {/* Color preview */}
              <div className="mb-12">
                <div className="w-32 h-32 rounded-full mx-auto mb-6 shadow-soft" style={{ backgroundColor: selectedColor.value }} />
                <h3 className="font-heading text-3xl text-foreground/90 font-light">
                  {selectedColor.name}
                </h3>
              </div>

              {/* Simple instruction */}
              <div className="mb-12">
                <p className="text-foreground/80 text-lg leading-relaxed mb-8">
                  Breathe with this color's energy
                </p>
                <p className="text-foreground/60 text-sm leading-relaxed">
                  Inhale • Hold • Exhale • Hold
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-6 justify-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowInstructions(false)}
                  className="text-foreground/60 hover:text-foreground/80 hover:bg-foreground/5"
                >
                  ← Back
                </Button>
                <Button 
                  onClick={startBreathing}
                  size="lg" 
                  className="px-10 bg-foreground text-background hover:bg-foreground/90 shadow-sm"
                >
                  Begin
                </Button>
              </div>
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
                  variant="outline"
                  onClick={stopBreathing}
                  className="px-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  Stop
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setRunning(false);
                    setShowInstructions(false);
                  }}
                  className="border-black text-black hover:bg-black hover:text-white transition-all duration-300"
                >
                  Choose Different Color
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