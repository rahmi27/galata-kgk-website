"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";

import { deleteEventAction } from "@/app/admin/(panel)/etkinlikler/actions";
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

export function DeleteEventButton({
  eventId,
  eventTitle,
}: {
  eventId: number;
  eventTitle: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setError("");

    startTransition(async () => {
      const result = await deleteEventAction(eventId);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setIsOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 aria-hidden="true" />
          Sil
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl border-primary-100 bg-white">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-primary-950">
            Etkinlik silinsin mi?
          </DialogTitle>
          <DialogDescription className="leading-6 text-primary-500">
            “{eventTitle}” kalıcı olarak silinecek. Bu işlem geri alınamaz.
          </DialogDescription>
        </DialogHeader>
        {error ? (
          <p role="alert" className="text-sm font-medium text-red-600">
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
            Etkinliği sil
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
