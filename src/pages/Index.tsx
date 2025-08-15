import { useState } from "react";
import { ActivityCard } from "@/components/ActivityCard";

// ✅ Activities
import ColorBreathing from "@/components/activities/ColorBreathing";
import { ColorDoodlePlay } from "@/components/activities/ColorDoodlePlay";
import { WhimsyWishes } from "@/components/activities/ComplimentGenerator";
import { CreativePrompt } from "@/components/activities/CreativePrompt";

// Simple inline doodle icon for card (matches style, no emojis)
const SparkleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 3l2.4 4.8L21 10l-4.6 2.2L14 17l-2.4-4.8L7 10l4.6-2.2L14 3z" fill="currentColor" opacity="0.9" />
    <path d="M6 16l1.2 2.4L10 19l-2.3 1.1L6 22l-1.1-1.9L2 19l2.9-.6L6 16zM22 16l1.2 2.4 2.8.6-2.3 1.1L22 22l-1.1-1.9L18.6 19l2.8-.6L22 16z" fill="currentColor" opacity="0.6" />
  </svg>
);

type Activity = "home" | "colorBreathing" | "doodlePlay" | "creative" | "wishes";

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
  if (currentActivity === "wishes") {
    return <WhimsyWishes onBack={() => setCurrentActivity("home")} />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-6">
          <div className="inline-block text-6xl mb-4 animate-bounce">🎈</div>
          <h1 className="text-5xl md:text-6xl font-recoleta font-bold text-primary mb-4">
            Playful Pause
          </h1>
          <p className="text-2xl font-jakarta font-medium text-primary/80 mb-6">
            Where Whimsy Takes Flight
          </p>
          <p className="text-lg font-jakarta text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Quick, joyful distractions that refresh your mind and spirit in under 3 minutes. 
            No streaks, no pressure—just pure, simple joy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <ActivityCard
            title="Color Breathing"
            description="Pick a color, then breathe with it to calm your mind and let go of tension."
            icon="🌈"
            onClick={() => setCurrentActivity("colorBreathing")}
            gradient="bg-gradient-joy"
          />
          <ActivityCard
            title="Doodle Play"
            description="Create playful doodles to relax your mind and spark creativity"
            icon="✏️"
            onClick={() => setCurrentActivity("doodlePlay")}
            gradient="bg-gradient-calm"
          />
          <ActivityCard
            title="Whimsy Wishes"
            description="Tiny, magical messages to soften your day"
            icon={<SparkleIcon />}
            onClick={() => setCurrentActivity("wishes")}
            gradient="bg-gradient-sunshine"
          />
          <ActivityCard
            title="Creative Spark"
            description="Get a delightful prompt to ignite your imagination and see the world from a fresh perspective."
            icon="🎨"
            onClick={() => setCurrentActivity("creative")}
            gradient="bg-gradient-whimsy"
          />
        </div>

        <div className="text-center mt-16 space-y-2">
          <p className="text-sm text-muted-foreground">
            Take as many pauses as you need. You deserve moments of joy.
          </p>
          <div className="text-2xl">🌸</div>
        </div>
      </div>
    </div>
  );
};

export default Index;
