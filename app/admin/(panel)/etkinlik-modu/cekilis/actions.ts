"use server";

import { randomInt } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function drawRaffleWinnerAction() {
  await requireAdmin();
  const active = await prisma.eventSession.findFirst({
    where: { isActive: true },
    select: {
      id: true,
      raffleEntries: {
        where: { winner: null },
        orderBy: { id: "asc" },
        select: { id: true },
      },
    },
  });
  if (!active || !active.raffleEntries.length) {
    redirect("/admin/etkinlik-modu/cekilis?durum=aday-yok");
  }
  const entry = active.raffleEntries[randomInt(active.raffleEntries.length)];
  await prisma.raffleWinner.create({
    data: { eventSessionId: active.id, raffleEntryId: entry.id },
  });
  revalidatePath("/admin/etkinlik-modu/cekilis");
  revalidatePath("/tr/etkinlik/ekran");
  revalidatePath("/en/etkinlik/ekran");
  redirect("/admin/etkinlik-modu/cekilis?durum=kazanan");
}
