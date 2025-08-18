import { useState, useRef, useEffect } from "react";
import ActivityCard from "@/components/ActivityCard";
import { IconRainbow, IconBreath, IconHeartStar, IconPalette, IconGarden, IconSound } from "@/components/doodles/Icons";

// ✅ Activities
import ColorBreathing from "@/components/activities/ColorBreathing";
import { ColorDoodlePlay } from "@/components/activities/ColorDoodlePlay";
import WhimsyWishes from "@/components/activities/WhimsyWishes";
import { CreativePrompt } from "@/components/activities/CreativePrompt";
import MoodGarden from "@/components/activities/MoodGarden";
import SoundShapes from "@/components/activities/SoundShapes";

type Activity = "home" | "colorBreathing" | "doodlePlay" | "compliments" | "creative" | "moodGarden" | "soundShapes";

const Index = () => {
  const [currentActivity, setCurrentActivity] = useState<Activity>("home");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  if (currentActivity === "colorBreathing") {
    return <ColorBreathing onBack={() => setCurrentActivity("home")} />;
  }
  if (currentActivity === "doodlePlay") {
    return <ColorDoodlePlay onBack={() => setCurrentActivity("home")} />;
  }
  if (currentActivity === "creative") {
    return <CreativePrompt onBack={() => setCurrentActivity("home")} />;
  }
  if (currentActivity === "compliments") {
    return <WhimsyWishes onBack={() => setCurrentActivity("home")} />;
  }
  if (currentActivity === "moodGarden") {
    return <MoodGarden onBack={() => setCurrentActivity("home")} />;
  }
  if (currentActivity === "soundShapes") {
    return <SoundShapes onBack={() => setCurrentActivity("home")} />;
  }

  return (
    <div className="min-h-screen text-foreground">
      {/* Pastel gradient backdrop */}
              <div
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 10%, hsla(45,95%,90%,0.8) 0%, transparent 65%)," +
              "radial-gradient(55% 45% at 85% 0%, hsla(165,85%,88%,0.7) 0%, transparent 70%)," +
              "radial-gradient(70% 60% at 40% 90%, hsla(260,75%,88%,0.6) 0%, transparent 75%)",
            filter: "saturate(110%)",
          }}
        />

      {/* Header */}
      <header className="px-6 lg:px-8 pt-8">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleMusic}
              className="size-8 rounded-lg bg-white/60 ring-1 ring-black/5 flex items-center justify-center hover:bg-white/80 transition-all duration-200"
              aria-label="Toggle background music"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                className={`text-foreground transition-all duration-200 ${isMusicPlaying ? 'animate-pulse' : ''}`}
              >
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </button>
            {/* Hidden audio element. Place your file at public/audio/bg-music.mp3 */}
            <audio ref={audioRef} src="/audio/bg-music.mp3" preload="auto" loop className="hidden" />
            <span className="font-recoleta text-lg">Playful Pause</span>
          </div>
          <button
            onClick={() => {
              const activities: Activity[] = ["colorBreathing", "doodlePlay", "compliments", "creative", "moodGarden", "soundShapes"];
              const randomActivity = activities[Math.floor(Math.random() * activities.length)];
              setCurrentActivity(randomActivity);
            }}
            className="hidden sm:inline-flex items-center rounded-lg bg-black px-4 py-2 font-jakarta text-sm font-medium text-white hover:bg-black/90 transition-all duration-200"
            title="Click for a surprise pause activity"
            aria-label="Start a random pause activity"
          >
            Surprise me
          </button>
        </div>
      </header>

            {/* Title block */}
      <section className="px-6 lg:px-8 mt-6">
        <div className="mx-auto max-w-2xl text-center">
          {/* Animated whimsical icon */}
          <div className="mb-3 flex justify-center">
              <div className="animate-bounce">
                <svg 
                  width="48" 
                  height="48" 
                  viewBox="0 0 64 64" 
                  fill="none" 
                >
                {/* Whimsical flying bird/butterfly with varied colors */}
                <g className="animate-pulse">
                  {/* Wings - teal/blue */}
                  <path 
                    d="M20 32c8-12 16-8 24 0s16 8 24 0" 
                    stroke="#4ECDC4" 
                    strokeWidth="2" 
                    fill="none" 
                    strokeLinecap="round"
                    className="animate-ping"
                    style={{animationDuration: '3s'}}
                  />
                  <path 
                    d="M20 36c8-12 16-8 24 0s16 8 24 0" 
                    stroke="#45B7D1" 
                    strokeWidth="1.5" 
                    fill="none" 
                    strokeLinecap="round"
                    className="animate-ping"
                    style={{animationDuration: '3s', animationDelay: '0.5s'}}
                  />
                  
                  {/* Body - warm orange */}
                  <circle cx="32" cy="32" r="3" fill="#FF9A56" opacity="0.9" />
                  
                  {/* Sparkles - varied colors */}
                  <circle cx="16" cy="24" r="1.5" fill="#FF6B9D" opacity="0.8" className="animate-ping" style={{animationDuration: '2s'}} />
                  <circle cx="48" cy="28" r="1" fill="#4ECDC4" opacity="0.9" className="animate-ping" style={{animationDuration: '2s', animationDelay: '0.7s'}} />
                  <circle cx="24" cy="44" r="1.2" fill="#FFD93D" opacity="0.7" className="animate-ping" style={{animationDuration: '2s', animationDelay: '1.4s'}} />
                  
                  {/* Additional colorful elements */}
                  <circle cx="56" cy="20" r="1" fill="#A8E6CF" opacity="0.6" className="animate-ping" style={{animationDuration: '2.5s', animationDelay: '0.3s'}} />
                  <circle cx="8" cy="40" r="0.8" fill="#FFB6C1" opacity="0.8" className="animate-ping" style={{animationDuration: '2.5s', animationDelay: '1.1s'}} />
                  <circle cx="52" cy="48" r="1.1" fill="#D4A5A5" opacity="0.7" className="animate-ping" style={{animationDuration: '2.5s', animationDelay: '1.8s'}} />
                </g>
              </svg>
            </div>
          </div>
          
          <h1 className="font-recoleta text-4xl sm:text-5xl tracking-tight mb-2 text-foreground">
            Whimsical takes flight
          </h1>
          <p className="font-jakarta text-sm mb-6 text-foreground/70 leading-relaxed">
            Tiny, joyful pauses — illustration-first, no pressure, just lighthearted calm.
          </p>
        </div>
      </section>

      {/* Activity Grid */}
      <section className="px-6 lg:px-8 pb-12 pt-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="animate-card-pop [animation-delay:20ms]">
              <ActivityCard
                title="Emotional Breathing"
                description="Choose an emotion, breathe with its color, and find inner peace through guided breathing."
                onClick={() => setCurrentActivity("colorBreathing")}
                gradient="bg-gradient-joy"
                doodle={<IconRainbow className="h-10 w-10 text-foreground/80" />}
              />
            </div>

            <div className="animate-card-pop [animation-delay:60ms]">
              <ActivityCard
                title="Sound Shapes"
                description="Discover the hidden melodies within geometric forms and create your own symphony."
                onClick={() => setCurrentActivity("soundShapes")}
                gradient="bg-gradient-sunshine"
                doodle={<IconSound className="h-10 w-10 text-foreground/80" />}
              />
            </div>

            <div className="animate-card-pop [animation-delay:100ms]">
              <ActivityCard
                title="Whimsy Wishes"
                description="Receive a small, kind wish with a gentle animated doodle to brighten your day."
                onClick={() => setCurrentActivity("compliments")}
                gradient="bg-gradient-sunshine"
                doodle={<IconHeartStar className="h-10 w-10 text-foreground/80" />}
              />
            </div>

            <div className="animate-card-pop [animation-delay:140ms]">
              <ActivityCard
                title="Doodle Play"
                description="Free-draw tiny shapes and watch them happily come alive with your creativity."
                onClick={() => setCurrentActivity("doodlePlay")}
                gradient="bg-gradient-calm"
                doodle={<IconPalette className="h-10 w-10 text-foreground/80" />}
              />
            </div>

            <div className="animate-card-pop [animation-delay:180ms]">
              <ActivityCard
                title="Mood Garden"
                description="Plant seeds of positive emotions and watch your inner garden bloom with joy."
                onClick={() => setCurrentActivity("moodGarden")}
                gradient="bg-gradient-calm"
                doodle={<IconGarden className="h-10 w-10 text-foreground/80" />}
              />
            </div>

            <div className="animate-card-pop [animation-delay:220ms]">
              <ActivityCard
                title="Creative Spark"
                description="A quiet writing prompt for playful imagination and creative expression."
                onClick={() => setCurrentActivity("creative")}
                gradient="bg-gradient-joy"
                doodle={<IconBreath className="h-10 w-10 text-foreground/80" />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pb-12 pt-2">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 flex flex-col items-center gap-2 text-foreground/60">
          <p className="font-jakarta text-xs">Take as many pauses as you need. You deserve moments of joy.</p>
          {/* Flower icon */}
          <div className="w-5 h-5">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              {/* Wavy decorative lines above */}
              <path d="M2 4 Q6 6 10 4 Q14 2 18 4 Q22 6 22 4" stroke="#87CEEB" strokeWidth="1" fill="none" />
              <path d="M3 6 Q7 8 11 6 Q15 4 19 6 Q23 8 23 6" stroke="#FFB6C1" strokeWidth="1" fill="none" />
              <path d="M4 8 Q8 10 12 8 Q16 6 20 8 Q24 10 24 8" stroke="#DDA0DD" strokeWidth="1" fill="none" />
              
              {/* Flower bloom - soft outer halo */}
              <circle cx="12" cy="12" r="6" fill="#FFF0F5" opacity="0.8" />
              {/* Lighter pink halo */}
              <circle cx="12" cy="12" r="4" fill="#FFB6C1" />
              {/* Bright pink center */}
              <circle cx="12" cy="12" r="2" fill="#FF69B4" />
              
              {/* Straight dark green stem */}
              <rect x="11.5" y="18" width="1" height="4" fill="#228B22" />
              
              {/* Simple curved leaves */}
              <path d="M8 18 Q10 16 12 18 Q10 20 8 18" fill="#32CD32" />
              <path d="M16 18 Q14 16 12 18 Q14 20 16 18" fill="#FFA500" />
            </svg>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
