"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { OFFICIAL_PRIVACY_NOTICE_URL } from "@/lib/privacy";

type FormFeedback = {
  type: "success" | "error";
  message: string;
} | null;

class FormSubmissionError extends Error {}

const inputClassName =
  "h-12 rounded-xl border-primary/15 bg-background px-4 shadow-none focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-accent-300 dark:border-white/15";

export function MembershipForm() {
  const t = useTranslations("join");
  const common = useTranslations("common");
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
          website: formData.get("website"),
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          studentNumber: formData.get("studentNumber"),
          department: formData.get("department"),
          phone: formData.get("phone"),
          motivation: formData.get("motivation"),
          privacyAcknowledged:
            formData.get("privacyAcknowledged") === "on",
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
        code?: string;
      };

      if (!response.ok) {
        const errorMessages: Record<string, string> = {
          INVALID_SUBMISSION: t("invalidError"),
          EMAIL_RATE_LIMITED: t("emailRateLimitError"),
          IP_RATE_LIMITED: t("ipRateLimitError"),
          INTERNAL_ERROR: t("error"),
        };
        throw new FormSubmissionError(errorMessages[result.code ?? ""] ?? t("error"));
      }

      formElement.reset();
      setFeedback({
        type: "success",
        message: t("success"),
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof FormSubmissionError
            ? error.message
            : t("error"),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="absolute left-[-10000px] top-auto size-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="membership-website">{common("websiteHoneypot")}</label>
        <input
          id="membership-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent-700 dark:text-accent-300">
        {t("formEyebrow")}
      </p>
      <h2 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-[-0.04em] text-primary sm:text-4xl dark:text-white">
        {t("formTitle")}
      </h2>
      <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
        {t("formDescription")}
      </p>

      <div className="mt-9 grid gap-6 sm:grid-cols-2">
        <div className="grid gap-2.5">
          <label
            htmlFor="fullName"
            className="font-heading text-sm font-semibold text-primary dark:text-primary-100"
          >
            {t("fullName")}
          </label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder={t("fullNamePlaceholder")}
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
            {t("email")}
          </label>
          <Input
            id="membershipEmail"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
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
            {t("studentNumber")}
          </label>
          <Input
            id="studentNumber"
            name="studentNumber"
            type="text"
            autoComplete="off"
            placeholder={t("studentNumberPlaceholder")}
            maxLength={30}
            className={inputClassName}
          />
        </div>

        <div className="grid gap-2.5">
          <label
            htmlFor="department"
            className="font-heading text-sm font-semibold text-primary dark:text-primary-100"
          >
            {t("department")}
          </label>
          <Input
            id="department"
            name="department"
            type="text"
            placeholder={t("departmentPlaceholder")}
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
            {t("phone")}
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder={t("phonePlaceholder")}
            maxLength={30}
            className={inputClassName}
          />
        </div>

        <div className="grid gap-2.5 sm:col-span-2">
          <label
            htmlFor="motivation"
            className="font-heading text-sm font-semibold text-primary dark:text-primary-100"
          >
            {t("motivation")}
          </label>
          <Textarea
            id="motivation"
            name="motivation"
            placeholder={t("motivationPlaceholder")}
            required
            minLength={10}
            maxLength={1000}
            className="min-h-36 resize-y rounded-xl border-primary/15 bg-background px-4 py-3 shadow-none focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-accent-300 dark:border-white/15"
          />
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-primary/10 bg-primary-50/50 p-4 text-sm leading-6 text-muted-foreground dark:border-white/10 dark:bg-white/[0.035]">
        <input
          type="checkbox"
          name="privacyAcknowledged"
          required
          className="mt-1 size-4 shrink-0 accent-accent"
        />
        <span>
          {common("privacyPrefix")}
          <Link
            href={OFFICIAL_PRIVACY_NOTICE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent-700 underline underline-offset-4 dark:text-accent-300"
          >
            {common("privacyLink")}
          </Link>
          {common("privacySuffix")}
        </span>
      </label>

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
            {t("submitting")}
          </>
        ) : (
          <>
            {t("submit")}
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
