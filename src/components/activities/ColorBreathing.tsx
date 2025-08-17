import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const COLORS = [
  { name: "Cream", value: "#FFF2D1" },      // Lighter pastel yellow - happiness and warmth
  { name: "Sky", value: "#D4E8F0" },        // Lighter pastel blue - tranquility and peace
  { name: "Blush", value: "#F8D0D0" },      // Lighter pastel red - tenderness and care
  { name: "Sage", value: "#D8F0D8" },       // Lighter pastel green - balance and renewal
  { name: "Lavender", value: "#E2D8F0" },   // Lighter pastel purple - courage and transformation
  { name: "Teal", value: "#C8F0E0" },       // Lighter pastel teal - serenity and calm
  { name: "Lime", value: "#E0F4A8" },       // Lighter pastel lime - new beginnings
  { name: "Rose", value: "#FCD8E8" },       // Lighter pastel pink - softness and nurturing
  { name: "Peach", value: "#F8E0C8" },      // Lighter pastel peach - nervous energy and tension
] as const;

// Color psychology information
const COLOR_INFO = {
  "Cream": {
    description: "Cream is a warm, bright yellow that radiates sunshine warmth and uplifting energy. This color represents pure happiness, optimism, and the bright energy of a new day. In color therapy, warm yellow tones are believed to stimulate joy, creativity, and mental clarity while creating feelings of cheerfulness and warmth.",
    associations: "Breathe in sunshine warmth. Let joy fill your chest with light.",
    breathingGuidance: "Positive emotion - inviting more warmth and light into your being"
  },
  "Sky": {
    description: "Sky is a soft, gentle blue that evokes deep trust and relaxation. This color represents gentle clarity, peaceful reflection, and the soothing energy of water. In color therapy, soft blue tones are believed to have a profound calming effect on the mind and body, helping to reduce stress and promote inner peace.",
    associations: "Breathe in steady clarity. Feel calm ripple gently through you.",
    breathingGuidance: "Positive emotion - inviting more clarity and peace into your being"
  },
  "Blush": {
    description: "Blush is a warm rose that represents deep tenderness, affection, and care. This color symbolizes the gentle warmth of the heart, nurturing energy, and the soft beauty of compassion. In color therapy, warm rose tones are believed to open the heart, promote emotional healing, and create feelings of safety and comfort.",
    associations: "Breathe in compassion. Let love expand softly in your heart.",
    breathingGuidance: "Positive emotion - inviting more compassion and love into your being"
  },
  "Sage": {
    description: "Sage is a fresh, natural green that symbolizes renewal, balance, and progress. This color represents the energy of new beginnings, natural healing, and the steady progress of personal development. In color therapy, fresh green tones are believed to restore harmony, promote growth, and create feelings of safety and security.",
    associations: "Breathe in renewal. Picture yourself stretching gently toward the light.",
    breathingGuidance: "Positive emotion - inviting more renewal and growth into your being"
  },
  "Lavender": {
    description: "Lavender is a muted purple that gently acknowledges uncertainty while softening its intensity. This color represents the transformation of fear into understanding, the courage to face challenges, and the gentle strength within. In color therapy, muted lavender tones are believed to help transform fear into wisdom and promote spiritual growth.",
    associations: "Breathe in courage. As you exhale, let fear drift away like smoke.",
    breathingGuidance: "Reframed emotion - breathing in courage, releasing fear with each exhale"
  },
  "Teal": {
    description: "Teal is a mint green that represents ease, safety, and perfect balance. This color symbolizes the gentle tranquility of nature, emotional equilibrium, and the peaceful energy of harmony. In color therapy, mint green tones are believed to soothe the mind, restore balance, and create feelings of safety and serenity.",
    associations: "Breathe in stillness. Let tranquility wash over you like gentle waves.",
    breathingGuidance: "Positive emotion - inviting more stillness and tranquility into your being"
  },
  "Lime": {
    description: "Lime is a light lime that represents fresh, forward-looking energy without being overwhelming. This color symbolizes new beginnings, gentle optimism, and the energizing power of possibility. In color therapy, light lime tones are believed to inspire hope, promote renewal, and create feelings of gentle excitement and forward momentum.",
    associations: "Breathe in fresh energy. Let hope plant new seeds within you.",
    breathingGuidance: "Positive emotion - inviting more fresh energy and possibility into your being"
  },
  "Rose": {
    description: "Rose is a pale pink that represents softness, compassion, and kindness. This color symbolizes the gentle nurturing of the heart, tender care, and the soft beauty of emotional healing. In color therapy, pale pink tones are believed to have a deeply nurturing effect, helping to heal emotional wounds and promote feelings of self-love.",
    associations: "Breathe in kindness. Soften into the moment with care.",
    breathingGuidance: "Positive emotion - inviting more kindness and care into your being"
  },
  "Peach": {
    description: "Peach is a muted peach that acknowledges unease while softening it with warmth. This color represents the gentle acknowledgment of nervous energy, the process of grounding, and the transformation of worry into calm awareness. In color therapy, muted peach tones are believed to help ground nervous energy and promote feelings of stability and gentle calm.",
    associations: "Breathe in grounding. With each exhale, release the weight of worry.",
    breathingGuidance: "Reframed emotion - breathing in grounding, releasing worry with each exhale"
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

  // Resume breathing from current state
  const resumeBreathing = () => {
    setRunning(true);
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
        {!running && !showInstructions ? (
          <>
            <h1 className="font-heading text-3xl sm:text-4xl text-foreground/90 font-light mb-2">
              Choose Your Emotion
            </h1>
            <p className="text-foreground/70 font-sans text-sm">Pick an emotion and breathe with its energy</p>
          </>
        ) : showInstructions ? (
          <>
            <h1 className="font-heading text-3xl sm:text-4xl text-foreground/90 font-light mb-2">
              Get Ready to Breathe
            </h1>
            <p className="text-foreground/70 font-sans text-sm">Review the breathing pattern and prepare for your session</p>
          </>
        ) : (
          <>
            <h1 className="font-heading text-3xl sm:text-4xl text-foreground/90 font-light mb-2">
              Breathing Session
            </h1>
            <p className="text-foreground/70 font-sans text-sm">Focus on your breath and let the emotion guide you</p>
          </>
        )}
      </div>

      <Card className="p-6 border-0 shadow-soft relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10" style={{
          background: `radial-gradient(60% 60% at 50% 30%, ${selectedColor.value}15 0%, transparent 70%)`,
          transition: "background 500ms ease",
        }} />

        {!running && !showInstructions ? (
          <>
            {/* Color selection */}
            <div className="text-center">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 border-2 relative ${
                      selectedColor.value === c.value 
                        ? 'border-primary shadow-lg scale-105' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    style={{ backgroundColor: c.value }}
                    aria-label={`Choose ${c.name}`}
                  >
                    <div className="mb-4 flex justify-center items-center transition-all duration-500 relative hover:scale-110 group-hover:animate-float-slow">
                      {/* Full icon display with animations */}
                      {c.name === "Cream" && (
                        <div className="group-hover:animate-pulse">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-foreground">
                            {/* Joy - minimal starburst/sun radiating warmth */}
                            {/* Central sun circle */}
                            <circle cx="12" cy="12" r="4" fill="#FFD700" opacity="0.95"/>
                            {/* Radiating rays */}
                            <path d="M12 2v3" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
                            <path d="M12 19v3" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
                            <path d="M2 12h3" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
                            <path d="M19 12h3" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
                            {/* Diagonal rays */}
                            <path d="M4 4l2 2" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                            <path d="M18 18l2 2" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                            <path d="M18 4l-2 2" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                            <path d="M4 18l2-2" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                            {/* Warm glow effect */}
                            <circle cx="12" cy="12" r="8" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.5"/>
                            <circle cx="12" cy="12" r="6" fill="none" stroke="#FFA500" strokeWidth="0.5" opacity="0.4"/>
                          </svg>
                        </div>
                      )}
                      {c.name === "Sky" && (
                        <div className="group-hover:animate-pulse">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-foreground">
                            {/* Calm - gentle waves */}
                            <path d="M6 16c3-2 6-2 9 0s6 2 9 0" stroke="#87CEEB" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.9" className="group-hover:animate-pulse" style={{animationDuration: '4s'}}/>
                            <path d="M6 18c3-2 6-2 9 0s6 2 9 0" stroke="#4ECDC4" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" className="group-hover:animate-pulse" style={{animationDuration: '4s', animationDelay: '0.5s'}}/>
                            <path d="M6 20c3-2 6-2 9 0s6 2 9 0" stroke="#45B7D1" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" className="group-hover:animate-pulse" style={{animationDuration: '4s', animationDelay: '1s'}}/>
                            {/* Calming center dot */}
                            <circle cx="12" cy="12" r="3" fill="#98FB98" opacity="0.9" className="group-hover:scale-110 transition-transform duration-1000"/>
                          </svg>
                        </div>
                      )}
                      {c.name === "Blush" && (
                        <div className="group-hover:animate-pulse">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-foreground">
                            {/* Love - simple heart with soft sparkle */}
                            {/* Main heart shape */}
                            <path d="M12 21c-2.5-1.5-5-3-7-5.5-2-2.5-2-6 0-8.5 2-2.5 5-3.5 7-2.5 2 1 5 0 7 2.5 2 2.5 2 6 0 8.5-2 2.5-4.5 4-7 5.5z" fill="#FFB6C1" opacity="0.95"/>
                            {/* Soft sparkle */}
                            <circle cx="8" cy="8" r="1" fill="#FFD700" opacity="0.95" className="animate-ping" style={{animationDuration: '2s'}}/>
                            <circle cx="16" cy="8" r="0.8" fill="#FF69B4" opacity="0.9" className="animate-ping" style={{animationDuration: '2s', animationDelay: '0.5s'}}/>
                            {/* Gentle shine effect */}
                            <path d="M12 14c-1-1-2-1-3 0s-2 1-3 0c-1-1-1-2 0-3s2-1 3 0c1 1 2 1 3 0s2-1 3 0c1 1 1 2 0 3s-1 2-3 0c-1 1-2 1-3 0z" fill="#FF69B4" opacity="0.7"/>
                          </svg>
                        </div>
                      )}
                      {c.name === "Sage" && (
                        <div className="group-hover:animate-pulse">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-foreground">
                            {/* Growth - sprouting plant */}
                            <path d="M12 20v-8" stroke="#228B22" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
                            <path d="M12 12c-3 0-6-2-6-6s3-6 6-6 6 2 6 6-3 6-6 6z" fill="#32CD32" opacity="0.8"/>
                            <path d="M8 8c2-1 4-1 6 0" stroke="#90EE90" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8"/>
                            <path d="M16 8c-2-1 4-1 6 0" stroke="#90EE90" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8"/>
                            {/* Growing leaves with animation */}
                            <path d="M8 8c2-1 4-1 6 0" stroke="#98FB98" strokeWidth="1.5" fill="none" strokeLinecap="round" className="group-hover:animate-pulse" style={{animationDuration: '2s'}} opacity="0.8"/>
                            <path d="M16 8c-2-1 4-1 6 0" stroke="#98FB98" strokeWidth="1.5" fill="none" strokeLinecap="round" className="group-hover:animate-pulse" style={{animationDuration: '2s', animationDelay: '0.3s'}} opacity="0.8"/>
                            {/* New sprout emerging */}
                            <path d="M12 6c-1 0-2-0.5-2-1.5s1-1.5 2-1.5 2 0.5 2 1.5-1 1.5-2 1.5z" fill="#98FB98" opacity="0.8" className="group-hover:scale-110 transition-transform duration-700"/>
                          </svg>
                        </div>
                      )}
                      {c.name === "Lavender" && (
                        <div className="group-hover:animate-pulse">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-foreground">
                            {/* Fear - small cloud with breeze lines */}
                            {/* Main cloud */}
                            <ellipse cx="12" cy="14" rx="4" ry="2.5" fill="#D4C5E8" opacity="0.9"/>
                            <ellipse cx="12" cy="12" rx="3" ry="2" fill="#D4C5E8" opacity="0.95"/>
                            <ellipse cx="12" cy="10" rx="2" ry="1.5" fill="#D4C5E8" opacity="1"/>
                            {/* Breeze lines drifting away */}
                            <path d="M16 12c1-1 2-1 3 0" stroke="#E6E6FA" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.9"/>
                            <path d="M17 10c1-1 2-1 3 0" stroke="#E6E6FA" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.8"/>
                            <path d="M18 8c1-1 2-1 3 0" stroke="#E6E6FA" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7"/>
                            {/* Gentle transformation center */}
                            <circle cx="12" cy="14" r="1.5" fill="#E6E6FA" opacity="0.8"/>
                          </svg>
                        </div>
                      )}
                      {c.name === "Peace" && (
                        <div className="group-hover:animate-pulse">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-foreground">
                            {/* Peace - small floating leaf */}
                            {/* Main leaf shape */}
                            <path d="M12 8c-2-2-4-2-6 0s-4 2-6 0c-2-2-2-4 0-6s2-4 6 0c2 2 4 2 6 0s4-2 6 0c2 2 2 4 0 6s-2 4-6 0c-2 2-4 2-6 0z" fill="#A8E6CF" opacity="0.95"/>
                            {/* Leaf vein */}
                            <path d="M12 8v8" stroke="#7FCDCD" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.9"/>
                            {/* Gentle floating movement */}
                            <path d="M8 6c2-1 4-1 6 0" stroke="#98FB98" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.8"/>
                            <path d="M10 6c2-1 4-1 6 0" stroke="#98FB98" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.8"/>
                            {/* Peaceful center */}
                            <circle cx="12" cy="12" r="1.5" fill="#A8E6CF" opacity="0.9"/>
                          </svg>
                        </div>
                      )}
                      {c.name === "Hope" && (
                        <div className="group-hover:animate-pulse">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-foreground">
                            {/* Hope - sunflower */}
                            <circle cx="12" cy="12" r="6" fill="#FFD700" opacity="0.9"/>
                            <circle cx="12" cy="12" r="4" fill="#FFA500" opacity="0.8"/>
                            <circle cx="12" cy="12" r="2" fill="#8B4513" opacity="0.9"/>
                            {/* Petals with gentle sway */}
                            <path d="M12 2c0 2-1 3-2 3s-2-1-2-3 1-3 2-3 2 1 2 3z" fill="#FFD700" opacity="0.9" className="group-hover:animate-bounce" style={{animationDuration: '3s', animationDelay: '0s'}}/>
                            <path d="M12 22c0-2-1-3-2-3s-2 1-2 3 1 3 2 3 2-1 2-3z" fill="#FFD700" opacity="0.9" className="group-hover:animate-bounce" style={{animationDuration: '3s', animationDelay: '0.5s'}}/>
                            <path d="M2 12c2 0 3-1 3-2s-1-2-3-2-3 1-3 2 1 2 3 2z" fill="#FFD700" opacity="0.9" className="group-hover:animate-bounce" style={{animationDuration: '3s', animationDelay: '1s'}}/>
                            <path d="M22 12c-2 0-3-1-3-2s1-2 3-2 3 1 3 2-1 2-3 2z" fill="#FFD700" opacity="0.9" className="group-hover:animate-bounce" style={{animationDuration: '3s', animationDelay: '1.5s'}}/>
                            <path d="M4 4c1 1 2 1 3 0s1-2 0-3-2-1-3 0-1 2 0 3z" fill="#FFD700" opacity="0.9" className="group-hover:animate-bounce" style={{animationDuration: '3s', animationDelay: '2s'}}/>
                            <path d="M20 20c-1-1-2-1-3 0s-1 2 0 3 2 1 3 0 1-2 0-3z" fill="#FFD700" opacity="0.9" className="group-hover:animate-bounce" style={{animationDuration: '3s', animationDelay: '2.5s'}}/>
                            <path d="M4 20c1-1 2-1 3 0s1 2 0 3-2 1-3 0-1-2 0-3z" fill="#FFD700" opacity="0.9" className="group-hover:animate-bounce" style={{animationDuration: '3s', animationDelay: '3s'}}/>
                            <path d="M20 4c-1 1-2 1-3 0s-1-2 0-3 2-1 3 0 1 2 0 3z" fill="#FFD700" opacity="0.9" className="group-hover:animate-bounce" style={{animationDuration: '3s', animationDelay: '3.5s'}}/>
                            {/* Stem */}
                            <path d="M12 18v4" stroke="#228B22" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
                            <path d="M10 20c2-1 4-1 6 0" stroke="#32CD32" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
                          </svg>
                        </div>
                      )}
                      {c.name === "Gentle" && (
                        <div className="group-hover:animate-pulse">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-foreground">
                            {/* Gentle - minimal cupped hands */}
                            {/* Left hand */}
                            <path d="M8 16c-1-1-2-1-3 0s-2 1-3 0c-1-1-1-2 0-3s2-1 3 0c1 1 2 1 3 0s2-1 3 0c1 1 1 2 0 3s-1 2-3 0c-1 1-2 1-3 0z" fill="#FFB6C1" opacity="0.9"/>
                            {/* Right hand */}
                            <path d="M16 16c1-1 2-1 3 0s2 1 3 0c1 1 1 2 0 3s-1 2-3 0c-1 1-2 1-3 0s-2 1-3 0c-1-1-1-2 0-3s1-2 3 0c1 1 2 1 3 0z" fill="#FFC0CB" opacity="0.9"/>
                            {/* Gentle center */}
                            <circle cx="12" cy="14" r="1.5" fill="#FFB6C1" opacity="0.8"/>
                            {/* Soft glow */}
                            <circle cx="12" cy="14" r="3" fill="none" stroke="#FFB6C1" strokeWidth="0.5" opacity="0.6"/>
                          </svg>
                        </div>
                      )}
                      {c.name === "Anxiety" && (
                        <div className="group-hover:animate-pulse">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-foreground">
                            {/* Anxiety - minimal stacked stones for grounding */}
                            {/* Bottom stone */}
                            <ellipse cx="12" cy="18" rx="4" ry="2" fill="#F4D4A3" opacity="0.95"/>
                            {/* Middle stone */}
                            <ellipse cx="12" cy="15" rx="3" ry="1.5" fill="#F0C080" opacity="0.9"/>
                            {/* Top stone */}
                            <ellipse cx="12" cy="12" rx="2" ry="1" fill="#E6B800" opacity="0.85"/>
                            {/* Grounding line */}
                            <path d="M8 20c2-1 4-1 6 0s4 1 6 0" stroke="#8B4513" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.8"/>
                            {/* Zen circle */}
                            <circle cx="12" cy="10" r="1" fill="#8B4513" opacity="0.6"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <span className="text-sm font-medium text-foreground/90">{c.name}</span>
                  </button>
                ))}
              </div>

              <Button onClick={showColorInstructions} size="lg" className="px-10 py-3 bg-foreground text-white hover:bg-foreground/90 shadow-md">
                Continue
              </Button>
            </div>
          </>
        ) : showInstructions ? (
          <>
            {/* Instructional page */}
            <div className="text-center max-w-lg mx-auto">
              {/* Emotion icon preview */}
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  {selectedColor.name === "Joy" && (
                    <div className="text-foreground/80">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="4" fill="#FFD700" opacity="0.95"/>
                        <path d="M12 2v3" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
                        <path d="M12 19v3" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
                        <path d="M2 12h3" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
                        <path d="M19 12h3" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
                      </svg>
                    </div>
                  )}
                  {selectedColor.name === "Calm" && (
                    <div className="text-foreground/80">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M6 16c3-2 6-2 9 0s6 2 9 0" stroke="#87CEEB" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.9"/>
                        <circle cx="12" cy="12" r="3" fill="#98FB98" opacity="0.9"/>
                      </svg>
                    </div>
                  )}
                  {selectedColor.name === "Love" && (
                    <div className="text-foreground/80">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21c-2.5-1.5-5-3-7-5.5-2-2.5-2-6 0-8.5 2-2.5 5-3.5 7-2.5 2 1 5 0 7 2.5 2 2.5 2 6 0 8.5-2 2.5-4.5 4-7 5.5z" fill="#FFB6C1" opacity="0.95"/>
                      </svg>
                    </div>
                  )}
                  {selectedColor.name === "Growth" && (
                    <div className="text-foreground/80">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M12 20v-8" stroke="#228B22" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
                        <path d="M12 12c-3 0-6-2-6-6s3-6 6-6 6 2 6 6-3 6-6 6z" fill="#32CD32" opacity="0.8"/>
                      </svg>
                    </div>
                  )}
                  {selectedColor.name === "Fear" && (
                    <div className="text-foreground/80">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <ellipse cx="12" cy="14" rx="4" ry="2.5" fill="#D4C5E8" opacity="0.9"/>
                        <ellipse cx="12" cy="12" rx="3" ry="2" fill="#D4C5E8" opacity="0.95"/>
                        <ellipse cx="12" cy="10" rx="2" ry="1.5" fill="#D4C5E8" opacity="1"/>
                      </svg>
                    </div>
                  )}
                  {selectedColor.name === "Peace" && (
                    <div className="text-foreground/80">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M12 8c-2-2-4-2-6 0s-4 2-6 0c-2-2-2-4 0-6s2-4 6 0c2 2 4 2 6 0s4-2 6 0c2 2 2 4 0 6s-2 4-6 0c-2 2-4 2-6 0z" fill="#A8E6CF" opacity="0.95"/>
                        <circle cx="12" cy="12" r="1.5" fill="#A8E6CF" opacity="0.9"/>
                      </svg>
                    </div>
                  )}
                  {selectedColor.name === "Hope" && (
                    <div className="text-foreground/80">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="6" fill="#FFD700" opacity="0.9"/>
                        <circle cx="12" cy="12" r="4" fill="#FFA500" opacity="0.8"/>
                        <circle cx="12" cy="12" r="2" fill="#8B4513" opacity="0.9"/>
                      </svg>
                    </div>
                  )}
                  {selectedColor.name === "Gentle" && (
                    <div className="text-foreground/80">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M8 16c-1-1-2-1-3 0s-2 1-3 0c-1-1-1-2 0-3s2-1 3 0c1 1 2 1 3 0s2-1 3 0c1 1 1 2 0 3s-1 2-3 0c-1 1-2 1-3 0z" fill="#FFB6C1" opacity="0.9"/>
                        <path d="M16 16c1-1 2-1 3 0s2 1 3 0c1 1 1 2 0 3s-1 2-3 0c-1 1-2 1-3 0s-2 1-3 0c-1-1-1-2 0-3s1-2 3 0c1 1 2 1 3 0z" fill="#FFC0CB" opacity="0.9"/>
                      </svg>
                    </div>
                  )}
                  {selectedColor.name === "Anxiety" && (
                    <div className="text-foreground/80">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <ellipse cx="12" cy="18" rx="4" ry="2" fill="#F4D4A3" opacity="0.95"/>
                        <ellipse cx="12" cy="15" rx="3" ry="1.5" fill="#F0C080" opacity="0.9"/>
                        <ellipse cx="12" cy="12" rx="2" ry="1" fill="#E6B800" opacity="0.85"/>
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="font-heading text-2xl text-foreground/90 font-light mb-3">
                  {selectedColor.name === "Fear" || selectedColor.name === "Anxiety" 
                    ? "Let go of fear" 
                    : `Breathe with ${selectedColor.name}`
                  }
                </h3>
              </div>

              {/* Simplified breathing pattern */}
              <div className="mb-8">
                <p className="text-foreground/60 text-sm mb-3 tracking-wide font-medium">Breathing pattern</p>
                <div className="flex items-center justify-center gap-4 text-foreground/80 font-medium">
                  <span className="px-3 py-2 bg-foreground/5 rounded-lg text-sm">Inhale</span>
                  <span className="text-foreground/40">•</span>
                  <span className="px-3 py-2 bg-foreground/5 rounded-lg text-sm">Hold</span>
                  <span className="text-foreground/40">•</span>
                  <span className="px-3 py-2 bg-foreground/5 rounded-lg text-sm">Exhale</span>
                  <span className="text-foreground/40">•</span>
                  <span className="px-3 py-2 bg-foreground/5 rounded-lg text-sm">Hold</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 justify-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowInstructions(false)}
                  className="text-foreground/60 hover:text-foreground/80 hover:bg-foreground/5 px-6 py-2"
                >
                  ← Back
                </Button>
                <Button 
                  onClick={() => setRunning(true)}
                  size="lg" 
                  className="px-8 py-3 bg-foreground text-white hover:bg-foreground/90 shadow-md font-medium"
                >
                  Start Breathing
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Breathing Session - Enhanced Design */}
            <div className="flex flex-col items-center text-center">
              {/* Enhanced breathing visualization */}
              <div className="relative mb-8">
                {/* Main breathing circle with emotion icon */}
                <div className="relative">
                  {/* Animated background rings */}
                  <div className="absolute inset-0 -z-10">
                    <div 
                      className="absolute inset-0 rounded-full opacity-20 transition-all duration-1000 ease-in-out"
                      style={{ 
                        background: `radial-gradient(circle, ${selectedColor.value}40 0%, transparent 70%)`,
                        transform: `scale(${phase.anim === "breatheIn" ? 1.4 : phase.anim === "holdExpanded" ? 1.4 : 1})`
                      }}
                    />
                    <div 
                      className="absolute inset-8 rounded-full opacity-15 transition-all duration-1000 ease-in-out"
                      style={{ 
                        background: `radial-gradient(circle, ${selectedColor.value}30 0%, transparent 70%)`,
                        transform: `scale(${phase.anim === "breatheIn" ? 1.3 : phase.anim === "holdExpanded" ? 1.3 : 1})`
                      }}
                    />
                  </div>
                  {/* Breathing circle */}
                  <div 
                    className={`w-48 h-48 md:w-56 md:h-56 rounded-full transition-all duration-1000 ease-in-out shadow-soft relative overflow-hidden ${
                      phase.anim === "breatheIn" ? "scale-110" : 
                      phase.anim === "holdExpanded" ? "scale-110" : 
                      phase.anim === "breatheOut" ? "scale-100" : "scale-100"
                    }`}
                    style={{ 
                      background: `radial-gradient(circle at 45% 35%, ${selectedColor.value}DD, ${selectedColor.value} 65%)`,
                      boxShadow: `0 0 0 2px #ffffff88 inset, 0 20px 60px ${selectedColor.value}44`
                    }}
                  >
                    {/* Subtle inner glow */}
                    <div 
                      className="absolute inset-8 rounded-full opacity-20"
                      style={{ 
                        background: `radial-gradient(circle, ${selectedColor.value}80 0%, transparent 70%)`,
                        filter: 'blur(12px)'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Fixed breathing instructions and counter */}
              <div className="text-center mb-4 relative z-20 flex flex-col items-center">
                {/* Phase label */}
                <h2 className="text-lg md:text-xl font-heading text-foreground/90 font-light mb-3 tracking-wide">
                  {phase.label}
                </h2>
                
                {/* Large countdown timer */}
                <div className="text-3xl md:text-4xl font-mono text-foreground/80 font-light tracking-widest mb-2 text-center">
                  {secondsLeft}
                </div>
              </div>

              {/* Phase description below circle */}
              <div className="text-center mb-6">
                <p className="text-foreground/70 text-base font-medium leading-relaxed tracking-wide">
                  {phase.key === "inhale" && "Fill your lungs with gentle awareness"}
                  {phase.key === "hold1" && "Rest in this moment of fullness"}
                  {phase.key === "exhale" && "Release with ease and grace"}
                  {phase.key === "hold2" && "Rest in this moment of emptiness"}
                </p>
              </div>

              {/* Simple controls */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setRunning(false);
                    setShowInstructions(false);
                  }}
                  className="text-foreground/60 hover:text-foreground/80 hover:bg-foreground/5 px-6 py-2"
                  >
                  Choose Different Emotion
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}