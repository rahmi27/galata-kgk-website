"use server";

import { revalidatePath } from "next/cache";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { validateSponsorTierName } from "@/lib/sponsor-tier";

function parseOrder(formData: FormData) {
  const order = Number(formData.get("order"));
  return Number.isInteger(order) && order >= 0 && order <= 9999
    ? order
    : null;
}

function revalidateTierPages() {
  revalidatePath("/");
  revalidatePath("/sponsorlar");
  revalidatePath("/admin/sponsorlar");
  revalidatePath("/admin/sponsorlar/kategoriler");
}

export async function createSponsorTierAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const validation = validateSponsorTierName(String(formData.get("name") ?? ""));
  const order = parseOrder(formData);

  if (!validation.success) {
    return { success: false, message: validation.error };
  }

  if (order === null) {
    return {
      success: false,
      message: "Sıralama 0–9999 arasında tam sayı olmalıdır.",
    };
  }

  const duplicate = await prisma.sponsorTier.findUnique({
    where: { slug: validation.data.slug },
    select: { id: true },
  });

  if (duplicate) {
    return {
      success: false,
      message:
        "Bu tier aynı veya farklı büyük/küçük harf kullanımıyla zaten mevcut.",
    };
  }

  try {
    await prisma.sponsorTier.create({
      data: { ...validation.data, order },
    });
    revalidateTierPages();
    return { success: true, message: "Sponsor tier'ı oluşturuldu." };
  } catch (error) {
    console.error("Sponsor tier'ı oluşturulamadı.", error);
    return {
      success: false,
      message: "Tier oluşturulamadı. Lütfen tekrar deneyin.",
    };
  }
}

export async function updateSponsorTierAction(
  tierId: number,
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const validation = validateSponsorTierName(String(formData.get("name") ?? ""));
  const order = parseOrder(formData);

  if (!validation.success) {
    return { success: false, message: validation.error };
  }

  if (order === null) {
    return {
      success: false,
      message: "Sıralama 0–9999 arasında tam sayı olmalıdır.",
    };
  }

  const duplicate = await prisma.sponsorTier.findFirst({
    where: {
      slug: validation.data.slug,
      id: { not: tierId },
    },
    select: { id: true },
  });

  if (duplicate) {
    return {
      success: false,
      message:
        "Bu tier aynı veya farklı büyük/küçük harf kullanımıyla zaten mevcut.",
    };
  }

  try {
    await prisma.sponsorTier.update({
      where: { id: tierId },
      data: { ...validation.data, order },
    });
    revalidateTierPages();
    return { success: true, message: "Sponsor tier'ı güncellendi." };
  } catch (error) {
    console.error("Sponsor tier'ı güncellenemedi.", error);
    return {
      success: false,
      message: "Tier güncellenemedi veya artık mevcut değil.",
    };
  }
}

export async function deleteSponsorTierAction(
  tierId: number,
): Promise<AdminActionState> {
  await requireAdmin();

  const tier = await prisma.sponsorTier.findUnique({
    where: { id: tierId },
    select: {
      id: true,
      _count: { select: { sponsors: true } },
    },
  });

  if (!tier) {
    return { success: false, message: "Silmek istediğiniz tier bulunamadı." };
  }

  if (tier._count.sponsors > 0) {
    return {
      success: false,
      message: `Bu tier'a bağlı ${tier._count.sponsors} sponsor var. Önce sponsorları başka bir tier'a taşıyın.`,
    };
  }

  try {
    await prisma.sponsorTier.delete({ where: { id: tier.id } });
    revalidateTierPages();
    return { success: true, message: "Sponsor tier'ı silindi." };
  } catch (error) {
    console.error("Sponsor tier'ı silinemedi.", error);
    return {
      success: false,
      message: "Tier silinemedi. Lütfen tekrar deneyin.",
    };
  }
}
