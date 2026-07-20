"use server";

import { revalidatePath } from "next/cache";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function markMessageAsReadAction(
  messageId: number,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    await prisma.contactSubmission.update({
      where: {
        id: messageId,
      },
      data: {
        isRead: true,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/mesajlar");
    revalidatePath(`/admin/mesajlar/${messageId}`);

    return {
      success: true,
      message: "Mesaj okundu olarak işaretlendi.",
    };
  } catch (error) {
    console.error("Mesaj durumu güncellenemedi.", error);

    return {
      success: false,
      message: "Mesaj durumu güncellenemedi. Lütfen tekrar deneyin.",
    };
  }
}
