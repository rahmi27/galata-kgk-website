"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LoaderCircle, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Input } from "@/components/ui/input";
import type { AdminActionState } from "@/lib/admin-action-state";
import { initialAdminActionState } from "@/lib/admin-action-state";

type TeamMemberFormValues = {
  name: string;
  role: string;
  categoryId: number | "new" | "";
  photoUrl: string;
  photoAlt: string;
  order: number;
};

type TeamMemberAdminFormProps = {
  action: (
    state: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  defaultValues?: TeamMemberFormValues;
  categories: Array<{
    id: number;
    name: string;
  }>;
  submitLabel: string;
  resetOnSuccess?: boolean;
};

const emptyValues: TeamMemberFormValues = {
  name: "",
  role: "",
  categoryId: "",
  photoUrl: "",
  photoAlt: "",
  order: 0,
};

export function TeamMemberAdminForm({
  action,
  defaultValues = emptyValues,
  categories,
  submitLabel,
  resetOnSuccess = false,
}: TeamMemberAdminFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [categorySelection, setCategorySelection] = useState(
    String(defaultValues.categoryId),
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
    const handleReset = () =>
      setCategorySelection(String(defaultValues.categoryId));

    form?.addEventListener("reset", handleReset);
    return () => form?.removeEventListener("reset", handleReset);
  }, [defaultValues.categoryId]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <FormField label="Ad Soyad" htmlFor="member-name">
        <Input
          id="member-name"
          name="name"
          defaultValue={defaultValues.name}
          placeholder="Ekip üyesinin adı"
          minLength={2}
          maxLength={100}
          required
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Görev" htmlFor="member-role">
          <Input
            id="member-role"
            name="role"
            defaultValue={defaultValues.role}
            placeholder="Örn. Kulüp Başkanı"
            minLength={2}
            maxLength={100}
            required
          />
        </FormField>
        <FormField label="Ekip Kategorisi" htmlFor="member-category">
          <select
            id="member-category"
            name="categoryId"
            value={categorySelection}
            onChange={(event) => setCategorySelection(event.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm outline-none transition-colors focus-visible:ring-1 focus-visible:ring-ring"
            required
          >
            <option value="" disabled>
              Kategori seçin
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
            <option value="new">+ Yeni kategori ekle</option>
          </select>
        </FormField>
      </div>

      {categorySelection === "new" ? (
        <FormField label="Yeni Kategori Adı" htmlFor="member-new-category">
          <Input
            id="member-new-category"
            name="newCategoryName"
            placeholder="Örn. Sponsorluk Ekibi"
            minLength={2}
            maxLength={80}
            required
          />
          <p className="text-xs leading-5 text-primary-500 dark:text-primary-200">
            Aynı ad farklı büyük/küçük harfle mevcutsa var olan kategori
            kullanılır.
          </p>
        </FormField>
      ) : null}

      <Link
        href="/admin/ekip/kategoriler"
        className="inline-flex text-xs font-semibold text-primary-700 underline-offset-4 hover:text-accent-700 hover:underline dark:text-primary-100"
      >
        Kategorileri ayrı ekranda yönet
      </Link>

      <ImageUploadField
        id="member-photo"
        name="memberPhoto"
        label="Üye fotoğrafı"
        defaultImageUrl={defaultValues.photoUrl || undefined}
      />

      <FormField
        label="Fotoğraf alt metni"
        htmlFor="member-photo-alt"
        hint="Fotoğraf varsa ekran okuyucular için kısa bir açıklama yazın."
      >
        <Input
          id="member-photo-alt"
          name="photoAlt"
          defaultValue={defaultValues.photoAlt}
          placeholder={`Örn. ${defaultValues.name || "Ekip üyesi"} portresi`}
          maxLength={180}
        />
      </FormField>

      <div className="max-w-40">
        <FormField
          label="Sıralama"
          htmlFor="member-order"
          hint="Düşük değer önce"
        >
          <Input
            id="member-order"
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
        className="font-heading text-sm font-semibold text-primary-900"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-primary-400">{hint}</p> : null}
    </div>
  );
}
