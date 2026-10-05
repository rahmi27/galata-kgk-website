export const MAX_SERVER_VIDEO_SIZE = 4 * 1024 * 1024;

export function isValidVideoSignature(bytes: Uint8Array, type: string) {
  if (type === "video/mp4") {
    return bytes.length >= 12 &&
      String.fromCharCode(...bytes.slice(4, 8)) === "ftyp";
  }
  if (type === "video/webm") {
    return bytes.length >= 4 &&
      bytes[0] === 0x1a && bytes[1] === 0x45 &&
      bytes[2] === 0xdf && bytes[3] === 0xa3;
  }
  return false;
}
