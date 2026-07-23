"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import type { AdminActionState } from "@/lib/admin-action-state";
import { requireAdmin } from "@/lib/admin-auth";
import { validateEventForm } from "@/lib/admin-validation";
import {
  deleteUploadedImage,
  saveImageUpload,
} from "@/lib/image-upload";
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
  updateTag("events");
  revalidatePath("/");
  revalidatePath("/etkinliklerimiz");
  revalidatePath("/sitemap.xml");
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

  const imageUpload = await saveImageUpload(
    formData.get("eventImage"),
    "events",
  );

  if (!imageUpload.success) {
    return {
      success: false,
      message: imageUpload.error,
    };
  }

  try {
    const slug = await findAvailableSlug(validation.data.title);
    const eventData = {
      title: validation.data.title,
      description: validation.data.description,
      longDescription: validation.data.longDescription,
      date: validation.data.date,
      location: validation.data.location,
      category: validation.data.category,
      imageAlt: validation.data.imageAlt,
    };

    await prisma.event.create({
      data: {
        ...eventData,
        imageUrl: imageUpload.path,
        slug,
      },
    });

    revalidateEventPages(slug);

    return {
      success: true,
      message: "Etkinlik başarıyla oluşturuldu.",
    };
  } catch (error) {
    await deleteUploadedImage(imageUpload.path);
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

  const imageUpload = await saveImageUpload(
    formData.get("eventImage"),
    "events",
  );

  if (!imageUpload.success) {
    return {
      success: false,
      message: imageUpload.error,
    };
  }

  try {
    const slug = await findAvailableSlug(validation.data.title, eventId);
    const eventData = {
      title: validation.data.title,
      description: validation.data.description,
      longDescription: validation.data.longDescription,
      date: validation.data.date,
      location: validation.data.location,
      category: validation.data.category,
      imageAlt: validation.data.imageAlt,
    };

    await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        ...eventData,
        imageUrl: imageUpload.path ?? existingEvent.imageUrl,
        slug,
      },
    });

    revalidateEventPages(existingEvent.slug);
    revalidateEventPages(slug);

    if (imageUpload.path && imageUpload.path !== existingEvent.imageUrl) {
      await deleteUploadedImage(existingEvent.imageUrl);
    }
  } catch (error) {
    await deleteUploadedImage(imageUpload.path);
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
      imageUrl: true,
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

    await deleteUploadedImage(event.imageUrl);
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
