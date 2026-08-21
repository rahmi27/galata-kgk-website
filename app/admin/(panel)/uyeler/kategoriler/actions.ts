"use server";

import { revalidatePath } from "next/cache";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import { notifyIndexNow } from "@/lib/indexnow";
import { prisma } from "@/lib/prisma";
import { validateTeamCategoryName } from "@/lib/team-category";
import { revalidatePublicPath } from "@/lib/revalidate-public";

function parseOrder(formData: FormData) {
  const order = Number(formData.get("order"));
  return Number.isInteger(order) && order >= 0 && order <= 9999 ? order : null;
}

function parseEnglishName(formData: FormData) {
  const nameEn = String(formData.get("nameEn") ?? "").trim().replace(/\s+/g, " ");
  if (nameEn && (nameEn.length < 2 || nameEn.length > 80)) return null;
  return nameEn || undefined;
}

async function refreshCategoryPages() {
  revalidatePublicPath("/ekibimiz");
  revalidatePath("/admin/uyeler");
  revalidatePath("/admin/uyeler/kategoriler");
  await notifyIndexNow(["/ekibimiz"]);
}

export async function createTeamCategoryAction(_previousState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const validation = validateTeamCategoryName(String(formData.get("name") ?? ""));
  const order = parseOrder(formData);
  const nameEn = parseEnglishName(formData);
  if (!validation.success) return { success: false, message: validation.error };
  if (order === null) return { success: false, message: "Sıralama 0–9999 arasında tam sayı olmalıdır." };
  if (nameEn === null) return { success: false, message: "İngilizce kategori adı 2–80 karakter olmalıdır." };
  const duplicate = await prisma.teamCategory.findUnique({ where: { slug: validation.data.slug }, select: { id: true } });
  if (duplicate) return { success: false, message: "Bu kategori farklı büyük/küçük harf kullanımıyla zaten mevcut." };
  try {
    await prisma.teamCategory.create({ data: { ...validation.data, nameEn, order } });
    await refreshCategoryPages();
    return { success: true, message: "Ekip kategorisi oluşturuldu." };
  } catch (error) {
    console.error("Ekip kategorisi oluşturulamadı.", error);
    return { success: false, message: "Kategori oluşturulamadı. Lütfen tekrar deneyin." };
  }
}

export async function updateTeamCategoryAction(categoryId: number, _previousState: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const validation = validateTeamCategoryName(String(formData.get("name") ?? ""));
  const order = parseOrder(formData);
  const nameEn = parseEnglishName(formData);
  if (!validation.success) return { success: false, message: validation.error };
  if (order === null) return { success: false, message: "Sıralama 0–9999 arasında tam sayı olmalıdır." };
  if (nameEn === null) return { success: false, message: "İngilizce kategori adı 2–80 karakter olmalıdır." };
  const current = await prisma.teamCategory.findUnique({ where: { id: categoryId }, select: { id: true } });
  if (!current) return { success: false, message: "Düzenlemek istediğiniz kategori bulunamadı." };
  const duplicate = await prisma.teamCategory.findFirst({ where: { slug: validation.data.slug, id: { not: categoryId } }, select: { id: true } });
  if (duplicate) return { success: false, message: "Bu kategori farklı büyük/küçük harf kullanımıyla zaten mevcut." };
  try {
    await prisma.teamCategory.update({ where: { id: categoryId }, data: { ...validation.data, nameEn, order } });
    await refreshCategoryPages();
    return { success: true, message: "Kategori güncellendi." };
  } catch (error) {
    console.error("Ekip kategorisi güncellenemedi.", error);
    return { success: false, message: "Kategori güncellenemedi." };
  }
}

export async function deleteTeamCategoryAction(categoryId: number): Promise<AdminActionState> {
  await requireAdmin();
  const category = await prisma.teamCategory.findUnique({ where: { id: categoryId }, select: { id: true, _count: { select: { memberships: true } } } });
  if (!category) return { success: false, message: "Silmek istediğiniz kategori bulunamadı." };
  if (category._count.memberships > 0) return { success: false, message: `Bu kategoriye bağlı ${category._count.memberships} üyelik var. Önce kategori atamalarını kaldırın.` };
  try {
    await prisma.teamCategory.delete({ where: { id: category.id } });
    await refreshCategoryPages();
    return { success: true, message: "Ekip kategorisi silindi." };
  } catch (error) {
    console.error("Ekip kategorisi silinemedi.", error);
    return { success: false, message: "Kategori silinemedi." };
  }
}
