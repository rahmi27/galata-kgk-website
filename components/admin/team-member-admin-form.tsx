"use client";

import { useActionState, useEffect, useRef } from "react";
import { LoaderCircle, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Input } from "@/components/ui/input";
import type { AdminActionState } from "@/lib/admin-action-state";
import { initialAdminActionState } from "@/lib/admin-action-state";

type TeamMemberFormValues = {
  name: string;
  role: string;
  department: string;
  photoUrl: string;
  order: number;
};

type TeamMemberAdminFormProps = {
  action: (
    state: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  defaultValues?: TeamMemberFormValues;
  submitLabel: string;
  resetOnSuccess?: boolean;
};

const emptyValues: TeamMemberFormValues = {
  name: "",
  role: "",
  department: "",
  photoUrl: "",
  order: 0,
};

export function TeamMemberAdminForm({
  action,
  defaultValues = emptyValues,
  submitLabel,
  resetOnSuccess = false,
}: TeamMemberAdminFormProps) {
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
        <FormField label="Departman" htmlFor="member-department">
          <Input
            id="member-department"
            name="department"
            defaultValue={defaultValues.department}
            placeholder="Örn. Yönetim Kurulu"
            minLength={2}
            maxLength={120}
            required
          />
        </FormField>
      </div>

      <ImageUploadField
        id="member-photo"
        name="memberPhoto"
        label="Üye fotoğrafı"
        defaultImageUrl={defaultValues.photoUrl || undefined}
      />

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
