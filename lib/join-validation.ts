export type ApplicantBasics = {
  fullName: string;
  phone: string;
  email: string;
  departmentName: string;
  classYear: string;
  studentNumber: string;
};

export const classYears = ["Hazırlık", "1", "2", "3", "4", "5"] as const;

function field(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeTurkishMobile(value: unknown) {
  let digits = field(value).replace(/\D/g, "");
  if (digits.startsWith("90") && digits.length === 12) digits = digits.slice(2);
  if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);
  return /^5\d{9}$/.test(digits) ? `+90${digits}` : null;
}

export function validateApplicantBasics(payload: unknown): { data: ApplicantBasics; error?: never } | { data?: never; error: string } {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return { error: "Form verisi geçersiz." };
  const body = payload as Record<string, unknown>;
  const fullName = field(body.fullName);
  const phone = normalizeTurkishMobile(body.phone);
  const email = field(body.email).toLowerCase();
  const departmentName = field(body.departmentName);
  const classYear = field(body.classYear);
  const studentNumber = field(body.studentNumber);
  if (fullName.length < 3 || fullName.length > 120 || !/\S+\s+\S+/.test(fullName)) return { error: "Ad ve soyadınızı girin (en fazla 120 karakter)." };
  if (!phone) return { error: "Geçerli bir Türkiye cep telefonu girin." };
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Geçerli bir e-posta girin." };
  if (departmentName.length < 2 || departmentName.length > 150) return { error: "Bölüm 2–150 karakter olmalıdır." };
  if (!classYears.includes(classYear as (typeof classYears)[number])) return { error: "Sınıfınızı seçin." };
  if (!/^\d{5,15}$/.test(studentNumber)) return { error: "Öğrenci numarası 5–15 rakam olmalıdır." };
  return { data: { fullName, phone, email, departmentName, classYear, studentNumber } };
}

export function safeHttpUrl(value: unknown) {
  const raw = field(value);
  if (!raw || raw.length > 2000) return null;
  try {
    const url = new URL(raw);
    return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password ? url.toString() : null;
  } catch { return null; }
}
