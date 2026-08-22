"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, ChevronDown, Handshake, Menu, X } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { SiteChromeContent } from "@/lib/site-content";
import { cn } from "@/lib/utils";

const partnerRouteHrefs = ["/sponsorlar", "/is-birlikleri"] as const;

export function Navbar({ content }: { content: SiteChromeContent }) {
  const t = useTranslations("nav");
  const common = useTranslations("common");
  const locale = useLocale();
  const partnerLinks = [
    { label: t("sponsors"), href: "/sponsorlar" as const, description: t("sponsorsDescription") },
    { label: t("collaborations"), href: "/is-birlikleri" as const, description: t("collaborationsDescription") },
  ];
  const pathname = usePathname();
  const currentPathname = pathname?.replace(/\/+$/, "") || "/";
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPartnersOpen, setIsPartnersOpen] = useState(false);
  const [isMobilePartnersOpen, setIsMobilePartnersOpen] = useState(false);
  const { brand, navigation } = content;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const routes = [
      ...navigation.items
        .filter((item) => item.id !== "ortaklarimiz")
        .map((item) => item.href),
      ...partnerRouteHrefs,
      navigation.joinCta.href,
    ].filter((href) => href !== currentPathname);
    const prefetchRoutes = () => {
      routes.forEach((href) => router.prefetch(href as never));
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(prefetchRoutes, {
        timeout: 1500,
      });

      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(prefetchRoutes, 800);
    return () => clearTimeout(timeoutId);
  }, [currentPathname, navigation.items, navigation.joinCta.href, router]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        isScrolled
          ? "border-primary/10 bg-background/90 shadow-[0_12px_40px_-24px_rgba(27,42,94,0.45)] backdrop-blur-xl dark:border-white/10"
          : "border-transparent bg-background/75 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-[5.5rem] max-w-7xl items-center justify-between px-5 sm:h-24 sm:px-8 lg:px-10">
        <Link
          href="/"
          locale={locale}
          className="group inline-flex min-w-0 max-w-[11.25rem] items-center gap-3 font-heading text-[0.78rem] font-bold leading-[1.2] tracking-[-0.02em] text-primary sm:max-w-[20.5rem] sm:text-[0.95rem] dark:text-primary-100"
          aria-label={brand.homeAriaLabel}
        >
          <BrandLogo
            priority
            sizes="(min-width: 640px) 72px, 48px"
            className="size-12 transition-transform duration-300 group-hover:scale-105 sm:size-[4.5rem] dark:ring-white/15"
          />
          <span className="block">{brand.name}</span>
        </Link>

        <nav
          className="hidden items-center gap-6 xl:flex"
          aria-label={navigation.desktopAriaLabel}
        >
          {navigation.items.map((item) => {
            const isPartnersItem = item.id === "ortaklarimiz";
            const isActive = isPartnersItem
              ? partnerLinks.some((link) =>
                  currentPathname.startsWith(link.href),
                )
              : currentPathname === item.href;

            if (isPartnersItem) {
              return (
                <div
                  key={item.id}
                  className="group relative"
                  onMouseEnter={() => setIsPartnersOpen(true)}
                  onMouseLeave={() => setIsPartnersOpen(false)}
                  onBlurCapture={(event) => {
                    if (
                      !event.currentTarget.contains(event.relatedTarget as Node)
                    ) {
                      setIsPartnersOpen(false);
                    }
                  }}
                >
                  <button
                    type="button"
                    className={cn(
                      "relative flex items-center gap-1.5 py-2 text-sm font-medium text-primary-700 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-accent after:transition-transform hover:text-primary dark:text-primary-200 dark:hover:text-white",
                      isActive
                        ? "text-primary after:scale-x-100 dark:text-white"
                        : "after:scale-x-0 group-hover:after:scale-x-100",
                    )}
                    onClick={() => setIsPartnersOpen((current) => !current)}
                    aria-expanded={isPartnersOpen}
                    aria-haspopup="menu"
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "size-3.5 transition-transform duration-150",
                        isPartnersOpen && "rotate-180",
                      )}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    className={cn(
                      "absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3 transition-[opacity,transform,visibility] duration-150 ease-out",
                      isPartnersOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1 opacity-0",
                    )}
                  >
                    <div className="rounded-2xl border border-primary-100 bg-background/98 p-2 shadow-[0_22px_60px_-32px_rgba(27,42,94,0.65)] backdrop-blur-xl dark:border-white/10">
                      {partnerLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          locale={locale}
                          role="menuitem"
                          className="flex gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-primary-50 dark:hover:bg-white/[0.07]"
                          onClick={(event) => {
                            event.currentTarget.blur();
                            setIsPartnersOpen(false);
                          }}
                        >
                          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-700 dark:bg-accent/15 dark:text-accent-300">
                            <Handshake className="size-4" aria-hidden="true" />
                          </span>
                          <span>
                            <span className="block font-heading text-sm font-bold text-primary dark:text-white">
                              {link.label}
                            </span>
                            <span className="mt-0.5 block text-xs leading-5 text-primary-600 dark:text-primary-200">
                              {link.description}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href as never}
                locale={locale}
                className={cn(
                  "relative py-2 text-sm font-medium text-primary-700 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-accent after:transition-transform hover:text-primary hover:after:scale-x-100 dark:text-primary-200 dark:hover:text-white",
                  isActive ? "text-primary after:scale-x-100 dark:text-white" : "after:scale-x-0",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <LanguageSwitcher />
          <ThemeToggle ariaLabel={common("themeToggle")} />
          <Button
            asChild
            variant="secondary"
            className="hidden md:inline-flex"
          >
            <Link href={navigation.joinCta.href as never} locale={locale}>
              {navigation.joinCta.label}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full text-primary hover:bg-primary-50 xl:hidden dark:text-primary-100 dark:hover:bg-white/10"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={
              isMenuOpen
                ? navigation.closeMenuLabel
                : navigation.openMenuLabel
            }
          >
            {isMenuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {isMenuOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-primary/10 bg-background/95 px-5 py-5 backdrop-blur-xl xl:hidden dark:border-white/10"
        >
          <nav
            className="mx-auto flex max-w-7xl flex-col gap-1"
            aria-label={navigation.mobileAriaLabel}
          >
            {navigation.items.map((item) => {
              if (item.id === "ortaklarimiz") {
                const isActive = partnerLinks.some((link) =>
                  currentPathname.startsWith(link.href),
                );

                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-4 py-3 font-heading text-base font-semibold text-primary transition-colors hover:bg-primary-50 dark:text-primary-100 dark:hover:bg-white/10",
                        isActive && "bg-primary-50 dark:bg-white/10",
                      )}
                      onClick={() =>
                        setIsMobilePartnersOpen((current) => !current)
                      }
                      aria-expanded={isMobilePartnersOpen}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform duration-150",
                          isMobilePartnersOpen && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-150 ease-out",
                        isMobilePartnersOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="ml-4 border-l border-primary-100 py-1 pl-3 dark:border-white/10">
                          {partnerLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              locale={locale}
                              className="block rounded-xl px-4 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-50 dark:text-primary-100 dark:hover:bg-white/10"
                              onClick={() => {
                                setIsMenuOpen(false);
                                setIsMobilePartnersOpen(false);
                              }}
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href as never}
                  locale={locale}
                  className={cn(
                    "rounded-xl px-4 py-3 font-heading text-base font-semibold text-primary transition-colors hover:bg-primary-50 dark:text-primary-100 dark:hover:bg-white/10",
                    currentPathname === item.href &&
                      "bg-primary-50 dark:bg-white/10",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={
                    currentPathname === item.href ? "page" : undefined
                  }
                >
                  {item.label}
                </Link>
              );
            })}
            <Button
              asChild
              variant="secondary"
              className="mt-3"
            >
              <Link
                href={navigation.joinCta.href as never}
                locale={locale}
                onClick={() => setIsMenuOpen(false)}
              >
                {navigation.joinCta.label}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
