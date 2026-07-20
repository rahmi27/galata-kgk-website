"use server";

import { revalidatePath } from "next/cache";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const membershipStatuses = [
  "beklemede",
  "onaylandı",
  "reddedildi",
] as const;

export type MembershipStatus = (typeof membershipStatuses)[number];

export async function updateMembershipStatusAction(
  applicationId: number,
  status: string,
): Promise<AdminActionState> {
  await requireAdmin();

  if (!membershipStatuses.includes(status as MembershipStatus)) {
    return {
      success: false,
      message: "Geçerli bir başvuru durumu seçin.",
    };
  }

  try {
    await prisma.membershipApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        status,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/katilim-basvurulari");

    return {
      success: true,
      message: "Başvuru durumu güncellendi.",
    };
  } catch (error) {
    console.error("Başvuru durumu güncellenemedi.", error);

    return {
      success: false,
      message: "Başvuru durumu güncellenemedi. Lütfen tekrar deneyin.",
    };
  }
}
