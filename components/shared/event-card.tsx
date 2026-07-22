import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";

import { cn } from "@/lib/utils";

type EventCardProps = {
  date: string;
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
  category?: string;
  className?: string;
};

export function EventCard({
  date,
  title,
  description,
  imageSrc,
  imageAlt,
  href,
  category,
  className,
}: EventCardProps) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-primary/10 bg-card shadow-[0_24px_70px_-48px_rgba(27,42,94,0.55)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 dark:border-white/10 dark:bg-white/[0.035]",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-primary-800">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_78%_22%,rgba(232,93,44,0.55),transparent_26%),linear-gradient(135deg,#1B2A5E_0%,#283B74_50%,#131D41_100%)]"
            role="img"
            aria-label={`${title} için görsel alanı`}
          >
            <CalendarDays
              className="size-12 text-white/70"
              strokeWidth={1.25}
              aria-hidden="true"
            />
          </div>
        )}
        <div className="absolute left-5 right-5 top-5 flex flex-col items-start gap-2">
          <p className="w-fit max-w-full rounded-2xl bg-background/90 px-3.5 py-2 text-xs font-bold uppercase leading-4 tracking-[0.12em] text-primary shadow-sm backdrop-blur dark:bg-primary-900/90 dark:text-primary-100">
            {date}
          </p>
          {category ? (
            <p className="w-fit max-w-full rounded-full border border-white/20 bg-primary-900/75 px-3.5 py-2 text-xs font-semibold leading-4 text-white shadow-sm backdrop-blur">
              {category}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-xl font-bold leading-tight tracking-[-0.025em] text-primary dark:text-white">
          {title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        {href ? (
          <Link
            href={href}
            className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent-700 dark:text-primary-100 dark:hover:text-accent-300"
          >
            Detayları gör
            <ArrowUpRight
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
