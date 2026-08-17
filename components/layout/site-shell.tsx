"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { AmbientParticles } from "@/components/effects/ambient-particles";
import { PageScrollControl } from "@/components/effects/page-scroll-control";
import { ParticlePointerRuntime } from "@/components/effects/particle-pointer-runtime";
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
  const particleVariant = Array.from(pathname).reduce(
    (total, character, index) =>
      total + character.charCodeAt(0) * (index + 1),
    0,
  ) % 3;

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
    <div className="site-public-shell isolate grid min-h-screen grid-rows-[auto_1fr_auto] bg-background">
      <AmbientParticles
        variant={particleVariant}
        className="ambient-particles--global"
      />
      <Navbar content={content} />
      <div
        id="site-content"
        ref={contentRef}
        className="relative z-10 min-w-0 bg-transparent"
      >
        <ParticlePointerRuntime />
        <ScrollMotionRuntime routeKey={pathname} />
        {children}
      </div>
      <PageScrollControl />
      <Footer content={content} />
    </div>
  );
}
