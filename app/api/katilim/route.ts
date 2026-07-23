import { NextResponse } from "next/server";

import { validateMembershipApplication } from "@/lib/form-validation";
import { prisma } from "@/lib/prisma";
import { PRIVACY_NOTICE_VERSION } from "@/lib/privacy";
import {
  hasRecentMembershipApplication,
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
    const isRateLimited = await hasRecentMembershipApplication(
      validation.data.email,
    );

    if (isRateLimited) {
      return NextResponse.json(
        {
          error: `Bu e-posta adresiyle kısa süre önce bir başvuru gönderildi. Lütfen ${SUBMISSION_RATE_LIMIT_MINUTES} dakika sonra tekrar deneyin.`,
        },
        {
          status: 429,
        },
      );
    }

    await prisma.membershipApplication.create({
      data: {
        ...validation.data,
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
