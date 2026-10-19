import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { MOTION_STORAGE_KEY, normalizeMotionChoice, readMotionChoice, resolveMotionPreference, saveMotionChoice, type MotionChoice } from "./motionModel";

type Preference = {
  choice: MotionChoice;
  reduced: boolean;
  systemReduced: boolean;
  queryReduced: boolean;
  source: "link" | "system" | "visitor";
  saved: boolean;
  setChoice: (choice: MotionChoice) => void;
};
const PreferenceContext = createContext<Preference>({ choice: "system", reduced: false, systemReduced: false, queryReduced: false, source: "system", saved: true, setChoice: () => undefined });

const initialChoice = () => {
  try { return typeof window === "undefined" ? "system" as const : readMotionChoice(window.localStorage); }
  catch { return "system" as const; }
};
const initialSystem = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [choice, updateChoice] = useState<MotionChoice>(initialChoice);
  const [systemReduced, updateSystem] = useState(initialSystem);
  const [saved, updateSaved] = useState(true);
  const queryReduced = new URLSearchParams(location.search).get("motion") === "reduce";
  const { reduced, source } = resolveMotionPreference(choice, systemReduced, queryReduced);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => updateSystem(query.matches);
    sync();
    if (query.addEventListener) query.addEventListener("change", sync);
    else query.addListener(sync);
    const onStorage = (event: StorageEvent) => {
      if (event.key === MOTION_STORAGE_KEY || event.key === null) {
        updateChoice(normalizeMotionChoice(event.newValue));
        updateSaved(true);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      if (query.removeEventListener) query.removeEventListener("change", sync);
      else query.removeListener(sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // CSS and every animation runtime use the same resolved state, before paint.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.motion = reduced ? "reduce" : "full";
    root.dataset.motionPreference = choice;
    root.dataset.motionSource = source;
  }, [choice, reduced, source]);

  const setChoice = useCallback((next: MotionChoice) => {
    updateChoice(next);
    try { updateSaved(saveMotionChoice(window.localStorage, next)); }
    catch { updateSaved(false); }
    if (queryReduced) {
      const search = new URLSearchParams(location.search);
      search.delete("motion");
      navigate({ pathname: location.pathname, search: search.toString(), hash: location.hash }, {
        replace: true, preventScrollReset: true,
        state: { ...location.state, motionPreferenceOnly: true },
      });
    }
  }, [location, navigate, queryReduced]);
  const value = useMemo(() => ({ choice, reduced, systemReduced, queryReduced, source, saved, setChoice }), [choice, reduced, systemReduced, queryReduced, source, saved, setChoice]);
  return <PreferenceContext.Provider value={value}><MotionConfig reducedMotion={reduced ? "always" : "never"}>{children}</MotionConfig></PreferenceContext.Provider>;
}

export const useMotionPreference = () => useContext(PreferenceContext);
export const useSiteReducedMotion = () => useMotionPreference().reduced;
