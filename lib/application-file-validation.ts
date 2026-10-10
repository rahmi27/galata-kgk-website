export const MAX_APPLICATION_FILE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_APPLICATION_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;
export function isApplicationPath(pathname: string) {
  return /^applications\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpe?g|png|webp|pdf)$/.test(pathname);
}
export function validApplicationSignature(bytes: Uint8Array, type: string) {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte);
  if (type === "image/webp") return Buffer.from(bytes.subarray(0, 4)).toString() === "RIFF" && Buffer.from(bytes.subarray(8, 12)).toString() === "WEBP";
  if (type === "application/pdf") return Buffer.from(bytes.subarray(0, 5)).toString() === "%PDF-";
  return false;
}
