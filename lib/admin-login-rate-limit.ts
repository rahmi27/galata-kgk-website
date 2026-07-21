import "server-only";

import { prisma } from "@/lib/prisma";

export const ADMIN_LOGIN_MAX_ATTEMPTS = 5;
export const ADMIN_LOGIN_WINDOW_MINUTES = 10;

function windowStart() {
  return new Date(Date.now() - ADMIN_LOGIN_WINDOW_MINUTES * 60 * 1000);
}

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const candidate =
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";

  return candidate.slice(0, 64);
}

export async function isAdminLoginRateLimited(
  username: string,
  ipAddress: string,
) {
  const attempts = await prisma.adminLoginAttempt.count({
    where: {
      username,
      ipAddress,
      createdAt: {
        gte: windowStart(),
      },
    },
  });

  return attempts >= ADMIN_LOGIN_MAX_ATTEMPTS;
}

export async function recordFailedAdminLogin(
  username: string,
  ipAddress: string,
) {
  await prisma.$transaction([
    prisma.adminLoginAttempt.create({
      data: {
        username,
        ipAddress,
      },
    }),
    prisma.adminLoginAttempt.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);
}

export async function clearAdminLoginAttempts(
  username: string,
  ipAddress: string,
) {
  await prisma.adminLoginAttempt.deleteMany({
    where: {
      username,
      ipAddress,
    },
  });
}
