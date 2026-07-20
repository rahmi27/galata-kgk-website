"use client";

import { useActionState } from "react";
import { LoaderCircle, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminActionState } from "@/lib/admin-action-state";
import { initialAdminActionState } from "@/lib/admin-action-state";

export function StatAdminForm({
  action,
  statId,
  label,
  value,
  order,
}: {
  action: (
    state: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  statId: number;
  label: string;
  value: string;
  order: number;
}) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialAdminActionState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-[1fr_10rem_8rem]">
        <div className="space-y-2">
          <label
            htmlFor={`stat-label-${statId}`}
            className="font-heading text-sm font-semibold text-primary-900"
          >
            Etiket
          </label>
          <Input
            id={`stat-label-${statId}`}
            name="label"
            defaultValue={label}
            minLength={2}
            maxLength={80}
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`stat-value-${statId}`}
            className="font-heading text-sm font-semibold text-primary-900"
          >
            Değer
          </label>
          <Input
            id={`stat-value-${statId}`}
            name="value"
            defaultValue={value}
            minLength={1}
            maxLength={30}
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor={`stat-order-${statId}`}
            className="font-heading text-sm font-semibold text-primary-900"
          >
            Sıra
          </label>
          <Input
            id={`stat-order-${statId}`}
            name="order"
            type="number"
            defaultValue={order}
            min={0}
            max={9999}
            step={1}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="w-fit rounded-xl"
          disabled={isPending}
        >
          {isPending ? (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          ) : (
            <Save aria-hidden="true" />
          )}
          Kartı kaydet
        </Button>

        {state.message ? (
          <p
            role={state.success ? "status" : "alert"}
            className={
              state.success
                ? "text-sm font-medium text-emerald-700"
                : "text-sm font-medium text-red-600"
            }
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
