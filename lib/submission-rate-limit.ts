import "server-only";

import { prisma } from "@/lib/prisma";

export const SUBMISSION_RATE_LIMIT_MINUTES = 10;

function getWindowStart() {
  return new Date(
    Date.now() - SUBMISSION_RATE_LIMIT_MINUTES * 60 * 1000,
  );
}

export async function hasRecentContactSubmission(email: string) {
  const recentSubmission = await prisma.contactSubmission.findFirst({
    where: {
      email,
      createdAt: {
        gte: getWindowStart(),
      },
    },
    select: {
      id: true,
    },
  });

  return recentSubmission !== null;
}

export async function hasRecentMembershipApplication(email: string) {
  const recentApplication =
    await prisma.membershipApplication.findFirst({
      where: {
        email,
        createdAt: {
          gte: getWindowStart(),
        },
      },
      select: {
        id: true,
      },
    });

  return recentApplication !== null;
}
