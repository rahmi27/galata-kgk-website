"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";

import { deleteMessageAction } from "@/app/admin/(panel)/mesajlar/actions";
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

export function DeleteMessageButton({
  messageId,
  senderName,
}: {
  messageId: number;
  senderName: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setError("");

    startTransition(async () => {
      const result = await deleteMessageAction(messageId);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setIsOpen(false);
      router.push("/admin/mesajlar");
      router.refresh();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-300 dark:hover:bg-red-500/10"
        >
          <Trash2 aria-hidden="true" />
          Mesajı sil
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl border-primary-100 bg-white dark:border-white/10 dark:bg-primary-950">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-primary-950 dark:text-white">
            Mesaj kalıcı olarak silinsin mi?
          </DialogTitle>
          <DialogDescription className="leading-6 text-primary-500 dark:text-primary-200">
            “{senderName}” tarafından gönderilen iletişim mesajı silinecek. Bu
            işlem geri alınamaz.
          </DialogDescription>
        </DialogHeader>
        {error ? (
          <p role="alert" className="text-sm font-medium text-red-600 dark:text-red-300">
            {error}
          </p>
        ) : null}
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="rounded-xl">
              Vazgeç
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            className="rounded-xl"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 aria-hidden="true" />
            )}
            Kalıcı olarak sil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
