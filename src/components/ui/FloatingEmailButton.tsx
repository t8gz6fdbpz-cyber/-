import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const CONTACT_NUMBER = "13999854204";

async function copyContactNumber() {
  try {
    await navigator.clipboard.writeText(CONTACT_NUMBER);
    return;
  } catch {
    // Compatibility fallback for browsers without Clipboard API permission.
    const input = document.createElement("textarea");
    const previousFocus = document.activeElement as HTMLElement | null;
    input.value = CONTACT_NUMBER;
    input.readOnly = true;
    input.style.cssText = "position:fixed;top:0;left:0;opacity:0;font-size:16px;pointer-events:none";
    document.body.appendChild(input);
    try {
      input.select();
      input.setSelectionRange(0, input.value.length);
      if (!document.execCommand("copy")) throw new Error("Copy unavailable");
    } finally {
      input.remove();
      previousFocus?.focus({ preventScroll: true });
    }
  }
}

export function FloatingEmailButton() {
  const location = useLocation();
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const [pulse, setPulse] = useState(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>();
  const request = useRef(0);
  const copying = useRef(false);

  useEffect(() => {
    setStatus("idle");
    return () => {
      clearTimeout(resetTimer.current);
      request.current += 1;
      copying.current = false;
    };
  }, [location.pathname]);

  async function handleCopy() {
    if (copying.current) return;
    copying.current = true;
    const operation = ++request.current;
    clearTimeout(resetTimer.current);
    setPulse(value => value + 1);
    let result: "copied" | "error" = "copied";
    try { await copyContactNumber(); } catch { result = "error"; }
    if (operation !== request.current) return;
    copying.current = false;
    setStatus(result);
    resetTimer.current = setTimeout(() => setStatus("idle"), 2400);
  }

  if (location.pathname !== "/") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`复制联系方式：${CONTACT_NUMBER}`}
      className="home-floating-email"
      data-state={status}
    >
      <span className="home-floating-email__message" aria-hidden="true">
        {status === "error" ? "复制失败，请重试" : "联系方式已复制"}
      </span>
      <span className="home-floating-email__icon" aria-hidden="true">
        <span key={pulse} className={`home-floating-email__symbol${pulse ? " is-copying" : ""}`}>
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M2 3C1.44772 3 1 3.44772 1 4V12C1 12.5523 1.44772 13 2 13H14C14.5523 13 15 12.5523 15 12V4C15 3.44772 14.5523 3 14 3H2ZM8.14981 8.95002L14 4.56238V6.43738L9.0498 10.15C8.42758 10.6167 7.57203 10.6167 6.9498 10.15L2 6.43767V4.56267L7.8498 8.95002C7.93869 9.01669 8.06092 9.01669 8.14981 8.95002Z" />
          </svg>
        </span>
      </span>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {status === "copied" ? "联系方式已复制" : status === "error" ? `复制失败，请手动复制：${CONTACT_NUMBER}` : ""}
      </span>
    </button>
  );
}
