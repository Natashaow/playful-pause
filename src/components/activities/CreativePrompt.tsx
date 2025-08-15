import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const BASE_PROMPTS = [
  "Draw five tiny shapes that feel like today. Now rearrange them into something unexpected.",
  "Give a mundane object (like a spoon) a superpower. Describe or doodle its first mission.",
  "Invent a new cloud type. What’s its name and what mood does it carry?",
  "Design a postcard from a place that doesn’t exist but should.",
  "Write a two‑line poem about a color you can’t quite name.",
  "Turn your to‑do list into a constellation. What connects the stars?",
  "Imagine a room where gravity works sideways. What’s on the walls?",
  "Create a secret symbol for ‘I’m taking a tiny break’. Sketch or describe it.",
];

const STORAGE_KEY = "pp_user_context";

function pickNewIndex(current: number, max: number) {
  if (max <= 1) return 0;
  let idx = Math.floor(Math.random() * max);
  while (idx === current) idx = Math.floor(Math.random() * max);
  return idx;
}

function personalizePrompt(base: string, context: string): string {
  const ctx = (context || "").toLowerCase();
  let tail = " Let the result stay small and satisfying on its own.";

  if (/stress|overwhelm|anxious|anxiety|busy/.test(ctx)) {
    tail = " Keep it gentle: soft lines, slow pacing, one calming color.";
  } else if (/nature|tree|trees|ocean|sea|sky|garden|outdoor|woods/.test(ctx)) {
    tail = " Bring nature in: leaves, clouds, or tiny waves as motifs.";
  } else if (/work|deadline|meeting|project|study|school/.test(ctx)) {
    tail = " Keep it bite‑sized: doable in under three minutes.";
  } else if (/playful|play|fun|whimsy|whimsical/.test(ctx)) {
    tail = " Add a playful twist: include a doodle character reacting.";
  } else if (/calm|quiet|soft|rest|slow|soothe|soothing/.test(ctx)) {
    tail = " Make it soothing: minimal shapes and soft gradients.";
  }

  return `${base} ${tail}`;
}

const SparkleDoodle = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M14 3l2.4 4.8L21 10l-4.6 2.2L14 17l-2.4-4.8L7 10l4.6-2.2L14 3z" fill="currentColor" opacity="0.9" />
    <path d="M6 16l1.2 2.4L10 19l-2.3 1.1L6 22l-1.1-1.9L2 19l2.9-.6L6 16zM22 16l1.2 2.4 2.8.6-2.3 1.1L22 22l-1.1-1.9L18.6 19l2.8-.6L22 16z" fill="currentColor" opacity="0.6" />
  </svg>
);

export const CreativePrompt = ({ onBack }: { onBack: () => void }) => {
  const [context, setContext] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [showContext, setShowContext] = useState<boolean>(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [animSeed, setAnimSeed] = useState(0);

  // Load saved context on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved != null) setContext(saved);
    } catch (_e) { void _e; }
  }, []);

  const personalized = useMemo(() => {
    return personalizePrompt(BASE_PROMPTS[currentIdx], context);
  }, [currentIdx, context]);

  const saveContext = () => {
    try {
      localStorage.setItem(STORAGE_KEY, context);
    } catch (_e) { void _e; }
    window.dispatchEvent(new CustomEvent("pp:userContextUpdated", { detail: { context } }));
    setCurrentIdx((i) => i);
    setAnimSeed((s) => s + 1);
  };

  const clearContext = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) { void _e; }
    setContext("");
    window.dispatchEvent(new CustomEvent("pp:userContextUpdated", { detail: { context: "" } }));
    setCurrentIdx((i) => i);
    setAnimSeed((s) => s + 1);
  };

  const newPrompt = () => {
    setCurrentIdx((i) => pickNewIndex(i, BASE_PROMPTS.length));
    setAnimSeed((s) => s + 1);
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(personalized);
    } catch (_e) { void _e; }
  };

  const copyResponse = async () => {
    try {
      await navigator.clipboard.writeText(response);
    } catch (_e) { void _e; }
  };

  // Soft header band gradient
  const headerGlowStyle = useMemo(() => ({
    background:
      "radial-gradient(60% 60% at 50% 10%, rgba(164, 234, 218, 0.55) 0%, transparent 70%)," +
      "radial-gradient(60% 50% at 50% 100%, rgba(255, 240, 252, 0.55) 0%, transparent 60%)",
    height: "96px",
  }) as React.CSSProperties, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Local animations */}
      <style>{`
        @keyframes prompt-fade-in { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
        .prompt-enter { animation: prompt-fade-in 420ms ease-out both }
      `}</style>

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

          {/* Current prompt */}
          <div className="mb-4">
            <div key={animSeed} className="prompt-enter relative flex items-start gap-3">
              <div className="text-primary mt-1"><SparkleDoodle /></div>
              <p className="text-lg font-jakarta leading-relaxed text-foreground">
                {personalized}
              </p>
            </div>
          </div>

          {/* Response box */}
          <div className="grid gap-3">
            <label htmlFor="response" className="text-sm text-muted-foreground font-jakarta">Your response</label>
            <Textarea
              id="response"
              aria-label="Type your response to the prompt"
              rows={6}
              placeholder="Write, doodle ideas in words, or describe what you’d make…"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
            <p className="text-xs text-muted-foreground font-jakarta">Your response isn’t sent anywhere.</p>

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
                Your context won’t be shown to anyone. It’s stored locally to suggest better prompts across the site.
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