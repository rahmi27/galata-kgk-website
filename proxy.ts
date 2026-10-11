import createMiddleware from "next-intl/middleware";
import {NextResponse} from "next/server";

import {auth} from "@/auth";
import {routing} from "@/i18n/routing";
import {EVENT_PARTICIPANT_COOKIE, verifyParticipantToken} from "@/lib/event-participant-token";

const handleI18nRouting = createMiddleware(routing);
const handleRecruitmentRouting = createMiddleware({ ...routing, alternateLinks: false });

export const proxy = auth((request) => {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isEventEntry =
    request.nextUrl.pathname === "/etkinlik" ||
    request.nextUrl.pathname === "/en/event";
  const shouldResumeParticipant =
    request.method === "GET" &&
    isEventEntry &&
    request.nextUrl.searchParams.get("durum") !== "oturum-yenile";

  if (shouldResumeParticipant) {
    const token = request.cookies.get(EVENT_PARTICIPANT_COOKIE)?.value;
    if (token && verifyParticipantToken(token)) {
      const destination = request.nextUrl.pathname.startsWith("/en/")
        ? "/en/event/hub"
        : "/etkinlik/panel";
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  // Conditional recruitment pages are noindex and intentionally have no
  // hreflang alternates, including next-intl's HTTP Link header.
  const path = request.nextUrl.pathname.replace(/\/$/, "");
  if (["/katilim/saha-ekibi", "/tr/katilim/saha-ekibi", "/en/join/team"].includes(path)) {
    return handleRecruitmentRouting(request);
  }
  return handleI18nRouting(request);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
