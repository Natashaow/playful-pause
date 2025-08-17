import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SoundShapes({ onBack }: { onBack: () => void }) {
  const [selectedShape, setSelectedShape] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<string>("");
  const [clickedButton, setClickedButton] = useState<string>("");
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

  // Initialize Web Audio API
  useEffect(() => {
    // Initialize audio context on first user interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    // Cleanup function
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playSound = async (shape: string) => {
    try {
      // Initialize audio context on first user interaction
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Resume audio context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Stop any currently playing sound for this specific shape
      if (oscillatorsRef.current[shape]) {
        oscillatorsRef.current[shape].stop();
        oscillatorsRef.current[shape].disconnect();
        gainNodesRef.current[shape].disconnect();
        delete oscillatorsRef.current[shape];
        delete gainNodesRef.current[shape];
      }

      setSelectedShape(shape);
      setIsPlaying(shape);
      setClickedButton(shape);
      
      // Clear sparkle effect after animation
      setTimeout(() => setClickedButton(""), 1000);

      const selectedShapeData = soundShapes.find(s => s.name === shape);
      if (selectedShapeData && audioContextRef.current) {
        // Create oscillator for the tone
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        
        oscillatorsRef.current[shape] = oscillator;
        gainNodesRef.current[shape] = gainNode;

        // Set frequency and wave type
        oscillator.frequency.setValueAtTime(selectedShapeData.frequency, audioContextRef.current.currentTime);
        oscillator.type = 'sine';

        // Set volume envelope
        gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 2);

        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        // Start and stop the tone
        oscillator.start(audioContextRef.current.currentTime);
        oscillator.stop(audioContextRef.current.currentTime + 2);

        // Set playing to false when sound ends
        setTimeout(() => {
          if (isPlaying === shape) {
            setIsPlaying("");
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying("");
      alert('Unable to play audio. Please check your browser settings.');
    }
  };

  const stopSound = () => {
    // Stop all currently playing sounds
    Object.values(oscillatorsRef.current).forEach(oscillator => {
      oscillator.stop();
      oscillator.disconnect();
    });
    Object.values(gainNodesRef.current).forEach(gainNode => {
      gainNode.disconnect();
    });
    
    // Clear all references
    oscillatorsRef.current = {};
    gainNodesRef.current = {};
    
    setIsPlaying("");
    setSelectedShape("");
  };

  return (
    <div className="mx-auto max-w-5xl p-6 pb-16">
      <Button onClick={onBack} variant="ghost" className="mb-6 text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all duration-300" aria-label="Back to Activities">
        ← Back to Activities
      </Button>

      <div className="text-center mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl text-foreground/90 font-light mb-3">
          Sound Shapes
        </h1>
        <p className="text-foreground/70 font-sans">Discover the hidden melodies within geometric forms</p>
      </div>

      <Card className="p-8 border-0 shadow-soft relative overflow-hidden rounded-xl">
        <div className="text-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {soundShapes.map((shape) => (
              <button
                key={shape.name}
                onClick={() => playSound(shape.name)}
                disabled={false}
                className={`p-6 rounded-xl transition-all duration-500 hover:scale-105 active:scale-98 active:rotate-1 border-2 ${
                  selectedShape === shape.name && isPlaying === shape.name
                    ? 'border-primary shadow-lg' 
                    : 'border-border hover:border-primary/50'
                } ${shape.color} ${isPlaying === shape.name ? 'opacity-80' : ''} transform-gpu hover:shadow-lg`}
                aria-label={`Play ${shape.name} sound`}
              >
                <div className={`mb-3 text-foreground/80 flex justify-center items-center transition-all duration-500 relative hover:scale-105`}>
                  {shape.icon}
                  {/* Enhanced sparkle effect when clicked */}
                  {clickedButton === shape.name && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-80"></div>
                      <div className="absolute -bottom-2 -left-2 w-2.5 h-2.5 bg-blue-400 rounded-full animate-ping opacity-80" style={{animationDelay: '0.2s'}}></div>
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-70" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">{shape.name}</span>
                <div className="text-xs text-muted-foreground mt-1">{shape.sound}</div>
              </button>
            ))}
          </div>

          {selectedShape && isPlaying === selectedShape && (
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border border-border/30 max-w-sm mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 text-green-600">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Playing {selectedShape}
                  </span>
                </div>
                <Button 
                  onClick={stopSound}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-white/30"
                >
                  Stop
                </Button>
              </div>
            </div>
          )}

          {selectedShape && !isPlaying && (
            <div className="bg-white/70 backdrop-blur p-6 rounded-xl border border-border/60">
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {selectedShape} Sound Complete
              </h3>
              <p className="text-muted-foreground mb-4">
                How did that {soundShapes.find(s => s.name === selectedShape)?.sound.toLowerCase()} make you feel?
              </p>
              <Button 
                onClick={() => setSelectedShape("")}
                variant="outline"
                className="border-black text-black hover:bg-black hover:text-white transition-all duration-300"
              >
                Try Another Shape
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
