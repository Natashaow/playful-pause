import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPalette } from "@/components/doodles/Icons";
import { readPersonalization, moodHints } from "@/lib/personalization";
import { ActivityHeader } from "@/components/ActivityHeader";

// Palette (9 colors from Color Breathing)
const PALETTE = [
  { name: "Cream", value: "#FFE5A3" },
  { name: "Sky", value: "#B8D4E3" },
  { name: "Blush", value: "#F4B8B8" },
  { name: "Sage", value: "#C8E6C9" },
  { name: "Lavender", value: "#D4C5E8" },
  { name: "Teal", value: "#A8E6CF" },
  { name: "Lime", value: "#D4ED91" },
  { name: "Rose", value: "#F8C8D8" },
  { name: "Peach", value: "#F4D4A3" },
];

// Cool colors subset
const COOL = [
  { name: "Sky", value: "#B8D4E3" },
  { name: "Sage", value: "#C8E6C9" },
  { name: "Lavender", value: "#D4C5E8" },
  { name: "Teal", value: "#A8E6CF" },
];

// Warm colors subset
const WARM = [
  { name: "Cream", value: "#FFE5A3" },
  { name: "Blush", value: "#F4B8B8" },
  { name: "Rose", value: "#F8C8D8" },
  { name: "Peach", value: "#F4D4A3" },
];

// Playful mix subset
const PLAY = [
  { name: "Lime", value: "#D4ED91" },
  { name: "Teal", value: "#A8E6CF" },
  { name: "Peach", value: "#F4D4A3" },
  { name: "Lavender", value: "#D4C5E8" },
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

export default function ColorDoodlePlay({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dprRef = useRef<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>(PALETTE[0].value);
  const [stroke, setStroke] = useState<number>(5);
  // Always use white background
  const [showTwinkles, setShowTwinkles] = useState<boolean>(false);
  const [currentPalette, setCurrentPalette] = useState<Array<{name: string; value: string}>>(PALETTE);
  const [themeHint, setThemeHint] = useState<string>("");
  const isDrawingRef = useRef<boolean>(false);
  const pointsRef = useRef<Array<{x:number;y:number;time:number}>>([]);
  const clearGlowTimeout = useRef<number | null>(null);
  const [completedStrokes, setCompletedStrokes] = useState<Array<{path: Path2D; color: string; width: number}>>([]);
  const canvasHistoryRef = useRef<ImageData[]>([]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const canvasHeightCss = 480; // ~480px

  // Always use white background

  // Personalization setup on mount
  useEffect(() => {
    const { context, lastSpark } = readPersonalization();
    const hints = moodHints(context);

    // Always show all 9 colors from the full palette
    setCurrentPalette(PALETTE);
    setSelectedColor(PALETTE[0].value);

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

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undoLastStroke();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

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
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, canvasHeightCss);
    setCompletedStrokes([]);
    canvasHistoryRef.current = [];
  };

  // Undo last stroke
  const undoLastStroke = () => {
    if (completedStrokes.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Remove the last stroke from the array
    const newStrokes = completedStrokes.slice(0, -1);
    setCompletedStrokes(newStrokes);

    // Clear canvas and redraw all remaining strokes
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, canvasHeightCss);
    
    // Redraw all remaining strokes with their original properties
    newStrokes.forEach(stroke => {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke(stroke.path);
    });
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

    // Background - always white
    octx.fillStyle = '#ffffff';
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

  // Music toggle function
  const toggleMusic = () => {
    const el = audioRef.current;
    if (!el) return;
    if (isMusicPlaying) {
      el.pause();
      setIsMusicPlaying(false);
    } else {
      el
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch((err) => {
          console.error("Audio play failed:", err);
          setIsMusicPlaying(false);
        });
    }
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

    // Set the stroke color at the beginning
    console.log('Setting stroke color to:', selectedColor);
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = stroke;
    
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

    
    console.log('Drawing with color:', selectedColor, 'ctx.strokeStyle:', ctx.strokeStyle);
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

    // Save the completed stroke
    if (pointsRef.current.length >= 2) {
      const path = new Path2D();
      const pts = pointsRef.current;
      
      // Create a path from the points
      path.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        path.lineTo(pts[i].x, pts[i].y);
      }
      
      setCompletedStrokes(prev => [...prev, {
        path,
        color: selectedColor,
        width: stroke
      }]);
    }

    // Gentle glow fade
    if (clearGlowTimeout.current) window.clearTimeout(clearGlowTimeout.current);
    clearGlowTimeout.current = window.setTimeout(() => {
      ctx.shadowBlur = 0;
    }, 500);

    pointsRef.current = [];
    try { (evt.target as HTMLCanvasElement).releasePointerCapture(evt.pointerId); } catch (_e) { void _e; }
  };

  return (
    <div className="min-h-screen text-foreground">
      <ActivityHeader 
        onBack={onBack}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={toggleMusic}
        onRandomActivity={() => {
          const activities = ["colorBreathing", "doodlePlay", "compliments", "creative", "moodGarden", "soundShapes"];
          const randomActivity = activities[Math.floor(Math.random() * activities.length)];
          // Navigate to random activity
          if (randomActivity === "doodlePlay") {
            // Stay on current page but reset state
            clearCanvas();
            setShowTwinkles(false);
          } else {
            // Navigate to different activity
            onBack();
            // Note: The parent component will handle the actual navigation
          }
        }}
      />
      
      {/* Hidden audio element */}
      <audio ref={audioRef} src="/audio/bg-music.mp3" preload="auto" loop className="hidden" />

      {/* Title Section - Same structure as homepage */}
      <section className="px-6 lg:px-8 mt-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-recoleta text-3xl sm:text-4xl tracking-tight mb-2 text-foreground">
            Doodle Play
          </h1>
          <p className="font-jakarta text-sm mb-6 text-foreground/70 leading-relaxed">Create playful doodles to relax your mind and spark creativity.</p>
          {themeHint && (
            <p className="mt-2 font-jakarta text-sm text-foreground/70/80 italic">
              💡 {themeHint}
            </p>
          )}
        </div>
      </section>

      {/* Main Content Section - Same structure as homepage */}
      <section className="px-6 lg:px-8 pb-12 pt-6">
        <div className="mx-auto max-w-5xl">
          {/* Canvas area with connected toolbar */}
          <div className="relative w-full rounded-lg overflow-hidden bg-white border border-gray-200/30">
            {/* Toolbar - now connected to canvas */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4 bg-gray-50/80 backdrop-blur-sm border-b border-gray-100">
              {/* Colors */}
              <div className="flex items-center gap-2 flex-wrap" aria-label="Choose color">
                {currentPalette.map((c) => (
                  <button
                    key={c.name}
                    aria-label={`Color ${c.name}`}
                    onClick={() => setSelectedColor(c.value)}
                    className={`w-7 h-7 rounded-full transition-all hover:scale-105 ${selectedColor === c.value ? 'ring-2 ring-gray-400 shadow-sm' : 'hover:shadow-sm'}`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>

              {/* Stroke slider */}
              <div className="flex items-center gap-3">
                <label htmlFor="stroke" className="text-sm text-gray-600">Stroke</label>
                <input
                  id="stroke"
                  aria-label="Stroke width"
                  type="range"
                  min={1}
                  max={10}
                  value={stroke}
                  onChange={(e) => setStroke(parseInt(e.target.value))}
                  className="w-32"
                  style={{ 
                    accentColor: selectedColor,
                    '--tw-ring-color': selectedColor
                  } as React.CSSProperties}
                />
                <span className="text-sm text-gray-600 w-6 text-center">{stroke}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={undoLastStroke} 
                  disabled={completedStrokes.length === 0}
                  aria-label="Undo last stroke"
                  className="disabled:opacity-40 disabled:cursor-not-allowed px-2 py-1 h-7 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  title="Undo last stroke"
                >
                  ↩
                </Button>
                <Button type="button" variant="ghost" onClick={clearCanvas} aria-label="Clear canvas" className="px-3 py-1 h-7 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100">Clear</Button>
                <Button type="button" variant="default" onClick={savePng} aria-label="Save PNG" className="px-3 py-1 h-7 text-sm bg-gray-800 text-white hover:bg-gray-700">Save</Button>
              </div>
            </div>

            {/* Canvas */}
            <div ref={containerRef} className="relative w-full">
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
                  <div className="absolute top-8 left-8 size-2 rounded-full bg-gray-400/30 animate-twinkle" />
                  <div className="absolute top-12 right-12 size-1.5 rounded-full bg-gray-400/30 animate-twinkle" />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}