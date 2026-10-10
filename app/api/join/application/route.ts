import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApplicantBasics, safeHttpUrl } from "@/lib/join-validation";
import { checkJoinRateLimit } from "@/lib/join-rate-limit";
import { isHoneypotTriggered } from "@/lib/form-spam-protection";
import { verifyPrivateApplicationFile, type ApplicationFileReference } from "@/lib/private-application-files";

type AnswerInput = { questionId: number; textValue?: string; boolValue?: boolean; files?: ApplicationFileReference[] };

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (isHoneypotTriggered(body)) return NextResponse.json({ ok: true });
  if (!(await checkJoinRateLimit(request, "application"))) return NextResponse.json({ error: "Çok fazla deneme. Lütfen daha sonra tekrar deneyin." }, { status: 429 });
  const parsed = validateApplicantBasics(body);
  if (!parsed.data) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const input = body as Record<string, unknown>;
  if (input.consent !== true) return NextResponse.json({ error: "KVKK onayı gereklidir." }, { status: 400 });
  const positionId = Number(input.positionId);
  if (!Number.isSafeInteger(positionId) || positionId < 1) return NextResponse.json({ error: "Pozisyon seçin." }, { status: 400 });
  const position = await prisma.recruitmentPosition.findUnique({ where: { id: positionId }, include: { questions: { where: { isActive: true }, orderBy: { order: "asc" } } } });
  if (!position || !position.isOpen || position.isArchived || (position.deadline && position.deadline <= new Date())) return NextResponse.json({ error: "Bu pozisyon için başvurular kapalı." }, { status: 409 });
  if (await prisma.positionApplication.findUnique({ where: { positionId_studentNumber: { positionId, studentNumber: parsed.data.studentNumber } }, select: { id: true } })) return NextResponse.json({ error: "Bu pozisyon için zaten başvurun var." }, { status: 409 });
  if (!Array.isArray(input.answers) || input.answers.length > 100) return NextResponse.json({ error: "Yanıtlar geçersiz." }, { status: 400 });
  const answers = input.answers as AnswerInput[];
  if (answers.some((answer) => !answer || typeof answer !== "object" || !Number.isSafeInteger(answer.questionId) || (answer.files !== undefined && (!Array.isArray(answer.files) || answer.files.some((file) => !file || typeof file !== "object" || typeof file.pathname !== "string" || typeof file.originalName !== "string"))))) return NextResponse.json({ error: "Yanıtlar veya dosya bilgileri geçersiz." }, { status: 400 });
  const questionIds = new Set(position.questions.map((q) => q.id));
  if (new Set(answers.map((a) => a.questionId)).size !== answers.length || answers.some((a) => !questionIds.has(a.questionId))) return NextResponse.json({ error: "Tanımlanmamış soru yanıtı gönderildi." }, { status: 400 });
  const byId = new Map(answers.map((a) => [a.questionId, a]));
  const anyGroups = new Map<string, boolean>();
  for (const q of position.questions) {
    const answer = byId.get(q.id);
    const text = typeof answer?.textValue === "string" ? answer.textValue.trim() : "";
    const bool = answer?.boolValue;
    const files = Array.isArray(answer?.files) ? answer.files : [];
    if (files.length && q.type !== "FILE") return NextResponse.json({ error: "Geçersiz dosya yanıtı." }, { status: 400 });
    if (q.type === "FILE") {
      if (files.length > (q.maxFiles ?? 2) || (q.required && files.length < (q.minFiles ?? 1))) return NextResponse.json({ error: `${q.label}: dosya sayısı geçersiz.` }, { status: 400 });
    } else if (q.type === "YES_NO") {
      if (q.required && typeof bool !== "boolean") return NextResponse.json({ error: `${q.label}: cevap zorunlu.` }, { status: 400 });
      if (bool !== undefined && typeof bool !== "boolean") return NextResponse.json({ error: "Evet/Hayır yanıtı geçersiz." }, { status: 400 });
    } else {
      if (q.required && !text) return NextResponse.json({ error: `${q.label}: cevap zorunlu.` }, { status: 400 });
      if (text.length > (q.maxLength ?? (q.type === "LONG_TEXT" ? 5000 : 2000))) return NextResponse.json({ error: `${q.label}: cevap çok uzun.` }, { status: 400 });
      if (q.type === "LINK" && text && !safeHttpUrl(text)) return NextResponse.json({ error: `${q.label}: güvenli bir http/https bağlantısı girin.` }, { status: 400 });
    }
    if (q.anyOfGroup) anyGroups.set(q.anyOfGroup, (anyGroups.get(q.anyOfGroup) ?? false) || Boolean(text || files.length || typeof bool === "boolean"));
  }
  if ([...anyGroups.values()].some((filled) => !filled)) return NextResponse.json({ error: "Tasarımını dosya veya bağlantı olarak ekle." }, { status: 400 });
  if (position.quota && await prisma.positionApplication.count({ where: { positionId } }) >= position.quota) return NextResponse.json({ error: "Bu pozisyonun kontenjanı doldu." }, { status: 409 });
  const fileReferences = answers.flatMap((a) => a.files ?? []);
  if (new Set(fileReferences.map((f) => f.pathname)).size !== fileReferences.length) return NextResponse.json({ error: "Aynı dosya iki kez eklendi." }, { status: 400 });
  const verifiedFiles = new Map<string, Awaited<ReturnType<typeof verifyPrivateApplicationFile>>>();
  try {
    for (const reference of fileReferences) verifiedFiles.set(reference.pathname, await verifyPrivateApplicationFile(reference));
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Dosya doğrulanamadı." }, { status: 400 }); }
  try {
    await prisma.$transaction(async (tx) => {
      const application = await tx.positionApplication.create({ data: { positionId, ...parsed.data, consentAcceptedAt: new Date() } });
      for (const q of position.questions) {
        const inputAnswer = byId.get(q.id);
        const answer = await tx.applicationAnswer.create({ data: {
          applicationId: application.id, questionId: q.id, questionLabel: q.label, questionType: q.type, order: q.order,
          textValue: typeof inputAnswer?.textValue === "string" ? inputAnswer.textValue.trim() || null : null,
          boolValue: typeof inputAnswer?.boolValue === "boolean" ? inputAnswer.boolValue : null,
        } });
        for (const reference of inputAnswer?.files ?? []) {
          const file = verifiedFiles.get(reference.pathname)!;
          const claimed = await tx.pendingUpload.updateMany({ where: { pathname: file.pathname, attachedAt: null }, data: { attachedAt: new Date() } });
          if (claimed.count !== 1) throw new Error("Dosya başka başvuruya eklenmiş.");
          await tx.applicationFile.create({ data: { applicationId: application.id, answerId: answer.id, storagePathname: file.pathname, originalName: file.originalName, contentType: file.contentType, sizeBytes: file.sizeBytes } });
        }
      }
    });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") return NextResponse.json({ error: "Bu pozisyon için zaten başvurun var." }, { status: 409 });
    throw error;
  }
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
