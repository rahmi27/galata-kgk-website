import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { csvFile } from "@/lib/safe-csv";
import { PositionApplicationStatus } from "@/lib/generated/prisma/client";

export async function GET(request: Request) {
  await requireAdmin();
  const url = new URL(request.url); const positionId = Number(url.searchParams.get("positionId")) || undefined;
  const statusRaw = url.searchParams.get("status"); const status = Object.values(PositionApplicationStatus).includes(statusRaw as PositionApplicationStatus) ? statusRaw as PositionApplicationStatus : undefined;
  const q = (url.searchParams.get("q") || "").trim().slice(0, 100);
  const applications = await prisma.positionApplication.findMany({ where: { ...(positionId ? { positionId } : {}), ...(status ? { status } : {}), ...(q ? { OR: [{ fullName: { contains: q, mode: "insensitive" as const } }, { studentNumber: { contains: q } }, { email: { contains: q, mode: "insensitive" as const } }] } : {}) }, orderBy: { createdAt: "desc" }, include: { position: { select: { title: true } }, answers: { orderBy: { order: "asc" } } } });
  const labels = positionId ? [...new Set(applications.flatMap((application) => application.answers.map((answer) => answer.questionLabel)))] : [];
  const rows = [["Pozisyon", "Ad soyad", "Telefon", "E-posta", "Bölüm", "Sınıf", "Öğrenci no", "Durum", "Yönetici notu", "Başvuru tarihi", ...labels], ...applications.map((application) => [application.position.title, application.fullName, application.phone, application.email, application.departmentName, application.classYear, application.studentNumber, application.status, application.adminNote, application.createdAt.toISOString(), ...labels.map((label) => { const answer = application.answers.find((item) => item.questionLabel === label); return answer ? answer.boolValue === null ? answer.textValue : answer.boolValue ? "Evet" : "Hayır" : ""; })])];
  return new Response(csvFile(rows), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=saha-basvurulari.csv", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}
