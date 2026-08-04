import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Handshake } from "lucide-react";

type PartnerClubCardProps = {
  name: string;
  slug: string;
  logoUrl: string;
  logoAlt: string | null;
  shortDescription: string;
};

export function PartnerClubCard({
  name,
  slug,
  logoUrl,
  logoAlt,
  shortDescription,
}: PartnerClubCardProps) {
  return (
    <Link
      data-reveal=""
      href={`/is-birlikleri/${slug}`}
      className="card-gradient-edge group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-primary/10 bg-card shadow-[0_24px_70px_-52px_rgba(27,42,94,0.7)] transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_30px_80px_-48px_rgba(27,42,94,0.85)] dark:border-white/10 dark:bg-white/[0.035]"
    >
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-primary-50/70 p-8 dark:bg-primary-900/55">
        <span
          className="absolute -right-10 -top-10 size-32 rounded-full border-[22px] border-accent/15 transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        />
        <Image
          src={logoUrl}
          alt={logoAlt ?? `${name} logosu`}
          width={320}
          height={220}
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
          className="relative h-full max-h-40 w-full object-contain"
        />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <span className="flex size-9 items-center justify-center rounded-xl bg-accent-50 text-accent-700 dark:bg-accent/15 dark:text-accent-300">
          <Handshake className="size-4" aria-hidden="true" />
        </span>
        <h2 className="mt-5 font-heading text-2xl font-bold tracking-[-0.035em] text-primary group-hover:text-primary-700 dark:text-white dark:group-hover:text-accent-200">
          {name}
        </h2>
        <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
          {shortDescription}
        </p>
        <span className="mt-6 inline-flex items-center gap-2 font-heading text-sm font-bold text-accent-700 dark:text-accent-300">
          İş birliklerini incele
          <ArrowUpRight
            className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
