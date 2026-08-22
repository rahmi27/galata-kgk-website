import { updateHeaderContentAction } from "@/app/admin/(panel)/gorunum/header/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { HeaderContentForm } from "@/components/admin/header-content-form";
import {
  getAdminSiteContentMap,
  getAdminSiteContentRows,
  getRawEnglishSiteContentMap,
  navigationRoutes,
} from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function AdminHeaderContentPage() {
  const rows = await getAdminSiteContentRows();
  const values = await getAdminSiteContentMap();
  const englishValues = getRawEnglishSiteContentMap(rows);
  const navigation = navigationRoutes
    .map((item, fallbackIndex) => ({
      ...item,
      label: values[`header.nav.${item.id}.label`],
      labelEn: englishValues[`header.nav.${item.id}.label`] ?? "",
      order:
        Number.parseInt(values[`header.nav.${item.id}.order`], 10) ||
        fallbackIndex + 1,
    }))
    .sort((first, second) => first.order - second.order);

  return (
    <>
      <AdminPageHeader
        eyebrow="Görünüm Yönetimi"
        title="Header"
        description="Kulüp adını, mevcut menü öğelerinin metnini ve sırasını, ayrıca katılım çağrısını yönetin."
      />
      <HeaderContentForm
        action={updateHeaderContentAction}
        brandName={values["header.brand.name"]}
        brandNameEn={englishValues["header.brand.name"] ?? ""}
        ctaLabel={values["header.cta.label"]}
        ctaLabelEn={englishValues["header.cta.label"] ?? ""}
        navigation={navigation}
      />
    </>
  );
}
