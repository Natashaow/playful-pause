import { useState } from "react";
import ActivityCard from "@/components/ActivityCard";

// ✅ Activities
import { ColorBreathing } from "@/components/activities/ColorBreathing";
import { ColorDoodlePlay } from "@/components/activities/ColorDoodlePlay";
import ComplimentGenerator from "@/components/activities/ComplimentGenerator";
import CreativePrompt from "@/components/activities/CreativePrompt";

type Activity = "home" | "colorbreathing" | "doodleplay" | "compliments" | "creative";

const Index = () => {
  const [currentActivity, setCurrentActivity] = useState<Activity>("home");

  // Render chosen activity
  if (currentActivity === "colorbreathing") {
    return <ColorBreathing onBack={() => setCurrentActivity("home")} />;
  }

  if (currentActivity === "doodleplay") {
    return <ColorDoodlePlay onBack={() => setCurrentActivity("home")} />;
  }

  if (currentActivity === "compliments") {
    return <ComplimentGenerator onBack={() => setCurrentActivity("home")} />;
  }

  if (currentActivity === "creative") {
    return <CreativePrompt onBack={() => setCurrentActivity("home")} />;
  }

  // Render home page with activity cards
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-6">
          <div className="inline-block text-6xl mb-4 animate-bounce">🎈</div>
          <h1 className="text-5xl md:text-6xl font-recoleta font-bold text-primary mb-4">
            Playful Pause
          </h1>
<<<<<<< HEAD
          <p className="text-2xl font-jakarta font-medium text-primary/80 mb-6">
            Where Whimsy Takes Flight
          </p>
          <p className="text-lg font-jakarta text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Quick, joyful distractions that refresh your mind and spirit in under 3 minutes. 
            No streaks, no pressure—just pure, simple joy.
=======
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Whimsical takes flight
>>>>>>> bf1b91c (Update ColorBreathing and DoodlePlay activities)
          </p>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <ActivityCard
<<<<<<< HEAD
            title="Color Your Mood"
            description="Choose colors that make you feel good right now and discover what they say about your energy"
            icon="🎨"
            onClick={() => setCurrentActivity("colors")}
            gradient="bg-gradient-whimsy"
=======
            title="Color Breathing"
            description="Pick a color, then breathe with it to calm your mind and let go of tension."
            icon="🌈"
            onClick={() => setCurrentActivity("colorbreathing")}
            gradient="bg-gradient-joy"
>>>>>>> bf1b91c (Update ColorBreathing and DoodlePlay activities)
          />

          <ActivityCard
<<<<<<< HEAD
            title="Gentle Breathing"
            description="Follow a soothing visual guide for mindful breathing that calms your nervous system"
            icon="☁️"
            onClick={() => setCurrentActivity("breathing")}
=======
            title="Doodle Play"
            description="Express yourself freely with playful, calming doodles."
            icon="✏️"
            onClick={() => setCurrentActivity("doodleplay")}
>>>>>>> bf1b91c (Update ColorBreathing and DoodlePlay activities)
            gradient="bg-gradient-calm"
          />

          <ActivityCard
            title="Daily Kindness"
<<<<<<< HEAD
            description="Receive a heartfelt compliment designed to remind you of your wonderful qualities"
            icon="✨"
=======
            description="Receive a heartfelt compliment designed to remind you of your wonderful qualities."
            icon="💝"
>>>>>>> bf1b91c (Update ColorBreathing and DoodlePlay activities)
            onClick={() => setCurrentActivity("compliments")}
            gradient="bg-gradient-warm"
          />

          <ActivityCard
            title="Creative Spark"
<<<<<<< HEAD
            description="Get a delightful prompt to ignite your imagination and see the world from a fresh perspective"
            icon="🌙"
=======
            description="Get a delightful prompt to ignite your imagination and see the world from a fresh perspective."
            icon="🎨"
>>>>>>> bf1b91c (Update ColorBreathing and DoodlePlay activities)
            onClick={() => setCurrentActivity("creative")}
            gradient="bg-gradient-whimsy"
          />
        </div>

        {/* Footer */}
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
