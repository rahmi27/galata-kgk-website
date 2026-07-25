"use server";

import { revalidatePath, updateTag } from "next/cache";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  repeatableSiteContentDefinitions,
  staticSiteContentDefinitions,
} from "@/lib/site-content-defaults";

const homeDefinitions = staticSiteContentDefinitions.filter(
  (definition) => definition.page === "anasayfa",
);
const topicsInitializer = repeatableSiteContentDefinitions.find(
  (definition) =>
    definition.key === "home.hero.spotlight.topics.initialized",
)!;

export async function updateHomeHeroContentAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const updates = homeDefinitions.map((definition) => {
      const value = formData.get(definition.key)?.toString().trim() ?? "";

      if (value.length < 2) {
        throw new Error(`${definition.label} boş bırakılamaz.`);
      }

      if (value.length > 3000) {
        throw new Error(`${definition.label} çok uzun.`);
      }

      return { definition, value };
    });
    const parsedTopics = JSON.parse(
      formData.get("spotlightTopics")?.toString() ?? "[]",
    );

    if (!Array.isArray(parsedTopics) || parsedTopics.length > 12) {
      throw new Error("Odak etiketleri geçersiz veya izin verilenden fazla.");
    }

    const topics = parsedTopics.map((topic) => {
      if (typeof topic !== "string") {
        throw new Error("Odak etiketi metin olmalıdır.");
      }

      const value = topic.trim();
      if (value.length < 2 || value.length > 80) {
        throw new Error("Her odak etiketi 2-80 karakter arasında olmalıdır.");
      }
      return value;
    });

    if (new Set(topics.map((topic) => topic.toLocaleLowerCase("tr"))).size !== topics.length) {
      throw new Error("Aynı odak etiketi birden fazla kez kullanılamaz.");
    }

    await prisma.$transaction([
      ...updates.map(({ definition, value }) =>
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
      prisma.siteContent.upsert({
        where: { key: topicsInitializer.key },
        update: { value: "true" },
        create: topicsInitializer,
      }),
      prisma.siteContent.deleteMany({
        where: {
          key: {
            startsWith: "home.hero.spotlight.topic.",
          },
        },
      }),
      prisma.siteContent.createMany({
        data: topics.map((value, index) => ({
          key: `home.hero.spotlight.topic.${String(index + 1).padStart(3, "0")}`,
          value,
          type: "text" as const,
          page: "anasayfa",
          label: "Odak etiketi",
        })),
      }),
    ]);

    updateTag("site-content");
    revalidatePath("/");
    revalidatePath("/admin/gorunum/anasayfa");

    return {
      success: true,
      message: "Anasayfa hero içeriği kaydedildi.",
    };
  } catch (error) {
    console.error("Anasayfa hero içeriği güncellenemedi.", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Hero içeriği kaydedilemedi. Lütfen tekrar deneyin.",
    };
  }
}
