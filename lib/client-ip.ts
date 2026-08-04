import "server-only";

import { createHmac } from "node:crypto";

const MAX_FORWARDED_IP_LENGTH = 64;

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const candidate =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";

  return candidate.slice(0, MAX_FORWARDED_IP_LENGTH);
}

export function getClientIpHash(request: Request) {
  const secret =
    process.env.FORM_RATE_LIMIT_SECRET?.trim() ||
    process.env.AUTH_SECRET?.trim();

  if (!secret) {
    throw new Error("IP rate limit için AUTH_SECRET yapılandırılmalıdır.");
  }

  return createHmac("sha256", secret)
    .update(getClientIp(request))
    .digest("hex");
}
