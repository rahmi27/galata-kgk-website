"use server";

import { revalidatePath, updateTag } from "next/cache";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  headerNavigationDefinitions,
  staticSiteContentDefinitions,
} from "@/lib/site-content-defaults";
import { navigationRoutes } from "@/lib/site-content";

const headerDefinitions = staticSiteContentDefinitions.filter(
  (definition) => definition.page === "header",
);
const definitionByKey = new Map(
  headerDefinitions.map((definition) => [definition.key, definition]),
);
const editableTextKeys = [
  "header.brand.name",
  "header.cta.label",
  ...headerNavigationDefinitions
    .filter((definition) => definition.key.endsWith(".label"))
    .map((definition) => definition.key),
];

function readRequiredText(formData: FormData, key: string) {
  const value = formData.get(key)?.toString().trim() ?? "";

  if (value.length < 2 || value.length > 120) {
    throw new Error("Tüm metinler 2-120 karakter arasında olmalıdır.");
  }

  return value;
}

export async function updateHeaderContentAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const order = JSON.parse(
      formData.get("navigationOrder")?.toString() ?? "[]",
    ) as string[];
    const allowedIds = navigationRoutes.map((item) => item.id);

    if (
      order.length !== allowedIds.length ||
      new Set(order).size !== allowedIds.length ||
      order.some((id) => !allowedIds.includes(id as (typeof allowedIds)[number]))
    ) {
      return {
        success: false,
        message: "Menü sırası geçersiz. Sayfayı yenileyip tekrar deneyin.",
      };
    }

    const updates: Array<{ key: string; value: string; valueEn?: string | null }> = editableTextKeys.map((key) => {
      const valueEn = formData.get(`${key}.en`)?.toString().trim() || null;
      if (valueEn && (valueEn.length < 2 || valueEn.length > 120)) {
        throw new Error("İngilizce metinler boş bırakılmalı veya 2-120 karakter arasında olmalıdır.");
      }
      return { key, value: readRequiredText(formData, key), valueEn };
    });

    order.forEach((id, index) => {
      updates.push({
        key: `header.nav.${id}.order`,
        value: String(index + 1),
      });
    });

    await prisma.$transaction(
      updates.map(({ key, value, valueEn }) => {
        const definition = definitionByKey.get(key);

        if (!definition) {
          throw new Error(`İzin verilmeyen içerik anahtarı: ${key}`);
        }

        return prisma.siteContent.upsert({
          where: { key },
          update: {
            value,
            ...(valueEn !== undefined ? { valueEn } : {}),
            label: definition.label,
            page: definition.page,
            type: definition.type,
          },
          create: {
            ...definition,
            value,
            ...(valueEn !== undefined ? { valueEn } : {}),
          },
        });
      }),
    );

    updateTag("site-content");
    revalidatePath("/", "layout");
    revalidatePath("/admin/gorunum/header");

    return {
      success: true,
      message: "Header içeriği ve menü sırası kaydedildi.",
    };
  } catch (error) {
    console.error("Header içeriği güncellenemedi.", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Header içeriği kaydedilemedi. Lütfen tekrar deneyin.",
    };
  }
}
