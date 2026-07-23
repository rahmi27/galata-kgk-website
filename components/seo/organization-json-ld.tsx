import { SITE_NAME, siteUrl } from "@/lib/site-metadata";

const organizationData = {
  "@context": "https://schema.org",
  "@type": ["EducationalOrganization", "Organization"],
  name: SITE_NAME,
  alternateName: "Galata KGK",
  url: siteUrl.toString(),
  logo: new URL("/brand/galata-kgk-logo.png", siteUrl).toString(),
  slogan: "Galata'da Okunur, Gelecek Burada Kurulur",
  description:
    "İstanbul Galata Üniversitesi öğrencilerini kariyer ve girişimcilik odağında bir araya getiren disiplinler arası öğrenci kulübü.",
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "İstanbul Galata Üniversitesi",
  },
};

export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationData).replace(/</g, "\\u003c"),
      }}
    />
  );
}
