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
      className="primary-action inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest transition duration-300 sm:px-10 sm:py-3.5 sm:text-base"
    >
      <span>Live Project</span>
      <ArrowUpRight className="h-4 w-4 shrink-0" />
    </a>
  );
}
