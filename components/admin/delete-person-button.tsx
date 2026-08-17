"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";

import { deletePersonAction } from "@/app/admin/(panel)/uyeler/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeletePersonButton({
  personId,
  personName,
  membershipCount,
}: {
  personId: number;
  personName: string;
  membershipCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function remove() {
    setError("");
    startTransition(async () => {
      const result = await deletePersonAction(personId);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-lg text-red-700 hover:bg-red-50 hover:text-red-800 dark:text-red-300 dark:hover:bg-red-950/40"
        >
          <Trash2 aria-hidden="true" />
          Kişiyi sil
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl border-primary-100 bg-white dark:border-white/10 dark:bg-primary-950">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-primary-950 dark:text-white">
            Kişi tamamen silinsin mi?
          </DialogTitle>
          <DialogDescription className="leading-6 text-primary-600 dark:text-primary-200">
            “{personName}” kişi kaydı, fotoğrafı ve bağlı {membershipCount} kategori
            üyeliği kalıcı olarak silinecek. Bu işlem yalnızca kişinin belirli bir
            kategoriden çıkarılması değildir.
          </DialogDescription>
        </DialogHeader>
        {error ? (
          <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-300">
            {error}
          </p>
        ) : null}
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Vazgeç
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={remove} disabled={pending}>
            {pending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Trash2 aria-hidden="true" />}
            Tamamen sil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
