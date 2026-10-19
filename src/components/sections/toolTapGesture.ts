type PointerSample = { pointerId: number; clientX: number; clientY: number };

/** One shared recognizer for the DOM hit targets. It never captures or prevents
 * pointer events, so the browser retains vertical scrolling and pinch gestures. */
export function createToolTapGesture() {
  const pointers = new Set<number>();
  let candidate: (PointerSample & { toolId: string; cancelled: boolean }) | null = null;
  let completed: string | null = null;
  const move = (event: PointerSample) => {
    if (candidate?.pointerId === event.pointerId &&
      Math.hypot(event.clientX - candidate.clientX, event.clientY - candidate.clientY) > 10) {
      candidate.cancelled = true;
    }
  };
  return {
    down(event: PointerSample & { isPrimary: boolean; button: number }, toolId: string | null) {
      pointers.add(event.pointerId);
      completed = null;
      if (pointers.size > 1 || !event.isPrimary) {
        if (candidate) candidate.cancelled = true;
        return;
      }
      candidate = toolId && event.button === 0 ? { pointerId: event.pointerId,
        clientX: event.clientX, clientY: event.clientY, toolId, cancelled: false } : null;
    },
    move,
    up(event: PointerSample) {
      move(event);
      if (candidate?.pointerId === event.pointerId) {
        completed = !candidate.cancelled && pointers.size === 1 ? candidate.toolId : null;
        candidate = null;
      }
      pointers.delete(event.pointerId);
    },
    cancelPointer(event: PointerSample) { candidate = null; completed = null; pointers.delete(event.pointerId); },
    reset() { candidate = null; completed = null; pointers.clear(); },
    consume(toolId: string, keyboard: boolean) {
      const accepted = keyboard || completed === toolId;
      completed = null;
      return accepted;
    },
  };
}
