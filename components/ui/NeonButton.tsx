import type { ButtonHTMLAttributes, ReactNode } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "cyan" | "magenta";
}

/**
 * Bracket-styled, monospace call-to-action button used across the boot
 * sequence and HUD (e.g. `ENTER EXPERIENCE ->`). Purely presentational —
 * pass an `onClick` for behavior.
 */
export function NeonButton({
  children,
  variant = "cyan",
  className = "",
  ...rest
}: NeonButtonProps) {
  const glow = variant === "cyan" ? "border-glow-cyan" : "";
  const textColor = variant === "cyan" ? "text-glow-cyan" : "text-glow-magenta";

  return (
    <button
      className={`group inline-flex items-center gap-2 border border-neon-cyan/60 bg-black-glass/60 px-6 py-3 font-mono text-sm tracking-[0.2em] uppercase transition-transform duration-200 hover:scale-[1.03] ${glow} ${textColor} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
