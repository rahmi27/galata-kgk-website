"use client";

import { useActionState } from "react";
import { LoaderCircle, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AdminActionState } from "@/lib/admin-action-state";
import { initialAdminActionState } from "@/lib/admin-action-state";

export type ContentEditorField = {
  name: string;
  label: string;
  value: string;
  kind?: "input" | "textarea" | "url";
  required?: boolean;
  maxLength?: number;
  hint?: string;
};

export type ContentEditorSection = {
  title: string;
  description?: string;
  fields: ContentEditorField[];
};

export function ContentEditorForm({
  action,
  sections,
  submitLabel = "İçeriği kaydet",
  children,
}: {
  action: (
    state: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  sections: ContentEditorSection[];
  submitLabel?: string;
  children?: React.ReactNode;
}) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialAdminActionState,
  );

  return (
    <form action={formAction} className="mt-9 space-y-7">
      {sections.map((section) => (
        <section
          key={section.title}
          className="rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-primary-950/65 sm:p-7"
        >
          <h2 className="font-heading text-xl font-bold text-primary-950 dark:text-white">
            {section.title}
          </h2>
          {section.description ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-primary-600 dark:text-primary-200">
              {section.description}
            </p>
          ) : null}
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {section.fields.map((field) => {
              const id = `content-${field.name.replaceAll(".", "-")}`;
              const isTextarea = field.kind === "textarea";

              return (
                <div
                  key={field.name}
                  className={isTextarea ? "space-y-2 lg:col-span-2" : "space-y-2"}
                >
                  <label
                    htmlFor={id}
                    className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-100"
                  >
                    {field.label}
                  </label>
                  {isTextarea ? (
                    <Textarea
                      id={id}
                      name={field.name}
                      defaultValue={field.value}
                      rows={5}
                      maxLength={field.maxLength ?? 3000}
                      required={field.required}
                    />
                  ) : (
                    <Input
                      id={id}
                      name={field.name}
                      type={field.kind === "url" ? "url" : "text"}
                      defaultValue={field.value}
                      maxLength={field.maxLength ?? 300}
                      required={field.required}
                    />
                  )}
                  {field.hint ? (
                    <p className="text-xs leading-5 text-primary-600 dark:text-primary-300">
                      {field.hint}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {children}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          ) : (
            <Save aria-hidden="true" />
          )}
          {submitLabel}
        </Button>
        {state.message ? (
          <p
            role={state.success ? "status" : "alert"}
            className={
              state.success
                ? "text-sm font-semibold text-emerald-700 dark:text-emerald-300"
                : "text-sm font-semibold text-red-700 dark:text-red-300"
            }
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
