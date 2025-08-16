import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const PROMPTS = [
  "Describe a tiny, imaginary place you'd visit if you could shrink to the size of a teacup.",
  "Invent a weather forecast for a magical town (e.g., 'sprinkles of joy, occasional cloud of curiosity').",
  "If your day were a small creature, what would it look like and what would it carry?",
  "Name a color that doesn't exist yet and describe what it feels like.",
  "Imagine a mini celebration happening on your desk right now — what's it for?",
  "Turn a household object into a character. What's its secret talent?",
  "Write a postcard from a dream you half-remember.",
  "If calmness had a taste and a texture, what would it be?",
  "Describe a cloud you'd keep in a jar and when you'd let it out.",
  "What would the moon write to you if it could send letters?",
  "Your favorite cup has a hidden superpower — what is it?",
  "Invent a tiny festival only two people know about.",
  "Turn a sound you love into a little visual scene.",
  "Imagine a library of scents — what's the book you'd check out today?",
  "Give a name and story to the shadow you see right now."
];

// Custom SVG doodles for each prompt theme
const TeacupDoodle = ({ color }: { color: string }) => (
  <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 22h30a7 7 0 01-7 7H17A7 7 0 0110 22z" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M40 22h5c3 0 3 5 0 5h-4" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M20 14c0 3-4 3-4 6M28 14c0 3-4 3-4 6M36 14c0 3-4 3-4 6" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const WeatherDoodle = ({ color }: { color: string }) => (
  <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="42" cy="12" r="6" fill={color} opacity="0.4" />
    <path d="M10 25c0-4 3-7 7-7 1-4 6-6 10-4 2-4 7-5 11-2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M9 28h32c3 0 6-2 6-6 0-3-3-6-6-6-1 0-2 0-3 0" fill={color} opacity="0.2" />
  </svg>
);

const CreatureDoodle = ({ color }: { color: string }) => (
  <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Small creature body */}
    <ellipse cx="30" cy="35" rx="12" ry="8" fill={color} opacity="0.2" stroke={color} strokeWidth="2" />
    
    {/* Creature head */}
    <circle cx="30" cy="25" r="8" fill={color} opacity="0.2" stroke={color} strokeWidth="2" />
    
    {/* Creature ears */}
    <path d="M25 20l-2-4 4 0z" fill={color} opacity="0.3" />
    <path d="M35 20l2-4-4 0z" fill={color} opacity="0.3" />
    
    {/* Creature face */}
    <circle cx="27" cy="23" r="2" fill={color} />
    <circle cx="33" cy="23" r="2" fill={color} />
    <path d="M29 27 Q30 28 31 27" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    
    {/* Creature legs */}
    <path d="M25 40l-2 6M35 40l2 6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    
    {/* Creature carrying something */}
    <rect x="40" y="30" width="8" height="6" rx="2" fill={color} opacity="0.3" stroke={color} strokeWidth="1" />
    <path d="M44 32h4M44 34h3" stroke={color} strokeWidth="0.5" />
    
    {/* Small items it's carrying */}
    <circle cx="42" cy="28" r="1" fill={color} opacity="0.6" />
    <circle cx="46" cy="28" r="0.8" fill={color} opacity="0.6" />
  </svg>
 );

const ColorDoodle = ({ color }: { color: string }) => (
  <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="25" r="15" stroke={color} strokeWidth="2" fill="none" />
    <path d="M30 10l5 15-5 15-5-15z" fill={color} opacity="0.3" />
    <path d="M15 25l15-5 15 5-15 5z" fill={color} opacity="0.3" />
  </svg>
);

const ArtistPaletteDoodle = ({ color }: { color: string }) => (
  <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Palette base */}
    <ellipse cx="30" cy="35" rx="20" ry="8" fill={color} opacity="0.2" />
    <ellipse cx="30" cy="35" rx="18" ry="6" stroke={color} strokeWidth="2" fill="none" />
    
    {/* Paint wells */}
    <circle cx="20" cy="25" r="3" fill="hsl(var(--whimsy-blush))" />
    <circle cx="30" cy="20" r="3" fill="hsl(var(--whimsy-lavender))" />
    <circle cx="40" cy="25" r="3" fill="hsl(var(--primary))" />
    <circle cx="25" cy="30" r="2" fill="hsl(var(--whimsy-cream))" />
    <circle cx="35" cy="30" r="2" fill="hsl(var(--whimsy-blush))" />
    
    {/* Brush */}
    <path d="M45 15l8-2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M45 15l-2 8" stroke={color} strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const CelebrationDoodle = ({ color }: { color: string }) => (
  <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Mini celebration cake */}
    <rect x="20" y="30" width="20" height="8" rx="2" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5" />
    <rect x="22" y="28" width="16" height="4" rx="1" fill={color} opacity="0.3" stroke={color} strokeWidth="1" />
    
    {/* Cake decorations */}
    <circle cx="25" cy="32" r="1" fill={color} opacity="0.6" />
    <circle cx="30" cy="32" r="1" fill={color} opacity="0.6" />
    <circle cx="35" cy="32" r="1" fill={color} opacity="0.6" />
    
    {/* Candle */}
    <rect x="29" y="24" width="2" height="6" rx="1" fill={color} />
    <circle cx="30" cy="23" r="1.5" fill={color} opacity="0.8" />
    
    {/* Confetti pieces */}
    <circle cx="15" cy="15" r="1" fill={color} opacity="0.7" />
    <circle cx="45" cy="18" r="0.8" fill={color} opacity="0.7" />
    <circle cx="18" cy="25" r="0.6" fill={color} opacity="0.7" />
    <circle cx="42" cy="22" r="0.7" fill={color} opacity="0.7" />
    
    {/* Streamers */}
    <path d="M10 20l8-3M50 20l-8-3" stroke={color} strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
    <path d="M12 25l6-2M48 25l-6-2" stroke={color} strokeWidth="1" opacity="0.4" strokeLinecap="round" />
    
    {/* Balloons */}
    <circle cx="15" cy="35" r="3" fill={color} opacity="0.3" stroke={color} strokeWidth="1" />
    <path d="M15 38l0 4" stroke={color} strokeWidth="1" strokeLinecap="round" />
    <circle cx="45" cy="38" r="2.5" fill={color} opacity="0.3" stroke={color} strokeWidth="1" />
    <path d="M45 40l0 3" stroke={color} strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const CharacterDoodle = ({ color }: { color: string }) => (
  <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Simple house body */}
    <rect x="22" y="28" width="16" height="12" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" rx="1" />
    
    {/* Whimsical curved roof */}
    <path d="M18 28 Q30 18 42 28" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
    
    {/* Simple door */}
    <rect x="28" y="34" width="4" height="6" fill={color} opacity="0.2" stroke={color} strokeWidth="1" />
    
    {/* Minimal windows as eyes */}
    <circle cx="26" cy="31" r="1.5" fill={color} opacity="0.6" />
    <circle cx="34" cy="31" r="1.5" fill={color} opacity="0.6" />
    
    {/* Whimsical smile */}
    <path d="M26 35 Q30 37 34 35" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    
    {/* Tiny chimney */}
    <rect x="32" y="22" width="2" height="4" fill={color} opacity="0.2" stroke={color} strokeWidth="0.8" />
    
    {/* Whimsical smoke curl */}
    <path d="M33 21 Q34 19 35 21" stroke={color} strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
  </svg>
);

const PostcardDoodle = ({ color }: { color: string }) => (
  <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="40" height="25" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <path d="M15 15h30M15 20h20" stroke={color} strokeWidth="1" />
    <circle cx="45" cy="17" r="2" fill={color} opacity="0.6" />
  </svg>
);

const CalmnessDoodle = ({ color }: { color: string }) => (
  <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="40" r="8" stroke={color} strokeWidth="3" opacity="0.7" />
    <circle cx="60" cy="40" r="20" stroke={color} strokeWidth="2" opacity="0.4" />
    <circle cx="60" cy="40" r="30" stroke={color} strokeWidth="1.5" opacity="0.25" />
  </svg>
);

const CloudDoodle = ({ color }: { color: string }) => (
  <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 25c0-4 3-7 7-7 1-4 6-6 10-4 2-4 7-5 11-2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M12 28h36c3 0 6-2 6-6 0-3-3-6-6-6-1 0-2 0-3 0" fill={color} opacity="0.2" />
  </svg>
);

const MoonDoodle = ({ color }: { color: string }) => (
  <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 8c-9 2-15 11-13 20 1 8 8 14 17 15-5 1-10 0-15-3C20 35 18 25 24 18 29 10 37 6 44 6c-1 1-2 1-4 2z" fill={color} opacity="0.25" />
    <path d="M32 6c-10 2-16 12-14 22 1 9 9 16 19 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const SuperpowerDoodle = ({ color }: { color: string }) => (
  <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 10l5 15-5 15-5-15z" fill={color} opacity="0.3" />
    <path d="M15 25l15-5 15 5-15 5z" fill={color} opacity="0.3" />
    <circle cx="30" cy="25" r="3" fill={color} />
    <path d="M10 15l10 10M40 15l-10 10" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const FestivalDoodle = ({ color }: { color: string }) => (
  <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Festival tent/stage */}
    <path d="M15 35l15-15 15 15" fill={color} opacity="0.2" stroke={color} strokeWidth="2" />
    
    {/* Festival banner */}
    <rect x="20" y="25" width="20" height="3" fill={color} opacity="0.3" stroke={color} strokeWidth="1" />
    <path d="M22 26h16" stroke={color} strokeWidth="0.5" />
    
    {/* Festival lights/string lights */}
    <circle cx="18" cy="20" r="1" fill={color} opacity="0.8" />
    <circle cx="25" cy="18" r="1" fill={color} opacity="0.8" />
    <circle cx="32" cy="16" r="1" fill={color} opacity="0.8" />
    <circle cx="39" cy="18" r="1" fill={color} opacity="0.8" />
    <circle cx="42" cy="20" r="1" fill={color} opacity="0.8" />
    
    {/* Connecting light strings */}
    <path d="M18 20l7-2M25 18l7-2M32 16l7 2M39 18l3 2" stroke={color} strokeWidth="0.5" opacity="0.6" />
    
    {/* Festival decorations */}
    <path d="M12 30l3-2M48 30l-3-2" stroke={color} strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
    <path d="M14 32l2-1M46 32l-2-1" stroke={color} strokeWidth="1" opacity="0.5" strokeLinecap="round" />
    
    {/* Small festival crowd (two people) */}
    <circle cx="22" cy="38" r="2" fill={color} opacity="0.4" />
    <circle cx="38" cy="38" r="2" fill={color} opacity="0.4" />
    
    {/* Festival confetti */}
    <circle cx="16" cy="15" r="0.5" fill={color} opacity="0.6" />
    <circle cx="44" cy="12" r="0.7" fill={color} opacity="0.6" />
    <circle cx="28" cy="10" r="0.4" fill={color} opacity="0.6" />
    <circle cx="35" cy="8" r="0.6" fill={color} opacity="0.6" />
  </svg>
);

const SoundDoodle = ({ color }: { color: string }) => (
  <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Headphones */}
    <circle cx="20" cy="25" r="8" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="40" cy="25" r="8" stroke={color} strokeWidth="2" fill="none" />
    
    {/* Headband */}
    <path d="M28 25 Q30 20 32 25" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    
    {/* Ear cushions */}
    <circle cx="20" cy="25" r="5" fill={color} opacity="0.3" />
    <circle cx="40" cy="25" r="5" fill={color} opacity="0.3" />
    
    {/* Sound waves */}
    <path d="M12 20 Q15 18 18 20" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
    <path d="M42 20 Q45 18 48 20" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
  </svg>
);

const LibraryDoodle = ({ color }: { color: string }) => (
  <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="15" width="30" height="25" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <path d="M20 20h20M20 25h15M20 30h25" stroke={color} strokeWidth="1" />
    <circle cx="45" cy="22" r="1.5" fill={color} opacity="0.6" />
  </svg>
);

const FlyingMagicalBookDoodle = ({ color }: { color: string }) => (
  <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Flying book */}
    <rect x="20" y="20" width="20" height="15" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <path d="M25 25h10M25 28h8" stroke={color} strokeWidth="1" />
    
    {/* Magical sparkles around the book */}
    <circle cx="15" cy="15" r="1.5" fill="hsl(var(--whimsy-blush))" opacity="0.8" />
    <circle cx="45" cy="18" r="1" fill="hsl(var(--whimsy-lavender))" opacity="0.8" />
    <circle cx="18" cy="35" r="1" fill="hsl(var(--primary))" opacity="0.8" />
    <circle cx="42" cy="32" r="1.5" fill="hsl(var(--whimsy-cream))" opacity="0.8" />
    
    {/* Magical trail lines */}
    <path d="M10 20l8-2" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <path d="M50 25l-6-3" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <path d="M12 35l6 2" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    
    {/* Book pages fluttering */}
    <path d="M22 18l2-2M38 18l-2-2" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
  </svg>
);

const ShadowDoodle = ({ color }: { color: string }) => (
  <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cool shadow base */}
    <ellipse cx="30" cy="40" rx="18" ry="6" fill={color} opacity="0.2" />
    <ellipse cx="30" cy="40" rx="15" ry="4" stroke={color} strokeWidth="1.5" fill="none" />
    
    {/* Mysterious shadow figure */}
    <path d="M20 15 Q30 25 40 15" stroke={color} strokeWidth="2" fill="none" opacity="0.6" />
    <path d="M22 18 Q30 28 38 18" stroke={color} strokeWidth="1.5" fill="none" opacity="0.4" />
    
    {/* Shadow silhouette */}
    <path d="M25 20 L25 35 Q30 40 35 35 L35 20" fill={color} opacity="0.3" />
    <circle cx="30" cy="18" r="4" fill={color} opacity="0.4" />
    
    {/* Mysterious shadow effects */}
    <circle cx="15" cy="25" r="2" fill={color} opacity="0.3" />
    <circle cx="45" cy="30" r="1.5" fill={color} opacity="0.3" />
    <path d="M10 35 Q20 38 30 40" stroke={color} strokeWidth="1" opacity="0.2" />
    <path d="M30 40 Q40 38 50 35" stroke={color} strokeWidth="1" opacity="0.2" />
  </svg>
);



// Prompt-specific doodle mapping
const PROMPT_DOODLES = [
  TeacupDoodle,      // "Describe a tiny, imaginary place you'd visit if you could shrink to the size of a teacup."
  WeatherDoodle,      // "Invent a weather forecast for a magical town..."
  CreatureDoodle,     // "If your day were a small creature..."
  ArtistPaletteDoodle, // "Name a color that doesn't exist yet..."
  CelebrationDoodle,  // "Imagine a mini celebration happening on your desk..."
  CharacterDoodle,    // "Turn a household object into a character..."
  PostcardDoodle,     // "Write a postcard from a dream you half-remember..."
  CalmnessDoodle,     // "If calmness had a taste and a texture..."
  CloudDoodle,        // "Describe a cloud you'd keep in a jar..."
  MoonDoodle,         // "What would the moon write to you..."
  SuperpowerDoodle,   // "Your favorite cup has a hidden superpower..."
  FestivalDoodle,     // "Invent a tiny festival only two people know about..."
  SoundDoodle,        // "Turn a sound you love into a little visual scene..."
  FlyingMagicalBookDoodle, // "Imagine a library of scents..."
  ShadowDoodle        // "Give a name and story to the shadow you see right now..."
];

const LS_RESPONSE_KEY = "pp:creativeSpark:response";
const LS_CONTEXT_KEY = "pp:personalContext";

// Tiny doodle icon (firefly/wand)
const SparkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...props} aria-hidden>
    <path d="M12 2l1.5 3 3 1.5-3 1.5L12 11l-1.5-3-3-1.5 3-1.5L12 2Z" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="18.5" cy="16.5" r="2.5" fill="currentColor" opacity=".18" />
  </svg>
);

export const CreativePrompt = ({ onBack }: { onBack: () => void }) => {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const [showContext, setShowContext] = useState<boolean>(false);
  const [savedMsg, setSavedMsg] = useState<string>("");
  const [ctxSavedMsg, setCtxSavedMsg] = useState<string>("");
  const [isTextareaFocused, setIsTextareaFocused] = useState<boolean>(false);



  // Load from localStorage
  useEffect(() => {
    try {
      const r = localStorage.getItem(LS_RESPONSE_KEY) ?? "";
      const c = localStorage.getItem(LS_CONTEXT_KEY) ?? "";
      setResponse(r);
      setContext(c);
    } catch (_e) { void _e; }
  }, []);

  // Use existing prompt generator if available; otherwise set a default
  useEffect(() => {
    if (!prompt) {
      setPrompt(PROMPTS[0]);
    }
  }, [prompt]);



  const saveResponse = () => {
    try {
      localStorage.setItem(LS_RESPONSE_KEY, response.trim());
      setSavedMsg("Saved!");
      setTimeout(() => setSavedMsg(""), 1500);
    } catch (_e) { void _e; }
  };

  const saveContext = () => {
    try {
      localStorage.setItem(LS_CONTEXT_KEY, context.trim());
      setCtxSavedMsg("Context saved");
      setTimeout(() => setCtxSavedMsg(""), 1500);
      window.dispatchEvent(new CustomEvent("pp:userContextUpdated", { detail: { context } }));
    } catch (_e) { void _e; }
  };

  const newPrompt = () => {
    const next = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setPrompt(next);
    setResponse('');
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* CSS Animations */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(2deg); }
          50% { transform: translateY(-4px) rotate(-1deg); }
          75% { transform: translateY(-12px) rotate(1deg); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        @keyframes sparkle-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        .animate-sparkle-glow {
          animation: sparkle-glow 3s ease-out forwards;
        }
        
        @keyframes fly-in-left {
          0% { transform: translateX(-100px) translateY(20px) rotate(-15deg); opacity: 0; }
          100% { transform: translateX(0) translateY(0) rotate(0deg); opacity: 1; }
        }
        @keyframes fly-in-right {
          0% { transform: translateX(100px) translateY(-20px) rotate(15deg); opacity: 0; }
          100% { transform: translateX(0) translateY(0) rotate(0deg); opacity: 1; }
        }
        @keyframes fly-in-top {
          0% { transform: translateY(-80px) translateX(10px) scale(0.8); opacity: 0; }
          100% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
        }
        @keyframes fly-in-bottom {
          0% { transform: translateY(80px) translateX(-10px) scale(0.8); opacity: 0; }
          100% { transform: translateY(0) translateY(0) scale(1); opacity: 1; }
        }
        
        .animate-fly-in-left { animation: fly-in-left 1.2s ease-out forwards; }
        .animate-fly-in-right { animation: fly-in-right 1.2s ease-out forwards; }
        .animate-fly-in-top { animation: fly-in-top 1.2s ease-out forwards; }
        .animate-fly-in-bottom { animation: fly-in-bottom 1.2s ease-out forwards; }
      `}</style>
      <Button 
        onClick={onBack} 
        variant="ghost" 
        className="mb-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 transition-all duration-200" 
        aria-label="Back to Activities"
      >
        ← Back to Activities
      </Button>

      <Card className="p-0 border-0 shadow-soft overflow-hidden mb-8">
        <div className="relative p-6 text-center">
          {/* Pastel radial glow band */}
          <div 
            aria-hidden 
            className="absolute inset-x-0 top-0 -z-10 h-24" 
            style={{
              background: "radial-gradient(60% 60% at 50% 10%, rgba(255, 182, 193, 0.3) 0%, transparent 70%)",
            }}
          />
          

          
          <h2 className="text-3xl font-heading font-bold mb-3 bg-gradient-calm bg-clip-text text-transparent">
            Creative Spark
          </h2>
          <p className="text-muted-foreground font-sans">Let your imagination wander for a few minutes</p>
          
          {/* Prompt-specific doodle animation */}
          <div className="absolute top-8 right-8 pointer-events-none">
            <div className="animate-float-slow w-[60px] h-[50px] flex items-center justify-center">
              {(() => {
                const currentPromptIndex = PROMPTS.findIndex(p => p === prompt);
                const DoodleComponent = currentPromptIndex >= 0 ? PROMPT_DOODLES[currentPromptIndex] : TeacupDoodle;
                return <DoodleComponent color="hsl(var(--primary))" />;
              })()}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-8 border-0 shadow-soft relative overflow-hidden">

        

        
        <div className="relative">
          {/* Current prompt */}
          <div className="mb-4 rounded-2xl bg-card/70 p-4 ring-1 ring-border/60 relative overflow-hidden">
            {/* Floating sparkles around prompt */}
            <div className="absolute -inset-8 pointer-events-none">
              <div className="absolute top-2 left-4 w-2 h-2 bg-primary/30 rounded-full animate-float-slow" />
              <div className="absolute top-6 right-8 w-1.5 h-1.5 bg-whimsy-blush/40 rounded-full animate-float-slow" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-3 left-8 w-1 h-1 bg-whimsy-cream/50 rounded-full animate-float-slow" style={{ animationDelay: '2s' }} />
              <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-whimsy-lavender/40 rounded-full animate-float-slow" style={{ animationDelay: '0.5s' }} />
              
              {/* Additional sparkles extending outside the prompt */}
              <div className="absolute -top-2 left-12 w-1.5 h-1.5 bg-primary/40 rounded-full animate-float-slow" style={{ animationDelay: '0.8s' }} />
              <div className="absolute top-8 -right-2 w-1 h-1 bg-whimsy-blush/50 rounded-full animate-float-slow" style={{ animationDelay: '1.3s' }} />
              <div className="absolute -bottom-1 left-16 w-1.5 h-1.5 bg-whimsy-cream/40 rounded-full animate-float-slow" style={{ animationDelay: '1.7s' }} />
              <div className="absolute bottom-8 -left-2 w-1 h-1 bg-whimsy-lavender/50 rounded-full animate-float-slow" style={{ animationDelay: '0.3s' }} />
              <div className="absolute top-12 left-20 w-1 h-1 bg-primary/30 rounded-full animate-float-slow" style={{ animationDelay: '2.2s' }} />
              <div className="absolute -top-1 right-16 w-1.5 h-1.5 bg-whimsy-blush/40 rounded-full animate-float-slow" style={{ animationDelay: '1.5s' }} />
              <div className="absolute bottom-12 right-20 w-1 h-1 bg-whimsy-cream/50 rounded-full animate-float-slow" style={{ animationDelay: '0.7s' }} />
              <div className="absolute top-16 -left-1 w-1 h-1 bg-whimsy-lavender/40 rounded-full animate-float-slow" style={{ animationDelay: '1.9s' }} />
            </div>
            

            <p className="font-sans text-[18px] leading-7 text-foreground pr-12 relative z-10">{prompt}</p>
            <button
              onClick={newPrompt}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:text-primary z-20"
              aria-label="Get new prompt"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Response textarea */}
          <div className="relative">
            <label htmlFor="spark-response" className="sr-only">Your response</label>
            <Textarea
              id="spark-response"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              onFocus={() => setIsTextareaFocused(true)}
              onBlur={() => setIsTextareaFocused(false)}
              placeholder="Write, doodle ideas in words, or describe what you'd make…"
              className="w-full min-h-[140px] rounded-2xl bg-card/80 p-4 font-sans text-[15px] text-foreground placeholder:text-muted-foreground/45 ring-1 ring-border/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
              style={{
                '--tw-ring-color': 'hsl(var(--primary))',
                '--tw-border-color': 'hsl(var(--primary))'
              } as React.CSSProperties}
            />
            
            {/* Gentle glow effect on focus */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-whimsy-lavender/5 transition-opacity duration-300 pointer-events-none ${isTextareaFocused ? 'opacity-100' : 'opacity-0'}`} />
            
            {/* Animated doodles that appear when typing */}
            {response.length > 0 && (
              <div className="absolute -top-2 -right-2 pointer-events-none">
                <div className="animate-bounce">
                  <svg className="w-6 h-6 text-whimsy-cream" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
            )}
            
            {response.length > 20 && (
              <div className="absolute -bottom-2 -left-2 pointer-events-none">
                <div className="animate-pulse">
                  <svg className="w-5 h-5 text-whimsy-blush" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
            )}
            
            {response.length > 50 && (
              <div className="absolute top-1/2 -right-3 pointer-events-none">
                <div className="animate-spin">
                  <svg className="w-4 h-4 text-whimsy-lavender" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Save response button and hint in same row */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                onClick={saveResponse} 
                className="rounded-full px-5 py-2.5 font-sans text-sm font-semibold shadow-sm bg-foreground text-white hover:bg-foreground/90 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
              >
                {savedMsg ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {savedMsg}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Save my spark
                  </>
                )}
              </Button>
              
              <button
                onClick={() => setShowContext((v) => !v)}
                className="font-sans text-sm text-muted-foreground underline-offset-2 hover:text-primary hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:text-primary"
              >
                {showContext ? "Hide personalization" : "Hint: Tell us your mood to personalize prompts"}
              </button>
            </div>
          </div>
            
          {showContext && (
            <div className="mt-4 rounded-2xl bg-card/70 p-4 ring-1 ring-border/60 animate-rise-fade">
              <label htmlFor="spark-context" className="sr-only">Personal context</label>
              <Textarea
                id="spark-context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="I'm feeling… (kept on your device to suggest better prompts)"
                className="w-full min-h-[96px] rounded-xl bg-card/80 p-3 font-sans text-[15px] text-foreground placeholder:text-muted-foreground/45 ring-1 ring-border/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                style={{
                  '--tw-ring-color': 'hsl(var(--primary))',
                  '--tw-border-color': 'hsl(var(--primary))'
                } as React.CSSProperties}
              />
              <div className="mt-3 flex items-center gap-3">
                <Button 
                  onClick={saveContext} 
                  className="rounded-full px-4 py-2 font-sans text-sm font-semibold shadow-sm bg-foreground text-white hover:bg-foreground/90 focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Save context
                </Button>
                <span role="status" aria-live="polite" className="font-sans text-sm text-muted-foreground animate-rise-fade">
                  {ctxSavedMsg}
                </span>
              </div>
              <p className="mt-4 font-sans text-xs text-muted-foreground/70 text-center">Your secret is safe on this device</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};