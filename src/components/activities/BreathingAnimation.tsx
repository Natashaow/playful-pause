import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const BreathingAnimation = ({ onBack }: { onBack: () => void }) => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    if (!isBreathing) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setPhase((currentPhase) => {
            switch (currentPhase) {
              case "inhale":
                return "hold";
              case "hold":
                return "exhale";
              case "exhale":
                return "inhale";
              default:
                return "inhale";
            }
          });
          return phase === "hold" ? 4 : 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathing, phase]);

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
    }
  };

  const getCircleScale = () => {
    switch (phase) {
      case "inhale":
        return "scale-150";
      case "hold":
        return "scale-150";
      case "exhale":
        return "scale-100";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Button onClick={onBack} variant="ghost" className="mb-6">
        ← Back to Activities
      </Button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-calm bg-clip-text text-transparent">
          Gentle Breathing
        </h2>
        <p className="text-muted-foreground">
          Follow the circle and breathe at your own pace
        </p>
      </div>

      <Card className="p-12 text-center bg-gradient-calm border-0 shadow-soft">
        <div className="flex flex-col items-center space-y-8">
          <div className="relative">
            <div
              className={`w-32 h-32 rounded-full bg-gradient-joy transition-transform duration-4000 ease-in-out ${
                isBreathing ? getCircleScale() : "scale-100"
              }`}
            />
            <div className="absolute inset-0 w-32 h-32 rounded-full border-2 border-primary/30 animate-pulse" />
          </div>

          <div className="space-y-4">
            {isBreathing && (
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">{getPhaseText()}</h3>
                <p className="text-4xl font-mono font-bold text-primary">{seconds}</p>
              </div>
            )}

            <Button
              onClick={() => setIsBreathing(!isBreathing)}
              variant={isBreathing ? "secondary" : "default"}
              size="lg"
              className="px-8"
            >
              {isBreathing ? "Pause" : "Start Breathing"}
            </Button>
          </div>

          {!isBreathing && (
            <p className="text-sm text-muted-foreground max-w-md">
              When you're ready, press start and follow the gentle rhythm of the circle. 
              Breathe in as it grows, hold as it stays, breathe out as it shrinks.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};