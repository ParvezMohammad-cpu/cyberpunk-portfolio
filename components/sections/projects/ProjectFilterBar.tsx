interface ProjectFilterBarProps<T extends string> {
  label: string;
  options: T[];
  active: T | "all";
  onChange: (value: T | "all") => void;
}

/**
 * Bracket-styled single-select filter row. Each option is a real `<button>`
 * with `aria-pressed`, so filtering works identically via mouse, keyboard,
 * or touch.
 */
export function ProjectFilterBar<T extends string>({
  label,
  options,
  active,
  onChange,
}: ProjectFilterBarProps<T>) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="text-fg-dim mr-1 font-mono text-[0.65rem] tracking-[0.2em] uppercase">
        {label}
      </span>
      <button
        type="button"
        aria-pressed={active === "all"}
        onClick={() => onChange("all")}
        className={`border px-3 py-1.5 font-mono text-[0.65rem] tracking-[0.2em] uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan ${
          active === "all"
            ? "border-neon-cyan text-glow-cyan"
            : "border-border-dim text-fg-dim hover:border-neon-cyan/40"
        }`}
      >
        All
      </button>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={active === option}
          onClick={() => onChange(option)}
          className={`border px-3 py-1.5 font-mono text-[0.65rem] tracking-[0.2em] uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan ${
            active === option
              ? "border-neon-cyan text-glow-cyan"
              : "border-border-dim text-fg-dim hover:border-neon-cyan/40"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
