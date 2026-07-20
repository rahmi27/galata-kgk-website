"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Anasayfa", href: "/" },
  { label: "Hakkımızda", href: "/#hakkimizda" },
  { label: "Etkinliklerimiz", href: "/#etkinlikler" },
  { label: "Ekibimiz", href: "/#ekibimiz" },
  { label: "İletişim", href: "/#iletisim" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          className="group inline-flex items-center gap-3 font-heading text-lg font-bold tracking-[-0.03em] text-primary dark:text-primary-100"
          aria-label="Galata KGK ana sayfa"
        >
          <span
            className="h-7 w-1.5 rounded-full bg-accent transition-transform duration-300 group-hover:scale-y-75"
            aria-hidden="true"
          />
          <span>Galata KGK</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Ana menü">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative py-2 text-sm font-medium text-primary-700 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-accent after:transition-transform hover:text-primary hover:after:scale-x-100 dark:text-primary-200 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Button
            asChild
            variant="secondary"
            className="hidden md:inline-flex"
          >
            <Link href="/#katil">
              Kulübe Katıl
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full text-primary hover:bg-primary-50 lg:hidden dark:text-primary-100 dark:hover:bg-white/10"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
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
          className="border-t border-primary/10 bg-background/95 px-5 py-5 backdrop-blur-xl lg:hidden dark:border-white/10"
        >
          <nav
            className="mx-auto flex max-w-7xl flex-col gap-1"
            aria-label="Mobil menü"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-3 font-heading text-base font-semibold text-primary transition-colors hover:bg-primary-50 dark:text-primary-100 dark:hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Button
              asChild
              variant="secondary"
              className="mt-3"
            >
              <Link href="/#katil" onClick={() => setIsMenuOpen(false)}>
                Kulübe Katıl
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
