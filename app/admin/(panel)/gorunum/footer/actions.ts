"use server";

import { revalidatePath, updateTag } from "next/cache";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { staticSiteContentDefinitions } from "@/lib/site-content-defaults";
import { isSafeHttpUrl } from "@/lib/url-security";

const footerDefinitions = staticSiteContentDefinitions.filter(
  (definition) =>
    definition.page === "footer" &&
    !definition.key.startsWith("footer.social."),
);
const optionalKeys = new Set<string>();
const urlKeys = new Set(["footer.institutionHref"]);

export async function updateFooterContentAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const updates = footerDefinitions.map((definition) => {
      const value = formData.get(definition.key)?.toString().trim() ?? "";

      if (!optionalKeys.has(definition.key) && value.length < 2) {
        throw new Error(`${definition.label} boş bırakılamaz.`);
      }

      if (value.length > 3000) {
        throw new Error(`${definition.label} çok uzun.`);
      }

      if (urlKeys.has(definition.key) && value && !isSafeHttpUrl(value)) {
        throw new Error(`${definition.label} geçerli bir http(s) adresi olmalıdır.`);
      }

      return { definition, value };
    });

    await prisma.$transaction(
      updates.map(({ definition, value }) =>
        prisma.siteContent.upsert({
          where: { key: definition.key },
          update: {
            value,
            label: definition.label,
            page: definition.page,
            type: definition.type,
          },
          create: {
            ...definition,
            value,
          },
        }),
      ),
    );

    updateTag("site-content");
    revalidatePath("/", "layout");
    revalidatePath("/admin/gorunum/footer");

    return {
      success: true,
      message: "Footer içeriği kaydedildi.",
    };
  } catch (error) {
    console.error("Footer içeriği güncellenemedi.", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Footer içeriği kaydedilemedi. Lütfen tekrar deneyin.",
    };
  }
}
