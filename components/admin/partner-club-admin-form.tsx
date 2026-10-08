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
  kind: "CLUB" | "PERSON" | "ORGANIZATION";
  name: string;
  nameEn?: string | null;
  shortDescription: string;
  shortDescriptionEn?: string | null;
  subtitle?: string | null;
  subtitleEn?: string | null;
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
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
  kind: "CLUB",
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
      <FormField label="Ortak türü" htmlFor="partner-kind" hint="Kulüp, kişi veya kurum seçin. Halka açık kartta doğru tür gösterilir.">
        <select id="partner-kind" name="kind" defaultValue={defaultValues.kind} className="flex h-11 w-full rounded-xl border border-primary-200 bg-white px-3 text-sm text-primary-950 dark:border-white/15 dark:bg-primary-900 dark:text-white" required>
          <option value="CLUB">Öğrenci kulübü / topluluk</option>
          <option value="PERSON">Kişi</option>
          <option value="ORGANIZATION">Kurum / marka</option>
        </select>
      </FormField>

      <FormField label="Ortak adı" htmlFor="partner-name">
        <Input
          id="partner-name"
          name="name"
          defaultValue={defaultValues.name}
          placeholder="Kişi, kulüp veya kurum adı"
          minLength={2}
          maxLength={120}
          required
        />
      </FormField>

      <FormField label="Unvan / alt başlık (opsiyonel)" htmlFor="partner-subtitle" hint="Örn. Halkla İlişkiler ve Reklamcılık öğrencisi. Kişi profillerinde adın altında görünür.">
        <Input id="partner-subtitle" name="subtitle" defaultValue={defaultValues.subtitle ?? ""} maxLength={160} />
      </FormField>

      <FormField
        label="Kısa açıklama"
        htmlFor="partner-description"
        hint="Kısa, doğal bir tanıtım yazın. Bağlantıları aşağıdaki ayrı alanlara girin."
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

      <fieldset className="space-y-4 rounded-2xl border border-primary-100 bg-primary-50/50 p-5 dark:border-white/10 dark:bg-primary-950/45">
        <legend className="px-2 font-heading text-base font-bold text-primary-950 dark:text-white">Bağlantılar (opsiyonel)</legend>
        <FormField label="Web sitesi" htmlFor="partner-website">
          <Input id="partner-website" name="websiteUrl" type="url" defaultValue={defaultValues.websiteUrl ?? ""} placeholder="https://ornek.com" maxLength={2048} />
        </FormField>
        <FormField label="LinkedIn" htmlFor="partner-linkedin">
          <Input id="partner-linkedin" name="linkedinUrl" type="url" defaultValue={defaultValues.linkedinUrl ?? ""} placeholder="https://www.linkedin.com/in/..." maxLength={2048} />
        </FormField>
        <FormField label="Instagram" htmlFor="partner-instagram">
          <Input id="partner-instagram" name="instagramUrl" type="url" defaultValue={defaultValues.instagramUrl ?? ""} placeholder="https://www.instagram.com/..." maxLength={2048} />
        </FormField>
      </fieldset>

      <ImageUploadField
        id="partner-logo"
        name="partnerLogo"
        label="Ortak görseli (fotoğraf / logo)"
        defaultImageUrl={defaultValues.logoUrl || undefined}
        required
      />

      <FormField
        label="Görsel alt metni"
        htmlFor="partner-logo-alt"
        hint="Görselin kendisini ekran okuyucu kullananlar için açıklayın."
      >
        <Input
          id="partner-logo-alt"
          name="logoAlt"
          defaultValue={defaultValues.logoAlt}
          placeholder="Örn. Gönül Özkaplan portresi veya kurum logosu"
          minLength={3}
          maxLength={180}
          required
        />
      </FormField>

      <fieldset className="space-y-5 rounded-2xl border border-primary-100 bg-primary-50/50 p-5 dark:border-white/10 dark:bg-primary-950/45">
        <legend className="px-2 font-heading text-base font-bold text-primary-950 dark:text-white">İngilizce (opsiyonel)</legend>
        <FormField label="Ortak adı (EN)" htmlFor="partner-name-en">
          <Input id="partner-name-en" name="nameEn" defaultValue={defaultValues.nameEn ?? ""} maxLength={120} />
        </FormField>
        <FormField label="Unvan / alt başlık (EN)" htmlFor="partner-subtitle-en">
          <Input id="partner-subtitle-en" name="subtitleEn" defaultValue={defaultValues.subtitleEn ?? ""} maxLength={160} />
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
