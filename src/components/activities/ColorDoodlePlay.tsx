import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPalette } from "@/components/doodles/Icons";
import { readPersonalization, moodHints } from "@/lib/personalization";

// Palette (8 soft colors)
const PALETTE = [
  { name: "Ocean", value: "#4ECDC4" },
  { name: "Lavender", value: "#C7CEEA" },
  { name: "Coral", value: "#FF6B6B" },
  { name: "Mint", value: "#95E1D3" },
  { name: "Peach", value: "#FFB4B4" },
  { name: "Sky", value: "#A8E6CF" },
  { name: "Rose", value: "#FFD93D" },
  { name: "Bluebell", value: "#A0C4FF" },
] as const;

// Mood-based palette subsets
const COOL: typeof PALETTE = [
  { name: "Ocean", value: "#4ECDC4" },
  { name: "Lavender", value: "#C7CEEA" },
  { name: "Sky", value: "#A8E6CF" },
  { name: "Bluebell", value: "#A0C4FF" },
];

const WARM: typeof PALETTE = [
  { name: "Coral", value: "#FF6B6B" },
  { name: "Peach", value: "#FFB4B4" },
  { name: "Rose", value: "#FFD93D" },
  { name: "Mint", value: "#95E1D3" },
];

const PLAY: typeof PALETTE = [
  { name: "Coral", value: "#FF6B6B" },
  { name: "Mint", value: "#95E1D3" },
  { name: "Rose", value: "#FFD93D" },
  { name: "Sky", value: "#A8E6CF" },
];

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function midpoint(a: {x:number;y:number}, b: {x:number;y:number}) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function jitter(amount: number) {
  // tiny hand-drawn jitter
  return (Math.random() - 0.5) * 2 * amount;
}

export const ColorDoodlePlay: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dprRef = useRef<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>(PALETTE[0].value);
  const [stroke, setStroke] = useState<number>(5);
  const [softBackground, setSoftBackground] = useState<boolean>(true);
  const [showTwinkles, setShowTwinkles] = useState<boolean>(false);
  const [currentPalette, setCurrentPalette] = useState<typeof PALETTE>(PALETTE);
  const [themeHint, setThemeHint] = useState<string>("");
  const isDrawingRef = useRef<boolean>(false);
  const pointsRef = useRef<Array<{x:number;y:number;time:number}>>([]);
  const clearGlowTimeout = useRef<number | null>(null);

  const canvasHeightCss = 420; // ~420px

  const bgClass = useMemo(() => softBackground ? "bg-gradient-calm" : "bg-white", [softBackground]);

  // Personalization setup on mount
  useEffect(() => {
    const { context, lastSpark } = readPersonalization();
    const hints = moodHints(context);

    // Choose palette based on mood
    if (hints.isStressed || hints.isTired) {
      setCurrentPalette(COOL); // cooling colors
      setSelectedColor(COOL[0].value);
    } else if (hints.isBlue) {
      setCurrentPalette(WARM); // warming colors
      setSelectedColor(WARM[0].value);
    } else {
      setCurrentPalette(PLAY); // playful mix
      setSelectedColor(PLAY[0].value);
    }

    // Set theme hint based on last Creative Spark response
    if (lastSpark && Math.random() < 0.2) { // 20% chance
      setThemeHint("Try doodling a tiny scene from your saved idea");
    }
  }, []);

  // Setup canvas size, DPR-aware, and resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const applySize = () => {
      const rect = container.getBoundingClientRect();
      const widthCss = Math.max(0, Math.floor(rect.width));
      const heightCss = canvasHeightCss;
      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      dprRef.current = dpr;

      canvas.style.width = `${widthCss}px`;
      canvas.style.height = `${heightCss}px`;
      const nextW = Math.max(1, Math.floor(widthCss * dpr));
      const nextH = Math.max(1, Math.floor(heightCss * dpr));
      if (canvas.width !== nextW || canvas.height !== nextH) {
        // Optionally preserve drawing by copying to offscreen, but we keep it simple and clear
        canvas.width = nextW;
        canvas.height = nextH;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      // Clear to transparent; background handled by wrapper
      ctx.clearRect(0, 0, widthCss, heightCss);
    };

    applySize();

    const ro = new ResizeObserver(() => {
      applySize();
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
    };
  }, []);

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, canvasHeightCss);
  };

  // Save PNG (nice to have)
  const savePng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = dprRef.current;
    const cssWidth = canvas.clientWidth;
    const cssHeight = canvasHeightCss;
    const pxW = Math.max(1, Math.floor(cssWidth * dpr));
    const pxH = Math.max(1, Math.floor(cssHeight * dpr));

    const off = document.createElement('canvas');
    off.width = pxW;
    off.height = pxH;
    const octx = off.getContext('2d');
    if (!octx) return;

    // Background
    if (softBackground) {
      const grad = octx.createLinearGradient(0, 0, 0, pxH);
      grad.addColorStop(0, '#f6fcff');
      grad.addColorStop(1, '#fff7fb');
      octx.fillStyle = grad;
    } else {
      octx.fillStyle = '#ffffff';
    }
    octx.fillRect(0, 0, pxW, pxH);

    // Draw current canvas content
    octx.drawImage(canvas, 0, 0);

    const url = off.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'doodle.png';
    a.click();
  };

  const getPos = (evt: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = (evt.target as HTMLCanvasElement).getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    return { x, y };
  };

  const beginStroke = (evt: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    (evt.target as HTMLCanvasElement).setPointerCapture(evt.pointerId);

    isDrawingRef.current = true;
    pointsRef.current = [];

    // Show twinkles on first stroke
    if (!showTwinkles) {
      setShowTwinkles(true);
    }

    // Start glow
    ctx.shadowBlur = Math.max(0, stroke * 0.9);
    ctx.shadowColor = hexToRgba(selectedColor, 0.35);

    const p = getPos(evt);
    pointsRef.current.push({ ...p, time: performance.now() });
  };

  const drawSmooth = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pts = pointsRef.current;
    if (pts.length < 3) return;

    const i = pts.length - 3;
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const p2 = pts[i + 2];

    const m1 = midpoint(p0, p1);
    const m2 = midpoint(p1, p2);

    const jitterAmt = Math.min(1.2, 0.22 * stroke);
    const widthJitter = 1 + (Math.random() - 0.5) * 0.12; // +/-6%

    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = Math.max(1, stroke * widthJitter);

    ctx.beginPath();
    ctx.moveTo(m1.x, m1.y);
    ctx.quadraticCurveTo(
      p1.x + jitter(jitterAmt),
      p1.y + jitter(jitterAmt),
      m2.x,
      m2.y
    );
    ctx.stroke();
  };

  const moveStroke = (evt: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const p = getPos(evt);
    pointsRef.current.push({ ...p, time: performance.now() });
    drawSmooth();
  };

  const endStroke = (evt: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Gentle glow fade
    if (clearGlowTimeout.current) window.clearTimeout(clearGlowTimeout.current);
    clearGlowTimeout.current = window.setTimeout(() => {
      ctx.shadowBlur = 0;
    }, 500);

    pointsRef.current = [];
    try { (evt.target as HTMLCanvasElement).releasePointerCapture(evt.pointerId); } catch (_e) { void _e; }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Button onClick={onBack} variant="ghost" className="mb-6" aria-label="Back to Activities">← Back to Activities</Button>

      <Card className="p-0 border-0 shadow-soft overflow-hidden">
        <div className="relative p-6">
          {/* Pastel radial glow band */}
          <div 
            aria-hidden 
            className="absolute inset-x-0 top-0 -z-10 h-24" 
            style={{
              background: "radial-gradient(60% 60% at 50% 10%, rgba(164, 234, 218, 0.3) 0%, transparent 70%)",
            }}
          />
          
          {/* Header with doodle */}
          <div className="flex items-center gap-3 mb-6">
            <IconPalette className="h-6 w-6 text-foreground/80 animate-float-slow" />
            <div>
              <h2 className="text-3xl font-heading font-bold text-primary">Doodle Play</h2>
              <p className="font-sans text-muted-foreground">Create playful doodles to relax your mind and spark creativity</p>
              {themeHint && (
                <p className="mt-2 font-sans text-sm text-muted-foreground/80 italic">
                  💡 {themeHint}
                </p>
              )}
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            {/* Colors */}
            <div className="flex items-center gap-2 flex-wrap" aria-label="Choose color">
              {currentPalette.map((c) => (
                <button
                  key={c.name}
                  aria-label={`Color ${c.name}`}
                  onClick={() => setSelectedColor(c.value)}
                  className={`w-8 h-8 rounded-full ring-offset-2 transition-transform hover:scale-110 ${selectedColor === c.value ? 'ring-2 ring-primary shadow-glow' : ''}`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>

            {/* Stroke slider */}
            <div className="flex items-center gap-3">
              <label htmlFor="stroke" className="text-sm text-muted-foreground">Stroke</label>
              <input
                id="stroke"
                aria-label="Stroke width"
                type="range"
                min={1}
                max={10}
                value={stroke}
                onChange={(e) => setStroke(parseInt(e.target.value))}
                className="w-40 accent-primary"
              />
              <span className="text-sm tabular-nums w-6 text-center">{stroke}</span>
            </div>

            {/* Background toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Background:</span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                aria-pressed={softBackground}
                onClick={() => setSoftBackground((v) => !v)}
              >
                {softBackground ? 'Soft' : 'Plain'}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={clearCanvas} aria-label="Clear canvas">Clear</Button>
              <Button type="button" variant="default" onClick={savePng} aria-label="Save PNG">Save PNG</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Canvas area */}
      <Card className={`border-0 shadow-soft ${bgClass}`}>
        <div ref={containerRef} className="relative w-full rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            className="block w-full h-[420px] touch-none"
            onPointerDown={beginStroke}
            onPointerMove={moveStroke}
            onPointerUp={endStroke}
            onPointerCancel={endStroke}
            onPointerLeave={endStroke}
            aria-label="Doodle canvas"
            role="img"
          />
          
          {/* Twinkles on first stroke */}
          {showTwinkles && (
            <>
              <div className="absolute top-8 left-8 size-2 rounded-full bg-foreground/20 animate-twinkle" />
              <div className="absolute top-12 right-12 size-1.5 rounded-full bg-foreground/20 animate-twinkle" />
            </>
          )}
        </div>
      </Card>
    </div>
  );
};