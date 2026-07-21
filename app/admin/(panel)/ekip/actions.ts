"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import { validateTeamMemberForm } from "@/lib/admin-validation";
import {
  deleteUploadedImage,
  saveImageUpload,
} from "@/lib/image-upload";
import { prisma } from "@/lib/prisma";
import { validateTeamCategoryName } from "@/lib/team-category";

function revalidateTeamPages() {
  revalidatePath("/ekibimiz");
  revalidatePath("/admin");
  revalidatePath("/admin/ekip");
  revalidatePath("/admin/ekip/kategoriler");
}

async function resolveCategory(
  categoryId: number | null,
  newCategoryName: string | null,
) {
  if (categoryId) {
    return prisma.teamCategory.findUnique({
      where: {
        id: categoryId,
      },
    });
  }

  const categoryValidation = validateTeamCategoryName(newCategoryName ?? "");

  if (!categoryValidation.success) {
    return null;
  }

  const existingCategory = await prisma.teamCategory.findUnique({
    where: {
      slug: categoryValidation.data.slug,
    },
  });

  if (existingCategory) {
    return existingCategory;
  }

  const highestOrder = await prisma.teamCategory.aggregate({
    _max: {
      order: true,
    },
  });

  return prisma.teamCategory.create({
    data: {
      ...categoryValidation.data,
      order: (highestOrder._max.order ?? 0) + 1,
    },
  });
}

export async function createTeamMemberAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const validation = validateTeamMemberForm(formData);

  if (!validation.success) {
    return {
      success: false,
      message: validation.error,
    };
  }

  const imageUpload = await saveImageUpload(
    formData.get("memberPhoto"),
    "team",
  );

  if (!imageUpload.success) {
    return {
      success: false,
      message: imageUpload.error,
    };
  }

  const category = await resolveCategory(
    validation.data.categoryId,
    validation.data.newCategoryName,
  );

  if (!category) {
    await deleteUploadedImage(imageUpload.path);
    return {
      success: false,
      message: "Seçilen ekip kategorisi bulunamadı.",
    };
  }

  try {
    const memberData = {
      name: validation.data.name,
      role: validation.data.role,
      categoryId: category.id,
      photoAlt: validation.data.photoAlt,
      order: validation.data.order,
    };

    await prisma.teamMember.create({
      data: {
        ...memberData,
        photoUrl: imageUpload.path,
      },
    });
    revalidateTeamPages();

    return {
      success: true,
      message: "Ekip üyesi başarıyla eklendi.",
    };
  } catch (error) {
    await deleteUploadedImage(imageUpload.path);
    console.error("Ekip üyesi eklenemedi.", error);

    return {
      success: false,
      message: "Ekip üyesi kaydedilemedi. Lütfen tekrar deneyin.",
    };
  }
}

export async function updateTeamMemberAction(
  memberId: number,
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const validation = validateTeamMemberForm(formData);

  if (!validation.success) {
    return {
      success: false,
      message: validation.error,
    };
  }

  const member = await prisma.teamMember.findUnique({
    where: {
      id: memberId,
    },
    select: {
      id: true,
      photoUrl: true,
    },
  });

  if (!member) {
    return {
      success: false,
      message: "Düzenlemek istediğiniz ekip üyesi bulunamadı.",
    };
  }

  const imageUpload = await saveImageUpload(
    formData.get("memberPhoto"),
    "team",
  );

  if (!imageUpload.success) {
    return {
      success: false,
      message: imageUpload.error,
    };
  }

  const category = await resolveCategory(
    validation.data.categoryId,
    validation.data.newCategoryName,
  );

  if (!category) {
    await deleteUploadedImage(imageUpload.path);
    return {
      success: false,
      message: "Seçilen ekip kategorisi bulunamadı.",
    };
  }

  try {
    const memberData = {
      name: validation.data.name,
      role: validation.data.role,
      categoryId: category.id,
      photoAlt: validation.data.photoAlt,
      order: validation.data.order,
    };

    await prisma.teamMember.update({
      where: {
        id: memberId,
      },
      data: {
        ...memberData,
        photoUrl: imageUpload.path ?? member.photoUrl,
      },
    });

    if (imageUpload.path && imageUpload.path !== member.photoUrl) {
      await deleteUploadedImage(member.photoUrl);
    }

    revalidateTeamPages();
  } catch (error) {
    await deleteUploadedImage(imageUpload.path);
    console.error("Ekip üyesi güncellenemedi.", error);

    return {
      success: false,
      message: "Ekip üyesi güncellenemedi. Lütfen tekrar deneyin.",
    };
  }

  redirect("/admin/ekip?durum=guncellendi");
}

export async function deleteTeamMemberAction(
  memberId: number,
): Promise<AdminActionState> {
  await requireAdmin();

  try {
    const member = await prisma.teamMember.delete({
      where: {
        id: memberId,
      },
    });
    await deleteUploadedImage(member.photoUrl);
    revalidateTeamPages();

    return {
      success: true,
      message: "Ekip üyesi silindi.",
    };
  } catch (error) {
    console.error("Ekip üyesi silinemedi.", error);

    return {
      success: false,
      message: "Ekip üyesi silinemedi veya artık mevcut değil.",
    };
  }
}
