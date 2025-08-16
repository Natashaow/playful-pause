// src/components/activities/WhimsyWishes.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { readPersonalization, moodHints } from "@/lib/personalization";

// --- Doodles (minimal, inherit currentColor) ---
const DoodleCloud = ({ className = "" }) => (
  <svg viewBox="0 0 72 40" className={className} aria-hidden>
    <ellipse cx="28" cy="22" rx="18" ry="12" fill="white" stroke="currentColor" strokeWidth="2"/>
    <ellipse cx="44" cy="20" rx="14" ry="10" fill="white" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const DoodleStar = ({ className = "" }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden>
    <path d="M20 4l3.6 7.8 8.6.9-6.3 5.7 1.8 8.4L20 22.8 12.3 27l1.8-8.4-6.3-5.7 8.6-.9L20 4z"
      fill="white" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const DoodleMoon = ({ className = "" }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden>
    <path d="M26 4a14 14 0 1 0 10 24A16 16 0 1 1 26 4z" fill="white" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const DoodleBird = ({ className = "" }) => (
  <svg viewBox="0 0 48 32" className={className} aria-hidden>
    <path d="M4 20c8-10 16-10 24 0s16 10 24 0" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);
const DoodleLamp = ({ className = "" }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden>
    <path d="M12 16h16l-4-8H16l-4 8Z" fill="white" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 16v10" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const DoodlePlane = ({ className = "" }) => (
  <svg viewBox="0 0 48 24" className={className} aria-hidden>
    <path d="M3 12l18 2 22-10-16 14-4 6-3-8-17-4Z" fill="white" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const DoodleCat = ({ className = "" }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden>
    <circle cx="20" cy="22" r="10" fill="white" stroke="currentColor" strokeWidth="2"/>
    <path d="M14 12l4 4M26 12l-4 4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const DoodleClover = ({ className = "" }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden>
    <path d="M20 22c-6-6-10-2-10 2s6 6 10 2c4 4 10 2 10-2s-4-8-10-2Z"
      fill="white" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 22v10" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const ICONS: Record<string, React.ElementType> = {
  cloud: DoodleCloud,
  star: DoodleStar,
  moon: DoodleMoon,
  bird: DoodleBird,
  lamp: DoodleLamp,
  "paper-plane": DoodlePlane,
  cat: DoodleCat,
  clover: DoodleClover,
};

// --- Wishes dataset (sample; add full list as needed) ---
type Wish = { id: string; text: string; doodle: keyof typeof ICONS; bucket: "soothe"|"warm"|"playful" };

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
  const [tint, setTint] = useState<string>("#C3F5E6");

  useEffect(() => {
    // refresh pool on mount based on mood
    setPool(poolByMood());
    // tint from personalization lastColor if present
    try {
      const raw = localStorage.getItem("pp_personalization_v1");
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj?.lastColor?.hex) setTint(obj.lastColor.hex);
      }
    } catch {}
  }, []);

  // current wish & icon
  const wish = pool.length ? pool[index % pool.length] : null;
  const Icon = wish ? ICONS[wish.doodle] : null;

  const nextWish = () => {
    if (!pool.length) return;
    // maintain a small recent window (e.g., last 4)
    const windowSize = Math.min(4, pool.length - 1);
    const r = recent.slice(-windowSize);
    const nextIdx = pickNewIndex(pool.length, [index, ...r]);
    setIndex(nextIdx);
    setRecent((prev) => [...prev, nextIdx].slice(-8));
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Button onClick={onBack} variant="ghost" className="mb-6">
        ← Back to Activities
      </Button>

      <Card className="relative overflow-hidden rounded-3xl bg-white/70 p-8 ring-1 ring-white/50 backdrop-blur shadow-sm">
        {/* soft glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full blur-3xl"
          style={{ background: tint + "55" }}
        />
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/80 ring-1 ring-white/60 text-foreground/80">
            {Icon && <Icon className="h-6 w-6" />}
          </div>
          <h2 className="font-heading text-2xl text-foreground">Whimsy Wishes</h2>
        </div>

        <div className="mt-5">
          <p key={wish?.id} className="font-sans text-lg leading-7 text-foreground/90">
            {wish?.text ?? "May a soft moment find you today."}
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <Button onClick={nextWish} className="px-5">
            More wishes
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigator.clipboard.writeText(wish?.text || "")}
          >
            Copy
          </Button>
        </div>

        <p className="mt-4 text-sm text-foreground/60 font-sans">
          Little notes to soften the day. Your mood gently guides what appears.
        </p>
      </Card>
    </div>
  );
}