import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ActivityHeader } from "@/components/ActivityHeader";
import {
  JoyIcon,
  SadnessIcon,
  LoveIcon,
  GrowthIcon,
  FearIcon,
  PeaceIcon,
  HopeIcon,
  GentleIcon,
  AnxietyIcon,
} from "@/components/emotion-icons";

const COLORS = [
  { name: "Joy", value: "#FFF2D1" },        // Lighter pastel yellow - happiness and warmth
  { name: "Sadness", value: "#D4E8F0" },    // Lighter pastel blue - tranquility and peace
  { name: "Love", value: "#F8D0D0" },       // Lighter pastel red - tenderness and care
  { name: "Growth", value: "#D8F0D8" },     // Lighter pastel green - balance and renewal
  { name: "Fear", value: "#E2D8F0" },       // Lighter pastel purple - courage and transformation
  { name: "Peace", value: "#C8F0E0" },      // Lighter pastel teal - serenity and peace
  { name: "Hope", value: "#E0F4A8" },       // Lighter pastel lime - new beginnings
  { name: "Gentle", value: "#FCD8E8" },     // Lighter pastel pink - softness and nurturing
  { name: "Anxiety", value: "#F8E0C8" },    // Lighter pastel peach - nervous energy and tension
] as const;

// Color psychology information
const COLOR_INFO = {
  "Joy": {
    description: "Joy is a warm, bright yellow that radiates sunshine warmth and uplifting energy. This color represents pure happiness, optimism, and the bright energy of a new day. In color therapy, warm yellow tones are believed to stimulate joy, creativity, and mental clarity while creating feelings of cheerfulness and warmth.",
    associations: "Breathe in sunshine warmth. Let joy fill your chest with light.",
    breathingGuidance: "Positive emotion - inviting more warmth and light into your being"
  },
  "Sadness": {
    description: "Sadness is a soft, gentle blue that evokes deep reflection and emotional release. This color represents gentle clarity, peaceful acceptance, and the soothing energy of water. In color therapy, soft blue tones are believed to have a profound calming effect on the mind and body, helping to process emotions and promote inner peace.",
    associations: "Breathe in steady clarity. Feel sadness wash over you like gentle rain.",
    breathingGuidance: "Reframed emotion - breathing in clarity, releasing sadness with each exhale"
  },
  "Love": {
    description: "Love is a warm rose that represents deep tenderness, affection, and care. This color symbolizes the gentle warmth of the heart, nurturing energy, and the soft beauty of compassion. In color therapy, warm rose tones are believed to open the heart, promote emotional healing, and create feelings of safety and comfort.",
    associations: "Breathe in compassion. Let love expand softly in your heart.",
    breathingGuidance: "Positive emotion - inviting more compassion and love into your being"
  },
  "Growth": {
    description: "Growth is a fresh, natural green that symbolizes renewal, balance, and progress. This color represents the energy of new beginnings, natural healing, and the steady progress of personal development. In color therapy, fresh green tones are believed to restore harmony, promote growth, and create feelings of safety and security.",
    associations: "Breathe in renewal. Picture yourself stretching gently toward the light.",
    breathingGuidance: "Positive emotion - inviting more renewal and growth into your being"
  },
  "Fear": {
    description: "Fear is a muted lavender that gently acknowledges uncertainty while softening its intensity. This color represents the transformation of fear into understanding, the courage to face challenges, and the gentle strength within. In color therapy, muted lavender tones are believed to help transform fear into wisdom and promote spiritual growth.",
    associations: "Breathe in courage. As you exhale, let fear drift away like smoke.",
    breathingGuidance: "Reframed emotion - breathing in courage, releasing fear with each exhale"
  },
  "Peace": {
    description: "Peace is a mint green that represents ease, safety, and perfect balance. This color symbolizes the gentle tranquility of nature, emotional equilibrium, and the peaceful energy of harmony. In color therapy, mint green tones are believed to soothe the mind, restore balance, and create feelings of safety and serenity.",
    associations: "Breathe in stillness. Let tranquility wash over you like gentle waves.",
    breathingGuidance: "Positive emotion - inviting more stillness and tranquility into your being"
  },
  "Hope": {
    description: "Hope is a light lime that represents fresh, forward-looking energy without being overwhelming. This color symbolizes new beginnings, gentle optimism, and the energizing power of possibility. In color therapy, light lime tones are believed to inspire hope, promote renewal, and create feelings of gentle excitement and forward momentum.",
    associations: "Breathe in fresh energy. Let hope plant new seeds within you.",
    breathingGuidance: "Positive emotion - inviting more fresh energy and possibility into your being"
  },
  "Gentle": {
    description: "Gentle is a pale pink that represents softness, compassion, and kindness. This color symbolizes the gentle nurturing of the heart, tender care, and the soft beauty of emotional healing. In color therapy, pale pink tones are believed to have a deeply nurturing effect, helping to heal emotional wounds and promote feelings of self-love.",
    associations: "Breathe in kindness. Soften into the moment with care.",
    breathingGuidance: "Positive emotion - inviting more kindness and care into your being"
  },
  "Anxiety": {
    description: "Anxiety is a muted peach that acknowledges unease while softening it with warmth. This color represents the gentle acknowledgment of nervous energy, the process of grounding, and the transformation of worry into peaceful awareness. In color therapy, muted peach tones are believed to help ground nervous energy and promote feelings of stability and gentle peace.",
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

export default function ColorBreathing({ 
  onBack, 
  isMusicPlaying = false, 
  onToggleMusic,
  onRandomActivity 
}: { 
  onBack: () => void;
  isMusicPlaying?: boolean;
  onToggleMusic?: () => void;
  onRandomActivity?: () => void;
}) {
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

    // Use requestAnimationFrame for smoother performance
    const tick = () => {
      const elapsedMs = Date.now() - start;
      const remaining = Math.max(0, phase.seconds - Math.floor(elapsedMs / 1000));
      
      if (remaining !== secondsLeft) {
        setSecondsLeft(remaining);
      }

      if (elapsedMs >= phase.seconds * 1000) {
        setPhaseIndex((i) => (i + 1) % PHASES.length);
        return;
      }

      tickRef.current = requestAnimationFrame(tick);
    };

    tickRef.current = requestAnimationFrame(tick);

    return () => {
      if (tickRef.current) {
        cancelAnimationFrame(tickRef.current);
        tickRef.current = null;
      }
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
    // Batch state updates to reduce lag
    setShowInstructions(false);
    setPhaseIndex(0);
    // Small delay to ensure smooth transition
    requestAnimationFrame(() => {
      setRunning(true);
    });
  };

  // Stop breathing (pause at current state)
  const stopBreathing = () => {
    setRunning(false);
    if (tickRef.current) {
      cancelAnimationFrame(tickRef.current);
      tickRef.current = null;
    }
  };

  // Resume breathing from current state
  const resumeBreathing = () => {
    setRunning(true);
  };

  return (
    <div className="min-h-screen text-foreground">
      <ActivityHeader 
        onBack={onBack}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={onToggleMusic}
        onRandomActivity={onRandomActivity}
      />
      
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

          /* --- Dove wing flapping animations --- */
          @keyframes gentleFlapLeft {
            0%, 100% { transform: rotate(0deg) translateX(0); }
            50% { transform: rotate(-8deg) translateX(-1px); }
          }

          @keyframes gentleFlapRight {
            0%, 100% { transform: rotate(0deg) translateX(0); }
            50% { transform: rotate(8deg) translateX(1px); }
          }

          @keyframes gentleFlapCenter {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-2deg); }
          }

          /* --- Fear raindrop dissolve animation --- */
          @keyframes dropRelease {
            0%   { transform: translateY(0) scale(1);   opacity: 0.9; }
            100% { transform: translateY(6px) scale(0.85); opacity: 0; }
          }
        `}</style>

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
                        {c.name === "Joy" && (
                          <div className="group-hover:animate-pulse">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              {/* Magical sun with sparkles */}
                              <circle cx="12" cy="12" r="5" fill="#FFE5A3" opacity="0.8"/>
                              <circle cx="12" cy="12" r="3" fill="#F4D4A3" opacity="0.6"/>
                              <circle cx="12" cy="12" r="1.5" fill="#FFD700" opacity="0.9"/>
                              {/* Sparkling rays */}
                              <path d="M12 2v3" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                              <path d="M12 19v3" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                              <path d="M2 12h3" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                              <path d="M19 12h3" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                              {/* Diagonal sparkles */}
                              <path d="M4 4l2 2" stroke="#FFE5A3" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
                              <path d="M18 18l2 2" stroke="#FFE5A3" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
                              <path d="M4 20l2-2" stroke="#FFE5A3" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
                              <path d="M18 6l2-2" stroke="#FFE5A3" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
                              {/* Floating sparkles */}
                              <circle cx="8" cy="8" r="0.8" fill="#FFD700" opacity="0.6"/>
                              <circle cx="16" cy="8" r="0.6" fill="#FFE5A3" opacity="0.7"/>
                              <circle cx="8" cy="16" r="0.7" fill="#F4D4A3" opacity="0.6"/>
                              <circle cx="16" cy="16" r="0.9" fill="#FFD700" opacity="0.5"/>
                            </svg>
                          </div>
                        )}
                        {c.name === "Sadness" && (
                          <div className="group-hover:animate-pulse">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              {/* Whimsical rain cloud with magical raindrops */}
                              <path d="M12 4c-3 0-6 2-6 4.5s3 4.5 6 4.5 6-2 6-4.5S15 4 12 4z" fill="#87CEEB" opacity="0.7"/>
                              <path d="M12 4c-2 0-4 1.5-4 3.5s2 3.5 4 3.5 4-1.5 4-3.5S14 4 12 4z" fill="#B8D4E3" opacity="0.5"/>
                              {/* Magical raindrops with sparkles */}
                              <path d="M10 8l1 6" stroke="#4ECDC4" strokeWidth="1.5" strokeLinecap="round" className="animate-bounce" style={{animationDelay: '0s'}} opacity="0.8"/>
                              <path d="M14 8l1 6" stroke="#4ECDC4" strokeWidth="1.5" strokeLinecap="round" className="animate-bounce" style={{animationDelay: '0.2s'}} opacity="0.8"/>
                              <path d="M12 8l1 6" stroke="#4ECDC4" strokeWidth="1.5" strokeLinecap="round" className="animate-bounce" style={{animationDelay: '0.1s'}} opacity="0.8"/>
                              {/* Floating water droplets */}
                              <circle cx="9" cy="6" r="0.8" fill="#4ECDC4" opacity="0.6"/>
                              <circle cx="15" cy="6" r="0.6" fill="#87CEEB" opacity="0.7"/>
                              <circle cx="11" cy="5" r="0.5" fill="#B8D4E3" opacity="0.5"/>
                              {/* Gentle mist around cloud */}
                              <circle cx="8" cy="8" r="1.5" fill="#E0F4F1" opacity="0.3"/>
                              <circle cx="16" cy="8" r="1.2" fill="#E0F4F1" opacity="0.3"/>
                            </svg>
                          </div>
                        )}
                        {c.name === "Love" && (
                          <div className="group-hover:animate-pulse">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              {/* Magical heart with sparkles */}
                              <path d="M12 21c-2.5-1.5-5-3-7-5.5-2-2.5-2-6 0-8.5 2-2.5 5-3.5 7-2.5 2 1 5 0 7 2.5 2 2.5 2 6 0 8.5-2 2.5-4.5 4-7 5.5z" fill="#F8C8D8" opacity="0.8"/>
                              <path d="M12 21c-2-1-4-2.5-6-4.5-1.5-2-1.5-4.5 0-6.5 1.5-2 3.5-2.5 6-1.5 2.5 1 4.5 1.5 6 1.5 1.5 0 3.5-0.5 5-2.5 1.5-2 1.5-4.5 0-6.5-1.5-2-3.5-2.5-6-1.5-2.5 1-4.5 1.5-6 1.5z" fill="#FFB6C1" opacity="0.6"/>
                              {/* Inner glow */}
                              <path d="M12 21c-1.5-0.8-3-1.8-4.5-3.2-1-1-1-2.8 0-4.2 1-1.4 2.5-1.8 4.5-1.2 2 0.6 3.5 0.2 4.5 1.2 1 1.4 1 3.2 0 4.2-1.5 1.4-3 2.4-4.5 3.2z" fill="#FFE4E1" opacity="0.4"/>
                              {/* Floating love sparkles */}
                              <circle cx="8" cy="8" r="0.6" fill="#FFB6C1" opacity="0.7"/>
                              <circle cx="16" cy="8" r="0.8" fill="#F8C8D8" opacity="0.6"/>
                              <circle cx="6" cy="12" r="0.5" fill="#FFE4E1" opacity="0.8"/>
                              <circle cx="18" cy="12" r="0.7" fill="#FFB6C1" opacity="0.5"/>
                            </svg>
                          </div>
                        )}
                        {c.name === "Growth" && (
                          <div className="group-hover:animate-pulse">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              {/* Magical growing plant with sparkles */}
                              <circle cx="12" cy="8" r="3" fill="#A8E6CF" opacity="0.8"/>
                              <circle cx="12" cy="8" r="1.5" fill="#4ECDC4" opacity="0.6"/>
                              <path d="M12 11v9" stroke="#C8E6C9" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
                              <path d="M12 11v9" stroke="#4ECDC4" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
                              {/* Growing leaves */}
                              <path d="M8 15l4-4 4 4" stroke="#4ECDC4" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                              <path d="M8 15l4-4 4 4" stroke="#32CD32" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
                              {/* Magical growth sparkles */}
                              <circle cx="10" cy="13" r="0.6" fill="#4ECDC4" opacity="0.7"/>
                              <circle cx="14" cy="13" r="0.8" fill="#32CD32" opacity="0.6"/>
                              <circle cx="12" cy="16" r="0.5" fill="#A8E6CF" opacity="0.8"/>
                              {/* Floating energy particles */}
                              <circle cx="6" cy="10" r="0.4" fill="#4ECDC4" opacity="0.5"/>
                              <circle cx="18" cy="10" r="0.6" fill="#32CD32" opacity="0.6"/>
                              <circle cx="9" cy="6" r="0.3" fill="#A8E6CF" opacity="0.7"/>
                              <circle cx="15" cy="6" r="0.5" fill="#4ECDC4" opacity="0.5"/>
                            </svg>
                          </div>
                        )}
                        {c.name === "Fear" && (
                          <div className="group-hover:animate-pulse">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              {/* Magical crescent moon with mystical cloud */}
                              <path d="M12 2c-5 0-9 4-9 9s4 9 9 9c1.5 0 3-0.5 4-1.2C14.5 20.5 12 21 9 21c-4 0-7-3-7-7s3-7 7-7c3 0 5.5 2 6.5 4.8C16.5 10.5 17 9 17 7.5c0-3-2.5-5.5-5-5.5z" fill="#E2D8F0" opacity="0.8"/>
                              <path d="M12 2c-3 0-5.5 2.5-5.5 5.5S9 13 12 13s5.5-2.5 5.5-5.5S15 2 12 2z" fill="#F0F0F0" opacity="0.6"/>
                              <path d="M12 2c-2 0-4 1.5-4 3.5s2 3.5 4 3.5 4-1.5 4-3.5S14 2 12 2z" fill="#E2D8F0" opacity="0.4"/>
                              {/* Mystical cloud */}
                              <circle cx="18" cy="6" r="2" fill="#E2D8F0" opacity="0.7"/>
                              <circle cx="19" cy="5" r="1" fill="#E2D8F0" opacity="0.5"/>
                              <circle cx="17" cy="7" r="1.5" fill="#E2D8F0" opacity="0.6"/>
                              {/* Moon glow and sparkles */}
                              <circle cx="12" cy="12" r="8" fill="#E2D8F0" opacity="0.1"/>
                              <circle cx="8" cy="8" r="0.6" fill="#F0F0F0" opacity="0.7"/>
                              <circle cx="16" cy="8" r="0.8" fill="#E2D8F0" opacity="0.6"/>
                              <circle cx="6" cy="14" r="0.5" fill="#F0F0F0" opacity="0.8"/>
                              <circle cx="18" cy="14" r="0.7" fill="#E2D8F0" opacity="0.5"/>
                            </svg>
                          </div>
                        )}
                        {c.name === "Peace" && (
                          <div className="group-hover:animate-pulse">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              {/* Magical lotus flower with mystical glow */}
                              <path d="M12 20c-2 0-4-1-5-2.5s-1-3.5 0-5 3-3.5 5-3.5 4 1 5 2.5 1 3.5 0 5-3 3.5-5 3.5z" fill="#C8F0E0" opacity="0.8"/>
                              <path d="M12 16c-1.5 0-3-0.5-4-1.5s-1-2.5 0-3.5 2.5-2.5 4-2.5 3 0.5 4 1.5 1 2.5 0 3.5-2.5 2.5-4 2.5z" fill="#A8E6CF" opacity="0.7"/>
                              <path d="M12 12c-1 0-2-0.5-2.5-1.5s0-2.5 1-3 2.5-1 3.5-1 2.5 0.5 3 1 1 2 0 3-1.5 1.5-3.5 1.5z" fill="#4ECDC4" opacity="0.6"/>
                              <circle cx="12" cy="8" r="1" fill="#4ECDC4" opacity="0.8"/>
                              {/* Inner mystical glow */}
                              <circle cx="12" cy="12" r="6" fill="#C8F0E0" opacity="0.1"/>
                              <circle cx="12" cy="12" r="4" fill="#A8E6CF" opacity="0.08"/>
                              {/* Floating peace sparkles */}
                              <circle cx="8" cy="10" r="0.6" fill="#4ECDC4" opacity="0.7"/>
                              <circle cx="16" cy="10" r="0.8" fill="#A8E6CF" opacity="0.6"/>
                              <circle cx="10" cy="6" r="0.5" fill="#C8F0E0" opacity="0.8"/>
                              <circle cx="14" cy="6" r="0.7" fill="#4ECDC4" opacity="0.5"/>
                              <circle cx="6" cy="14" r="0.4" fill="#A8E6CF" opacity="0.6"/>
                              <circle cx="18" cy="14" r="0.6" fill="#C8F0E0" opacity="0.7"/>
                            </svg>
                          </div>
                        )}
                        {c.name === "Hope" && (
                          <div className="group-hover:animate-pulse">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              {/* Magical sunflower with sparkles */}
                              <circle cx="12" cy="12" r="3" fill="#8B4513" opacity="0.9"/>
                              <circle cx="12" cy="12" r="1.5" fill="#DAA520" opacity="0.7"/>
                              {/* Petals with magical glow */}
                              <path d="M12 4c0-2 2-4 4-2s2 4 0 6-4 2-6 0-2-4 0-6z" fill="#FFD700" opacity="0.8"/>
                              <path d="M12 4c0-2-2-4-4-2s-2 4 0 6 4 2 6 0 2-4 0-6z" fill="#FFD700" opacity="0.8"/>
                              <path d="M4 12c2 0 4-2 4-4s-2-4-4-2-4 2-4 4 2 4 4 4z" fill="#FFD700" opacity="0.8"/>
                              <path d="M20 12c-2 0-4-2-4-4s2-4 4-2 4 2 4 4-2 4-4 4z" fill="#FFD700" opacity="0.8"/>
                              {/* Stem with magical energy */}
                              <path d="M12 20v-2" stroke="#228B22" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                              <path d="M12 20v-2" stroke="#32CD32" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
                              {/* Floating hope sparkles */}
                              <circle cx="8" cy="6" r="0.6" fill="#FFD700" opacity="0.7"/>
                              <circle cx="16" cy="6" r="0.8" fill="#FFE5A3" opacity="0.6"/>
                              <circle cx="6" cy="10" r="0.5" fill="#FFD700" opacity="0.8"/>
                              <circle cx="18" cy="10" r="0.7" fill="#FFE5A3" opacity="0.7"/>
                              <circle cx="6" cy="14" r="0.4" fill="#FFD700" opacity="0.6"/>
                              <circle cx="18" cy="14" r="0.6" fill="#FFE5A3" opacity="0.8"/>
                              {/* Inner glow */}
                              <circle cx="12" cy="12" r="5" fill="#FFD700" opacity="0.1"/>
                            </svg>
                          </div>
                        )}
                        {c.name === "Gentle" && (
                          <div className="group-hover:animate-pulse">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              {/* Magical dove with mystical wings */}
                              <circle cx="12" cy="8" r="2" fill="#F8C8D8" opacity="0.9"/>
                              <circle cx="12" cy="8" r="1" fill="#FFE4E1" opacity="0.7"/>
                              {/* Wings with magical glow */}
                              <path d="M12 10c-3 0-6-1-6-3s3-3 6-3 6 1 6 3-3 3-6 3z" fill="#A8E6CF" opacity="0.8"/>
                              <path d="M12 10c3 0 6-1 6-3s-3-3-6-3-6 1-6 3 3 3 6 3z" fill="#A8E6CF" opacity="0.8"/>
                              <path d="M12 10c-2.5 0-5-0.8-5-2.5s2.5-2.5 5-2.5 5 0.8 5 2.5-2.5 2.5-5 2.5z" fill="#C8E6C9" opacity="0.6"/>
                              <path d="M12 10c2.5 0 5-0.8 5-2.5s-2.5-2.5-5-2.5-5 0.8-5 2.5 2.5 2.5 5 2.5z" fill="#C8E6C9" opacity="0.6"/>
                              {/* Body with gentle glow */}
                              <path d="M12 12v4" stroke="#F8C8D8" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                              <path d="M12 12v4" stroke="#FFE4E1" strokeWidth="0.8" strokeLinecap="round" opacity="0.6"/>
                              {/* Tail feathers */}
                              <path d="M12 16l-1 2" stroke="#F8C8D8" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                              <path d="M12 16l1 2" stroke="#F8C8D8" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                              {/* Beak */}
                              <path d="M12 6l-0.5-1" stroke="#F8C8D8" strokeWidth="1" strokeLinecap="round" opacity="0.9"/>
                              <path d="M12 6l0.5-1" stroke="#F8C8D8" strokeWidth="1" strokeLinecap="round" opacity="0.9"/>
                              {/* Floating peace sparkles */}
                              <circle cx="8" cy="6" r="0.5" fill="#A8E6CF" opacity="0.7"/>
                              <circle cx="16" cy="6" r="0.7" fill="#C8E6C9" opacity="0.6"/>
                              <circle cx="6" cy="12" r="0.4" fill="#F8C8D8" opacity="0.8"/>
                              <circle cx="18" cy="12" r="0.6" fill="#A8E6CF" opacity="0.5"/>
                              {/* Wing glow */}
                              <circle cx="12" cy="10" r="4" fill="#A8E6CF" opacity="0.1"/>
                            </svg>
                          </div>
                        )}
                        {c.name === "Anxiety" && (
                          <div className="group-hover:animate-pulse">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              {/* Shaky cloud with zigzag lines - whimsical anxiety */}
                              <path d="M12 4c-3 0-6 2-6 4.5s3 4.5 6 4.5 6-2 6-4.5S15 4 12 4z" fill="#F8E0C8" opacity="0.8"/>
                              <path d="M12 4c-2 0-4 1.5-4 3.5s2 3.5 4 3.5 4-1.5 4-3.5S14 4 12 4z" fill="#F4D4A3" opacity="0.6"/>
                              {/* Zigzag anxiety lines */}
                              <path d="M8 8l1-1 1 1 1-1" stroke="#FFB366" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                              <path d="M16 8l1-1 1 1 1-1" stroke="#FFB366" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                              <path d="M12 10l1-1 1 1" stroke="#FFB366" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
                              {/* Floating worry particles */}
                              <circle cx="9" cy="6" r="0.6" fill="#FFB366" opacity="0.6"/>
                              <circle cx="15" cy="6" r="0.8" fill="#F4D4A3" opacity="0.7"/>
                              <circle cx="7" cy="10" r="0.5" fill="#FFB366" opacity="0.8"/>
                              <circle cx="17" cy="10" r="0.7" fill="#F4D4A3" opacity="0.6"/>
                              {/* Gentle mist around cloud */}
                              <circle cx="6" cy="8" r="1.2" fill="#F8E0C8" opacity="0.3"/>
                              <circle cx="18" cy="8" r="1" fill="#F8E0C8" opacity="0.3"/>
                              {/* Inner glow */}
                              <circle cx="12" cy="8" r="3" fill="#F8E0C8" opacity="0.1"/>
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
                    {selectedColor.name === "Sadness" && (
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
                        <FearIcon size={48} className="text-foreground/80" />
                      </div>
                    )}
                    {selectedColor.name === "Peace" && (
                      <div className="text-foreground/80">
                        <PeaceIcon size={48} className="text-foreground/80" />
                      </div>
                    )}
                    {selectedColor.name === "Hope" && (
                      <div className="text-foreground/80">
                        <HopeIcon size={48} className="text-foreground/80" />
                      </div>
                    )}
                    {selectedColor.name === "Gentle" && (
                      <div className="text-foreground/80">
                        <GentleIcon size={48} className="text-foreground/80" />
                      </div>
                    )}
                    {selectedColor.name === "Anxiety" && (
                      <div className="text-foreground/80">
                        <AnxietyIcon size={48} className="text-foreground/80" />
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
                    onClick={startBreathing}
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
                <div className="relative mt-16 mb-16">
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
                      className="w-48 h-48 md:w-56 md:h-56 rounded-full shadow-soft relative overflow-hidden will-change-transform"
                      style={{ 
                        ...animStyle,
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
                <div className="text-center mb-6 relative z-20 flex flex-col items-center">
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
                <div className="text-center mb-10">
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
    </div>
  );
}