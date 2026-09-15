import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

interface NeonButtonBaseProps {
  children: ReactNode;
  variant?: "cyan" | "magenta";
  className?: string;
}

type NeonButtonAsButton = NeonButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type NeonButtonAsAnchor = NeonButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type NeonButtonProps = NeonButtonAsButton | NeonButtonAsAnchor;

const BASE_CLASSES =
  "group inline-flex items-center gap-2 border border-neon-cyan/60 bg-black-glass/60 px-6 py-3 font-mono text-sm tracking-[0.2em] uppercase transition-transform duration-200 hover:scale-[1.03] focus-visible:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100";

/**
 * Bracket-styled, monospace call-to-action used across the boot sequence,
 * HUD, and section content (e.g. `ENTER EXPERIENCE ->`). Renders a native
 * `<a>` when `href` is passed (in-page navigation, resume link, external
 * links) or a native `<button>` otherwise (form submit, modal triggers) —
 * both are fully keyboard operable with a visible focus ring.
 */
export function NeonButton({
  children,
  variant = "cyan",
  className = "",
  href,
  ...rest
}: NeonButtonProps) {
  const glow = variant === "cyan" ? "border-glow-cyan" : "";
  const textColor = variant === "cyan" ? "text-glow-cyan" : "text-glow-magenta";
  const classes = `${BASE_CLASSES} ${glow} ${textColor} ${className}`;

  if (href !== undefined) {
    return (
      <a
        href={href}
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
