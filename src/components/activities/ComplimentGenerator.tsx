import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const compliments = [
  "Your smile can light up any room 🌟",
  "You have such a kind heart 💝",
  "Your creativity is truly inspiring ✨",
  "You bring out the best in people 🌻",
  "Your laugh is absolutely contagious 😊",
  "You have amazing energy 🔥",
  "Your perspective is refreshing 🌿",
  "You're stronger than you know 💪",
  "Your compassion makes the world better 🌍",
  "You have such a beautiful soul 🦋",
  "Your authenticity is magnetic 🌈",
  "You're a wonderful human being 🌸",
  "Your presence is a gift 🎁",
  "You have incredible potential ⭐",
  "Your kindness ripples out to others 🌊",
];

export const ComplimentGenerator = ({ onBack }: { onBack: () => void }) => {
  const [currentCompliment, setCurrentCompliment] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateCompliment = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
      setCurrentCompliment(randomCompliment);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Button onClick={onBack} variant="ghost" className="mb-6">
        ← Back to Activities
      </Button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-sunshine bg-clip-text text-transparent">
          Daily Dose of Kindness
        </h2>
        <p className="text-muted-foreground">
          Everyone deserves to hear something wonderful about themselves
        </p>
      </div>

      <Card className="p-8 text-center bg-gradient-sunshine border-0 shadow-soft">
        <div className="space-y-6">
          {currentCompliment ? (
            <div className={`transition-all duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
              <p className="text-2xl font-medium text-foreground leading-relaxed">
                {currentCompliment}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl">💫</div>
              <p className="text-lg text-muted-foreground">
                Ready for some positivity?
              </p>
            </div>
          )}

          <Button
            onClick={generateCompliment}
            size="lg"
            className="px-8"
            disabled={isAnimating}
          >
            {currentCompliment ? "Another One Please! ✨" : "Give Me A Compliment 🌟"}
          </Button>

          {currentCompliment && (
            <p className="text-sm text-muted-foreground mt-4">
              Take a moment to really let this sink in. You deserve this and so much more! 💛
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};