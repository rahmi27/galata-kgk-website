"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TopicField = {
  id: string;
  value: string;
  valueEn: string;
};

export function SpotlightTopicsFields({
  initialTopics,
  initialTopicsEn = [],
}: {
  initialTopics: string[];
  initialTopicsEn?: string[];
}) {
  const [topics, setTopics] = useState<TopicField[]>(
    initialTopics.map((value, index) => ({
      id: `initial-${index}`,
      value,
      valueEn: initialTopicsEn[index] ?? "",
    })),
  );

  return (
    <section className="rounded-[1.5rem] border border-primary-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-primary-950/65 sm:p-7">
      <input
        type="hidden"
        name="spotlightTopics"
        value={JSON.stringify(topics.map((topic) => topic.value))}
      />
      <input type="hidden" name="spotlightTopicsEn" value={JSON.stringify(topics.map((topic) => topic.valueEn))} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-primary-950 dark:text-white">
            Odak etiketleri
          </h2>
          <p className="mt-2 text-sm leading-6 text-primary-600 dark:text-primary-200">
            Kartın altındaki kısa etiketleri ekleyin, düzenleyin veya kaldırın.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setTopics((current) => [
              ...current,
              { id: `new-${Date.now()}`, value: "", valueEn: "" },
            ])
          }
          disabled={topics.length >= 12}
        >
          <Plus aria-hidden="true" />
          Yeni etiket
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        {topics.length ? (
          topics.map((topic, index) => (
            <div
              key={topic.id}
              className="grid grid-cols-[1fr_1fr_auto] items-center gap-3"
            >
              <Input
                value={topic.value}
                onChange={(event) =>
                  setTopics((current) =>
                    current.map((item) =>
                      item.id === topic.id
                        ? { ...item, value: event.target.value }
                        : item,
                    ),
                  )
                }
                maxLength={80}
                aria-label={`${index + 1}. odak etiketi`}
                required
              />
              <Input
                value={topic.valueEn}
                onChange={(event) => setTopics((current) => current.map((item) => item.id === topic.id ? { ...item, valueEn: event.target.value } : item))}
                maxLength={80}
                aria-label={`${index + 1}. odak etiketi İngilizce (opsiyonel)`}
                placeholder="English (optional)"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="text-red-700 hover:border-red-200 hover:bg-red-50 hover:text-red-800 dark:text-red-300 dark:hover:bg-red-950/40"
                onClick={() =>
                  setTopics((current) =>
                    current.filter((item) => item.id !== topic.id),
                  )
                }
                aria-label={`${topic.value || `${index + 1}. etiket`} öğesini kaldır`}
              >
                <Trash2 aria-hidden="true" />
              </Button>
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-primary-200 px-4 py-8 text-center text-sm text-primary-600 dark:border-white/15 dark:text-primary-300">
            Odak etiketi yok. İsterseniz bu alanı boş bırakabilirsiniz.
          </p>
        )}
      </div>
    </section>
  );
}
