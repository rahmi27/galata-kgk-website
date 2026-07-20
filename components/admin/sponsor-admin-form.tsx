"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LoaderCircle, Save } from "lucide-react";

import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AdminActionState } from "@/lib/admin-action-state";
import { initialAdminActionState } from "@/lib/admin-action-state";

type SponsorFormValues = {
  name: string;
  websiteUrl: string;
  description: string;
  tierId: number | "new" | "";
  logoUrl: string;
  order: number;
};

type SponsorAdminFormProps = {
  action: (
    state: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  tiers: Array<{ id: number; name: string }>;
  defaultValues?: SponsorFormValues;
  submitLabel: string;
  resetOnSuccess?: boolean;
};

const emptyValues: SponsorFormValues = {
  name: "",
  websiteUrl: "",
  description: "",
  tierId: "",
  logoUrl: "",
  order: 0,
};

export function SponsorAdminForm({
  action,
  tiers,
  defaultValues = emptyValues,
  submitLabel,
  resetOnSuccess = false,
}: SponsorAdminFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [tierSelection, setTierSelection] = useState(
    String(defaultValues.tierId),
  );
  const [state, formAction, isPending] = useActionState(
    action,
    initialAdminActionState,
  );

  useEffect(() => {
    if (state.success && resetOnSuccess) {
      formRef.current?.reset();
    }
  }, [resetOnSuccess, state.success]);

  useEffect(() => {
    const form = formRef.current;
    const handleReset = () => setTierSelection(String(defaultValues.tierId));

    form?.addEventListener("reset", handleReset);
    return () => form?.removeEventListener("reset", handleReset);
  }, [defaultValues.tierId]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <FormField label="Sponsor Adı" htmlFor="sponsor-name">
        <Input
          id="sponsor-name"
          name="name"
          defaultValue={defaultValues.name}
          placeholder="Kurum veya marka adı"
          minLength={2}
          maxLength={120}
          required
        />
      </FormField>

      <div className="grid gap-5 lg:grid-cols-2">
        <FormField label="Web Sitesi" htmlFor="sponsor-website" hint="Opsiyonel">
          <Input
            id="sponsor-website"
            name="websiteUrl"
            type="url"
            defaultValue={defaultValues.websiteUrl}
            placeholder="https://ornek.com"
            maxLength={500}
          />
        </FormField>
        <FormField label="Sponsor Tier'ı" htmlFor="sponsor-tier">
          <select
            id="sponsor-tier"
            name="tierId"
            value={tierSelection}
            onChange={(event) => setTierSelection(event.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none transition-colors focus-visible:ring-1 focus-visible:ring-ring"
            required
          >
            <option value="" disabled>
              Tier seçin
            </option>
            {tiers.map((tier) => (
              <option key={tier.id} value={tier.id}>
                {tier.name}
              </option>
            ))}
            <option value="new">+ Yeni tier ekle</option>
          </select>
        </FormField>
      </div>

      {tierSelection === "new" ? (
        <FormField label="Yeni Tier Adı" htmlFor="sponsor-new-tier">
          <Input
            id="sponsor-new-tier"
            name="newTierName"
            placeholder="Örn. Ana Sponsor"
            minLength={2}
            maxLength={80}
            required
          />
          <p className="text-xs leading-5 text-primary-500 dark:text-primary-200">
            Aynı ad farklı büyük/küçük harfle mevcutsa var olan tier kullanılır.
          </p>
        </FormField>
      ) : null}

      <Link
        href="/admin/sponsorlar/kategoriler"
        className="inline-flex text-xs font-semibold text-primary-700 underline-offset-4 hover:text-accent-700 hover:underline dark:text-primary-100"
      >
        Tier’ları ayrı ekranda yönet
      </Link>

      <FormField
        label="Kısa Açıklama"
        htmlFor="sponsor-description"
        hint="Opsiyonel; halka açık kartta gösterilir."
      >
        <Textarea
          id="sponsor-description"
          name="description"
          defaultValue={defaultValues.description}
          placeholder="İş birliğinin odağını kısaca anlatın"
          className="min-h-24"
          maxLength={320}
        />
      </FormField>

      <ImageUploadField
        id="sponsor-logo"
        name="sponsorLogo"
        label="Sponsor Logosu"
        defaultImageUrl={defaultValues.logoUrl || undefined}
        required={!defaultValues.logoUrl}
      />

      <div className="max-w-40">
        <FormField
          label="Sıralama"
          htmlFor="sponsor-order"
          hint="Düşük değer önce"
        >
          <Input
            id="sponsor-order"
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
        className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-50"
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p className="text-xs text-primary-500 dark:text-primary-200">{hint}</p>
      ) : null}
    </div>
  );
}
