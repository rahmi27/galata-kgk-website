import { updateAboutContentAction } from "@/app/admin/(panel)/gorunum/hakkimizda/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  ContentEditorForm,
  type ContentEditorSection,
} from "@/components/admin/content-editor-form";
import { TimelineMilestonesFields } from "@/components/admin/timeline-milestones-fields";
import {
  getAboutContentFromRows,
  getAdminSiteContentRows,
} from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function AdminAboutContentPage() {
  const rows = await getAdminSiteContentRows();
  const content = getAboutContentFromRows(rows);
  const sections: ContentEditorSection[] = [
    {
      title: "Sayfa girişi",
      fields: [
        {
          name: "about.hero.eyebrow",
          label: "Üst etiket",
          value: content.hero.eyebrow,
          required: true,
        },
        {
          name: "about.hero.title",
          label: "Ana başlık",
          value: content.hero.title,
          required: true,
        },
        {
          name: "about.hero.description",
          label: "Giriş açıklaması",
          value: content.hero.description,
          kind: "textarea",
          required: true,
        },
      ],
    },
    {
      title: "Biz Kimiz",
      description:
        "Paragrafları boş bir satırla ayırın; sitede ayrı paragraf olarak gösterilir.",
      fields: [
        {
          name: "about.introduction.eyebrow",
          label: "Bölüm üst etiketi",
          value: content.introduction.eyebrow,
          required: true,
        },
        {
          name: "about.introduction.title",
          label: "Bölüm başlığı",
          value: content.introduction.title,
          required: true,
        },
        {
          name: "about.introduction.paragraphs",
          label: "Tanıtım metni",
          value: content.introduction.paragraphs.join("\n\n"),
          kind: "textarea",
          required: true,
          maxLength: 5000,
        },
        {
          name: "about.introduction.principle.label",
          label: "Alıntı kutusu etiketi",
          value: content.introduction.principle.label,
          required: true,
        },
        {
          name: "about.introduction.principle.text",
          label: "Alıntı kutusu metni",
          value: content.introduction.principle.text,
          kind: "textarea",
          required: true,
        },
      ],
    },
    {
      title: "Vizyon",
      fields: [
        {
          name: "about.vision.eyebrow",
          label: "Üst etiket",
          value: content.visionMission.vision.eyebrow,
          required: true,
        },
        {
          name: "about.vision.title",
          label: "Başlık",
          value: content.visionMission.vision.title,
          required: true,
        },
        {
          name: "about.vision.description",
          label: "Vizyon metni",
          value: content.visionMission.vision.description,
          kind: "textarea",
          required: true,
        },
      ],
    },
    {
      title: "Misyon",
      fields: [
        {
          name: "about.mission.eyebrow",
          label: "Üst etiket",
          value: content.visionMission.mission.eyebrow,
          required: true,
        },
        {
          name: "about.mission.title",
          label: "Başlık",
          value: content.visionMission.mission.title,
          required: true,
        },
        {
          name: "about.mission.description",
          label: "Misyon metni",
          value: content.visionMission.mission.description,
          kind: "textarea",
          required: true,
        },
      ],
    },
    {
      title: "Zaman tüneli başlığı",
      fields: [
        {
          name: "about.timeline.eyebrow",
          label: "Üst etiket",
          value: content.timelineSection.eyebrow,
          required: true,
        },
        {
          name: "about.timeline.title",
          label: "Başlık",
          value: content.timelineSection.title,
          required: true,
        },
        {
          name: "about.timeline.description",
          label: "Açıklama",
          value: content.timelineSection.description,
          kind: "textarea",
          required: true,
        },
      ],
    },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Görünüm Yönetimi"
        title="Hakkımızda"
        description="Sayfa girişini, Biz Kimiz bölümünü, vizyon-misyon bloklarını ve zaman tünelini yönetin."
      />
      <ContentEditorForm
        action={updateAboutContentAction}
        sections={sections}
        submitLabel="Hakkımızda sayfasını kaydet"
      >
        <TimelineMilestonesFields
          initialMilestones={content.timelineSection.milestones}
        />
      </ContentEditorForm>
    </>
  );
}
