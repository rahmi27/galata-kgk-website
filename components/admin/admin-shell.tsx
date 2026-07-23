"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  Handshake,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
  X,
} from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navigation = [
  {
    label: "Panel",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Etkinlikler",
    href: "/admin/etkinlikler",
    icon: CalendarDays,
  },
  {
    label: "Ekip",
    href: "/admin/ekip",
    icon: UsersRound,
  },
  {
    label: "Sponsorlar",
    href: "/admin/sponsorlar",
    icon: Handshake,
  },
  {
    label: "Mesajlar",
    href: "/admin/mesajlar",
    icon: Inbox,
  },
  {
    label: "Katılım Başvuruları",
    href: "/admin/katilim-basvurulari",
    icon: UserRoundCheck,
  },
  {
    label: "İstatistikler",
    href: "/admin/istatistikler",
    icon: BarChart3,
  },
  {
    label: "Kullanıcılar",
    href: "/admin/kullanicilar",
    icon: ShieldCheck,
  },
] as const;

type AdminShellProps = {
  children: React.ReactNode;
  userName: string;
  username: string;
};

function AdminNavigation({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="mt-8 space-y-1" aria-label="Yönetim menüsü">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/admin"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors",
              isActive
                ? "bg-white text-primary-950 shadow-sm"
                : "text-primary-100 hover:bg-white/15 hover:text-white",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon
              className={cn(
                "size-4.5",
                isActive
                  ? "text-accent-600"
                  : "text-primary-200 group-hover:text-accent-200",
              )}
              aria-hidden="true"
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({
  children,
  userName,
  username,
}: AdminShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  async function handleSignOut() {
    await signOut({
      callbackUrl: "/admin/giris",
    });
  }

  return (
    <div className="admin-shell min-h-screen bg-[#f5f7fb] text-primary-950 transition-colors dark:bg-primary-900 dark:text-primary-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-primary-950 px-5 py-6 lg:flex">
        <Link
          href="/admin"
          className="flex items-center gap-3 px-2 font-heading text-lg font-bold tracking-[-0.03em] text-white"
        >
          <BrandLogo sizes="44px" className="size-11 ring-white/15" />
          Galata KGK
        </Link>
        <p className="mt-2 px-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">
          Yönetim Paneli
        </p>

        <AdminNavigation pathname={pathname} />

        <div className="mt-auto border-t border-white/10 pt-5">
          <div className="flex items-start justify-between gap-3 px-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {userName}
              </p>
              <p className="mt-1 truncate text-xs font-medium text-primary-200">
                @{username}
              </p>
            </div>
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-4 flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-primary-100 transition-colors hover:bg-white/15 hover:text-white"
          >
            <LogOut className="size-4.5 text-accent-300" aria-hidden="true" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-[4.5rem] items-center justify-between border-b border-primary-100 bg-white/90 px-5 backdrop-blur dark:border-white/10 dark:bg-primary-950/90 lg:hidden">
        <Link
          href="/admin"
          className="flex items-center gap-2.5 font-heading font-bold text-primary-950"
        >
          <BrandLogo sizes="36px" className="size-9 dark:ring-white/15" />
          Galata KGK Admin
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="rounded-xl"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Yönetim menüsünü aç"
          >
            <Menu aria-hidden="true" />
          </Button>
        </div>
      </header>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-primary-950/55 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Yönetim menüsünü kapat"
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col bg-primary-950 px-5 py-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BrandLogo sizes="40px" className="size-10 ring-white/15" />
                <span className="font-heading text-lg font-bold text-white">
                  Yönetim Paneli
                </span>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Yönetim menüsünü kapat"
              >
                <X aria-hidden="true" />
              </Button>
            </div>
            <AdminNavigation
              pathname={pathname}
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-auto flex items-center gap-3 rounded-xl border border-white/10 px-3.5 py-3 text-sm font-semibold text-primary-100"
            >
              <LogOut className="size-4.5 text-accent-300" aria-hidden="true" />
              Çıkış Yap
            </button>
          </aside>
        </div>
      ) : null}

      <main className="min-h-screen lg:pl-72">
        <div className="mx-auto max-w-[96rem] px-5 py-7 sm:px-8 sm:py-10 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
