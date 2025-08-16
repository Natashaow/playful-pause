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
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.play();
        setIsMusicPlaying(true);
      }
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
            "radial-gradient(60% 50% at 20% 10%, hsla(45,95%,90%,0.9) 0%, transparent 65%)," +
            "radial-gradient(55% 45% at 85% 0%, hsla(165,80%,85%,0.85) 0%, transparent 70%)," +
            "radial-gradient(70% 60% at 40% 90%, hsla(260,65%,87%,0.8) 0%, transparent 75%)",
          filter: "saturate(105%)",
        }}
      />

      {/* Header */}
      <header className="px-5 sm:px-6 lg:px-8 pt-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleMusic}
              className="size-9 rounded-xl bg-white/80 ring-1 ring-white/60 flex items-center justify-center group hover:bg-white/90 transition-all duration-300"
              aria-label="Toggle background music"
            >
              {/* Minimalistic play symbol in black */}
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                className={`text-foreground transition-all duration-300 group-hover:scale-110 ${isMusicPlaying ? 'animate-pulse' : ''}`}
              >
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </button>
            <span className="font-recoleta text-xl">Playful Pause</span>
          </div>
          {/* Random Activity CTA */}
                      <button
              onClick={() => {
                const activities: Activity[] = ["colorBreathing", "doodlePlay", "compliments", "creative", "moodGarden", "soundShapes"];
                const randomActivity = activities[Math.floor(Math.random() * activities.length)];
                setCurrentActivity(randomActivity);
              }}
              className="hidden sm:inline-flex items-center rounded-full bg-foreground px-4 py-2 font-jakarta text-sm font-semibold text-white shadow-sm hover:bg-foreground/90 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              title="Click for a surprise pause activity ✧"
              aria-label="Start a random pause activity"
            >
            <span className="group-hover:animate-pulse">Start a pause</span>
            <span className="ml-1 opacity-60 group-hover:opacity-100 transition-opacity">✧</span>
          </button>
        </div>
      </header>

      {/* Title block */}
      <section className="px-5 sm:px-6 lg:px-8 mt-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-block mb-3 text-foreground/70 animate-float-slow">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" className="text-foreground/70">
              {/* Whimsical butterfly with brand colors */}
              <path d="M24 12c-4-4-8-4-12 0s-8 4-12 0" fill="#FFB6C1" opacity="0.8" stroke="#FF69B4" strokeWidth="1.5"/>
              <path d="M24 12c4-4 8-4 12 0s8 4 12 0" fill="#87CEEB" opacity="0.8" stroke="#4682B4" strokeWidth="1.5"/>
              <path d="M24 20c-2-2-4-2-6 0s-4 2-6 0" fill="#DDA0DD" opacity="0.7" stroke="#9370DB" strokeWidth="1.5"/>
              <path d="M24 20c2-2 4-2 6 0s4 2 6 0" fill="#F0E68C" opacity="0.7" stroke="#DAA520" strokeWidth="1.5"/>
              {/* Body */}
              <path d="M22 24v8" stroke="#8B4513" strokeWidth="2" strokeLinecap="round"/>
              {/* Antennae */}
              <path d="M22 24c-1-1-2-2-3-3" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <path d="M26 24c1-1 2-2 3-3" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              {/* Sparkle effects */}
              <circle cx="16" cy="8" r="1" fill="#FFD700" opacity="0.8"/>
              <circle cx="32" cy="8" r="1" fill="#FFD700" opacity="0.8"/>
              <circle cx="12" cy="16" r="0.8" fill="#FF69B4" opacity="0.7"/>
              <circle cx="36" cy="16" r="0.8" fill="#4682B4" opacity="0.7"/>
            </svg>
          </div>
          <h1 className="font-recoleta text-4xl sm:text-5xl tracking-tight">Whimsical takes flight</h1>
          <p className="mt-3 font-jakarta text-[15.5px] text-foreground/70">
            Tiny, joyful pauses — illustration-first, no pressure, just lighthearted calm.
          </p>
        </div>
      </section>

      {/* Activity Grid */}
      <section className="px-5 sm:px-6 lg:px-8 pb-16 pt-10">
        <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="animate-card-pop [animation-delay:20ms]">
            <ActivityCard
              title="Color Breathing"
              description="Pick a color, breathe with it, and let a small calm settle in."
              onClick={() => setCurrentActivity("colorBreathing")}
              gradient="bg-gradient-joy"
              doodle={<IconRainbow className="h-6 w-6 text-foreground/80" />}
            />
          </div>

          <div className="animate-card-pop [animation-delay:60ms]">
            <ActivityCard
              title="Doodle Play"
              description="Free-draw tiny shapes and watch them happily come alive."
              onClick={() => setCurrentActivity("doodlePlay")}
              gradient="bg-gradient-calm"
              doodle={<IconPalette className="h-6 w-6 text-foreground/80" />}
            />
          </div>

          <div className="animate-card-pop [animation-delay:100ms]">
            <ActivityCard
              title="Whimsy Wishes"
              description="Receive a small, kind wish with a gentle animated doodle."
              onClick={() => setCurrentActivity("compliments")}
              gradient="bg-gradient-sunshine"
              doodle={<IconHeartStar className="h-6 w-6 text-foreground/80" />}
            />
          </div>

          <div className="animate-card-pop [animation-delay:140ms]">
            <ActivityCard
              title="Creative Spark"
              description="A quiet writing prompt for playful imagination."
              onClick={() => setCurrentActivity("creative")}
              gradient="bg-gradient-joy"
              doodle={<IconBreath className="h-6 w-6 text-foreground/80" />}
            />
          </div>

          <div className="animate-card-pop [animation-delay:180ms]">
            <ActivityCard
              title="Mood Garden"
              description="Plant seeds of positive emotions and watch your inner garden bloom."
              onClick={() => setCurrentActivity("moodGarden")}
              gradient="bg-gradient-calm"
              doodle={<IconGarden className="h-6 w-6 text-foreground/80" />}
            />
          </div>

          <div className="animate-card-pop [animation-delay:220ms]">
            <ActivityCard
              title="Sound Shapes"
              description="Discover the hidden melodies within geometric forms."
              onClick={() => setCurrentActivity("soundShapes")}
              gradient="bg-gradient-sunshine"
              doodle={<IconSound className="h-6 w-6 text-foreground/80" />}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pb-10">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 flex flex-col items-center gap-3 text-foreground/65">
          <p className="font-jakarta text-sm">Take as many pauses as you need. You deserve moments of joy.</p>
          <div className="text-base">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" className="text-foreground/65">
              {/* Whimsical flower with brand colors */}
              <circle cx="24" cy="24" r="8" fill="#FFB6C1" opacity="0.8"/>
              <circle cx="24" cy="24" r="6" fill="#FF69B4" opacity="0.6"/>
              <circle cx="24" cy="24" r="4" fill="#FF1493" opacity="0.8"/>
              {/* Petals */}
              <path d="M24 12c-2-2-4-2-6 0s-4 2-6 0" fill="#87CEEB" opacity="0.7" stroke="#4682B4" strokeWidth="1.5"/>
              <path d="M24 12c2-2 4-2 6 0s4 2 6 0" fill="#DDA0DD" opacity="0.7" stroke="#9370DB" strokeWidth="1.5"/>
              <path d="M24 36c-2 2-4 2-6 0s-4-2-6 0" fill="#98FB98" opacity="0.7" stroke="#32CD32" strokeWidth="1.5"/>
              <path d="M24 36c2 2 4 2 6 0s4-2 6 0" fill="#F0E68C" opacity="0.7" stroke="#DAA520" strokeWidth="1.5"/>
              <path d="M12 24c-2-2-2-4 0-6s2-4 0-6" fill="#FFB6C1" opacity="0.7" stroke="#FF69B4" strokeWidth="1.5"/>
              <path d="M36 24c2-2 2-4 0-6s-2-4 0-6" fill="#87CEEB" opacity="0.7" stroke="#4682B4" strokeWidth="1.5"/>
              {/* Stem */}
              <path d="M24 32v8" stroke="#228B22" strokeWidth="2" strokeLinecap="round"/>
              {/* Leaves */}
              <path d="M20 36c-2-1-3-3-3-5" stroke="#32CD32" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <path d="M28 36c2-1 3-3 3-5" stroke="#32CD32" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
