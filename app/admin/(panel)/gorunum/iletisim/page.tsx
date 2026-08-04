import { updateContactContentAction } from "@/app/admin/(panel)/gorunum/iletisim/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ClubSocialLinksAdmin } from "@/components/admin/club-social-links-admin";
import {
  ContentEditorForm,
  type ContentEditorSection,
} from "@/components/admin/content-editor-form";
import { getAdminClubSocialLinks } from "@/lib/club-social-links";
import { getAdminSiteContentMap } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function AdminContactContentPage() {
  const [values, socialLinks] = await Promise.all([
    getAdminSiteContentMap(),
    getAdminClubSocialLinks(),
  ]);
  const sections: ContentEditorSection[] = [
    {
      title: "Kampüs adresi",
      description:
        "Bu adres İletişim sayfasındaki bilgi kartında, haritada ve yol tarifi bağlantısında kullanılır.",
      fields: [
        {
          name: "contact.address.value",
          label: "Adres",
          value: values["contact.address.value"],
          kind: "textarea",
          required: true,
          maxLength: 500,
        },
      ],
    },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Görünüm Yönetimi"
        title="İletişim"
        description="İletişim sayfasındaki kampüs adresini, harita hedefini ve kulüp sosyal medya hesaplarını yönetin."
      />
      <ContentEditorForm
        action={updateContactContentAction}
        sections={sections}
        submitLabel="İletişim adresini kaydet"
      />
      <ClubSocialLinksAdmin links={socialLinks} />
    </>
  );
}
