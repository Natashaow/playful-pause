import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Pattern = Record<string, boolean[]>;

const STEPS = 8;

export default function SoundShapes({ onBack }: { onBack: () => void }) {
  const [selectedShape, setSelectedShape] = useState<string>("");
  const [isPlayingShape, setIsPlayingShape] = useState<string>("");
  const [clickedButton, setClickedButton] = useState<string>("");
  const [composeMode, setComposeMode] = useState(false);

  // composer state
  const [pattern, setPattern] = useState<Pattern>({});
  const [tempo, setTempo] = useState(80);
  const [isSequencerOn, setIsSequencerOn] = useState(false);
  const [step, setStep] = useState(0);
  const loopRef = useRef<number | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<{ [key: string]: OscillatorNode }>({});
  const gainNodesRef = useRef<{ [key: string]: GainNode }>({});

  const soundShapes = [
    { 
      name: "Circle", 
      icon: (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="25" fill="#3B82F6" opacity="0.4"/>
          <circle cx="40" cy="40" r="20" stroke="#1D4ED8" strokeWidth="3" fill="none"/>
          <circle cx="40" cy="40" r="15" fill="#60A5FA" opacity="0.3"/>
        </svg>
      ),
      sound: "Gentle hum", 
      color: "bg-blue-100",
      frequency: 220
    },
    { 
      name: "Triangle", 
      icon: (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 15L60 55H20L40 15Z" fill="#10B981" opacity="0.5"/>
          <path d="M40 20L55 50H25L40 20Z" stroke="#059669" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <circle cx="40" cy="45" r="8" fill="#34D399" opacity="0.4"/>
        </svg>
      ),
      sound: "Soft chime", 
      color: "bg-green-100",
      frequency: 330
    },
    { 
      name: "Square", 
      icon: (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="40" height="40" rx="6" fill="#8B5CF6" opacity="0.5"/>
          <rect x="25" y="25" width="30" height="30" rx="4" stroke="#7C3AED" strokeWidth="3" fill="none"/>
          <circle cx="40" cy="40" r="10" fill="#A78BFA" opacity="0.4"/>
        </svg>
      ),
      sound: "Warm tone", 
      color: "bg-purple-100",
      frequency: 440
    },
    { 
      name: "Wave", 
      icon: (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 30C15 30 25 20 35 30C45 40 55 30 65 30" stroke="#14B8A6" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M15 45C15 45 25 35 35 45C45 55 55 45 65 45" stroke="#0D9488" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M15 60C15 60 25 50 35 60C45 70 55 60 65 60" stroke="#5EEAD4" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8"/>
        </svg>
      ),
      sound: "Flowing melody", 
      color: "bg-teal-100",
      frequency: 550
    },
    { 
      name: "Star", 
      icon: (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 15l8 18 20 2-15 14 3 20-16-9-16 9 3-20-15-14 20-2 8-18z" fill="#F59E0B" opacity="0.6"/>
          <path d="M40 20l7 16 18 2-13 12 3 18-15-8-15 8 3-18-13-12 18-2 7-16z" stroke="#D97706" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
      sound: "Twinkling note", 
      color: "bg-yellow-100",
      frequency: 660
    },
    { 
      name: "Heart", 
      icon: (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 25c-8-8-20-8-28 0-8 8-8 20 0 28l28 28 28-28c8-8 8-20 0-28-8-8-20-8-28 0z" fill="#EC4899" opacity="0.5"/>
          <path d="M40 30c-6-6-15-6-21 0-6 6-6 15 0 21l21 21 21-21c6-6 6-15 0-21-6-6-15-6-21 0z" stroke="#BE185D" strokeWidth="3" fill="none"/>
        </svg>
      ),
      sound: "Gentle pulse", 
      color: "bg-pink-100",
      frequency: 880
    },
  ];

  // Initialize pattern for composer
  useEffect(() => {
    const base: Pattern = {};
    soundShapes.forEach(s => {
      base[s.name] = Array(STEPS).fill(false);
    });
    setPattern(base);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize Web Audio API
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const ensureAudio = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }
  };

  // One‑shot shape tap
  const playSound = async (shape: string) => {
    try {
      await ensureAudio();

      // stop shape if already playing
      if (oscillatorsRef.current[shape]) {
        oscillatorsRef.current[shape].stop();
        oscillatorsRef.current[shape].disconnect();
        gainNodesRef.current[shape].disconnect();
        delete oscillatorsRef.current[shape];
        delete gainNodesRef.current[shape];
      }

      setSelectedShape(shape);
      setIsPlayingShape(shape);
      setClickedButton(shape);
      setTimeout(() => setClickedButton(""), 1000);

      const selected = soundShapes.find(s => s.name === shape);
      if (selected && audioContextRef.current) {
        const osc = audioContextRef.current.createOscillator();
        const gain = audioContextRef.current.createGain();
        oscillatorsRef.current[shape] = osc;
        gainNodesRef.current[shape] = gain;

        osc.frequency.setValueAtTime(selected.frequency, audioContextRef.current.currentTime);
        osc.type = "sine";

        gain.gain.setValueAtTime(0, audioContextRef.current.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 2);

        osc.connect(gain);
        gain.connect(audioContextRef.current.destination);

        osc.start(audioContextRef.current.currentTime);
        osc.stop(audioContextRef.current.currentTime + 2);

        setTimeout(() => {
          if (isPlayingShape === shape) setIsPlayingShape("");
        }, 2000);
      }
    } catch (e) {
      console.error(e);
      setIsPlayingShape("");
      alert("Unable to play audio. Please check your browser settings.");
    }
  };

  const stopSound = () => {
    Object.values(oscillatorsRef.current).forEach(o => {
      o.stop();
      o.disconnect();
    });
    Object.values(gainNodesRef.current).forEach(g => g.disconnect());
    oscillatorsRef.current = {};
    gainNodesRef.current = {};
    setIsPlayingShape("");
    setSelectedShape("");
  };

  // ---- Composer helpers ----
  const toggleCell = (shape: string, idx: number) => {
    setPattern(prev => ({
      ...prev,
      [shape]: prev[shape].map((v, i) => (i === idx ? !v : v)),
    }));
  };

  const clearAll = () => {
    setPattern(prev => {
      const copy: Pattern = {};
      Object.keys(prev).forEach(k => (copy[k] = Array(STEPS).fill(false)));
      return copy;
    });
  };

  const randomize = (density = 0.28) => {
    setPattern(prev => {
      const copy: Pattern = {};
      Object.keys(prev).forEach(k => {
        copy[k] = Array.from({ length: STEPS }, () => Math.random() < density);
      });
      return copy;
    });
  };

  // Sequencer loop
  useEffect(() => {
    if (!isSequencerOn) return;
    let localStep = 0;
    const msPerBeat = 60000 / tempo;
    const msPerEighth = msPerBeat / 2; // 8 steps = eighths

    const tick = async () => {
      await ensureAudio();
      setStep(localStep);

      // fire notes scheduled for this step
      Object.keys(pattern).forEach(shape => {
        if (!pattern[shape][localStep]) return;

        const ctx = audioContextRef.current!;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Use the original shape frequency and sound characteristics
        const selected = soundShapes.find(s => s.name === shape);
        const freq = selected ? selected.frequency : 440;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.type = "sine";

        // Use the exact same envelope as the original tap-to-play
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 2);
      });

      localStep = (localStep + 1) % STEPS;
    };

    // first tick immediately, then interval
    tick();
    loopRef.current = window.setInterval(tick, msPerEighth);
    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
      loopRef.current = null;
    };
  }, [isSequencerOn, tempo, pattern]);

  const toggleSequencer = async () => {
    if (isSequencerOn) {
      setIsSequencerOn(false);
      setStep(0);
      return;
    }
    await ensureAudio();
    setIsSequencerOn(true);
  };

  return (
    <div className="mx-auto max-w-5xl p-6 pb-16">
      <div className="flex items-center justify-between mb-6">
        <Button onClick={onBack} variant="ghost" className="text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all duration-300" aria-label="Back to Activities">
          ← Back to Activities
        </Button>
        {composeMode && (
          <Button 
            variant="outline" 
            onClick={() => { setComposeMode(false); setIsSequencerOn(false); }}
            className="px-4 bg-black text-white border-black hover:bg-black/90 hover:text-white"
          >
            Done composing
          </Button>
        )}
      </div>

      <div className="text-center mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl text-foreground/90 font-light mb-2">
          Sound Shapes
        </h1>
                  <p className="text-foreground/70 font-sans text-sm">
            {composeMode ? "Tap steps to place notes and build loops" : "Discover melodies within geometric forms"}
          </p>
      </div>

      <Card className="p-6 border-0 shadow-soft relative overflow-hidden">

        {!composeMode && (
          <div className="text-center">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              {soundShapes.map((shape) => (
                <button
                  key={shape.name}
                  onClick={() => playSound(shape.name)}
                  className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 border-2 relative ${
                    selectedShape === shape.name && isPlayingShape === shape.name
                      ? 'border-primary shadow-lg scale-105' 
                      : 'border-border hover:border-primary/50'
                  } ${shape.color} ${isPlayingShape === shape.name ? 'opacity-90' : ''}`}
                  aria-label={`Play ${shape.name} sound`}
                >
                  <div className="mb-4 flex justify-center items-center transition-all duration-500 relative hover:scale-110">
                    {shape.icon}
                    {clickedButton === shape.name && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-80"></div>
                        <div className="absolute -bottom-2 -left-2 w-2.5 h-2.5 bg-blue-400 rounded-full animate-ping opacity-80" style={{animationDelay: '0.2s'}}></div>
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-70" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-medium text-foreground mb-1">{shape.name}</div>
                  <div className="text-xs text-muted-foreground">{shape.sound}</div>
                </button>
              ))}
            </div>

            {/* Create your own melody button - centered at bottom */}
            <div className="mt-8 text-center">
              <Button 
                onClick={() => { clearAll(); setComposeMode(true); }} 
                variant="outline"
                size="lg"
                className="px-8 py-3 border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                Create your own melody
              </Button>
            </div>
          </div>
        )}

        {composeMode && (
          <div className="space-y-6">
            {/* transport */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button 
                  onClick={toggleSequencer} 
                  variant={isSequencerOn ? "secondary" : "default"}
                  size="sm"
                  className="px-4"
                >
                  {isSequencerOn ? "⏸" : "▶"}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => randomize(0.28)}
                  size="sm"
                  className="px-3 text-muted-foreground hover:text-foreground"
                >
                  🎲
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={clearAll}
                  size="sm"
                  className="px-3 text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs text-muted-foreground">Tempo</label>
                <input
                  type="range"
                  min={60}
                  max={120}
                  value={tempo}
                  onChange={(e) => setTempo(Number(e.target.value))}
                  className="w-20 accent-teal-500"
                />
                <div className="w-8 text-xs font-mono text-muted-foreground">{tempo}</div>
              </div>
            </div>

            {/* tracks */}
            <div className="grid grid-cols-1 gap-4">
              {soundShapes.map((s) => (
                <div key={s.name} className={`rounded-lg p-4 ${s.color} border border-border/30`}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="scale-75">{s.icon}</div>
                    <div className="font-medium text-sm">{s.name}</div>
                    <div className="flex-1 flex justify-center">
                      <div className="grid grid-cols-8 gap-12">
                        {(pattern[s.name] || []).map((on, i) => (
                          <button
                            key={i}
                            onClick={() => toggleCell(s.name, i)}
                            className={`size-8 rounded-full border-2 transition-all duration-200 ${
                              i === step && isSequencerOn ? "border-primary ring-2 ring-primary/20" : "border-border/50"
                            } ${on ? "bg-primary text-primary-foreground" : "bg-background/80"} hover:scale-105 hover:border-primary/50`}
                            aria-label={`${s.name} step ${i + 1} ${on ? "on" : "off"}`}
                          >
                            {on ? "●" : ""}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-muted-foreground">
              ✨ Sprinkle some musical magic across the steps, then let your creation dance! ✨
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
