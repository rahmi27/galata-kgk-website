import { SectionHeading } from "@/components/shared/section-heading";
import { TeamMemberCard } from "@/components/shared/team-member-card";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { createPageMetadata } from "@/lib/site-metadata";

export const revalidate = 300;

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "team" });
  const categories = await prisma.teamCategory.findMany({
    where: {
      memberships: {
        some: {},
      },
    },
    orderBy: [
      {
        order: "asc",
      },
      {
        name: "asc",
      },
    ],
    include: {
      memberships: {
        orderBy: [
          {
            order: "asc",
          },
          {
            person: {
              name: "asc",
            },
          },
        ],
        include: {
          person: true,
        },
      },
    },
  });

  return (
    <div className="bg-background">

      <main>
        <section className="relative overflow-hidden border-b border-primary/10 bg-primary-50/65 py-20 dark:border-white/10 dark:bg-primary-900/30 sm:py-28">
          <div
            className="absolute -left-28 -top-44 size-[28rem] rounded-full border-[64px] border-accent/10"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              as="h1"
              eyebrow={t("eyebrow")}
              title={t("title")}
              description={t("description")}
            />
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl space-y-20 px-5 sm:px-8 lg:px-10">
            {categories.length ? (
              categories.map((category, categoryIndex) => (
                <section
                  key={category.id}
                  aria-labelledby={`category-${category.slug}`}
                >
                  <div
                    className="flex items-center gap-5"
                    data-reveal={categoryIndex === 0 ? undefined : ""}
                  >
                    <span className="font-heading text-xs font-bold tracking-[0.16em] text-accent-700 dark:text-accent-300">
                      {String(categoryIndex + 1).padStart(2, "0")}
                    </span>
                    <h2
                      id={`category-${category.slug}`}
                      className="font-heading text-2xl font-bold tracking-[-0.035em] text-primary sm:text-3xl dark:text-white"
                    >
                      {category.name}
                    </h2>
                    <span
                      className="h-px flex-1 bg-primary/10 dark:bg-white/10"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="stagger-grid mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {category.memberships.map((membership) => (
                      <TeamMemberCard
                        key={membership.id}
                        name={membership.person.name}
                        role={membership.role}
                        department={membership.person.department}
                        imageSrc={membership.person.photoUrl ?? undefined}
                        imageAlt={membership.person.photoAlt ?? undefined}
                        socialPlatform={membership.person.socialPlatform ?? undefined}
                        socialUrl={membership.person.socialUrl ?? undefined}
                        reveal={categoryIndex !== 0}
                      />
                    ))}
                  </div>
                </section>
              ))
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-primary/20 bg-primary-50/50 px-6 py-16 text-center dark:border-white/15 dark:bg-primary-900/30">
                <h2 className="font-heading text-2xl font-bold text-primary dark:text-white">
                  {t("title")}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-primary-700 dark:text-primary-200">
                  {t("description")}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
