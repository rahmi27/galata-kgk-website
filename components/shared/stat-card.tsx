import { cn } from "@/lib/utils";

type StatCardProps = {
  value: string;
  label: string;
  className?: string;
};

export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[1.75rem] border border-primary/10 bg-card p-7 shadow-[0_20px_60px_-40px_rgba(27,42,94,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 dark:border-white/10 dark:bg-white/[0.035]",
        className,
      )}
    >
      <span
        className="absolute right-0 top-0 h-20 w-20 rounded-bl-[4rem] bg-primary-50 transition-colors group-hover:bg-accent-50 dark:bg-white/5 dark:group-hover:bg-accent/10"
        aria-hidden="true"
      />
      <span
        className="relative mb-8 block h-1 w-10 rounded-full bg-accent"
        aria-hidden="true"
      />
      <p className="relative font-heading text-4xl font-bold tracking-[-0.05em] text-primary sm:text-5xl dark:text-white">
        {value}
      </p>
      <p className="relative mt-2 text-sm font-medium text-muted-foreground">
        {label}
      </p>
    </article>
  );
}
