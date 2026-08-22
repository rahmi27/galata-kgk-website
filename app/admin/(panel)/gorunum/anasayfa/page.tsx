import { updateHomeHeroContentAction } from "@/app/admin/(panel)/gorunum/anasayfa/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  ContentEditorForm,
  type ContentEditorSection,
} from "@/components/admin/content-editor-form";
import { SpotlightTopicsFields } from "@/components/admin/spotlight-topics-fields";
import {
  getAdminSiteContentRows,
  getHomeHeroContentFromRows,
  getRawEnglishHomeTopics,
  getRawEnglishSiteContentMap,
} from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function AdminHomeContentPage() {
  const rows = await getAdminSiteContentRows();
  const hero = getHomeHeroContentFromRows(rows);
  const englishValues = getRawEnglishSiteContentMap(rows);
  const sections: ContentEditorSection[] = [
    {
      title: "Hero metinleri",
      fields: [
        {
          name: "home.hero.eyebrow",
          label: "Rozet metni",
          value: hero.eyebrow,
          required: true,
        },
        {
          name: "home.hero.title",
          label: "Ana başlık",
          value: hero.title,
          required: true,
        },
        {
          name: "home.hero.emphasis",
          label: "Turuncu çizgiyle vurgulanan başlık bölümü",
          value: hero.emphasis,
          required: true,
        },
        {
          name: "home.hero.description",
          label: "Açıklama",
          value: hero.description,
          kind: "textarea",
          required: true,
        },
        {
          name: "home.hero.primaryCta.label",
          label: "Birincil buton metni",
          value: hero.primaryCta.label,
          required: true,
        },
        {
          name: "home.hero.secondaryCta.label",
          label: "İkincil buton metni",
          value: hero.secondaryCta.label,
          required: true,
        },
      ],
    },
    {
      title: "Bu dönem odağımız kartı",
      fields: [
        {
          name: "home.hero.spotlight.calendarCta.label",
          label: "Takvim ikonu ipucu",
          value: hero.spotlight.calendarCta.label,
          required: true,
        },
        {
          name: "home.hero.spotlight.eyebrow",
          label: "Kart üst etiketi",
          value: hero.spotlight.eyebrow,
          required: true,
        },
        {
          name: "home.hero.spotlight.title",
          label: "Kart başlığı",
          value: hero.spotlight.title,
          required: true,
        },
        {
          name: "home.hero.spotlight.description",
          label: "Kart açıklaması",
          value: hero.spotlight.description,
          kind: "textarea",
          required: true,
        },
      ],
    },
  ];
  const localizedSections = sections.map((section) => ({
    ...section,
    fields: section.fields.map((field) => ({ ...field, valueEn: englishValues[field.name] ?? "" })),
  }));

  return (
    <>
      <AdminPageHeader
        eyebrow="Görünüm Yönetimi"
        title="Anasayfa Hero"
        description="Anasayfanın ilk ekranındaki ana mesajı, çağrı butonlarını ve odak kartını yönetin."
      />
      <ContentEditorForm
        action={updateHomeHeroContentAction}
        sections={localizedSections}
        submitLabel="Hero’yu kaydet"
      >
        <SpotlightTopicsFields initialTopics={hero.spotlight.topics} initialTopicsEn={getRawEnglishHomeTopics(rows)} />
      </ContentEditorForm>
    </>
  );
}
