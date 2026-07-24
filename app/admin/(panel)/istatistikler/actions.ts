"use server";

import { revalidatePath } from "next/cache";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import { validateSiteStatForm } from "@/lib/admin-validation";
import { notifyIndexNow } from "@/lib/indexnow";
import { prisma } from "@/lib/prisma";

async function revalidateSiteStats() {
  revalidatePath("/");
  revalidatePath("/sponsorlar");
  revalidatePath("/admin/istatistikler");
  await notifyIndexNow(["/", "/sponsorlar"]);
}

export async function createSiteStatAction(
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
    await prisma.siteStat.create({
      data: validation.data,
    });

    await revalidateSiteStats();

    return {
      success: true,
      message: "İstatistik kartı eklendi.",
    };
  } catch (error) {
    console.error("İstatistik kartı eklenemedi.", error);

    return {
      success: false,
      message: "İstatistik kartı eklenemedi. Lütfen tekrar deneyin.",
    };
  }
}

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

    await revalidateSiteStats();

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

export async function deleteSiteStatAction(
  statId: number,
): Promise<AdminActionState> {
  await requireAdmin();

  if (!Number.isInteger(statId) || statId <= 0) {
    return {
      success: false,
      message: "Silinecek istatistik kartı geçersiz.",
    };
  }

  try {
    await prisma.siteStat.delete({
      where: {
        id: statId,
      },
    });

    await revalidateSiteStats();

    return {
      success: true,
      message: "İstatistik kartı silindi.",
    };
  } catch (error) {
    console.error("İstatistik kartı silinemedi.", error);

    return {
      success: false,
      message: "İstatistik kartı silinemedi veya artık mevcut değil.",
    };
  }
}
