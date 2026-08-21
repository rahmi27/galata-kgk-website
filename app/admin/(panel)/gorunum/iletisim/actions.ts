"use server";

import { revalidatePath, updateTag } from "next/cache";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { staticSiteContentDefinitions } from "@/lib/site-content-defaults";

const contactAddressDefinition = staticSiteContentDefinitions.find(
  (definition) => definition.key === "contact.address.value",
);

export async function updateContactContentAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    if (!contactAddressDefinition) {
      throw new Error("İletişim adresi içerik tanımı bulunamadı.");
    }

    const value =
      formData.get(contactAddressDefinition.key)?.toString().trim() ?? "";
    const valueEn = formData.get(`${contactAddressDefinition.key}.en`)?.toString().trim() || null;

    if (value.length < 10) {
      throw new Error("Adres en az 10 karakter olmalıdır.");
    }

    if (value.length > 500) {
      throw new Error("Adres en fazla 500 karakter olabilir.");
    }
    if (valueEn && valueEn.length > 500) throw new Error("İngilizce adres en fazla 500 karakter olabilir.");

    await prisma.siteContent.upsert({
      where: { key: contactAddressDefinition.key },
      update: {
        value,
        valueEn,
        label: contactAddressDefinition.label,
        page: contactAddressDefinition.page,
        type: contactAddressDefinition.type,
      },
      create: {
        ...contactAddressDefinition,
        value,
        valueEn,
      },
    });

    updateTag("site-content");
    revalidatePath("/iletisim");
    revalidatePath("/admin/gorunum/iletisim");

    return {
      success: true,
      message: "İletişim adresi kaydedildi.",
    };
  } catch (error) {
    console.error("İletişim adresi güncellenemedi.", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "İletişim adresi kaydedilemedi. Lütfen tekrar deneyin.",
    };
  }
}
