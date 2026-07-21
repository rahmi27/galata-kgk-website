import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentAdmin() {
  const session = await auth();
  const username = session?.user?.username;

  if (!username) {
    return null;
  }

  return prisma.adminUser.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      name: true,
    },
  });
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/giris");
  }

  return admin;
}
