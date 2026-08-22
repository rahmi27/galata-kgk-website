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
  imageAlt: string;
  category: string;
  titleEn?: string | null;
  descriptionEn?: string | null;
  longDescriptionEn?: string | null;
  locationEn?: string | null;
  imageAltEn?: string | null;
  categoryEn?: string | null;
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
  imageAlt: "",
  category: "",
  titleEn: "",
  descriptionEn: "",
  longDescriptionEn: "",
  locationEn: "",
  imageAltEn: "",
  categoryEn: "",
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
        removeName="removeEventImage"
      />

      <FormField
        label="Görsel alt metni"
        htmlFor="event-image-alt"
        hint="Ekran okuyucular için görseli kısa ve açıklayıcı biçimde anlatın."
      >
        <Input
          id="event-image-alt"
          name="imageAlt"
          defaultValue={defaultValues.imageAlt}
          placeholder="Örn. Kariyer Günü sahnesinde konuşmacı ve öğrenciler"
          maxLength={180}
        />
      </FormField>

      <fieldset className="space-y-5 rounded-2xl border border-primary-100 bg-primary-50/50 p-5 dark:border-white/10 dark:bg-primary-950/45">
        <legend className="px-2 font-heading text-base font-bold text-primary-950 dark:text-white">
          İngilizce (opsiyonel)
        </legend>
        <div className="grid gap-5 lg:grid-cols-2">
          <FormField label="Başlık (EN)" htmlFor="event-title-en">
            <Input id="event-title-en" name="titleEn" defaultValue={defaultValues.titleEn ?? ""} maxLength={140} />
          </FormField>
          <FormField label="Kategori (EN)" htmlFor="event-category-en">
            <Input id="event-category-en" name="categoryEn" defaultValue={defaultValues.categoryEn ?? ""} maxLength={80} />
          </FormField>
        </div>
        <FormField label="Kısa açıklama (EN)" htmlFor="event-description-en">
          <Textarea id="event-description-en" name="descriptionEn" defaultValue={defaultValues.descriptionEn ?? ""} maxLength={320} className="min-h-24" />
        </FormField>
        <FormField label="Detaylı açıklama (EN)" htmlFor="event-long-description-en">
          <Textarea id="event-long-description-en" name="longDescriptionEn" defaultValue={defaultValues.longDescriptionEn ?? ""} maxLength={5000} className="min-h-36" />
        </FormField>
        <div className="grid gap-5 lg:grid-cols-2">
          <FormField label="Konum (EN)" htmlFor="event-location-en">
            <Input id="event-location-en" name="locationEn" defaultValue={defaultValues.locationEn ?? ""} maxLength={180} />
          </FormField>
          <FormField label="Görsel alt metni (EN)" htmlFor="event-image-alt-en">
            <Input id="event-image-alt-en" name="imageAltEn" defaultValue={defaultValues.imageAltEn ?? ""} maxLength={180} />
          </FormField>
        </div>
      </fieldset>

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
