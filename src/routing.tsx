import { forwardRef, useLayoutEffect, type MouseEvent } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useNavigationType,
  useResolvedPath,
  type LinkProps,
} from "react-router-dom";

type DetailNavigationState = {
  fromHomeKey?: string;
  interestSequenceDepth?: number;
  interestSequenceEntry?: boolean;
  interestSequenceDirection?: "forward" | "backward";
};

const homeScrollPositions = new Map<string, number>();

const isPlainNavigationClick = (event: MouseEvent<HTMLAnchorElement>) =>
  !event.defaultPrevented &&
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey &&
  !event.currentTarget.target &&
  !event.currentTarget.hasAttribute("download");

const isDetailPath = (pathname: string) =>
  pathname.startsWith("/cases/") || pathname.startsWith("/interests/");

const setInstantScroll = (top: number) => {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "auto" });
  root.style.scrollBehavior = previousBehavior;
};

const focusElement = (element: HTMLElement) => {
  if (!element.hasAttribute("tabindex")) {
    element.setAttribute("tabindex", "-1");
  }

  element.focus({ preventScroll: true });
};

export const scrollToHash = (hash: string) => {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  const target = document.getElementById(id);
  if (!target) return false;

  const configuredOffset = Number.parseFloat(
    window.getComputedStyle(target).scrollMarginTop,
  );
  const offset = Number.isFinite(configuredOffset) && configuredOffset > 0
    ? configuredOffset
    : 28;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  setInstantScroll(top);
  focusElement(target);
  return true;
};

export const PortfolioLink = forwardRef<HTMLAnchorElement, LinkProps>(
  function PortfolioLink({ onClick, to, ...props }, ref) {
    const location = useLocation();
    const navigate = useNavigate();
    const resolved = useResolvedPath(to);

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (!isPlainNavigationClick(event)) return;

      const isSameDestination =
        location.pathname === resolved.pathname &&
        location.search === resolved.search &&
        location.hash === resolved.hash;

      if (isSameDestination) {
        event.preventDefault();
        if (resolved.hash) {
          scrollToHash(resolved.hash);
        } else {
          setInstantScroll(0);
        }
        return;
      }

      if (location.pathname === "/" && isDetailPath(resolved.pathname)) {
        homeScrollPositions.set(location.key, window.scrollY);
        event.preventDefault();
        navigate(resolved, {
          state: { fromHomeKey: location.key } satisfies DetailNavigationState,
        });
      }
    };

    return <Link ref={ref} to={to} onClick={handleClick} {...props} />;
  },
);

type DetailBackLinkProps = Omit<LinkProps, "to"> & {
  fallback: "/#case-studies" | "/#interests";
};

export const DetailBackLink = forwardRef<
  HTMLAnchorElement,
  DetailBackLinkProps
>(function DetailBackLink({ fallback, onClick, ...props }, ref) {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as DetailNavigationState | null;
  const hasValidHomeEntry =
    typeof state?.fromHomeKey === "string" &&
    homeScrollPositions.has(state.fromHomeKey);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (!isPlainNavigationClick(event)) return;

    event.preventDefault();
    if (hasValidHomeEntry) {
      const sequenceDepth = Number.isInteger(state?.interestSequenceDepth)
        ? Math.max(0, state?.interestSequenceDepth ?? 0)
        : 0;
      navigate(-(sequenceDepth + 1));
    } else {
      navigate(fallback, { replace: true });
    }
  };

  return <Link ref={ref} to={fallback} onClick={handleClick} {...props} />;
});

export function RouteEffects() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    let frameId = 0;
    const savedHomeScroll = homeScrollPositions.get(location.key);

    if (
      location.pathname === "/" &&
      navigationType === "POP" &&
      typeof savedHomeScroll === "number"
    ) {
      frameId = window.requestAnimationFrame(() => {
        setInstantScroll(savedHomeScroll);
      });
      return () => window.cancelAnimationFrame(frameId);
    }

    const detailState = location.state as DetailNavigationState | null;
    if (
      location.pathname.startsWith("/interests/") &&
      detailState?.interestSequenceEntry
    ) {
      const isBackwardEntry =
        detailState.interestSequenceDirection === "backward";
      const targetTop = isBackwardEntry
        ? document.documentElement.scrollHeight - window.innerHeight
        : 0;
      setInstantScroll(targetTop);

      const focusTarget = isBackwardEntry
        ? document.querySelector<HTMLElement>("[data-interest-bottom-focus]")
        : document.querySelector<HTMLElement>("main h1");
      if (focusTarget) focusElement(focusTarget);
      return;
    }

    if (location.hash) {
      frameId = window.requestAnimationFrame(() => {
        scrollToHash(location.hash);
      });
    } else {
      setInstantScroll(0);

      if (location.pathname !== "/") {
        const heading = document.querySelector<HTMLElement>("main h1");
        if (heading) focusElement(heading);
      }
    }

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [location.hash, location.key, location.pathname, navigationType]);

  return null;
}
