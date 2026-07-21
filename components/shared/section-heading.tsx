import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        isCentered && "items-center text-center",
        className,
      )}
    >
      <p className="flex items-center gap-3 font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent-700 dark:text-accent-300">
        <span
          className="h-0.5 w-8 rounded-full bg-accent"
          aria-hidden="true"
        />
        {eyebrow}
      </p>
      <Heading className="max-w-3xl font-heading text-4xl font-bold leading-[1.08] tracking-[-0.045em] text-primary sm:text-5xl dark:text-white">
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8",
            isCentered && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
