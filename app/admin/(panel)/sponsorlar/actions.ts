"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import { validateSponsorForm } from "@/lib/admin-validation";
import {
  deleteUploadedImage,
  saveImageUpload,
} from "@/lib/image-upload";
import { prisma } from "@/lib/prisma";
import { validateSponsorTierName } from "@/lib/sponsor-tier";

function revalidateSponsorPages() {
  revalidatePath("/");
  revalidatePath("/sponsorlar");
  revalidatePath("/admin/sponsorlar");
  revalidatePath("/admin/sponsorlar/kategoriler");
}

async function resolveTier(tierId: number | null, newTierName: string | null) {
  if (tierId) {
    return prisma.sponsorTier.findUnique({ where: { id: tierId } });
  }

  const validation = validateSponsorTierName(newTierName ?? "");

  if (!validation.success) {
    return null;
  }

  const existingTier = await prisma.sponsorTier.findUnique({
    where: { slug: validation.data.slug },
  });

  if (existingTier) {
    return existingTier;
  }

  const highestOrder = await prisma.sponsorTier.aggregate({
    _max: { order: true },
  });

  return prisma.sponsorTier.create({
    data: {
      ...validation.data,
      order: (highestOrder._max.order ?? 0) + 1,
    },
  });
}

export async function createSponsorAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const validation = validateSponsorForm(formData);

  if (!validation.success) {
    return { success: false, message: validation.error };
  }

  const imageUpload = await saveImageUpload(
    formData.get("sponsorLogo"),
    "sponsors",
  );

  if (!imageUpload.success) {
    return { success: false, message: imageUpload.error };
  }

  if (!imageUpload.path) {
    return { success: false, message: "Sponsor logosu seçmelisiniz." };
  }

  const tier = await resolveTier(
    validation.data.tierId,
    validation.data.newTierName,
  );

  if (!tier) {
    await deleteUploadedImage(imageUpload.path);
    return { success: false, message: "Seçilen sponsor tier'ı bulunamadı." };
  }

  try {
    await prisma.sponsor.create({
      data: {
        name: validation.data.name,
        websiteUrl: validation.data.websiteUrl,
        description: validation.data.description,
        order: validation.data.order,
        tierId: tier.id,
        logoUrl: imageUpload.path,
        logoAlt: validation.data.logoAlt,
      },
    });
    revalidateSponsorPages();

    return { success: true, message: "Sponsor başarıyla eklendi." };
  } catch (error) {
    await deleteUploadedImage(imageUpload.path);
    console.error("Sponsor eklenemedi.", error);
    return {
      success: false,
      message: "Sponsor kaydedilemedi. Lütfen tekrar deneyin.",
    };
  }
}

export async function updateSponsorAction(
  sponsorId: number,
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const validation = validateSponsorForm(formData);

  if (!validation.success) {
    return { success: false, message: validation.error };
  }

  const sponsor = await prisma.sponsor.findUnique({
    where: { id: sponsorId },
  });

  if (!sponsor) {
    return { success: false, message: "Düzenlemek istediğiniz sponsor bulunamadı." };
  }

  const imageUpload = await saveImageUpload(
    formData.get("sponsorLogo"),
    "sponsors",
  );

  if (!imageUpload.success) {
    return { success: false, message: imageUpload.error };
  }

  const tier = await resolveTier(
    validation.data.tierId,
    validation.data.newTierName,
  );

  if (!tier) {
    await deleteUploadedImage(imageUpload.path);
    return { success: false, message: "Seçilen sponsor tier'ı bulunamadı." };
  }

  try {
    await prisma.sponsor.update({
      where: { id: sponsorId },
      data: {
        name: validation.data.name,
        websiteUrl: validation.data.websiteUrl,
        description: validation.data.description,
        order: validation.data.order,
        tierId: tier.id,
        logoUrl: imageUpload.path ?? sponsor.logoUrl,
        logoAlt: validation.data.logoAlt,
      },
    });

    if (imageUpload.path && imageUpload.path !== sponsor.logoUrl) {
      await deleteUploadedImage(sponsor.logoUrl);
    }

    revalidateSponsorPages();
  } catch (error) {
    await deleteUploadedImage(imageUpload.path);
    console.error("Sponsor güncellenemedi.", error);
    return {
      success: false,
      message: "Sponsor güncellenemedi. Lütfen tekrar deneyin.",
    };
  }

  redirect("/admin/sponsorlar?durum=guncellendi");
}

export async function deleteSponsorAction(
  sponsorId: number,
): Promise<AdminActionState> {
  await requireAdmin();

  const sponsor = await prisma.sponsor.findUnique({
    where: { id: sponsorId },
    select: { logoUrl: true },
  });

  if (!sponsor) {
    return { success: false, message: "Silmek istediğiniz sponsor bulunamadı." };
  }

  try {
    await prisma.sponsor.delete({ where: { id: sponsorId } });
    await deleteUploadedImage(sponsor.logoUrl);
    revalidateSponsorPages();
    return { success: true, message: "Sponsor silindi." };
  } catch (error) {
    console.error("Sponsor silinemedi.", error);
    return {
      success: false,
      message: "Sponsor silinemedi. Lütfen tekrar deneyin.",
    };
  }
}
