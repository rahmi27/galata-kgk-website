"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import siteContent from "@/content/site.json";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { brand, navigation } = siteContent;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const routes = [
      ...navigation.items.map((item) => item.href),
      navigation.joinCta.href,
    ].filter((href) => href !== pathname);
    const prefetchRoutes = () => {
      routes.forEach((href) => router.prefetch(href));
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(prefetchRoutes, {
        timeout: 1500,
      });

      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(prefetchRoutes, 800);
    return () => clearTimeout(timeoutId);
  }, [navigation.items, navigation.joinCta.href, pathname, router]);

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
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
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
          <ThemeToggle />
          <Button
            asChild
            variant="secondary"
            className="hidden md:inline-flex"
          >
            <Link href={navigation.joinCta.href}>
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
            {navigation.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-4 py-3 font-heading text-base font-semibold text-primary transition-colors hover:bg-primary-50 dark:text-primary-100 dark:hover:bg-white/10",
                  pathname === item.href && "bg-primary-50 dark:bg-white/10",
                )}
                onClick={() => setIsMenuOpen(false)}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
            <Button
              asChild
              variant="secondary"
              className="mt-3"
            >
              <Link
                href={navigation.joinCta.href}
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
