import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import {
  normalizeUsername,
  usernamePattern,
} from "@/lib/admin-credentials";
import { prisma } from "@/lib/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
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
      async authorize(credentials) {
        const username =
          typeof credentials.username === "string"
            ? normalizeUsername(credentials.username)
            : "";
        const password =
          typeof credentials.password === "string" ? credentials.password : "";

        if (!usernamePattern.test(username) || password.length < 8) {
          return null;
        }

        const admin = await prisma.adminUser.findUnique({
          where: {
            username,
          },
        });

        if (!admin || !(await compare(password, admin.passwordHash))) {
          return null;
        }

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

      return Boolean(session?.user);
    },
  },
});
