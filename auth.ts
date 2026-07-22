import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import {
  clearAdminLoginAttempts,
  getClientIp,
  isAdminLoginRateLimited,
  recordFailedAdminLogin,
} from "@/lib/admin-login-rate-limit";
import {
  normalizeUsername,
  usernamePattern,
} from "@/lib/admin-credentials";
import { prisma } from "@/lib/prisma";

const developmentHostTrust =
  process.env.NODE_ENV === "development" ? { trustHost: true } : {};

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...developmentHostTrust,
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  pages: {
    signIn: "/admin/giris",
  },
  providers: [
    Credentials({
      name: "Yönetici hesabı",
      credentials: {
        username: {
          label: "Kullanıcı Adı",
          type: "text",
        },
        password: {
          label: "Şifre",
          type: "password",
        },
      },
      async authorize(credentials, request) {
        const username =
          typeof credentials.username === "string"
            ? normalizeUsername(credentials.username)
            : "";
        const password =
          typeof credentials.password === "string" ? credentials.password : "";
        const rateLimitUsername = usernamePattern.test(username)
          ? username
          : "__invalid__";
        const ipAddress = getClientIp(request);

        if (
          await isAdminLoginRateLimited(rateLimitUsername, ipAddress)
        ) {
          return null;
        }

        if (!usernamePattern.test(username) || password.length < 8) {
          await recordFailedAdminLogin(rateLimitUsername, ipAddress);
          return null;
        }

        const admin = await prisma.adminUser.findUnique({
          where: {
            username,
          },
        });

        if (!admin || !(await compare(password, admin.passwordHash))) {
          await recordFailedAdminLogin(rateLimitUsername, ipAddress);
          return null;
        }

        await clearAdminLoginAttempts(rateLimitUsername, ipAddress);

        return {
          id: String(admin.id),
          name: admin.name,
          username: admin.username,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.username = user.username;
      }

      return token;
    },
    session({ session, token }) {
      session.user.username =
        typeof token.username === "string" ? token.username : "";
      return session;
    },
    authorized({ auth: session, request }) {
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      const isLoginRoute = request.nextUrl.pathname === "/admin/giris";

      if (!isAdminRoute || isLoginRoute) {
        return true;
      }

      if (session?.user) {
        return true;
      }

      if (process.env.NODE_ENV !== "development") {
        return false;
      }

      const forwardedHost = request.headers
        .get("x-forwarded-host")
        ?.split(",")[0]
        ?.trim();
      const requestHost = forwardedHost ?? request.headers.get("host");

      if (!requestHost) {
        return false;
      }

      const forwardedProtocol = request.headers
        .get("x-forwarded-proto")
        ?.split(",")[0]
        ?.trim();
      const protocol = forwardedProtocol === "https" ? "https" : "http";
      const externalOrigin = `${protocol}://${requestHost}`;
      const signInUrl = new URL("/admin/giris", externalOrigin);
      const callbackUrl = new URL(
        `${request.nextUrl.pathname}${request.nextUrl.search}`,
        externalOrigin,
      );

      signInUrl.searchParams.set("callbackUrl", callbackUrl.href);

      return Response.redirect(signInUrl);
    },
  },
});
