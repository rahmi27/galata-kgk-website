"use client";

import { useActionState, useEffect, useRef } from "react";
import { LoaderCircle, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AdminActionState } from "@/lib/admin-action-state";
import { initialAdminActionState } from "@/lib/admin-action-state";

type CollaborationItemFormValues = {
  title: string;
  description: string;
  date: string;
  order: number;
};

type CollaborationItemAdminFormProps = {
  action: (
    state: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  defaultValues?: CollaborationItemFormValues;
  submitLabel: string;
  resetOnSuccess?: boolean;
};

const emptyValues: CollaborationItemFormValues = {
  title: "",
  description: "",
  date: "",
  order: 0,
};

export function CollaborationItemAdminForm({
  action,
  defaultValues = emptyValues,
  submitLabel,
  resetOnSuccess = false,
}: CollaborationItemAdminFormProps) {
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
    <form ref={formRef} action={formAction} className="space-y-5">
      <Field label="Başlık" htmlFor="collaboration-title">
        <Input
          id="collaboration-title"
          name="title"
          defaultValue={defaultValues.title}
          placeholder="Örn. Ortak Kariyer Günü Etkinliği"
          minLength={3}
          maxLength={140}
          required
        />
      </Field>

      <Field label="Açıklama" htmlFor="collaboration-description">
        <Textarea
          id="collaboration-description"
          name="description"
          defaultValue={defaultValues.description}
          placeholder="Birlikte yapılan çalışmayı anlatın"
          className="min-h-32"
          minLength={10}
          maxLength={2000}
          required
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Tarih"
          htmlFor="collaboration-date"
          hint="Kesin değilse boş bırakın."
        >
          <Input
            id="collaboration-date"
            name="date"
            type="date"
            defaultValue={defaultValues.date}
          />
        </Field>
        <Field
          label="Sıralama"
          htmlFor="collaboration-order"
          hint="Aynı grupta düşük değer önce"
        >
          <Input
            id="collaboration-order"
            name="order"
            type="number"
            defaultValue={defaultValues.order}
            min={0}
            max={9999}
            step={1}
            required
          />
        </Field>
      </div>

      {state.message ? (
        <p
          role={state.success ? "status" : "alert"}
          className={
            state.success
              ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
              : "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          }
        >
          {state.message}
        </p>
      ) : null}

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
        {isPending ? "Kaydediliyor..." : submitLabel}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-50"
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p className="text-xs leading-5 text-primary-500 dark:text-primary-200">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
