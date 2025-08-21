import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ActivityHeader } from "@/components/ActivityHeader";


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

// Refined whimsical icons with better consistency
const EmotionIcon = ({ emotion, size = 48, className = "" }: { emotion: string; size?: number; className?: string }) => {
  const iconProps = {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    className: `transition-transform duration-300 ${className}`,
    fill: "none",
  };

  switch (emotion) {
    case "Joy":
      return (
        <svg {...iconProps}>
          <defs>
            <radialGradient id="sunGradient" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FFA500" />
            </radialGradient>
          </defs>
          <circle cx="24" cy="24" r="10" fill="url(#sunGradient)" stroke="#FFB347" strokeWidth="2"/>
          <g stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round">
            <line x1="24" y1="6" x2="24" y2="10" />
            <line x1="24" y1="38" x2="24" y2="42" />
            <line x1="6" y1="24" x2="10" y2="24" />
            <line x1="38" y1="24" x2="42" y2="24" />
            <line x1="12.2" y1="12.2" x2="14.8" y2="14.8" />
            <line x1="33.2" y1="33.2" x2="35.8" y2="35.8" />
            <line x1="12.2" y1="35.8" x2="14.8" y2="33.2" />
            <line x1="33.2" y1="14.8" x2="35.8" y2="12.2" />
          </g>
        </svg>
      );

    case "Sadness":
      return (
        <svg {...iconProps}>
          <defs>
            <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E3F2FD" />
              <stop offset="100%" stopColor="#BBDEFB" />
            </linearGradient>
          </defs>
          <path d="M12 20c0-6 4-10 12-10s12 4 12 10c0 2-1 4-3 4H15c-2 0-3-2-3-4z" 
                fill="url(#cloudGradient)" stroke="#90CAF9" strokeWidth="2"/>
          <g fill="#81C784" opacity="0.8">
            <ellipse cx="18" cy="28" rx="1.5" ry="6" />
            <ellipse cx="24" cy="30" rx="1.5" ry="4" />
            <ellipse cx="30" cy="29" rx="1.5" ry="5" />
          </g>
        </svg>
      );

    case "Love":
      return (
        <svg {...iconProps}>
          <defs>
            <radialGradient id="heartGradient" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFB6C1" />
              <stop offset="100%" stopColor="#FF69B4" />
            </radialGradient>
          </defs>
          <path d="M24 40c-2-2-8-6-12-12s-2-12 4-12 8 0 8 6c0-6 2-6 8-6s6 6 4 12-10 10-12 12z" 
                fill="url(#heartGradient)" stroke="#FF69B4" strokeWidth="2"/>
          <g stroke="#FFE4E1" strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
            <circle cx="18" cy="20" r="1" />
            <circle cx="30" cy="20" r="1" />
            <circle cx="24" cy="24" r="0.5" />
          </g>
        </svg>
      );

    case "Growth":
      return (
        <svg {...iconProps}>
          <defs>
            <linearGradient id="stemGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#4CAF50" />
              <stop offset="100%" stopColor="#8BC34A" />
            </linearGradient>
          </defs>
          <line x1="24" y1="40" x2="24" y2="20" stroke="url(#stemGradient)" strokeWidth="4" strokeLinecap="round"/>
          <path d="M16 16c4-4 8-4 8 4s4-8 8-4" stroke="#66BB6A" strokeWidth="3" 
                fill="none" strokeLinecap="round"/>
          <circle cx="24" cy="12" r="3" fill="#FFD54F" stroke="#FFC107" strokeWidth="2"/>
          <g stroke="#A5D6A7" strokeWidth="2" strokeLinecap="round" opacity="0.6">
            <line x1="20" y1="32" x2="18" y2="30" />
            <line x1="28" y1="28" x2="30" y2="26" />
          </g>
        </svg>
      );

    case "Fear":
      return (
        <svg {...iconProps}>
          <defs>
            <linearGradient id="mistGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E1BEE7" />
              <stop offset="100%" stopColor="#CE93D8" />
            </linearGradient>
          </defs>
          <ellipse cx="24" cy="30" rx="14" ry="8" fill="url(#mistGradient)" opacity="0.7"/>
          <ellipse cx="24" cy="25" rx="10" ry="6" fill="url(#mistGradient)" opacity="0.5"/>
          <ellipse cx="24" cy="20" rx="7" ry="4" fill="url(#mistGradient)" opacity="0.4"/>
          <g stroke="#BA68C8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
            <path d="M18 35c2-1 4-1 6 0s4 1 6 0" />
            <path d="M16 25c3-1 5-1 8 0s5 1 8 0" />
          </g>
        </svg>
      );

    case "Peace":
      return (
        <svg {...iconProps}>
          <defs>
            <radialGradient id="rippleGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#B2DFDB" />
              <stop offset="100%" stopColor="#80CBC4" />
            </radialGradient>
          </defs>
          <g opacity="0.3">
            <ellipse cx="24" cy="36" rx="18" ry="6" fill="url(#rippleGradient)"/>
          </g>
          <g opacity="0.5">
            <ellipse cx="24" cy="28" rx="12" ry="4" fill="url(#rippleGradient)"/>
          </g>
          <g opacity="0.7">
            <ellipse cx="24" cy="20" rx="8" ry="3" fill="url(#rippleGradient)"/>
          </g>
          <circle cx="24" cy="16" r="2" fill="#4DB6AC"/>
        </svg>
      );

    case "Hope":
      return (
        <svg {...iconProps}>
          <defs>
            <radialGradient id="starGradient" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFEB3B" />
              <stop offset="100%" stopColor="#FFC107" />
            </radialGradient>
          </defs>
          <path d="M24 8l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9l3-9z" 
                fill="url(#starGradient)" stroke="#FFB300" strokeWidth="2"/>
          <g stroke="#FFF9C4" strokeWidth="1" strokeLinecap="round" opacity="0.8">
            <line x1="24" y1="12" x2="24" y2="14" />
            <line x1="28" y1="16" x2="26" y2="16" />
            <line x1="20" y1="16" x2="22" y2="16" />
            <line x1="27" y1="24" x2="25" y2="22" />
            <line x1="21" y1="24" x2="23" y2="22" />
          </g>
        </svg>
      );

    case "Gentle":
      return (
        <svg {...iconProps}>
          <defs>
            <radialGradient id="gentleGradient" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#F8BBD9" />
              <stop offset="100%" stopColor="#F48FB1" />
            </radialGradient>
          </defs>
          <circle cx="24" cy="16" r="8" fill="url(#gentleGradient)" stroke="#F06292" strokeWidth="2"/>
          <path d="M12 16c4-2 8-2 12 0s8 2 12 0" stroke="#FCE4EC" strokeWidth="3" 
                fill="none" strokeLinecap="round"/>
          <line x1="24" y1="24" x2="24" y2="34" stroke="#F8BBD9" strokeWidth="3" strokeLinecap="round"/>
          <g fill="#FFE0E6" opacity="0.8">
            <circle cx="20" cy="14" r="1.5" />
            <circle cx="28" cy="14" r="1.5" />
          </g>
        </svg>
      );

    case "Anxiety":
      return (
        <svg {...iconProps}>
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFCC80" />
              <stop offset="50%" stopColor="#FFB74D" />
              <stop offset="100%" stopColor="#FF9800" />
            </linearGradient>
          </defs>
          <g stroke="url(#waveGradient)" strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M8 16l3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3" />
            <path d="M8 24l3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3" />
            <path d="M8 32l3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3" />
          </g>
          <g fill="#FFF3E0" opacity="0.6">
            <circle cx="15" cy="13" r="1" />
            <circle cx="27" cy="21" r="1" />
            <circle cx="33" cy="29" r="1" />
          </g>
        </svg>
      );

    default:
      return null;
  }
};

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
  const [currentRound, setCurrentRound] = useState(1);
  const [sessionComplete, setSessionComplete] = useState(false);
  const tickRef = useRef<number | null>(null);

  const TOTAL_ROUNDS = 4;

  const phase = PHASES[phaseIndex];

  // Set up 1s countdown + switch to next phase
  useEffect(() => {
    if (!running || sessionComplete) return;

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
        const nextPhaseIndex = (phaseIndex + 1) % PHASES.length;
        
        // Check if we completed a full round (back to inhale)
        if (nextPhaseIndex === 0) {
          const nextRound = currentRound + 1;
          if (nextRound > TOTAL_ROUNDS) {
            // Session complete!
            setSessionComplete(true);
            setRunning(false);
            return;
          } else {
            setCurrentRound(nextRound);
          }
        }
        
        setPhaseIndex(nextPhaseIndex);
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
  }, [phaseIndex, running, sessionComplete]);

  const animStyle = useMemo<React.CSSProperties>(() => {
    return {
      animationName: phase.anim,
      animationDuration: `${phase.seconds * 1000}ms`,
      animationTimingFunction: "cubic-bezier(0.4, 0, 0.6, 1)", // More natural easing
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
    // Reset session state
    setSessionComplete(false);
    setCurrentRound(1);
    setPhaseIndex(0);
    setShowInstructions(false);
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
    if (!sessionComplete) {
      setRunning(true);
    }
  };

  // Restart the entire session
  const restartSession = () => {
    setSessionComplete(false);
    setCurrentRound(1);
    setPhaseIndex(0);
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
        {/* Enhanced breathing animations with natural easing */}
        <style>{`
          /* --- Refined Color Breathing keyframes --- */

          /* Breathe In (expand over 4s) - More natural expansion */
          @keyframes breatheIn {
            0%   { 
              transform: scale(1) rotate(0deg); 
              opacity: 0.85; 
              filter: blur(0px) brightness(1);
            }
            50%  { 
              transform: scale(1.15) rotate(1deg); 
              opacity: 0.95; 
              filter: blur(0.5px) brightness(1.05);
            }
            100% { 
              transform: scale(1.3) rotate(0deg); 
              opacity: 1; 
              filter: blur(0px) brightness(1.1);
            }
          }

          /* Hold after inhale (gentle organic pulse) */
          @keyframes holdExpanded {
            0%   { 
              transform: scale(1.3) rotate(0deg); 
              opacity: 1; 
              filter: brightness(1.1);
            }
            25%  { 
              transform: scale(1.32) rotate(0.5deg); 
              opacity: 0.98; 
              filter: brightness(1.08);
            }
            50%  { 
              transform: scale(1.34) rotate(0deg); 
              opacity: 0.96; 
              filter: brightness(1.12);
            }
            75%  { 
              transform: scale(1.32) rotate(-0.5deg); 
              opacity: 0.98; 
              filter: brightness(1.08);
            }
            100% { 
              transform: scale(1.3) rotate(0deg); 
              opacity: 1; 
              filter: brightness(1.1);
            }
          }

          /* Breathe Out (contract over 4s) - Smooth release */
          @keyframes breatheOut {
            0%   { 
              transform: scale(1.3) rotate(0deg); 
              opacity: 1; 
              filter: blur(0px) brightness(1.1);
            }
            50%  { 
              transform: scale(1.15) rotate(-1deg); 
              opacity: 0.92; 
              filter: blur(0.5px) brightness(1.02);
            }
            100% { 
              transform: scale(1) rotate(0deg); 
              opacity: 0.85; 
              filter: blur(0px) brightness(1);
            }
          }

          /* Hold after exhale (subtle settling) */
          @keyframes holdContracted {
            0%   { 
              transform: scale(1) rotate(0deg); 
              opacity: 0.85; 
              filter: brightness(1);
            }
            25%  { 
              transform: scale(1.01) rotate(0.2deg); 
              opacity: 0.88; 
              filter: brightness(1.02);
            }
            50%  { 
              transform: scale(1.02) rotate(0deg); 
              opacity: 0.9; 
              filter: brightness(1.04);
            }
            75%  { 
              transform: scale(1.01) rotate(-0.2deg); 
              opacity: 0.88; 
              filter: brightness(1.02);
            }
            100% { 
              transform: scale(1) rotate(0deg); 
              opacity: 0.85; 
              filter: brightness(1);
            }
          }

          /* Icon hover animations */
          .emotion-icon {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
          }

          .emotion-icon:hover {
            transform: scale(1.1) translateY(-2px);
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));
          }

          .emotion-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.6, 1);
          }

          .emotion-card:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 12px 24px rgba(0,0,0,0.1);
          }

          .emotion-card.selected {
            animation: selectedPulse 2s infinite;
          }

          @keyframes selectedPulse {
            0%, 100% { transform: translateY(-2px) scale(1.01); }
            50% { transform: translateY(-4px) scale(1.02); }
          }

          /* Floating animation for breathing circle */
          .breathing-circle {
            will-change: transform, opacity, filter;
          }
        `}</style>

        <div className="text-center mb-8">
          {!running && !showInstructions && !sessionComplete ? (
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
          ) : sessionComplete ? (
            <>
              <h1 className="font-heading text-3xl sm:text-4xl text-foreground/90 font-light mb-2">
                Session Complete
              </h1>
              <p className="text-foreground/70 font-sans text-sm">You've completed 4 rounds of breathing with {selectedColor.name.toLowerCase()}</p>
            </>
          ) : (
            <>
              <h1 className="font-heading text-3xl sm:text-4xl text-foreground/90 font-light mb-2">
                Breathing Session
              </h1>
              <p className="text-foreground/70 font-sans text-sm">Round {currentRound} of {TOTAL_ROUNDS} • Focus on your breath and let the emotion guide you</p>
            </>
          )}
        </div>

        <Card className="p-6 border-0 shadow-soft relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 -z-10" style={{
            background: `radial-gradient(60% 60% at 50% 30%, ${selectedColor.value}15 0%, transparent 70%)`,
            transition: "background 500ms cubic-bezier(0.4, 0, 0.6, 1)",
          }} />

          {!running && !showInstructions && !sessionComplete ? (
            <>
              {/* Color selection with refined icons */}
              <div className="text-center">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                  {COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`emotion-card p-8 rounded-2xl border-2 relative group ${
                        selectedColor.value === c.value 
                          ? 'border-primary shadow-lg selected' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      style={{ backgroundColor: c.value }}
                      aria-label={`Choose ${c.name}`}
                    >
                      <div className="mb-4 flex justify-center items-center emotion-icon">
                        <EmotionIcon emotion={c.name} size={48} />
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
          ) : sessionComplete ? (
            <>
              {/* Clean Session Complete Screen */}
              <div className="text-center max-w-lg mx-auto">
                {/* Simple completion celebration */}
                <div className="mb-10">
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <EmotionIcon emotion={selectedColor.name} size={48} className="opacity-80" />
                  </div>
                  <h3 className="font-heading text-2xl text-foreground/90 font-light mb-3">
                    Session Complete
                  </h3>
                  <p className="font-sans text-foreground/60 text-sm leading-relaxed">
                    You've spent a mindful minute with {selectedColor.name.toLowerCase()}. 
                    Notice how you feel in this moment.
                  </p>
                </div>

                {/* Clean insight card */}
                <div className="mb-10 p-6 rounded-2xl border border-foreground/10" style={{ backgroundColor: `${selectedColor.value}20` }}>
                  <h4 className="font-heading text-base text-foreground/90 font-medium mb-3">
                    The essence of {selectedColor.name.toLowerCase()}
                  </h4>
                  <p className="font-sans text-foreground/70 text-sm leading-relaxed mb-4">
                    {COLOR_INFO[selectedColor.name as keyof typeof COLOR_INFO].associations}
                  </p>
                  
                  {/* Simple daily intention */}
                  <div className="pt-3 border-t border-foreground/10">
                    <p className="font-sans text-foreground/80 text-sm">
                      {selectedColor.name === "Joy" && "Carry this warmth forward and share a smile with someone today."}
                      {selectedColor.name === "Sadness" && "Honor this clarity and check in with someone who might need support."}
                      {selectedColor.name === "Love" && "Let this tenderness guide your interactions with kindness."}
                      {selectedColor.name === "Growth" && "Take one small step toward something that matters to you."}
                      {selectedColor.name === "Fear" && "Remember this courage when facing today's challenges."}
                      {selectedColor.name === "Peace" && "Return to this tranquility whenever you need grounding."}
                      {selectedColor.name === "Hope" && "Plant one seed of possibility in your day ahead."}
                      {selectedColor.name === "Gentle" && "Treat yourself with the same kindness you'd give a dear friend."}
                      {selectedColor.name === "Anxiety" && "When overwhelmed, take three breaths and feel your feet on the ground."}
                    </p>
                  </div>
                </div>

                {/* Simple action buttons */}
                <div className="flex flex-col gap-4 items-center">
                  <Button 
                    onClick={restartSession}
                    className="font-sans px-8 py-2 bg-foreground text-white hover:bg-foreground/90"
                  >
                    Breathe with {selectedColor.name} Again
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setSessionComplete(false);
                      setShowInstructions(false);
                    }}
                    className="font-sans text-foreground/60 hover:text-foreground/80 text-sm"
                  >
                    Explore Another Emotion
                  </Button>
                </div>
              </div>
            </>
          ) : showInstructions ? (
            <>
              {/* Instructional page with refined icon */}
              <div className="text-center max-w-lg mx-auto">
                {/* Emotion icon preview */}
                <div className="mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center emotion-icon">
                    <EmotionIcon emotion={selectedColor.name} size={64} />
                  </div>
                  <h3 className="font-heading text-2xl text-foreground/90 font-light mb-3">
                    {selectedColor.name === "Fear" || selectedColor.name === "Anxiety" 
                      ? "Let go of fear" 
                      : `Breathe with ${selectedColor.name}`
                    }
                  </h3>
                  <p className="text-foreground/60 text-sm mb-4">
                    This session will take just over a minute to complete
                  </p>
                </div>

                {/* Simplified breathing pattern */}
                <div className="mb-8">
                  <p className="text-foreground/60 text-sm mb-3 tracking-wide font-medium">4 rounds • 64 seconds (1 min 4 sec)</p>
                  <div className="flex items-center justify-center gap-4 text-foreground/80 font-medium">
                    <span className="px-3 py-2 bg-foreground/5 rounded-lg text-sm">Inhale 4s</span>
                    <span className="text-foreground/40">•</span>
                    <span className="px-3 py-2 bg-foreground/5 rounded-lg text-sm">Hold 4s</span>
                    <span className="text-foreground/40">•</span>
                    <span className="px-3 py-2 bg-foreground/5 rounded-lg text-sm">Exhale 4s</span>
                    <span className="text-foreground/40">•</span>
                    <span className="px-3 py-2 bg-foreground/5 rounded-lg text-sm">Hold 4s</span>
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
              {/* Minimalist Breathing Session */}
              <div className="flex flex-col items-center text-center">
                {/* Clean breathing visualization */}
                <div className="relative mt-20 mb-20">
                  {/* Simplified breathing circle */}
                  <div className="relative">
                    {/* Single subtle background ring */}
                    <div className="absolute inset-0 -z-10">
                      <div 
                        className="absolute inset-0 rounded-full opacity-10 transition-all duration-1000 ease-out"
                        style={{ 
                          background: `radial-gradient(circle, ${selectedColor.value}60 0%, transparent 70%)`,
                          transform: `scale(${phase.anim === "breatheIn" || phase.anim === "holdExpanded" ? 1.3 : 1})`,
                          filter: "blur(8px)"
                        }}
                      />
                    </div>
                    
                    {/* Main breathing circle - cleaner design */}
                    <div 
                      className="breathing-circle w-40 h-40 md:w-48 md:h-48 rounded-full relative overflow-hidden"
                      style={{ 
                        ...animStyle,
                        background: `radial-gradient(circle at 40% 30%, ${selectedColor.value}E6, ${selectedColor.value}CC 70%)`,
                        boxShadow: `0 4px 20px ${selectedColor.value}30, 0 0 0 1px ${selectedColor.value}40`,
                      }}
                    >
                    </div>
                  </div>
                </div>

                {/* Minimal progress and instructions */}
                <div className="text-center mb-8 space-y-6">
                  {/* Simple round indicator */}
                  <div className="flex items-center justify-center gap-1.5">
                    {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          i < currentRound - 1 
                            ? 'bg-foreground/60' 
                            : i === currentRound - 1 
                              ? 'bg-foreground/80' 
                              : 'bg-foreground/20'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Clean phase label */}
                  <h2 className="font-heading text-lg font-light text-foreground/80 tracking-wide">
                    {phase.label}
                  </h2>
                  
                  {/* Large countdown timer */}
                  <div 
                    className="font-mono text-4xl md:text-5xl font-light text-foreground/70 tracking-wider"
                    style={{
                      fontFeatureSettings: '"tnum"', // Tabular numbers for consistent width
                    }}
                  >
                    {secondsLeft}
                  </div>

                  {/* Whimsical place-based descriptions */}
                  <p className="font-sans text-foreground/60 text-sm mt-4 max-w-xs mx-auto leading-relaxed">
                    {phase.key === "inhale" && selectedColor.name === "Joy" && "Imagine golden sunlight streaming through your window"}
                    {phase.key === "inhale" && selectedColor.name === "Sadness" && "Picture gentle rain falling on a quiet pond"}
                    {phase.key === "inhale" && selectedColor.name === "Love" && "Envision warm rose petals floating in still water"}
                    {phase.key === "inhale" && selectedColor.name === "Growth" && "See tender green shoots reaching toward morning light"}
                    {phase.key === "inhale" && selectedColor.name === "Fear" && "Imagine soft lavender mist settling over a peaceful meadow"}
                    {phase.key === "inhale" && selectedColor.name === "Peace" && "Picture calm mint-green waves lapping a quiet shore"}
                    {phase.key === "inhale" && selectedColor.name === "Hope" && "Envision the first star appearing in a twilight sky"}
                    {phase.key === "inhale" && selectedColor.name === "Gentle" && "See soft pink clouds drifting across an endless sky"}
                    {phase.key === "inhale" && selectedColor.name === "Anxiety" && "Imagine warm sand beneath your feet on a quiet beach"}

                    {phase.key === "hold1" && "Rest here in this peaceful place"}
                    
                    {phase.key === "exhale" && selectedColor.name === "Joy" && "Let the warmth spread through every part of you"}
                    {phase.key === "exhale" && selectedColor.name === "Sadness" && "Feel the gentle cleansing wash through you"}
                    {phase.key === "exhale" && selectedColor.name === "Love" && "Allow the tenderness to fill your heart"}
                    {phase.key === "exhale" && selectedColor.name === "Growth" && "Sense yourself growing stronger and more rooted"}
                    {phase.key === "exhale" && selectedColor.name === "Fear" && "Watch your worries dissolve into the mist"}
                    {phase.key === "exhale" && selectedColor.name === "Peace" && "Let the tranquility flow through every cell"}
                    {phase.key === "exhale" && selectedColor.name === "Hope" && "Feel new possibilities awakening within you"}
                    {phase.key === "exhale" && selectedColor.name === "Gentle" && "Soften into this moment of pure kindness"}
                    {phase.key === "exhale" && selectedColor.name === "Anxiety" && "Release your tension into the welcoming earth"}

                    {phase.key === "hold2" && "Enjoy this moment of perfect stillness"}
                  </p>
                </div>

                {/* Single CTA button */}
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setRunning(false);
                      setSessionComplete(false);
                      setShowInstructions(false);
                    }}
                    className="font-sans text-foreground/50 hover:text-foreground/70 text-sm"
                  >
                    Change Emotion
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