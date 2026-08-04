"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { ScrollMotionRuntime } from "@/components/effects/scroll-motion-runtime";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import type { SiteChromeContent } from "@/lib/site-content";

type SiteShellProps = {
  children: React.ReactNode;
  content: SiteChromeContent;
};

export function SiteShell({ children, content }: SiteShellProps) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const previousPathname = useRef(pathname);
  const isAdminRoute =
    pathname === "/admin" || pathname.startsWith("/admin/");

  useLayoutEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }

    previousPathname.current = pathname;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const animation = contentRef.current?.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      {
        duration: 100,
        easing: "ease-out",
      },
    );

    return () => animation?.cancel();
  }, [pathname]);

  if (isAdminRoute) {
    return children;
  }

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto] bg-background">
      <Navbar content={content} />
      <div
        id="site-content"
        ref={contentRef}
        className="min-w-0 bg-background"
      >
        <ScrollMotionRuntime routeKey={pathname} />
        {children}
      </div>
      <Footer content={content} />
    </div>
  );
}
