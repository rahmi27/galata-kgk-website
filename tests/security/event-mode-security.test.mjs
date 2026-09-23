import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();
const read = (...parts) => readFile(path.join(root, ...parts), "utf8");

test("katılımcı panelinin tamamı imzalı oturum kontrolüyle korunur", async () => {
  const [layout, session, token, proxy] = await Promise.all([
    read("app", "[locale]", "etkinlik", "panel", "layout.tsx"),
    read("lib", "event-participant-session.ts"),
    read("lib", "event-participant-token.ts"),
    read("proxy.ts"),
  ]);

  assert.match(layout, /await\s+requireEventParticipant\(locale\)/);
  assert.match(token, /createHmac\("sha256"/);
  assert.match(token, /timingSafeEqual/);
  assert.match(session, /httpOnly:\s*true/);
  assert.match(session, /sameSite:\s*"lax"/);
  assert.match(session, /eventSession:\s*\{\s*isActive:\s*true\s*\}/);
  assert.match(proxy, /verifyParticipantToken\(token\)/);
  assert.match(proxy, /NextResponse\.redirect/);
  assert.match(proxy, /request\.method\s*===\s*"GET"/);
});

test("etkinlik admin işlemleri veri erişiminden önce yönetici doğrular", async () => {
  const files = [
    ["app", "admin", "(panel)", "etkinlik-modu", "actions.ts"],
    ["app", "admin", "(panel)", "etkinlik-modu", "quiz", "actions.ts"],
    ["app", "admin", "(panel)", "etkinlik-modu", "cekilis", "actions.ts"],
    ["app", "admin", "(panel)", "etkinlik-modu", "anket", "actions.ts"],
  ];

  for (const parts of files) {
    const source = await read(...parts);
    const actions = [...source.matchAll(/export\s+async\s+function\s+(\w+)/g)];
    assert.ok(actions.length > 0, `${parts.join("/")} action içermiyor`);
    for (let index = 0; index < actions.length; index += 1) {
      const body = source.slice(actions[index].index, actions[index + 1]?.index ?? source.length);
      const guard = body.indexOf("await requireAdmin(");
      const database = body.indexOf("prisma.");
      assert.ok(guard >= 0, `${actions[index][1]} yönetici kontrolü yapmıyor`);
      if (database >= 0) assert.ok(guard < database, `${actions[index][1]} kontrol öncesi veritabanına erişiyor`);
    }
  }
});

test("quiz ve anket yazma API'leri oturum, ilişki ve tekrar kontrolü yapar", async () => {
  const [quiz, poll] = await Promise.all([
    read("app", "api", "event-mode", "quiz", "answer", "route.ts"),
    read("app", "api", "event-mode", "poll", "route.ts"),
  ]);

  assert.match(quiz, /getCurrentEventParticipant\(\)/);
  assert.match(quiz, /eventSessionId:\s*participant\.eventSessionId/);
  assert.match(quiz, /participantId_questionId/);
  assert.match(quiz, /error\.code\s*===\s*"P2002"/);
  assert.match(poll, /getCurrentEventParticipant\(\)/);
  assert.match(poll, /eventSessionId:\s*participant\.eventSessionId/);
  assert.match(poll, /pollId_participantId/);
  assert.match(poll, /error\.code\s*===\s*"P2002"/);
});

test("çekiliş katılımı quiz açıkken sunucuda tamamlanma şartını uygular", async () => {
  const [action, gate] = await Promise.all([
    read("app", "[locale]", "etkinlik", "panel", "cekilis", "actions.ts"),
    read("lib", "event-mode-quiz.ts"),
  ]);
  assert.match(action, /await getQuizGateStatus\(participant\.eventSessionId, participant\.id\)/);
  assert.match(action, /quizGate\.required && !quizGate\.completed/);
  assert.match(gate, /quizEnabled/);
  assert.match(gate, /totalQuestions > 0 && answeredQuestions === totalQuestions/);
});

test("admin canlı sayaç API'si yönetici oturumu olmadan veri döndürmez", async () => {
  const source = await read("app", "api", "admin", "event-mode", "stats", "route.ts");
  const guard = source.indexOf("getCurrentAdmin()");
  const stats = source.indexOf("getEventModeStats(active.id)");
  assert.ok(guard >= 0 && stats > guard);
  assert.match(source, /status:\s*401/);
  assert.match(source, /private, no-store/);
});

test("halka açık canlı veriler kişisel e-posta ve bölüm alanlarını seçmez", async () => {
  const [stage, leaderboard] = await Promise.all([
    read("app", "api", "event-mode", "stage", "route.ts"),
    read("app", "api", "event-mode", "leaderboard", "route.ts"),
  ]);
  for (const source of [stage, leaderboard]) {
    assert.doesNotMatch(source, /select:\s*\{[^}]*email:\s*true/s);
    assert.doesNotMatch(source, /select:\s*\{[^}]*department:\s*true/s);
    assert.match(source, /publicParticipantName/);
    assert.match(source, /Cache-Control/);
  }
});

test("canlı ekran polling aralıkları ölçülü ve popup oturum başına tektir", async () => {
  const [stage, leaderboard, adminStats, poster] = await Promise.all([
    read("components", "event-mode", "stage-dashboard.tsx"),
    read("components", "event-mode", "live-leaderboard.tsx"),
    read("components", "admin", "event-mode-live-stats.tsx"),
    read("components", "event-mode", "event-poster-modal.tsx"),
  ]);
  assert.match(stage, /setInterval\(refresh, 3000\)/);
  assert.match(leaderboard, /refreshMs = 4000/);
  assert.match(adminStats, /setInterval\(refresh, 5000\)/);
  assert.match(poster, /sessionStorage\.getItem/);
  assert.match(poster, /sessionStorage\.setItem/);
});

test("etkinlik oturumu kaydı popup verisini bekletmeden yeniler ve yükleme hatasını başarı saymaz", async () => {
  const [action, page] = await Promise.all([
    read("app", "admin", "(panel)", "etkinlik-modu", "actions.ts"),
    read("app", "admin", "(panel)", "etkinlik-modu", "page.tsx"),
  ]);
  assert.match(action, /updateTag\(EVENT_MODE_CACHE_TAG\)/);
  assert.doesNotMatch(action, /revalidateTag\(EVENT_MODE_CACHE_TAG,\s*"max"\)/);
  assert.match(page, /"gorsel-hatasi"/);
  assert.match(page, /Görsel kaydedilemedi/);
});

test("veritabanı tekrar katılımı ve tek aktif oturumu kısıtlar", async () => {
  const [schema, migration] = await Promise.all([
    read("prisma", "schema.prisma"),
    read("prisma", "migrations", "20260922103000_enforce_single_active_event_session", "migration.sql"),
  ]);
  assert.match(schema, /@@unique\(\[eventSessionId, email\]\)/);
  assert.match(schema, /@@unique\(\[participantId, questionId\]\)/);
  assert.match(schema, /@@unique\(\[eventSessionId, participantId\]\)/);
  assert.match(schema, /@@unique\(\[pollId, participantId\]\)/);
  assert.match(migration, /CREATE UNIQUE INDEX "EventSession_single_active_key"/);
  assert.match(migration, /WHERE "isActive" = true/);
});
