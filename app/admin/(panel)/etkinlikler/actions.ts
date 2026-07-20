"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import { validateEventForm } from "@/lib/admin-validation";
import { prisma } from "@/lib/prisma";

function createSlug(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

async function findAvailableSlug(title: string, currentEventId?: number) {
  const baseSlug = createSlug(title) || "etkinlik";
  let candidate = baseSlug;
  let suffix = 2;

  while (
    await prisma.event.findFirst({
      where: {
        slug: candidate,
        ...(currentEventId
          ? {
              id: {
                not: currentEventId,
              },
            }
          : {}),
      },
      select: {
        id: true,
      },
    })
  ) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function revalidateEventPages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/etkinliklerimiz");
  revalidatePath("/admin");
  revalidatePath("/admin/etkinlikler");

  if (slug) {
    revalidatePath(`/etkinliklerimiz/${slug}`);
  }
}

export async function createEventAction(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const validation = validateEventForm(formData);

  if (!validation.success) {
    return {
      success: false,
      message: validation.error,
    };
  }

  try {
    const slug = await findAvailableSlug(validation.data.title);

    await prisma.event.create({
      data: {
        ...validation.data,
        slug,
      },
    });

    revalidateEventPages(slug);

    return {
      success: true,
      message: "Etkinlik başarıyla oluşturuldu.",
    };
  } catch (error) {
    console.error("Etkinlik oluşturulamadı.", error);

    return {
      success: false,
      message: "Etkinlik kaydedilemedi. Lütfen tekrar deneyin.",
    };
  }
}

export async function updateEventAction(
  eventId: number,
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const validation = validateEventForm(formData);

  if (!validation.success) {
    return {
      success: false,
      message: validation.error,
    };
  }

  const existingEvent = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!existingEvent) {
    return {
      success: false,
      message: "Düzenlemek istediğiniz etkinlik bulunamadı.",
    };
  }

  try {
    const slug = await findAvailableSlug(validation.data.title, eventId);

    await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        ...validation.data,
        slug,
      },
    });

    revalidateEventPages(existingEvent.slug);
    revalidateEventPages(slug);
  } catch (error) {
    console.error("Etkinlik güncellenemedi.", error);

    return {
      success: false,
      message: "Etkinlik güncellenemedi. Lütfen tekrar deneyin.",
    };
  }

  redirect("/admin/etkinlikler?durum=guncellendi");
}

export async function deleteEventAction(
  eventId: number,
): Promise<AdminActionState> {
  await requireAdmin();

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    select: {
      slug: true,
    },
  });

  if (!event) {
    return {
      success: false,
      message: "Silmek istediğiniz etkinlik bulunamadı.",
    };
  }

  try {
    await prisma.event.delete({
      where: {
        id: eventId,
      },
    });

    revalidateEventPages(event.slug);

    return {
      success: true,
      message: "Etkinlik silindi.",
    };
  } catch (error) {
    console.error("Etkinlik silinemedi.", error);

    return {
      success: false,
      message: "Etkinlik silinemedi. Lütfen tekrar deneyin.",
    };
  }
}
