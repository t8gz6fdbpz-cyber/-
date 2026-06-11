import { ArrowUpRight } from "lucide-react";

type LiveProjectButtonProps = {
  href: string;
};

export function LiveProjectButton({ href }: LiveProjectButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors duration-200 hover:bg-[#D7E2EA]/10 focus-visible:bg-[#D7E2EA]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D7E2EA] sm:px-10 sm:py-3.5 sm:text-base"
    >
      <span>Live Project</span>
      <ArrowUpRight className="h-4 w-4 shrink-0" />
    </a>
  );
}
