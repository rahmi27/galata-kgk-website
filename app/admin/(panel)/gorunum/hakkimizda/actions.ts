"use server";

import { revalidatePath, updateTag } from "next/cache";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  repeatableSiteContentDefinitions,
  staticSiteContentDefinitions,
} from "@/lib/site-content-defaults";

const aboutDefinitions = staticSiteContentDefinitions.filter(
  (definition) => definition.page === "hakkimizda",
);
const milestonesInitializer = repeatableSiteContentDefinitions.find(
  (definition) =>
    definition.key === "about.timeline.milestones.initialized",
)!;

type MilestoneInput = {
  year: string;
  title: string;
  description: string;
};

function parseMilestones(formData: FormData): MilestoneInput[] {
  const parsed = JSON.parse(
    formData.get("timelineMilestones")?.toString() ?? "[]",
  ) as unknown;

  if (!Array.isArray(parsed) || parsed.length > 12) {
    throw new Error("Kilometre taşı listesi geçersiz veya çok uzun.");
  }

  return parsed.map((item) => {
    if (!item || typeof item !== "object") {
      throw new Error("Kilometre taşı bilgileri geçersiz.");
    }

    const candidate = item as Record<string, unknown>;
    const year =
      typeof candidate.year === "string" ? candidate.year.trim() : "";
    const title =
      typeof candidate.title === "string" ? candidate.title.trim() : "";
    const description =
      typeof candidate.description === "string"
        ? candidate.description.trim()
        : "";

    if (
      year.length < 2 ||
      year.length > 40 ||
      title.length < 2 ||
      title.length > 160 ||
      description.length < 2 ||
      description.length > 1000
    ) {
      throw new Error(
        "Kilometre taşlarındaki yıl, başlık ve açıklama alanlarını kontrol edin.",
      );
    }

    return { year, title, description };
  });
}

function parseEnglishMilestones(formData: FormData, expectedLength: number): Array<MilestoneInput | null> {
  const parsed = JSON.parse(formData.get("timelineMilestonesEn")?.toString() ?? "[]") as unknown;
  if (!Array.isArray(parsed) || parsed.length !== expectedLength) {
    throw new Error("İngilizce kilometre taşı listesi geçersiz.");
  }
  return parsed.map((item) => {
    if (!item || typeof item !== "object") throw new Error("İngilizce kilometre taşı bilgileri geçersiz.");
    const candidate = item as Record<string, unknown>;
    const year = typeof candidate.year === "string" ? candidate.year.trim() : "";
    const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
    const description = typeof candidate.description === "string" ? candidate.description.trim() : "";
    if (!year && !title && !description) return null;
    if (year.length < 2 || year.length > 40 || title.length < 2 || title.length > 160 || description.length < 2 || description.length > 1000) {
      throw new Error("İngilizce kilometre taşı ya tamamen boş olmalı ya da tüm alanları geçerli olmalıdır.");
    }
    return { year, title, description };
  });
}

export async function updateAboutContentAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const updates = aboutDefinitions.map((definition) => {
      const value = formData.get(definition.key)?.toString().trim() ?? "";

      if (value.length < 2) {
        throw new Error(`${definition.label} boş bırakılamaz.`);
      }

      if (value.length > 5000) {
        throw new Error(`${definition.label} çok uzun.`);
      }

      const valueEn = formData.get(`${definition.key}.en`)?.toString().trim() || null;
      if (valueEn && valueEn.length > 5000) throw new Error(`${definition.label} İngilizce metni çok uzun.`);
      return { definition, value, valueEn };
    });
    const milestones = parseMilestones(formData);
    const milestonesEn = parseEnglishMilestones(formData, milestones.length);

    await prisma.$transaction([
      ...updates.map(({ definition, value, valueEn }) =>
        prisma.siteContent.upsert({
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
        }),
      ),
      prisma.siteContent.upsert({
        where: { key: milestonesInitializer.key },
        update: { value: "true" },
        create: milestonesInitializer,
      }),
      prisma.siteContent.deleteMany({
        where: {
          key: {
            startsWith: "about.timeline.milestone.",
          },
        },
      }),
      prisma.siteContent.createMany({
        data: milestones.map((milestone, index) => ({
          key: `about.timeline.milestone.${String(index + 1).padStart(3, "0")}`,
          value: JSON.stringify(milestone),
          valueEn: milestonesEn[index] ? JSON.stringify(milestonesEn[index]) : null,
          type: "richtext" as const,
          page: "hakkimizda",
          label: "Zaman tüneli kilometre taşı",
        })),
      }),
    ]);

    updateTag("site-content");
    revalidatePath("/hakkimizda");
    revalidatePath("/admin/gorunum/hakkimizda");

    return {
      success: true,
      message: "Hakkımızda sayfası içeriği kaydedildi.",
    };
  } catch (error) {
    console.error("Hakkımızda içeriği güncellenemedi.", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Hakkımızda içeriği kaydedilemedi. Lütfen tekrar deneyin.",
    };
  }
}
