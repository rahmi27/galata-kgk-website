import { Flag, Target } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

import { SectionHeading } from "@/components/shared/section-heading";
import { Timeline } from "@/components/shared/timeline";
import aboutContent from "@/content/about.json";
import { createPageMetadata } from "@/lib/site-metadata";
import {
  getAboutContentFromRows,
  getPublicSiteContentRows,
} from "@/lib/site-content";

export const metadata = createPageMetadata({
  title: aboutContent.meta.title,
  description: aboutContent.meta.description,
  path: "/hakkimizda",
  keywords: ["Galata KGK vizyon", "Galata KGK misyon"],
});

export const revalidate = 300;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getAboutContentFromRows(await getPublicSiteContentRows());

  return (
    <div className="bg-background">

      <main>
        <section className="relative overflow-hidden border-b border-primary/10 bg-primary-50/65 py-20 dark:border-white/10 dark:bg-primary-900/30 sm:py-28">
          <div
            className="absolute -right-24 -top-36 size-96 rounded-full border-[58px] border-accent/10"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              as="h1"
              eyebrow={content.hero.eyebrow}
              title={content.hero.title}
              description={content.hero.description}
            />
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-10">
            <div>
              <SectionHeading
                eyebrow={content.introduction.eyebrow}
                title={content.introduction.title}
              />
              <div className="mt-8 space-y-5 text-base leading-8 text-muted-foreground sm:text-lg">
                {content.introduction.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <aside className="relative self-start overflow-hidden rounded-[2rem] bg-primary-900 p-8 text-white shadow-[0_28px_80px_-42px_rgba(27,42,94,0.85)] sm:p-10">
              <span
                className="absolute -right-12 -top-12 size-36 rounded-full border-[22px] border-accent/20"
                aria-hidden="true"
              />
              <p className="relative font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent-300">
                {content.introduction.principle.label}
              </p>
              <p className="relative mt-8 font-heading text-2xl font-semibold leading-relaxed tracking-[-0.025em] sm:text-3xl">
                “{content.introduction.principle.text}”
              </p>
            </aside>
          </div>
        </section>

        <section className="border-y border-primary/10 bg-primary-50/45 py-20 dark:border-white/10 dark:bg-white/[0.025] sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-2 lg:px-10">
            <article className="relative overflow-hidden rounded-[2rem] bg-primary-900 p-8 text-white sm:p-10">
              <Flag
                className="size-8 text-accent-300"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="mt-12 font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent-300">
                {content.visionMission.vision.eyebrow}
              </p>
              <h2 className="mt-5 font-heading text-3xl font-bold leading-tight tracking-[-0.04em]">
                {content.visionMission.vision.title}
              </h2>
              <p className="mt-5 leading-7 text-primary-200">
                {content.visionMission.vision.description}
              </p>
            </article>

            <article className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-card p-8 shadow-[0_28px_80px_-50px_rgba(27,42,94,0.65)] sm:p-10 dark:border-white/10 dark:bg-white/[0.035]">
              <Target
                className="size-8 text-accent-700 dark:text-accent-300"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="mt-12 font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent-700 dark:text-accent-300">
                {content.visionMission.mission.eyebrow}
              </p>
              <h2 className="mt-5 font-heading text-3xl font-bold leading-tight tracking-[-0.04em] text-primary dark:text-white">
                {content.visionMission.mission.title}
              </h2>
              <p className="mt-5 leading-7 text-muted-foreground">
                {content.visionMission.mission.description}
              </p>
            </article>
          </div>
        </section>

        <section className="border-t border-primary/10 py-20 dark:border-white/10 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-10">
            <SectionHeading
              eyebrow={content.timelineSection.eyebrow}
              title={content.timelineSection.title}
              description={content.timelineSection.description}
              className="self-start lg:sticky lg:top-32"
            />
            <Timeline milestones={content.timelineSection.milestones} />
          </div>
        </section>
      </main>
    </div>
  );
}
