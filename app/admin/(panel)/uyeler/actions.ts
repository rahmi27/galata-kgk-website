"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import {
  deleteUploadedImage,
  saveImageUpload,
} from "@/lib/image-upload";
import { notifyIndexNow } from "@/lib/indexnow";
import {
  type PersonAdminInput,
  validateMembershipForm,
  validatePersonForm,
} from "@/lib/person-admin-validation";
import { prisma } from "@/lib/prisma";
import { validateTeamCategoryName } from "@/lib/team-category";
import { Prisma } from "@/lib/generated/prisma/client";

function hasPrismaErrorCode(error: unknown, code: string) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === code
  );
}

async function refreshPeoplePages() {
  revalidatePath("/ekibimiz");
  revalidatePath("/admin");
  revalidatePath("/admin/uyeler");
  revalidatePath("/admin/uyeler/kisiler");
  revalidatePath("/admin/uyeler/kategoriler");
  await notifyIndexNow(["/ekibimiz"]);
}

async function resolveCategory(
  categoryId: number | null,
  newCategoryName: string | null,
  newCategoryNameEn: string | null,
) {
  if (categoryId) {
    return prisma.teamCategory.findUnique({ where: { id: categoryId } });
  }

  const validation = validateTeamCategoryName(newCategoryName ?? "");
  if (!validation.success) return null;

  const existing = await prisma.teamCategory.findUnique({
    where: { slug: validation.data.slug },
  });
  if (existing) return existing;

  const highestOrder = await prisma.teamCategory.aggregate({
    _max: { order: true },
  });
  return prisma.teamCategory.create({
    data: {
      ...validation.data,
      nameEn: newCategoryNameEn,
      order: (highestOrder._max.order ?? 0) + 1,
    },
  });
}

export async function createPersonAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const validation = validatePersonForm(formData);
  if (!validation.success) {
    return { success: false, message: validation.error };
  }

  const duplicate = await prisma.person.findUnique({
    where: { normalizedName: validation.data.normalizedName },
    select: { id: true, name: true },
  });
  if (duplicate) {
    return {
      success: false,
      message: `“${duplicate.name}” zaten kayıtlı. Var olan kişiyi düzenleyin veya kategoriye atayın.`,
    };
  }

  const imageUpload = await saveImageUpload(formData.get("memberPhoto"), "team");
  if (!imageUpload.success) {
    return { success: false, message: imageUpload.error };
  }

  try {
    await prisma.person.create({
      data: {
        ...validation.data,
        photoUrl: imageUpload.path,
        photoAlt: imageUpload.path ? validation.data.photoAlt : null,
        photoAltEn: imageUpload.path ? validation.data.photoAltEn : null,
      },
    });
    await refreshPeoplePages();
    return { success: true, message: "Kişi oluşturuldu. Şimdi kategori ve rol atayabilirsiniz." };
  } catch (error) {
    await deleteUploadedImage(imageUpload.path);
    console.error("Kişi oluşturulamadı.", error);
    return { success: false, message: "Kişi kaydedilemedi. Lütfen tekrar deneyin." };
  }
}

export async function updatePersonAction(
  personId: number,
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const validation = validatePersonForm(formData);
  if (!validation.success) {
    return { success: false, message: validation.error };
  }

  const person = await prisma.person.findUnique({
    where: { id: personId },
    select: { id: true, photoUrl: true },
  });
  if (!person) {
    return { success: false, message: "Düzenlemek istediğiniz kişi bulunamadı." };
  }

  const duplicate = await prisma.person.findFirst({
    where: {
      normalizedName: validation.data.normalizedName,
      id: { not: personId },
    },
    select: { name: true },
  });
  if (duplicate) {
    return {
      success: false,
      message: `Bu ad “${duplicate.name}” kaydıyla eşleşiyor. İki ayrı kişi kaydı oluşturulamaz.`,
    };
  }

  const imageUpload = await saveImageUpload(formData.get("memberPhoto"), "team");
  if (!imageUpload.success) {
    return { success: false, message: imageUpload.error };
  }
  const removePhoto = formData.get("removeMemberPhoto") === "true";
  const nextPhotoUrl = imageUpload.path ?? (removePhoto ? null : person.photoUrl);

  try {
    await prisma.person.update({
      where: { id: personId },
      data: {
        ...validation.data,
        photoUrl: nextPhotoUrl,
        photoAlt: nextPhotoUrl ? validation.data.photoAlt : null,
        photoAltEn: nextPhotoUrl ? validation.data.photoAltEn : null,
      },
    });
    if (person.photoUrl && person.photoUrl !== nextPhotoUrl) {
      await deleteUploadedImage(person.photoUrl);
    }
    await refreshPeoplePages();
  } catch (error) {
    await deleteUploadedImage(imageUpload.path);
    console.error("Kişi güncellenemedi.", error);
    return { success: false, message: "Kişi güncellenemedi. Lütfen tekrar deneyin." };
  }

  redirect(`/admin/uyeler/${personId}?durum=guncellendi`);
}

export async function createMembershipAction(
  fixedPersonId: number | null,
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const membershipValidation = validateMembershipForm(formData);
  if (!membershipValidation.success) {
    return { success: false, message: membershipValidation.error };
  }

  const personMode = fixedPersonId
    ? "existing"
    : String(formData.get("personMode") ?? "new");
  let validatedNewPerson: PersonAdminInput | null = null;
  let existingPerson: {
    id: number;
    name: string;
    photoUrl: string | null;
    photoAlt: string | null;
    photoAltEn: string | null;
  } | null = null;

  if (!fixedPersonId && personMode === "new") {
    const personValidation = validatePersonForm(formData);
    if (!personValidation.success) {
      return { success: false, message: personValidation.error };
    }
    validatedNewPerson = personValidation.data;

    const duplicate = await prisma.person.findUnique({
      where: { normalizedName: validatedNewPerson.normalizedName },
      select: { name: true },
    });
    if (duplicate) {
      return {
        success: false,
        message: `“${duplicate.name}” zaten kayıtlı. “Var olan kişiyi ekle” seçeneğini kullanın.`,
      };
    }
  } else {
    const personId = fixedPersonId ?? Number(formData.get("personId"));
    if (!Number.isInteger(personId) || personId <= 0) {
      return {
        success: false,
        message: "Var olan kişilerden geçerli bir seçim yapın.",
      };
    }

    existingPerson = await prisma.person.findUnique({
      where: { id: personId },
      select: { id: true, name: true, photoUrl: true, photoAlt: true, photoAltEn: true },
    });
    if (!existingPerson) {
      return { success: false, message: "Atamak istediğiniz kişi bulunamadı." };
    }
  }

  const category = await resolveCategory(
    membershipValidation.data.categoryId,
    membershipValidation.data.newCategoryName,
    membershipValidation.data.newCategoryNameEn,
  );
  if (!category) {
    return { success: false, message: "Seçilen ekip kategorisi bulunamadı." };
  }
  const order = membershipValidation.data.order ??
    (await prisma.teamMembership.count({ where: { categoryId: category.id } })) + 1;

  if (!fixedPersonId && personMode === "new") {
    const personData = validatedNewPerson!;

    const imageUpload = await saveImageUpload(
      formData.get("memberPhoto"),
      "team",
    );
    if (!imageUpload.success) {
      return { success: false, message: imageUpload.error };
    }

    try {
      const person = await prisma.$transaction(async (transaction) => {
        const createdPerson = await transaction.person.create({
          data: {
            ...personData,
            photoUrl: imageUpload.path,
            photoAlt: imageUpload.path ? personData.photoAlt : null,
            photoAltEn: imageUpload.path ? personData.photoAltEn : null,
          },
        });
        await transaction.teamMembership.create({
          data: {
            personId: createdPerson.id,
            categoryId: category.id,
            role: membershipValidation.data.role,
            roleEn: membershipValidation.data.roleEn,
            order,
          },
        });
        return createdPerson;
      });
      await refreshPeoplePages();
      return {
        success: true,
        message: `${person.name} oluşturuldu ve ${category.name} kategorisine eklendi.`,
      };
    } catch (error) {
      await deleteUploadedImage(imageUpload.path);
      if (hasPrismaErrorCode(error, "P2002")) {
        return {
          success: false,
          message: "Bu kişi veya kategori üyeliği başka bir işlem tarafından zaten oluşturuldu.",
        };
      }
      console.error("Yeni kişi ve kategori üyeliği oluşturulamadı.", error);
      return {
        success: false,
        message: "Yeni kişi ve kategori ataması kaydedilemedi.",
      };
    }
  }

  const person = existingPerson!;
  const personId = person.id;

  const duplicateMembership = await prisma.teamMembership.findUnique({
    where: {
      personId_categoryId: { personId, categoryId: category.id },
    },
  });
  if (duplicateMembership) {
    return {
      success: false,
      message: `“${person.name}” zaten “${category.name}” kategorisinde. Mevcut rolü düzenleyin.`,
    };
  }

  const department = String(formData.get("existingDepartment") ?? "")
    .trim()
    .replace(/\s+/g, " ");
  const photoAlt = String(formData.get("existingPhotoAlt") ?? "").trim();
  const departmentEn = String(formData.get("existingDepartmentEn") ?? "")
    .trim()
    .replace(/\s+/g, " ");
  const photoAltEn = String(formData.get("existingPhotoAltEn") ?? "").trim();
  if (department && (department.length < 2 || department.length > 120)) {
    return {
      success: false,
      message: "Bölüm güncellemesi 2–120 karakter olmalıdır.",
    };
  }
  if (photoAlt.length > 180) {
    return {
      success: false,
      message: "Fotoğraf alt metni en fazla 180 karakter olabilir.",
    };
  }
  if (departmentEn && (departmentEn.length < 2 || departmentEn.length > 120)) {
    return { success: false, message: "İngilizce bölüm güncellemesi 2–120 karakter olmalıdır." };
  }
  if (photoAltEn.length > 180) {
    return { success: false, message: "İngilizce fotoğraf alt metni en fazla 180 karakter olabilir." };
  }

  const imageUpload = await saveImageUpload(
    formData.get("memberPhoto"),
    "team",
  );
  if (!imageUpload.success) {
    return { success: false, message: imageUpload.error };
  }

  try {
    await prisma.$transaction(async (transaction) => {
      if (department || departmentEn || imageUpload.path) {
        await transaction.person.update({
          where: { id: personId },
          data: {
            ...(department ? { department } : {}),
            ...(departmentEn ? { departmentEn } : {}),
            ...(imageUpload.path
              ? {
                  photoUrl: imageUpload.path,
                  photoAlt: photoAlt || person.photoAlt,
                  photoAltEn: photoAltEn || person.photoAltEn,
                }
              : {}),
          },
        });
      }
      await transaction.teamMembership.create({
        data: {
          personId,
          categoryId: category.id,
          role: membershipValidation.data.role,
          roleEn: membershipValidation.data.roleEn,
          order,
        },
      });
    });
    if (imageUpload.path && person.photoUrl !== imageUpload.path) {
      await deleteUploadedImage(person.photoUrl);
    }
    await refreshPeoplePages();
    return {
      success: true,
      message: `${person.name}, ${category.name} kategorisine eklendi.`,
    };
  } catch (error) {
    await deleteUploadedImage(imageUpload.path);
    if (hasPrismaErrorCode(error, "P2002")) {
      return {
        success: false,
        message: `“${person.name}” zaten “${category.name}” kategorisinde. Mevcut rolü düzenleyin.`,
      };
    }
    console.error("Var olan kişi kategoriye eklenemedi.", error);
    return { success: false, message: "Kategori ataması kaydedilemedi." };
  }
}

export async function updateMembershipAction(
  membershipId: number,
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const role = String(formData.get("role") ?? "").trim().replace(/\s+/g, " ");
  const roleEn = String(formData.get("roleEn") ?? "").trim().replace(/\s+/g, " ");
  const order = Number(formData.get("order"));
  if (role.length < 2 || role.length > 140) {
    return { success: false, message: "Kategori rolü 2–140 karakter olmalıdır." };
  }
  if (roleEn && (roleEn.length < 2 || roleEn.length > 140)) {
    return { success: false, message: "İngilizce kategori rolü 2–140 karakter olmalıdır." };
  }
  if (!Number.isInteger(order) || order < 0 || order > 9999) {
    return { success: false, message: "Sıralama 0–9999 arasında tam sayı olmalıdır." };
  }

  const membership = await prisma.teamMembership.findUnique({ where: { id: membershipId } });
  if (!membership) {
    return { success: false, message: "Düzenlemek istediğiniz kategori üyeliği bulunamadı." };
  }

  try {
    await prisma.teamMembership.update({
      where: { id: membershipId },
      data: { role, roleEn: roleEn || null, order },
    });
    await refreshPeoplePages();
    return { success: true, message: "Rol ve kategori sırası güncellendi." };
  } catch (error) {
    console.error("Kategori üyeliği güncellenemedi.", error);
    return { success: false, message: "Kategori üyeliği güncellenemedi." };
  }
}

export async function deleteMembershipAction(
  membershipId: number,
): Promise<AdminActionState> {
  await requireAdmin();
  const membership = await prisma.teamMembership.findUnique({
    where: { id: membershipId },
    select: { id: true },
  });
  if (!membership) {
    return { success: false, message: "Kaldırmak istediğiniz kategori üyeliği bulunamadı." };
  }

  try {
    await prisma.teamMembership.delete({ where: { id: membershipId } });
    await refreshPeoplePages();
    return { success: true, message: "Kişi bu kategoriden kaldırıldı; kişi kaydı korundu." };
  } catch (error) {
    console.error("Kategori üyeliği kaldırılamadı.", error);
    return { success: false, message: "Kategori üyeliği kaldırılamadı." };
  }
}

export async function deletePersonAction(
  personId: number,
): Promise<AdminActionState> {
  await requireAdmin();
  if (!Number.isInteger(personId) || personId <= 0) {
    return { success: false, message: "Geçerli bir kişi kaydı seçin." };
  }

  const person = await prisma.person.findUnique({
    where: { id: personId },
    select: {
      id: true,
      name: true,
      photoUrl: true,
      _count: { select: { memberships: true } },
    },
  });
  if (!person) {
    return { success: false, message: "Silmek istediğiniz kişi bulunamadı." };
  }

  try {
    await prisma.person.delete({ where: { id: person.id } });
    await deleteUploadedImage(person.photoUrl);
    await refreshPeoplePages();
    return {
      success: true,
      message: `${person.name} ve bağlı ${person._count.memberships} kategori üyeliği silindi.`,
    };
  } catch (error) {
    console.error("Kişi silinemedi.", error);
    return { success: false, message: "Kişi silinemedi. Lütfen tekrar deneyin." };
  }
}
