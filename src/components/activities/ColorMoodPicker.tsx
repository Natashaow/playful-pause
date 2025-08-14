import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const colors = [
  { name: "Sunshine", value: "#FFE66D", emotion: "energized" },
  { name: "Ocean", value: "#4ECDC4", emotion: "calm" },
  { name: "Lavender", value: "#C7CEEA", emotion: "peaceful" },
  { name: "Coral", value: "#FF6B6B", emotion: "passionate" },
  { name: "Mint", value: "#95E1D3", emotion: "fresh" },
  { name: "Peach", value: "#FFB4B4", emotion: "warm" },
  { name: "Sky", value: "#A8E6CF", emotion: "hopeful" },
  { name: "Rose", value: "#FFD93D", emotion: "joyful" },
];

export const ColorMoodPicker = ({ onBack }: { onBack: () => void }) => {
  const [selectedColor, setSelectedColor] = useState<typeof colors[0] | null>(null);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Button onClick={onBack} variant="ghost" className="mb-6">
        ← Back to Activities
      </Button>
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-joy bg-clip-text text-transparent">
          What color makes you feel good right now?
        </h2>
        <p className="text-muted-foreground">
          Choose a color that speaks to your current mood
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {colors.map((color) => (
          <Card
            key={color.name}
            className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
              selectedColor?.name === color.name
                ? "border-primary shadow-glow"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => setSelectedColor(color)}
          >
            <div
              className="w-full h-16 rounded-lg mb-3 shadow-soft"
              style={{ backgroundColor: color.value }}
            />
            <h3 className="font-semibold text-center text-sm">{color.name}</h3>
          </Card>
        ))}
      </div>

      {selectedColor && (
        <Card className="p-6 text-center bg-gradient-calm border-0 shadow-soft">
          <div className="mb-4">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-4 shadow-glow"
              style={{ backgroundColor: selectedColor.value }}
            />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            You chose {selectedColor.name}!
          </h3>
          <p className="text-lg text-muted-foreground">
            Perfect for feeling <span className="font-medium">{selectedColor.emotion}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Take a moment to breathe in this color's energy 🌈
          </p>
        </Card>
      )}
    </div>
  );
};