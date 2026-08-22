import "server-only";

import { revalidatePath } from "next/cache";

import { localizedPublicPath } from "@/lib/site-metadata";

export function revalidatePublicPath(path: string, type?: "layout" | "page") {
  const paths = new Set([
    localizedPublicPath(path, "tr"),
    localizedPublicPath(path, "en"),
  ]);
  for (const localizedPath of paths) {
    if (type) revalidatePath(localizedPath, type);
    else revalidatePath(localizedPath);
  }
}
