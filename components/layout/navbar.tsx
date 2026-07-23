"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import siteContent from "@/content/site.json";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { brand, navigation } = siteContent;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        isScrolled
          ? "border-primary/10 bg-background/90 shadow-[0_12px_40px_-24px_rgba(27,42,94,0.45)] backdrop-blur-xl dark:border-white/10"
          : "border-transparent bg-background/75 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="group inline-flex min-w-0 max-w-[10.5rem] items-center gap-2.5 font-heading text-[0.68rem] font-bold leading-[1.15] tracking-[-0.02em] text-primary sm:max-w-64 sm:text-xs dark:text-primary-100"
          aria-label={brand.homeAriaLabel}
        >
          <span
            className="h-8 w-1.5 shrink-0 rounded-full bg-accent transition-transform duration-300 group-hover:scale-y-75"
            aria-hidden="true"
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
