"use server";

import { revalidatePath } from "next/cache";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import { validateSiteStatForm } from "@/lib/admin-validation";
import { prisma } from "@/lib/prisma";

export async function updateSiteStatAction(
  statId: number,
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const validation = validateSiteStatForm(formData);

  if (!validation.success) {
    return {
      success: false,
      message: validation.error,
    };
  }

  try {
    await prisma.siteStat.update({
      where: {
        id: statId,
      },
      data: validation.data,
    });

    revalidatePath("/");
    revalidatePath("/sponsorlar");
    revalidatePath("/admin/istatistikler");

    return {
      success: true,
      message: "İstatistik kartı güncellendi.",
    };
  } catch (error) {
    console.error("İstatistik güncellenemedi.", error);

    return {
      success: false,
      message: "İstatistik güncellenemedi veya artık mevcut değil.",
    };
  }
}
