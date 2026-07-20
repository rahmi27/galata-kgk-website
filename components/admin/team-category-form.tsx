"use client";

import { useActionState, useEffect, useRef } from "react";
import { LoaderCircle, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminActionState } from "@/lib/admin-action-state";
import { initialAdminActionState } from "@/lib/admin-action-state";

export function TeamCategoryForm({
  action,
  defaultName = "",
  defaultOrder = 0,
  submitLabel,
  resetOnSuccess = false,
}: {
  action: (
    state: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  defaultName?: string;
  defaultOrder?: number;
  submitLabel: string;
  resetOnSuccess?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    action,
    initialAdminActionState,
  );

  useEffect(() => {
    if (state.success && resetOnSuccess) {
      formRef.current?.reset();
    }
  }, [resetOnSuccess, state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid gap-4 sm:grid-cols-[1fr_8rem_auto] sm:items-end"
    >
      <div className="space-y-2">
        <label className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-50">
          Kategori Adı
          <Input
            name="name"
            defaultValue={defaultName}
            placeholder="Örn. Sponsorluk Ekibi"
            className="mt-2"
            minLength={2}
            maxLength={80}
            required
          />
        </label>
      </div>
      <div className="space-y-2">
        <label className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-50">
          Sıra
          <Input
            name="order"
            type="number"
            defaultValue={defaultOrder}
            className="mt-2"
            min={0}
            max={9999}
            step={1}
            required
          />
        </label>
      </div>
      <Button
        type="submit"
        variant="primary"
        className="rounded-xl"
        disabled={isPending}
      >
        {isPending ? (
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        ) : (
          <Save aria-hidden="true" />
        )}
        {submitLabel}
      </Button>

      {state.message ? (
        <p
          role={state.success ? "status" : "alert"}
          className={
            state.success
              ? "text-sm font-medium text-emerald-700 sm:col-span-3"
              : "text-sm font-medium text-red-600 sm:col-span-3"
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
