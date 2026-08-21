import { SITE_NAME, SITE_NAME_EN, siteUrl } from "@/lib/site-metadata";

export function OrganizationJsonLd({ locale, slogan, description }: { locale: string; slogan: string; description: string }) {
  const isEnglish = locale === "en";
  const organizationData = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "Organization"],
    inLanguage: isEnglish ? "en" : "tr",
    name: isEnglish ? SITE_NAME_EN : SITE_NAME,
    alternateName: "Galata KGK",
    url: new URL(isEnglish ? "/en" : "/", siteUrl).toString(),
    logo: new URL("/brand/galata-kgk-logo.png", siteUrl).toString(),
    slogan,
    description,
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: isEnglish ? "Istanbul Galata University" : "İstanbul Galata Üniversitesi",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationData).replace(/</g, "\\u003c"),
      }}
    />
  );
}
