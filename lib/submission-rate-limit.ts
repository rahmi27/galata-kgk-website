import "server-only";

import { prisma } from "@/lib/prisma";

export const SUBMISSION_RATE_LIMIT_MINUTES = 10;
export const SUBMISSION_IP_RATE_LIMIT_HOURS = 1;
export const CONTACT_IP_MAX_SUBMISSIONS = 20;
export const MEMBERSHIP_IP_MAX_SUBMISSIONS = 30;

function getWindowStart() {
  return new Date(
    Date.now() - SUBMISSION_RATE_LIMIT_MINUTES * 60 * 1000,
  );
}

function getIpWindowStart() {
  return new Date(
    Date.now() - SUBMISSION_IP_RATE_LIMIT_HOURS * 60 * 60 * 1000,
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

export async function hasExceededContactIpLimit(ipHash: string) {
  const count = await prisma.contactSubmission.count({
    where: {
      ipHash,
      createdAt: {
        gte: getIpWindowStart(),
      },
    },
  });

  return count >= CONTACT_IP_MAX_SUBMISSIONS;
}

export async function hasExceededMembershipIpLimit(ipHash: string) {
  const count = await prisma.membershipApplication.count({
    where: {
      ipHash,
      createdAt: {
        gte: getIpWindowStart(),
      },
    },
  });

  return count >= MEMBERSHIP_IP_MAX_SUBMISSIONS;
}
