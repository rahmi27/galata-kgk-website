"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { deleteUploadedImage, saveImageUpload } from "@/lib/image-upload";
import { deletePrivateApplicationFiles } from "@/lib/private-application-files";
import { PositionApplicationStatus, PositionQuestionType } from "@/lib/generated/prisma/client";

function value(data: FormData, key: string) { return data.get(key)?.toString().trim() || ""; }
function integer(data: FormData, key: string, fallback = 0) { const raw = value(data, key); return raw ? Number(raw) : fallback; }
function slugify(value: string) { return value.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ş/g, "s").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100); }
function fail(path: string, message: string): never { redirect(`${path}?error=${encodeURIComponent(message)}`); }
function refreshPosition(id?: number) { revalidatePath("/admin/alim/pozisyonlar"); if (id) revalidatePath(`/admin/alim/pozisyonlar/${id}`); }

export async function savePositionAction(data: FormData) {
  await requireAdmin();
  const id = integer(data, "id"); const title = value(data, "title"); const slug = slugify(value(data, "slug") || title);
  const shortDescription = value(data, "shortDescription"); const detailMarkdown = value(data, "detailMarkdown");
  const order = integer(data, "order"); const quotaRaw = value(data, "quota"); const quota = quotaRaw ? Number(quotaRaw) : null;
  const deadlineRaw = value(data, "deadline"); const deadline = deadlineRaw ? new Date(`${deadlineRaw}:00+03:00`) : null;
  if (!title || title.length > 120 || !slug || shortDescription.length < 10 || shortDescription.length > 300 || detailMarkdown.length < 10 || detailMarkdown.length > 30_000 || !Number.isInteger(order) || order < 0 || order > 10000 || (quota !== null && (!Number.isInteger(quota) || quota < 1)) || (deadline && Number.isNaN(deadline.getTime()))) fail("/admin/alim/pozisyonlar", "Pozisyon alanlarını kontrol edin.");
  const fields = { title, slug, shortDescription, detailMarkdown, order, quota, deadline, isOpen: value(data, "isOpen") === "on", isArchived: value(data, "isArchived") === "on" };
  try {
    const saved = id ? await prisma.recruitmentPosition.update({ where: { id }, data: fields }) : await prisma.recruitmentPosition.create({ data: fields });
    refreshPosition(saved.id);
  } catch { fail("/admin/alim/pozisyonlar", "Pozisyon kaydedilemedi; slug benzersiz olmalıdır."); }
  redirect("/admin/alim/pozisyonlar");
}

export async function saveQuestionAction(data: FormData) {
  await requireAdmin();
  const positionId = integer(data, "positionId"); const id = integer(data, "id"); const label = value(data, "label");
  const helpText = value(data, "helpText") || null; const type = value(data, "type") as PositionQuestionType;
  const order = integer(data, "order"); const maxLength = value(data, "maxLength") ? integer(data, "maxLength") : null;
  const minFiles = value(data, "minFiles") ? integer(data, "minFiles") : null; const maxFiles = value(data, "maxFiles") ? integer(data, "maxFiles") : null;
  const anyOfGroup = value(data, "anyOfGroup") || null;
  const path = `/admin/alim/pozisyonlar/${positionId}`;
  if (!Object.values(PositionQuestionType).includes(type) || label.length < 3 || label.length > 500 || (helpText?.length || 0) > 1000 || !Number.isInteger(order) || order < 0 || order > 10000 || (maxLength !== null && (!Number.isInteger(maxLength) || maxLength < 1 || maxLength > 10000)) || (type === "FILE" && (minFiles !== null && (!Number.isInteger(minFiles) || minFiles < 0 || minFiles > 10) || maxFiles !== null && (!Number.isInteger(maxFiles) || maxFiles < 1 || maxFiles > 10) || (minFiles ?? 0) > (maxFiles ?? 2))) || (anyOfGroup?.length || 0) > 80) fail(path, "Soru alanlarını kontrol edin.");
  if (!await prisma.recruitmentPosition.findUnique({ where: { id: positionId }, select: { id: true } })) fail(path, "Pozisyon bulunamadı.");
  const fields = { label, helpText, type, order, required: value(data, "required") === "on", maxLength, minFiles: type === "FILE" ? minFiles : null, maxFiles: type === "FILE" ? maxFiles : null, anyOfGroup };
  if (id) await prisma.positionQuestion.updateMany({ where: { id, positionId }, data: fields });
  else await prisma.positionQuestion.create({ data: { positionId, ...fields } });
  refreshPosition(positionId); redirect(path);
}

export async function deactivateQuestionAction(data: FormData) {
  await requireAdmin();
  const positionId = integer(data, "positionId"); const id = integer(data, "id");
  await prisma.positionQuestion.updateMany({ where: { id, positionId }, data: { isActive: false } });
  refreshPosition(positionId); redirect(`/admin/alim/pozisyonlar/${positionId}`);
}

export async function savePositionMediaAction(data: FormData) {
  await requireAdmin();
  const positionId = integer(data, "positionId"); const path = `/admin/alim/pozisyonlar/${positionId}`;
  const alt = value(data, "alt"); const caption = value(data, "caption") || null; const order = integer(data, "order");
  if (alt.length < 3 || alt.length > 200 || (caption?.length || 0) > 200 || !Number.isInteger(order) || order < 0 || order > 10000) fail(path, "Görsel açıklaması veya sıra geçersiz.");
  const uploaded = await saveImageUpload(data.get("file"), "positions");
  if (!uploaded.success || !uploaded.path) fail(path, uploaded.success ? "Görsel seçin." : uploaded.error);
  try { await prisma.recruitmentPositionMedia.create({ data: { positionId, url: uploaded.path, alt, caption, order } }); }
  catch { await deleteUploadedImage(uploaded.path); fail(path, "Görsel kaydedilemedi."); }
  refreshPosition(positionId); redirect(path);
}

export async function deletePositionMediaAction(data: FormData) {
  await requireAdmin();
  const positionId = integer(data, "positionId"); const id = integer(data, "id");
  const media = await prisma.recruitmentPositionMedia.findFirst({ where: { id, positionId } });
  if (media) { await prisma.recruitmentPositionMedia.delete({ where: { id } }); await deleteUploadedImage(media.url); }
  refreshPosition(positionId); redirect(`/admin/alim/pozisyonlar/${positionId}`);
}

export async function saveDepartmentAction(data: FormData) {
  await requireAdmin();
  const id = integer(data, "id"); const name = value(data, "name"); const order = integer(data, "order");
  if (name.length < 2 || name.length > 150 || !Number.isInteger(order) || order < 0 || order > 10000) fail("/admin/bolumler", "Bölüm adı veya sıra geçersiz.");
  try {
    if (id) await prisma.department.update({ where: { id }, data: { name, order, isActive: value(data, "isActive") === "on" } });
    else await prisma.department.create({ data: { name, order, isActive: true } });
  } catch { fail("/admin/bolumler", "Bölüm kaydedilemedi; ad benzersiz olmalıdır."); }
  revalidatePath("/admin/bolumler"); redirect("/admin/bolumler");
}

export async function deleteClubMemberAction(data: FormData) {
  await requireAdmin();
  const id = integer(data, "id");
  await prisma.clubMember.delete({ where: { id } });
  revalidatePath("/admin/kulup-uyeleri"); revalidatePath("/admin"); redirect("/admin/kulup-uyeleri");
}

export async function saveApplicationReviewAction(data: FormData) {
  await requireAdmin();
  const id = integer(data, "id"); const status = value(data, "status") as PositionApplicationStatus; const adminNote = value(data, "adminNote");
  if (!Object.values(PositionApplicationStatus).includes(status) || adminNote.length > 10000) fail(`/admin/alim/basvurular/${id}`, "Durum veya not geçersiz.");
  await prisma.positionApplication.update({ where: { id }, data: { status, adminNote: adminNote || null } });
  revalidatePath(`/admin/alim/basvurular/${id}`); revalidatePath("/admin/alim/basvurular"); revalidatePath("/admin"); redirect(`/admin/alim/basvurular/${id}`);
}

export async function deletePositionApplicationAction(data: FormData) {
  await requireAdmin();
  const id = integer(data, "id");
  const application = await prisma.positionApplication.findUnique({ where: { id }, include: { files: true } });
  if (!application) fail("/admin/alim/basvurular", "Başvuru bulunamadı.");
  // Do not delete the DB record if Blob deletion fails; it would leave private orphan files.
  await deletePrivateApplicationFiles(application.files.map((file) => file.storagePathname));
  await prisma.$transaction([
    prisma.pendingUpload.deleteMany({ where: { pathname: { in: application.files.map((file) => file.storagePathname) } } }),
    prisma.positionApplication.delete({ where: { id } }),
  ]);
  revalidatePath("/admin/alim/basvurular"); revalidatePath("/admin"); redirect("/admin/alim/basvurular");
}
