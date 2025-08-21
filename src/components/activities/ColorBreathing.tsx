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
    associations: "Breathe in steady clarity. As you exhale, let sadness drift away like gentle rain.",
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
            <radialGradient id="moonGradient" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#E3F2FD" />
              <stop offset="100%" stopColor="#90CAF9" />
            </radialGradient>
          </defs>
          
          {/* Crescent moon - clean and peaceful */}
          <path d="M28 8c-8 0-14 6-14 14s6 14 14 14c2 0 4-0.5 6-1.5-6 0-11-5-11-11.5s5-11.5 11-11.5c-2-1-4-1.5-6-1.5z" 
                fill="url(#moonGradient)" stroke="#64B5F6" strokeWidth="2" className="gentleBreathe"/>
          
          {/* Inner moon glow */}
          <path d="M26 12c-6 0-10 4-10 10s4 10 10 10c1.5 0 3-0.3 4-1-4 0-7.5-3.5-7.5-8s3.5-8 7.5-8c-1-0.7-2.5-1-4-1z" 
                fill="#E1F5FE" opacity="0.8" className="softGlow"/>
          
          {/* Gentle starlight */}
          <g stroke="#B3E5FC" strokeWidth="1" strokeLinecap="round" opacity="0.8" className="animate-twinkle" style={{ animationDelay: "0.5s" }}>
            <line x1="16" y1="16" x2="16" y2="18" />
            <line x1="15" y1="17" x2="17" y2="17" />
            <line x1="36" y1="20" x2="36" y2="22" />
            <line x1="35" y1="21" x2="37" y2="21" />
            <line x1="20" y1="36" x2="20" y2="38" />
            <line x1="19" y1="37" x2="21" y2="37" />
          </g>
          
          {/* Twinkling stars */}
          <g fill="#B3E5FC" opacity="0.9">
            <circle cx="14" cy="14" r="0.8" className="animate-twinkle" style={{ animationDelay: "1s" }} />
            <circle cx="38" cy="18" r="0.6" className="animate-twinkle" style={{ animationDelay: "1.5s" }} />
            <circle cx="18" cy="38" r="0.7" className="animate-twinkle" style={{ animationDelay: "0.3s" }} />
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
          
          {/* Clean geometric heart shape */}
          <path d="M24 36c-8-8-12-16-12-20 0-6 6-10 12-10s12 4 12 10c0 4-4 12-12 20z" 
                fill="url(#heartGradient)" stroke="#FF1493" strokeWidth="2" className="gentleBreathe"/>
          
          {/* Inner heart glow */}
          <path d="M24 32c-6-6-9-12-9-15 0-4 4-7 9-7s9 3 9 7c0 3-3 9-9 15z" 
                fill="#FFC0CB" opacity="0.6" className="softGlow"/>
          
          {/* Sparkle crosses */}
          <g stroke="#FFE4E1" strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
            <line x1="16" y1="20" x2="16" y2="22" />
            <line x1="15" y1="21" x2="17" y2="21" />
            <line x1="32" y1="20" x2="32" y2="22" />
            <line x1="31" y1="21" x2="33" y2="21" />
            <line x1="24" y1="12" x2="24" y2="14" />
            <line x1="23" y1="13" x2="25" y2="13" />
          </g>
        </svg>
      );

    case "Growth":
      return (
        <svg {...iconProps}>
          <defs>
            <linearGradient id="trunkGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#6D4C41" />
              <stop offset="100%" stopColor="#8D6E63" />
            </linearGradient>
            <radialGradient id="foliageGradient" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#81C784" />
              <stop offset="100%" stopColor="#4CAF50" />
            </radialGradient>
          </defs>
          
          {/* Tree trunk */}
          <rect x="21" y="28" width="6" height="14" rx="2" fill="url(#trunkGradient)" className="gentleRotate" style={{ animationDuration: "8s" }} />
          
          {/* Tree foliage clusters */}
          <g className="floatSlow" style={{ animationDelay: "0.2s" }}>
            <circle cx="16" cy="20" r="6" fill="url(#foliageGradient)" opacity="0.9" />
            <circle cx="32" cy="20" r="6" fill="url(#foliageGradient)" opacity="0.9" />
            <circle cx="24" cy="16" r="7" fill="url(#foliageGradient)" opacity="0.9" />
            <circle cx="20" cy="26" r="4" fill="url(#foliageGradient)" opacity="0.8" />
            <circle cx="28" cy="26" r="4" fill="url(#foliageGradient)" opacity="0.8" />
          </g>
          
          {/* Small branches */}
          <g stroke="#8D6E63" strokeWidth="2" strokeLinecap="round" opacity="0.7" className="gentleRotate" style={{ animationDelay: "0.5s", animationDuration: "10s" }}>
            <path d="M21 32l-3-2" />
            <path d="M27 32l3-2" />
            <path d="M21 36l-2-1" />
            <path d="M27 36l2-1" />
          </g>
          
          {/* Growing leaves - subtle sparkles */}
          <g fill="#A5D6A7" opacity="0.8">
            <circle cx="14" cy="18" r="1" className="animate-twinkle" style={{ animationDelay: "1s" }} />
            <circle cx="34" cy="22" r="0.8" className="animate-twinkle" style={{ animationDelay: "2s" }} />
            <circle cx="26" cy="12" r="0.6" className="animate-twinkle" style={{ animationDelay: "1.5s" }} />
          </g>
        </svg>
      );

    case "Fear":
      return (
        <svg {...iconProps}>
          <defs>
            <linearGradient id="mountainGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#E1F5FE" />
              <stop offset="100%" stopColor="#B3E5FC" />
            </linearGradient>
            <radialGradient id="skyGradient" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#F3E5F5" />
              <stop offset="100%" stopColor="#E1BEE7" />
            </radialGradient>
          </defs>
          
          {/* Gentle hill silhouettes - representing strength and overcoming */}
          <g fill="url(#mountainGradient)" stroke="#81C784" strokeWidth="1.5">
            {/* Left hill */}
            <path d="M8 40 Q16 32 20 28 Q24 32 28 40z" />
            {/* Right hill */}
            <path d="M28 40 Q32 36 36 32 Q38 36 40 40z" />
            {/* Center hill */}
            <path d="M20 40 Q24 30 28 26 Q32 30 36 40z" />
          </g>
          
          {/* Sky glow behind hills */}
          <path d="M8 40 Q16 32 20 28 Q24 32 28 40z" fill="url(#skyGradient)" opacity="0.3"/>
          <path d="M28 40 Q32 36 36 32 Q38 36 40 40z" fill="url(#skyGradient)" opacity="0.3"/>
          <path d="M20 40 Q24 30 28 26 Q32 30 36 40z" fill="url(#skyGradient)" opacity="0.3"/>
          
          {/* Inspiring sparkles */}
          <g fill="#E1F5FE" opacity="0.8">
            <circle cx="12" cy="16" r="0.8" className="animate-twinkle" style={{ animationDelay: "1s" }} />
            <circle cx="36" cy="18" r="0.6" className="animate-twinkle" style={{ animationDelay: "1.5s" }} />
            <circle cx="24" cy="12" r="0.7" className="animate-twinkle" style={{ animationDelay: "0.5s" }} />
            <circle cx="18" cy="28" r="0.5" className="animate-twinkle" style={{ animationDelay: "2s" }} />
          </g>
        </svg>
      );

    case "Peace":
      return (
        <svg {...iconProps}>
          <defs>
            <linearGradient id="stoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B0BEC5" />
              <stop offset="100%" stopColor="#78909C" />
            </linearGradient>
          </defs>
          
          {/* Zen stones stacked - bottom to top */}
          <g className="floatSlow" style={{ animationDelay: "0.1s" }}>
            {/* Bottom stone - largest */}
            <ellipse cx="24" cy="36" rx="14" ry="5" fill="url(#stoneGradient)" opacity="0.9" />
            <ellipse cx="24" cy="35" rx="12" ry="4" fill="#CFD8DC" opacity="0.7" />
            
            {/* Middle stone */}
            <ellipse cx="24" cy="28" rx="10" ry="4" fill="url(#stoneGradient)" opacity="0.9" />
            <ellipse cx="24" cy="27" rx="8" ry="3" fill="#CFD8DC" opacity="0.7" />
            
            {/* Top stone - smallest */}
            <ellipse cx="24" cy="20" rx="7" ry="3" fill="url(#stoneGradient)" opacity="0.9" />
            <ellipse cx="24" cy="19" rx="5" ry="2.5" fill="#CFD8DC" opacity="0.7" />
          </g>
          
          {/* Subtle zen ripples */}
          <g stroke="#90A4AE" strokeWidth="1" fill="none" opacity="0.3" className="gentleRotate" style={{ animationDuration: "12s" }}>
            <circle cx="24" cy="24" r="20" />
            <circle cx="24" cy="24" r="24" />
          </g>
          
          {/* Peaceful sparkles */}
          <g fill="#B0BEC5" opacity="0.6">
            <circle cx="12" cy="16" r="0.8" className="animate-twinkle" style={{ animationDelay: "2s" }} />
            <circle cx="36" cy="20" r="0.6" className="animate-twinkle" style={{ animationDelay: "3s" }} />
            <circle cx="18" cy="32" r="0.5" className="animate-twinkle" style={{ animationDelay: "1s" }} />
          </g>
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
          
          {/* Five-pointed star */}
          <path d="M24 8l4.8 9.8 10.8 1.6-7.8 7.6 1.8 10.8L24 32.4l-9.6 5.4 1.8-10.8-7.8-7.6 10.8-1.6L24 8z" 
                fill="url(#starGradient)" stroke="#FFB300" strokeWidth="2" className="gentleBreathe"/>
          
          {/* Inner star glow */}
          <path d="M24 12l3.2 6.5 7.2 1.1-5.2 5 1.2 7.2L24 28.2l-6.4 3.6 1.2-7.2-5.2-5 7.2-1.1L24 12z" 
                fill="#FFF9C4" opacity="0.8" className="softGlow"/>
          
          {/* Sparkling rays */}
          <g stroke="#FFF9C4" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" className="animate-twinkle" style={{ animationDelay: "0.5s" }}>
            <line x1="24" y1="4" x2="24" y2="8" />
            <line x1="24" y1="40" x2="24" y2="44" />
            <line x1="4" y1="24" x2="8" y2="24" />
            <line x1="40" y1="24" x2="44" y2="24" />
            <line x1="10.3" y1="10.3" x2="12.7" y2="12.7" />
            <line x1="35.3" y1="35.3" x2="37.7" y2="37.7" />
            <line x1="10.3" y1="37.7" x2="12.7" y2="35.3" />
            <line x1="35.3" y1="12.7" x2="37.7" y2="10.3" />
          </g>
          
          {/* Twinkling points */}
          <g fill="#FFEB3B" opacity="0.9">
            <circle cx="16" cy="16" r="1" className="animate-twinkle" style={{ animationDelay: "1s" }} />
            <circle cx="32" cy="16" r="1" className="animate-twinkle" style={{ animationDelay: "1.8s" }} />
            <circle cx="16" cy="32" r="1" className="animate-twinkle" style={{ animationDelay: "0.3s" }} />
            <circle cx="32" cy="32" r="1" className="animate-twinkle" style={{ animationDelay: "2.3s" }} />
          </g>
        </svg>
      );

    case "Gentle":
      return (
        <svg {...iconProps}>
          <defs>
            <radialGradient id="butterflyGradient" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#F8F8FF" />
              <stop offset="100%" stopColor="#E6E6FA" />
            </radialGradient>
          </defs>
          
          {/* Delicate butterfly with soft wings */}
          <g className="gentleBreathe">
            {/* Butterfly body */}
            <path d="M24 20l0 16" stroke="#DDA0DD" strokeWidth="2" strokeLinecap="round" fill="none"/>
            
            {/* Left wing - soft and flowing */}
            <path d="M24 20 Q16 16 12 20 Q16 24 24 28 Q16 32 12 36 Q16 40 24 44" 
                  fill="url(#butterflyGradient)" stroke="#DDA0DD" strokeWidth="1.5" opacity="0.9"/>
            
            {/* Right wing - soft and flowing */}
            <path d="M24 20 Q32 16 36 20 Q32 24 24 28 Q32 32 36 36 Q32 40 24 44" 
                  fill="url(#butterflyGradient)" stroke="#DDA0DD" strokeWidth="1.5" opacity="0.9"/>
            
            {/* Wing details */}
            <g className="floatSlow" style={{ animationDelay: "0.3s" }}>
              <circle cx="18" cy="24" r="1" fill="#DDA0DD" opacity="0.6" />
              <circle cx="30" cy="24" r="1" fill="#DDA0DD" opacity="0.6" />
              <circle cx="16" cy="32" r="0.8" fill="#DDA0DD" opacity="0.5" />
              <circle cx="32" cy="32" r="0.8" fill="#DDA0DD" opacity="0.5" />
            </g>
          </g>
          
          {/* Gentle sparkles */}
          <g fill="#E6E6FA" opacity="0.7">
            <circle cx="16" cy="16" r="0.8" className="animate-twinkle" style={{ animationDelay: "0.5s" }} />
            <circle cx="32" cy="18" r="0.6" className="animate-twinkle" style={{ animationDelay: "1.2s" }} />
            <circle cx="20" cy="36" r="0.7" className="animate-twinkle" style={{ animationDelay: "0.8s" }} />
          </g>
        </svg>
      );

    case "Anxiety":
      return (
        <svg {...iconProps}>
          <defs>
            <radialGradient id="spiralGradient" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </radialGradient>
          </defs>
          
          {/* Calming spiral pattern */}
          <g stroke="url(#spiralGradient)" strokeWidth="2.5" fill="none" strokeLinecap="round" className="gentleRotate" style={{ animationDuration: "12s" }}>
            <path d="M24 24c0-2 2-4 4-4s6 2 6 6-4 8-8 8-10-4-10-10 6-12 12-12" opacity="0.8"/>
            <path d="M24 24c0-1 1-2 2-2s3 1 3 3-2 4-4 4-5-2-5-5 3-6 6-6" opacity="0.6"/>
          </g>
          
          {/* Center calming dot */}
          <circle cx="24" cy="24" r="2" fill="url(#spiralGradient)" className="gentleBreathe"/>
          
          {/* Floating calm elements */}
          <g className="floatSlow" style={{ animationDelay: "0.5s" }}>
            <circle cx="16" cy="16" r="1.5" fill="#C4B5FD" opacity="0.7"/>
            <circle cx="32" cy="16" r="1.2" fill="#C4B5FD" opacity="0.6"/>
            <circle cx="16" cy="32" r="1.3" fill="#C4B5FD" opacity="0.6"/>
            <circle cx="32" cy="32" r="1.4" fill="#C4B5FD" opacity="0.7"/>
          </g>
          
          {/* Gentle breathing sparkles */}
          <g fill="#DDD6FE" opacity="0.8">
            <circle cx="12" cy="20" r="0.4" className="animate-twinkle" style={{ animationDelay: "0.8s" }} />
            <circle cx="36" cy="20" r="0.5" className="animate-twinkle" style={{ animationDelay: "1.6s" }} />
            <circle cx="20" cy="12" r="0.3" className="animate-twinkle" style={{ animationDelay: "1.2s" }} />
            <circle cx="28" cy="36" r="0.4" className="animate-twinkle" style={{ animationDelay: "2s" }} />
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
                      {selectedColor.name === "Sadness" && "Remember this clarity and let go of what no longer serves you."}
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
                    {phase.key === "exhale" && selectedColor.name === "Sadness" && "Let the sadness drift away like gentle rain"}
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