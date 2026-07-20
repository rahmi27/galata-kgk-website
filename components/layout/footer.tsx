import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

import siteContent from "@/content/site.json";

const socialIcons = {
  Instagram: FaInstagram,
  LinkedIn: FaLinkedinIn,
  X: FaXTwitter,
} as const;

export function Footer() {
  const { brand, footer, navigation } = siteContent;
  const copyright = footer.copyright.replace(
    "{year}",
    new Date().getFullYear().toString(),
  );

  return (
    <footer className="bg-primary-900 text-primary-100 dark:bg-[#080d20]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7 lg:col-span-8">
            <div className="flex items-center gap-3">
              <span
                className="h-8 w-1.5 rounded-full bg-accent"
                aria-hidden="true"
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
                const Icon =
                  socialIcons[
                    social.platform as keyof typeof socialIcons
                  ] ?? FaInstagram;

                return (
                  <Link
                    key={social.platform}
                    href={social.href}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-primary-200 transition-all hover:-translate-y-0.5 hover:border-accent/70 hover:bg-accent hover:text-accent-foreground"
                    aria-label={social.platform}
                  >
                    <Icon className="size-4" aria-hidden="true" />
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
              {navigation.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="w-fit text-sm text-primary-200 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-xs leading-5 text-primary-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {copyright}
          </p>
          <p>{footer.institution}</p>
        </div>
      </div>
    </footer>
  );
}
