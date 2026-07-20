import { NextResponse } from "next/server";

import { validateMembershipApplication } from "@/lib/form-validation";
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
    await prisma.membershipApplication.create({
      data: validation.data,
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
