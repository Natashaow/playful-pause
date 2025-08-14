import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const prompts = [
  "If you could have any superpower for just one day, what would you do with it?",
  "Describe your perfect day using only words that start with the same letter",
  "What would you tell your favorite childhood toy if you could talk to it now?",
  "If colors had personalities, which color would be your best friend?",
  "Create a new holiday - what would people celebrate and how?",
  "If you could live inside any piece of art, which would you choose?",
  "What kind of store would you open if money wasn't a concern?",
  "If you were a character in a fairy tale, what would your story be?",
  "Describe the most beautiful sound you can imagine",
  "What would you build if you had infinite LEGOs?",
  "If you could change one rule about the world, what would it be?",
  "What would you name a pet dragon and where would you keep it?",
  "If you could only communicate through drawings for a day, what would you draw first?",
  "What magical ingredient would you add to cookies to make them special?",
  "If you were tiny and could live anywhere in your house, where would you set up home?",
];

export const CreativePrompt = ({ onBack }: { onBack: () => void }) => {
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const generatePrompt = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      setCurrentPrompt(randomPrompt);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Button onClick={onBack} variant="ghost" className="mb-6">
        ← Back to Activities
      </Button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-joy bg-clip-text text-transparent">
          Creative Spark
        </h2>
        <p className="text-muted-foreground">
          Let your imagination run wild with these playful prompts
        </p>
      </div>

      <Card className="p-8 text-center bg-gradient-joy border-0 shadow-soft">
        <div className="space-y-6">
          {currentPrompt ? (
            <div className={`transition-all duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
              <div className="text-4xl mb-6">🎨</div>
              <p className="text-xl font-medium text-foreground leading-relaxed">
                {currentPrompt}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl">💭</div>
              <p className="text-lg text-muted-foreground">
                Ready to explore your imagination?
              </p>
            </div>
          )}

          <Button
            onClick={generatePrompt}
            size="lg"
            className="px-8"
            disabled={isAnimating}
          >
            {currentPrompt ? "Inspire Me Again! 🌟" : "Give Me A Prompt ✨"}
          </Button>

          {currentPrompt && (
            <p className="text-sm text-muted-foreground mt-4">
              Take your time with this one. There are no wrong answers - just let your creativity flow! 🎭
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};