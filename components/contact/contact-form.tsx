"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import contactContent from "@/content/contact.json";

export function ContactForm() {
  const { form } = contactContent;

  return (
    <form
      id="iletisim-formu"
      className="scroll-mt-28"
      onSubmit={(event) => event.preventDefault()}
    >
      <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent-700 dark:text-accent-300">
        {form.eyebrow}
      </p>
      <h2 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-[-0.04em] text-primary sm:text-4xl dark:text-white">
        {form.title}
      </h2>
      <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
        {form.description}
      </p>

      <div className="mt-9 grid gap-6">
        <div className="grid gap-2.5">
          <label
            htmlFor="name"
            className="font-heading text-sm font-semibold text-primary dark:text-primary-100"
          >
            {form.fields.name.label}
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={form.fields.name.placeholder}
            className="h-12 rounded-xl border-primary/15 bg-background px-4 shadow-none focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-accent-300 dark:border-white/15"
          />
        </div>

        <div className="grid gap-2.5">
          <label
            htmlFor="email"
            className="font-heading text-sm font-semibold text-primary dark:text-primary-100"
          >
            {form.fields.email.label}
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={form.fields.email.placeholder}
            className="h-12 rounded-xl border-primary/15 bg-background px-4 shadow-none focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-accent-300 dark:border-white/15"
          />
        </div>

        <div className="grid gap-2.5">
          <label
            htmlFor="message"
            className="font-heading text-sm font-semibold text-primary dark:text-primary-100"
          >
            {form.fields.message.label}
          </label>
          <Textarea
            id="message"
            name="message"
            placeholder={form.fields.message.placeholder}
            className="min-h-36 resize-y rounded-xl border-primary/15 bg-background px-4 py-3 shadow-none focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-accent-300 dark:border-white/15"
          />
        </div>
      </div>

      <Button type="submit" size="lg" variant="secondary" className="mt-7">
        {form.submitLabel}
        <ArrowRight aria-hidden="true" />
      </Button>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        {form.notice}
      </p>
    </form>
  );
}
