import { CheckCircle2 } from "lucide-react";

import { MembershipForm } from "@/components/membership/membership-form";
import { SectionHeading } from "@/components/shared/section-heading";
import membershipContent from "@/content/membership.json";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: membershipContent.meta.title,
  description: membershipContent.meta.description,
  path: "/katilim",
  keywords: ["Galata KGK üyelik", "öğrenci kulübüne katıl"],
});

export default function MembershipPage() {
  const { hero, process } = membershipContent;

  return (
    <div className="bg-background">

      <main>
        <section className="relative overflow-hidden border-b border-primary/10 bg-primary-50/65 py-20 dark:border-white/10 dark:bg-primary-900/30 sm:py-28">
          <div
            className="absolute -right-20 -top-28 size-80 rounded-full border-[48px] border-accent/10"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              as="h1"
              eyebrow={hero.eyebrow}
              title={hero.title}
              description={hero.description}
            />
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-primary/10 bg-card shadow-[0_32px_90px_-50px_rgba(27,42,94,0.75)] lg:grid-cols-[0.78fr_1.22fr] dark:border-white/10 dark:bg-white/[0.035]">
            <aside className="relative overflow-hidden bg-primary-900 p-8 text-white sm:p-10 lg:p-12">
              <span
                className="absolute -bottom-20 -right-20 size-56 rounded-full border-[34px] border-accent/20"
                aria-hidden="true"
              />
              <div className="relative">
                <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent-300">
                  {process.eyebrow}
                </p>
                <h2 className="mt-5 font-heading text-3xl font-bold leading-tight tracking-[-0.04em]">
                  {process.title}
                </h2>
                <p className="mt-4 leading-7 text-primary-200">
                  {process.description}
                </p>

                <ol className="mt-10 space-y-7">
                  {process.steps.map((step, index) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 font-heading text-xs font-bold text-accent-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-heading text-base font-semibold">
                          {step.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-6 text-primary-200">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-7 text-sm text-primary-200">
                  <CheckCircle2
                    className="size-5 shrink-0 text-accent-300"
                    aria-hidden="true"
                  />
                  <span>{hero.eyebrow}</span>
                </div>
              </div>
            </aside>

            <div className="p-8 sm:p-10 lg:p-12">
              <MembershipForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
