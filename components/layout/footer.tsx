import Link from "next/link";
import { GraduationCap } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { BrandMountainEcho } from "@/components/effects/brand-mountain-motif";
import { SocialPlatformIcon } from "@/components/shared/social-platform-icon";
import { OFFICIAL_PRIVACY_NOTICE_URL } from "@/lib/privacy";
import type { SiteChromeContent } from "@/lib/site-content";
import { partnerLinks } from "@/lib/partner-links";
import { getSafeHttpUrl } from "@/lib/url-security";

export function Footer({ content }: { content: SiteChromeContent }) {
  const { brand, footer, navigation } = content;
  const copyright = footer.copyright.replace(
    "{year}",
    new Date().getFullYear().toString(),
  );
  const institutionHref =
    getSafeHttpUrl(footer.institutionHref) ?? "https://www.galata.edu.tr/";

  return (
    <footer className="relative z-10 isolate overflow-hidden bg-primary-900 text-primary-100 dark:bg-[#080d20]">
      <BrandMountainEcho
        className="-bottom-40 -right-28 w-[32rem] rotate-[-8deg] opacity-30 sm:-right-20 sm:w-[38rem]"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7 lg:col-span-8">
            <div className="flex items-center gap-4">
              <BrandLogo
                sizes="64px"
                className="size-16 ring-white/15"
              />
              <p className="font-heading text-2xl font-bold tracking-[-0.04em] text-white">
                {brand.name}
              </p>
            </div>
            <p className="mt-6 max-w-xl text-base leading-7 text-primary-200">
              {footer.description}
            </p>

            <div className="mt-8 flex items-center gap-3">
              {footer.socials.map((social) => {
                const isExternal = social.href.startsWith("http");

                return (
                  <Link
                    key={social.platform}
                    href={social.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-primary-200 transition-all hover:-translate-y-0.5 hover:border-accent/70 hover:bg-accent hover:text-accent-foreground"
                    aria-label={`${social.label} hesabını aç`}
                  >
                    <SocialPlatformIcon
                      platform={social.platform}
                      className="size-4"
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-4">
            <p className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-accent-300">
              {footer.quickLinksLabel}
            </p>
            <nav
              className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4"
              aria-label="Alt menü"
            >
              {navigation.items
                .filter((item) => item.id !== "ortaklarimiz")
                .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="w-fit text-sm text-primary-200 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
                ))}
            </nav>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="font-heading text-sm font-semibold text-white">
                {navigation.items.find((item) => item.id === "ortaklarimiz")
                  ?.label ?? "Ortaklarımız"}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                {partnerLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-primary-200 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 pt-7 text-xs leading-5 text-primary-300 sm:grid sm:grid-cols-[1fr_auto_1fr]">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:col-start-1 sm:justify-self-start">
            <Link
              href={OFFICIAL_PRIVACY_NOTICE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit transition-colors hover:text-white"
            >
              KVKK Aydınlatma Metni
            </Link>
            <Link
              href="/cerez-politikasi"
              className="w-fit transition-colors hover:text-white"
            >
              Çerez ve Analitik
            </Link>
          </div>
          <p className="text-center sm:col-start-2">{copyright}</p>
          <Link
            href={institutionHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 transition-colors hover:text-white sm:col-start-3 sm:justify-self-end"
          >
            <GraduationCap className="size-4" aria-hidden="true" />
            {footer.institution}
          </Link>
        </div>
      </div>
    </footer>
  );
}
