"use server";

import { randomInt } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin-auth";
import { cleanEventText } from "@/lib/event-mode";
import { prisma } from "@/lib/prisma";

export async function saveRaffleNameAction(formData: FormData) {
  await requireAdmin();
  const name = cleanEventText(formData.get("raffleName"), 120);

  if (name.length < 3) {
    redirect("/admin/etkinlik-modu/cekilis?durum=gecersiz-ad");
  }

  const active = await prisma.eventSession.findFirst({
    where: { isActive: true },
    select: { id: true },
  });

  if (!active) {
    redirect("/admin/etkinlik-modu/cekilis?durum=oturum-yok");
  }

  await prisma.eventSession.update({
    where: { id: active.id },
    data: { raffleName: name },
  });
  revalidatePath("/admin/etkinlik-modu/cekilis");
  redirect("/admin/etkinlik-modu/cekilis?durum=ad-kaydedildi");
}

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
