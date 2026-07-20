import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { prisma } from "@/lib/prisma";

const usernamePattern = /^[a-z0-9._-]{3,32}$/;

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
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
            ? credentials.username.trim().toLocaleLowerCase("tr-TR")
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
