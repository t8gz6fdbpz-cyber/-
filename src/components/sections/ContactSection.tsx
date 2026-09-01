import { ArrowUpRight } from "lucide-react";

import { PortfolioLink } from "../../routing";
import { contactChannels } from "../../utils/portfolioData";

export function ContactSection() {
  return (
    <footer id="contact" className="contact-footer scroll-mt-8 px-5 py-16 sm:px-8 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="contact-footer-inner">
          <div>
            <p>联系</p>
            <h2>可以从这里找到我</h2>
          </div>
          <div className="contact-footer-links">
            {contactChannels.map((channel) => {
              const content = (
                <>
                  <span>
                    {channel.label}
                    <ArrowUpRight aria-hidden="true" />
                  </span>
                  <strong>{channel.value}</strong>
                </>
              );

              return channel.href.startsWith("#") ? (
                <PortfolioLink key={channel.label} to={`/${channel.href}`}>
                  {content}
                </PortfolioLink>
              ) : (
                <a key={channel.label} href={channel.href}>
                  {content}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
