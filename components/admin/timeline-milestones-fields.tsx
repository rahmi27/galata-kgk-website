"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Milestone = {
  year: string;
  title: string;
  description: string;
};

type EnglishMilestone = Milestone;

type MilestoneField = Milestone & {
  id: string;
  english: EnglishMilestone;
};

export function TimelineMilestonesFields({
  initialMilestones,
  initialMilestonesEn = [],
}: {
  initialMilestones: Milestone[];
  initialMilestonesEn?: EnglishMilestone[];
}) {
  const [milestones, setMilestones] = useState<MilestoneField[]>(
    initialMilestones.map((milestone, index) => ({
      ...milestone,
      id: `initial-${index}`,
      english: initialMilestonesEn[index] ?? { year: "", title: "", description: "" },
    })),
  );

  function updateMilestone(
    id: string,
    field: keyof Milestone,
    value: string,
  ) {
    setMilestones((current) =>
      current.map((milestone) =>
        milestone.id === id ? { ...milestone, [field]: value } : milestone,
      ),
    );
  }

  function updateEnglishMilestone(id: string, field: keyof EnglishMilestone, value: string) {
    setMilestones((current) => current.map((milestone) => milestone.id === id
      ? { ...milestone, english: { ...milestone.english, [field]: value } }
      : milestone));
  }

  return (
    <section className="rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-primary-950/65 sm:p-7">
      <input
        type="hidden"
        name="timelineMilestones"
        value={JSON.stringify(
          milestones.map(({ year, title, description }) => ({
            year,
            title,
            description,
          })),
        )}
      />
      <input type="hidden" name="timelineMilestonesEn" value={JSON.stringify(milestones.map(({ english }) => english))} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-primary-950 dark:text-white">
            Kilometre taşları
          </h2>
          <p className="mt-2 text-sm leading-6 text-primary-600 dark:text-primary-200">
            Kayıtlar aşağıdaki sırayla halka açık zaman tünelinde gösterilir.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setMilestones((current) => [
              ...current,
              {
                id: `new-${Date.now()}`,
                year: "",
                title: "",
                description: "",
                english: { year: "", title: "", description: "" },
              },
            ])
          }
          disabled={milestones.length >= 12}
        >
          <Plus aria-hidden="true" />
          Kilometre taşı ekle
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {milestones.length ? (
          milestones.map((milestone, index) => (
            <article
              key={milestone.id}
              className="rounded-2xl border border-primary-100 bg-primary-50/55 p-4 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-heading text-sm font-bold text-accent-700 dark:text-accent-300">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="text-red-700 hover:border-red-200 hover:bg-red-50 hover:text-red-800 dark:text-red-300 dark:hover:bg-red-950/40"
                  onClick={() =>
                    setMilestones((current) =>
                      current.filter((item) => item.id !== milestone.id),
                    )
                  }
                  aria-label={`${milestone.title || `${index + 1}. kilometre taşı`} öğesini kaldır`}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-[12rem_1fr]">
                <div className="space-y-2">
                  <label
                    htmlFor={`milestone-year-${milestone.id}`}
                    className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-100"
                  >
                    Yıl / dönem
                  </label>
                  <Input
                    id={`milestone-year-${milestone.id}`}
                    value={milestone.year}
                    onChange={(event) =>
                      updateMilestone(
                        milestone.id,
                        "year",
                        event.target.value,
                      )
                    }
                    maxLength={40}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor={`milestone-title-${milestone.id}`}
                    className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-100"
                  >
                    Başlık
                  </label>
                  <Input
                    id={`milestone-title-${milestone.id}`}
                    value={milestone.title}
                    onChange={(event) =>
                      updateMilestone(
                        milestone.id,
                        "title",
                        event.target.value,
                      )
                    }
                    maxLength={160}
                    required
                  />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <label
                    htmlFor={`milestone-description-${milestone.id}`}
                    className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-100"
                  >
                    Açıklama
                  </label>
                  <Textarea
                    id={`milestone-description-${milestone.id}`}
                    value={milestone.description}
                    onChange={(event) =>
                      updateMilestone(
                        milestone.id,
                        "description",
                        event.target.value,
                      )
                    }
                    rows={3}
                    maxLength={1000}
                    required
                  />
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-primary-100 bg-white/70 p-4 dark:border-white/10 dark:bg-primary-950/45">
                <p className="mb-3 font-heading text-sm font-bold text-primary-900 dark:text-primary-100">İngilizce (opsiyonel)</p>
                <div className="grid gap-4 lg:grid-cols-[12rem_1fr]">
                  <Input value={milestone.english.year} onChange={(event) => updateEnglishMilestone(milestone.id, "year", event.target.value)} maxLength={40} aria-label="Yıl / dönem İngilizce" placeholder="Year / period" />
                  <Input value={milestone.english.title} onChange={(event) => updateEnglishMilestone(milestone.id, "title", event.target.value)} maxLength={160} aria-label="Başlık İngilizce" placeholder="Title" />
                  <Textarea value={milestone.english.description} onChange={(event) => updateEnglishMilestone(milestone.id, "description", event.target.value)} rows={3} maxLength={1000} className="lg:col-span-2" aria-label="Açıklama İngilizce" placeholder="Description" />
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-primary-200 px-4 py-8 text-center text-sm text-primary-600 dark:border-white/15 dark:text-primary-300">
            Zaman tünelinde kilometre taşı bulunmuyor.
          </p>
        )}
      </div>
    </section>
  );
}
