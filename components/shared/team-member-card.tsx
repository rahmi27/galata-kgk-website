import Image from "next/image";
import { UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

type TeamMemberCardProps = {
  name: string;
  role: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

export function TeamMemberCard({
  name,
  role,
  imageSrc,
  imageAlt,
  className,
}: TeamMemberCardProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden rounded-[1.75rem] border border-primary/10 bg-card shadow-[0_24px_70px_-48px_rgba(27,42,94,0.5)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 dark:border-white/10 dark:bg-white/[0.035]",
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-primary-50 dark:bg-primary-900">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_35%,rgba(232,93,44,0.2),transparent_30%),linear-gradient(160deg,#F6F7FB_0%,#C4CBE1_100%)] dark:bg-[radial-gradient(circle_at_50%_35%,rgba(232,93,44,0.2),transparent_30%),linear-gradient(160deg,#202F62_0%,#131D41_100%)]"
            role="img"
            aria-label={`${name} için fotoğraf alanı`}
          >
            <UserRound
              className="size-20 text-primary/45 dark:text-primary-200/55"
              strokeWidth={1}
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      <div className="relative p-6">
        <span
          className="absolute left-6 top-0 h-1 w-10 -translate-y-1/2 rounded-full bg-accent"
          aria-hidden="true"
        />
        <h3 className="font-heading text-lg font-bold tracking-[-0.025em] text-primary dark:text-white">
          {name}
        </h3>
        <p className="mt-1.5 text-sm font-medium text-muted-foreground">
          {role}
        </p>
      </div>
    </article>
  );
}
