import Link from "next/link";
import { MapPin } from "lucide-react";
import { FaInstagram } from "react-icons/fa6";

import { ContactForm } from "@/components/contact/contact-form";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SectionHeading } from "@/components/shared/section-heading";
import contactContent from "@/content/contact.json";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: contactContent.meta.title,
  description: contactContent.meta.description,
  path: "/iletisim",
  keywords: ["Galata KGK iletişim", "İstanbul Galata Üniversitesi kulüp iletişim"],
});

const socialIcons = {
  Instagram: FaInstagram,
} as const;

export default function ContactPage() {
  const { details, hero } = contactContent;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-primary/10 bg-primary-50/65 py-20 dark:border-white/10 dark:bg-primary-900/30 sm:py-28">
          <div
            className="absolute -left-28 -top-44 size-[28rem] rounded-full border-[64px] border-primary/5 dark:border-white/[0.03]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              as="h1"
              eyebrow={hero.eyebrow}
              title={hero.title}
              description={hero.description}
            />
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid overflow-hidden rounded-[2rem] border border-primary/10 bg-card shadow-[0_32px_90px_-50px_rgba(27,42,94,0.75)] lg:grid-cols-[0.8fr_1.2fr] dark:border-white/10 dark:bg-white/[0.035]">
              <aside className="relative overflow-hidden bg-primary-900 p-8 text-white sm:p-10 lg:p-12">
                <span
                  className="absolute -bottom-20 -right-20 size-56 rounded-full border-[34px] border-accent/20"
                  aria-hidden="true"
                />
                <div className="relative">
                  <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-accent-300">
                    {details.eyebrow}
                  </p>
                  <h2 className="mt-5 font-heading text-3xl font-bold tracking-[-0.04em]">
                    {details.title}
                  </h2>
                  <p className="mt-4 leading-7 text-primary-200">
                    {details.description}
                  </p>

                  <div className="mt-10 space-y-7">
                    <Link
                      href={details.address.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex gap-4"
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-accent-300 transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                        <MapPin className="size-5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block font-heading text-xs font-bold uppercase tracking-[0.14em] text-primary-300">
                          {details.address.label}
                        </span>
                        <span className="mt-1.5 block text-sm leading-6 text-primary-100">
                          {details.address.value}
                        </span>
                      </span>
                    </Link>
                  </div>

                  <div className="mt-12 border-t border-white/10 pt-8">
                    <p className="font-heading text-xs font-bold uppercase tracking-[0.14em] text-primary-300">
                      {details.socialLabel}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {details.socials.map((social) => {
                        const Icon =
                          socialIcons[
                            social.platform as keyof typeof socialIcons
                          ] ?? FaInstagram;
                        const isExternal = social.href.startsWith("http");

                        return (
                          <Link
                            key={social.platform}
                            href={social.href}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noopener noreferrer" : undefined}
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-xs font-semibold text-primary-100 transition-colors hover:border-accent/70 hover:bg-accent"
                            aria-label={`${social.platform} hesabını${isExternal ? " yeni sekmede" : ""} aç`}
                          >
                            <Icon className="size-3.5" aria-hidden="true" />
                            {social.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </aside>

              <div className="p-8 sm:p-10 lg:p-12">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
