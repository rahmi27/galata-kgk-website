import createMiddleware from "next-intl/middleware";
import {NextResponse} from "next/server";

import {auth} from "@/auth";
import {routing} from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export const proxy = auth((request) => {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  return handleI18nRouting(request);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
