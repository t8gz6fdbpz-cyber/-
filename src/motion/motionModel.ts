export type MotionChoice = "system" | "full" | "reduced";
export const MOTION_STORAGE_KEY = "portfolio-motion-preference";

export function normalizeMotionChoice(value: unknown): MotionChoice {
  return value === "full" || value === "reduced" ? value : "system";
}

/** URL reading mode wins until the visitor explicitly changes the control. */
export function resolveMotionPreference(choice: MotionChoice, systemReduced: boolean, queryReduced: boolean) {
  const source = queryReduced ? "link" : choice === "system" ? "system" : "visitor";
  const reduced = queryReduced || choice === "reduced" || (choice === "system" && systemReduced);
  return { reduced, source } as const;
}

export function readMotionChoice(storage: Pick<Storage, "getItem">): MotionChoice {
  try { return normalizeMotionChoice(storage.getItem(MOTION_STORAGE_KEY)); }
  catch { return "system"; }
}

export function saveMotionChoice(storage: Pick<Storage, "setItem" | "removeItem">, choice: MotionChoice): boolean {
  try {
    if (choice === "system") storage.removeItem(MOTION_STORAGE_KEY);
    else storage.setItem(MOTION_STORAGE_KEY, choice);
    return true;
  } catch { return false; }
}
