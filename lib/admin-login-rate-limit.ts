import "server-only";

import { getClientIp } from "@/lib/client-ip";
import { prisma } from "@/lib/prisma";

export const ADMIN_LOGIN_MAX_ATTEMPTS = 5;
export const ADMIN_LOGIN_IP_MAX_ATTEMPTS = 20;
export const ADMIN_LOGIN_WINDOW_MINUTES = 10;

function windowStart() {
  return new Date(Date.now() - ADMIN_LOGIN_WINDOW_MINUTES * 60 * 1000);
}

export async function isAdminLoginRateLimited(
  username: string,
  ipAddress: string,
) {
  const cutoff = windowStart();
  const [usernameAttempts, ipAttempts] = await Promise.all([
    prisma.adminLoginAttempt.count({
      where: {
        username,
        createdAt: {
          gte: cutoff,
        },
      },
    }),
    prisma.adminLoginAttempt.count({
      where: {
        ipAddress,
        createdAt: {
          gte: cutoff,
        },
      },
    }),
  ]);

  return (
    usernameAttempts >= ADMIN_LOGIN_MAX_ATTEMPTS ||
    ipAttempts >= ADMIN_LOGIN_IP_MAX_ATTEMPTS
  );
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
) {
  await prisma.adminLoginAttempt.deleteMany({
    where: {
      username,
    },
  });
}

export { getClientIp };
