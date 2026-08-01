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
  shortDescription: string;
  logoUrl: string;
  logoAlt: string;
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
  shortDescription: "",
  logoUrl: "",
  logoAlt: "",
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
