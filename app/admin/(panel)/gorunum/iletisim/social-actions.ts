"use server";

import { revalidatePath, updateTag } from "next/cache";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  getSocialPlatformLabel,
  isSocialPlatform,
} from "@/lib/social-platforms";

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function refreshSocialLinks() {
  updateTag("club-social-links");
  revalidatePath("/", "layout");
  revalidatePath("/iletisim");
  revalidatePath("/admin/gorunum/iletisim");
}

export async function saveClubSocialLinkAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  const platform = formData.get("platform")?.toString().trim() ?? "";
  const customLabel = formData.get("label")?.toString().trim() ?? "";
  const url = formData.get("url")?.toString().trim() ?? "";
  const order = Number(formData.get("order")?.toString() ?? "0");

  if (!isSocialPlatform(platform)) {
    return { success: false, message: "Geçerli bir platform seçin." };
  }

  if (!isValidHttpUrl(url) || url.length > 500) {
    return {
      success: false,
      message: "Bağlantı geçerli bir http(s) adresi olmalıdır.",
    };
  }

  if (customLabel.length > 80) {
    return { success: false, message: "Görünen ad en fazla 80 karakter olabilir." };
  }

  if (!Number.isInteger(order) || order < 0 || order > 9999) {
    return { success: false, message: "Sıralama 0–9999 arasında olmalıdır." };
  }

  try {
    await prisma.clubSocialLink.upsert({
      where: { platform },
      update: {
        label: customLabel || getSocialPlatformLabel(platform),
        url,
        order,
      },
      create: {
        platform,
        label: customLabel || getSocialPlatformLabel(platform),
        url,
        order,
      },
    });
    await refreshSocialLinks();

    return {
      success: true,
      message: `${getSocialPlatformLabel(platform)} hesabı kaydedildi.`,
    };
  } catch (error) {
    console.error("Kulüp sosyal medya hesabı kaydedilemedi.", error);
    return {
      success: false,
      message: "Hesap kaydedilemedi. Lütfen tekrar deneyin.",
    };
  }
}

export async function deleteClubSocialLinkAction(
  linkId: number,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    await prisma.clubSocialLink.delete({ where: { id: linkId } });
    await refreshSocialLinks();
    return { success: true, message: "Sosyal medya hesabı kaldırıldı." };
  } catch (error) {
    console.error("Kulüp sosyal medya hesabı silinemedi.", error);
    return {
      success: false,
      message: "Hesap silinemedi veya artık mevcut değil.",
    };
  }
}
