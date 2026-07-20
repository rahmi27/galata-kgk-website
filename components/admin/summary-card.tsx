import type { LucideIcon } from "lucide-react";

type SummaryCardProps = {
  label: string;
  value: number;
  helper: string;
  icon: LucideIcon;
  tone?: "primary" | "accent";
};

export function SummaryCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "primary",
}: SummaryCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-primary-100 bg-white p-6 shadow-[0_18px_50px_-36px_rgba(27,42,94,0.45)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary-500">{label}</p>
          <p className="mt-3 font-heading text-4xl font-bold tracking-[-0.05em] text-primary-950">
            {value}
          </p>
        </div>
        <div
          className={
            tone === "accent"
              ? "flex size-11 items-center justify-center rounded-2xl bg-accent-50 text-accent-700"
              : "flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-700"
          }
        >
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-5 border-t border-primary-50 pt-4 text-xs leading-5 text-primary-400">
        {helper}
      </p>
    </article>
  );
}
