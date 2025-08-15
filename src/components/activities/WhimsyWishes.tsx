import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WISHES = [
  "May your tea always be warm and your socks forever cozy 🫖🧦",
  "A friendly breeze finds you exactly when you need it 🍃",
  "May tiny moments sprinkle your day with delight ✨",
  "You stumble upon a cloud shaped exactly like your favorite animal ☁️",
  "A pocket of unexpected laughter follows you today 😊",
  "Your worries turn to paper boats and gently float away ⛵",
  "May you find a sunbeam that belongs just to you ☀️",
  "A small kindness boomerangs right back to your heart 💛",
  "You discover wonder in an ordinary corner of your world 🪄",
  "A quiet calm wraps around you like a soft blanket 🌟",
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
  if (exclude != null && max > 1) {
    while (idx === exclude) idx = Math.floor(Math.random() * max);
  }
  return idx;
}

export const WhimsyWishes: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [wishIdx, setWishIdx] = useState<number>(() => randomIndex(WISHES.length));
  const [accentIdx, setAccentIdx] = useState<number>(() => randomIndex(ACCENTS.length));
  const [softBg, setSoftBg] = useState<boolean>(true);

  const wish = WISHES[wishIdx];
  const accent = ACCENTS[accentIdx];

  const bgStyle = useMemo(() => {
    if (!softBg) return {} as React.CSSProperties;
    const light = `${accent}55`;
    const lighter = `${accent}2a`;
    return {
      background: `radial-gradient(60% 60% at 50% 30%, ${light} 0%, transparent 70%), radial-gradient(60% 50% at 50% 100%, ${lighter} 0%, transparent 60%)`,
      transition: "background 500ms ease-in-out",
    } as React.CSSProperties;
  }, [softBg, accent]);

  const onMore = () => {
    setWishIdx((i) => randomIndex(WISHES.length, i));
    setAccentIdx((i) => randomIndex(ACCENTS.length, i));
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(wish);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Button onClick={onBack} variant="ghost" className="mb-6" aria-label="Back to Activities">
        ← Back to Activities
      </Button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-recoleta font-bold mb-3 bg-gradient-joy bg-clip-text text-transparent">
          Whimsy Wishes
        </h2>
        <p className="text-muted-foreground">Tiny, magical messages to soften your day</p>
      </div>

      <Card className="p-8 border-0 shadow-soft relative overflow-hidden">
        {softBg && <div aria-hidden className="absolute inset-0 -z-10" style={bgStyle} />}

        <div className="space-y-6 text-center">
          <div className="text-5xl" aria-hidden>✨</div>
          <p className="text-xl leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
            {wish}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={onMore} size="lg" className="px-8" style={{ backgroundColor: accent, borderColor: accent }}>
              More wishes
            </Button>
            <Button variant="secondary" onClick={() => setSoftBg((v) => !v)} aria-pressed={softBg}>
              Background: {softBg ? "Soft" : "Plain"}
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