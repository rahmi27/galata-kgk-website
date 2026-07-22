import { cn } from "@/lib/utils";

type TimelineMilestone = {
  year: string;
  title: string;
  description: string;
};

type TimelineProps = {
  milestones: TimelineMilestone[];
  className?: string;
};

export function Timeline({ milestones, className }: TimelineProps) {
  return (
    <ol className={cn("relative", className)}>
      {milestones.map((milestone, index) => (
        <li
          key={`${milestone.year}-${milestone.title}`}
          className="relative grid gap-5 pb-10 pl-12 last:pb-0 sm:grid-cols-[10rem_1fr] sm:items-start sm:gap-8 sm:pl-14"
        >
          {index < milestones.length - 1 ? (
            <span
              className="absolute bottom-0 left-[0.6875rem] top-7 w-px bg-primary-200 dark:bg-primary-700"
              aria-hidden="true"
            />
          ) : null}
          <span
            className="absolute left-0 top-1.5 flex size-6 items-center justify-center rounded-full border-4 border-background bg-accent shadow-[0_0_0_1px_rgba(27,42,94,0.15)] dark:border-[#0f0f12] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.15)]"
            aria-hidden="true"
          />
          <div className="relative flex min-h-24 items-center justify-center overflow-hidden rounded-2xl border border-primary/10 bg-primary-50 px-4 py-5 text-center shadow-[0_18px_45px_-34px_rgba(27,42,94,0.65)] dark:border-white/10 dark:bg-primary-900/70">
            <span
              className="absolute inset-x-5 bottom-0 h-1 rounded-t-full bg-accent"
              aria-hidden="true"
            />
            <p className="font-heading text-2xl font-black leading-[0.95] tracking-[-0.055em] text-primary sm:text-3xl dark:text-primary-100">
              {milestone.year}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-primary/10 bg-card p-6 shadow-[0_20px_60px_-44px_rgba(27,42,94,0.55)] sm:p-7 dark:border-white/10 dark:bg-white/[0.035]">
            <h3 className="font-heading text-xl font-bold tracking-[-0.025em] text-primary dark:text-white">
              {milestone.title}
            </h3>
            <p className="mt-3 leading-7 text-muted-foreground">
              {milestone.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
