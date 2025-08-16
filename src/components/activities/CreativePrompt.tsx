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

const LS_RESPONSE_KEY = "pp:creativeSpark:response";
const LS_CONTEXT_KEY = "pp:personalContext";

// Tiny doodle icon (firefly/wand)
const SparkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...props} aria-hidden>
    <path d="M12 2l1.5 3 3 1.5-3 1.5L12 11l-1.5-3-3-1.5 3-1.5L12 2Z" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="18.5" cy="16.5" r="2.5" fill="currentColor" opacity=".18" />
  </svg>
);

export const CreativePrompt = ({ onBack }: { onBack: () => void }) => {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const [showContext, setShowContext] = useState<boolean>(false);
  const [savedMsg, setSavedMsg] = useState<string>("");
  const [ctxSavedMsg, setCtxSavedMsg] = useState<string>("");

  // Load from localStorage
  useEffect(() => {
    try {
      const r = localStorage.getItem(LS_RESPONSE_KEY) ?? "";
      const c = localStorage.getItem(LS_CONTEXT_KEY) ?? "";
      setResponse(r);
      setContext(c);
    } catch (_e) { void _e; }
  }, []);

  // Use existing prompt generator if available; otherwise set a default
  useEffect(() => {
    if (!prompt) {
      setPrompt(PROMPTS[0]);
    }
  }, [prompt]);

  const saveResponse = () => {
    try {
      localStorage.setItem(LS_RESPONSE_KEY, response.trim());
      setSavedMsg("Saved!");
      setTimeout(() => setSavedMsg(""), 1500);
    } catch (_e) { void _e; }
  };

  const saveContext = () => {
    try {
      localStorage.setItem(LS_CONTEXT_KEY, context.trim());
      setCtxSavedMsg("Context saved");
      setTimeout(() => setCtxSavedMsg(""), 1500);
      window.dispatchEvent(new CustomEvent("pp:userContextUpdated", { detail: { context } }));
    } catch (_e) { void _e; }
  };

  const newPrompt = () => {
    const next = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setPrompt(next);
    setResponse('');
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

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Button onClick={onBack} variant="ghost" className="mb-6" aria-label="Back to Activities">
        ← Back to Activities
      </Button>

      <Card className="p-0 border-0 shadow-soft overflow-hidden">
        <div className="relative p-6 sm:p-8">
          {/* Header with icon and title */}
          <div className="mb-6 flex items-center gap-3">
            <SparkIcon className="text-primary" />
            <h1 className="font-heading text-3xl text-primary">Creative Spark</h1>
          </div>
          <p className="mb-6 font-sans text-muted-foreground">Let your imagination wander for a few minutes.</p>

          {/* Current prompt */}
          <div className="mb-4 rounded-2xl bg-card/70 p-4 ring-1 ring-border/60">
            <p className="font-sans text-[18px] leading-7 text-foreground">{prompt}</p>
          </div>

          {/* Response textarea */}
          <label htmlFor="spark-response" className="sr-only">Your response</label>
          <Textarea
            id="spark-response"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Write, doodle ideas in words, or describe what you'd make…"
            className="w-full min-h-[140px] rounded-2xl bg-card/80 p-4 font-sans text-[15px] text-foreground placeholder:text-muted-foreground/45 ring-1 ring-border/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />

          {/* Save response button */}
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={saveResponse} className="rounded-full px-5 py-2.5 font-sans text-sm font-semibold shadow-sm">
              ✨ Save my spark
            </Button>
            <span role="status" aria-live="polite" className="font-sans text-sm text-muted-foreground animate-rise-fade">
              {savedMsg}
            </span>
          </div>

          {/* Optional personalization */}
          <div className="mt-8">
            <button
              onClick={() => setShowContext((v) => !v)}
              className="font-sans text-sm text-muted-foreground underline-offset-2 hover:underline transition-colors"
            >
              {showContext ? "Hide personalization" : "Add a bit about your mood to personalize prompts"}
            </button>

            {showContext && (
              <div className="mt-3 rounded-2xl bg-card/70 p-4 ring-1 ring-border/60 animate-rise-fade">
                <label htmlFor="spark-context" className="sr-only">Personal context</label>
                <Textarea
                  id="spark-context"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="I'm feeling… (kept on your device to suggest better prompts)"
                  className="w-full min-h-[96px] rounded-xl bg-card/80 p-3 font-sans text-[15px] text-foreground placeholder:text-muted-foreground/45 ring-1 ring-border/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <div className="mt-3 flex items-center gap-3">
                  <Button onClick={saveContext} className="rounded-full px-4 py-2 font-sans text-sm font-semibold shadow-sm">
                    💫 Save context
                  </Button>
                  <span role="status" aria-live="polite" className="font-sans text-sm text-muted-foreground animate-rise-fade">
                    {ctxSavedMsg}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Secondary actions */}
          <div className="mt-8 flex flex-wrap gap-8">
            <button onClick={newPrompt} className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors">
              New prompt
            </button>
            <button onClick={copyPrompt} className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors">
              Copy prompt
            </button>
            <button onClick={copyResponse} className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors">
              Copy response
            </button>
          </div>

          <p className="mt-6 font-sans text-xs text-muted-foreground/70">Your text stays on your device.</p>
        </div>
      </Card>
    </div>
  );
};