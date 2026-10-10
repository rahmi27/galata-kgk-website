import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApplicantBasics } from "@/lib/join-validation";
import { checkJoinRateLimit } from "@/lib/join-rate-limit";
import { isHoneypotTriggered } from "@/lib/form-spam-protection";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (isHoneypotTriggered(body)) return NextResponse.json({ ok: true });
  if (!(await checkJoinRateLimit(request, "member"))) return NextResponse.json({ error: "Çok fazla deneme. Lütfen daha sonra tekrar deneyin." }, { status: 429 });
  const parsed = validateApplicantBasics(body);
  if (!parsed.data) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const input = body as Record<string, unknown>;
  if (input.consent !== true) return NextResponse.json({ error: "KVKK onayı gereklidir." }, { status: 400 });
  const motivation = typeof input.motivation === "string" ? input.motivation.trim() : "";
  if (motivation.length > 500) return NextResponse.json({ error: "Açıklama en fazla 500 karakter olabilir." }, { status: 400 });
  // Upsert preserves the original consent timestamp and data on repeated submissions.
  await prisma.clubMember.upsert({
    where: { studentNumber: parsed.data.studentNumber },
    create: { ...parsed.data, motivation: motivation || null, consentAcceptedAt: new Date() },
    update: {},
  });
  return NextResponse.json({ ok: true, firstName: parsed.data.fullName.split(/\s+/)[0] }, { headers: { "Cache-Control": "no-store" } });
}
