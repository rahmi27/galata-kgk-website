"use server";

import { revalidatePath, updateTag } from "next/cache";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { staticSiteContentDefinitions } from "@/lib/site-content-defaults";
import { revalidatePublicPath } from "@/lib/revalidate-public";
import { getSafeEmailAddress } from "@/lib/url-security";

const contactDefinitions = staticSiteContentDefinitions.filter((definition) =>
  ["contact.address.value", "contact.email.value"].includes(definition.key),
);

export async function updateContactContentAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    if (contactDefinitions.length !== 2) {
      throw new Error("İletişim içerik tanımları bulunamadı.");
    }

    const address = formData.get("contact.address.value")?.toString().trim() ?? "";
    const addressEn = formData.get("contact.address.value.en")?.toString().trim() || null;
    const email = getSafeEmailAddress(
      formData.get("contact.email.value")?.toString(),
    );

    if (address.length < 10) {
      throw new Error("Adres en az 10 karakter olmalıdır.");
    }

    if (address.length > 500) {
      throw new Error("Adres en fazla 500 karakter olabilir.");
    }
    if (addressEn && addressEn.length > 500) {
      throw new Error("İngilizce adres en fazla 500 karakter olabilir.");
    }
    if (!email) {
      throw new Error("Geçerli bir kulüp e-posta adresi girin.");
    }

    await prisma.$transaction(
      contactDefinitions.map((definition) => {
        const isAddress = definition.key === "contact.address.value";
        const value = isAddress ? address : email;
        const valueEn = isAddress ? addressEn : email;

        return prisma.siteContent.upsert({
          where: { key: definition.key },
          update: {
            value,
            valueEn,
            label: definition.label,
            page: definition.page,
            type: definition.type,
          },
          create: {
            ...definition,
            value,
            valueEn,
          },
        });
      }),
    );

    updateTag("site-content");
    revalidatePublicPath("/iletisim");
    revalidatePublicPath("/", "layout");
    revalidatePath("/admin/gorunum/iletisim");

    return {
      success: true,
      message: "İletişim bilgileri kaydedildi.",
    };
  } catch (error) {
    console.error("İletişim bilgileri güncellenemedi.", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "İletişim bilgileri kaydedilemedi. Lütfen tekrar deneyin.",
    };
  }
}
