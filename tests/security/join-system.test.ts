import { test } from "node:test";
import assert from "node:assert/strict";
import { validateApplicantBasics, normalizeTurkishMobile, safeHttpUrl } from "../../lib/join-validation";
import { MAX_APPLICATION_FILE_BYTES, asciiDownloadFilename, isApplicationPath, validApplicationSignature } from "../../lib/application-file-validation";
import { csvFile } from "../../lib/safe-csv";

const valid = { fullName: "Ayşe Yılmaz", phone: "0532 123 45 67", email: "AYSE@EXAMPLE.COM", departmentName: "Hemşirelik", classYear: "2", studentNumber: " 1234567 " };
test("normalizes applicant identity and Turkish mobile", () => {
  const result = validateApplicantBasics(valid);
  assert.ok(result.data);
  assert.equal(result.data.email, "ayse@example.com");
  assert.equal(result.data.phone, "+905321234567");
  assert.equal(result.data.studentNumber, "1234567");
  assert.equal(normalizeTurkishMobile("+90 532 123 45 67"), "+905321234567");
});
test("rejects invalid or incomplete basics", () => {
  assert.ok(validateApplicantBasics({ ...valid, studentNumber: "12A" }).error);
  assert.ok(validateApplicantBasics({ ...valid, phone: "0212 123 45 67" }).error);
  assert.ok(validateApplicantBasics({ ...valid, classYear: "6" }).error);
  assert.ok(validateApplicantBasics({ ...valid, email: "not-an-email" }).error);
});
test("accepts only credential-free HTTP(S) links", () => {
  assert.equal(safeHttpUrl("javascript:alert(1)"), null);
  assert.equal(safeHttpUrl("data:text/html,evil"), null);
  assert.equal(safeHttpUrl("https://user:pass@example.com"), null);
  assert.equal(safeHttpUrl("https://example.com/work"), "https://example.com/work");
});
test("private file limit, path and magic bytes", () => {
  assert.ok(Math.floor(4.9 * 1024 * 1024) < MAX_APPLICATION_FILE_BYTES);
  assert.ok(Math.ceil(5.1 * 1024 * 1024) > MAX_APPLICATION_FILE_BYTES);
  assert.ok(isApplicationPath("applications/123e4567-e89b-42d3-a456-426614174000/123e4567-e89b-42d3-a456-426614174001.pdf"));
  assert.equal(isApplicationPath("uploads/public/file.pdf"), false);
  assert.ok(validApplicationSignature(Buffer.from("%PDF-1.7"), "application/pdf"));
  assert.equal(validApplicationSignature(Buffer.from("<html>"), "application/pdf"), false);
  assert.ok(validApplicationSignature(Uint8Array.from([0xff, 0xd8, 0xff, 0x00]), "image/jpeg"));
  assert.equal(validApplicationSignature(Uint8Array.from([0xff, 0xd8, 0xff]), "image/png"), false);
});
test("download header fallback remains ASCII-safe for Turkish filenames", () => {
  const fallback = asciiDownloadFilename('çalışma-şablonu.pdf');
  assert.match(fallback, /^[\x20-\x7E]+$/);
  assert.doesNotThrow(() => new Headers({ "Content-Disposition": `attachment; filename="${fallback}"; filename*=UTF-8''${encodeURIComponent('çalışma-şablonu.pdf')}` }));
  assert.equal(asciiDownloadFilename('"\r\n.pdf'), '___.pdf');
});
test("CSV escapes formulas and includes Excel BOM", () => {
  const file = csvFile([["Name", "Value"], ["Alice", "=1+1"], ["Bob", "+CMD"]]);
  assert.ok(file.startsWith("\uFEFF"));
  assert.ok(file.includes("\"'=1+1\""));
  assert.ok(file.includes("\"'+CMD\""));
});
