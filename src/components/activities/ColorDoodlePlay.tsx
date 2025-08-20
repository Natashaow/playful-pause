import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPalette } from "@/components/doodles/Icons";
import { readPersonalization, moodHints } from "@/lib/personalization";

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
    <div className="mx-auto max-w-5xl p-6">
      <Button onClick={onBack} variant="ghost" className="mb-6 text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all duration-300" aria-label="Back to Activities">← Back to Activities</Button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-heading font-bold mb-3 text-foreground">
          Doodle Play
        </h2>
        <p className="font-sans text-muted-foreground">Create playful doodles to relax your mind and spark creativity. Use Ctrl+Z (or Cmd+Z) to undo strokes.</p>
        {themeHint && (
          <p className="mt-2 font-sans text-sm text-muted-foreground/80 italic">
            💡 {themeHint}
          </p>
        )}
      </div>

            {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6 min-h-[60px] p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
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
            className="w-40"
            style={{ 
              accentColor: selectedColor,
              '--tw-ring-color': selectedColor
            } as React.CSSProperties}
          />
          <span className="text-sm tabular-nums w-6 text-center">{stroke}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={undoLastStroke} 
            disabled={completedStrokes.length === 0}
            aria-label="Undo last stroke (Ctrl+Z)"
            className="disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo last stroke (Ctrl+Z or Cmd+Z)"
          >
            ↩ Undo {completedStrokes.length > 0 && `(${completedStrokes.length})`}
          </Button>
          <Button type="button" variant="outline" onClick={clearCanvas} aria-label="Clear canvas">Clear</Button>
          <Button type="button" variant="default" onClick={savePng} aria-label="Save PNG" className="bg-foreground text-white hover:bg-foreground/90">Save PNG</Button>
        </div>
      </div>

      {/* Canvas area */}
      <div ref={containerRef} className="relative w-full rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm border border-white/30">
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
    </div>
  );
}