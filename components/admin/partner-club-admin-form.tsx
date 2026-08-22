"use client";

import { useActionState, useEffect, useRef } from "react";
import { LoaderCircle, Save } from "lucide-react";

import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AdminActionState } from "@/lib/admin-action-state";
import { initialAdminActionState } from "@/lib/admin-action-state";

type PartnerClubFormValues = {
  name: string;
  nameEn?: string | null;
  shortDescription: string;
  shortDescriptionEn?: string | null;
  logoUrl: string;
  logoAlt: string;
  logoAltEn?: string | null;
  order: number;
};

type PartnerClubAdminFormProps = {
  action: (
    state: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  defaultValues?: PartnerClubFormValues;
  submitLabel: string;
  resetOnSuccess?: boolean;
};

const emptyValues: PartnerClubFormValues = {
  name: "",
  nameEn: "",
  shortDescription: "",
  shortDescriptionEn: "",
  logoUrl: "",
  logoAlt: "",
  logoAltEn: "",
  order: 0,
};

export function PartnerClubAdminForm({
  action,
  defaultValues = emptyValues,
  submitLabel,
  resetOnSuccess = false,
}: PartnerClubAdminFormProps) {
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
      <FormField label="Partner kulüp adı" htmlFor="partner-name">
        <Input
          id="partner-name"
          name="name"
          defaultValue={defaultValues.name}
          placeholder="Kulüp veya topluluk adı"
          minLength={2}
          maxLength={120}
          required
        />
      </FormField>

      <FormField
        label="Kısa açıklama"
        htmlFor="partner-description"
        hint="Halka açık kart ve detay sayfasında gösterilir."
      >
        <Textarea
          id="partner-description"
          name="shortDescription"
          defaultValue={defaultValues.shortDescription}
          placeholder="Ortaklığın kapsamını kısaca anlatın"
          className="min-h-28"
          minLength={10}
          maxLength={500}
          required
        />
      </FormField>

      <ImageUploadField
        id="partner-logo"
        name="partnerLogo"
        label="Partner kulüp logosu"
        defaultImageUrl={defaultValues.logoUrl || undefined}
        required
      />

      <FormField
        label="Logo alt metni"
        htmlFor="partner-logo-alt"
        hint="Kulüp adını ve logoyu ekran okuyucular için tanımlayın."
      >
        <Input
          id="partner-logo-alt"
          name="logoAlt"
          defaultValue={defaultValues.logoAlt}
          placeholder="Örn. Kulüp adı logosu"
          minLength={3}
          maxLength={180}
          required
        />
      </FormField>

      <fieldset className="space-y-5 rounded-2xl border border-primary-100 bg-primary-50/50 p-5 dark:border-white/10 dark:bg-primary-950/45">
        <legend className="px-2 font-heading text-base font-bold text-primary-950 dark:text-white">İngilizce (opsiyonel)</legend>
        <FormField label="Partner kulüp adı (EN)" htmlFor="partner-name-en">
          <Input id="partner-name-en" name="nameEn" defaultValue={defaultValues.nameEn ?? ""} maxLength={120} />
        </FormField>
        <FormField label="Kısa açıklama (EN)" htmlFor="partner-description-en">
          <Textarea id="partner-description-en" name="shortDescriptionEn" defaultValue={defaultValues.shortDescriptionEn ?? ""} maxLength={500} className="min-h-28" />
        </FormField>
        <FormField label="Logo alt metni (EN)" htmlFor="partner-logo-alt-en">
          <Input id="partner-logo-alt-en" name="logoAltEn" defaultValue={defaultValues.logoAltEn ?? ""} maxLength={180} />
        </FormField>
      </fieldset>

      <div className="max-w-40">
        <FormField
          label="Sıralama"
          htmlFor="partner-order"
          hint="Düşük değer önce"
        >
          <Input
            id="partner-order"
            name="order"
            type="number"
            defaultValue={defaultValues.order}
            min={0}
            max={9999}
            step={1}
            required
          />
        </FormField>
      </div>

      <ActionMessage state={state} />

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

function ActionMessage({ state }: { state: AdminActionState }) {
  return state.message ? (
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
  ) : null;
}
