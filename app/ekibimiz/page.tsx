import type { Metadata } from "next";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SectionHeading } from "@/components/shared/section-heading";
import { TeamMemberCard } from "@/components/shared/team-member-card";
import teamContent from "@/content/team.json";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: teamContent.meta.title,
  description: teamContent.meta.description,
};

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: {
      order: "asc",
    },
  });

  const departments = new Map<string, typeof teamMembers>();

  for (const member of teamMembers) {
    const departmentMembers = departments.get(member.department) ?? [];
    departmentMembers.push(member);
    departments.set(member.department, departmentMembers);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-primary/10 bg-primary-50/65 py-20 dark:border-white/10 dark:bg-primary-900/30 sm:py-28">
          <div
            className="absolute -left-28 -top-44 size-[28rem] rounded-full border-[64px] border-accent/10"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              eyebrow={teamContent.section.eyebrow}
              title={teamContent.section.title}
              description={teamContent.section.description}
            />
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl space-y-20 px-5 sm:px-8 lg:px-10">
            {[...departments.entries()].map(
              ([department, members], departmentIndex) => (
                <section key={department} aria-labelledby={`department-${departmentIndex}`}>
                  <div className="flex items-center gap-5">
                    <span className="font-heading text-xs font-bold tracking-[0.16em] text-accent-700 dark:text-accent-300">
                      {String(departmentIndex + 1).padStart(2, "0")}
                    </span>
                    <h2
                      id={`department-${departmentIndex}`}
                      className="font-heading text-2xl font-bold tracking-[-0.035em] text-primary sm:text-3xl dark:text-white"
                    >
                      {department}
                    </h2>
                    <span
                      className="h-px flex-1 bg-primary/10 dark:bg-white/10"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {members.map((member) => (
                      <TeamMemberCard
                        key={member.id}
                        name={member.name}
                        role={member.role}
                        imageSrc={member.photoUrl ?? undefined}
                      />
                    ))}
                  </div>
                </section>
              ),
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
