"use client";

import { useActionState, useEffect, useRef } from "react";
import { LoaderCircle, Save } from "lucide-react";

import type { AdminActionState } from "@/lib/admin-action-state";
import { initialAdminActionState } from "@/lib/admin-action-state";
import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type EventFormValues = {
  title: string;
  description: string;
  longDescription: string;
  date: string;
  location: string;
  imageUrl: string;
  category: string;
};

type EventAdminFormProps = {
  action: (
    state: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  defaultValues?: EventFormValues;
  submitLabel: string;
  resetOnSuccess?: boolean;
};

const emptyValues: EventFormValues = {
  title: "",
  description: "",
  longDescription: "",
  date: "",
  location: "",
  imageUrl: "",
  category: "",
};

export function EventAdminForm({
  action,
  defaultValues = emptyValues,
  submitLabel,
  resetOnSuccess = false,
}: EventAdminFormProps) {
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
      <div className="grid gap-5 lg:grid-cols-2">
        <FormField label="Başlık" htmlFor="event-title">
          <Input
            id="event-title"
            name="title"
            defaultValue={defaultValues.title}
            placeholder="Etkinlik başlığını yazın"
            minLength={3}
            maxLength={140}
            required
          />
        </FormField>
        <FormField label="Kategori" htmlFor="event-category">
          <Input
            id="event-category"
            name="category"
            defaultValue={defaultValues.category}
            placeholder="Örn. Kariyer, Girişimcilik"
            minLength={2}
            maxLength={80}
            required
          />
        </FormField>
      </div>

      <FormField
        label="Kısa açıklama"
        htmlFor="event-description"
        hint="Etkinlik kartında gösterilir."
      >
        <Textarea
          id="event-description"
          name="description"
          defaultValue={defaultValues.description}
          placeholder="Etkinliği 1–2 cümleyle özetleyin"
          className="min-h-24"
          minLength={10}
          maxLength={320}
          required
        />
      </FormField>

      <FormField
        label="Detaylı açıklama"
        htmlFor="event-long-description"
        hint="Etkinlik detay sayfasında gösterilir."
      >
        <Textarea
          id="event-long-description"
          name="longDescription"
          defaultValue={defaultValues.longDescription}
          placeholder="Programı ve katılımcıların neler kazanacağını anlatın"
          className="min-h-36"
          minLength={20}
          maxLength={5000}
          required
        />
      </FormField>

      <div className="grid gap-5 lg:grid-cols-2">
        <FormField
          label="Tarih ve saat"
          htmlFor="event-date"
          hint="Tarih kesinleşmediyse boş bırakabilirsiniz."
        >
          <Input
            id="event-date"
            name="date"
            type="datetime-local"
            defaultValue={defaultValues.date}
          />
        </FormField>
        <FormField label="Konum" htmlFor="event-location">
          <Input
            id="event-location"
            name="location"
            defaultValue={defaultValues.location}
            placeholder="Örn. Üniversite Konferans Salonu"
            minLength={2}
            maxLength={180}
            required
          />
        </FormField>
      </div>

      <ImageUploadField
        id="event-image"
        name="eventImage"
        label="Etkinlik görseli"
        defaultImageUrl={defaultValues.imageUrl || undefined}
      />

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
          <>
            <LoaderCircle className="animate-spin" aria-hidden="true" />
            Kaydediliyor...
          </>
        ) : (
          <>
            <Save aria-hidden="true" />
            {submitLabel}
          </>
        )}
      </Button>
    </form>
  );
}

function FormField({
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
        className="font-heading text-sm font-semibold text-primary-900"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-primary-400">{hint}</p> : null}
    </div>
  );
}
