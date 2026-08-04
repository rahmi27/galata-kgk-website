import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type AmbientParticlesProps = {
  className?: string;
  count?: number;
};

type ParticleStyle = CSSProperties & {
  "--ambient-drift-x": string;
  "--ambient-drift-y": string;
  "--ambient-return-x": string;
  "--ambient-return-y": string;
  "--ambient-peak-opacity": string;
};

export function AmbientParticles({
  className,
  count = 18,
}: AmbientParticlesProps) {
  const particleCount = Math.min(Math.max(count, 5), 25);

  return (
    <div
      className={cn(
        "ambient-particles pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      {Array.from({ length: particleCount }, (_, index) => {
        const size = 2 + (index % 3);
        const driftX = ((index % 5) - 2) * 8;
        const driftY = ((index % 7) - 3) * 6;
        const style: ParticleStyle = {
          left: `${(index * 37 + 11) % 96}%`,
          top: `${(index * 53 + 17) % 92}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${-(index % 9) * 2.4}s`,
          animationDuration: `${20 + (index % 7) * 3}s`,
          "--ambient-drift-x": `${driftX}px`,
          "--ambient-drift-y": `${driftY}px`,
          "--ambient-return-x": `${driftX * -0.35}px`,
          "--ambient-return-y": `${driftY * -0.35}px`,
          "--ambient-peak-opacity": `${0.14 + (index % 4) * 0.025}`,
        };

        return (
          <span
            key={index}
            className="ambient-particle"
            style={style}
          />
        );
      })}
    </div>
  );
}
