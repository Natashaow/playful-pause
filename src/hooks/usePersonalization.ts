// src/hooks/usePersonalization.ts
import { useEffect, useState } from "react";
import { loadState, PersonalizationState } from "@/lib/personalization";

export function usePersonalization() {
  const [state, setState] = useState<PersonalizationState>(loadState());
  useEffect(() => {
    const h = () => setState(loadState());
    window.addEventListener('pp:stateUpdated', h);
    return () => window.removeEventListener('pp:stateUpdated', h);
  }, []);
  return state;
}