import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const PROMPTS = [
  "Describe a tiny, imaginary place you'd visit if you could shrink to the size of a teacup.",
  "Invent a weather forecast for a magical town (e.g., 'sprinkles of joy, occasional cloud of curiosity').",
  "If your day were a small creature, what would it look like and what would it carry?",
  "Name a color that doesn't exist yet and describe what it feels like.",
  "Imagine a mini celebration happening on your desk right now — what's it for?",
  "Turn a household object into a character. What's its secret talent?",
  "Write a postcard from a dream you half-remember.",
  "If calmness had a taste and a texture, what would it be?",
  "Describe a cloud you'd keep in a jar and when you'd let it out.",
  "What would the moon write to you if it could send letters?",
  "Your favorite cup has a hidden superpower — what is it?",
  "Invent a tiny festival only two people know about.",
  "Turn a sound you love into a little visual scene.",
  "Imagine a library of scents — what's the book you'd check out today?",
  "Give a name and story to the shadow you see right now."
];

const STORAGE_KEY = "pp_user_context";

type DoodleKind = 'letter' | 'cloud' | 'star' | 'sprout';

const Doodle: React.FC<{ kind: DoodleKind; className?: string }> = ({ kind, className }) => {
  const stroke = 'hsl(var(--foreground) / 0.6)';
  const fill   = 'hsl(var(--accent))';

  if (kind === 'letter') {
    return (
      <svg viewBox="0 0 64 48" className={className} aria-hidden>
        <rect x="6" y="10" width="52" height="30" rx="6" fill="white" stroke={stroke} strokeWidth="2" />
        <path d="M8 12l24 16L56 12" fill="none" stroke={stroke} strokeWidth="2" />
        <circle cx="50" cy="22" r="2" fill={fill} />
      </svg>
    );
  }
  if (kind === 'cloud') {
    return (
      <svg viewBox="0 0 72 40" className={className} aria-hidden>
        <ellipse cx="28" cy="22" rx="18" ry="12" fill="white" stroke={stroke} strokeWidth="2"/>
        <ellipse cx="44" cy="20" rx="14" ry="10" fill="white" stroke={stroke} strokeWidth="2"/>
        <circle cx="22" cy="18" r="2" fill={stroke} />
        <circle cx="30" cy="18" r="2" fill={stroke} />
        <path d="M24 24c4 2 8 2 12 0" stroke={stroke} strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    );
  }
  if (kind === 'star') {
    return (
      <svg viewBox="0 0 40 40" className={className} aria-hidden>
        <path d="M20 4l3.6 7.8 8.6.9-6.3 5.7 1.8 8.4L20 22.8 12.3 27l1.8-8.4-6.3-5.7 8.6-.9L20 4z"
              fill="white" stroke={stroke} strokeWidth="2"/>
      </svg>
    );
  }
  // sprout
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path d="M24 40V24" stroke={stroke} strokeWidth="2" strokeLinecap="round"/>
      <path d="M24 24c-4-8-12-8-16-6 6 2 8 8 10 10 2-2 4-4 6-4z" fill="white" stroke={stroke} strokeWidth="2"/>
      <path d="M24 24c4-8 12-8 16-6-6 2-8 8-10 10-2-2-4-4-6-4z" fill="white" stroke={stroke} strokeWidth="2"/>
    </svg>
  );
};

function pickDoodleFor(text: string): DoodleKind {
  const t = text.toLowerCase();
  if (t.includes('letter') || t.includes('postcard') || t.includes('write')) return 'letter';
  if (t.includes('cloud') || t.includes('sky') || t.includes('weather'))   return 'cloud';
  if (t.includes('festival') || t.includes('celebration') || t.includes('star')) return 'star';
  return 'sprout';
}

export const CreativePrompt = ({ onBack }: { onBack: () => void }) => {
  const [context, setContext] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [showContext, setShowContext] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>(PROMPTS[0]);
  const [pulseKey, setPulseKey] = useState<number>(0);
  const [doodle, setDoodle] = useState<DoodleKind>(pickDoodleFor(PROMPTS[0]));

  // Load saved context on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved != null) setContext(saved);
    } catch (_e) { void _e; }
  }, []);

  const saveContext = () => {
    try {
      localStorage.setItem(STORAGE_KEY, context);
    } catch (_e) { void _e; }
    window.dispatchEvent(new CustomEvent("pp:userContextUpdated", { detail: { context } }));
  };

  const clearContext = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) { void _e; }
    setContext("");
    window.dispatchEvent(new CustomEvent("pp:userContextUpdated", { detail: { context: "" } }));
  };

  const newPrompt = () => {
    const next = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setPrompt(next);
    setResponse('');
    setDoodle(pickDoodleFor(next));
    setPulseKey(k => k + 1); // re-trigger animation
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch (_e) { void _e; }
  };

  const copyResponse = async () => {
    try {
      await navigator.clipboard.writeText(response);
    } catch (_e) { void _e; }
  };

  // Soft header band gradient
  const headerGlowStyle = {
    background:
      "radial-gradient(60% 60% at 50% 10%, rgba(164, 234, 218, 0.55) 0%, transparent 70%)," +
      "radial-gradient(60% 50% at 50% 100%, rgba(255, 240, 252, 0.55) 0%, transparent 60%)",
    height: "96px",
  } as React.CSSProperties;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Button onClick={onBack} variant="ghost" className="mb-6" aria-label="Back to Activities">
        ← Back to Activities
      </Button>

      <Card className="p-0 border-0 shadow-soft overflow-hidden">
        <div className="relative p-6">
          <div aria-hidden className="absolute inset-x-0 top-0 -z-10" style={headerGlowStyle} />
          <div className="text-center mb-4">
            <h2 className="text-3xl font-recoleta font-bold mb-2 text-primary">Creative Spark</h2>
            <p className="text-muted-foreground font-jakarta">Let your imagination wander for a few minutes</p>
          </div>

          {/* Current prompt with doodle */}
          <div className="mb-4">
            <div key={`prompt-${pulseKey}`} className="flex items-start gap-3">
              <div className="relative">
                <Doodle key={`d-${pulseKey}`} kind={doodle} className="h-8 w-10 animate-letter-in" />
                <span className="pointer-events-none absolute -top-1 -right-2 size-2 rounded-full bg-accent/70 animate-twinkle" />
                <span className="pointer-events-none absolute top-4 -left-1 size-1.5 rounded-full bg-accent/50 animate-twinkle" />
              </div>

              <p key={`p-${pulseKey}`} className="text-lg sm:text-xl font-sans leading-7 animate-letter-in">
                {prompt}
              </p>
            </div>
          </div>

          {/* Response box */}
          <div className="grid gap-3">
            <label htmlFor="response" className="text-sm text-muted-foreground font-jakarta">Your response</label>
            <Textarea
              id="response"
              aria-label="Your response"
              rows={6}
              placeholder="Write, doodle ideas in words, or describe what you'd make…"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
            <p className="text-xs text-muted-foreground font-jakarta">Your response isn't sent anywhere.</p>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={newPrompt}>New prompt</Button>
              <Button variant="outline" onClick={copyPrompt}>Copy prompt</Button>
              <Button variant="secondary" onClick={copyResponse}>Copy response</Button>
              <Button onClick={() => setShowContext((v) => !v)} aria-expanded={showContext} aria-controls="personalize">
                {showContext ? "Hide personalize" : "Personalize prompts"}
              </Button>
            </div>
          </div>
        </div>

        {/* Optional personalization panel */}
        {showContext && (
          <div id="personalize" className="px-6 pb-6">
            <div className="grid gap-3">
              <label htmlFor="context" className="text-sm text-muted-foreground font-jakarta">Personal context (optional)</label>
              <Textarea
                id="context"
                rows={3}
                aria-label="Your personal context"
                placeholder="e.g., I love quiet mornings, plants, and soft pastel colors. Lately I feel a little overwhelmed but hopeful."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
              <p className="text-xs text-muted-foreground font-jakarta">
                Your context won't be shown to anyone. It's stored locally to suggest better prompts across the site.
              </p>

              <div className="flex flex-wrap gap-2">
                <Button onClick={saveContext} className="px-4">Save & refresh prompts</Button>
                <Button variant="secondary" onClick={clearContext}>Clear</Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};