"use client";

import { type FormEvent, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import membershipContent from "@/content/membership.json";
import { cn } from "@/lib/utils";

type FormFeedback = {
  type: "success" | "error";
  message: string;
} | null;

const inputClassName =
  "h-12 rounded-xl border-primary/15 bg-background px-4 shadow-none focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-accent-300 dark:border-white/15";

export function MembershipForm() {
  const { form } = membershipContent;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FormFeedback>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/katilim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          studentNumber: formData.get("studentNumber"),
          department: formData.get("department"),
          phone: formData.get("phone"),
          motivation: formData.get("motivation"),
        }),
      });
      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error ?? form.errorMessage);
      }

      formElement.reset();
      setFeedback({
        type: "success",
        message: result.message ?? form.successMessage,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : form.errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent-700 dark:text-accent-300">
        {form.eyebrow}
      </p>
      <h2 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-[-0.04em] text-primary sm:text-4xl dark:text-white">
        {form.title}
      </h2>
      <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
        {form.description}
      </p>

      <div className="mt-9 grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2.5">
          <label
            htmlFor="fullName"
            className="font-heading text-sm font-semibold text-primary dark:text-primary-100"
          >
            {form.fields.fullName.label}
          </label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder={form.fields.fullName.placeholder}
            required
            minLength={2}
            maxLength={100}
            className={inputClassName}
          />
        </div>

        <div className="grid gap-2.5">
          <label
            htmlFor="membershipEmail"
            className="font-heading text-sm font-semibold text-primary dark:text-primary-100"
          >
            {form.fields.email.label}
          </label>
          <Input
            id="membershipEmail"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={form.fields.email.placeholder}
            required
            maxLength={254}
            className={inputClassName}
          />
        </div>

        <div className="grid gap-2.5">
          <label
            htmlFor="studentNumber"
            className="font-heading text-sm font-semibold text-primary dark:text-primary-100"
          >
            {form.fields.studentNumber.label}
          </label>
          <Input
            id="studentNumber"
            name="studentNumber"
            type="text"
            autoComplete="off"
            placeholder={form.fields.studentNumber.placeholder}
            maxLength={30}
            className={inputClassName}
          />
        </div>

        <div className="grid gap-2.5">
          <label
            htmlFor="department"
            className="font-heading text-sm font-semibold text-primary dark:text-primary-100"
          >
            {form.fields.department.label}
          </label>
          <Input
            id="department"
            name="department"
            type="text"
            placeholder={form.fields.department.placeholder}
            required
            minLength={2}
            maxLength={150}
            className={inputClassName}
          />
        </div>

        <div className="grid gap-2.5 sm:col-span-2">
          <label
            htmlFor="phone"
            className="font-heading text-sm font-semibold text-primary dark:text-primary-100"
          >
            {form.fields.phone.label}
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder={form.fields.phone.placeholder}
            maxLength={30}
            className={inputClassName}
          />
        </div>

        <div className="grid gap-2.5 sm:col-span-2">
          <label
            htmlFor="motivation"
            className="font-heading text-sm font-semibold text-primary dark:text-primary-100"
          >
            {form.fields.motivation.label}
          </label>
          <Textarea
            id="motivation"
            name="motivation"
            placeholder={form.fields.motivation.placeholder}
            required
            minLength={10}
            maxLength={1000}
            className="min-h-36 resize-y rounded-xl border-primary/15 bg-background px-4 py-3 shadow-none focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-accent-300 dark:border-white/15"
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        variant="secondary"
        className="mt-7"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="animate-spin" aria-hidden="true" />
            {form.submittingLabel}
          </>
        ) : (
          <>
            {form.submitLabel}
            <ArrowRight aria-hidden="true" />
          </>
        )}
      </Button>

      {feedback ? (
        <p
          className={cn(
            "mt-5 rounded-xl border px-4 py-3 text-sm leading-6",
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200",
          )}
          role={feedback.type === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {feedback.message}
        </p>
      ) : null}
    </form>
  );
}
