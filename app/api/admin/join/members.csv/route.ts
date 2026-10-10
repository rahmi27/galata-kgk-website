import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { csvFile } from "@/lib/safe-csv";

export async function GET(request: Request) {
  await requireAdmin();
  const url = new URL(request.url); const q = (url.searchParams.get("q") || "").trim().slice(0, 100);
  const department = (url.searchParams.get("department") || "").slice(0, 150); const year = (url.searchParams.get("year") || "").slice(0, 20);
  const members = await prisma.clubMember.findMany({ where: { ...(department ? { departmentName: department } : {}), ...(year ? { classYear: year } : {}), ...(q ? { OR: [{ fullName: { contains: q, mode: "insensitive" as const } }, { studentNumber: { contains: q } }, { email: { contains: q, mode: "insensitive" as const } }] } : {}) }, orderBy: { createdAt: "desc" } });
  const content = csvFile([["Ad soyad", "Telefon", "E-posta", "Bölüm", "Sınıf", "Öğrenci no", "Motivasyon", "KVKK onayı", "Kayıt tarihi"], ...members.map((member) => [member.fullName, member.phone, member.email, member.departmentName, member.classYear, member.studentNumber, member.motivation, member.consentAcceptedAt.toISOString(), member.createdAt.toISOString()])]);
  return new Response(content, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=kulup-uyeleri.csv", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}
