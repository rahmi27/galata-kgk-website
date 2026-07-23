"use server";

import { revalidatePath } from "next/cache";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import { notifyIndexNow } from "@/lib/indexnow";
import { prisma } from "@/lib/prisma";
import { validateTeamCategoryName } from "@/lib/team-category";

function parseOrder(formData: FormData) {
  const order = Number(formData.get("order"));
  return Number.isInteger(order) && order >= 0 && order <= 9999
    ? order
    : null;
}

async function refreshCategoryPages() {
  revalidatePath("/ekibimiz");
  revalidatePath("/admin/ekip");
  revalidatePath("/admin/ekip/kategoriler");
  await notifyIndexNow(["/ekibimiz"]);
}

export async function createTeamCategoryAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const nameValidation = validateTeamCategoryName(
    String(formData.get("name") ?? ""),
  );
  const order = parseOrder(formData);

  if (!nameValidation.success) {
    return {
      success: false,
      message: nameValidation.error,
    };
  }

  if (order === null) {
    return {
      success: false,
      message: "Sıralama 0–9999 arasında tam sayı olmalıdır.",
    };
  }

  const duplicate = await prisma.teamCategory.findUnique({
    where: {
      slug: nameValidation.data.slug,
    },
    select: {
      id: true,
    },
  });

  if (duplicate) {
    return {
      success: false,
      message:
        "Bu kategori aynı veya farklı büyük/küçük harf kullanımıyla zaten mevcut.",
    };
  }

  try {
    await prisma.teamCategory.create({
      data: {
        ...nameValidation.data,
        order,
      },
    });
    await refreshCategoryPages();

    return {
      success: true,
      message: "Ekip kategorisi oluşturuldu.",
    };
  } catch (error) {
    console.error("Ekip kategorisi oluşturulamadı.", error);

    return {
      success: false,
      message: "Kategori oluşturulamadı. Lütfen tekrar deneyin.",
    };
  }
}

export async function updateTeamCategoryAction(
  categoryId: number,
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const nameValidation = validateTeamCategoryName(
    String(formData.get("name") ?? ""),
  );
  const order = parseOrder(formData);

  if (!nameValidation.success) {
    return {
      success: false,
      message: nameValidation.error,
    };
  }

  if (order === null) {
    return {
      success: false,
      message: "Sıralama 0–9999 arasında tam sayı olmalıdır.",
    };
  }

  const duplicate = await prisma.teamCategory.findFirst({
    where: {
      slug: nameValidation.data.slug,
      id: {
        not: categoryId,
      },
    },
    select: {
      id: true,
    },
  });

  if (duplicate) {
    return {
      success: false,
      message:
        "Bu kategori aynı veya farklı büyük/küçük harf kullanımıyla zaten mevcut.",
    };
  }

  try {
    await prisma.teamCategory.update({
      where: {
        id: categoryId,
      },
      data: {
        ...nameValidation.data,
        order,
      },
    });
    await refreshCategoryPages();

    return {
      success: true,
      message: "Kategori güncellendi.",
    };
  } catch (error) {
    console.error("Ekip kategorisi güncellenemedi.", error);

    return {
      success: false,
      message: "Kategori güncellenemedi veya artık mevcut değil.",
    };
  }
}

export async function deleteTeamCategoryAction(
  categoryId: number,
): Promise<AdminActionState> {
  await requireAdmin();

  const category = await prisma.teamCategory.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
      _count: {
        select: {
          members: true,
        },
      },
    },
  });

  if (!category) {
    return {
      success: false,
      message: "Silmek istediğiniz kategori bulunamadı.",
    };
  }

  if (category._count.members > 0) {
    return {
      success: false,
      message: `Bu kategoriye bağlı ${category._count.members} ekip üyesi var. Önce üyeleri başka kategoriye taşıyın.`,
    };
  }

  try {
    await prisma.teamCategory.delete({
      where: {
        id: category.id,
      },
    });
    await refreshCategoryPages();

    return {
      success: true,
      message: "Ekip kategorisi silindi.",
    };
  } catch (error) {
    console.error("Ekip kategorisi silinemedi.", error);

    return {
      success: false,
      message: "Kategori silinemedi. Lütfen tekrar deneyin.",
    };
  }
}
