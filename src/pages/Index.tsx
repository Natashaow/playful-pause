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
      <header className="px-6 lg:px-8 pt-8">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
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
      <section className="px-6 lg:px-8 mt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-recoleta text-4xl sm:text-5xl tracking-tight mb-6 text-foreground/90">
            Whimsical takes flight
          </h1>
          <p className="font-jakarta text-base text-foreground/70 leading-relaxed">
            Tiny, joyful pauses — illustration-first, no pressure, just lighthearted calm.
          </p>
        </div>
      </section>

      {/* Activity Grid */}
      <section className="px-6 lg:px-8 pb-20 pt-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="animate-card-pop [animation-delay:20ms]">
              <ActivityCard
                title="Emotional Breathing"
                description="Choose an emotion, breathe with its color, and find inner peace through guided breathing."
                onClick={() => setCurrentActivity("colorBreathing")}
                gradient="bg-gradient-joy"
                doodle={<IconRainbow className="h-12 w-12 text-foreground/80" />}
              />
            </div>

            <div className="animate-card-pop [animation-delay:60ms]">
              <ActivityCard
                title="Sound Shapes"
                description="Discover the hidden melodies within geometric forms and create your own symphony."
                onClick={() => setCurrentActivity("soundShapes")}
                gradient="bg-gradient-sunshine"
                doodle={<IconSound className="h-12 w-12 text-foreground/80" />}
              />
            </div>

            <div className="animate-card-pop [animation-delay:100ms]">
              <ActivityCard
                title="Whimsy Wishes"
                description="Receive a small, kind wish with a gentle animated doodle to brighten your day."
                onClick={() => setCurrentActivity("compliments")}
                gradient="bg-gradient-sunshine"
                doodle={<IconHeartStar className="h-12 w-12 text-foreground/80" />}
              />
            </div>

            <div className="animate-card-pop [animation-delay:140ms]">
              <ActivityCard
                title="Doodle Play"
                description="Free-draw tiny shapes and watch them happily come alive with your creativity."
                onClick={() => setCurrentActivity("doodlePlay")}
                gradient="bg-gradient-calm"
                doodle={<IconPalette className="h-12 w-12 text-foreground/80" />}
              />
            </div>

            <div className="animate-card-pop [animation-delay:180ms]">
              <ActivityCard
                title="Mood Garden"
                description="Plant seeds of positive emotions and watch your inner garden bloom with joy."
                onClick={() => setCurrentActivity("moodGarden")}
                gradient="bg-gradient-calm"
                doodle={<IconGarden className="h-12 w-12 text-foreground/80" />}
              />
            </div>

            <div className="animate-card-pop [animation-delay:220ms]">
              <ActivityCard
                title="Creative Spark"
                description="A quiet writing prompt for playful imagination and creative expression."
                onClick={() => setCurrentActivity("creative")}
                gradient="bg-gradient-joy"
                doodle={<IconBreath className="h-12 w-12 text-foreground/80" />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pb-12">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 flex flex-col items-center gap-4 text-foreground/60">
          <p className="font-jakarta text-sm">Take as many pauses as you need. You deserve moments of joy.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
