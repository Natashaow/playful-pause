// src/lib/personalization.ts
export type Sticker = { name: 'cloud'|'star'|'moon'|'daisy'|'cat'|'lamp'|'paper-plane'|'clover'|'bird'|'kettle'; color: string };
export type WishRecord = { text: string; doodle: Sticker['name']; accent: string; tags: string[] };

export type PersonalizationState = {
  lastColor?: { name: string; hex: string; tags: string[] };
  colorCounts: Record<string, number>;
  lastWish?: WishRecord;
  stickerQueue: Sticker[];
  drawStats: { strokes: number; topColors: string[] };
  keywords: string[];                // from Creative Spark
  activityLog: string[];             // recent activity ids in order
  lastUpdated: number;
};

const KEY = 'pp_personalization_v1';

const DEFAULT_STATE: PersonalizationState = {
  colorCounts: {},
  stickerQueue: [],
  drawStats: { strokes: 0, topColors: [] },
  keywords: [],
  activityLog: [],
  lastUpdated: Date.now(),
};

export function loadState(): PersonalizationState {
  try { return { ...DEFAULT_STATE, ...(JSON.parse(localStorage.getItem(KEY) || '{}')) }; }
  catch { return { ...DEFAULT_STATE }; }
}

export function saveState(s: PersonalizationState) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); }
  catch { /* ignore localStorage errors */ }
}

function emit() {
  try { window.dispatchEvent(new CustomEvent('pp:stateUpdated')); } catch { /* ignore event errors */ }
}

export function updateState(patch: Partial<PersonalizationState>) {
  const s = loadState();
  const next = { ...s, ...patch, lastUpdated: Date.now() };
  saveState(next); emit(); return next;
}

export function logActivity(id: 'colorBreathing'|'wishes'|'doodlePlay'|'creative') {
  const s = loadState();
  const log = [...s.activityLog, id].slice(-20);
  updateState({ activityLog: log });
}

export function recordColorUse(color: { name: string; hex: string; tags: string[] }) {
  const s = loadState();
  const colorCounts = { ...s.colorCounts, [color.name]: (s.colorCounts[color.name] || 0) + 1 };
  updateState({ lastColor: color, colorCounts });
}

export function recordWish(rec: WishRecord) {
  updateState({ lastWish: rec });
}

export function pushSticker(st: Sticker) {
  const s = loadState();
  updateState({ stickerQueue: [...s.stickerQueue, st] });
}

export function popSticker(): Sticker | undefined {
  const s = loadState();
  const q = [...s.stickerQueue];
  const v = q.shift();
  updateState({ stickerQueue: q }); 
  return v;
}

export function recordDrawStroke(hex: string) {
  const s = loadState();
  // naive "topColors": keep last 6 unique-ish by recency
  const tc = [hex, ...s.drawStats.topColors.filter(c => c !== hex)].slice(0,6);
  updateState({ drawStats: { strokes: s.drawStats.strokes + 1, topColors: tc }});
}

export function recordKeywords(words: string[]) {
  updateState({ keywords: words.slice(0, 12) });
}