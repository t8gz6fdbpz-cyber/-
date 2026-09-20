import { Mail } from "lucide-react";
import { useLocation } from "react-router-dom";

import { PortfolioLink } from "../../routing";

export function FloatingEmailButton() {
  const location = useLocation();

  if (location.pathname !== "/") {
    return null;
  }

  return (
    <PortfolioLink
      to="/#contact"
      aria-label="前往联系区域"
      className="home-floating-email"
    >
      <Mail aria-hidden="true" strokeWidth={2.6} />
    </PortfolioLink>
  );
}
