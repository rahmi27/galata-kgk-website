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

function revalidateTeamPages() {
  revalidatePath("/ekibimiz");
  revalidatePath("/admin");
  revalidatePath("/admin/ekip");
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

  try {
    const memberData = {
      name: validation.data.name,
      role: validation.data.role,
      department: validation.data.department,
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

  try {
    const memberData = {
      name: validation.data.name,
      role: validation.data.role,
      department: validation.data.department,
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
