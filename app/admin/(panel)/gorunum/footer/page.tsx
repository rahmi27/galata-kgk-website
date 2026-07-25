import { updateFooterContentAction } from "@/app/admin/(panel)/gorunum/footer/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  ContentEditorForm,
  type ContentEditorSection,
} from "@/components/admin/content-editor-form";
import { getAdminSiteContentMap } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function AdminFooterContentPage() {
  const values = await getAdminSiteContentMap();
  const sections: ContentEditorSection[] = [
    {
      title: "Footer metinleri",
      description:
        "Telif satırındaki {year} ifadesi ziyaretçiye gösterilirken otomatik olarak güncel yıla dönüşür.",
      fields: [
        {
          name: "footer.description",
          label: "Kulüp açıklaması",
          value: values["footer.description"],
          kind: "textarea",
          required: true,
        },
        {
          name: "footer.quickLinksLabel",
          label: "Hızlı linkler başlığı",
          value: values["footer.quickLinksLabel"],
          required: true,
        },
        {
          name: "footer.copyright",
          label: "Telif hakkı satırı",
          value: values["footer.copyright"],
          required: true,
          hint: "Yılın otomatik gelmesi için {year} yer tutucusunu koruyabilirsiniz.",
        },
        {
          name: "footer.institution",
          label: "Üniversite bağlantı metni",
          value: values["footer.institution"],
          required: true,
        },
        {
          name: "footer.institutionHref",
          label: "Üniversite bağlantı adresi",
          value: values["footer.institutionHref"],
          kind: "url",
          required: true,
        },
      ],
    },
    {
      title: "Sosyal medya",
      description:
        "Boş bırakılan sosyal ağlar footer’da gösterilmez. Dolu adresler yeni sekmede açılır.",
      fields: [
        {
          name: "footer.social.instagram",
          label: "Instagram URL",
          value: values["footer.social.instagram"],
          kind: "url",
        },
        {
          name: "footer.social.linkedin",
          label: "LinkedIn URL",
          value: values["footer.social.linkedin"],
          kind: "url",
        },
        {
          name: "footer.social.x",
          label: "X URL",
          value: values["footer.social.x"],
          kind: "url",
        },
      ],
    },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Görünüm Yönetimi"
        title="Footer"
        description="Alt bilgi alanındaki kulüp metinlerini, üniversite bağlantısını ve sosyal medya adreslerini yönetin."
      />
      <ContentEditorForm
        action={updateFooterContentAction}
        sections={sections}
        submitLabel="Footer’ı kaydet"
      />
    </>
  );
}
