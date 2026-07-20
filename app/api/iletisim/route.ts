import { NextResponse } from "next/server";

import { validateContactSubmission } from "@/lib/form-validation";
import { prisma } from "@/lib/prisma";

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
