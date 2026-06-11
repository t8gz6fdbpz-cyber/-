import { type ReactNode } from "react";

import { useMagneticEffect } from "../../hooks/useMagneticEffect";

type MagnetProps = {
  children: ReactNode;
  className?: string;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
};

export function Magnet({
  children,
  className,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
}: MagnetProps) {
  const ref = useMagneticEffect({
    padding,
    strength,
    activeTransition,
    inactiveTransition,
  });

  return (
    <div ref={ref} className={className} data-magnet>
      {children}
    </div>
  );
}
