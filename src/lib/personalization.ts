export type Personalization = {
  context: string;          // pp:personalContext
  lastSpark: string;        // pp:creativeSpark:response
};

export function readPersonalization(): Personalization {
  const context = (localStorage.getItem("pp:personalContext") || "").trim();
  const lastSpark = (localStorage.getItem("pp:creativeSpark:response") || "").trim();
  return { context, lastSpark };
}

export function moodHints(context: string) {
  const lc = context.toLowerCase();
  return {
    isTired: /tired|exhaust|sleepy|weary/.test(lc),
    isStressed: /stress|anxious|overwhelm|busy|rushed/.test(lc),
    isBlue: /sad|blue|down|lonely|melancholy/.test(lc),
    isUp: /good|calm|peace|grateful|happy|light|joyful/.test(lc),
  };
}