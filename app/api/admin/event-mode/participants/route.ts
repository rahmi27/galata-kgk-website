import { getCurrentAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return new Response("Yetkisiz.", { status: 401 });

  const active = await prisma.eventSession.findFirst({
    where: { isActive: true },
    select: {
      title: true,
      participants: {
        orderBy: { createdAt: "asc" },
        select: {
          fullName: true,
          email: true,
          department: true,
          createdAt: true,
          consentAcceptedAt: true,
        },
      },
    },
  });
  if (!active) return new Response("Aktif oturum yok.", { status: 404 });

  const rows = [
    ["Ad Soyad", "E-posta", "Bölüm", "Giriş Zamanı", "Onay Zamanı"],
    ...active.participants.map((participant) => [
      participant.fullName,
      participant.email,
      participant.department,
      participant.createdAt.toISOString(),
      participant.consentAcceptedAt.toISOString(),
    ]),
  ];
  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=etkinlik-katilimcilari.csv",
      "Cache-Control": "private, no-store",
    },
  });
}
