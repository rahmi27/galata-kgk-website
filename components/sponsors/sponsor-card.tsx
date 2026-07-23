import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";

import { cn } from "@/lib/utils";

type SponsorCardProps = {
  name: string;
  logoUrl?: string | null;
  logoAlt?: string | null;
  websiteUrl?: string | null;
  description?: string | null;
  featured?: boolean;
};

export function SponsorCard({
  name,
  logoUrl,
  logoAlt,
  websiteUrl,
  description,
  featured = false,
}: SponsorCardProps) {
  const logo = (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl border border-primary/10 bg-white p-6 transition-all duration-300 dark:border-white/10 dark:bg-white/[0.06]",
        featured
          ? "min-h-48 sm:min-h-56 sm:p-10"
          : "min-h-32 sm:min-h-36",
        websiteUrl &&
          "group-hover:-translate-y-1 group-hover:border-accent/35 group-hover:shadow-[0_24px_60px_-36px_rgba(27,42,94,0.55)]",
      )}
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={logoAlt ?? `${name} logosu`}
          width={featured ? 360 : 240}
          height={featured ? 160 : 96}
          sizes={featured ? "(min-width: 1024px) 30vw, 50vw" : "(min-width: 1024px) 20vw, 50vw"}
          className={cn(
            "h-auto max-h-20 w-auto max-w-[80%] object-contain",
            featured && "max-h-28 sm:max-h-32",
          )}
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-center text-primary-500 dark:text-primary-200">
          <Building2 className="size-8" aria-hidden="true" />
          <span className="font-heading text-sm font-bold">{name}</span>
        </div>
      )}
    </div>
  );

  return (
    <article className="group">
      {websiteUrl ? (
        <Link
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} web sitesini yeni sekmede aç`}
        >
          {logo}
        </Link>
      ) : (
        logo
      )}

      <div className={cn("mt-4", featured && "sm:mt-5")}>
        <div className="flex items-start justify-between gap-3">
          <h3
            className={cn(
              "font-heading font-bold tracking-[-0.025em] text-primary dark:text-white",
              featured ? "text-xl sm:text-2xl" : "text-base sm:text-lg",
            )}
          >
            {name}
          </h3>
          {websiteUrl ? (
            <ArrowUpRight
              className="mt-0.5 size-4 shrink-0 text-accent transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          ) : null}
        </div>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </article>
  );
}
