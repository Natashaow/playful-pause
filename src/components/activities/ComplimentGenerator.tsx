import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WISHES = [
  "A little cloud told me you make the sun feel shy.",
  "May your tea be warm and your thoughts be gentle.",
  "Today, the breeze has your name on it—soft and kind.",
  "A friendly star said your laugh brightens constellations.",
  "Your presence makes quiet corners feel like home.",
  "Somewhere, a cat is purring in your honor.",
  "You are the pause button the day secretly wants.",
  "Tiny birds practice gratitude when you pass by.",
  "The moon keeps your secrets and roots for you.",
  "Your calm is contagious—in the best way.",
  "May a pocket of luck find you unexpectedly.",
  "You’re the cozy lamp in a rainy-room afternoon.",
  "A daisy wishes it had your sense of ease.",
  "Even the kettle hums a softer tune for you.",
  "Clouds part politely when you need a moment.",
  "Your kindness makes small spaces feel bigger.",
  "The day is softer because you’re in it.",
  "A gentle hush follows wherever you breathe.",
  "Your smile is a warm blanket for busy minds.",
  "You are proof that quiet can be powerful.",
  "Even your sighs teach the room to relax.",
  "The sky saved a blush just for you.",
  "You make ordinary minutes feel like little holidays.",
  "Somewhere, a paper plane just landed perfectly for you.",
];

const ACCENTS = [
  "#4ECDC4", // Ocean
  "#C7CEEA", // Lavender
  "#FF6B6B", // Coral
  "#95E1D3", // Mint
  "#FFB4B4", // Peach
  "#A8E6CF", // Sky
  "#FFD93D", // Rose
  "#A0C4FF", // Bluebell
];

function randomIndex(max: number, exclude?: number) {
  if (max <= 1) return 0;
  let idx = Math.floor(Math.random() * max);
  if (exclude != null) {
    while (idx === exclude) idx = Math.floor(Math.random() * max);
  }
  return idx;
}

// --- SVG DOODLES ---
const CloudSun = ({ color }: { color: string }) => (
  <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="85" cy="25" r="12" fill={color} opacity="0.4" />
    <path d="M20 50c0-8 7-14 15-14 3-8 12-12 20-9 4-8 14-10 22-5" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M18 56h64c7 0 12-5 12-12 0-7-5-12-12-12-2 0-4 0-6 1" fill={color} opacity="0.2" />
    <path d="M22 58h58c6 0 10-4 10-10s-4-10-10-10c-2 0-4 0-5 1" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

const TeaCup = ({ color }: { color: string }) => (
  <svg width="120" height="90" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 45h60a14 14 0 01-14 14H34A14 14 0 0120 45z" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M80 45h10c6 0 6 10 0 10h-9" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M40 28c0 6-8 6-8 12M56 28c0 6-8 6-8 12M72 28c0 6-8 6-8 12" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const Leaf = ({ color }: { color: string }) => (
  <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 60c40-40 80-20 80-20S60 60 20 60z" fill={color} opacity="0.25" />
    <path d="M20 60c40-40 80-20 80-20" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const Star = ({ color }: { color: string }) => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 12l10 22 24 3-18 17 4 24-20-11-20 11 4-24-18-17 24-3 10-22z" fill={color} opacity="0.35" />
    <path d="M50 16l9 20 21 3-16 15 4 21-18-10-18 10 4-21-16-15 21-3 9-20z" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const Lamp = ({ color }: { color: string }) => (
  <svg width="100" height="110" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 40h60l-8 22H28L20 40z" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M50 62v26" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <circle cx="50" cy="92" r="8" stroke={color} strokeWidth="3" />
    <circle cx="50" cy="56" r="10" fill={color} opacity="0.15" />
  </svg>
);

const Cat = ({ color }: { color: string }) => (
  <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 70c0-12 10-22 22-22s22 10 22 22-10 18-22 18-22-6-22-18z" stroke={color} strokeWidth="3" fill="none" />
    <path d="M54 44l-6-10M86 44l6-10" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <path d="M84 78c8 4 10 8 12 14" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <circle cx="56" cy="66" r="2" fill={color} />
    <circle cx="84" cy="66" r="2" fill={color} />
  </svg>
);

const Birds = ({ color }: { color: string }) => (
  <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 50c6-6 12-6 18 0M60 48c6-6 12-6 18 0M44 42c6-6 12-6 18 0" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const Moon = ({ color }: { color: string }) => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 16c-18 4-30 22-26 40 3 16 17 28 34 30-10 2-21 1-30-6C24 70 20 52 28 36 35 21 49 12 64 12c-1 1-2 2-4 4z" fill={color} opacity="0.25" />
    <path d="M64 12c-20 4-32 24-28 44 3 18 19 32 38 32" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const PaperPlane = ({ color }: { color: string }) => (
  <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 40l96-26-48 26 16 28-20-22-44-6z" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Daisy = ({ color }: { color: string }) => (
  <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="55" cy="55" r="8" fill={color} opacity="0.4" />
    <g stroke={color} strokeWidth="3" strokeLinecap="round">
      <path d="M55 18v18" /><path d="M55 74v18" /><path d="M18 55h18" /><path d="M74 55h18" />
      <path d="M30 30l12 12" /><path d="M80 80L68 68" /><path d="M30 80l12-12" /><path d="M80 30L68 42" />
    </g>
  </svg>
);

const Kettle = ({ color }: { color: string }) => (
  <svg width="120" height="90" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M28 44h56a16 16 0 01-16 16H44A16 16 0 0128 44z" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M68 34a14 14 0 00-28 0" stroke={color} strokeWidth="3" fill="none" />
    <path d="M84 44h12c6 0 6 10 0 10h-10" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <path d="M42 24c0 6-8 6-8 12" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const PauseBlob = ({ color }: { color: string }) => (
  <svg width="120" height="90" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="18" y="24" width="84" height="48" rx="16" stroke={color} strokeWidth="3" fill={color} opacity="0.15" />
    <rect x="46" y="36" width="6" height="24" rx="2" fill={color} />
    <rect x="68" y="36" width="6" height="24" rx="2" fill={color} />
  </svg>
);

const Ripple = ({ color }: { color: string }) => (
  <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="40" r="8" stroke={color} strokeWidth="3" opacity="0.7" />
    <circle cx="60" cy="40" r="20" stroke={color} strokeWidth="2" opacity="0.4" />
    <circle cx="60" cy="40" r="30" stroke={color} strokeWidth="1.5" opacity="0.25" />
  </svg>
);

const Clover = ({ color }: { color: string }) => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="12" fill={color} opacity="0.35" />
    <circle cx="60" cy="40" r="12" fill={color} opacity="0.35" />
    <circle cx="40" cy="60" r="12" fill={color} opacity="0.35" />
    <circle cx="60" cy="60" r="12" fill={color} opacity="0.35" />
    <path d="M50 64v18" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// --- Sparkles ---
const Sparkles = ({ color }: { color: string }) => {
  const items = Array.from({ length: 6 });
  return (
    <div className="pointer-events-none absolute inset-0">
      {items.map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full opacity-0 whimsy-sparkle"
          style={{
            width: 6 + (i % 3) * 2,
            height: 6 + (i % 3) * 2,
            left: `${10 + (i * 15) % 80}%`,
            top: `${15 + (i * 12) % 70}%`,
            backgroundColor: color,
            animationDelay: `${i * 180}ms`,
          }}
        />
      ))}
    </div>
  );
};

// Map wish index to a doodle component
function doodleFor(idx: number, color: string) {
  const n = idx % 24;
  switch (n) {
    case 0: return <CloudSun color={color} />; // cloud / shy sun
    case 1: return <TeaCup color={color} />; // tea warm
    case 2: return <Leaf color={color} />; // breeze
    case 3: return <Star color={color} />; // constellations
    case 4: return <Lamp color={color} />; // home/lamp
    case 5: return <Cat color={color} />; // cat purring
    case 6: return <PauseBlob color={color} />; // pause button
    case 7: return <Birds color={color} />; // tiny birds
    case 8: return <Moon color={color} />; // moon secret
    case 9: return <Ripple color={color} />; // calm contagious
    case 10: return <Clover color={color} />; // pocket of luck
    case 11: return <Lamp color={color} />; // cozy lamp in rain
    case 12: return <Daisy color={color} />; // daisy ease
    case 13: return <Kettle color={color} />; // kettle hums
    case 14: return <CloudSun color={color} />; // clouds part
    case 15: return <Ripple color={color} />; // spaces bigger
    case 16: return <Leaf color={color} />; // day softer
    case 17: return <Leaf color={color} />; // hush follows
    case 18: return <Daisy color={color} />; // smile warm blanket
    case 19: return <Star color={color} />; // quiet powerful
    case 20: return <Leaf color={color} />; // sighs relax
    case 21: return <CloudSun color={color} />; // sky blush
    case 22: return <Daisy color={color} />; // ordinary holiday
    case 23: return <PaperPlane color={color} />; // paper plane landed
    default: return <Star color={color} />;
  }
}

export const WhimsyWishes: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [idx, setIdx] = useState<number>(() => randomIndex(WISHES.length));
  const [accentIdx, setAccentIdx] = useState<number>(() => randomIndex(ACCENTS.length));
  const [animSeed, setAnimSeed] = useState<number>(0);

  const wish = WISHES[idx];
  const accent = ACCENTS[accentIdx];

  const bgStyle = useMemo(() => {
    const light = `${accent}55`;
    const lighter = `${accent}2a`;
    return {
      background: `radial-gradient(60% 60% at 50% 30%, ${light} 0%, transparent 70%), radial-gradient(60% 50% at 50% 100%, ${lighter} 0%, transparent 60%)`,
      transition: "background 500ms ease",
    } as React.CSSProperties;
  }, [accent]);

  const onMore = () => {
    setIdx((i) => randomIndex(WISHES.length, i));
    setAccentIdx((i) => randomIndex(ACCENTS.length, i));
    setAnimSeed((s) => s + 1);
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(wish);
    } catch (error) {
      void error;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Local animations */}
      <style>{`
        @keyframes whimsy-letter-in { from { transform: translateY(-14px) rotate(-2deg); opacity: 0 } to { transform: translateY(0) rotate(0); opacity: 1 } }
        @keyframes whimsy-doodle-pop { from { transform: translateY(8px) scale(0.96); opacity: 0 } to { transform: translateY(0) scale(1); opacity: 1 } }
        @keyframes whimsy-sparkle { 0% { transform: scale(0.8); opacity: 0 } 50% { transform: scale(1); opacity: 0.6 } 100% { transform: scale(0.8); opacity: 0 } }
        .whimsy-letter { animation: whimsy-letter-in 600ms ease-out both }
        .whimsy-doodle { animation: whimsy-doodle-pop 700ms ease-out both }
        .whimsy-sparkle { animation: whimsy-sparkle 1800ms ease-in-out infinite }
        .whimsy-loop-sway { animation: whimsy-sway 4000ms ease-in-out infinite }
        @keyframes whimsy-sway { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
        .whimsy-loop-steam { animation: whimsy-steam 3000ms ease-in-out infinite }
        @keyframes whimsy-steam { 0% { opacity: .2; transform: translateY(0) } 50% { opacity:.5; transform: translateY(-6px) } 100% { opacity:.2; transform: translateY(0) } }
        .whimsy-loop-twinkle { animation: whimsy-twinkle 2200ms ease-in-out infinite }
        @keyframes whimsy-twinkle { 0%,100% { opacity:.5; transform: scale(1) } 50% { opacity:1; transform: scale(1.06) } }
        .whimsy-loop-glow { box-shadow: 0 0 0 0 rgba(0,0,0,0), 0 6px 22px -6px rgba(0,0,0,0.12) }
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
              background: "radial-gradient(60% 60% at 50% 10%, rgba(255, 182, 193, 0.3) 0%, transparent 70%)",
            }}
          />
          
          <h2 className="text-3xl font-heading font-bold mb-3 bg-gradient-sunshine bg-clip-text text-transparent">
            Whimsy Wishes
          </h2>
          <p className="text-muted-foreground font-sans">Tiny, magical messages to soften your day</p>
        </div>
      </Card>

      <Card className="p-8 border-0 shadow-soft relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10" style={bgStyle} />

        <div key={animSeed} className="relative space-y-6 text-center">
          <div className="flex items-center justify-center whimsy-doodle">
            <div className="whimsy-loop-sway">
              {doodleFor(idx, accent)}
            </div>
          </div>

          <div className="mx-auto max-w-xl whimsy-letter">
            <div className="rounded-xl bg-white/70 backdrop-blur px-5 py-4 shadow-soft border border-border">
              <p className="text-lg md:text-xl leading-relaxed text-foreground font-sans" aria-live="polite">
                {wish}
              </p>
            </div>
          </div>

          <Sparkles color={accent} />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={onMore} size="lg" className="px-8" style={{ backgroundColor: accent, borderColor: accent }}>
              More wishes
            </Button>
            <Button variant="outline" onClick={onCopy}>
              Copy
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};