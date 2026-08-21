"use client";

import { useActionState, useEffect, useRef } from "react";
import { LoaderCircle, Save } from "lucide-react";

import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminActionState } from "@/lib/admin-action-state";
import { initialAdminActionState } from "@/lib/admin-action-state";
import { teamSocialPlatformOptions } from "@/lib/social-platforms";

export type PersonFormValues = {
  name: string;
  nameEn: string;
  department: string;
  departmentEn: string;
  photoUrl: string;
  photoAlt: string;
  photoAltEn: string;
  socialPlatform: string;
  socialUrl: string;
};

const emptyValues: PersonFormValues = {
  name: "",
  nameEn: "",
  department: "",
  departmentEn: "",
  photoUrl: "",
  photoAlt: "",
  photoAltEn: "",
  socialPlatform: "",
  socialUrl: "",
};

export function PersonAdminForm({
  action,
  defaultValues = emptyValues,
  submitLabel,
  resetOnSuccess = false,
}: {
  action: (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;
  defaultValues?: PersonFormValues;
  submitLabel: string;
  resetOnSuccess?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(action, initialAdminActionState);

  useEffect(() => {
    if (state.success && resetOnSuccess) formRef.current?.reset();
  }, [resetOnSuccess, state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <FormField label="Ad Soyad" htmlFor="person-name">
        <Input id="person-name" name="name" defaultValue={defaultValues.name} minLength={2} maxLength={100} required />
      </FormField>
      <FormField label="Ad Soyad — İngilizce (opsiyonel)" htmlFor="person-name-en">
        <Input id="person-name-en" name="nameEn" defaultValue={defaultValues.nameEn} minLength={2} maxLength={100} />
      </FormField>
      <FormField label="Bölüm" htmlFor="person-department" hint="Örn. İç Mimarlık, İşletme">
        <Input id="person-department" name="department" defaultValue={defaultValues.department} minLength={2} maxLength={120} required />
      </FormField>
      <FormField label="Bölüm — İngilizce (opsiyonel)" htmlFor="person-department-en">
        <Input id="person-department-en" name="departmentEn" defaultValue={defaultValues.departmentEn} minLength={2} maxLength={120} />
      </FormField>
      <ImageUploadField
        id="person-photo"
        name="memberPhoto"
        label="Üye fotoğrafı"
        defaultImageUrl={defaultValues.photoUrl || undefined}
        removeName="removeMemberPhoto"
      />
      <FormField label="Fotoğraf alt metni" htmlFor="person-photo-alt" hint="Fotoğraf varsa erişilebilir, kısa bir açıklama yazın.">
        <Input id="person-photo-alt" name="photoAlt" defaultValue={defaultValues.photoAlt} maxLength={180} placeholder="Örn. Üye portresi" />
      </FormField>
      <FormField label="Fotoğraf alt metni — İngilizce (opsiyonel)" htmlFor="person-photo-alt-en">
        <Input id="person-photo-alt-en" name="photoAltEn" defaultValue={defaultValues.photoAltEn} maxLength={180} placeholder="E.g. Team member portrait" />
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Profil türü" htmlFor="person-social-platform" hint="İsteğe bağlı">
          <select id="person-social-platform" name="socialPlatform" defaultValue={defaultValues.socialPlatform} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <option value="">Bağlantı ekleme</option>
            {teamSocialPlatformOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </FormField>
        <FormField label="Profil bağlantısı" htmlFor="person-social-url" hint="Tam http(s) adresi">
          <Input id="person-social-url" name="socialUrl" type="url" defaultValue={defaultValues.socialUrl} maxLength={500} placeholder="https://www.linkedin.com/in/..." />
        </FormField>
      </div>
      <ActionMessage state={state} />
      <Button type="submit" variant="primary" className="rounded-xl" disabled={isPending}>
        {isPending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Save aria-hidden="true" />}
        {isPending ? "Kaydediliyor..." : submitLabel}
      </Button>
    </form>
  );
}

export function FormField({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-50">{label}</label>
      {children}
      {hint ? <p className="text-xs leading-5 text-primary-500 dark:text-primary-200">{hint}</p> : null}
    </div>
  );
}

export function ActionMessage({ state }: { state: AdminActionState }) {
  if (!state.message) return null;
  return (
    <p role={state.success ? "status" : "alert"} className={state.success ? "rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" : "rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"}>
      {state.message}
    </p>
  );
}
