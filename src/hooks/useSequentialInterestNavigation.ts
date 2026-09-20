import { useEffect, useRef } from "react";

export type SequentialDirection = "forward" | "backward";

const BOUNDARY_TOLERANCE = 2;
const WHEEL_GESTURE_GAP = 160;
const WHEEL_TRIGGER_DISTANCE = 90;
const TOUCH_TRIGGER_DISTANCE = 56;
const MINIMUM_INPUT_LOCK = 800;
const INPUT_IDLE_RELEASE = 180;

let residualInputTimer: number | null = null;
let residualInputLockUntil = 0;
let isTransitionLocked = false;

const releaseResidualInputLock = () => {
  window.removeEventListener("wheel", suppressResidualInput, true);
  window.removeEventListener("touchmove", suppressResidualInput, true);
  residualInputTimer = null;
  isTransitionLocked = false;
};

const scheduleResidualInputRelease = (delay: number) => {
  residualInputLockUntil = Math.max(residualInputLockUntil, performance.now() + delay);
  if (residualInputTimer !== null) window.clearTimeout(residualInputTimer);

  residualInputTimer = window.setTimeout(() => {
    const remainingTime = residualInputLockUntil - performance.now();
    if (remainingTime > 1) {
      scheduleResidualInputRelease(remainingTime);
      return;
    }

    releaseResidualInputLock();
  }, Math.max(0, residualInputLockUntil - performance.now()));
};

const suppressResidualInput = (event: Event) => {
  event.preventDefault();
  scheduleResidualInputRelease(INPUT_IDLE_RELEASE);
};

const lockResidualInput = () => {
  isTransitionLocked = true;
  window.addEventListener("wheel", suppressResidualInput, { passive: false, capture: true });
  window.addEventListener("touchmove", suppressResidualInput, { passive: false, capture: true });
  scheduleResidualInputRelease(MINIMUM_INPUT_LOCK);
};

const isAtDocumentTop = () => window.scrollY <= BOUNDARY_TOLERANCE;

const isAtDocumentBottom = () =>
  window.scrollY + window.innerHeight >=
  document.documentElement.scrollHeight - BOUNDARY_TOLERANCE;

const setInstantScroll = (top: number) => {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "auto" });
  root.style.scrollBehavior = previousBehavior;
};

export function useSequentialInterestNavigation({
  canNavigateBackward,
  canNavigateForward,
  entryDirection,
  onNavigate,
}: {
  canNavigateBackward: boolean;
  canNavigateForward: boolean;
  entryDirection: SequentialDirection | null;
  onNavigate: (direction: SequentialDirection) => void;
}) {
  const onNavigateRef = useRef(onNavigate);

  useEffect(() => {
    onNavigateRef.current = onNavigate;
  }, [onNavigate]);

  useEffect(() => {
    if (!entryDirection) return;

    const remainingLockTime = residualInputLockUntil - performance.now();
    if (remainingLockTime <= 0) return;

    let frameId = 0;
    const guardEntryBoundary = () => {
      const target = entryDirection === "forward"
        ? 0
        : document.documentElement.scrollHeight - window.innerHeight;

      if (Math.abs(window.scrollY - target) > BOUNDARY_TOLERANCE) {
        setInstantScroll(target);
      }

      if (performance.now() < residualInputLockUntil) {
        frameId = window.requestAnimationFrame(guardEntryBoundary);
      }
    };

    guardEntryBoundary();
    return () => window.cancelAnimationFrame(frameId);
  }, [entryDirection]);

  useEffect(() => {
    if (!canNavigateBackward && !canNavigateForward) return;

    const now = performance.now();
    let topReachedAt = isAtDocumentTop() ? now : 0;
    let bottomReachedAt = isAtDocumentBottom() ? now : 0;
    let wasAtTop = isAtDocumentTop();
    let wasAtBottom = isAtDocumentBottom();
    let activeWheelDirection: SequentialDirection | null = null;
    let lastWheelAt = 0;
    let wheelDistance = 0;
    let wheelGestureReady = false;
    let touchLastY = 0;
    let touchDistance = 0;
    let touchCanMoveBackward = false;
    let touchCanMoveForward = false;

    const resetWheelIntent = () => {
      activeWheelDirection = null;
      wheelDistance = 0;
      wheelGestureReady = false;
    };

    const resetTouchIntent = () => {
      touchCanMoveBackward = false;
      touchCanMoveForward = false;
      touchDistance = 0;
      touchLastY = 0;
    };

    const handleScroll = () => {
      const atTop = isAtDocumentTop();
      const atBottom = isAtDocumentBottom();

      if (atTop && !wasAtTop) topReachedAt = performance.now();
      if (atBottom && !wasAtBottom) bottomReachedAt = performance.now();

      if (!atTop && activeWheelDirection === "backward") resetWheelIntent();
      if (!atBottom && activeWheelDirection === "forward") resetWheelIntent();
      if (!atTop && !atBottom) resetTouchIntent();

      if (!atTop) topReachedAt = 0;
      if (!atBottom) bottomReachedAt = 0;
      wasAtTop = atTop;
      wasAtBottom = atBottom;
    };

    const triggerOnce = (direction: SequentialDirection) => {
      if (isTransitionLocked) return;
      lockResidualInput();
      onNavigateRef.current(direction);
    };

    const handleWheel = (event: WheelEvent) => {
      const eventTime = performance.now();
      const gapFromPreviousWheel = lastWheelAt
        ? eventTime - lastWheelAt
        : Number.POSITIVE_INFINITY;
      lastWheelAt = eventTime;

      if (
        isTransitionLocked ||
        event.ctrlKey ||
        event.deltaY === 0 ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ) {
        resetWheelIntent();
        return;
      }

      const direction: SequentialDirection = event.deltaY > 0 ? "forward" : "backward";
      const canNavigate = direction === "forward" ? canNavigateForward : canNavigateBackward;
      const atBoundary = direction === "forward" ? isAtDocumentBottom() : isAtDocumentTop();

      if (!canNavigate || !atBoundary) {
        resetWheelIntent();
        return;
      }

      if (activeWheelDirection !== direction) {
        activeWheelDirection = direction;
        wheelDistance = 0;
        wheelGestureReady = false;
      }

      const reachedAt = direction === "forward" ? bottomReachedAt : topReachedAt;
      const boundaryReachedAt = reachedAt || eventTime;
      if (direction === "forward" && !bottomReachedAt) bottomReachedAt = eventTime;
      if (direction === "backward" && !topReachedAt) topReachedAt = eventTime;
      if (eventTime - boundaryReachedAt < 120) return;

      if (!wheelGestureReady) {
        const sustainedIntentAtBoundary = eventTime - boundaryReachedAt >= 320;
        if (gapFromPreviousWheel < WHEEL_GESTURE_GAP && !sustainedIntentAtBoundary) return;
        wheelGestureReady = true;
        wheelDistance = 0;
      } else if (gapFromPreviousWheel > 450) {
        wheelDistance = 0;
      }

      const deltaInPixels = event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? Math.abs(event.deltaY) * 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? Math.abs(event.deltaY) * window.innerHeight
          : Math.abs(event.deltaY);
      wheelDistance += Math.min(deltaInPixels, 120);

      if (wheelDistance >= WHEEL_TRIGGER_DISTANCE) triggerOnce(direction);
    };

    const handleTouchStart = (event: TouchEvent) => {
      const hasSingleTouch = event.touches.length === 1;
      touchCanMoveBackward =
        !isTransitionLocked && hasSingleTouch && canNavigateBackward && isAtDocumentTop();
      touchCanMoveForward =
        !isTransitionLocked && hasSingleTouch && canNavigateForward && isAtDocumentBottom();
      touchDistance = 0;
      touchLastY = hasSingleTouch ? event.touches[0].clientY : 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (isTransitionLocked || event.touches.length !== 1) return;

      const currentY = event.touches[0].clientY;
      const verticalDelta = touchLastY - currentY;
      touchLastY = currentY;

      const direction: SequentialDirection = verticalDelta > 0 ? "forward" : "backward";
      const matchesBoundary = direction === "forward"
        ? touchCanMoveForward
        : touchCanMoveBackward;

      if (!matchesBoundary || verticalDelta === 0) {
        touchDistance = 0;
        return;
      }

      touchDistance += Math.abs(verticalDelta);
      if (touchDistance >= TOUCH_TRIGGER_DISTANCE) triggerOnce(direction);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", resetTouchIntent, { passive: true });
    window.addEventListener("touchcancel", resetTouchIntent, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", resetTouchIntent);
      window.removeEventListener("touchcancel", resetTouchIntent);
    };
  }, [canNavigateBackward, canNavigateForward]);
}
