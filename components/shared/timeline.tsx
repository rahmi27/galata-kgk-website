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
          className="relative grid gap-5 pb-10 pl-12 last:pb-0 sm:grid-cols-[6rem_1fr] sm:gap-8 sm:pl-14"
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
          <p className="font-heading text-sm font-bold tracking-[0.08em] text-accent-700 sm:pt-1 dark:text-accent-300">
            {milestone.year}
          </p>
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
