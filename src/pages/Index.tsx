import { useState } from "react";
import ActivityCard from "@/components/ActivityCard";
import { IconRainbow, IconBreath, IconHeartStar, IconPalette } from "@/components/doodles/Icons";

// ✅ Activities
import ColorBreathing from "@/components/activities/ColorBreathing";
import { ColorDoodlePlay } from "@/components/activities/ColorDoodlePlay";
import WhimsyWishes from "@/components/activities/WhimsyWishes";
import { CreativePrompt } from "@/components/activities/CreativePrompt";

type Activity = "home" | "colorBreathing" | "doodlePlay" | "compliments" | "creative";

const Index = () => {
  const [currentActivity, setCurrentActivity] = useState<Activity>("home");

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
            <div className="size-9 rounded-xl bg-white/80 ring-1 ring-white/60 flex items-center justify-center group">
              {/* Minimalistic pause symbol in black */}
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-foreground transition-all duration-300 group-hover:scale-110"
                aria-label="Pause symbol"
              >
                <rect x="6" y="4" width="3" height="16" rx="0.5" fill="currentColor" />
                <rect x="15" y="4" width="3" height="16" rx="0.5" fill="currentColor" />
              </svg>
            </div>
            <span className="font-recoleta text-xl">Playful Pause</span>
          </div>
          {/* Random Activity CTA */}
                      <button
              onClick={() => {
                const activities: Activity[] = ["colorBreathing", "doodlePlay", "compliments", "creative"];
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
          <div className="inline-block mb-3 text-foreground/70 animate-float-slow">✧</div>
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
        </div>
      </section>

      {/* Footer */}
      <footer className="pb-10">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 flex flex-col items-center gap-3 text-foreground/65">
          <p className="font-jakarta text-sm">Take as many pauses as you need. You deserve moments of joy.</p>
          <div className="text-base">🌸</div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
