"use client";

import { type FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Plus } from "lucide-react";

import { createSiteStatAction } from "@/app/admin/(panel)/istatistikler/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function CreateStatButton({ suggestedOrder }: { suggestedOrder: number }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createSiteStatAction(formData);

      if (!result.success) {
        setError(result.message);
        return;
      }

      form.reset();
      setIsOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="primary" className="rounded-xl">
          <Plus aria-hidden="true" />
          Yeni Kart Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl border-primary-100 bg-white dark:border-white/15 dark:bg-primary-950">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-primary-950 dark:text-white">
              Yeni istatistik kartı
            </DialogTitle>
            <DialogDescription className="leading-6 text-primary-500 dark:text-primary-200">
              Anasayfada gösterilecek değeri, etiketi ve sıralama
              önceliğini girin.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="new-stat-label"
                className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-50"
              >
                Etiket
              </label>
              <Input
                id="new-stat-label"
                name="label"
                minLength={2}
                maxLength={80}
                placeholder="Örn. Aktif Üye"
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="new-stat-label-en" className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-50">
                Etiket — İngilizce (opsiyonel)
              </label>
              <Input id="new-stat-label-en" name="labelEn" maxLength={80} placeholder="E.g. Active Members" />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="new-stat-value"
                className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-50"
              >
                Değer
              </label>
              <Input
                id="new-stat-value"
                name="value"
                minLength={1}
                maxLength={30}
                placeholder="Örn. 120+"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="new-stat-order"
                className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-50"
              >
                Sıra
              </label>
              <Input
                id="new-stat-order"
                name="order"
                type="number"
                defaultValue={suggestedOrder}
                min={0}
                max={9999}
                step={1}
                required
              />
            </div>
          </div>

          {error ? (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200"
            >
              {error}
            </p>
          ) : null}

          <DialogFooter className="mt-6 gap-2 sm:space-x-0">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setIsOpen(false)}
            >
              Vazgeç
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="rounded-xl"
              disabled={isPending}
            >
              {isPending ? (
                <LoaderCircle className="animate-spin" aria-hidden="true" />
              ) : (
                <Plus aria-hidden="true" />
              )}
              Kartı ekle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
