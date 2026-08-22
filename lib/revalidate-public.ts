import "server-only";

import { revalidatePath } from "next/cache";

import { routing } from "@/i18n/routing";

export function revalidatePublicPath(path: string, type?: "layout" | "page") {
  const normalizedPath = path === "/" ? "" : path;

  // next-intl rewrites public, localized URLs to the file-system routes under
  // app/[locale]. The Full Route Cache is keyed by these internal paths, so
  // invalidate /tr/... and /en/... directly (including the prefix-less TR
  // locale) instead of the browser-facing aliases.
  for (const locale of routing.locales) {
    const internalPath = `/${locale}${normalizedPath}`;
    if (type) revalidatePath(internalPath, type);
    else revalidatePath(internalPath);
  }
}
