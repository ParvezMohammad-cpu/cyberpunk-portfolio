import type { ProjectDnaAxis } from "@/lib/data/types";

const SIZE = 220;
const CENTER = SIZE / 2;
const MAX_RADIUS = SIZE / 2 - 32;

function axisPoint(index: number, total: number, value: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const radius = (value / 100) * MAX_RADIUS;
  return [CENTER + Math.cos(angle) * radius, CENTER + Math.sin(angle) * radius] as const;
}

function labelPoint(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const radius = MAX_RADIUS + 14;
  return [CENTER + Math.cos(angle) * radius, CENTER + Math.sin(angle) * radius] as const;
}

/**
 * Step 4.13/4.14 — Project DNA radar signature. Pure SVG (no client JS, no
 * WebGL, no hover requirement) so it's usable in every environment; the
 * accompanying `<table>` is the same data as text, since the shape alone
 * shouldn't be the only way to read the scores. Values are 0-100 qualitative
 * design-emphasis ratings, explicitly not benchmark measurements, and axis
 * sets differ per project kind — see `dnaNote`.
 */
export function ProjectDnaChart({
  axes,
  note,
}: {
  axes: ProjectDnaAxis[];
  note?: string;
}) {
  if (axes.length < 3) return null;

  const polygonPoints = axes
    .map((axis, index) => axisPoint(index, axes.length, axis.value).join(","))
    .join(" ");

  const rings = [25, 50, 75, 100];

  return (
    <section aria-labelledby="project-dna-heading">
      <h4
        id="project-dna-heading"
        className="font-display text-fg text-lg font-bold tracking-[0.15em] uppercase"
      >
        Project DNA
      </h4>
      {note && (
        <p className="text-fg-dim mt-1 max-w-md font-mono text-xs leading-relaxed">
          {note}
        </p>
      )}

      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-start">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={SIZE}
          height={SIZE}
          role="img"
          aria-label={`Project DNA radar: ${axes
            .map((a) => `${a.axis} ${a.value} out of 100`)
            .join(", ")}`}
          className="shrink-0"
        >
          {rings.map((ring) => (
            <polygon
              key={ring}
              points={axes
                .map((_, index) => axisPoint(index, axes.length, ring).join(","))
                .join(" ")}
              fill="none"
              stroke="var(--color-border-dim)"
              strokeWidth={1}
            />
          ))}

          {axes.map((_, index) => {
            const [x, y] = axisPoint(index, axes.length, 100);
            return (
              <line
                key={`spoke-${index}`}
                x1={CENTER}
                y1={CENTER}
                x2={x}
                y2={y}
                stroke="var(--color-border-dim)"
                strokeWidth={1}
              />
            );
          })}

          <polygon
            points={polygonPoints}
            fill="color-mix(in srgb, var(--color-neon-cyan) 25%, transparent)"
            stroke="var(--color-neon-cyan)"
            strokeWidth={2}
          />

          {axes.map((axis, index) => {
            const [x, y] = labelPoint(index, axes.length);
            return (
              <text
                key={axis.axis}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={8}
                fontFamily="var(--font-mono)"
                fill="var(--color-fg-dim)"
              >
                {axis.axis}
              </text>
            );
          })}
        </svg>

        <table className="font-mono text-xs">
          <caption className="text-fg-dim mb-1 text-left uppercase tracking-[0.15em]">
            Axis scores (qualitative, 0-100)
          </caption>
          <thead>
            <tr className="text-fg-dim">
              <th scope="col" className="pr-4 text-left uppercase">Axis</th>
              <th scope="col" className="text-left uppercase">Score</th>
            </tr>
          </thead>
          <tbody>
            {axes.map((axis) => (
              <tr key={axis.axis}>
                <th scope="row" className="text-fg pr-4 text-left font-normal uppercase">
                  {axis.axis}
                </th>
                <td className="text-glow-cyan">{axis.value}/100</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
