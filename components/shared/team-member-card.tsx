import Image from "next/image";
import Link from "next/link";

import { SocialPlatformIcon } from "@/components/shared/social-platform-icon";
import { getSocialPlatformLabel } from "@/lib/social-platforms";
import { getSafeHttpUrl } from "@/lib/url-security";
import { cn } from "@/lib/utils";

type TeamMemberCardProps = {
  name: string;
  role: string;
  department: string;
  imageSrc?: string;
  imageAlt?: string;
  socialPlatform?: string;
  socialUrl?: string;
  className?: string;
};

export function TeamMemberCard({
  name,
  role,
  department,
  imageSrc,
  imageAlt,
  socialPlatform,
  socialUrl,
  className,
}: TeamMemberCardProps) {
  const nameParts = name.trim().split(/\s+/).filter(Boolean);
  const initials = [nameParts[0], nameParts.at(-1)]
    .filter(Boolean)
    .map((part) => part?.charAt(0))
    .join("")
    .slice(0, 2)
    .toLocaleUpperCase("tr-TR");
  const safeSocialUrl = getSafeHttpUrl(socialUrl);

  return (
    <article
      data-reveal=""
      className={cn(
        "card-gradient-edge group overflow-hidden rounded-[1.75rem] border border-primary/10 bg-primary-900 shadow-[0_24px_70px_-48px_rgba(27,42,94,0.5)] transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_32px_82px_-48px_rgba(27,42,94,0.82)] dark:border-white/10 dark:bg-primary-950",
        className,
      )}
    >
      <div className="relative aspect-[5/6] overflow-hidden bg-primary-50 dark:bg-primary-900">
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
            <span
              className="inline-flex size-24 items-center justify-center rounded-full border border-primary/15 bg-white/60 font-heading text-2xl font-bold tracking-[0.08em] text-primary shadow-[0_18px_45px_-24px_rgba(27,42,94,0.7)] backdrop-blur dark:border-white/15 dark:bg-white/10 dark:text-primary-100"
              aria-hidden="true"
            >
              {initials}
            </span>
          </div>
        )}
        {socialPlatform && safeSocialUrl ? (
          <Link
            href={safeSocialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/social absolute inset-0 z-20 flex items-end justify-end p-4 outline-none sm:items-center sm:justify-center sm:p-0"
            aria-label={`${name} ${getSocialPlatformLabel(socialPlatform)} profilini yeni sekmede aç`}
          >
            <span
              className="absolute inset-0 bg-[linear-gradient(145deg,rgba(27,42,94,0.3),rgba(12,19,47,0.9)_62%,rgba(232,93,44,0.58))] opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible/social:opacity-100 motion-reduce:transition-none"
              aria-hidden="true"
            />
            <span className="relative flex size-12 items-center justify-center rounded-2xl border border-white/30 bg-primary-950/85 text-white opacity-100 shadow-[0_18px_40px_-16px_rgba(232,93,44,0.9)] transition-[transform,opacity,background-color] duration-300 group-hover/social:scale-110 group-hover/social:bg-accent group-focus-visible/social:scale-110 group-focus-visible/social:bg-accent motion-reduce:transition-none sm:scale-75 sm:opacity-0 sm:group-hover:scale-100 sm:group-hover:opacity-100 sm:group-focus-visible/social:scale-100 sm:group-focus-visible/social:opacity-100"
            >
              <SocialPlatformIcon
                platform={socialPlatform}
                className="size-5"
              />
            </span>
          </Link>
        ) : null}
      </div>
      <div className="relative flex min-h-40 flex-col justify-center bg-primary-900 px-6 pb-6 pt-8 dark:bg-primary-950">
        <span
          className="absolute left-6 top-0 h-8 w-1.5 rounded-b-full bg-accent"
          aria-hidden="true"
        />
        <h3 className="font-heading text-xl font-bold tracking-[-0.03em] text-white">
          {name}
        </h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-primary-100">
          {role}
        </p>
        <p className="mt-2 text-xs font-normal tracking-[0.01em] text-primary-300">
          {department}
        </p>
      </div>
    </article>
  );
}
