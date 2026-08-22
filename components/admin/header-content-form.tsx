"use client";

import { useActionState, useState } from "react";
import { ArrowDown, ArrowUp, LoaderCircle, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminActionState } from "@/lib/admin-action-state";
import { initialAdminActionState } from "@/lib/admin-action-state";
import type { navigationRoutes } from "@/lib/site-content";

type NavigationItem = {
  id: (typeof navigationRoutes)[number]["id"];
  href: string;
  label: string;
  labelEn: string;
};

export function HeaderContentForm({
  action,
  brandName,
  brandNameEn,
  ctaLabel,
  ctaLabelEn,
  navigation,
}: {
  action: (
    state: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  brandName: string;
  brandNameEn: string;
  ctaLabel: string;
  ctaLabelEn: string;
  navigation: NavigationItem[];
}) {
  const [items, setItems] = useState(navigation);
  const [state, formAction, isPending] = useActionState(
    action,
    initialAdminActionState,
  );

  function moveItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= items.length) {
      return;
    }

    setItems((current) => {
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  return (
    <form action={formAction} className="mt-9 space-y-7">
      <input
        type="hidden"
        name="navigationOrder"
        value={JSON.stringify(items.map((item) => item.id))}
      />

      <section className="rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-primary-950/65 sm:p-7">
        <h2 className="font-heading text-xl font-bold text-primary-950 dark:text-white">
          Marka ve çağrı butonu
        </h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="header-brand-name"
              className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-100"
            >
              Logo yanındaki metin
            </label>
            <Input
              id="header-brand-name"
              name="header.brand.name"
              defaultValue={brandName}
              minLength={2}
              maxLength={120}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="header-brand-name-en" className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-100">Logo yanındaki metin — İngilizce (opsiyonel)</label>
            <Input id="header-brand-name-en" name="header.brand.name.en" defaultValue={brandNameEn} maxLength={120} />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="header-cta-label"
              className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-100"
            >
              Katılım butonu metni
            </label>
            <Input
              id="header-cta-label"
              name="header.cta.label"
              defaultValue={ctaLabel}
              minLength={2}
              maxLength={120}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="header-cta-label-en" className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-100">Katılım butonu — İngilizce (opsiyonel)</label>
            <Input id="header-cta-label-en" name="header.cta.label.en" defaultValue={ctaLabelEn} maxLength={120} />
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-primary-950/65 sm:p-7">
        <div>
          <h2 className="font-heading text-xl font-bold text-primary-950 dark:text-white">
            Menü öğeleri
          </h2>
          <p className="mt-2 text-sm leading-6 text-primary-600 dark:text-primary-200">
            Oklarla sıralamayı değiştirin. Sayfa adresleri sabittir; yalnızca
            görünen metin ve sıra düzenlenir.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="grid gap-3 rounded-2xl border border-primary-100 bg-primary-50/55 p-4 dark:border-white/10 dark:bg-white/[0.04] sm:grid-cols-[2rem_1fr_1fr_auto] sm:items-end"
            >
              <span className="font-heading text-sm font-bold text-accent-700 dark:text-accent-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="space-y-2">
                <label
                  htmlFor={`header-nav-${item.id}`}
                  className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-100"
                >
                  {item.href} menü metni
                </label>
                <Input
                  id={`header-nav-${item.id}`}
                  name={`header.nav.${item.id}.label`}
                  defaultValue={item.label}
                  minLength={2}
                  maxLength={120}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor={`header-nav-${item.id}-en`} className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-100">İngilizce menü metni (opsiyonel)</label>
                <Input id={`header-nav-${item.id}-en`} name={`header.nav.${item.id}.label.en`} defaultValue={item.labelEn} maxLength={120} />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  aria-label={`${item.label} öğesini yukarı taşı`}
                >
                  <ArrowUp aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1}
                  aria-label={`${item.label} öğesini aşağı taşı`}
                >
                  <ArrowDown aria-hidden="true" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          ) : (
            <Save aria-hidden="true" />
          )}
          Header’ı kaydet
        </Button>
        {state.message ? (
          <p
            role={state.success ? "status" : "alert"}
            className={
              state.success
                ? "text-sm font-semibold text-emerald-700 dark:text-emerald-300"
                : "text-sm font-semibold text-red-700 dark:text-red-300"
            }
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
