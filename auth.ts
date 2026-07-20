import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { prisma } from "@/lib/prisma";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        email: {
          label: "E-posta",
          type: "email",
        },
        password: {
          label: "Şifre",
          type: "password",
        },
      },
      async authorize(credentials) {
        const email =
          typeof credentials.email === "string"
            ? credentials.email.trim().toLocaleLowerCase("tr-TR")
            : "";
        const password =
          typeof credentials.password === "string" ? credentials.password : "";

        if (!emailPattern.test(email) || password.length < 8) {
          return null;
        }

        const admin = await prisma.adminUser.findUnique({
          where: {
            email,
          },
        });

        if (!admin || !(await compare(password, admin.passwordHash))) {
          return null;
        }

        return {
          id: String(admin.id),
          email: admin.email,
          name: admin.name,
        };
      },
    }),
  ],
  callbacks: {
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
