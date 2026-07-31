"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import {
  validateCollaborationItemForm,
  validatePartnerClubForm,
} from "@/lib/admin-validation";
import {
  deleteUploadedImage,
  saveImageUpload,
} from "@/lib/image-upload";
import { notifyIndexNow } from "@/lib/indexnow";
import { prisma } from "@/lib/prisma";
import { createNormalizedSlug } from "@/lib/slug";

async function refreshCollaborationPages(slugs: string[] = []) {
  revalidatePath("/is-birlikleri");
  revalidatePath("/admin/is-birlikleri");
  revalidatePath("/sitemap.xml");

  for (const slug of new Set(slugs.filter(Boolean))) {
    revalidatePath(`/is-birlikleri/${slug}`);
  }

  await notifyIndexNow([
    "/is-birlikleri",
    ...slugs.filter(Boolean).map((slug) => `/is-birlikleri/${slug}`),
  ]);
}

export async function createPartnerClubAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const validation = validatePartnerClubForm(formData);

  if (!validation.success) {
    return { success: false, message: validation.error };
  }

  const slug = createNormalizedSlug(validation.data.name, "partner-kulup");
  const existing = await prisma.partnerClub.findUnique({ where: { slug } });

  if (existing) {
    return {
      success: false,
      message: "Bu ada sahip bir partner kulüp zaten bulunuyor.",
    };
  }

  const imageUpload = await saveImageUpload(
    formData.get("partnerLogo"),
    "partners",
  );

  if (!imageUpload.success) {
    return { success: false, message: imageUpload.error };
  }

  if (!imageUpload.path) {
    return { success: false, message: "Partner kulüp logosu zorunludur." };
  }

  try {
    await prisma.partnerClub.create({
      data: {
        ...validation.data,
        slug,
        logoUrl: imageUpload.path,
      },
    });
    await refreshCollaborationPages([slug]);

    return { success: true, message: "Partner kulüp başarıyla eklendi." };
  } catch (error) {
    await deleteUploadedImage(imageUpload.path);
    console.error("Partner kulüp eklenemedi.", error);
    return {
      success: false,
      message: "Partner kulüp kaydedilemedi. Lütfen tekrar deneyin.",
    };
  }
}

export async function updatePartnerClubAction(
  partnerClubId: number,
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const validation = validatePartnerClubForm(formData);

  if (!validation.success) {
    return { success: false, message: validation.error };
  }

  const partnerClub = await prisma.partnerClub.findUnique({
    where: { id: partnerClubId },
  });

  if (!partnerClub) {
    return { success: false, message: "Düzenlenecek partner kulüp bulunamadı." };
  }

  const slug = createNormalizedSlug(validation.data.name, "partner-kulup");
  const slugOwner = await prisma.partnerClub.findFirst({
    where: { slug, id: { not: partnerClubId } },
    select: { id: true },
  });

  if (slugOwner) {
    return {
      success: false,
      message: "Bu ada sahip başka bir partner kulüp zaten bulunuyor.",
    };
  }

  const imageUpload = await saveImageUpload(
    formData.get("partnerLogo"),
    "partners",
  );

  if (!imageUpload.success) {
    return { success: false, message: imageUpload.error };
  }

  const nextLogoUrl = imageUpload.path ?? partnerClub.logoUrl;

  try {
    await prisma.partnerClub.update({
      where: { id: partnerClubId },
      data: {
        ...validation.data,
        slug,
        logoUrl: nextLogoUrl,
      },
    });

    if (imageUpload.path && partnerClub.logoUrl !== imageUpload.path) {
      await deleteUploadedImage(partnerClub.logoUrl);
    }

    await refreshCollaborationPages([partnerClub.slug, slug]);
  } catch (error) {
    await deleteUploadedImage(imageUpload.path);
    console.error("Partner kulüp güncellenemedi.", error);
    return {
      success: false,
      message: "Partner kulüp güncellenemedi. Lütfen tekrar deneyin.",
    };
  }

  redirect(`/admin/is-birlikleri/${partnerClubId}?durum=guncellendi`);
}

export async function deletePartnerClubAction(
  partnerClubId: number,
): Promise<AdminActionState> {
  await requireAdmin();
  const partnerClub = await prisma.partnerClub.findUnique({
    where: { id: partnerClubId },
    select: { logoUrl: true, slug: true },
  });

  if (!partnerClub) {
    return { success: false, message: "Silinecek partner kulüp bulunamadı." };
  }

  try {
    await prisma.partnerClub.delete({ where: { id: partnerClubId } });
    await deleteUploadedImage(partnerClub.logoUrl);
    await refreshCollaborationPages([partnerClub.slug]);
    return {
      success: true,
      message: "Partner kulüp ve bağlı iş birlikleri silindi.",
    };
  } catch (error) {
    console.error("Partner kulüp silinemedi.", error);
    return {
      success: false,
      message: "Partner kulüp silinemedi. Lütfen tekrar deneyin.",
    };
  }
}

export async function createCollaborationItemAction(
  partnerClubId: number,
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const validation = validateCollaborationItemForm(formData);

  if (!validation.success) {
    return { success: false, message: validation.error };
  }

  const partnerClub = await prisma.partnerClub.findUnique({
    where: { id: partnerClubId },
    select: { slug: true },
  });

  if (!partnerClub) {
    return { success: false, message: "Partner kulüp bulunamadı." };
  }

  try {
    await prisma.collaborationItem.create({
      data: { ...validation.data, partnerClubId },
    });
    await refreshCollaborationPages([partnerClub.slug]);
    revalidatePath(`/admin/is-birlikleri/${partnerClubId}`);
    return { success: true, message: "İş birliği maddesi eklendi." };
  } catch (error) {
    console.error("İş birliği maddesi eklenemedi.", error);
    return {
      success: false,
      message: "İş birliği maddesi kaydedilemedi.",
    };
  }
}

export async function updateCollaborationItemAction(
  partnerClubId: number,
  collaborationItemId: number,
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const validation = validateCollaborationItemForm(formData);

  if (!validation.success) {
    return { success: false, message: validation.error };
  }

  const item = await prisma.collaborationItem.findFirst({
    where: { id: collaborationItemId, partnerClubId },
    include: { partnerClub: { select: { slug: true } } },
  });

  if (!item) {
    return { success: false, message: "Düzenlenecek iş birliği bulunamadı." };
  }

  try {
    await prisma.collaborationItem.update({
      where: { id: collaborationItemId },
      data: validation.data,
    });
    await refreshCollaborationPages([item.partnerClub.slug]);
  } catch (error) {
    console.error("İş birliği maddesi güncellenemedi.", error);
    return {
      success: false,
      message: "İş birliği maddesi güncellenemedi.",
    };
  }

  redirect(`/admin/is-birlikleri/${partnerClubId}?durum=madde-guncellendi`);
}

export async function deleteCollaborationItemAction(
  partnerClubId: number,
  collaborationItemId: number,
): Promise<AdminActionState> {
  await requireAdmin();
  const item = await prisma.collaborationItem.findFirst({
    where: { id: collaborationItemId, partnerClubId },
    include: { partnerClub: { select: { slug: true } } },
  });

  if (!item) {
    return { success: false, message: "Silinecek iş birliği bulunamadı." };
  }

  try {
    await prisma.collaborationItem.delete({
      where: { id: collaborationItemId },
    });
    await refreshCollaborationPages([item.partnerClub.slug]);
    revalidatePath(`/admin/is-birlikleri/${partnerClubId}`);
    return { success: true, message: "İş birliği maddesi silindi." };
  } catch (error) {
    console.error("İş birliği maddesi silinemedi.", error);
    return {
      success: false,
      message: "İş birliği maddesi silinemedi.",
    };
  }
}
