// src/components/activities/WhimsyWishes.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { readPersonalization, moodHints } from "@/lib/personalization";

// --- Enhanced SVG Doodles with animations ---
const CloudSun = ({ color }: { color: string }) => (
  <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="85" cy="25" r="12" fill={color} opacity="0.4" className="whimsy-loop-twinkle" />
    <path d="M20 50c0-8 7-14 15-14 3-8 12-12 20-9 4-8 14-10 22-5" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M18 56h64c7 0 12-5 12-12 0-7-5-12-12-12-2 0-4 0-6 1" fill={color} opacity="0.2" />
    <path d="M22 58h58c6 0 10-4 10-10s-4-10-10-10c-2 0-4 0-5 1" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

const TeaCup = ({ color }: { color: string }) => (
  <svg width="120" height="90" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 45h60a14 14 0 01-14 14H34A14 14 0 0120 45z" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M80 45h10c6 0 6 10 0 10h-9" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M40 28c0 6-8 6-8 12M56 28c0 6-8 6-8 12M72 28c0 6-8 6-8 12" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" className="whimsy-loop-steam" />
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
    <path d="M50 62v26" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="50" cy="92" r="8" stroke={color} strokeWidth="3" />
    <circle cx="50" cy="56" r="10" fill={color} opacity="0.15" className="whimsy-loop-glow" />
  </svg>
);

const Cat = ({ color }: { color: string }) => (
  <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cat body */}
    <ellipse cx="60" cy="65" rx="25" ry="15" fill={color} opacity="0.2" stroke={color} strokeWidth="2" />
    
    {/* Cat head */}
    <circle cx="60" cy="45" r="18" fill={color} opacity="0.2" stroke={color} strokeWidth="2" />
    
    {/* Cat ears */}
    <path d="M45 35l-5-8 10 0z" fill={color} opacity="0.3" />
    <path d="M75 35l5-8-10 0z" fill={color} opacity="0.3" />
    
    {/* Cat face */}
    <circle cx="54" cy="42" r="3" fill={color} />
    <circle cx="66" cy="42" r="3" fill={color} />
    <path d="M58 48 Q60 50 62 48" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    
    {/* Cat whiskers */}
    <path d="M35 40l-8-2M35 44l-8 2" stroke={color} strokeWidth="1.5" opacity="0.6" />
    <path d="M85 40l8-2M85 44l8 2" stroke={color} strokeWidth="1.5" opacity="0.6" />
    
    {/* Cat tail */}
    <path d="M80 60 Q95 50 90 70" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    
    {/* Cat paws */}
    <ellipse cx="45" cy="75" rx="4" ry="2" fill={color} opacity="0.3" />
    <ellipse cx="75" cy="75" rx="4" ry="2" fill={color} opacity="0.3" />
  </svg>
);

const Birds = ({ color }: { color: string }) => (
  <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* First tiny bird */}
    <circle cx="25" cy="45" r="3" fill={color} opacity="0.3" />
    <path d="M22 45l-3-2M28 45l3-2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M25 42l0-2" stroke={color} strokeWidth="1" strokeLinecap="round" />
    
    {/* Second tiny bird */}
    <circle cx="45" cy="42" r="2.5" fill={color} opacity="0.3" />
    <path d="M42.5 42l-2.5-1.5M47.5 42l2.5-1.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M45 40l0-1.5" stroke={color} strokeWidth="1" strokeLinecap="round" />
    
    {/* Third tiny bird */}
    <circle cx="65" cy="48" r="2.8" fill={color} opacity="0.3" />
    <path d="M62.2 48l-2.8-1.8M67.8 48l2.8-1.8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M65 46l0-1.8" stroke={color} strokeWidth="1" strokeLinecap="round" />
    
    {/* Fourth tiny bird */}
    <circle cx="85" cy="44" r="2.2" fill={color} opacity="0.3" />
    <path d="M82.8 44l-2.2-1.2M87.2 44l2.2-1.2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M85 43l0-1.2" stroke={color} strokeWidth="1" strokeLinecap="round" />
    
    {/* Gratitude sparkles around the birds */}
    <circle cx="20" cy="35" r="1" fill={color} opacity="0.6" />
    <circle cx="50" cy="32" r="0.8" fill={color} opacity="0.6" />
    <circle cx="70" cy="38" r="1.2" fill={color} opacity="0.6" />
    <circle cx="90" cy="34" r="0.6" fill={color} opacity="0.6" />
    
    {/* Small motion lines to show gentle movement */}
    <path d="M15 40l-2-1M15 50l-2 1" stroke={color} strokeWidth="1" opacity="0.4" strokeLinecap="round" />
    <path d="M95 40l2-1M95 50l2 1" stroke={color} strokeWidth="1" opacity="0.4" strokeLinecap="round" />
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
    {/* Paper airplane body */}
    <path d="M20 40l40-20 40 20-40 20z" fill={color} opacity="0.2" stroke={color} strokeWidth="2" />
    
    {/* Paper airplane wings */}
    <path d="M20 40l20-15 20 15" stroke={color} strokeWidth="2" fill="none" />
    <path d="M60 40l20-15 20 15" stroke={color} strokeWidth="2" fill="none" />
    
    {/* Paper airplane nose */}
    <path d="M60 20l-5 5 5 5" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    
    {/* Paper fold lines */}
    <path d="M20 40l40-20M60 40l40-20" stroke={color} strokeWidth="1" opacity="0.6" strokeDasharray="2 2" />
    
    {/* Motion lines to show flying */}
    <path d="M15 35l-8-3M15 45l-8 3" stroke={color} strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
    <path d="M12 38l-5-2M12 42l-5 2" stroke={color} strokeWidth="1" opacity="0.5" strokeLinecap="round" />
    
    {/* Air flow around the plane */}
    <path d="M25 30 Q30 25 35 30" stroke={color} strokeWidth="1" opacity="0.4" fill="none" />
    <path d="M25 50 Q30 55 35 50" stroke={color} strokeWidth="1" opacity="0.4" fill="none" />
    
    {/* Small air particles */}
    <circle cx="18" cy="35" r="1" fill={color} opacity="0.6" />
    <circle cx="16" cy="45" r="0.8" fill={color} opacity="0.6" />
    <circle cx="14" cy="38" r="0.6" fill={color} opacity="0.4" />
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

// Map wish index to a doodle component with emotion-based colors that tell a story
function doodleFor(idx: number, color: string) {
  const n = idx % 24;
  
  // Get the wish to determine the appropriate emotion color
  const wish = WISHES[n];
  if (!wish) return <Star color={color} />;
  
  // Choose emotion color based on the wish's story and bucket
  let emotionColor: string;
  
  switch (wish.bucket) {
    case "soothe":
      // Calming, peaceful wishes - use anxiety (teal) or sadness (blue)
      emotionColor = n % 2 === 0 ? "#A8E6CF" : "#B8D4E3";
      break;
    case "warm":
      // Warm, comforting wishes - use nostalgia (orange) or embarrassment (pink)
      emotionColor = n % 2 === 0 ? "#F4D4A3" : "#F8C8D8";
      break;
    case "playful":
      // Joyful, uplifting wishes - use joy (yellow) or envy (lime)
      emotionColor = n % 2 === 0 ? "#FFE5A3" : "#D4ED91";
      break;
    default:
      emotionColor = "#F4D4A3"; // nostalgia for neutral
  }
  
  // Special color assignments for specific wishes that tell particular stories
  switch (n) {
    case 0: return <CloudSun color="#A8E6CF" />; // cloud / shy sun - anxiety (teal) for calm communication
    case 1: return <TeaCup color="#F4D4A3" />; // tea warm - nostalgia (orange) for comfort
    case 2: return <Leaf color="#A8E6CF" />; // breeze - anxiety (teal) for gentle movement
    case 3: return <Star color="#FFE5A3" />; // constellations - joy (yellow) for brightness
    case 4: return <Lamp color="#F4D4A3" />; // home/lamp - nostalgia (orange) for home
    case 5: return <Cat color="#F8C8D8" />; // cat purring - embarrassment (pink) for gentle affection
    case 6: return <PauseBlob color="#A8E6CF" />; // pause button - anxiety (teal) for calm
    case 7: return <Birds color="#FFE5A3" />; // tiny birds - joy (yellow) for appreciation
    case 8: return <Moon color="#D4C5E8" />; // moon secret - fear (purple) for mystery
    case 9: return <Ripple color="#A8E6CF" />; // calm contagious - anxiety (teal) for peace
    case 10: return <Clover color="#D4ED91" />; // pocket of luck - envy (lime) for abundance
    case 11: return <Lamp color="#F4D4A3" />; // cozy lamp in rain - nostalgia (orange) for comfort
    case 12: return <Daisy color="#F8C8D8" />; // daisy ease - embarrassment (pink) for gentleness
    case 13: return <Kettle color="#A8E6CF" />; // kettle hums - anxiety (teal) for soothing sound
    case 14: return <CloudSun color="#FFE5A3" />; // clouds part - joy (yellow) for brightness
    case 15: return <Ripple color="#C8E6C9" />; // spaces bigger - disgust (green) for growth
    case 16: return <Leaf color="#C8E6C9" />; // day softer - disgust (green) for renewal
    case 17: return <Leaf color="#A8E6CF" />; // hush follows - anxiety (teal) for calm
    case 18: return <Daisy color="#F8C8D8" />; // smile warm blanket - embarrassment (pink) for warmth
    case 19: return <Star color="#D4C5E8" />; // quiet powerful - fear (purple) for introspection
    case 20: return <Leaf color="#A8E6CF" />; // sighs relax - anxiety (teal) for relaxation
    case 21: return <CloudSun color="#F8C8D8" />; // sky blush - embarrassment (pink) for gentle beauty
    case 22: return <Daisy color="#FFE5A3" />; // ordinary holiday - joy (yellow) for celebration
    case 23: return <PaperPlane color="#D4ED91" />; // paper plane landed - envy (lime) for perfect arrival
    default: return <Star color={emotionColor} />;
  }
}

// --- Wishes dataset (sample; add full list as needed) ---
type Wish = { id: string; text: string; doodle: string; bucket: "soothe"|"warm"|"playful" };

const WISHES: Wish[] = [
  { id: "w1", text: "A little cloud told me you make the sun feel shy.", doodle: "cloud", bucket: "warm" },
  { id: "w2", text: "May your tea be warm and your thoughts be gentle.", doodle: "lamp", bucket: "soothe" },
  { id: "w3", text: "Today, the breeze has your name on it—soft and kind.", doodle: "bird", bucket: "soothe" },
  { id: "w4", text: "A friendly star said your laugh brightens constellations.", doodle: "star", bucket: "playful" },
  { id: "w5", text: "Your presence makes quiet corners feel like home.", doodle: "lamp", bucket: "warm" },
  { id: "w6", text: "Somewhere, a cat is purring in your honor.", doodle: "cat", bucket: "warm" },
  { id: "w7", text: "You are the pause button the day secretly wants.", doodle: "cloud", bucket: "soothe" },
  { id: "w8", text: "Tiny birds practice gratitude when you pass by.", doodle: "bird", bucket: "playful" },
  { id: "w9", text: "The moon keeps your secrets and roots for you.", doodle: "moon", bucket: "soothe" },
  { id: "w10", text: "Your calm is contagious—in the best way.", doodle: "star", bucket: "soothe" },
  { id: "w11", text: "May a pocket of luck find you unexpectedly.", doodle: "clover", bucket: "playful" },
  { id: "w12", text: "You're the cozy lamp in a rainy-room afternoon.", doodle: "lamp", bucket: "warm" },
  { id: "w13", text: "A daisy wishes it had your sense of ease.", doodle: "star", bucket: "warm" },
  { id: "w14", text: "Even the kettle hums a softer tune for you.", doodle: "lamp", bucket: "soothe" },
  { id: "w15", text: "Clouds part politely when you need a moment.", doodle: "cloud", bucket: "soothe" },
  { id: "w16", text: "Your kindness makes small spaces feel bigger.", doodle: "star", bucket: "warm" },
  { id: "w17", text: "The day is softer because you're in it.", doodle: "star", bucket: "soothe" },
  { id: "w18", text: "A gentle hush follows wherever you breathe.", doodle: "cloud", bucket: "soothe" },
  { id: "w19", text: "Your smile is a warm blanket for busy minds.", doodle: "lamp", bucket: "warm" },
  { id: "w20", text: "You are proof that quiet can be powerful.", doodle: "moon", bucket: "soothe" },
  { id: "w21", text: "Even your sighs teach the room to relax.", doodle: "cloud", bucket: "soothe" },
  { id: "w22", text: "The sky saved a blush just for you.", doodle: "star", bucket: "playful" },
  { id: "w23", text: "You make ordinary minutes feel like little holidays.", doodle: "star", bucket: "playful" },
  { id: "w24", text: "Somewhere, a paper plane just landed perfectly for you.", doodle: "paper-plane", bucket: "playful" },
];

// bucket selection by mood
function poolByMood(): Wish[] {
  const { context } = readPersonalization();
  const mh = moodHints(context);
  if (mh.isStressed || mh.isTired) return WISHES.filter(w => w.bucket === "soothe");
  if (mh.isBlue) return WISHES.filter(w => w.bucket === "warm");
  if (mh.isUp) return WISHES.filter(w => w.bucket === "playful");
  return WISHES;
}

// pick a new index that isn't in recent history
function pickNewIndex(len: number, recent: number[], tries = 20) {
  let idx = Math.floor(Math.random() * len);
  let count = 0;
  while (recent.includes(idx) && count < tries) {
    idx = Math.floor(Math.random() * len);
    count++;
  }
  return idx;
}

export default function WhimsyWishes({ onBack }: { onBack: () => void }) {
  const [pool, setPool] = useState<Wish[]>(() => poolByMood());
  const [index, setIndex] = useState(0);
  const [recent, setRecent] = useState<number[]>([]); // prevent immediate repeats
  const [accentColor, setAccentColor] = useState<string>("#C3F5E6");
  const [animSeed, setAnimSeed] = useState<number>(0);

  // Emotion-based color palette from ColorBreathing
  const EMOTION_COLORS = {
    joy: "#FFE5A3",        // Soft pastel yellow - for uplifting, warm wishes
    sadness: "#B8D4E3",    // Muted pastel blue - for calming, soothing wishes
    anger: "#F4B8B8",      // Soft pastel red - for passionate, strong wishes
    disgust: "#C8E6C9",    // Muted pastel green - for growth, renewal wishes
    fear: "#D4C5E8",       // Soft pastel purple - for mysterious, introspective wishes
    anxiety: "#A8E6CF",    // Soft teal - for calming, peaceful wishes
    envy: "#D4ED91",       // Gentle pastel lime - for abundance, contentment wishes
    embarrassment: "#F8C8D8", // Soft pastel pink - for gentle, nurturing wishes
    nostalgia: "#F4D4A3",  // Warm pastel orange - for warm, comforting wishes
  };

  useEffect(() => {
    // refresh pool on mount based on mood
    setPool(poolByMood());
    
    // Choose accent color based on mood
    const { context } = readPersonalization();
    const hints = moodHints(context);
    
    if (hints.isStressed || hints.isTired) {
      // Cool, calming colors for stressed users
      setAccentColor(EMOTION_COLORS.anxiety); // Soft teal for calm
    } else if (hints.isBlue) {
      // Warm, uplifting colors for blue users
      setAccentColor(EMOTION_COLORS.joy); // Soft yellow for warmth
    } else if (hints.isUp) {
      // Bright, playful colors for upbeat users
      setAccentColor(EMOTION_COLORS.joy); // Soft yellow for playfulness
    } else {
      setAccentColor(EMOTION_COLORS.nostalgia); // Warm orange for neutral
    }
  }, []);

  // current wish
  const wish = pool.length ? pool[index % pool.length] : null;

  // Function to get the color for the current doodle
  const getDoodleColor = (idx: number): string => {
    const n = idx % 24;
    const currentWish = WISHES[n];
    if (!currentWish) return "#F4D4A3"; // nostalgia for neutral
    
    // Choose emotion color based on the wish's bucket
    switch (currentWish.bucket) {
      case "soothe":
        return n % 2 === 0 ? "#A8E6CF" : "#B8D4E3"; // anxiety (teal) or sadness (blue)
      case "warm":
        return n % 2 === 0 ? "#F4D4A3" : "#F8C8D8"; // nostalgia (orange) or embarrassment (pink)
      case "playful":
        return n % 2 === 0 ? "#FFE5A3" : "#D4ED91"; // joy (yellow) or envy (lime)
      default:
        return "#F4D4A3"; // nostalgia for neutral
    }
  };

  const nextWish = () => {
    if (!pool.length) return;
    // maintain a small recent window (e.g., last 4)
    const windowSize = Math.min(4, pool.length - 1);
    const r = recent.slice(-windowSize);
    const nextIdx = pickNewIndex(pool.length, [index, ...r]);
    setIndex(nextIdx);
    setRecent((prev) => [...prev, nextIdx].slice(-8));
    setAnimSeed((s) => s + 1); // Trigger animation refresh
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
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

      <Button onClick={onBack} variant="ghost" className="mb-6 text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all duration-300" aria-label="Back to Activities">
        ← Back to Activities
      </Button>

      <div className="text-center mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl text-foreground/90 font-light mb-3">
          Whimsy Wishes
        </h1>
        <p className="text-foreground/70 font-sans">Tiny, magical messages to soften your day</p>
      </div>

      <Card className="p-8 border-0 shadow-soft relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10" style={{
          background: `radial-gradient(60% 60% at 50% 30%, ${accentColor}55 0%, transparent 70%), radial-gradient(60% 50% at 50% 100%, ${accentColor}2a 0%, transparent 60%)`,
          transition: "background 500ms ease",
        }} />

        <div key={animSeed} className="relative space-y-6 text-center">
          <div className="flex items-center justify-center whimsy-doodle">
            <div className="whimsy-loop-sway">
              {doodleFor(index, accentColor)}
            </div>
          </div>

          <div className="mx-auto max-w-xl whimsy-letter">
            <div className="rounded-xl bg-white/70 backdrop-blur px-5 py-4">
              <p className="text-lg md:text-xl leading-relaxed text-foreground font-sans" aria-live="polite">
                {wish?.text ?? "May a soft moment find you today."}
              </p>
            </div>
          </div>

          {/* Sparkles effect */}
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: 6 }).map((_, i) => {
              // Get the current doodle's color for the sparkles
              const doodleColor = getDoodleColor(index);
              return (
                <span
                  key={i}
                  className="absolute rounded-full opacity-0 whimsy-sparkle"
                  style={{
                    width: 6 + (i % 3) * 2,
                    height: 6 + (i % 3) * 2,
                    left: `${10 + (i * 15) % 80}%`,
                    top: `${15 + (i * 12) % 70}%`,
                    backgroundColor: doodleColor,
                    animationDelay: `${i * 180}ms`,
                  }}
                />
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={nextWish} size="lg" className="px-8 bg-foreground text-white hover:bg-foreground/90">
              More wishes
            </Button>
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(wish?.text || "")}>
              Copy
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}