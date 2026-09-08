import type {
  ContactSubmissionInput,
  MembershipApplicationInput,
} from "@/lib/form-validation";

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function htmlRow(label: string, value: string) {
  return `<tr><th align="left" style="padding:8px 12px;color:#1b2a5e">${escapeHtml(label)}</th><td style="padding:8px 12px">${escapeHtml(value)}</td></tr>`;
}

function wrapNotification(title: string, rows: string) {
  return `<!doctype html><html lang="tr"><body style="margin:0;background:#f5f7fb;color:#10162f;font-family:Arial,sans-serif"><div style="margin:0 auto;max-width:680px;padding:32px 16px"><div style="border-top:4px solid #f15a24;border-radius:14px;background:#ffffff;padding:24px;box-shadow:0 12px 30px rgba(27,42,94,.10)"><h1 style="margin:0 0 18px;color:#1b2a5e;font-size:22px">${escapeHtml(title)}</h1><table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.55">${rows}</table><p style="margin:20px 0 0;color:#59627c;font-size:12px">Bu bildirim galatakariyervegirisimcilik.com tarafından gönderildi. Kayıt admin panelinde saklanmaya devam eder.</p></div></div></body></html>`;
}

export function createContactNotification(
  submission: ContactSubmissionInput,
  submissionId: number,
) {
  return {
    subject: `Yeni iletişim mesajı (#${submissionId})`,
    text: [
      "Yeni iletişim mesajı",
      `Kayıt: #${submissionId}`,
      `Ad soyad: ${submission.name}`,
      `E-posta: ${submission.email}`,
      "",
      submission.message,
    ].join("\n"),
    html: wrapNotification(
      "Yeni iletişim mesajı",
      [
        htmlRow("Kayıt", `#${submissionId}`),
        htmlRow("Ad soyad", submission.name),
        htmlRow("E-posta", submission.email),
        htmlRow("Mesaj", submission.message),
      ].join(""),
    ),
  };
}

export function createMembershipNotification(
  application: MembershipApplicationInput,
  applicationId: number,
) {
  return {
    subject: `Yeni kulüp başvurusu (#${applicationId})`,
    text: [
      "Yeni kulüp başvurusu",
      `Kayıt: #${applicationId}`,
      `Ad soyad: ${application.fullName}`,
      `E-posta: ${application.email}`,
      `Bölüm: ${application.department}`,
      `Öğrenci numarası: ${application.studentNumber ?? "Belirtilmedi"}`,
      `Telefon: ${application.phone ?? "Belirtilmedi"}`,
      "",
      application.motivation,
    ].join("\n"),
    html: wrapNotification(
      "Yeni kulüp başvurusu",
      [
        htmlRow("Kayıt", `#${applicationId}`),
        htmlRow("Ad soyad", application.fullName),
        htmlRow("E-posta", application.email),
        htmlRow("Bölüm", application.department),
        htmlRow("Öğrenci numarası", application.studentNumber ?? "Belirtilmedi"),
        htmlRow("Telefon", application.phone ?? "Belirtilmedi"),
        htmlRow("Katılım motivasyonu", application.motivation),
      ].join(""),
    ),
  };
}
