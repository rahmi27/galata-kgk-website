import { NextResponse } from "next/server";

import { validateContactSubmission } from "@/lib/form-validation";
import { prisma } from "@/lib/prisma";
import {
  hasRecentContactSubmission,
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

  const validation = validateContactSubmission(payload);

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
    const isRateLimited = await hasRecentContactSubmission(
      validation.data.email,
    );

    if (isRateLimited) {
      return NextResponse.json(
        {
          error: `Bu e-posta adresiyle kısa süre önce bir mesaj gönderildi. Lütfen ${SUBMISSION_RATE_LIMIT_MINUTES} dakika sonra tekrar deneyin.`,
        },
        {
          status: 429,
        },
      );
    }

    await prisma.contactSubmission.create({
      data: validation.data,
    });

    return NextResponse.json(
      {
        message:
          "Teşekkürler! Mesajınız başarıyla alındı. En kısa sürede size dönüş yapacağız.",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("İletişim formu kaydedilemedi.", error);

    return NextResponse.json(
      {
        error:
          "Mesajınız şu anda kaydedilemedi. Lütfen biraz sonra tekrar deneyin.",
      },
      {
        status: 500,
      },
    );
  }
}
