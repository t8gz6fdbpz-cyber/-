import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useMotionPreference } from "../../motion/MotionPreference";
import type { MotionChoice } from "../../motion/motionModel";
import "./MotionPreferences.css";

const choices: { value: MotionChoice; label: string }[] = [
  { value: "system", label: "跟随系统" },
  { value: "full", label: "完整动效" },
  { value: "reduced", label: "简化动效" },
];

export function MotionPreferences() {
  const { choice, reduced, source, saved, queryReduced, setChoice } = useMotionPreference();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", closeOutside);
    return () => window.removeEventListener("pointerdown", closeOutside);
  }, [open]);
  const mode = reduced ? "简化" : "完整";
  return <aside ref={root} className="motion-preferences" aria-label="动效偏好" onKeyDown={event => {
    if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
  }}>
    {open && <div className="motion-preferences-panel" id="motion-preferences-panel">
      <fieldset><legend>动效设置</legend>{choices.map(option => <label key={option.value}>
        <input type="radio" name="site-motion" value={option.value} checked={(queryReduced ? "reduced" : choice) === option.value} onChange={() => setChoice(option.value)} onClick={() => {
          // The URL may already check this radio. Selecting it still saves the
          // visitor's preference and removes the temporary link override.
          if (queryReduced && option.value === "reduced") setChoice("reduced");
        }} />
        <span>{option.label}</span>
      </label>)}</fieldset>
      <p role="status">当前：{mode}动效{source === "system" ? "（跟随系统）" : source === "link" ? "（此链接指定）" : ""}{!saved && " · 仅本次访问生效"}</p>
      <button type="button" className="motion-preferences-close" onClick={() => { setOpen(false); trigger.current?.focus(); }}>收起设置</button>
    </div>}
    <div className="motion-preferences-actions">
      <button ref={trigger} type="button" className="motion-preferences-trigger" aria-expanded={open} aria-controls="motion-preferences-panel" onClick={() => setOpen(value => !value)}><SlidersHorizontal size={15} aria-hidden="true" /><span>动效：{mode}</span></button>
      {reduced && source === "system" && <button type="button" className="motion-preferences-enable" onClick={() => setChoice("full")}>开启完整动效</button>}
    </div>
  </aside>;
}
