"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { LoaderCircle, Plus, Save, Trash2 } from "lucide-react";

import {
  deleteClubSocialLinkAction,
  saveClubSocialLinkAction,
} from "@/app/admin/(panel)/gorunum/iletisim/social-actions";
import { SocialPlatformIcon } from "@/components/shared/social-platform-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialAdminActionState } from "@/lib/admin-action-state";
import type { PublicClubSocialLink } from "@/lib/club-social-links";
import {
  getSocialPlatformLabel,
  socialPlatformOptions,
} from "@/lib/social-platforms";

export function ClubSocialLinksAdmin({
  links,
}: {
  links: PublicClubSocialLink[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    saveClubSocialLinkAction,
    initialAdminActionState,
  );
  const [deleteMessage, setDeleteMessage] = useState("");
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDelete(link: PublicClubSocialLink) {
    if (!window.confirm(`${link.label} hesabını kaldırmak istediğinize emin misiniz?`)) {
      return;
    }

    startDeleteTransition(async () => {
      const result = await deleteClubSocialLinkAction(link.id);
      setDeleteMessage(result.message);
    });
  }

  return (
    <section className="mt-7 rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-primary-950/65 sm:p-7">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700 dark:bg-accent/15 dark:text-accent-300">
          <Plus className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-heading text-xl font-bold text-primary-950 dark:text-white">
            Kulüp sosyal medya hesapları
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-primary-600 dark:text-primary-200">
            Hesaplar Footer ve İletişim sayfasında birlikte kullanılır. Aynı platformu yeniden kaydetmek mevcut adresi günceller.
          </p>
        </div>
      </div>

      {links.length ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {links.map((link) => (
            <article
              key={link.id}
              className="flex min-w-0 items-center gap-3 rounded-2xl border border-primary-100 bg-primary-50/60 p-4 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-900 text-white">
                <SocialPlatformIcon platform={link.platform} className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-sm font-bold text-primary-950 dark:text-white">
                  {link.label}
                </p>
                <p className="mt-1 truncate text-xs text-primary-600 dark:text-primary-300">
                  {link.url}
                </p>
                <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-primary-500 dark:text-primary-300">
                  {getSocialPlatformLabel(link.platform)} · sıra {link.order}
                </p>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="shrink-0 rounded-xl text-red-700 hover:bg-red-50 hover:text-red-800 dark:text-red-300 dark:hover:bg-red-500/10"
                disabled={isDeleting}
                onClick={() => handleDelete(link)}
                aria-label={`${link.label} hesabını sil`}
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-2xl border border-dashed border-primary-200 px-4 py-7 text-center text-sm font-medium text-primary-600 dark:border-white/15 dark:text-primary-200">
          Henüz kulüp hesabı eklenmedi.
        </p>
      )}

      <form ref={formRef} action={formAction} className="mt-7 grid gap-5 border-t border-primary-100 pt-7 md:grid-cols-2 xl:grid-cols-[0.8fr_1fr_1.6fr_0.5fr_auto] xl:items-end dark:border-white/10">
        <AdminField label="Platform" htmlFor="club-social-platform">
          <select
            id="club-social-platform"
            name="platform"
            defaultValue=""
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="" disabled>Platform seçin</option>
            {socialPlatformOptions.map((platform) => (
              <option key={platform.value} value={platform.value}>
                {platform.label}
              </option>
            ))}
          </select>
        </AdminField>
        <AdminField label="Görünen ad" htmlFor="club-social-label">
          <Input id="club-social-label" name="label" placeholder="Örn. @galatakgk" maxLength={80} />
        </AdminField>
        <AdminField label="Bağlantı adresi" htmlFor="club-social-url">
          <Input id="club-social-url" name="url" type="url" placeholder="https://..." maxLength={500} required />
        </AdminField>
        <AdminField label="Sıra" htmlFor="club-social-order">
          <Input id="club-social-order" name="order" type="number" min={0} max={9999} defaultValue={links.length + 1} required />
        </AdminField>
        <Button type="submit" variant="primary" className="rounded-xl" disabled={isPending}>
          {isPending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Save aria-hidden="true" />}
          Kaydet
        </Button>
      </form>

      {state.message || deleteMessage ? (
        <p
          role={state.success ? "status" : "alert"}
          className={`mt-4 text-sm font-semibold ${state.success ? "text-emerald-700 dark:text-emerald-300" : "text-primary-700 dark:text-primary-200"}`}
        >
          {state.message || deleteMessage}
        </p>
      ) : null}
    </section>
  );
}

function AdminField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-100">
        {label}
      </label>
      {children}
    </div>
  );
}
