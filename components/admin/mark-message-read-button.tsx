"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck, LoaderCircle } from "lucide-react";

import { markMessageAsReadAction } from "@/app/admin/(panel)/mesajlar/actions";
import { Button } from "@/components/ui/button";

export function MarkMessageReadButton({ messageId }: { messageId: number }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError("");

    startTransition(async () => {
      const result = await markMessageAsReadAction(messageId);

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div>
      <Button
        type="button"
        variant="primary"
        className="rounded-xl"
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? (
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        ) : (
          <CheckCheck aria-hidden="true" />
        )}
        Okundu olarak işaretle
      </Button>
      {error ? (
        <p role="alert" className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
