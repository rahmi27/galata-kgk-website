import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCheck, Mail, UserRound } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MarkMessageReadButton } from "@/components/admin/mark-message-read-button";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "long",
  timeStyle: "short",
});

export default async function AdminMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const messageId = Number(id);

  if (!Number.isInteger(messageId)) {
    notFound();
  }

  const message = await prisma.contactSubmission.findUnique({
    where: {
      id: messageId,
    },
  });

  if (!message) {
    notFound();
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Mesaj Detayı"
        title={message.name}
        description={`Gönderim: ${dateFormatter.format(message.createdAt)}`}
        actions={
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/admin/mesajlar">
              <ArrowLeft aria-hidden="true" />
              Mesajlara dön
            </Link>
          </Button>
        }
      />

      <section className="mt-9 max-w-4xl overflow-hidden rounded-[1.5rem] border border-primary-100 bg-white shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)]">
        <div className="flex flex-col gap-5 border-b border-primary-100 bg-primary-50/55 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="space-y-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-primary-800">
              <UserRound className="size-4 text-accent-600" aria-hidden="true" />
              {message.name}
            </p>
            <a
              href={`mailto:${message.email}`}
              className="flex items-center gap-2 text-sm text-primary-500 transition-colors hover:text-accent-700"
            >
              <Mail className="size-4" aria-hidden="true" />
              {message.email}
            </a>
          </div>
          {message.isRead ? (
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
              <CheckCheck className="size-4" aria-hidden="true" />
              Okundu
            </span>
          ) : (
            <span className="w-fit rounded-full bg-accent-100 px-3 py-1.5 text-xs font-bold text-accent-700">
              Okunmamış
            </span>
          )}
        </div>

        <div className="p-5 sm:p-8">
          <p className="whitespace-pre-wrap text-base leading-8 text-primary-700">
            {message.message}
          </p>

          {!message.isRead ? (
            <div className="mt-8 border-t border-primary-100 pt-6">
              <MarkMessageReadButton messageId={message.id} />
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
