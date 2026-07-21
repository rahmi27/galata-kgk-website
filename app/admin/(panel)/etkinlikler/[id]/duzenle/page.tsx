import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { updateEventAction } from "@/app/admin/(panel)/etkinlikler/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EventAdminForm } from "@/components/admin/event-admin-form";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function toDateTimeLocal(date: Date | null) {
  if (!date) {
    return "";
  }

  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eventId = Number(id);

  if (!Number.isInteger(eventId)) {
    notFound();
  }

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    notFound();
  }

  const updateAction = updateEventAction.bind(null, event.id);

  return (
    <>
      <AdminPageHeader
        eyebrow="Etkinlik Düzenleme"
        title={event.title}
        description="Değişiklikler kaydedildiğinde halka açık etkinlik sayfalarına da yansır."
        actions={
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/admin/etkinlikler">
              <ArrowLeft aria-hidden="true" />
              Etkinliklere dön
            </Link>
          </Button>
        }
      />

      <section className="mt-9 max-w-4xl rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)] sm:p-8">
        <EventAdminForm
          action={updateAction}
          submitLabel="Değişiklikleri kaydet"
          defaultValues={{
            title: event.title,
            description: event.description,
            longDescription: event.longDescription,
            date: toDateTimeLocal(event.date),
            location: event.location,
            imageUrl: event.imageUrl ?? "",
            category: event.category,
          }}
        />
      </section>
    </>
  );
}
