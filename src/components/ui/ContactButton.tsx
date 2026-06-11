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
      className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-white/95 px-8 py-3 text-xs font-medium uppercase tracking-widest text-white outline outline-2 outline-offset-[-3px] outline-white/95 focus-visible:outline-white sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
      style={{
        background:
          "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
        boxShadow:
          "0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1",
      }}
    >
      <span>{label}</span>
      <ArrowUpRight className="h-4 w-4 shrink-0" />
    </a>
  );
}
