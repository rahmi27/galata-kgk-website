import { cn } from "@/lib/utils";

type AmbientParticlesProps = {
  className?: string;
};

export function AmbientParticles({ className }: AmbientParticlesProps) {
  return (
    <div
      className={cn(
        "ambient-particles pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      <span className="ambient-particle-field ambient-particle-field-a" />
      <span className="ambient-particle-field ambient-particle-field-b" />
      <span className="ambient-particle-field ambient-particle-field-c" />
    </div>
  );
}
