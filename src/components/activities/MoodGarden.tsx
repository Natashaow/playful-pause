import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActivityHeader } from "@/components/ActivityHeader";

interface Plant {
  id: string;
  mood: string;
  color: string;
  timestamp: number;
  emoji: string;
  growthStage: number;
  interactionCount: number;
  lastInteraction: number;
  journalEntry?: string;
}

declare global {
  interface Window {
    recordMoodInteraction?: (mood: string) => void;
  }
}

const MOOD_COLORS: { [key: string]: { color: string; emoji: string } } = {
  joy: { color: "bg-yellow-100", emoji: "★" },
  calm: { color: "bg-blue-100", emoji: "○" },
  love: { color: "bg-red-100", emoji: "♥" },
  growth: { color: "bg-green-100", emoji: "🌱" },
  fear: { color: "bg-purple-100", emoji: "⚡" },
  peace: { color: "bg-teal-100", emoji: "☮" },
  hope: { color: "bg-lime-100", emoji: "✨" },
  gentle: { color: "bg-pink-100", emoji: "🌸" },
  anxiety: { color: "bg-orange-100", emoji: "∞" },
};

export default function MoodGarden({ onBack }: { onBack: () => void }) {
  // Expose recordMoodInteraction function globally for other activities to use
  React.useEffect(() => {
    window.recordMoodInteraction = recordMoodInteraction;
    return () => {
      delete window.recordMoodInteraction;
    };
  }, []);
  const [currentView, setCurrentView] = useState<"entry" | "planting" | "garden">("entry");
  const [moodInput, setMoodInput] = useState("");
  const [plants, setPlants] = useState<Plant[]>([]);
  const [currentPlant, setCurrentPlant] = useState<Plant | null>(null);
  const [showSurprise, setShowSurprise] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [journalEntry, setJournalEntry] = useState("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Load plants from localStorage on mount
  useEffect(() => {
    const savedPlants = localStorage.getItem("moodGarden");
    if (savedPlants) {
      const parsedPlants = JSON.parse(savedPlants) as Partial<Plant>[];
      // Add missing properties to existing plants
      const plantsWithGrowth: Plant[] = parsedPlants.map((plant) => ({
        id: plant.id || String(Date.now()),
        mood: plant.mood || "",
        color: plant.color || "bg-gray-100",
        timestamp: plant.timestamp || Date.now(),
        emoji: plant.emoji || "🌱",
        growthStage: plant.growthStage ?? 1,
        interactionCount: plant.interactionCount ?? 0,
        lastInteraction: plant.lastInteraction || plant.timestamp || Date.now(),
        journalEntry: plant.journalEntry || "",
      }));
      setPlants(plantsWithGrowth);
      // Always start with entry view first, then show garden if plants exist
      setCurrentView("entry");
    } else {
      // Add test data for August 15th and 16th with different developmental stages
      const testPlants: Plant[] = [
        // August 15th - Morning entry (Seed stage)
        {
          id: "test-1",
          mood: "joy",
          color: "bg-yellow-100",
          timestamp: new Date(2024, 7, 15, 9, 0).getTime(), // Aug 15, 9 AM
          emoji: "★",
          growthStage: 1,
          interactionCount: 2,
          lastInteraction: new Date(2024, 7, 15, 9, 0).getTime(),
          journalEntry: "Feeling great this morning!"
        },
        // August 15th - Evening entry (Sprout stage)
        {
          id: "test-2",
          mood: "calm",
          color: "bg-blue-100",
          timestamp: new Date(2024, 7, 15, 20, 0).getTime(), // Aug 15, 8 PM
          emoji: "○",
          growthStage: 2,
          interactionCount: 6,
          lastInteraction: new Date(2024, 7, 16, 10, 0).getTime(),
          journalEntry: "Feeling peaceful and calm this evening."
        },
        // August 16th - Morning entry (Bloom stage)
        {
          id: "test-3",
          mood: "love",
          color: "bg-red-100",
          timestamp: new Date(2024, 7, 16, 8, 0).getTime(), // Aug 16, 8 AM
          emoji: "♥",
          growthStage: 3,
          interactionCount: 12,
          lastInteraction: new Date(2024, 7, 16, 8, 0).getTime(),
          journalEntry: "Woke up feeling grateful and loving today."
        },
        // August 16th - Evening entry (Seed stage)
        {
          id: "test-4",
          mood: "fear",
          color: "bg-purple-100",
          timestamp: new Date(2024, 7, 16, 19, 0).getTime(), // Aug 16, 7 PM
          emoji: "⚡",
          growthStage: 1,
          interactionCount: 1,
          lastInteraction: new Date(2024, 7, 16, 19, 0).getTime(),
          journalEntry: "Feeling anxious about tomorrow."
        }
      ];
      setPlants(testPlants);
      setCurrentView("entry");
    }
  }, []);

  // Save plants to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("moodGarden", JSON.stringify(plants));
  }, [plants]);

  const getMoodColor = (mood: string) => {
    const lowerMood = mood.toLowerCase();
    for (const [key, value] of Object.entries(MOOD_COLORS)) {
      if (lowerMood.includes(key)) {
        return value;
      }
    }
    // Default colors for unmatched moods
    return { color: "bg-gray-100", emoji: "🌱" };
  };

  const plantMood = () => {
    if (!moodInput.trim()) return;

    // Check if user already has 2 entries today
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const todaysEntries = plants.filter(plant => {
      const plantDate = new Date(plant.timestamp);
      return plantDate >= todayStart && plantDate < todayEnd;
    });
    
    if (todaysEntries.length >= 2) {
      alert("You can only plant 2 moods per day. Come back tomorrow to plant more!");
      return;
    }

    const { color, emoji } = getMoodColor(moodInput);
    const newPlant: Plant = {
      id: Date.now().toString(),
      mood: moodInput.trim(),
      color,
      timestamp: Date.now(),
      emoji,
      growthStage: 1,
      interactionCount: 0,
      lastInteraction: Date.now(),
    };

    setCurrentPlant(newPlant);
    setCurrentView("planting");

    // Planting animation sequence
    setTimeout(() => {
      setPlants(prev => [newPlant, ...prev]);
      setCurrentView("garden");
      setMoodInput("");
      setCurrentPlant(null);
      
      // Show surprise occasionally
      if (Math.random() < 0.3) {
        setShowSurprise(true);
        setTimeout(() => setShowSurprise(false), 3000);
      }
    }, 3000);
  };

  // Function to record interaction with a mood
  const recordMoodInteraction = (mood: string) => {
    setPlants(prev => prev.map(plant => 
      plant.mood.toLowerCase() === mood.toLowerCase()
        ? { 
            ...plant, 
            interactionCount: plant.interactionCount + 1,
            lastInteraction: Date.now()
          }
        : plant
    ));
  };

  // Function to update plant growth based on interactions
  const updatePlantGrowth = () => {
    setPlants(prev => prev.map(plant => {
      const timeSinceLastInteraction = Date.now() - plant.lastInteraction;
      const daysSinceLastInteraction = timeSinceLastInteraction / (1000 * 60 * 60 * 24);
      
      // Growth logic based on interaction frequency and recency
      let newGrowthStage = plant.growthStage;
      
      if (plant.interactionCount >= 10 && daysSinceLastInteraction <= 1) {
        // High interaction + recent: grow to stage 3
        newGrowthStage = 3;
      } else if (plant.interactionCount >= 5 && daysSinceLastInteraction <= 3) {
        // Medium interaction + recent: grow to stage 2
        newGrowthStage = 2;
      } else if (plant.interactionCount >= 2 && daysSinceLastInteraction <= 7) {
        // Low interaction + recent: stay at stage 1
        newGrowthStage = 1;
      } else if (daysSinceLastInteraction > 7) {
        // No recent interaction: regress to stage 1
        newGrowthStage = 1;
      }
      
      return { ...plant, growthStage: newGrowthStage };
    }));
  };

  // Music toggle function
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

  // Auto-update plant growth every hour
  useEffect(() => {
    const interval = setInterval(updatePlantGrowth, 60 * 60 * 1000); // Every hour
    return () => clearInterval(interval);
  }, []);

  // Function to handle seed click for journaling
  const handleSeedClick = (plant: Plant) => {
    const today = new Date();
    const plantDate = new Date(plant.timestamp);
    
    // Check if same day (ignoring time)
    const isSameDay = today.getFullYear() === plantDate.getFullYear() &&
                     today.getMonth() === plantDate.getMonth() &&
                     today.getDate() === plantDate.getDate();
    
    console.log('Date comparison:', {
      today: today.toDateString(),
      plantDate: plantDate.toDateString(),
      isSameDay
    });
    
    if (isSameDay) {
      setSelectedPlant(plant);
      setJournalEntry(plant.journalEntry || "");
      setShowJournal(true);
    }
  };

  // Function to save journal entry
  const saveJournalEntry = () => {
    if (selectedPlant && journalEntry.trim()) {
      setPlants(prev => prev.map(plant => 
        plant.id === selectedPlant.id 
          ? { ...plant, journalEntry: journalEntry.trim() }
          : plant
      ));
      setShowJournal(false);
      setSelectedPlant(null);
      setJournalEntry("");
    }
  };



  const EntryScreen = () => (
    <Card className="p-8 border-0 shadow-soft relative overflow-hidden rounded-xl">
      {/* Tab navigation */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setCurrentView("entry")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              currentView === "entry" 
                ? "bg-white text-black shadow-sm" 
                : "text-gray-600 hover:text-black"
            }`}
          >
            Plant New Mood
          </button>
          {plants.length > 0 && (
            <button
              onClick={() => setCurrentView("garden")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentView === "garden" 
                  ? "bg-white text-black shadow-sm" 
                  : "text-gray-600 hover:text-black"
              }`}
            >
              View Garden
            </button>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-6xl mb-8 font-bold relative">
          <div className="relative flex justify-center items-center">
            {/* Seed icon - matches garden design */}
            <div className="relative w-20 h-16 mx-auto">
              {/* Soil base - changes with mood */}
              <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-12 rounded-lg border-2 shadow-sm ${moodInput ? MOOD_COLORS[moodInput.toLowerCase()]?.color.replace('bg-', 'bg-') : 'bg-amber-100'} ${moodInput ? `border-${MOOD_COLORS[moodInput.toLowerCase()]?.color.replace('bg-', '').replace('-100', '-300')}` : 'border-amber-700'}`}></div>
              {/* Seed body */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-8 bg-amber-800 rounded-full"></div>
              {/* Seed cap */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-green-700 rounded-full"></div>
              {/* Seed stem */}
              <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-green-800 rounded-sm"></div>
            </div>
          </div>
        </div>
        <h3 className="text-2xl font-heading font-semibold mb-4 text-foreground">
          Plant how you feel today
        </h3>
        <div className="max-w-md mx-auto">
          <input
            type="text"
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            placeholder="Type your mood here..."
            className={`w-full p-3 text-center rounded-full placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-base bg-gray-100 ${moodInput ? (moodInput === 'joy' ? 'text-yellow-600' : moodInput === 'calm' ? 'text-blue-600' : moodInput === 'love' ? 'text-red-600' : moodInput === 'growth' ? 'text-green-600' : moodInput === 'fear' ? 'text-purple-600' : moodInput === 'peace' ? 'text-teal-600' : moodInput === 'hope' ? 'text-lime-600' : moodInput === 'gentle' ? 'text-pink-600' : moodInput === 'anxiety' ? 'text-orange-600' : 'text-foreground') : 'text-foreground'}`}
            onKeyPress={(e) => e.key === "Enter" && plantMood()}
            autoFocus
          />
          
          <div className="mt-4 mb-6">
            <p className="text-sm text-muted-foreground mb-3">or choose from common moods:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.keys(MOOD_COLORS).map((mood) => (
                <button
                  key={mood}
                  onClick={() => setMoodInput(mood)}
                  className={`px-3 py-2 text-sm transition-colors capitalize border rounded-full ${moodInput === mood ? `font-medium ${mood === 'joy' ? 'text-yellow-600 border-yellow-600' : mood === 'calm' ? 'text-blue-600 border-blue-600' : mood === 'love' ? 'text-red-600 border-red-600' : mood === 'growth' ? 'text-green-600 border-green-600' : mood === 'fear' ? 'text-purple-600 border-purple-600' : mood === 'peace' ? 'text-teal-600 border-teal-600' : mood === 'hope' ? 'text-lime-600 border-lime-600' : mood === 'gentle' ? 'text-pink-600 border-pink-600' : mood === 'anxiety' ? 'text-orange-600 border-orange-600' : 'text-foreground border-border'}` : 'text-muted-foreground hover:text-foreground border-border hover:border-foreground/20'}`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
          
          <Button
            onClick={plantMood}
            disabled={!moodInput.trim()}
            size="lg"
            className="px-8 bg-black text-white hover:bg-black/90 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Plant it
          </Button>
        </div>
      </div>
    </Card>
  );

  const PlantingAnimation = () => (
    <Card className="p-8 border-0 shadow-soft relative overflow-hidden rounded-xl">
      <div className="text-center">
        {/* Planting text - appears after delay */}
        <div className="animate-[textAppear_5s_ease-in_forwards]">
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            Planting seeds of "{currentPlant?.mood}"...
          </h3>
          <p className="text-muted-foreground font-sans mb-6">Watch your mood blossom and grow</p>
        </div>
        
        <div className="relative h-80 mb-8">
          {/* 2D side view pot */}
          <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-amber-600 z-10"></div>
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-amber-700 rounded-b-full z-10"></div>

          





            


          {/* Seed dropping into pot - appears after text */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 animate-[seedAppear_5s_ease-in_forwards]">
            {/* Acorn-style seed matching entry screen */}
            <div className="relative w-8 h-6 mx-auto">
              {/* Main seed body */}
              <div className="w-6 h-4 bg-amber-800 rounded-full shadow-md transform rotate-12"></div>
              {/* Seed highlight */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-amber-400 rounded-full"></div>
              {/* Seed texture */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-0.5 bg-amber-900 rounded-full"></div>
            </div>
          </div>

          {/* Pot planting effect - appears when seed lands */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-[plant_5s_ease-in_forwards]">
            <div className="w-6 h-3 bg-amber-200 rounded-full opacity-0"></div>
          </div>

          {/* Whimsical magical effects that appear when seed lands */}
          <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 animate-[sparkles_5s_ease-in_forwards] pointer-events-none">
            {/* Whimsical sparkles around rim */}
            <div className="absolute -top-2 -left-16 text-yellow-300 text-lg animate-bounce">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="absolute -top-4 -right-12 text-blue-300 text-sm animate-ping">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
              </svg>
            </div>
            <div className="absolute -top-1 left-16 text-green-300 text-base animate-bounce">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="absolute -top-3 right-16 text-purple-300 text-lg animate-ping">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
              </svg>
            </div>
            <div className="absolute -top-2 left-12 text-pink-300 text-sm animate-bounce">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            
            {/* More whimsical elements */}
            <div className="absolute -top-6 -left-20 text-yellow-400 text-xl animate-pulse">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="absolute -top-8 -right-16 text-blue-400 text-lg animate-bounce">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
              </svg>
            </div>
            <div className="absolute -top-4 left-20 text-green-400 text-base animate-ping">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="absolute -top-6 right-20 text-purple-400 text-xl animate-bounce">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
              </svg>
            </div>
            <div className="absolute -top-3 left-16 text-pink-400 text-lg animate-pulse">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            
            {/* Whimsical floating elements */}
            <div className="absolute -top-1 -left-18 w-2 h-2 bg-yellow-300 rounded-full animate-bounce opacity-80"></div>
            <div className="absolute -top-5 -right-14 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping opacity-70"></div>
            <div className="absolute -top-2 left-18 w-2.5 h-2.5 bg-green-300 rounded-full animate-bounce opacity-90"></div>
            <div className="absolute -top-4 right-18 w-1 h-1 bg-purple-300 rounded-full animate-pulse opacity-60"></div>
            <div className="absolute -top-3 left-14 w-3 h-3 bg-pink-300 rounded-full animate-bounce opacity-80"></div>
            
            {/* Extra whimsical touches - brand-friendly icons */}
            <div className="absolute -top-10 left-0 text-orange-300 text-base animate-ping">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
              </svg>
            </div>
            <div className="absolute -top-12 -right-8 text-teal-300 text-lg animate-bounce">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="absolute -top-8 left-8 text-indigo-300 text-sm animate-pulse">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M6 30a26 26 0 0 1 52 0" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 30a20 20 0 0 1 40 0" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M18 30a14 14 0 0 1 28 0" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="absolute -top-14 right-4 text-rose-300 text-base animate-bounce">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="absolute -top-16 left-4 text-cyan-300 text-lg animate-ping">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/>
              </svg>
            </div>
          </div>

          {/* Glowing pot effect */}
          <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-amber-600 z-10 animate-[glow_5s_ease-in_forwards]"></div>
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-amber-700 rounded-b-full z-10 animate-[glow_5s_ease-in_forwards]"></div>




          <div className="absolute top-16 left-12 w-3 h-3 bg-yellow-200 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-24 right-16 w-2 h-2 bg-blue-200 rounded-full animate-bounce opacity-70"></div>
          <div className="absolute top-48 left-20 w-2.5 h-2.5 bg-green-200 rounded-full animate-pulse opacity-50"></div>
          <div className="absolute top-72 right-24 w-3 h-3 bg-purple-200 rounded-full animate-bounce opacity-60"></div>


        </div>

        {/* Custom CSS for animations */}
        <style>{`
          @keyframes textAppear {
            0% { opacity: 0; transform: translateY(-20px); }
            20% { opacity: 1; transform: translateY(0); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes seedAppear {
            0% { opacity: 0; transform: translateY(0) rotate(12deg) scale(1); }
            10% { opacity: 1; transform: translateY(0) rotate(12deg) scale(1); }
            20% { transform: translateY(60px) rotate(45deg) scale(1.1); opacity: 1; }
            30% { transform: translateY(100px) rotate(90deg) scale(0.9); opacity: 1; }
            40% { transform: translateY(140px) rotate(180deg) scale(1); opacity: 1; }
            80% { transform: translateY(140px) rotate(180deg) scale(0.9); opacity: 0.9; }
            100% { transform: translateY(140px) rotate(180deg) scale(0.7); opacity: 0.7; }
          }
          
          @keyframes plant {
            0% { opacity: 0; transform: scale(0.5); }
            60% { opacity: 0; transform: scale(0.5); }
            80% { opacity: 0.8; transform: scale(1.2); }
            100% { opacity: 0.6; transform: scale(1); }
          }
          
          @keyframes sparkles {
            0% { opacity: 0; transform: scale(0.5) rotate(0deg); }
            25% { opacity: 0; transform: scale(0.5) rotate(0deg); }
            30% { opacity: 1; transform: scale(1.2) rotate(180deg); }
            50% { opacity: 0.9; transform: scale(0.8) rotate(360deg); }
            70% { opacity: 1; transform: scale(1.1) rotate(540deg); }
            100% { opacity: 0.8; transform: scale(1.1) rotate(720deg); }
          }
          
          @keyframes glow {
            0% { filter: brightness(1); }
            25% { filter: brightness(1); }
            30% { filter: brightness(1.3) drop-shadow(0 0 10px rgba(245, 158, 11, 0.6)); }
            100% { filter: brightness(1.1) drop-shadow(0 0 8px rgba(245, 158, 11, 0.4)); }
          }
          
          @keyframes sway {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(2deg); }
            50% { transform: rotate(0deg); }
            75% { transform: rotate(-2deg); }
            100% { transform: rotate(0deg); }
          }
          
          @keyframes swirl {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(20px, -20px) rotate(90deg); }
            50% { transform: translate(0, -40px) rotate(180deg); }
            75% { transform: translate(-20px, -20px) rotate(270deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
          }
          
          @keyframes swirl_reverse {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(-20px, -20px) rotate(-90deg); }
            50% { transform: translate(0, -40px) rotate(-180deg); }
            75% { transform: translate(20px, -20px) rotate(-270deg); }
            100% { transform: translate(0, 0) rotate(-360deg); }
          }
          
          @keyframes flap {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.8); }
          }
        `}</style>
      </div>
    </Card>
  );

  const GardenView = () => (
    <Card className="p-8 border-0 shadow-soft relative overflow-hidden rounded-xl">
      {/* Tab navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setCurrentView("entry")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              currentView === "entry" 
                ? "bg-white text-black shadow-sm" 
                : "text-gray-600 hover:text-black"
            }`}
          >
            Plant New Mood
          </button>
          <button
            onClick={() => setCurrentView("garden")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              currentView === "garden" 
                ? "bg-white text-black shadow-sm" 
                : "text-gray-600 hover:text-black"
            }`}
          >
            View Garden
          </button>
        </div>
      </div>

      {/* Garden display */}
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          {plants.length === 0 ? "Plant your first mood to start growing" : `${plants.length} mood${plants.length === 1 ? '' : 's'} growing`}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          You can plant up to 2 moods per day
        </p>
      </div>

        {plants.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {plants.map((plant) => (
              <div
                key={plant.id}
                className={`p-4 rounded-xl border-2 border-border transition-all duration-300 hover:scale-105 ${plant.color} relative overflow-hidden`}
              >
                {/* Soil background */}
                <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-900 opacity-20 rounded-xl"></div>
                
                {/* Seed icon - 3 growing states */}
                <div className="relative z-10 text-center mb-4">
                  <div 
                    className={`relative w-12 h-10 mx-auto animate-[sway_3s_ease-in-out_infinite] ${
                      (() => {
                        const today = new Date();
                        const plantDate = new Date(plant.timestamp);
                        return today.getFullYear() === plantDate.getFullYear() &&
                               today.getMonth() === plantDate.getMonth() &&
                               today.getDate() === plantDate.getDate();
                      })()
                        ? 'cursor-pointer hover:scale-110 transition-transform duration-200 border-2 border-dashed border-transparent hover:border-gray-400' 
                        : ''
                    }`}
                    onClick={() => {
                      console.log('Seed clicked!', plant.mood, new Date().toDateString(), new Date(plant.timestamp).toDateString());
                      handleSeedClick(plant);
                    }}
                    style={{ 
                      minHeight: '40px',
                      minWidth: '48px'
                    }}
                  >
                    {/* Outlined pencil icon for journalable seeds */}
                    {(() => {
                      const today = new Date();
                      const plantDate = new Date(plant.timestamp);
                      return today.getFullYear() === plantDate.getFullYear() &&
                             today.getMonth() === plantDate.getMonth() &&
                             today.getDate() === plantDate.getDate();
                    })() && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 text-muted-foreground opacity-60">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </div>
                    )}
                    {/* State 1: Seed (default) */}
                    <div className={`absolute inset-0 transition-all duration-500 ${plant.growthStage === 1 ? 'opacity-100' : 'opacity-0'}`}>
                      {/* Main seed border - changes with mood */}
                      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-8 rounded-lg border-2 shadow-sm ${plant.color.replace('bg-', 'bg-')} ${plant.color.replace('bg-', 'border-').replace('-100', '-300')}`}></div>
                      {/* Seed body */}
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-5 bg-amber-800 rounded-full"></div>
                      {/* Seed cap */}
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-5 h-2.5 bg-green-700 rounded-full"></div>
                      {/* Seed stem */}
                      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-0.5 h-1.5 bg-green-800 rounded-sm"></div>
                    </div>
                    
                    {/* State 2: Sprout */}
                    <div className={`absolute inset-0 transition-all duration-500 ${plant.growthStage === 2 ? 'opacity-100' : 'opacity-0'}`}>
                      {/* Soil base */}
                      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-8 rounded-lg border-2 shadow-sm ${plant.color.replace('bg-', 'bg-')} ${plant.color.replace('bg-', 'border-').replace('-100', '-300')}`}></div>
                      {/* Sprout stem */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-green-600 rounded-full"></div>
                      {/* Sprout leaves */}
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-green-500 rounded-full"></div>
                      <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 w-2 h-1.5 bg-green-400 rounded-full"></div>
                    </div>
                    
                    {/* State 3: Blooming flower - mood-specific designs */}
                    <div className={`absolute inset-0 transition-all duration-500 ${plant.growthStage === 3 ? 'opacity-100' : 'opacity-0'}`}>
                      {/* Soil base */}
                      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-8 rounded-lg border-2 shadow-sm ${plant.color.replace('bg-', 'bg-')} ${plant.color.replace('bg-', 'border-').replace('-100', '-300')}`}></div>
                      {/* Plant stem */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-green-600 rounded-full"></div>
                      
                      {/* Joy - Sunflower */}
                      {plant.mood === 'joy' && (
                        <>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full"></div>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-300 rounded-full"></div>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-amber-600 rounded-full"></div>
                        </>
                      )}
                      
                      {/* Calm - Bluebell */}
                      {plant.mood === 'calm' && (
                        <>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-4 h-5 bg-blue-400 rounded-t-full"></div>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-blue-300 rounded-t-full"></div>
                        </>
                      )}
                      
                      {/* Love - Red Rose */}
                      {plant.mood === 'love' && (
                        <>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-red-500 rounded-full"></div>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-red-300 rounded-full"></div>
                        </>
                      )}
                      
                      {/* Fear - Purple Iris */}
                      {plant.mood === 'fear' && (
                        <>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-5 h-6 bg-purple-400 rounded-t-full"></div>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-3 h-4 bg-purple-300 rounded-t-full"></div>
                        </>
                      )}
                      
                      {/* Growth - Green Fern */}
                      {plant.mood === 'growth' && (
                        <>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-green-500 rounded-full"></div>
                          <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-green-400 rounded-full"></div>
                          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-5 h-2 bg-green-300 rounded-full"></div>
                        </>
                      )}
                      
                      {/* Peace - Teal Lotus */}
                      {plant.mood === 'peace' && (
                        <>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-teal-400 rounded-full"></div>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-teal-300 rounded-full"></div>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-teal-500 rounded-full"></div>
                        </>
                      )}
                      
                      {/* Hope - Lime Sparkle */}
                      {plant.mood === 'hope' && (
                        <>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-lime-400 rounded-full opacity-80"></div>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-lime-300 rounded-full opacity-90"></div>
                        </>
                      )}
                      
                      {/* Gentle - Pink Cherry Blossom */}
                      {plant.mood === 'gentle' && (
                        <>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-pink-300 rounded-full opacity-80"></div>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-pink-200 rounded-full opacity-90"></div>
                        </>
                      )}
                      
                      {/* Anxiety - Orange Daisy */}
                      {plant.mood === 'anxiety' && (
                        <>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-orange-400 rounded-full"></div>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-orange-300 rounded-full"></div>
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Growth indicator */}
                  <div className="text-xs text-muted-foreground mt-1">
                    {plant.growthStage === 1 ? 'Seed' : plant.growthStage === 2 ? 'Sprout' : 'Bloom'}
                  </div>
                  

                </div>
                
                                {/* Mood text */}
                <div className="relative z-10 text-center w-full">
                  <div className={`text-sm font-medium mb-2 capitalize ${plant.mood === 'joy' ? 'text-yellow-600' : plant.mood === 'calm' ? 'text-blue-600' : plant.mood === 'love' ? 'text-red-600' : plant.mood === 'growth' ? 'text-green-600' : plant.mood === 'fear' ? 'text-purple-600' : plant.mood === 'peace' ? 'text-teal-600' : plant.mood === 'hope' ? 'text-lime-600' : plant.mood === 'gentle' ? 'text-pink-600' : plant.mood === 'anxiety' ? 'text-orange-600' : 'text-foreground'}`}>{plant.mood}</div>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground w-full">
                    {/* Day/Night indicator */}
                    {(() => {
                      const plantDate = new Date(plant.timestamp);
                      const hour = plantDate.getHours();
                      const isDay = hour >= 6 && hour < 18;
                      return (
                        <span className="text-xs">
                          {isDay ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-yellow-500">
                              <circle cx="12" cy="12" r="5"/>
                              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-blue-400">
                              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                            </svg>
                          )}
                        </span>
                      );
                    })()}
                    {new Date(plant.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Swirling butterflies */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Butterfly 1 - Large swirl */}
        <div className="absolute top-8 right-12 animate-[swirl_8s_linear_infinite]">
          <div className="animate-[flap_0.3s_ease-in-out_infinite] w-6 h-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-purple-400">
              {/* Left wing */}
              <path d="M12 12 Q6 6 2 12 Q6 18 12 12" />
              {/* Right wing */}
              <path d="M12 12 Q18 6 22 12 Q18 18 12 12" />
              {/* Body */}
              <line x1="12" y1="8" x2="12" y2="16" />
              {/* Antennae */}
              <path d="M12 8 Q10 6 9 5" />
              <path d="M12 8 Q14 6 15 5" />
            </svg>
          </div>
        </div>
        
        {/* Butterfly 2 - Medium swirl */}
        <div className="absolute top-20 left-16 animate-[swirl_reverse_6s_linear_infinite]">
          <div className="animate-[flap_0.4s_ease-in-out_infinite] w-5 h-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-pink-300">
              {/* Left wing */}
              <path d="M12 12 Q6 6 2 12 Q6 18 12 12" />
              {/* Right wing */}
              <path d="M12 12 Q18 6 22 12 Q18 18 12 12" />
              {/* Body */}
              <line x1="12" y1="8" x2="12" y2="16" />
              {/* Antennae */}
              <path d="M12 8 Q10 6 9 5" />
              <path d="M12 8 Q14 6 15 5" />
            </svg>
          </div>
        </div>
        
        {/* Butterfly 3 - Small swirl */}
        <div className="absolute bottom-16 right-20 animate-[swirl_10s_linear_infinite]">
          <div className="animate-[flap_0.5s_ease-in-out_infinite] w-4 h-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-blue-300">
              {/* Left wing */}
              <path d="M12 12 Q6 6 2 12 Q6 18 12 12" />
              {/* Right wing */}
              <path d="M12 12 Q18 6 22 12 Q18 18 12 12" />
              {/* Body */}
              <line x1="12" y1="8" x2="12" y2="16" />
              {/* Antennae */}
              <path d="M12 8 Q10 6 9 5" />
              <path d="M12 8 Q14 6 15 5" />
            </svg>
          </div>
        </div>
        
        {/* Butterfly 4 - Diagonal swirl */}
        <div className="absolute top-32 right-8 animate-[swirl_reverse_7s_linear_infinite]">
          <div className="animate-[flap_0.35s_ease-in-out_infinite] w-5 h-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-green-300">
              {/* Left wing */}
              <path d="M12 12 Q6 6 2 12 Q6 18 12 12" />
              {/* Right wing */}
              <path d="M12 12 Q18 6 22 12 Q18 18 12 12" />
              {/* Body */}
              <line x1="12" y1="8" x2="12" y2="16" />
              {/* Antennae */}
              <path d="M12 8 Q10 6 9 5" />
              <path d="M12 8 Q14 6 15 5" />
            </svg>
          </div>
        </div>
        
        {/* Butterfly 5 - Floating swirl */}
        <div className="absolute bottom-8 left-12 animate-[swirl_9s_linear_infinite]">
          <div className="animate-[flap_0.45s_ease-in-out_infinite] w-4 h-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-yellow-300">
              {/* Left wing */}
              <path d="M12 12 Q6 6 2 12 Q6 18 12 12" />
              {/* Right wing */}
              <path d="M12 12 Q18 6 22 12 Q18 18 12 12" />
              {/* Body */}
              <line x1="12" y1="8" x2="12" y2="16" />
              {/* Antennae */}
              <path d="M12 8 Q10 6 9 5" />
              <path d="M12 8 Q14 6 15 5" />
            </svg>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen text-foreground">
      <ActivityHeader 
        onBack={onBack}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={toggleMusic}
        onRandomActivity={() => {
          const activities = ["colorBreathing", "doodlePlay", "compliments", "creative", "moodGarden", "soundShapes"];
          const randomActivity = activities[Math.floor(Math.random() * activities.length)];
          // Navigate to random activity
          if (randomActivity === "moodGarden") {
            // Stay on current page but reset state
            setCurrentView("entry");
            setMoodInput("");
          } else {
            // Navigate to different activity
            onBack();
            // Note: The parent component will handle the actual navigation
          }
        }}
      />
      
      {/* Hidden audio element */}
      <audio ref={audioRef} src="/audio/bg-music.mp3" preload="auto" loop className="hidden" />

      {/* Title Section - Same structure as homepage */}
      <section className="px-6 lg:px-8 mt-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-recoleta text-3xl sm:text-4xl tracking-tight mb-2 text-foreground">
            Mood Garden
          </h1>
          <p className="font-jakarta text-sm mb-6 text-foreground/70 leading-relaxed">Plant your first mood to start growing</p>
        </div>
      </section>

      {/* Main Content Section - Same structure as homepage */}
      <section className="px-6 lg:px-8 pb-12 pt-6">
        <div className="mx-auto max-w-5xl">
          {currentView === "entry" && <EntryScreen />}
          {currentView === "planting" && <PlantingAnimation />}
          {currentView === "garden" && <GardenView />}
        </div>
      </section>

      {/* Journal Modal */}
      {showJournal && selectedPlant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 border-0 shadow-soft relative overflow-hidden rounded-xl">
            <div className="text-center mb-6">
              <h3 className="text-xl font-heading font-semibold mb-2 text-foreground">
                Journal about your {selectedPlant.mood}
              </h3>
              <div className="flex items-center justify-center gap-3 mb-2">
                {/* Day/Night indicator */}
                {(() => {
                  const plantDate = new Date(selectedPlant.timestamp);
                  const hour = plantDate.getHours();
                  const isDay = hour >= 6 && hour < 18;
                  return (
                    <span className="text-lg">
                      {isDay ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-yellow-500">
                          <circle cx="12" cy="12" r="5"/>
                          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-blue-400">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                      )}
                    </span>
                  );
                })()}
                <span className="text-sm text-muted-foreground">
                  {new Date(selectedPlant.timestamp).toLocaleDateString()} • {new Date(selectedPlant.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                How are you feeling about this mood today?
              </p>
            </div>
            
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your thoughts here..."
              className="w-full p-3 border border-border rounded-lg resize-none h-32 focus:outline-none focus:border-primary transition-colors"
            />
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setShowJournal(false);
                  setSelectedPlant(null);
                  setJournalEntry("");
                }}
                variant="outline"
                className="flex-1 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 rounded-xl font-medium"
              >
                Maybe Later
              </Button>
              <Button
                onClick={saveJournalEntry}
                disabled={!journalEntry.trim()}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
              >
                Plant My Thoughts 🌱
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
