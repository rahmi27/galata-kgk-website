import { NextResponse } from "next/server";

import { getClientIpHash } from "@/lib/client-ip";
import { isHoneypotTriggered } from "@/lib/form-spam-protection";
import { validateMembershipApplication } from "@/lib/form-validation";
import { prisma } from "@/lib/prisma";
import { PRIVACY_NOTICE_VERSION } from "@/lib/privacy";
import {
  hasRecentMembershipApplication,
  hasExceededMembershipIpLimit,
  SUBMISSION_RATE_LIMIT_MINUTES,
} from "@/lib/submission-rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Form verileri okunamadı. Lütfen tekrar deneyin.",
      },
      {
        status: 400,
      },
    );
  }

  if (isHoneypotTriggered(payload)) {
    return NextResponse.json(
      {
        message:
          "Başvurunuz başarıyla alındı. Galata KGK ekibi en kısa sürede sizinle iletişime geçecek.",
      },
      { status: 201 },
    );
  }

  const validation = validateMembershipApplication(payload);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: validation.error,
      },
      {
        status: 400,
      },
    );
  }

  try {
    const ipHash = getClientIpHash(request);
    const [isEmailRateLimited, isIpRateLimited] = await Promise.all([
      hasRecentMembershipApplication(validation.data.email),
      hasExceededMembershipIpLimit(ipHash),
    ]);

    if (isEmailRateLimited) {
      return NextResponse.json(
        {
          error: `Bu e-posta adresiyle kısa süre önce bir başvuru gönderildi. Lütfen ${SUBMISSION_RATE_LIMIT_MINUTES} dakika sonra tekrar deneyin.`,
        },
        {
          status: 429,
        },
      );
    }

    if (isIpRateLimited) {
      return NextResponse.json(
        {
          error:
            "Bu bağlantıdan kısa sürede çok sayıda başvuru gönderildi. Lütfen daha sonra tekrar deneyin.",
        },
        { status: 429 },
      );
    }

    await prisma.membershipApplication.create({
      data: {
        ...validation.data,
        ipHash,
        privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
        privacyAcknowledgedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message:
          "Başvurunuz başarıyla alındı. Galata KGK ekibi en kısa sürede sizinle iletişime geçecek.",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Katılım başvurusu kaydedilemedi.", error);

    return NextResponse.json(
      {
        error:
          "Başvurunuz şu anda kaydedilemedi. Lütfen biraz sonra tekrar deneyin.",
      },
      {
        status: 500,
      },
    );
  }
}
