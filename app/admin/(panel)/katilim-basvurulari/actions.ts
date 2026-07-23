"use server";

import { revalidatePath } from "next/cache";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import {
  membershipStatuses,
  type MembershipStatus,
} from "@/lib/membership-status";
import { prisma } from "@/lib/prisma";

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

export async function deleteMembershipApplicationAction(
  applicationId: number,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    await prisma.membershipApplication.delete({
      where: {
        id: applicationId,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/katilim-basvurulari");

    return {
      success: true,
      message: "Katılım başvurusu kalıcı olarak silindi.",
    };
  } catch (error) {
    console.error("Katılım başvurusu silinemedi.", error);

    return {
      success: false,
      message: "Başvuru silinemedi veya artık mevcut değil.",
    };
  }
}
