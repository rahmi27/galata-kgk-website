"use client";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import type { SiteChromeContent } from "@/lib/site-content";

type SiteShellProps = {
  children: React.ReactNode;
  content: SiteChromeContent;
};

export function SiteShell({ children, content }: SiteShellProps) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) {
    return children;
  }

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto] bg-background">
      <Navbar content={content} />
      <div key={pathname} className="page-enter min-w-0 bg-background">
        {children}
      </div>
      <Footer content={content} />
    </div>
  );
}
