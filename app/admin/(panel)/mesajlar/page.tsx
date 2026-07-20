import Link from "next/link";
import { ArrowRight, Inbox, Mail, MailOpen } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function AdminMessagesPage() {
  const messages = await prisma.contactSubmission.findMany({
    orderBy: [
      {
        isRead: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const unreadCount = messages.filter((message) => !message.isRead).length;

  return (
    <>
      <AdminPageHeader
        eyebrow="Gelen Kutusu"
        title="İletişim Mesajları"
        description="Web sitesindeki iletişim formundan gelen soruları ve iş birliği taleplerini takip edin."
      />

      <section className="mt-9 overflow-hidden rounded-[1.5rem] border border-primary-100 bg-white shadow-[0_18px_50px_-38px_rgba(27,42,94,0.45)]">
        <div className="flex flex-col gap-2 border-b border-primary-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <h2 className="font-heading text-lg font-bold text-primary-950">
              Tüm mesajlar
            </h2>
            <p className="mt-1 text-sm text-primary-400">
              {messages.length} mesaj · {unreadCount} okunmamış
            </p>
          </div>
          {unreadCount ? (
            <span className="w-fit rounded-full bg-accent-50 px-3 py-1.5 text-xs font-bold text-accent-700">
              Yanıt bekleyen {unreadCount} mesaj
            </span>
          ) : null}
        </div>

        {messages.length ? (
          <div className="divide-y divide-primary-50">
            {messages.map((message) => (
              <Link
                key={message.id}
                href={`/admin/mesajlar/${message.id}`}
                className={cn(
                  "group grid gap-3 px-5 py-5 transition-colors hover:bg-primary-50/60 sm:grid-cols-[minmax(10rem,0.7fr)_minmax(12rem,0.7fr)_minmax(16rem,1.5fr)_auto] sm:items-center sm:gap-5 sm:px-7",
                  !message.isRead && "bg-accent-50/35",
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl",
                      message.isRead
                        ? "bg-primary-50 text-primary-400"
                        : "bg-accent-100 text-accent-700",
                    )}
                  >
                    {message.isRead ? (
                      <MailOpen className="size-4.5" aria-hidden="true" />
                    ) : (
                      <Mail className="size-4.5" aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "truncate text-sm text-primary-900",
                        !message.isRead && "font-bold",
                      )}
                    >
                      {message.name}
                    </p>
                    <p className="mt-1 text-xs text-primary-400 sm:hidden">
                      {dateFormatter.format(message.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="truncate text-sm text-primary-500">
                  {message.email}
                </p>
                <p
                  className={cn(
                    "line-clamp-2 text-sm leading-6 text-primary-500",
                    !message.isRead && "font-medium text-primary-700",
                  )}
                >
                  {message.message}
                </p>
                <div className="hidden items-center gap-4 sm:flex">
                  <time className="whitespace-nowrap text-xs text-primary-400">
                    {dateFormatter.format(message.createdAt)}
                  </time>
                  <ArrowRight
                    className="size-4 text-primary-300 transition-transform group-hover:translate-x-0.5 group-hover:text-accent-600"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-5 py-16 text-center">
            <Inbox className="mx-auto size-9 text-primary-300" />
            <p className="mt-3 text-sm font-semibold text-primary-600">
              Henüz iletişim mesajı bulunmuyor.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
