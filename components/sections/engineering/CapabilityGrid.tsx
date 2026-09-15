import { CAPABILITY_GROUPS } from "@/lib/data/capabilities";

/** Grid of capability groups (frontend, backend, cloud, data, practices). */
export function CapabilityGrid() {
  return (
    <div
      data-reveal
      className="mt-8 grid w-full max-w-4xl gap-4 text-left sm:grid-cols-2 lg:grid-cols-3"
    >
      {CAPABILITY_GROUPS.map((group) => (
        <div
          key={group.id}
          className="border-border-dim bg-surface/60 flex flex-col gap-2 border p-4"
        >
          <h3 className="font-display text-fg text-sm font-bold tracking-[0.2em] uppercase">
            {group.label}
          </h3>
          <ul className="flex flex-wrap gap-1.5" aria-label={`${group.label} skills`}>
            {group.items.map((item) => (
              <li
                key={item}
                className="border-border-dim text-fg-dim border px-2 py-1 font-mono text-[0.65rem] tracking-wide"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
