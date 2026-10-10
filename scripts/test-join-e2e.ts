import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

// Explicit opt-in and loopback-only DB guard: never run this against Neon.
const databaseUrl = process.env.TEST_DATABASE_URL;
const baseUrl = process.env.TEST_SITE_URL || "http://localhost:3100";
if (!databaseUrl || !["localhost", "127.0.0.1"].includes(new URL(databaseUrl).hostname) || !["localhost", "127.0.0.1"].includes(new URL(baseUrl).hostname)) {
  throw new Error("E2E testi yalnızca açıkça verilen yerel veritabanı ve yerel siteyle çalışır.");
}
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });
const stamp = Date.now().toString().slice(-9);
const firstStudent = `8${stamp}`;
const ids: number[] = [];
const original = new Map<number, { isOpen: boolean; deadline: Date | null }>();

function expect(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

async function post(path: string, body: unknown) {
  const studentNumber = (body as { studentNumber?: string })?.studentNumber || "0";
  const response = await fetch(new URL(path, baseUrl), { method: "POST", headers: { "Content-Type": "application/json", "x-forwarded-for": `127.0.0.${Number(studentNumber.slice(-1)) + 1}` }, body: JSON.stringify(body) });
  return { status: response.status, data: await response.json() as Record<string, unknown> };
}

function basics(studentNumber: string) {
  return { fullName: "Yerel Test Aday", phone: "05551234567", email: `local-${studentNumber}@example.invalid`, departmentName: "Diş Hekimliği", classYear: "1", studentNumber, consent: true };
}

async function run() {
  const positions = await prisma.recruitmentPosition.findMany({ orderBy: { order: "asc" }, include: { questions: { where: { isActive: true } } } });
  expect(positions.length === 4, "Seed edilmiş dört pozisyon bulunamadı.");
  for (const position of positions) { original.set(position.id, { isOpen: position.isOpen, deadline: position.deadline }); ids.push(position.id); }
  const member = await post("/api/join/member", basics(firstStudent));
  expect(member.status === 200 && member.data.ok === true, "Üyelik kaydı başarısız.");
  const duplicateMember = await post("/api/join/member", basics(firstStudent));
  expect(duplicateMember.status === 200 && await prisma.clubMember.count({ where: { studentNumber: firstStudent } }) === 1, "Tekrarlı üyelik upsert başarısız.");
  const closed = await post("/api/join/application", { ...basics(firstStudent), positionId: positions[0].id, answers: [] });
  expect(closed.status === 409, "Kapalı pozisyon başvurusu engellenmedi.");
  await prisma.recruitmentPosition.updateMany({ where: { id: { in: ids } }, data: { isOpen: true, deadline: null } });

  for (const [index, position] of positions.entries()) {
    const studentNumber = `7${stamp.slice(0, -1)}${index}`;
    const answers = position.questions.map((question) => ({ questionId: question.id, ...(question.type === "YES_NO" ? { boolValue: true } : question.type === "LINK" ? { textValue: position.slug.includes("tasarim") ? "https://example.org/portfolio" : "" } : question.type === "FILE" ? { files: [] } : { textValue: `Yerel test: ${question.label}` }) }));
    const payload = { ...basics(studentNumber), positionId: position.id, answers };
    const unknown = await post("/api/join/application", { ...payload, answers: [...answers, { questionId: 999999999, textValue: "bad" }] });
    expect(unknown.status === 400, `${position.title}: tanımsız soru kabul edildi.`);
    if (position.slug.includes("tasarim")) {
      const noPortfolio = await post("/api/join/application", { ...payload, answers: answers.map((answer) => "textValue" in answer && answer.textValue?.startsWith("https://") ? { questionId: answer.questionId, textValue: "" } : answer) });
      expect(noPortfolio.status === 400, "Tasarım için dosya veya bağlantı şartı uygulanmadı.");
    }
    const submitted = await post("/api/join/application", payload);
    expect(submitted.status === 200 && submitted.data.ok === true, `${position.title}: başvuru kaydedilmedi (${submitted.status}: ${String(submitted.data.error)})`);
    const duplicate = await post("/api/join/application", payload);
    expect(duplicate.status === 409, `${position.title}: tekrar başvuru engellenmedi.`);
  }
  expect(await prisma.positionApplication.count({ where: { positionId: { in: ids }, fullName: "Yerel Test Aday" } }) === 4, "Dört pozisyonun tamamında kayıt oluşmadı.");
  await prisma.recruitmentPosition.update({ where: { id: positions[0].id }, data: { deadline: new Date(Date.now() - 60_000) } });
  const expired = await post("/api/join/application", { ...basics(`6${stamp}`), positionId: positions[0].id, answers: [] });
  expect(expired.status === 409, "Süresi geçmiş pozisyon başvurusu engellenmedi.");
  const privateFile = await fetch(new URL("/api/admin/join/files/1", baseUrl), { redirect: "manual" });
  expect([401, 403, 307, 308].includes(privateFile.status), "Özel dosya yönetici doğrulaması olmadan açıldı.");
  const csv = await fetch(new URL("/api/admin/join/members.csv", baseUrl), { redirect: "manual" });
  expect([401, 403, 307, 308].includes(csv.status), "Üye CSV'si yönetici doğrulaması olmadan açıldı.");
  console.log("Yerel E2E geçti: üyelik/tekrar, 4 pozisyon, kapalı/süresi geçmiş, tanımsız soru, tasarım portföy şartı, tekrar başvuru, yönetici koruması.");
}

run().finally(async () => {
  await prisma.positionApplication.deleteMany({ where: { positionId: { in: ids }, fullName: "Yerel Test Aday" } });
  await prisma.clubMember.deleteMany({ where: { studentNumber: firstStudent } });
  for (const [id, state] of original) await prisma.recruitmentPosition.update({ where: { id }, data: state });
  await prisma.$disconnect();
});
