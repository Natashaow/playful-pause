import React from 'react';
import { Button } from '@/components/ui/button';

interface ActivityHeaderProps {
  onBack: () => void;
  onRandomActivity: () => void;
  isMusicPlaying?: boolean;
  onToggleMusic?: () => void;
}

export function ActivityHeader({ 
  onBack, 
  onRandomActivity, 
  isMusicPlaying = false, 
  onToggleMusic 
}: ActivityHeaderProps) {
  return (
    <>
      {/* Header - Exact same as Homepage */}
      <header className="px-6 lg:px-8 pt-8">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onToggleMusic}
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
            {/* Hidden audio element. Place your file at public/audio/bg-music.mp3 */}
            <audio src="/audio/bg-music.mp3" preload="auto" loop className="hidden" />
            <span className="font-recoleta text-lg">Playful Pause</span>
          </div>
          <button
            onClick={onRandomActivity}
            className="hidden sm:inline-flex items-center rounded-lg bg-black px-4 py-2 font-jakarta text-sm font-medium text-white hover:bg-black/90 transition-all duration-200"
            title="Click for a surprise pause activity"
            aria-label="Start a random pause activity"
          >
            Surprise me
          </button>
        </div>
      </header>

      {/* Minimalistic Back Navigation - Aligned with logo */}
      <section className="px-6 lg:px-8 mt-6">
        <div className="mx-auto max-w-6xl">
          <button 
            onClick={onBack} 
            className="text-foreground/60 hover:text-foreground/80 transition-all duration-200 font-jakarta text-sm flex items-center gap-1 p-1"
            aria-label="Back to Activities"
          >
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              className=""
            >
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Activities
          </button>
        </div>
      </section>
    </>
  );
}
