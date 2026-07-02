import { ArrowUpRight } from "lucide-react";

type ContactButtonProps = {
  href: string;
  label?: string;
};

export function ContactButton({
  href,
  label = "Contact Me",
}: ContactButtonProps) {
  return (
    <a
      href={href}
      className="primary-action inline-flex shrink-0 items-center gap-2 rounded-full px-8 py-3 text-xs font-bold uppercase tracking-widest transition duration-300 sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
    >
      <span>{label}</span>
      <ArrowUpRight className="h-4 w-4 shrink-0" />
    </a>
  );
}
